<template>
  <v-container class="board-settings-container">
    <app-bar
      :back-to="`/board/${$route.params.boardId}`"
    >
      {{ $t('board-settings.title') }}
    </app-bar>
    <v-tabs
      v-model="tabIndex"
      :vertical="$vuetify.breakpoint.mdAndUp"
    >
      <v-tab>
        <v-icon left>
          mdi-information
        </v-icon>
        {{ $t('board-settings.general.title') }}
      </v-tab>
      <v-tab>
        <v-icon left>
          mdi-account-check
        </v-icon>
        <v-badge
          color="red"
          :value="joinRequests && joinRequests.length > 0"
          :content="joinRequests !== null ? joinRequests.length : null"
        >
          {{ $t('board-settings.join-requests.title') }}
        </v-badge>
      </v-tab>
      <v-tab>
        <v-icon left>
          mdi-account-multiple
        </v-icon>
        {{ $t('board-settings.members.title') }}
      </v-tab>
      <v-tab>
        <v-icon left>
          mdi-book
        </v-icon>
        {{ $t('board-settings.subjects.title') }}
      </v-tab>

      <v-tab-item class="px-4 py-6">
        <general-tab />
      </v-tab-item>
      <v-tab-item class="px-4 py-6">
        <join-requests-tab :join-requests="joinRequests" />
      </v-tab-item>
      <v-tab-item class="px-4 py-6">
        <members-tab :board-info="boardInfo" />
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
      joinRequests: null,
      tabs: [
        {
          path: 'general',
          routeName: 'BoardSettingsGeneral',
        },
        {
          path: 'join-requests',
          routeName: 'BoardSettingsJoinRequests',
        },
        {
          path: 'members',
          routeName: 'BoardSettingsMembers',
        },
        {
          path: 'subjects',
          routeName: 'BoardSettingsSubjects',
        },
      ],
    }),
    computed: {
      tabIndex: {
        get () {
          return this.tabs.findIndex((tab) => tab.routeName === this.$route.name);
        },
        set (value) {
          const tab = this.tabs[value];
          this.$router.replace(`/board/${this.$route.params.boardId}/settings/${tab.path}`);
        },
      },
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
            this.$toast.error(this.$t('toasts.unexpected-error'));
          }
          this.boardInfoLoaded = true;
        },
        immediate: true,
      },
      userIsAdmin: {
        async handler (value) {
          if (value) {
            try {
              const joinRequestsReference = this.$database
                .collection('boards-info').doc(this.$route.params.boardId)
                .collection('join-requests');
              await this.$bind('joinRequests', joinRequestsReference);
            } catch (error) {
              console.error(error);
              this.$toast.error(this.$t('toasts.unexpected-error'));
            }
          } else if (this.$firestoreRefs.joinRequests) {
            this.$unbind('joinRequests');
          }
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
