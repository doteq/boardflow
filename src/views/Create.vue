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
        <v-stepper-content step="2">
          <v-form @submit.prevent="submitStep2">
            <v-combobox
              v-model="subjects"
              :search-input.sync="subjectsInput"
              class="pa-2 md-2"
              chips
              multiple
              :label="$t('create.subjects')"
              :items="defaultSubjects"
              persistent-hint
              outlined
              autofocus
              :hint="$t('create.subjects-hint')"
            >
              <template v-slot:selection="data">
                <v-chip
                  :color="chipColor(data.item)"
                  close
                  @click:close="removeSubject(data.index)"
                >
                  <strong>{{ data.item }}</strong>&nbsp;
                </v-chip>
              </template>
            </v-combobox>
            <div class="d-flex">
              <v-spacer />
              <v-btn
                v-t="'create.create'"
                color="primary black--text"
                :loading="submitLoading"
                type="submit"
              />
            </div>
          </v-form>
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
  import AppBar from '../components/AppBar.vue';
  import { getRandomMaterialColor } from '../utils';

  export default {
    name: 'BoardCreation',
    components: {
      AppBar,
    },
    data: () => ({
      step: 1,
      name: '',
      items: [
        {
          text: 'Publiczna',
          value: true,
        },
        {
          text: 'Prywatna',
          value: false,
        },
      ],
      isPublic: true,
      subjects: [],
      subjectsInput: '',
      subjectsOutput: [],
      defaultSubjects: ['Polski', 'j. Angielski', 'Matematyka', 'Historia', 'j. Niemiecki', 'Religia', 'Informatyka', 'Biologia', 'Chemia', 'Geografia', 'Edukacja dla bezpieczeństwa', 'Wychowanie do życia w rodzinie', 'Fizyka', 'Wychowanie fizyczne', 'Godzina wychowawcza'],
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
    },
    watch: {
      subjects () {
        this.subjectsInput = '';
        this.subjectsOutput = this.subjectsOutput.filter((subject) => this.subjects.includes(subject.name));
      },
    },
    methods: {
      submitStep1 () {
        if (this.step1valid) {
          this.step = 2;
        }
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

          this.subjectsOutput.forEach(({ name, color }) => {
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
      chipColor (chip) {
        const subjectObj = this.subjectsOutput.find((obj) => obj.name === chip);
        if (subjectObj) return subjectObj.color;

        const generatedColor = getRandomMaterialColor();
        this.subjectsOutput.push({ name: chip, color: generatedColor });
        return generatedColor;
      },
      copyText () {
        const input = document.getElementById('board-link-input');
        input.select();
        document.execCommand('copy');
        this.$toast('toasts.link-copied');
      },
      removeSubject (index) {
        this.subjects.splice(index, 1);
      },
    },
  };
</script>

<style scoped>
  .creator-container {
    max-width: 700px;
  }

  .background-color-transition {
    transition: background-color 200ms;
  }
</style>
