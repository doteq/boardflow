<template>
  <div>
    <h1
      class="headline mb-6 text-center"
      v-text="$t('board-settings.subjects.title')"
    />
    <subject-item
      v-for="subject in subjects"
      :key="subject.id"
      :subject="subject"
    />
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
  import SubjectItem from '../SubjectItem.vue';

  export default {
    name: 'SubjectsTab',
    components: {
      SubjectCreatorDialog,
      SubjectItem,
    },
    data: () => ({
      subjects: [
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
