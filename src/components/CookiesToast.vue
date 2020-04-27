<template>
  <v-snackbar
    :value="visible"
    bottom
    multi-line
    :vertical="$vuetify.breakpoint.smAndDown"
    :timeout="0"
  >
    <v-icon
      v-if="$vuetify.breakpoint.mdAndUp"
      large
      left
      dark
    >
      mdi-cookie
    </v-icon>
    {{ $t('cookies-toast.message') }}
    <v-btn
      v-t="'cookies-toast.more-info'"
      dark
      text
      href="https://skrypt-cookies.pl/czym-sa-ciasteczka"
      target="_blank"
    />
    <v-btn
      v-t="'cookies-toast.understand'"
      dark
      text
      outlined
      @click="closeCookieInfo"
    />
  </v-snackbar>
</template>

<script>
  export default {
    data: () => ({
      visible: false,
    }),
    created () {
      this.visible = JSON.parse(localStorage.getItem('cookies-accepted')) !== true;
    },
    methods: {
      closeCookieInfo () {
        this.visible = false;
        localStorage.setItem('cookies-accepted', JSON.stringify(true));
      },
    },
  };
</script>
