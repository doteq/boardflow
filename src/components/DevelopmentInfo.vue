<template>
  <v-card class="development-info">
    <v-alert
      icon="mdi-code-tags"
      class="ma-0"
      dense
      color="secondary"
      text
      border="left"
    >
      {{ $t('development-mode') }}
    </v-alert>
  </v-card>
</template>

<style scoped>
  .development-info {
    position: fixed;
    bottom: 8px;
    left: 8px;
  }
</style>
