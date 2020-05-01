<template>
  <v-card
    class="mb-3"
    outlined
  >
    <v-row
      class="align-center"
      :class="{
        'pl-4 pr-5 py-2': $vuetify.breakpoint.smAndUp,
        'pl-0 pr-1 py-0': $vuetify.breakpoint.xsOnly,
      }"
      no-gutters
    >
      <v-col
        v-if="$vuetify.breakpoint.smAndUp"
        cols="auto"
      >
        <v-sheet
          class="background-color-transition"
          :color="subject.color"
          :height="30"
          :width="60"
        />
      </v-col>
      <v-col cols="auto">
        <v-card-title
          :class="{
            'subtitle-1': $vuetify.breakpoint.xsOnly,
            'pr-0': $vuetify.breakpoint.smAndUp,
          }"
        >
          {{ subject.name }}
        </v-card-title>
      </v-col>
      <v-spacer v-if="$vuetify.breakpoint.xsOnly" />
      <v-col
        cols="auto"
        class="mr-1"
      >
        <v-menu
          v-model="nameChangeMenuVisible"
          :close-on-content-click="false"
          :nudge-width="250"
          offset-x
        >
          <template v-slot:activator="{ on }">
            <v-btn
              icon
              class="ml-2"
              v-on="on"
            >
              <v-icon>
                mdi-pencil-outline
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
                :disabled="nameChangeLoading"
                @click="cancelNameChange()"
              >
                {{ $t('cancel') }}
              </v-btn>
              <v-btn
                color="primary"
                text
                type="submit"
                :disabled="nameErrors.length > 0 || !nameChanged"
                :loading="nameChangeLoading"
              >
                {{ $t('save') }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-col>
      <v-spacer v-if="$vuetify.breakpoint.smAndUp" />
      <v-col
        cols="auto"
        class="d-flex"
      >
        <!--        <v-btn-->
        <!--          color="error"-->
        <!--          outlined-->
        <!--          class="mr-3"-->
        <!--        >-->
        <!--          {{ $t('remove') }}-->
        <!--        </v-btn>-->
        <v-menu
          :close-on-content-click="false"
          :nudge-width="200"
          offset-x
        >
          <template v-slot:activator="{ on }">
            <v-btn
              v-if="$vuetify.breakpoint.xsOnly"
              icon
              :color="subject.color"
              v-on="on"
            >
              <v-icon>mdi-palette</v-icon>
            </v-btn>
            <v-btn
              v-else
              color="primary black--text"
              v-on="on"
            >
              {{ $t('board-settings.subjects.change-color') }}
            </v-btn>
          </template>
          <v-color-picker
            :value="subject.color"
            show-swatches
            @input="changeColorDebounced"
          />
        </v-menu>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
  import _ from 'lodash';

  export default {
    props: {
      subject: {
        type: Object,
        required: true,
      },
    },
    data () {
      return ({
        nameChangeMenuVisible: false,
        nameChangeMenuInput: null,
        nameChangeLoading: false,
        changeColorDebounced: _.debounce(this.changeColor, 250),
      });
    },
    computed: {
      nameErrors () {
        const errors = [];

        if (this.nameChangeMenuInput === null || this.nameChangeMenuInput.trim().length === 0) {
          errors.push(this.$t('board-settings.subjects.field-required'));
        }

        if (this.nameChangeMenuInput !== null && this.nameChangeMenuInput.trim().length > 30) {
          errors.push(this.$t('board-settings.subjects.max-length-30'));
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
        if (this.nameChangeLoading) return;
        if (this.nameErrors.length > 0) return;
        if (!this.nameChanged) return;

        this.nameChangeLoading = true;
        try {
          const subjectReference = this.$database
            .collection('boards').doc(this.$route.params.boardId)
            .collection('subjects').doc(this.subject.id);
          await subjectReference.update({
            name: this.nameChangeMenuInput.trim(),
          });
          this.nameChangeMenuVisible = false;
        } catch (error) {
          console.error(error);
          this.$toast.error(this.$t('toasts.unexpected-error'));
        }
        this.nameChangeLoading = false;
      },
      cancelNameChange () {
        this.nameChangeMenuVisible = false;
      },
      async changeColor (value) {
        try {
          const subjectReference = this.$database
            .collection('boards').doc(this.$route.params.boardId)
            .collection('subjects').doc(this.subject.id);
          await subjectReference.update({
            color: value,
          });
        } catch (error) {
          console.error(error);
          this.$toast.error(this.$t('toasts.unexpected-error'));
        }
      },
    },
  };
</script>

<style scoped>
  .background-color-transition {
    transition: background-color 200ms;
  }
</style>
