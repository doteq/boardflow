<template>
  <v-app-bar
    app
  >
    <div class="d-flex align-center">
      <v-img
        alt="Vuetify Logo"
        class="shrink mr-2"
        contain
        src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
        transition="scale-transition"
        width="40"
      />

      <v-img
        alt="Vuetify Name"
        class="shrink mt-1 hidden-sm-and-down"
        contain
        min-width="100"
        src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
        width="100"
      />
    </div>

    <v-spacer />

    <v-btn
      v-if="$vuetify.breakpoint.smOnly"
      text
      class="mr-2"
    >
      <v-icon left>
        mdi-cog
      </v-icon>
      Ustawienia tablicy
    </v-btn>

    <v-tooltip v-if="$vuetify.breakpoint.xsOnly">
      <template v-slot:activator="{ on }">
        <v-btn
          icon
          class="mr-2"
          v-on="on"
        >
          <v-icon>mdi-cog</v-icon>
        </v-btn>
      </template>
      <span>Ustawienia tablicy</span>
    </v-tooltip>

    <app-bar-account-button v-if="signedIn" />
    <v-btn
      v-else
      outlined
      @click="showLoginSheet = true"
    >
      <v-icon left>
        mdi-account
      </v-icon>
      Zaloguj się
    </v-btn>
    <v-bottom-sheet
      v-model="showLoginSheet"
      :max-width="400"
      :persistent="loginLoading"
    >
      <div
        v-if="loginLoading"
        class="pa-12 d-flex align-center flex-column"
      >
        <v-progress-circular
          indeterminate
          color="primary"
          :size="32"
        />
      </div>
      <v-list v-else>
        <v-subheader>
          Zaloguj się przez...
        </v-subheader>
        <v-list-item @click="signInWithGoogle">
          <v-list-item-icon>
            <v-icon>mdi-google</v-icon>
          </v-list-item-icon>

          <v-list-item-title>
            Google
          </v-list-item-title>
        </v-list-item>
        <v-list-item @click="signInWithFacebook">
          <v-list-item-icon>
            <v-icon>mdi-facebook</v-icon>
          </v-list-item-icon>

          <v-list-item-title>
            Facebook
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-bottom-sheet>
  </v-app-bar>
</template>

<script>
  import AppBarAccountButton from './AppBarAccountButton.vue';

  export default {
    components: {
      AppBarAccountButton,
    },
    data: () => ({
      showLoginSheet: false,
      loginLoading: false,
    }),
    computed: {
      signedIn () {
        return !!this.$store.state.userAuth;
      },
    },
    watch: {
      signedIn (value) {
        if (!this.loginLoading && this.showLoginSheet) {
          this.showLoginSheet = false;
        }
      },
    },
    methods: {
      async signInWithGoogle () {
        try {
          this.loginLoading = true;
          await this.$auth.signInWithGoogle();
        } catch (error) {
          console.error(error);
          this.showError(error);
        }
        this.loginLoading = false;
        this.showLoginSheet = false;
      },
      async signInWithFacebook () {
        try {
          this.loginLoading = true;
          await this.$auth.signInWithFacebook();
        } catch (error) {
          console.error(error);
          this.showError(error);
        }
        this.loginLoading = false;
        this.showLoginSheet = false;
      },
      showError (error) {
        if (error.code === 'auth/popup-closed-by-user') this.$toast.error('Logowanie zostało przerwane');
        else if (error.code === 'auth/account-exists-with-different-credential') this.$toast.error('Istnieje już konto z tym samym adresem email, ale innym dostawcą');
        else this.$toast.error('Nie udało się zalogować');
      },
    },
  };
</script>
