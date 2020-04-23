<template>
  <v-app-bar
    app
  >
    <v-btn
      v-if="backTo"
      icon
      :to="backTo"
      exact
    >
      <v-icon>mdi-arrow-left</v-icon>
    </v-btn>

    <div
      v-if="showLogo"
    >
      <v-img
        alt="Logo"
        class="shrink mr-2"
        contain
        src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
        :width="$vuetify.breakpoint.smAndDown ? 24 : 32"
      />
    </div>

    <v-toolbar-title v-if="titleLoading">
      <v-skeleton-loader
        type="heading"
        :width="240"
      />
    </v-toolbar-title>

    <v-toolbar-title v-else>
      <slot />
    </v-toolbar-title>

    <v-spacer />

    <slot name="buttons" />

    <app-bar-account-button v-if="signedIn" />
    <v-btn
      v-else
      outlined
      @click="showSignInSheet()"
    >
      <v-icon left>
        mdi-account
      </v-icon>
      Zaloguj się
    </v-btn>

    <template
      v-if="$slots.extension !== undefined"
      v-slot:extension
    >
      <slot name="extension" />
    </template>

    <sign-in-sheet ref="signInSheet" />
  </v-app-bar>
</template>

<script>
  import AppBarAccountButton from './AppBarAccountButton.vue';
  import SignInSheet from './SignInSheet.vue';

  export default {
    components: {
      AppBarAccountButton,
      SignInSheet,
    },
    props: {
      backTo: {
        required: false,
        default: null,
        type: String,
      },
      titleLoading: {
        type: Boolean,
        required: false,
        default: false,
      },
      showLogo: {
        type: Boolean,
        required: false,
        default: false,
      },
    },
    computed: {
      signedIn () {
        return !!this.$store.state.userAuth;
      },
    },
    methods: {
      showSignInSheet () {
        this.$refs.signInSheet.show();
      },
    },
  };
</script>
