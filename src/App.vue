<template>
  <v-app>
    <v-content>
      <router-view />
    </v-content>
    <v-footer
      app
      absolute
    >
      <template v-if="$vuetify.breakpoint.smAndUp">
        <v-btn
          href="/privacy-policy.pdf"
          text
          rounded
        >
          <v-icon left>
            mdi-lock
          </v-icon>
          Polityka Prywatności
        </v-btn>
        <v-btn
          href="https://github.com/doteq/task-overflow"
          class="ml-2"
          text
          rounded
        >
          <v-icon left>
            mdi-github
          </v-icon>
          GitHub
        </v-btn>
      </template>
      <template v-else>
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-btn
              href="/privacy-policy.pdf"
              icon
              v-on="on"
            >
              <v-icon>
                mdi-lock
              </v-icon>
            </v-btn>
          </template>
          <span>
            Polityka Prywatności
          </span>
        </v-tooltip>
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-btn
              href="https://github.com/doteq/task-overflow"
              class="ml-2"
              icon
              v-on="on"
            >
              <v-icon>
                mdi-github
              </v-icon>
            </v-btn>
          </template>
          <span>
            GitHub
          </span>
        </v-tooltip>
      </template>
    </v-footer>
  </v-app>
</template>

<script>
  export default {
    name: 'App',
  };
</script>

<style lang="scss">
  .break-word {
    word-break: break-word !important;
  }
</style>
