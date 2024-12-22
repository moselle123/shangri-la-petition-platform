import './main.scss';
import { createApp } from 'vue';

import ElementPlus from 'element-plus';
import 'element-plus/theme-chalk/src/dark/var.scss';
import './theme.scss';
import App from './App.vue';

import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from './components/LoginPage.vue';
import RegisterPage from './components/RegisterPage.vue';
import DashboardPage from './components/DashboardPage.vue';
import CreatePetition from './components/CreatePetition.vue';
import PetitionInfo from './components/PetitionInfo.vue';
import SetThreshold from './components/SetThreshold.vue';
import CommitteeCharts from './components/CommitteeCharts.vue';

const routes = [
	{
		path: '/',
		redirect: '/dashboard/',
	},
	{
		path: '/dashboard',
		name: 'Dashboard',
		component: DashboardPage,
		meta: { requiresAuth: true },
	},
	{
		path: '/login',
		name: 'Login',
		component: LoginPage,
		props: true,
	},
	{
		path: '/register',
		name: 'Register',
		component: RegisterPage,
		props: true,
	},
];

const router = createRouter({
	history: createWebHistory(),
	routes: routes,
});

import axios from 'axios';
window.axios = axios;
import { useCookies } from 'vue3-cookies';
let {cookies} = useCookies();

let isRefreshing = false;
let failedQueue = [];

function processQueue(error, token = null) {
	failedQueue.forEach((promise) => {
		if (error) {
			promise.reject(error);
		} else {
			promise.resolve(token);
		}
	});
	failedQueue = [];
};

axios.interceptors.request.use(
	(config) => {
		let token = cookies.get('authToken');
		if (token) {
			config.headers['Authorization'] = `Bearer ${token}`;
		}
		return config;
	},
	(error) => Promise.reject(error)
);

axios.interceptors.response.use(
	(response) => {
		if (response.data === 'Logged out successfully' && response.status === 200) {
			cookies.remove('authToken');
			router.push('/login');
		}
		if (response.data && response.data.accessToken) {
			cookies.set('authToken', response.data.accessToken, { path: '/', expires: '15m' });
		}
		return response;
	},
	(err) => {
		if (err.response && (err.response.status === 401 || err.response.status === 403)) {
			if (err.config && err.config.url === 'http://localhost:3000/slpp/auth/login') {
				console.debug('Login request detected, skipping refresh-token logic');
				return Promise.reject(err);
			}

			let originalRequest = err.config;
			if (originalRequest._retry) {
				return Promise.reject(err);
			}

			originalRequest._retry = true;
			if (isRefreshing) {
				return new Promise((resolve, reject) => {
				    	failedQueue.push({resolve, reject});
				})
				.then((token) => {
					config.headers['Authorization'] = `Bearer ${token}`;
					return axios(config);
				})
				.catch(error => Promise.reject(error));
			}

			isRefreshing = true;
			console.error('Token expired attempting to refresh token.')
			return axios.post('http://localhost:3000/slpp/auth/refresh-token', {}, { withCredentials: true })
			.then((refreshResponse) => {
				console.debug('Token successfully refreshed.')
				let newAccessToken = refreshResponse.data.accessToken;
				cookies.set('authToken', newAccessToken, { path: '/', expires: '15m' });
				processQueue(null, newAccessToken);
				err.config.headers['Authorization'] = `Bearer ${newAccessToken}`;
				return axios(originalRequest);
			})
			.catch((refreshError) => {
				console.error('Token refresh failed:', refreshError);
				cookies.remove('authToken');
				router.push('/login');
				processQueue(refreshError, null);
				return Promise.reject(refreshError);
			})
			.finally(() => {
				isRefreshing = false;
			});
		}
		return Promise.reject(err);
	}
);

router.beforeEach((to, from, next) => {
	let token = cookies.get('authToken');
	let isAuthenticated = !!token;

	if (to.meta.requiresAuth && !isAuthenticated) {
	  	next('/login');
	} else if (to.path === '/login' && isAuthenticated) {
		next('/dashboard');
	} else {
	  	next();
	}
});

import { Html5Qrcode } from 'html5-qrcode';
window.Html5Qrcode = Html5Qrcode;

import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
window.Chart = Chart;

import WordCloud from 'wordcloud';
window.WordCloud = WordCloud;

const app = createApp(App);
app.use(router);
app.use(ElementPlus);
app.component('create-petition', CreatePetition);
app.component('petition-info', PetitionInfo);
app.component('set-threshold', SetThreshold);
app.component('committee-charts', CommitteeCharts);
app.mount('#app');