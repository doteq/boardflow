<template>
  <v-container class="board-settings-container">
    <app-bar :back-to="`/board/${$route.params.boardId}`">
      Ustawienia tablicy
    </app-bar>
    <v-tabs :vertical="$vuetify.breakpoint.mdAndUp">
      <v-tab>
        <v-icon left>
          mdi-information
        </v-icon>
        Ogólne
      </v-tab>
      <v-tab>
        <v-icon left>
          mdi-account-check
        </v-icon>
        <v-badge
          color="red"
          content="3"
        >
          Prośby o dołączenie
        </v-badge>
      </v-tab>
      <v-tab>
        <v-icon left>
          mdi-account-multiple
        </v-icon>
        Członkowie
      </v-tab>

      <v-tab-item class="px-4 py-6">
        <general-tab />
      </v-tab-item>
      <v-tab-item class="px-4 py-6">
        <join-requests-tab />
      </v-tab-item>
      <v-tab-item class="px-4 py-6">
        <members-tab />
      </v-tab-item>
    </v-tabs>
  </v-container>
</template>

<script>
  import AppBar from '../components/AppBar.vue';
  import GeneralTab from '../components/board-settings/tabs/GeneralTab.vue';
  import JoinRequestsTab from '../components/board-settings/tabs/JoinRequestsTab.vue';
  import MembersTab from '../components/board-settings/tabs/MembersTab.vue';

  export default {
    name: 'BoardSettings',
    components: {
      AppBar,
      GeneralTab,
      JoinRequestsTab,
      MembersTab,
    },
  };
</script>

<style scoped>
  .board-settings-container {
    max-width: 1100px
  }
</style>
