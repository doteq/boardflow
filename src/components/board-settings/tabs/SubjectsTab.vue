<template>
  <div>
    <h1
      class="headline mb-6 text-center"
      v-text="$t('board-settings.subjects.title')"
    />
    <v-card
      v-for="subject in subjectsList"
      :key="subject.id"
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
              v-model="nameChanger[subject.id].menu"
              :close-on-content-click="false"
              :close-on-click="false"
              :nudge-width="200"
              offset-x
            >
              <template v-slot:activator="{ on }">
                <v-icon
                  class="ml-2"
                  v-on="on"
                >
                  mdi-pencil-outline
                </v-icon>
              </template>
              <v-card>
                <v-card-text class="pb-0">
                  <v-form>
                    <v-text-field
                      v-model="nameChanger[subject.id].value"
                      :label="$t('subject-creator-dialog.subject-name')"
                      outlined
                      hide-details
                    />
                  </v-form>
                </v-card-text>
                <v-card-actions>
                  <v-spacer />
                  <v-btn
                    text
                    @click="cancelNameChange(subject)"
                  >
                    {{ $t('cancel') }}
                  </v-btn>
                  <v-btn
                    color="primary"
                    text
                    @click="saveNameChange(subject)"
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
    <div class="d-flex">
      <v-spacer />
      <v-btn
        color="primary black--text"
        outlined
        @click="openSubjectCreator"
      >
        <v-icon>mdi-plus</v-icon>{{ $t('subject-creator-dialog.title') }}
      </v-btn>
    </div>
    <subject-creator-dialog
      ref="subjectCreatorDialog"
      @created="subject = $event"
    />
  </div>
</template>

<script>
  import SubjectCreatorDialog from '../../SubjectCreatorDialog.vue';

  export default {
    name: 'SubjectsTab',
    components: {
      SubjectCreatorDialog,
    },
    data: () => ({
      subjectsList: [
        {
          id: 'dgsfsgfsdgbvvcg',
          name: 'Polski',
          color: '#ffffff',
        },
        {
          id: 'vweb86yy123voiovb',
          name: 'Matematyka',
          color: '#000000',
        },
      ],
      nameChanger: {
        dgsfsgfsdgbvvcg: {
          menu: false,
          value: 'Polski',
        },
        vweb86yy123voiovb: {
          menu: false,
          value: 'Matematyka',
        },
      },
    }),
    methods: {
      openSubjectCreator () {
        this.$refs.subjectCreatorDialog.show(this.$route.params.boardId);
      },
      saveNameChange (subject) {
        subject.name = this.nameChanger[subject.id].value;
        this.nameChanger[subject.id].menu = false;
      },
      cancelNameChange (subject) {
        this.nameChanger[subject.id].value = subject.name;
        this.nameChanger[subject.id].menu = false;
      },
    },
  };
</script>

<style scoped>
  .nazwa {
    font-size: 20px;
    font-weight: bold;
  }
</style>
