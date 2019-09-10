import Vue from 'vue';
import App from './App.vue';
import Aw from '../src/index';

Vue.use(Aw);

new Vue({
  render: h => h(App),
}).$mount('#app');
