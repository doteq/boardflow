<template>
  <div>
    <h1
      v-t="'board-settings.join-requests.title'"
      class="headline mb-6 text-center"
    />
    <v-alert
      v-if="userIsAdmin === false"
      type="warning"
      class="mb-8"
    >
      Tylko administratorzy mogą sprawdzać oczekujące prośby o dołączenie
    </v-alert>
    <v-text-field
      id="board-link-input"
      :value="boardLink"
      outlined
      readonly
      dense
      class="mt-4"
      :label="$t('board-settings.join-requests.board-link')"
    >
      <template v-slot:append>
        <v-btn
          v-if="$vuetify.breakpoint.xsOnly"
          icon
          class="mr-0 ml-2 mb-2 p-0"
          @click="copyJoinLink()"
        >
          <v-icon>mdi-content-copy</v-icon>
        </v-btn>
        <v-btn
          v-else
          v-t="'copy'"
          outlined
          class="mr-0 ml-2 mb-2 p-0"
          @click="copyJoinLink()"
        />
      </template>
    </v-text-field>
    <template v-if="userIsAdmin === true || (loading && userIsAdmin === null)">
      <template v-if="loading">
        <v-card outlined>
          <v-skeleton-loader type="list-item-avatar-two-line" />
        </v-card>
      </template>
      <h1
        v-else-if="joinRequestItems.length === 0"
        v-t="'board-settings.join-requests.no-pending-join-requests'"
        class="headline px-4 py-12 text-center text--secondary"
      />
      <template v-else-if="$vuetify.breakpoint.smAndUp">
        <v-card
          v-for="request in joinRequestItems"
          :key="request.uid"
          class="mb-3"
          outlined
        >
          <v-row
            class="align-center pl-4 pr-5 py-2"
            no-gutters
          >
            <v-col cols="auto">
              <v-avatar
                class="elevation-4"
                :size="48"
              >
                <v-img
                  :src="request.photoURL"
                  :alt="request.name"
                />
              </v-avatar>
            </v-col>
            <v-col>
              <v-card-title v-text="request.name" />
            </v-col>
            <v-col
              cols="auto"
            >
              <join-request-reject-dialog @reject="rejectRequest(request.id)">
                <template v-slot:activator="{ on }">
                  <v-btn
                    v-t="'reject'"
                    color="error"
                    outlined
                    class="mr-3"
                    v-on="on"
                  />
                </template>
              </join-request-reject-dialog>
            </v-col>
            <v-col cols="auto">
              <v-menu
                bottom
                left
                offset-y
              >
                <template v-slot:activator="{ on }">
                  <v-btn
                    color="primary black--text"
                    v-on="on"
                  >
                    {{ $t('accept') }}
                    <v-icon right>
                      mdi-menu-down
                    </v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item @click="acceptRequest(request.id, false)">
                    <v-list-item-title v-t="'add-as-member'" />
                  </v-list-item>
                  <v-list-item
                    :disabled="!userIsOwner"
                    @click="acceptRequest(request.id, true)"
                  >
                    <v-list-item-title v-t="'add-as-admin'" />
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-col>
          </v-row>
        </v-card>
      </template>
      <template v-else>
        <v-card
          v-for="request in joinRequestItems"
          :key="request.uid"
          class="mb-2"
          outlined
        >
          <v-row
            class="align-center pl-3 pr-2"
            no-gutters
          >
            <v-col cols="auto">
              <v-avatar
                class="elevation-4"
                :size="36"
              >
                <v-img
                  :src="request.photoURL"
                  :alt="request.name"
                />
              </v-avatar>
            </v-col>
            <v-col>
              <v-card-title
                class="subtitle-1 px-3"
                v-text="request.name"
              />
            </v-col>
            <v-col
              cols="auto"
              class="d-flex"
            >
              <v-menu
                bottom
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
                  <v-list-item @click="acceptRequest(request.id, false)">
                    <v-list-item-title v-t="'add-as-member'" />
                  </v-list-item>
                  <v-list-item
                    :disabled="!userIsOwner"
                    @click="acceptRequest(request.id, true)"
                  >
                    <v-list-item-title v-t="'add-as-admin'" />
                  </v-list-item>
                  <v-divider />
                  <join-request-reject-dialog @reject="rejectRequest(request.id)">
                    <template v-slot:activator="{ on }">
                      <v-list-item v-on="on">
                        <v-list-item-title v-t="'reject'" />
                      </v-list-item>
                    </template>
                  </join-request-reject-dialog>
                </v-list>
              </v-menu>
            </v-col>
          </v-row>
        </v-card>
      </template>
    </template>
  </div>
</template>

<script>
  import firebase from 'firebase/app';
  import 'firebase/firestore';
  import JoinRequestRejectDialog from '../JoinRequestRejectDialog.vue';

  export default {
    components: {
      JoinRequestRejectDialog,
    },
    props: {
      boardInfo: {
        type: Object,
        required: false,
        default: null,
      },
      joinRequests: {
        type: Array,
        required: false,
        default: null,
      },
    },
    computed: {
      loading () {
        if (!this.$store.state.userDataList) return true;
        return !this.joinRequests;
      },
      userIsAdmin () {
        if (!this.boardInfo) return null;
        return this.boardInfo.admins.includes(this.$store.state.userAuth.uid);
      },
      userIsOwner () {
        if (!this.boardInfo || !this.$store.state.userAuth) return null;
        return this.boardInfo.owner === this.$store.state.userAuth.uid;
      },
      boardLink () {
        return new URL(`/board/${this.$route.params.boardId}`, window.location.origin);
      },
      joinRequestItems () {
        if (this.loading) return null;
        return this.joinRequests.map((joinRequest) => {
          const user = this.$store.state.userDataList.find((e) => e.id === joinRequest.id);
          return {
            photoURL: user.photoURL,
            name: user.name,
            id: joinRequest.id,
            timestamp: joinRequest.timestamp,
          };
        });
      },
    },
    methods: {
      copyJoinLink () {
        const input = document.getElementById('board-link-input');
        input.select();
        document.execCommand('copy');
        this.$toast(this.$t('toasts.link-copied'));
      },
      async acceptRequest (userId, admin) {
        try {
          const boardInfoReference = this.$database
            .collection('boards-info').doc(this.$route.params.boardId);
          const requestReference = boardInfoReference
            .collection('join-requests').doc(userId);

          const batch = this.$database.batch();
          const boardInfoData = {};

          boardInfoData.members = firebase.firestore.FieldValue.arrayUnion(userId);
          if (admin) {
            boardInfoData.admins = firebase.firestore.FieldValue.arrayUnion(userId);
          }

          batch.update(boardInfoReference, boardInfoData);
          batch.delete(requestReference);

          await batch.commit();
        } catch (error) {
          this.$toast.error(this.$t('toasts.unexpected-error'));
          console.error(error);
        }
      },
      async rejectRequest (userId) {
        try {
          const boardInfoReference = this.$database
            .collection('boards-info').doc(this.$route.params.boardId);
          const requestReference = boardInfoReference
            .collection('join-requests').doc(userId);

          await requestReference.delete();
        } catch (error) {
          this.$toast.error(this.$t('toasts.unexpected-error'));
          console.error(error);
        }
      },
    },
  };
</script>
