import './main.scss';
import { createApp } from 'vue';

import ElementPlus from 'element-plus';
import 'element-plus/theme-chalk/src/dark/var.scss';
import './theme.scss';
import App from './App.vue';

import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from './components/LoginPage.vue';
import RegisterPage from './components/RegisterPage.vue';
import DashboardPage from './components/PetitionerDashboardPage.vue';

const routes = [
	{
		path: '/',
		redirect: '/dashboard',
	},
	{
		path: '/dashboard',
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
		if (response.data && response.data.accessToken) {
			cookies.set('authToken', response.data.accessToken, { path: '/', expires: '15m' });
		}
		return response;
	},
	(err) => {
		if (err.response && err.response.status === 401) {
			axios.post('/api/auth/refresh-token', {}, { withCredentials: true })
			.then((refreshResponse) => {
				let newAccessToken = refreshResponse.data.accessToken;
				err.config.headers['Authorization'] = `Bearer ${newAccessToken}`;
				return axios(err.config);
			})
			.catch((refreshError) => {
				console.error('Token refresh failed:', refreshError);
				window.location.href = '/login';
				return Promise.reject(refreshError);
			});
		}
		return Promise.reject(err);
	}
);

router.beforeEach((to, from, next) => {
	let isAuthenticated = !!cookies.get('authToken');

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
app.mount('#app');