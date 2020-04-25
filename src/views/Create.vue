<template>
  <v-container class="creator-container">
    <app-bar back-to="/" />
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
          Podstawowe informacje
        </v-stepper-step>
        <v-divider />
        <v-stepper-step
          :complete="subjects.length > 0"
          :editable="step < 3 && step1valid"
          step="2"
          class="py-0"
        >
          Skonfiguruj przedmioty
          <small>Opcjonalne</small>
        </v-stepper-step>
        <v-divider />
        <v-stepper-step step="3">
          Gotowe!
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
              label="Nazwa tablicy"
              outlined
              required
              autofocus
              :counter="50"
            />

            <div class="px-1 subtitle-2">
              Widoczność tablicy
            </div>
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
                        Publiczna
                      </v-card-title>
                      <v-card-text class="text-justify grow">
                        Każda osoba, posiadająca link do tej tablicy, może zobaczyć dodane wpisy, listę członków oraz aktywność. Osoby nie dodane jako członek nie mogą dodawać ani edytować wpisów.
                      </v-card-text>
                      <v-card-actions>
                        <v-btn
                          block
                          text
                          :disabled="active"
                          @click="toggle"
                        >
                          {{ active ? 'Wybrana' : 'Wybierz' }}
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
                        Prywatna
                      </v-card-title>
                      <v-card-text class="text-justify grow">
                        Wszystkie informacje o tablicy, poza jej nazwą, są niewidoczne dla osób, które nie zostały dodane jako członek.
                      </v-card-text>
                      <v-card-actions>
                        <v-btn
                          block
                          text
                          :disabled="active"
                          @click="toggle"
                        >
                          {{ active ? 'Wybrana' : 'Wybierz' }}
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
                color="primary black--text"
                :disabled="!step1valid"
                type="submit"
              >
                Dalej
              </v-btn>
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
              label="Przedmioty"
              :items="defaultSubjects"
              persistent-hint
              outlined
              autofocus
              hint="W ustawieniach możesz dodać w przyszłości więcej przedmiotów oraz zmienić ich kolory. Użytkownicy przy dodawaniu wpisów także mogą dodać przedmiot."
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
                color="primary black--text"
                :loading="submitLoading"
                type="submit"
              >
                Utwórz
              </v-btn>
            </div>
          </v-form>
        </v-stepper-content>
        <v-stepper-content step="3">
          <h1>Gotowe!</h1>
          <span>Wyślij link swoim znajomym i zacznij korzystać z Task Overflow!</span>
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
                outlined
                class="mr-0 ml-2 mb-2 p-0"
                @click="copyText()"
              >
                Kopiuj
              </v-btn>
            </template>
          </v-text-field>
          <div class="d-flex">
            <v-spacer />
            <v-btn
              color="primary black--text"
              :to="`/board/${generatedBoardId}`"
              @click="step = 3"
            >
              Przejdź do tablicy!
            </v-btn>
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
        return new URL(`/board/${this.generatedBoardId}`, window.location.origin);
      },
      step1valid () {
        return !!this.name.trim() && this.name.length <= 50;
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
          this.$toast.error('Wystąpił nieoczekiwany błąd');
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
        this.$toast('Skopiowano link do schowka');
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
