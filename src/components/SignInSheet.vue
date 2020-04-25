<template>
  <v-bottom-sheet
    v-model="visible"
    :max-width="400"
    :persistent="loading"
  >
    <v-card
      v-if="loading"
      class="pa-12 d-flex align-center flex-column"
    >
      <v-progress-circular
        indeterminate
        color="primary"
        :size="64"
      />
    </v-card>
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
</template>

<script>
  export default {
    data: () => ({
      visible: false,
      loading: false,
    }),
    computed: {
      signedIn () {
        return !!this.$store.state.userAuth;
      },
    },
    watch: {
      signedIn (value) {
        if (!this.loginLoading && this.visible && value) {
          this.visible = false;
        }
      },
    },
    methods: {
      show () {
        if (this.signedIn) return;
        this.visible = true;
      },
      async signInWithGoogle () {
        try {
          this.loading = true;
          await this.$auth.signInWithGoogle();
        } catch (error) {
          console.error(error);
          this.showError(error);
        }
        this.loading = false;
        this.visible = false;
      },
      async signInWithFacebook () {
        try {
          this.loading = true;
          await this.$auth.signInWithFacebook();
        } catch (error) {
          console.error(error);
          this.showError(error);
        }
        this.loading = false;
        this.visible = false;
      },
      showError (error) {
        if (error.code === 'auth/popup-closed-by-user') this.$toast.error('Logowanie zostało przerwane');
        else if (error.code === 'auth/account-exists-with-different-credential') this.$toast.error('Istnieje już konto z tym samym adresem email, ale innym dostawcą');
        else this.$toast.error('Nie udało się zalogować');
      },
    },
  };
</script>
