import Vue from 'vue';
import VueI18n from 'vue-i18n';

Vue.use(VueI18n);

function loadLocaleMessages () {
  const locales = require.context('./locales', true, /[A-Za-z0-9-_,\s]+\.json$/i);
  const messages = {};
  locales.keys().forEach((key) => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i);
    if (matched && matched.length > 1) {
      const locale = matched[1];
      messages[locale] = locales(key);
    }
  });
  return messages;
}

const localeMessages = loadLocaleMessages();

let locale;
if (window.localStorage.locale) {
  locale = window.localStorage.locale;
} else {
  const userLocale = window.navigator.language.split('-')[0];
  if (localeMessages[userLocale] !== undefined) {
    locale = userLocale;
  } else {
    locale = 'en';
  }

  window.localStorage.locale = locale;
}

export default new VueI18n({
  locale,
  fallbackLocale: 'en',
  messages: localeMessages,
});
