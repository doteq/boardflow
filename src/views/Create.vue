<template>
  <v-container class="creator-container">
    <app-bar back-to="/">
      {{ $t('create.title') }}
    </app-bar>
    <v-stepper
      v-model="step"
      class="mb-9"
    >
      <v-stepper-header>
        <v-stepper-step
          :complete="step1valid"
          :editable="step < 3"
          step="1"
        >
          {{ $t('create.basic-info') }}
        </v-stepper-step>
        <v-divider />
        <v-stepper-step
          :complete="subjects.length > 0"
          :editable="step < 3 && step1valid"
          step="2"
          class="py-0"
        >
          {{ $t('create.configure-subjects') }}
          <small v-text="$t('create.optional')" />
        </v-stepper-step>
        <v-divider />
        <v-stepper-step
          step="3"
        >
          {{ $t('create.ready') }}
        </v-stepper-step>
      </v-stepper-header>
      <v-stepper-items>
        <v-stepper-content step="1">
          <v-form
            class="pa-2"
            @submit.prevent="submitStep1"
          >
            <v-text-field
              v-model="name"
              :label="$t('create.board-name')"
              outlined
              required
              autofocus
              :counter="50"
              :counter-value="(value) => value.trim().length"
            />

            <div
              class="px-1 subtitle-2"
              v-text="$t('visibility.title')"
            />
            <v-item-group
              v-model="isPublic"
              active-class="primary"
              mandatory
            >
              <v-row>
                <v-col
                  :cols="12"
                  :sm="6"
                >
                  <v-item
                    v-slot:default="{ active, toggle }"
                    :value="true"
                  >
                    <v-card
                      :raised="active"
                      :flat="!active"
                      class="fill-height grow d-flex flex-column background-color-transition"
                      :color="active ? 'accent' : undefined"
                    >
                      <v-card-title class="text-center d-block">
                        <v-icon left>
                          mdi-eye
                        </v-icon>
                        {{ $t('visibility.public.title') }}
                      </v-card-title>
                      <v-card-text
                        v-t="'visibility.public.description'"
                        class="text-justify grow"
                      />
                      <v-card-actions>
                        <v-btn
                          block
                          text
                          :disabled="active"
                          @click="toggle"
                        >
                          {{ active ? $t('create.selected') : $t('create.select') }}
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-item>
                </v-col>
                <v-col
                  :cols="12"
                  :sm="6"
                >
                  <v-item
                    v-slot:default="{ active, toggle }"
                    :value="false"
                  >
                    <v-card
                      :raised="active"
                      :flat="!active"
                      class="fill-height grow d-flex flex-column background-color-transition"
                      :color="active ? 'accent' : undefined"
                    >
                      <v-card-title class="text-center d-block">
                        <v-icon left>
                          mdi-lock
                        </v-icon>
                        {{ $t('visibility.private.title') }}
                      </v-card-title>
                      <v-card-text
                        v-t="'visibility.private.description'"
                        class="text-justify grow"
                      />
                      <v-card-actions>
                        <v-btn
                          block
                          text
                          :disabled="active"
                          @click="toggle"
                        >
                          {{ active ? $t('create.selected') : $t('create.select') }}
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-item>
                </v-col>
              </v-row>
            </v-item-group>

            <div class="d-flex mt-4">
              <v-spacer />
              <v-btn
                v-t="'next'"
                color="primary black--text"
                :disabled="!step1valid"
                type="submit"
              />
            </div>
          </v-form>
        </v-stepper-content>
        <v-stepper-content
          step="2"
          :class="{
            'px-2': $vuetify.breakpoint.xsOnly,
          }"
        >
          <v-card
            outlined
          >
            <v-subheader v-t="'create.added-subjects'" />
            <v-list subheader>
              <v-list-item v-if="subjects.length === 0">
                <v-list-item-title
                  v-t="'create.no-added-subjects'"
                  class="text--secondary"
                />
              </v-list-item>
              <added-subject-item
                v-for="subject in subjects"
                :key="subject.key"
                :subject="subject"
                :is-subject-already-added="isSubjectAlreadyAdded"
                @click:remove="removeSubject(subject.key)"
                @name-change="subject.name = $event"
                @color-change="subject.color = $event"
              />
            </v-list>
            <v-divider />
            <v-subheader v-t="'create.suggested-subjects'" />
            <v-list
              subheader
              dense
              class="overflow-y-auto suggested-subjects-list"
            >
              <v-list-item v-if="suggestedSubjects.length === 0">
                <v-list-item-title
                  v-t="'create.no-suggested-subjects'"
                  class="text--secondary"
                />
              </v-list-item>
              <v-list-item
                v-for="subjectName in suggestedSubjects"
                :key="subjectName"
                link
                @click="addDefaultSubject(subjectName)"
              >
                <v-list-item-title v-text="subjectName" />
                <v-icon>
                  mdi-plus
                </v-icon>
              </v-list-item>
            </v-list>
            <v-divider />
            <v-subheader v-t="'create.add-subject'" />
            <v-form @submit.prevent="addCustomSubject">
              <v-text-field
                v-model="subjectInput"
                class="mx-3"
                outlined
                :hint="$t('create.press-enter-to-add')"
                :counter="30"
                :counter-value="(value) => value.trim().length"
                :error-messages="subjectNameErrors"
              >
                <template v-slot:append-outer>
                  <v-icon
                    :disabled="subjectNameErrors.length > 0 || subjectInput.trim() === ''"
                    color="primary"
                    @click="addCustomSubject"
                  >
                    mdi-plus
                  </v-icon>
                </template>
              </v-text-field>
            </v-form>
          </v-card>
          <div class="d-flex mt-6">
            <v-spacer />
            <v-btn
              color="primary black--text"
              :loading="submitLoading"
              @click="submitStep2"
            >
              {{ subjects.length > 0 ? $t('create.create') : $t('create.skip-and-create') }}
            </v-btn>
          </div>
        </v-stepper-content>
        <v-stepper-content step="3">
          <h1 v-text="$t('create.ready')" />
          <span v-text="$t('create.start-using-message')" />
          <v-text-field
            id="board-link-input"
            :value="link"
            outlined
            filled
            readonly
            dense
            class="mt-4"
          >
            <template v-slot:append>
              <v-btn
                v-if="$vuetify.breakpoint.xsOnly"
                icon
                class="mr-0 ml-2 mb-2 p-0"
                @click="copyText()"
              >
                <v-icon>mdi-content-copy</v-icon>
              </v-btn>
              <v-btn
                v-else
                v-t="'copy'"
                outlined
                class="mr-0 ml-2 mb-2 p-0"
                @click="copyText()"
              />
            </template>
          </v-text-field>
          <div class="d-flex">
            <v-spacer />
            <v-btn
              v-t="'create.go-to-board'"
              color="primary black--text"
              :to="`/board/${generatedBoardId}`"
              @click="step = 3"
            />
          </div>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </v-container>
</template>

<script>
  import _ from 'lodash';
  import AppBar from '../components/AppBar.vue';
  import { baseColorsArray } from '../utils';
  import AddedSubjectItem from '../components/create/AddedSubjectItem.vue';

  export default {
    name: 'BoardCreation',
    components: {
      AddedSubjectItem,
      AppBar,
    },
    data: () => ({
      step: 1,
      name: '',
      isPublic: true,
      subjects: [],
      subjectInput: '',
      generatedBoardId: null,
      submitLoading: false,
    }),
    computed: {
      link () {
        if (!this.generatedBoardId) return null;
        return new URL(`/board/${this.generatedBoardId}`, window.location.origin).toString();
      },
      step1valid () {
        return !!this.name.trim() && this.name.trim().length <= 50;
      },
      subjectNameErrors () {
        const errors = [];

        if (this.subjectInput.trim().length > 30) {
          errors.push(this.$t('create.max-length-30-message'));
        }

        if (this.isSubjectAlreadyAdded(this.subjectInput.trim())) {
          errors.push(this.$t('create.subject-duplicate-message'));
        }

        return errors;
      },
      suggestedSubjects () {
        return this.$t('suggested-subjects').filter((subjectName) => this.subjects.findIndex(
          (subject) => subject.name.toLowerCase() === subjectName.toLowerCase(),
        ) === -1).sort();
      },
      routeTitle () {
        return this.$t('routes.create');
      },
    },
    watch: {
      routeTitle: {
        handler (value) {
          document.title = value;
        },
        immediate: true,
      },
    },
    methods: {
      submitStep1 () {
        if (this.step1valid) {
          this.step = 2;
        }
      },
      getUniqueRandomColor () {
        const unusedBaseColors = _.without(
          baseColorsArray.map((color) => color.toUpperCase()),
          ...this.subjects.map((subject) => subject.color.toUpperCase()),
        );

        if (unusedBaseColors.length === 0) {
          return _.sample(baseColorsArray).toUpperCase();
        }
        return _.sample(unusedBaseColors).toUpperCase();
      },
      isSubjectAlreadyAdded (name) {
        const subjectNames = this.subjects.map((subject) => subject.name.toLowerCase());

        return subjectNames.includes(name.toLowerCase());
      },
      addDefaultSubject (name) {
        this.subjects.push({
          color: this.getUniqueRandomColor(),
          name,
          key: _.uniqueId(),
        });
      },
      addCustomSubject () {
        if (this.subjectNameErrors.length > 0 || this.subjectInput.trim() === '') return;

        this.subjects.push({
          color: this.getUniqueRandomColor(),
          name: this.subjectInput,
          key: _.uniqueId(),
        });

        this.subjectInput = '';
      },
      removeSubject (key) {
        this.subjects.splice(this.subjects.findIndex((subject) => subject.key === key), 1);
      },
      async submitStep2 () {
        if (this.submitLoading) return;

        if (!this.$store.state.userAuth) {
          // TODO: Replace with fullscreen info
          this.$toast.error('Użytkownik nie jest zalogowany');
          return;
        }

        this.submitLoading = true;

        try {
          await new Promise((resolve) => setTimeout(resolve, 1000));

          const boardInfoReference = this.$database.collection('boards-info').doc();
          const boardReference = this.$database.collection('boards').doc(boardInfoReference.id);
          const subjectsReference = boardReference.collection('subjects');

          await boardInfoReference.set({
            admins: [
              this.$store.state.userAuth.uid,
            ],
            members: [
              this.$store.state.userAuth.uid,
            ],
            owner: this.$store.state.userAuth.uid,
            name: this.name,
            public: this.isPublic,
          });

          const batch = this.$database.batch();

          this.subjects.forEach(({ name, color }) => {
            batch.set(subjectsReference.doc(), {
              name,
              color,
            });
          });

          await batch.commit();

          this.generatedBoardId = boardInfoReference.id;
          this.step = 3;
        } catch (error) {
          console.error(error);
          this.$toast.error(this.$t('toasts.unexpected-error'));
        }
        this.submitLoading = false;
      },
      copyText () {
        const input = document.getElementById('board-link-input');
        input.select();
        document.execCommand('copy');
        this.$toast('toasts.link-copied');
      },
    },
  };
</script>

<style scoped lang="scss">
  .creator-container {
    max-width: 700px;

    .background-color-transition {
      transition: background-color 200ms;
    }

    .suggested-subjects-list {
      max-height: 300px;
    }
  }
</style>
