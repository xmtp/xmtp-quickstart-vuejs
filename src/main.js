import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

import { Buffer } from 'buffer';
window.Buffer = window.Buffer || Buffer;

createApp(App).mount('#app')
