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
        src="../assets/logo.svg"
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

    <app-bar-locale-picker
      :class="{
        'mr-2': $vuetify.breakpoint.smAndUp,
      }"
    />

    <div>
      <v-progress-circular
        v-if="!$store.state.userAuthLoaded"
        :size="32"
        :width="3"
        indeterminate
        class="mx-2"
      />
      <app-bar-account-button v-else-if="signedIn" />
      <v-btn
        v-else
        outlined
        @click="showSignInSheet()"
      >
        <v-icon left>
          mdi-account
        </v-icon>
        {{ $t('sign-in') }}
      </v-btn>
    </div>

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
  import AppBarLocalePicker from './AppBarLocalePicker.vue';
  import SignInSheet from './SignInSheet.vue';

  export default {
    components: {
      AppBarAccountButton,
      AppBarLocalePicker,
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
