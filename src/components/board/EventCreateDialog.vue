<template>
  <v-dialog
    :value="value"
    :max-width="loading || (!event && edit) ? '500px' : '700px'"
    persistent
    no-click-animation
    @click:outside="close()"
    @keydown.esc="close()"
  >
    <v-card v-if="loading">
      <div
        class="pa-12 d-flex justify-center"
      >
        <v-progress-circular
          indeterminate
          :size="64"
          color="primary"
        />
      </div>
      <v-card-actions>
        <v-spacer />
        <v-btn
          text
          @click="close()"
        >
          Zamknij
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-card v-else-if="!event && edit">
      <v-card-title
        class="display-1 text-center pa-12 d-block"
      >
        Nie znaleziono wpisu
      </v-card-title>
      <v-card-actions>
        <v-spacer />
        <v-btn
          text
          @click="close()"
        >
          Zamknij
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-card v-else>
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
          <v-form
            ref="form"
            v-model="valid"
            @submit.prevent="submit"
          >
            <v-card-text class="pt-2">
              <v-select
                v-model="type"
                :color="colorString"
                :items="types"
                label="Typ"
                required
                outlined
                :disabled="edit"
                :hint="edit ? 'Nie możesz zmienić typu wydarzenia podczas edytowania' : null"
                :persistent-hint="edit"
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
                :rules="subjectRules"
              >
                <template v-slot:append-item>
                  <v-divider />
                  <v-list-item @click="openSubjectCreator">
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
                :rules="titleRules"
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
                        label="Godzina (opcjonalne)"
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
            </v-card-text>
            <v-card-actions>
              <div
                v-if="changes !== null && changes.length === 0"
                class="caption ml-2 mr-2 warning--text"
              >
                Nie dokonałeś żadnych zmian
              </div>
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
                type="submit"
                :disabled="!valid || (changes !== null && changes.length === 0)"
                :loading="submitLoading"
              >
                Zapisz
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-col>
      </v-row>
    </v-card>
    <subject-creator-dialog
      ref="subjectCreatorDialog"
      @created="subject = $event"
    />
  </v-dialog>
</template>

<script>
  import humanizeDuration from 'humanize-duration';
  import isUrl from 'is-url';
  import firebase from 'firebase/app';
  import SubjectCreatorDialog from '../SubjectCreatorDialog.vue';
  import 'firebase/firestore';

  export default {
    name: 'EventCreateDialog',
    components: {
      SubjectCreatorDialog,
    },
    props: {
      value: {
        required: true,
        type: Boolean,
      },
      edit: {
        required: true,
        type: Boolean,
      },
      event: {
        type: Object,
        required: false,
        default: null,
      },
      initialDate: {
        type: String,
        required: false,
        default: null,
      },
      loading: {
        type: Boolean,
        required: false,
        default: false,
      },
      subjects: {
        type: Array,
        required: false,
        default: null,
      },
    },
    data () {
      return {
        valid: false,
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
        subjectRules: [
          (v) => !!v || 'To pole jest wymagane',
        ],
        titleRules: [
          (v) => v.trim().length > 0 || 'To pole jest wymagane',
        ],
        addLinkMenuInputRules: [
          (v) => !v || (isUrl(v) || 'Podaj poprawny adres URL'),
          (v) => !this.links.includes(v) || 'Link jest już dodany',
        ],
        submitLoading: false,
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
      readyForReset () {
        return !this.loading && this.value && (!this.edit || this.event);
      },
      changes () {
        if (!this.edit || !this.event) return null;

        const changes = [];

        if (this.subject !== this.event.subject.id) {
          const subjectsCollection = this.$database.collection('groups').doc(this.$route.params.boardId).collection('subjects');
          changes.push({
            field: 'subject',
            oldValue: subjectsCollection.doc(this.event.subject.id),
            newValue: subjectsCollection.doc(this.subject),
          });
        }

        if (this.title.trim() !== this.event.title) {
          changes.push({
            field: 'title',
            oldValue: this.event.title,
            newValue: this.title.trim(),
          });
        }

        if (this.date !== this.event.date) {
          changes.push({
            field: 'date',
            oldValue: this.event.date,
            newValue: this.date,
          });
        }

        if ((this.time || null) !== this.event.time) {
          changes.push({
            field: 'time',
            oldValue: this.event.time,
            newValue: this.time || null,
          });
        }

        if (['lesson', 'test'].includes(this.type) && (this.duration || null) !== this.event.duration) {
          changes.push({
            field: 'duration',
            oldValue: this.event.duration,
            newValue: this.duration || null,
          });
        }

        if (this.type === 'homework' && this.optional !== this.event.optional) {
          changes.push({
            field: 'optional',
            oldValue: this.event.optional,
            newValue: this.optional,
          });
        }

        if ((this.description.trim() || null) !== this.event.description) {
          changes.push({
            field: 'description',
            oldValue: this.description.trim() || null,
            newValue: this.event.description,
          });
        }

        if (JSON.stringify(this.links) !== JSON.stringify(this.event.links)) {
          changes.push({
            field: 'links',
            oldValue: this.event.links,
            newValue: this.links,
          });
        }

        return changes;
      },
    },
    watch: {
      readyForReset: {
        handler (value) {
          if (value) this.reset();
        },
        immediate: true,
      },
    },
    methods: {
      reset () {
        if (this.edit) {
          this.resetEdit(this.event);
        } else {
          this.resetCreate(this.initialDate);
        }

        this.dateMenuVisible = false;
        this.timeMenuVisible = false;
        this.durationMenuVisible = false;
        this.addLinkMenuVisible = false;
        this.addLinkMenuInput = '';

        this.$nextTick(() => {
          this.$refs.form.resetValidation();
        });
      },
      resetCreate (date) {
        this.date = date;
        this.subject = null;
        this.title = '';
        this.description = '';
        this.optional = false;
        this.type = 'homework';
        this.time = null;
        this.duration = 0;
        this.links = [];
      },
      resetEdit (event) {
        this.date = event.date;
        this.subject = event.subject.id;
        this.title = event.title;
        this.description = event.description || '';
        this.optional = event.optional || false;
        this.type = event.type;
        this.time = event.time;
        this.duration = event.duration || 0;
        this.links = [...event.links];
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
      openSubjectCreator () {
        this.$refs.subjectCreatorDialog.show(this.$route.params.boardId);
      },
      async submit () {
        if (!this.$refs.form.validate() || this.submitLoading || (this.changes !== null && this.changes.length === 0)) return;
        this.submitLoading = true;

        if (this.edit) {
          await this.submitEdit();
        } else {
          await this.submitCreate();
        }

        this.submitLoading = false;
      },
      async submitCreate () {
        try {
          const boardReference = this.$database.collection('boards').doc(this.$route.params.boardId);
          const eventReference = boardReference.collection('events').doc();
          const activityDocumentReference = boardReference.collection('activity').doc();
          const subjectReference = boardReference.collection('subjects').doc(this.subject);

          const data = {
            type: this.type,
            date: this.date,
            time: this.time || null,
            subject: subjectReference,
            title: this.title.trim(),
            description: this.description.trim() || null,
            links: this.links,
            creation: {
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              user: this.$store.state.userAuth.uid,
            },
          };

          if (this.type === 'homework') {
            data.optional = this.optional;
          }

          if (this.type === 'lesson' || this.type === 'test') {
            data.duration = this.duration || null;
          }

          const batch = this.$database.batch();

          batch.set(eventReference, data);
          batch.set(activityDocumentReference, {
            type: 'event-create',
            event: eventReference,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            user: this.$store.state.userAuth.uid,
          });

          await batch.commit();

          this.$toast('Dodano wpis');
          this.close();
        } catch (error) {
          console.error(error);
          this.$toast.error('Wystąpił nieoczekiwany błąd');
        }
      },
      async submitEdit () {
        try {
          const boardReference = this.$database.collection('boards').doc(this.$route.params.boardId);
          const eventReference = boardReference.collection('events').doc(this.event.id);
          const activityDocumentReference = boardReference.collection('activity').doc();
          const subjectReference = boardReference.collection('subjects').doc(this.subject);

          const data = {
            date: this.date,
            time: this.time || null,
            subject: subjectReference,
            title: this.title.trim(),
            description: this.description.trim() || null,
            links: this.links,
          };

          if (this.type === 'homework') {
            data.optional = this.optional;
          }

          if (this.type === 'lesson' || this.type === 'test') {
            data.duration = this.duration || null;
          }

          const batch = this.$database.batch();

          batch.update(eventReference, data);
          batch.set(activityDocumentReference, {
            type: 'event-edit',
            event: eventReference,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            user: this.$store.state.userAuth.uid,
            changes: this.changes,
          });

          await batch.commit();

          this.$toast('Edytowano wpis');
          this.close();
        } catch (error) {
          console.error(error);
          this.$toast.error('Wystąpił nieoczekiwany błąd');
        }
      },
      close () {
        this.$emit('close');
      },
    },
  };
</script>
