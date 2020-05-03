<template>
  <v-list-item
    class="px-2"
  >
    <v-menu
      :close-on-content-click="false"
      :nudge-width="200"
      offset-x
    >
      <template v-slot:activator="{ on }">
        <v-btn
          icon
          :color="subject.color"
          class="mr-2"
          v-on="on"
        >
          <v-icon>
            mdi-palette
          </v-icon>
        </v-btn>
      </template>
      <v-color-picker
        :value="subject.color"
        show-swatches
        @input="changeColor"
      />
    </v-menu>
    <v-list-item-title v-text="subject.name" />
    <v-menu
      v-model="nameChangeMenuVisible"
      :close-on-content-click="false"
      :nudge-width="250"
      offset-x
    >
      <template v-slot:activator="{ on }">
        <v-btn
          icon
          class="mr-1"
          v-on="on"
        >
          <v-icon>
            mdi-pencil
          </v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-card-text class="pb-0">
          <v-form @submit.prevent="saveNameChange()">
            <v-text-field
              v-model="nameChangeMenuInput"
              :label="$t('subject-creator-dialog.subject-name')"
              outlined
              autofocus
              :error-messages="nameErrors"
              :counter="30"
              :counter-value="(value) => value.trim().length"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            text
            @click="cancelNameChange()"
          >
            {{ $t('cancel') }}
          </v-btn>
          <v-btn
            color="primary"
            text
            type="submit"
            :disabled="nameErrors.length > 0 || !nameChanged"
          >
            {{ $t('save') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
    <v-btn
      icon
      @click="$emit('click:remove', $event)"
    >
      <v-icon>
        mdi-delete
      </v-icon>
    </v-btn>
  </v-list-item>
</template>

<script>
  export default {
    props: {
      subject: {
        type: Object,
        required: true,
      },
      isSubjectAlreadyAdded: {
        type: Function,
        required: true,
      },
    },
    data: () => ({
      nameChangeMenuVisible: false,
      nameChangeMenuInput: null,
    }),
    computed: {
      nameErrors () {
        const errors = [];

        if (this.nameChangeMenuInput === null || this.nameChangeMenuInput.trim().length === 0) {
          errors.push(this.$t('create.field-required-message'));
        }

        if (this.nameChangeMenuInput !== null && this.nameChangeMenuInput.trim().length > 30) {
          errors.push(this.$t('create.max-length-30-message'));
        }

        if (this.nameChanged && this.isSubjectAlreadyAdded(this.nameChangeMenuInput.trim())) {
          errors.push(this.$t('create.subject-duplicate-message'));
        }

        return errors;
      },
      nameChanged () {
        if (this.nameChangeMenuInput === null) return null;
        return this.subject.name !== this.nameChangeMenuInput.trim();
      },
    },
    watch: {
      nameChangeMenuVisible (value) {
        if (value) {
          this.nameChangeMenuInput = this.subject.name;
        }
      },
    },
    methods: {
      async saveNameChange () {
        if (this.nameErrors.length > 0) return;
        if (!this.nameChanged) return;

        this.$emit('name-change', this.nameChangeMenuInput);
        this.nameChangeMenuVisible = false;
      },
      cancelNameChange () {
        this.nameChangeMenuVisible = false;
      },
      async changeColor (value) {
        this.$emit('color-change', value);
      },
    },
  };
</script>
