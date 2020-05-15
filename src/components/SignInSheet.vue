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
    <v-card v-else>
      <v-list>
        <v-subheader v-t="'sign-in-sheet.title'" />
        <v-list-item @click="signInWithGoogle">
          <v-list-item-icon>
            <v-icon>mdi-google</v-icon>
          </v-list-item-icon>

          <v-list-item-title v-t="'google'" />
        </v-list-item>
        <v-list-item @click="signInWithFacebook">
          <v-list-item-icon>
            <v-icon>mdi-facebook</v-icon>
          </v-list-item-icon>

          <v-list-item-title v-t="'facebook'" />
        </v-list-item>
      </v-list>
      <v-divider />
      <v-card-text class="text-center py-4">
        <i18n path="sign-in-sheet.privacy-policy">
          <template v-slot:privacy-policy-link>
            <a
              href="/privacy-policy.pdf"
              target="_blank"
              v-text="$t('sign-in-sheet.privacy-policy-name')"
            />
          </template>
        </i18n>
        <br>
        {{ $t('sign-in-sheet.required-age') }}
      </v-card-text>
    </v-card>
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
          await this.$auth.signInWithGoogle(true);
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
          await this.$auth.signInWithFacebook(true);
        } catch (error) {
          console.error(error);
          this.showError(error);
        }
        this.loading = false;
        this.visible = false;
      },
      showError (error) {
        if (error.code === 'auth/popup-closed-by-user') this.$toast.error(this.$t('toasts.sign-in.popup-closed-by-user'));
        else if (error.code === 'auth/account-exists-with-different-credential') this.$toast.error(this.$t('toasts.sign-in.account-exists-with-different-credential'));
        else this.$toast.error(this.$t('toasts.sign-in.other'));
      },
    },
  };
</script>
