<template>
  <v-app>
    <app-bar />

    <v-content>
      <router-view />
    </v-content>
  </v-app>
</template>

<script>
  import AppBar from './components/AppBar.vue';

  export default {
    name: 'App',
    components: {
      AppBar,
    },
    data: () => ({
    //
    }),
  };
</script>
