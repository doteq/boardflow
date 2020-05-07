<template>
  <div>
    <h1
      class="headline mb-6 text-center"
      v-text="$t('board-settings.subjects.title')"
    />
    <v-card
      v-if="subjects === null"
      outlined
      class="py-1 mb-3"
    >
      <v-skeleton-loader type="list-item-avatar-two-line" />
    </v-card>
    <h1
      v-else-if="subjects.length === 0"
      class="headline px-4 py-12 text-center text--secondary"
      v-text="$t('board-settings.subjects.no-subjects')"
    />
    <subject-item
      v-for="subject in subjects"
      v-else
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
        <v-icon left>
          mdi-plus
        </v-icon>
        {{ $t('subject-creator-dialog.title') }}
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
    props: {
      subjects: {
        type: Array,
        required: false,
        default: null,
      },
    },
    methods: {
      openSubjectCreator () {
        this.$refs.subjectCreatorDialog.show(this.$route.params.boardId);
      },
    },
  };
</script>
