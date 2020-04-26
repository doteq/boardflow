<template>
  <v-app>
    <v-content>
      <router-view />
    </v-content>
  </v-app>
</template>

<script>
  export default {
    name: 'App',
  };
</script>

<style lang="scss">
  .break-word {
    word-break: break-word !important;
  }
</style>
