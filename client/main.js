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
			console.error('Token expired attempting to refresh token.')
			return axios.post('http://localhost:3000/slpp/auth/refresh-token', {}, { withCredentials: true })
			.then((refreshResponse) => {
				let newAccessToken = refreshResponse.data.accessToken;
				err.config.headers['Authorization'] = `Bearer ${newAccessToken}`;
				return axios(err.config);
			})
			.catch((refreshError) => {
				console.error('Token refresh failed:', refreshError);
				router.push('/login');
				return Promise.reject(refreshError);
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

const app = createApp(App);
app.use(router);
app.use(ElementPlus);
app.component('create-petition', CreatePetition);
app.component('petition-info', PetitionInfo);
app.mount('#app');