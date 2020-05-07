<template>
  <div
    class="d-flex fill-height fill-width flex-column align-center justify-center grow"
  >
    <h1
      class="display-1 text-center"
      v-text="$t('board-is-private-message')"
    />
    <v-btn
      v-if="!$store.state.userAuth"
      v-t="'sign-in'"
      color="primary black--text"
      class="mt-8"
      large
      @click="showSignInSheet"
    />
    <v-skeleton-loader
      v-else-if="!selfMemberRequestLoaded"
      type="image"
      width="200px"
      height="44px"
      class="mt-8"
    />
    <div
      v-else-if="selfMemberRequest"
      class="mt-8 body-1 text-center text--secondary"
      v-text="$t('join-request-pending-message')"
    />
    <v-btn
      v-else
      v-t="'ask-to-join'"
      color="primary black--text"
      class="mt-8"
      large
      @click="requestPermission"
    />
    <sign-in-sheet ref="signInSheet" />
  </div>
</template>

<script>
  import firebase from 'firebase';
  import SignInSheet from './SignInSheet.vue';

  export default {
    name: 'NotMember',
    components: {
      SignInSheet,
    },
    methods: {
      showSignInSheet () {
        this.$refs.signInSheet.show();
      },
      async requestPermission () {
        try {
          const joinRequestReference = this.$database
            .collection('boards-info').doc(this.$route.params.boardId)
            .collection('join-requests').doc(this.$store.state.userAuth.uid);
          await joinRequestReference.set({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          });
        } catch (error) {
          this.$toast.error(this.$t('toasts.unexpected-error'));
          console.error(error);
        }
      },
    },
    data: () => ({
      selfMemberRequest: null,
      selfMemberRequestLoaded: false,
    }),
    computed: {
      bindSelfMemberRequest () {
        return this.userIsMember === false && this.$store.state.userAuth !== null;
      },
    },
    watch: {
      bindSelfMemberRequest: {
        async handler (value) {
          if (value) {
            this.selfMemberRequestLoaded = false;
            await this.$bind('selfMemberRequest', this.$database
              .collection('boards-info').doc(this.$route.params.boardId)
              .collection('join-requests').doc(this.$store.state.userAuth.uid));
            this.selfMemberRequestLoaded = true;
          } else {
            this.selfMemberRequestLoaded = false;
            if (this.$firestoreRefs.selfMemberRequest) {
              this.$unbind('selfMemberRequest');
            }
          }
        },
        immediate: true,
      },
    },
  };
</script>

<style scoped>

</style>
