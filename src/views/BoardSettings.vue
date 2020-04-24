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
      <v-tab>
        <v-icon left>
          mdi-book
        </v-icon>
        Przedmioty
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
      <v-tab-item class="px-4 py-6">
        <subjects-tab />
      </v-tab-item>
    </v-tabs>
  </v-container>
</template>
<script>
  import AppBar from '../components/AppBar.vue';
  import GeneralTab from '../components/board-settings/tabs/GeneralTab.vue';
  import JoinRequestsTab from '../components/board-settings/tabs/JoinRequestsTab.vue';
  import MembersTab from '../components/board-settings/tabs/MembersTab.vue';
  import SubjectsTab from '../components/board-settings/tabs/SubjectsTab.vue';

  export default {
    name: 'BoardSettings',
    components: {
      AppBar,
      GeneralTab,
      JoinRequestsTab,
      MembersTab,
      SubjectsTab,
    },
    data: () => ({
      boardInfo: null,
      boardInfoLoaded: false,
    }),
    computed: {
      userIsMember () {
        if (!this.boardInfo) return null;
        if (!this.$store.state.userAuth) return false;
        return this.boardInfo.members.includes(this.$store.state.userAuth.uid);
      },
      userIsAdmin () {
        if (!this.boardInfo) return null;
        if (!this.$store.state.userAuth) return false;
        return this.boardInfo.admins.includes(this.$store.state.userAuth.uid);
      },
    },
    watch: {
      '$route.params.boardId': {
        async handler (value) {
          this.boardInfoLoaded = false;
          try {
            await this.$bind('boardInfo', this.$database.collection('boards-info').doc(value));
          } catch (error) {
            console.error(error);
            this.$toast.error('Wystąpił nieoczekiwany błąd');
          }
          this.boardInfoLoaded = true;
        },
        immediate: true,
      },
    },
  };
</script>
<style scoped>
  .board-settings-container {
    max-width: 1100px
  }
</style>
