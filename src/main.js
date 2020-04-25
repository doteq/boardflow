import { firestorePlugin } from 'vuefire';
import Vue from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import firebasePlugin from './plugins/firebase';
import store from './store';
import router from './router';

Vue.config.productionTip = false;

Vue.use(firebasePlugin);
Vue.use(firestorePlugin);

new Vue({
  vuetify,
  store,
  router,
  created () {
    const commitSHA = process.env.VUE_APP_GITHUB_SHA;
    console.log(`GitHub commit: ${commitSHA || 'no commit info'}`);
  },
  render: (h) => h(App),
}).$mount('#app');
