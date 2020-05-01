<template>
  <v-menu
    v-model="visible"
    offset-y
  >
    <template v-slot:activator="{ on }">
      <slot
        :value="visible"
        name="activator"
        :on="on"
        :badge-count="badgeCount"
      />
    </template>
    <v-list :dense="dense">
      <v-list-item :to="`/board/${$route.params.boardId}/settings`">
        <v-list-item-icon>
          <v-badge
            :value="settingsBadgeCount > 0"
            :content="settingsBadgeCount"
            color="red"
            :overlap="dense"
          >
            <v-icon>mdi-cog</v-icon>
          </v-badge>
        </v-list-item-icon>

        <v-list-item-title v-t="'board-settings.title'" />
      </v-list-item>
      <v-list-item :to="`/board/${$route.params.boardId}/settings/subjects`">
        <v-list-item-icon>
          <v-icon>mdi-book</v-icon>
        </v-list-item-icon>

        <v-list-item-title v-t="'board-settings.subjects.title'" />
      </v-list-item>
      <!--      <v-list-item>-->
      <!--        <v-list-item-icon>-->
      <!--          <v-icon>mdi-label</v-icon>-->
      <!--        </v-list-item-icon>-->

      <!--        <v-list-item-title>-->
      <!--          Lista etykiet-->
      <!--        </v-list-item-title>-->
      <!--      </v-list-item>-->
      <v-divider />
      <!--      <v-list-item>-->
      <!--        <v-list-item-icon>-->
      <!--          <v-icon>mdi-calendar</v-icon>-->
      <!--        </v-list-item-icon>-->

      <!--        <v-list-item-title>-->
      <!--          Połącz Kalendarz Google-->
      <!--        </v-list-item-title>-->
      <!--      </v-list-item>-->
      <board-leave-dialog @leave="leave">
        <template v-slot:activator="{ on }">
          <v-list-item
            :disabled="userIsOwner || leaveLoading"
            v-on="on"
          >
            <v-list-item-icon>
              <v-icon>mdi-logout</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title v-text="$t('leave-board')" />
              <v-list-item-subtitle
                v-if="userIsOwner"
                v-text="$t('leave-owner-message')"
              />
            </v-list-item-content>
          </v-list-item>
        </template>
      </board-leave-dialog>
    </v-list>
  </v-menu>
</template>

<script>
  import firebase from 'firebase/app';
  import BoardLeaveDialog from './BoardLeaveDialog.vue';
  import 'firebase/functions';

  export default {
    components: {
      BoardLeaveDialog,
    },
    props: {
      dense: {
        type: Boolean,
        default: false,
        required: false,
      },
      joinRequests: {
        type: Array,
        required: true,
      },
      userIsOwner: {
        type: Boolean,
        required: true,
      },
    },
    data: () => ({
      visible: false,
      leaveLoading: false,
    }),
    computed: {
      settingsBadgeCount () {
        if (!this.joinRequests) return 0;
        return this.joinRequests.length;
      },
      badgeCount () {
        return this.settingsBadgeCount;
      },
    },
    methods: {
      async leave () {
        if (this.leaveLoading) return;
        this.leaveLoading = true;
        const leaveBoardFunction = firebase.functions().httpsCallable('leaveBoard');
        try {
          await leaveBoardFunction({ boardId: this.$route.params.boardId });
        } catch (error) {
          this.$toast.error(this.$t('toasts.unexpected-error'));
          console.error(error);
        }
        this.leaveLoading = false;
      },
    },
  };
</script>
