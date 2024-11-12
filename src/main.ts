import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import PrimeVue from 'primevue/config';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import './plugins/fontAwesome';

const app = createApp(App);
app.use(PrimeVue, {
  theme: {
    preset: 'unstyled',
    options: {
      cssLayer: {
        name: 'primevue',
        order: 'tailwind-base, primevue, tailwind-utilities'
      }
    }
  }
});
app.component('fa', FontAwesomeIcon);
app.mount('#app');
