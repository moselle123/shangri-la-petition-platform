import './main.scss';
import { createApp } from 'vue';

import axios from 'axios';
window.axios = axios;

import ElementPlus from 'element-plus';
import 'element-plus/theme-chalk/src/dark/var.scss';
import './theme.scss';
import App from './App.vue';


const app = createApp(App);
app.use(ElementPlus);
app.mount('#app');