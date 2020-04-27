<template>
  <v-dialog
    :value="innerValue"
    max-width="384"
    @input="$emit('input', $event)"
  >
    <v-card>
      <v-card-title v-t="'unlink-dialog.facebook-title'" />
      <v-card-text v-t="'unlink-dialog.description'" />
      <v-card-actions>
        <v-spacer />
        <v-btn
          v-t="'cancel'"
          text
          @click="cancel"
        />
        <v-btn
          v-t="'unlink-dialog.unlink'"
          color="secondary"
          outlined
          :loading="loading"
          @click="unlink"
        />
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
          this.$toast.error(this.$t('toasts.unlink-failed'));
          console.error(error);
        }
        this.loading = false;
      },
    },
  };
</script>
