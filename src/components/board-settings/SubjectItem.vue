<template>
  <v-card
    class="mb-3"
    outlined
  >
    <v-row
      class="align-center pl-4 pr-5 py-2"
      no-gutters
    >
      <v-col cols="auto">
        <v-sheet
          :color="subject.color"
          :height="30"
          :width="60"
        />
      </v-col>
      <v-col>
        <v-card-title>
          {{ subject.name }}
          <v-menu
            v-model="nameChangeMenuVisible"
            :close-on-content-click="false"
            :nudge-width="200"
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
                <v-form>
                  <v-text-field
                    v-model="nameChangeMenuInput"
                    :label="$t('subject-creator-dialog.subject-name')"
                    outlined
                    hide-details
                    autofocus
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
                  @click="saveNameChange()"
                >
                  {{ $t('save') }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-menu>
        </v-card-title>
      </v-col>
      <v-col
        cols="auto"
        class="d-flex"
      >
        <v-btn
          color="error"
          outlined
          class="mr-3"
        >
          {{ $t('remove') }}
        </v-btn>
        <v-menu
          :close-on-content-click="false"
          :nudge-width="200"
          offset-x
        >
          <template v-slot:activator="{ on }">
            <v-btn
              color="primary black--text"
              v-on="on"
            >
              {{ $t('board-settings.subjects.change-color') }}
            </v-btn>
          </template>
          <v-color-picker
            v-model="subject.color"
            show-swatches
          />
        </v-menu>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
  export default {
    props: {
      subject: {
        type: Object,
        required: true,
      },
    },
    data: () => ({
      nameChangeMenuVisible: false,
      nameChangeMenuInput: null,
    }),
    watch: {
      nameChangeMenuVisible (value) {
        if (value) {
          this.nameChangeMenuInput = this.subject.name;
        }
      },
    },
    methods: {
      saveNameChange () {
        console.log('Changed name to:', this.nameChangeMenuInput);
        this.nameChangeMenuVisible = false;
      },
      cancelNameChange () {
        this.nameChangeMenuVisible = false;
      },
    },
  };
</script>
