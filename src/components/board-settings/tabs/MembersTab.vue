<template>
  <div class="board-settings-members-tab">
    <h1
      class="headline mb-6 text-center"
      v-text="$t('board-settings.members.title')"
    />
    <v-card
      v-if="loading"
      outlined
      class="py-2 mb-3"
    >
      <v-skeleton-loader type="list-item-avatar-two-line" />
    </v-card>
    <transition-group name="flip-list">
      <v-card
        v-for="user in memberList"
        :key="user.uid"
        class="mb-3"
        outlined
      >
        <v-row
          class="align-center"
          :class="{
            'pl-4 pr-5 py-1': $vuetify.breakpoint.smAndUp,
            'pl-4 pr-2': $vuetify.breakpoint.xsOnly,
          }"
          no-gutters
        >
          <v-col cols="auto">
            <v-avatar
              class="elevation-4"
              :size="$vuetify.breakpoint.xsOnly ? 32 : 48"
            >
              <v-img
                :src="user.photoURL"
                :alt="user.name"
              />
            </v-avatar>
          </v-col>
          <v-col>
            <v-card-title
              class="py-2"
              :class="{
                'subtitle-1': $vuetify.breakpoint.xsOnly,
              }"
              v-text="user.name"
            />
            <v-card-subtitle
              v-if="user.owner"
              v-t="'roles.owner'"
              class="amber--text py-2"
            />
            <v-card-subtitle
              v-else-if="user.admin"
              v-t="'roles.admin'"
              class="secondary--text py-2"
            />
            <v-card-subtitle
              v-else
              v-t="'roles.member'"
              class="py-2"
            />
          </v-col>
          <v-col
            v-if="!user.owner"
            cols="auto"
          >
            <v-menu
              left
              offset-y
            >
              <template v-slot:activator="{ on }">
                <v-btn
                  icon
                  v-on="on"
                >
                  <v-icon>
                    mdi-dots-vertical
                  </v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item
                  v-if="!user.admin"
                  :disabled="!userIsOwner"
                  link
                  @click="addAdmin(user.uid)"
                >
                  <v-list-item-title v-t="'board-settings.members.admin-add'" />
                </v-list-item>
                <v-list-item
                  v-if="user.admin"
                  :disabled="!userIsOwner"
                  link
                  @click="removeAdmin(user.uid)"
                >
                  <v-list-item-title v-t="'board-settings.members.admin-remove'" />
                </v-list-item>
                <change-owner-dialog @change="changeOwner(user.uid)">
                  <template v-slot:activator="{ on }">
                    <v-list-item
                      link
                      :disabled="!userIsOwner"
                      v-on="on"
                    >
                      <v-list-item-title v-t="'board-settings.members.set-owner'" />
                    </v-list-item>
                  </template>
                </change-owner-dialog>
                <member-remove-dialog @remove="removeUser(user.uid)">
                  <template v-slot:activator="{ on }">
                    <v-list-item v-on="on">
                      <v-list-item-title v-t="'board-settings.members.remove'" />
                    </v-list-item>
                  </template>
                </member-remove-dialog>
              </v-list>
            </v-menu>
          </v-col>
        </v-row>
      </v-card>
    </transition-group>
  </div>
</template>

<script>
  import _ from 'lodash';
  import firebase from 'firebase/app';
  import ChangeOwnerDialog from '../ChangeOwnerDialog.vue';
  import MemberRemoveDialog from '../MemberRemoveDialog.vue';
  import 'firebase/firestore';

  export default {
    components: {
      ChangeOwnerDialog,
      MemberRemoveDialog,
    },
    props: {
      boardInfo: {
        type: Object,
        required: false,
        default: null,
      },
    },
    computed: {
      loading () {
        return !this.boardInfo || !this.$store.state.userDataList;
      },
      userIsOwner () {
        if (!this.boardInfo || !this.$store.state.userAuth) return null;
        return this.boardInfo.owner === this.$store.state.userAuth.uid;
      },
      memberList () {
        if (this.loading) return [];
        const memberList = this.boardInfo.members.map((userId) => {
          const user = this.$store.state.userDataList.find((e) => e.id === userId);
          if (!user) return null;
          return {
            uid: userId,
            name: user.name,
            photoURL: user.photoURL,
            admin: this.boardInfo.admins.includes(userId),
            owner: this.boardInfo.owner === userId,
            self: this.$store.state.userAuth ? this.$store.state.userAuth.uid === userId : false,
          };
        }).filter((user) => user !== null);
        return _.sortBy(memberList, [
          (memberItem) => {
            if (memberItem.owner) return 0;
            if (memberItem.admin) return 1;
            return 2;
          },
          (memberItem) => memberItem.name,
        ]);
      },
    },
    methods: {
      async removeUser (userUid) {
        try {
          const boardInfoReference = this.$database.collection('boards-info').doc(this.$route.params.boardId);
          await boardInfoReference.update({
            admins: firebase.firestore.FieldValue.arrayRemove(userUid),
            members: firebase.firestore.FieldValue.arrayRemove(userUid),
          });
          this.$toast(this.$t('toasts.user-removed'));
        } catch (error) {
          console.error(error);
          this.$toast.error(this.$t('toasts.unexpected-error'));
        }
      },
      async addAdmin (userUid) {
        try {
          const boardInfoReference = this.$database.collection('boards-info').doc(this.$route.params.boardId);
          await boardInfoReference.update({
            admins: firebase.firestore.FieldValue.arrayUnion(userUid),
          });
          this.$toast(this.$t('toasts.admin-added'));
        } catch (error) {
          console.error(error);
          this.$toast.error(this.$t('toasts.unexpected-error'));
        }
      },
      async removeAdmin (userUid) {
        try {
          const boardInfoReference = this.$database.collection('boards-info').doc(this.$route.params.boardId);
          await boardInfoReference.update({
            admins: firebase.firestore.FieldValue.arrayRemove(userUid),
          });
          this.$toast(this.$t('toasts.admin-removed'));
        } catch (error) {
          console.error(error);
          this.$toast.error(this.$t('toasts.unexpected-error'));
        }
      },
      async changeOwner (userUid) {
        try {
          const boardInfoReference = this.$database.collection('boards-info').doc(this.$route.params.boardId);
          await boardInfoReference.update({
            owner: userUid,
            admins: firebase.firestore.FieldValue.arrayUnion(userUid),
          });
          this.$toast(this.$t('toasts.admin-changed'));
        } catch (error) {
          console.error(error);
          this.$toast.error(this.$t('toasts.unexpected-error'));
        }
      },
    },
  };
</script>

<style lang="scss">
  .board-settings-members-tab {
    .flip-list-move {
      transition: transform 300ms;
    }
  }
</style>
