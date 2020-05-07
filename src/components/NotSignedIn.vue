<template>
  <div
    class="d-flex flex-column align-center my-12"
  >
    <h1
      class="display-1 text-center mb-12"
      v-text="$t('not-signed-in-message')"
    />
    <v-btn
      v-t="'sign-in'"
      color="primary black--text"
      large
      @click="showSignInSheet"
    />
    <sign-in-sheet ref="signInSheet" />
  </div>
</template>

<script>
  import SignInSheet from './SignInSheet.vue';

  export default {
    name: 'NotSignedIn',
    components: {
      SignInSheet,
    },
    methods: {
      showSignInSheet () {
        this.$refs.signInSheet.show();
      },
    },
  };
</script>

<style scoped>

</style>
