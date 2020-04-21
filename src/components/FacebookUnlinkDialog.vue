<template>
  <v-dialog
    :value="innerValue"
    max-width="384"
    @input="$emit('input', $event)"
  >
    <v-card>
      <v-card-title>Odłączyć konto Facebook?</v-card-title>
      <v-card-text>Po odłączeniu konta nie będziesz mógł się zalogować za pomocą tego dostawcy</v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          text
          @click="cancel"
        >
          Anuluj
        </v-btn>
        <v-btn
          color="secondary"
          outlined
          :loading="loading"
          @click="unlink"
        >
          Odłącz
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    props: {
      value: {
        type: Boolean,
        required: true,
      },
    },
    data () {
      return {
        innerValue: this.value,
        loading: false,
      };
    },
    watch: {
      value (newValue) {
        this.innerValue = newValue;
      },
    },
    methods: {
      cancel () {
        this.innerValue = false;
        this.$emit('input', false);
      },
      async unlink () {
        this.loading = true;
        try {
          await this.$auth.unlinkFacebook();
          this.innerValue = false;
          this.$emit('input', false);
        } catch (error) {
          this.$toast.error('Nie udało się odłączyć konta');
          console.error(error);
        }
        this.loading = false;
      },
    },
  };
</script>
