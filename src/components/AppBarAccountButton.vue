<template>
  <v-menu
    :close-on-content-click="false"
  >
    <template v-slot:activator="{ on: menu }">
      <v-tooltip bottom>
        <template v-slot:activator="{ on: tooltip }">
          <v-btn
            icon
            v-on="{ ...tooltip, ...menu }"
          >
            <v-avatar
              class="elevation-4"
              :size="$vuetify.breakpoint.smAndDown ? 40 : 48"
            >
              <v-img :src="$store.state.userAuth.photoURL" />
            </v-avatar>
          </v-btn>
        </template>
        <span>
          {{
            ($store.state.userData && $store.state.userData.name)
              ? $store.state.userData.name
              : $store.state.userAuth.displayName
          }}
        </span>
      </v-tooltip>
    </template>
    <v-list>
      <v-list-item
        @click="changeDisplayNameDialogVisible = true"
      >
        <v-list-item-icon>
          <v-icon>mdi-account-edit</v-icon>
        </v-list-item-icon>
        <v-list-item-title>Zmień wyświetlaną nazwę</v-list-item-title>
      </v-list-item>
      <v-list-item
        v-if="!addedProviders.includes('google.com')"
        :disabled="googleLoading"
        @click="linkGoogle"
      >
        <v-list-item-icon>
          <v-progress-circular
            v-if="googleLoading"
            indeterminate
            :size="24"
          />
          <v-icon v-else>
            mdi-google
          </v-icon>
        </v-list-item-icon>

        <v-list-item-title>
          Połącz konto Google
        </v-list-item-title>
      </v-list-item>
      <v-list-item
        v-if="!addedProviders.includes('facebook.com')"
        :disabled="facebookLoading"
        @click="linkFacebook"
      >
        <v-list-item-icon>
          <v-progress-circular
            v-if="facebookLoading"
            indeterminate
            :size="24"
          />
          <v-icon v-else>
            mdi-facebook
          </v-icon>
        </v-list-item-icon>

        <v-list-item-title>
          Połącz konto Facebook
        </v-list-item-title>
      </v-list-item>
      <v-list-item
        v-if="addedProviders.includes('facebook.com')"
        :disabled="addedProviders.length === 1"
        @click="facebookUnlinkDialogVisible = true"
      >
        <v-list-item-icon>
          <v-icon>
            mdi-facebook
          </v-icon>
        </v-list-item-icon>

        <v-list-item-title>
          Odłącz konto Facebook
        </v-list-item-title>
      </v-list-item>
      <v-list-item @click="signOut">
        <v-list-item-icon>
          <v-icon>mdi-logout-variant</v-icon>
        </v-list-item-icon>
        <v-list-item-title>Wyloguj się</v-list-item-title>
      </v-list-item>
    </v-list>
    <change-display-name-dialog v-model="changeDisplayNameDialogVisible" />
    <facebook-unlink-dialog v-model="facebookUnlinkDialogVisible" />
  </v-menu>
</template>

<script>
  import ChangeDisplayNameDialog from './ChangeDisplayNameDialog.vue';
  import FacebookUnlinkDialog from './FacebookUnlinkDialog.vue';

  export default {
    components: {
      ChangeDisplayNameDialog,
      FacebookUnlinkDialog,
    },
    data: () => ({
      changeDisplayNameDialogVisible: false,
      facebookUnlinkDialogVisible: false,
      googleLoading: false,
      facebookLoading: false,
    }),
    computed: {
      addedProviders () {
        if (!this.$store.state.userAuth) return [];
        return this.$store.state.userAuth.providerData.map((provider) => provider.providerId);
      },
    },
    methods: {
      async linkGoogle () {
        this.googleLoading = true;

        try {
          await this.$auth.linkGoogle();
        } catch (error) {
          this.$toast.error('Nie udało się połączyć konta');
          console.error(error);
        }

        this.googleLoading = false;
      },
      async linkFacebook () {
        this.facebookLoading = true;

        try {
          await this.$auth.linkFacebook();
        } catch (error) {
          this.$toast.error('Nie udało się połączyć konta');
          console.error(error);
        }

        this.facebookLoading = false;
      },
      async signOut () {
        await this.$auth.signOut();
        this.$toast('Wylogowano');
      },
    },
  };
</script>
