<template>
  <v-app>
    <v-content>
      <router-view />
    </v-content>
    <cookies-toast />
  </v-app>
</template>

<script>
  import CookiesToast from './components/CookiesToast.vue';

  export default {
    name: 'App',
    components: {
      CookiesToast,
    },
    computed: {
      routeTitle () {
        return this.$t('routes.route-not-found');
      },
    },
    watch: {
      routeTitle: {
        handler (value) {
          document.title = value;
        },
        immediate: true,
      },
    },
  };
</script>

<style lang="scss">
  .break-word {
    word-break: break-word !important;
  }
</style>
