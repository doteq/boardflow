<template>
  <div>
    <h1 class="headline mb-6 text-center">
      Przedmioty
    </h1>
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
          <v-hover
            v-slot:default="{ hover }"
            open-delay="200"
          >
            <div>
              <v-card-title
                v-if="!hover"
                v-text="subject.name"
              />
              <v-text-field
                v-if="hover"
                v-model="subject.name"
                outlined
                class="ml-1 mr-10 pa-1 nazwa"
                hide-details
                filled
              />
            </div>
          </v-hover>
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
            Usuń
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
                Zmień kolor
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
        <v-icon>mdi-plus</v-icon> Dodaj nowy
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
    }),
    methods: {
      openSubjectCreator () {
        this.$refs.subjectCreatorDialog.show(this.$route.params.boardId);
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
