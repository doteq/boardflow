<template>
  <v-app>
    <v-content>
      <router-view />
    </v-content>
    <cookies-toast />
    <development-info v-if="developmentMode" />
  </v-app>
</template>

<script>
  import CookiesToast from './components/CookiesToast.vue';
  import DevelopmentInfo from './components/DevelopmentInfo.vue';

  export default {
    name: 'App',
    components: {
      CookiesToast,
      DevelopmentInfo,
    },
    computed: {
      developmentMode () {
        return process.env.NODE_ENV === 'development';
      },
    },
  };
</script>

<style lang="scss">
  .break-word {
    word-break: break-word !important;
  }
</style>
