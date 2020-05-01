<template>
  <v-container class="d-flex align-center justify-center flex-column fill-height">
    <v-app-bar
      app
      color="transparent"
      flat
    >
      <v-btn
        icon
        to="/"
        exact
      >
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-spacer />
      <app-bar-locale-picker />
    </v-app-bar>
    <h1
      class="display-4 primary--text"
      v-text="$t('route-not-found.code')"
    />
    <h2
      class="mt-8 text-center"
      :class="{
        'display-1': $vuetify.breakpoint.xsOnly,
        'display-2': $vuetify.breakpoint.smOnly,
        'display-3': $vuetify.breakpoint.mdAndUp,
      }"
      v-text="$t('route-not-found.message')"
    />
    <v-btn
      large
      class="mt-12"
      color="primary black--text"
      to="/"
      exact
    >
      <v-icon left>
        mdi-arrow-left
      </v-icon>
      {{ $t('route-not-found.go-back') }}
    </v-btn>
  </v-container>
</template>
<script>
  import AppBarLocalePicker from '../components/AppBarLocalePicker.vue';

  export default {
    components: { AppBarLocalePicker },
  };
</script>
