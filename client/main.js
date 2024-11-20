import './main.scss';
import { createApp } from 'vue';

import axios from 'axios';
window.axios = axios;

import ElementPlus from 'element-plus';
import 'element-plus/theme-chalk/src/dark/var.scss';
import './theme.scss';
import App from './App.vue';

import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from './components/LoginPage.vue';
import RegisterPage from './components/RegisterPage.vue';
import DashboardPage from './components/DashboardPage.vue';

const routes = [
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
	{
		path: '/',
		name: 'Dashboard',
		component: DashboardPage,
		props: true,
	},
];

const router = createRouter({
	history: createWebHistory(),
	routes: routes,
});

const app = createApp(App);
app.use(router);
app.use(ElementPlus);
app.mount('#app');