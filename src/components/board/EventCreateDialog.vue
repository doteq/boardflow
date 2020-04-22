<template>
  <v-card>
    <v-row no-gutters>
      <v-col cols="auto">
        <v-sheet
          :color="colorString"
          class="fill-height"
          :width="6"
          tile
        />
      </v-col>
      <v-col>
        <v-card-title>Dodaj nowe wydarzenie</v-card-title>
        <v-card-text class="pt-2">
          <v-form>
            <v-select
              v-model="type"
              :color="colorString"
              :items="types"
              label="Typ"
              required
              outlined
            />
            <v-select
              v-model="subject"
              :color="colorString"
              :items="subjects"
              label="Przedmiot"
              required
              outlined
            >
              <template v-slot:append-item>
                <v-divider />
                <v-list-item link>
                  <v-list-item-icon>
                    <v-icon>mdi-plus</v-icon>
                  </v-list-item-icon>

                  <v-list-item-title>
                    Dodaj nowy
                  </v-list-item-title>
                </v-list-item>
              </template>
            </v-select>
            <v-textarea
              v-model="description"
              :color="colorString"
              label="Opis (opcjonalne)"
              outlined
              auto-grow
            />
            <v-menu
              ref="dateMenu"
              v-model="dateMenuVisible"
              :close-on-content-click="false"
              :return-value.sync="date"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  label="Data"
                  :color="colorString"
                  readonly
                  outlined
                  :value="dateString"
                  append-icon="mdi-menu-down"
                  v-on="on"
                />
              </template>
              <v-date-picker
                v-model="date"
                no-title
                scrollable
                color="secondary"
              >
                <v-spacer />
                <v-btn
                  text
                  color="primary"
                  @click="dateMenuVisible = false"
                >
                  Anuluj
                </v-btn>
                <v-btn
                  text
                  color="primary"
                  @click="$refs.dateMenu.save(date)"
                >
                  OK
                </v-btn>
              </v-date-picker>
            </v-menu>
            <v-row>
              <v-col
                class="my-0"
                :cols="12"
                :sm="type === 'lesson' ? 6 : 12"
              >
                <v-menu
                  ref="startTimeMenu"
                  v-model="startTimeMenuVisible"
                  :close-on-content-click="false"
                  :return-value.sync="startTime"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      :label="type === 'lesson' ? 'Godzina rozpoczęcia (opcjonalne)' : 'Godzina (opcjonalne)'"
                      :color="colorString"
                      readonly
                      outlined
                      :value="startTime"
                      append-icon="mdi-menu-down"
                      v-on="on"
                    />
                  </template>
                  <v-time-picker
                    v-if="startTimeMenuVisible"
                    v-model="startTime"
                    format="24hr"
                    color="secondary"
                  >
                    <v-btn
                      text
                      color="red"
                      @click="$refs.startTimeMenu.save(null)"
                    >
                      Usuń
                    </v-btn>
                    <v-spacer />
                    <v-btn
                      text
                      color="primary"
                      @click="startTimeMenuVisible = false"
                    >
                      Anuluj
                    </v-btn>
                    <v-btn
                      text
                      color="primary"
                      @click="$refs.startTimeMenu.save(startTime)"
                    >
                      OK
                    </v-btn>
                  </v-time-picker>
                </v-menu>
              </v-col>
              <v-col
                v-if="type === 'lesson'"
                class="my-0"
                :cols="12"
                :sm="6"
              >
                <v-menu
                  ref="endTimeMenu"
                  v-model="endTimeMenuVisible"
                  :close-on-content-click="false"
                  :return-value.sync="startTime"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      label="Godzina zakończenia (opcjonalne)"
                      :color="colorString"
                      readonly
                      outlined
                      :value="endTime"
                      append-icon="mdi-menu-down"
                      v-on="on"
                    />
                  </template>
                  <v-time-picker
                    v-if="endTimeMenuVisible"
                    v-model="endTime"
                    format="24hr"
                    color="secondary"
                  >
                    <v-btn
                      text
                      color="red"
                      @click="$refs.endTimeMenu.save(null)"
                    >
                      Usuń
                    </v-btn>
                    <v-spacer />
                    <v-btn
                      text
                      color="primary"
                      @click="endTimeMenuVisible = false"
                    >
                      Anuluj
                    </v-btn>
                    <v-btn
                      text
                      color="primary"
                      @click="$refs.endTimeMenu.save(endTime)"
                    >
                      OK
                    </v-btn>
                  </v-time-picker>
                </v-menu>
              </v-col>
            </v-row>
            <v-checkbox
              v-if="type === 'homework'"
              v-model="optional"
              label="Zadanie dla chętnych"
              class="mt-0"
              :color="colorString"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            text
            @click="closeDialog()"
          >
            Anuluj
          </v-btn>
          <v-btn
            :color="colorString"
            outlined
          >
            Zapisz
          </v-btn>
        </v-card-actions>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
  export default {
    name: 'EventCreateDialog',
    data: () => ({
      title: '',
      types: [
        {
          text: 'Zadanie domowe',
          value: 'homework',
        },
        {
          text: 'Sprawdzian/kartkówka',
          value: 'test',
        },
        {
          text: 'Lekcja',
          value: 'lesson',
        },
      ],
      subjects: [
        {
          text: 'Język Polski',
          value: 'jn41259815915',
        },
        {
          text: 'Język Angielski',
          value: 'ab14212412517',
        },
        {
          text: 'Matematyka',
          value: '4151251fa2512',
        },
      ],
      type: 'homework',
      date: null,
      dateMenuVisible: false,
      startTime: null,
      startTimeMenuVisible: false,
      endTime: null,
      endTimeMenuVisible: false,
      description: '',
      optional: false,
    }),
    computed: {
      colorString () {
        return this.type;
      },
      dateString () {
        if (!this.date) return '';
        return new Date(this.date).toLocaleDateString('pl', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          weekday: 'long',
        });
      },
    },
    methods: {
      closeDialog () {
        this.$emit('close');
      },
    },
  };
</script>
