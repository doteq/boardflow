<template>
  <v-dialog
    :value="innerValue"
    width="400"
    @input="$emit('input', $event)"
  >
    <v-card>
      <v-card-title class="headline">
        Zmień wyświetlaną nazwę
      </v-card-title>
      <v-form @submit.prevent="submit">
        <v-card-text class="mt-2">
          <v-text-field
            v-model="displayName"
            label="Imię i nazwisko"
            outlined
            persistent-hint
            hint="Twoja nazwa jest widoczna dla nauczycieli i innych użytkowników"
            color="secondary"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            type="submit"
            color="secondary"
            outlined
            :disabled="!displayNameChanged"
          >
            Zapisz
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    props: {
      value: {
        type: Boolean,
        default: false,
      },
    },
    data () {
      return {
        displayName: '',
        innerValue: this.value,
      };
    },
    computed: {
      displayNameChanged () {
        if (!this.$store.state.userData) return false;
        if (!this.$store.state.userData.displayName) return true;
        return this.displayName !== this.$store.state.userData.displayName;
      },
    },
    watch: {
      value (newValue, oldValue) {
        this.innerValue = newValue;
        if (newValue && !oldValue) {
          this.displayName = this.$store.state.userData.displayName;
        }
      },
    },
    methods: {
      async submit () {
        if (!this.displayNameChanged) return;
        if (!this.displayName || this.displayName === '') return;
        try {
          await this.$database.collection('user-data').doc(this.$store.state.user.uid).update({
            displayName: this.displayName,
          });
          this.innerValue = false;
          this.$emit('input', false);
        } catch (error) {
          this.$toast.error('Podczas zmiany nazwy wystąpił nieoczekiwany błąd');
          console.error(error);
        }
      },
    },
  };
</script>
