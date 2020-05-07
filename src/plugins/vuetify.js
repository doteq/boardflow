import Vue from 'vue';
import Vuetify, { VSnackbar, VBtn, VIcon } from 'vuetify/lib';
import VuetifyToast from 'vuetify-toast-snackbar';
import pl from 'vuetify/es5/locale/pl';
import en from 'vuetify/es5/locale/en';
import { Ripple } from 'vuetify/lib/directives';

Vue.use(Vuetify, {
  components: {
    VSnackbar,
    VBtn,
    VIcon,
  },
  directives: {
    Ripple,
  },
});

Vue.use(VuetifyToast, {
  queueable: true,
  color: 'accent',
});

export default (i18n) => new Vuetify({
  theme: {
    dark: true,
    themes: {
      options: {
        customProperties: true,
      },
      light: {
        primary: '#92de8b',
        secondary: '#0ab68b',
        accent: '#028174',
        lesson: '#42A5F5',
        homework: '#FFEE58',
        test: '#FF7043',
      },
      dark: {
        primary: '#92de8b',
        secondary: '#0ab68b',
        accent: '#028174',
        lesson: '#42A5F5',
        homework: '#FFEE58',
        test: '#FF7043',
      },
    },
  },
  lang: {
    locales: [en, pl],
    current: i18n.locale,
  },
});
