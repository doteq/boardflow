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
            v-model="name"
            label="Nazwa użytkownika"
            outlined
            persistent-hint
            hint="Twoja nazwa jest widoczna dla innych użytkowników"
            color="secondary"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            type="submit"
            color="secondary"
            outlined
            :disabled="!nameChanged"
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
        name: '',
        innerValue: this.value,
      };
    },
    computed: {
      nameChanged () {
        if (!this.$store.state.userData) return false;
        if (!this.$store.state.userData.name) return true;
        return this.name !== this.$store.state.userData.name;
      },
    },
    watch: {
      value (newValue, oldValue) {
        this.innerValue = newValue;
        if (newValue && !oldValue) {
          this.name = this.$store.state.userData.name;
        }
      },
    },
    methods: {
      async submit () {
        if (!this.nameChanged) return;
        if (!this.name || this.name === '') return;
        try {
          await this.$database.collection('user-data').doc(this.$store.state.userAuth.uid).update({
            name: this.name,
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
