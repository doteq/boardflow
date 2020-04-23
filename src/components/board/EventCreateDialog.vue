<template>
  <v-dialog
    v-model="visible"
    max-width="700px"
  >
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
                :items="subjectItems || []"
                :loading="subjectItems === null"
                :disabled="subjectItems === null"
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
              <v-text-field
                v-model="title"
                label="Tytuł"
                outlined
                :color="colorString"
              />
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
                  :sm="['lesson', 'test'].includes(type) ? 6 : 12"
                >
                  <v-menu
                    ref="timeMenu"
                    v-model="timeMenuVisible"
                    :close-on-content-click="false"
                    :return-value.sync="time"
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
                        :value="time"
                        append-icon="mdi-menu-down"
                        v-on="on"
                      />
                    </template>
                    <v-time-picker
                      v-if="timeMenuVisible"
                      v-model="time"
                      format="24hr"
                      color="secondary"
                    >
                      <v-btn
                        text
                        color="red"
                        @click="$refs.timeMenu.save(null)"
                      >
                        Usuń
                      </v-btn>
                      <v-spacer />
                      <v-btn
                        text
                        color="primary"
                        @click="timeMenuVisible = false"
                      >
                        Anuluj
                      </v-btn>
                      <v-btn
                        text
                        color="primary"
                        @click="$refs.timeMenu.save(time)"
                      >
                        OK
                      </v-btn>
                    </v-time-picker>
                  </v-menu>
                </v-col>
                <v-col
                  v-if="type === 'lesson' || type === 'test'"
                  class="my-0"
                  :cols="12"
                  :sm="6"
                >
                  <v-menu
                    ref="durationMenu"
                    v-model="durationMenuVisible"
                    :close-on-content-click="false"
                    :return-value.sync="duration"
                    transition="scale-transition"
                    offset-y
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        label="Czas trwania (opcjonalne)"
                        :color="colorString"
                        readonly
                        outlined
                        :value="durationString"
                        append-icon="mdi-menu-down"
                        v-on="on"
                      />
                    </template>
                    <v-card>
                      <v-row class="mx-4 mt-4">
                        <v-col :cols="6">
                          <v-text-field
                            v-model.number="durationHours"
                            type="number"
                            label="Godziny"
                            outlined
                            min="0"
                            max="23"
                          />
                        </v-col>
                        <v-col :cols="6">
                          <v-text-field
                            v-model.number="durationMinutes"
                            type="number"
                            label="Minuty"
                            outlined
                            min="0"
                            max="59"
                          />
                        </v-col>
                      </v-row>
                      <v-card-actions>
                        <v-btn
                          text
                          color="red"
                          @click="$refs.durationMenu.save(null)"
                        >
                          Usuń
                        </v-btn>
                        <v-spacer />
                        <v-btn
                          text
                          color="primary"
                          @click="durationMenuVisible = false"
                        >
                          Anuluj
                        </v-btn>
                        <v-btn
                          text
                          color="primary"
                          @click="$refs.durationMenu.save(duration)"
                        >
                          OK
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-menu>
                </v-col>
              </v-row>
              <v-card outlined>
                <v-subheader>Linki (opcjonalne)</v-subheader>
                <v-list-item
                  v-for="(link, index) in links"
                  :key="link"
                >
                  <v-list-item-title v-text="link" />

                  <v-list-item-action>
                    <v-btn
                      icon
                      @click="removeLink(index)"
                    >
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>
                <v-divider />
                <v-menu
                  v-model="addLinkMenuVisible"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                >
                  <template v-slot:activator="{ on }">
                    <v-list-item
                      link
                      v-on="on"
                    >
                      <v-list-item-icon>
                        <v-icon>mdi-plus</v-icon>
                      </v-list-item-icon>

                      <v-list-item-title>
                        Dodaj nowy
                      </v-list-item-title>
                    </v-list-item>
                  </template>
                  <v-card>
                    <v-form @submit.prevent="addLinkMenuSave">
                      <v-card-text class="pb-0">
                        <v-text-field
                          v-model="addLinkMenuInput"
                          label="Adres URL"
                          outlined
                          :rules="addLinkMenuInputRules"
                          autofocus
                          :color="colorString"
                        />
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer />
                        <v-btn
                          text
                          color="primary"
                          @click="addLinkMenuVisible = false"
                        >
                          Anuluj
                        </v-btn>
                        <v-btn
                          text
                          color="primary"
                          type="submit"
                          :disabled="!addLinkMenuValid"
                        >
                          Dodaj
                        </v-btn>
                      </v-card-actions>
                    </v-form>
                  </v-card>
                </v-menu>
              </v-card>
              <v-checkbox
                v-if="type === 'homework'"
                v-model="optional"
                label="Zadanie dla chętnych"
                class="mt-8"
                :color="colorString"
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              text
              @click="close()"
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
  </v-dialog>
</template>

<script>
  import humanizeDuration from 'humanize-duration';
  import isUrl from 'is-url';

  export default {
    name: 'EventCreateDialog',
    props: {
      subjects: {
        type: Array,
        required: false,
        default: null,
      },
    },
    data () {
      return {
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
        subject: null,
        title: '',
        type: 'homework',
        date: null,
        dateMenuVisible: false,
        time: null,
        timeMenuVisible: false,
        description: '',
        duration: 0,
        durationMenuVisible: false,
        optional: false,
        links: false,
        addLinkMenuVisible: false,
        addLinkMenuInput: '',
        edit: false,
        visible: false,
        addLinkMenuInputRules: [
          (v) => !v || (isUrl(v) || 'Podaj poprawny adres URL'),
          (v) => !this.links.includes(v) || 'Link jest już dodany',
        ],
      };
    },
    computed: {
      subjectItems () {
        if (!this.subjects) return null;
        return this.subjects.map((subject) => ({
          text: subject.name,
          value: subject.id,
        }));
      },
      durationString () {
        if (this.duration === 0) return '';

        return humanizeDuration(this.duration * 60 * 1000, {
          language: 'pl',
          units: ['h', 'm'],
        });
      },
      durationHours: {
        get () {
          if (this.duration === null) return 0;
          return Math.floor(this.duration / 60);
        },
        set (value) {
          this.duration = value * 60 + this.durationMinutes;
        },
      },
      durationMinutes: {
        get () {
          if (this.duration === null) return 0;
          return this.duration % 60;
        },
        set (value) {
          this.duration = this.durationHours * 60 + value;
        },
      },
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
      addLinkMenuValid () {
        if (this.addLinkMenuInput === '') return false;
        if (this.links.includes(this.addLinkMenuInput)) return false;
        return isUrl(this.addLinkMenuInput);
      },
    },
    methods: {
      showCreateDialog (date) {
        this.date = date;
        this.subject = null;
        this.title = '';
        this.description = '';
        this.optional = false;
        this.type = 'homework';
        this.dateMenuVisible = false;
        this.time = null;
        this.timeMenuVisible = false;
        this.duration = null;
        this.durationMenuVisible = false;
        this.links = [];
        this.addLinkMenuVisible = false;
        this.addLinkMenuInput = '';

        this.visible = true;
        this.edit = false;
      },
      addLinkMenuSave () {
        if (!this.addLinkMenuValid) return;
        this.links.push(this.addLinkMenuInput);
        this.addLinkMenuInput = '';
        this.addLinkMenuVisible = false;
      },
      removeLink (index) {
        this.links.splice(index, 1);
      },
      close () {
        this.visible = false;
      },
    },
  };
</script>
