<template>
  <div>
    <h1 class="headline mb-6 text-center">
      Prośby o dołączenie
    </h1>
    <v-text-field
      id="board-link-input"
      :value="boardLink"
      outlined
      readonly
      dense
      class="mt-4"
      label="Link do tablicy"
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
          outlined
          class="mr-0 ml-2 mb-2 p-0"
          @click="copyJoinLink()"
        >
          Kopiuj
        </v-btn>
      </template>
    </v-text-field>
    <template v-if="loading">
      <v-card outlined>
        <v-skeleton-loader type="list-item-avatar-two-line" />
      </v-card>
    </template>
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
                  color="error"
                  outlined
                  class="mr-3"
                  v-on="on"
                >
                  Odrzuć
                </v-btn>
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
                  Akceptuj
                  <v-icon right>
                    mdi-menu-down
                  </v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item @click="acceptRequest(request.id, false)">
                  <v-list-item-title>
                    Dodaj jako członka
                  </v-list-item-title>
                </v-list-item>
                <v-list-item @click="acceptRequest(request.id, true)">
                  <v-list-item-title>
                    Dodaj jako administratora
                  </v-list-item-title>
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
                  <v-list-item-title>
                    Dodaj jako członka
                  </v-list-item-title>
                </v-list-item>
                <v-list-item @click="acceptRequest(request.id, true)">
                  <v-list-item-title>
                    Dodaj jako administratora
                  </v-list-item-title>
                </v-list-item>
                <v-divider />
                <join-request-reject-dialog @reject="rejectRequest(request.id)">
                  <template v-slot:activator="{ on }">
                    <v-list-item v-on="on">
                      <v-list-item-title>
                        Odrzuć
                      </v-list-item-title>
                    </v-list-item>
                  </template>
                </join-request-reject-dialog>
              </v-list>
            </v-menu>
          </v-col>
        </v-row>
      </v-card>
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
        this.$toast('Skopiowano link do schowka');
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
          this.$toast.error('Wystąpił nieoczekiwany błąd');
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
          this.$toast.error('Wystąpił nieoczekiwany błąd');
          console.error(error);
        }
      },
    },
  };
</script>
