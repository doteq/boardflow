<template>
  <v-container class="home-container">
    <app-bar show-logo>
      Task Overflow
    </app-bar>

    <div
      v-if="!signedIn"
      class="d-flex flex-column align-center my-12"
    >
      <h1 class="display-1 text-center mb-12">
        Nie jesteś zalogowany
      </h1>
      <v-btn
        color="primary black--text"
        large
        @click="showSignInSheet"
        v-text="$t('sign-in')"
      />
    </div>

    <v-progress-linear
      v-else-if="loading"
      indeterminate
    />

    <div
      v-else-if="boardItems.length === 0"
      class="d-flex flex-column align-center my-12"
    >
      <h1 class="display-1 text-center mb-12">
        Nie jesteś członkiem żadnej tablicy
      </h1>
      <v-btn
        color="primary black--text"
        large
        to="/create"
      >
        Utwórz nową
      </v-btn>
    </div>

    <template v-else>
      <v-row
        class="justify-center"
      >
        <v-col
          v-for="board in boardItems"
          :key="board.id"
          :cols="12"
          :sm="6"
          :md="4"
        >
          <v-card
            :to="`/board/${board.id}`"
          >
            <v-card-title v-text="board.name" />
            <v-card-text class="d-flex">
              <v-spacer />
              <v-avatar
                v-for="(member, index) in board.members"
                :key="member.uid"
                :class="{
                  'overlap-left': index !== 0,
                }"
              >
                <img
                  :src="member.photoURL"
                  :alt="member.name"
                >
              </v-avatar>
              <v-avatar
                v-if="board.memberOverflow > 0"
                color="accent"
                class="overlap-left"
              >
                +{{ board.memberOverflow }}
              </v-avatar>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <div
        class="d-flex flex-column align-center my-12"
      >
        <v-btn
          color="primary black--text"
          to="/create"
        >
          Utwórz nową tablicę
        </v-btn>
      </div>
    </template>
    <div
      style="max-width: 512px"
      class="mx-auto mt-12"
    >
      <v-divider class="mx-8" />
      <v-btn
        class="mt-12"
        href="/privacy-policy.pdf"
        block
        outlined
      >
        <v-icon left>
          mdi-lock
        </v-icon>
        {{ $t('privacy-policy') }}
      </v-btn>
      <v-btn
        class="mt-4"
        href="https://github.com/doteq/task-overflow"
        block
        outlined
      >
        <v-icon left>
          mdi-github
        </v-icon>
        {{ $t('github') }}
      </v-btn>
      <div class="mt-12 text-center">
        Made with
        <v-icon title="Vue.js">
          mdi-vuejs
        </v-icon>,
        <v-icon title="Vuetify">
          mdi-vuetify
        </v-icon>,
        <v-icon title="Google Firebase">
          mdi-firebase
        </v-icon>
        and
        <v-icon title="Love">
          mdi-heart
        </v-icon> by
        <a href="https://github.com/doteq">Doteq</a>
        and
        <a href="https://github.com/dominik-korsa">Dominik Korsa</a>
      </div>
    </div>
    <sign-in-sheet ref="signInSheet" />
  </v-container>
</template>

<script>
  import AppBar from '../components/AppBar.vue';
  import SignInSheet from '../components/SignInSheet.vue';

  export default {
    name: 'Home',
    components: {
      AppBar,
      SignInSheet,
    },
    computed: {
      signedIn () {
        return !!this.$store.state.userAuth;
      },
      loading () {
        return !this.boardItems && this.signedIn;
      },
      boardItems () {
        if (!this.$store.state.boardsInfo || !this.$store.state.userDataList || !this.signedIn) return null;
        const joinedBoards = this.$store.state.boardsInfo
          .filter((board) => board.members.includes(this.$store.state.userAuth.uid));
        return joinedBoards.map((board) => {
          const members = board.members.map((userUid) => {
            const userData = this.$store.state.userDataList
              ? this.$store.state.userDataList.find((item) => item.id === userUid) || null
              : null;
            return {
              uid: userUid,
              self: userUid === this.$store.state.userAuth.uid,
              name: userData ? userData.name : null,
              photoURL: userData ? userData.photoURL : null,
              admin: (board.admins || []).includes(userUid),
            };
          });

          if (members.length > 5) {
            return {
              id: board.id,
              name: board.name,
              members: members.slice(0, 5),
              memberOverflow: members.length - 4,
            };
          }

          return {
            id: board.id,
            name: board.name,
            members,
            memberOverflow: 0,
          };
        });
      },
    },
    methods: {
      showSignInSheet () {
        this.$refs.signInSheet.show();
      },
    },
  };
</script>

<style lang="scss" scoped>
  .home-container {
    max-width: 800px;
  }

  .overlap-left {
    margin-left: -16px;
  }
</style>
