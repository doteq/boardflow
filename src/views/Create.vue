<template>
  <v-container class="creator-container">
    <app-bar back-to="/" />
    <v-stepper v-model="step">
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
            <v-select
              v-model="isPublic"
              :items="items"
              label="Prywatność tablicy"
              required
              outlined
            />

            <div class="d-flex">
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
      isPublic: false,
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
          const batch = this.$database.batch();

          const boardInfoReference = this.$database.collection('boards-info').doc();
          const boardReference = this.$database.collection('boards').doc(boardInfoReference.id);
          const subjectsReference = boardReference.collection('subjects');

          batch.set(boardInfoReference, {
            admins: [
              this.$store.state.userAuth.uid,
            ],
            members: [
              this.$store.state.userAuth.uid,
            ],
            name: this.name,
            public: this.isPublic,
          });

          batch.set(boardReference, {});

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
        console.log(subjectObj);
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
    },
  };
</script>

<style scoped>
  .creator-container {
    max-width: 700px;
  }
</style>
