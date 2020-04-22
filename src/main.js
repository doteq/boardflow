import Vue from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import firebasePlugin from './plugins/firebase';
import store from './store';
import router from './router';

Vue.config.productionTip = false;

Vue.use(firebasePlugin);

new Vue({
  vuetify,
  store,
  router,
  render: (h) => h(App),
}).$mount('#app');
