<template>
  <v-dialog
    :value="value"
    :max-width="ready ? '700px' : '500px'"
    persistent
    scrollable
    :fullscreen="$vuetify.breakpoint.xsOnly && ready"
    @keydown.esc="close()"
    @click:outside="ready ? null : close()"
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
          v-t="'close'"
          text
          @click="close()"
        />
      </v-card-actions>
    </v-card>
    <v-card v-else-if="!$store.state.userAuth">
      <div
        class="display-1 text-center py-12 px-8"
        v-text="$t(`event-create-dialog.not-signed-in-message.${edit ? 'edit' : 'create'}`)"
      />
      <v-card-actions>
        <v-spacer />
        <v-btn
          v-t="'close'"
          text
          @click="close()"
        />
      </v-card-actions>
    </v-card>
    <v-card v-else-if="userIsMember === false">
      <div
        class="display-1 text-center py-12 px-8"
        v-text="$t(`event-create-dialog.not-a-board-member-message.${edit ? 'edit' : 'create'}`)"
      />
      <v-card-actions>
        <v-spacer />
        <v-btn
          v-t="'close'"
          text
          @click="close()"
        />
      </v-card-actions>
    </v-card>
    <v-card v-else-if="!event && edit">
      <div
        class="display-1 text-center py-12 px-8"
        v-text="$t('event-not-found')"
      />
      <v-card-actions>
        <v-spacer />
        <v-btn
          v-t="'close'"
          text
          @click="close()"
        />
      </v-card-actions>
    </v-card>
    <v-card v-else-if="edit && event.archived">
      <div
        class="display-1 text-center py-12 px-8"
        v-text="$t('event-create-dialog.event-archived-message')"
      />
      <v-card-actions>
        <v-spacer />
        <v-btn
          v-t="'close'"
          text
          @click="close()"
        />
      </v-card-actions>
    </v-card>
    <v-card v-else-if="!typeValid && !edit">
      <div
        class="display-1 text-center py-12 px-8"
        v-text="$t('event-create-dialog.select-event-type')"
      />
      <v-card-text class="d-flex flex-column align-center">
        <v-btn
          class="mt-4"
          block
          color="homework"
          outlined
          :to="`/board/${$route.params.boardId}/create-event/homework`"
        >
          <v-icon left>
            mdi-clipboard-text
          </v-icon>
          <v-spacer />
          {{ $t('event-types.homework') }}
          <v-spacer />
        </v-btn>
        <v-btn
          class="mt-4"
          block
          color="lesson"
          outlined
          :to="`/board/${$route.params.boardId}/create-event/lesson`"
        >
          <v-icon left>
            mdi-message-video
          </v-icon>
          <v-spacer />
          {{ $t('event-types.lesson') }}
          <v-spacer />
        </v-btn>
        <v-btn
          class="mt-4"
          block
          color="test"
          outlined
          :to="`/board/${$route.params.boardId}/create-event/test`"
        >
          <v-icon left>
            mdi-comment-question
          </v-icon>
          <v-spacer />
          {{ $t('event-types.test') }}
          <v-spacer />
        </v-btn>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          v-t="'close'"
          text
          @click="close()"
        />
      </v-card-actions>
    </v-card>
    <v-card v-else>
      <v-form
        ref="form"
        v-model="valid"
        class="d-block fill-height"
        @submit.prevent="submit"
      >
        <v-row
          no-gutters
          class="fill-height"
        >
          <v-col cols="auto">
            <v-sheet
              :color="colorString"
              class="fill-height"
              :width="6"
              tile
            />
          </v-col>
          <v-col class="d-flex flex-column fill-height">
            <v-card-title v-t="`event-create-dialog.title-${edit ? 'edit' : 'create'}.${type}`" />
            <v-card-text
              class="pt-2 overflow-y-auto"
            >
              <v-select
                v-model="subject"
                :color="colorString"
                :items="subjectItems || []"
                :loading="subjectItems === null"
                :disabled="subjectItems === null"
                :label="$t('event-create-dialog.subject')"
                required
                outlined
                prepend-icon="mdi-book-outline"
                :rules="subjectRules"
              >
                <template v-slot:append-item>
                  <v-divider />
                  <v-list-item @click="openSubjectCreator">
                    <v-list-item-icon>
                      <v-icon>mdi-plus</v-icon>
                    </v-list-item-icon>

                    <v-list-item-title v-t="'event-create-dialog.add-new-subject-short'" />
                  </v-list-item>
                </template>
                <template v-slot:no-data>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title
                        v-t="'event-create-dialog.no-subjects.title'"
                        class="text--secondary"
                      />
                      <v-list-item-subtitle
                        v-t="'event-create-dialog.no-subjects.subtitle'"
                        class="text--secondary mt-2"
                      />
                    </v-list-item-content>
                  </v-list-item>
                </template>
              </v-select>
              <v-text-field
                v-model="title"
                :label="$t('event-create-dialog.title')"
                outlined
                :color="colorString"
                :rules="titleRules"
                prepend-icon="mdi-text-short"
              />
              <v-textarea
                v-model="description"
                :color="colorString"
                :label="$t('event-create-dialog.optional-label', [$t('event-create-dialog.description')])"
                outlined
                auto-grow
                prepend-icon="mdi-text"
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
                    :label="$t('event-create-dialog.date')"
                    :color="colorString"
                    readonly
                    outlined
                    :value="dateString"
                    prepend-icon="mdi-calendar"
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
                    v-t="'cancel'"
                    text
                    color="primary"
                    @click="dateMenuVisible = false"
                  />
                  <v-btn
                    v-t="'ok'"
                    text
                    color="primary"
                    @click="$refs.dateMenu.save(date)"
                  />
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
                        :label="$t('event-create-dialog.optional-label', [$t('event-create-dialog.time')])"
                        :color="colorString"
                        readonly
                        outlined
                        :value="time"
                        prepend-icon="mdi-clock-outline"
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
                        v-t="'remove'"
                        text
                        color="red"
                        @click="$refs.timeMenu.save(null)"
                      />
                      <v-spacer />
                      <v-btn
                        v-t="'cancel'"
                        text
                        color="primary"
                        @click="timeMenuVisible = false"
                      />
                      <v-btn
                        v-t="'ok'"
                        text
                        color="primary"
                        @click="$refs.timeMenu.save(time)"
                      />
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
                        :label="$t('event-create-dialog.optional-label', [$t('event-create-dialog.duration')])"
                        :color="colorString"
                        readonly
                        outlined
                        prepend-icon="mdi-timer-sand"
                        :value="durationString"
                        v-on="on"
                      />
                    </template>
                    <v-card>
                      <v-row class="mx-4 mt-4">
                        <v-col :cols="6">
                          <v-text-field
                            v-model.number="durationHours"
                            type="number"
                            :label="$t('event-create-dialog.hours')"
                            outlined
                            min="0"
                            max="23"
                          />
                        </v-col>
                        <v-col :cols="6">
                          <v-text-field
                            v-model.number="durationMinutes"
                            type="number"
                            :label="$t('event-create-dialog.minutes')"
                            outlined
                            min="0"
                            max="59"
                          />
                        </v-col>
                      </v-row>
                      <v-card-actions>
                        <v-btn
                          v-t="'remove'"
                          text
                          color="red"
                          @click="$refs.durationMenu.save(null)"
                        />
                        <v-spacer />
                        <v-btn
                          v-t="'cancel'"
                          text
                          color="primary"
                          @click="durationMenuVisible = false"
                        />
                        <v-btn
                          v-t="'ok'"
                          text
                          color="primary"
                          @click="$refs.durationMenu.save(duration)"
                        />
                      </v-card-actions>
                    </v-card>
                  </v-menu>
                </v-col>
              </v-row>
              <v-card
                outlined
                class="overflow-hidden"
              >
                <v-subheader v-text="$t('event-create-dialog.optional-label', [$t('event-create-dialog.links')])" />
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

                      <v-list-item-title v-t="'event-create-dialog.add-new-link-short'" />
                    </v-list-item>
                  </template>
                  <v-card>
                    <v-form @submit.prevent="addLinkMenuSave">
                      <v-card-text class="pb-0">
                        <v-text-field
                          v-model="addLinkMenuInput"
                          :label="$t('event-create-dialog.url-address')"
                          outlined
                          :rules="addLinkMenuInputRules"
                          autofocus
                          :color="colorString"
                        />
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer />
                        <v-btn
                          v-t="'cancel'"
                          text
                          color="primary"
                          @click="addLinkMenuVisible = false"
                        />
                        <v-btn
                          v-t="'add'"
                          text
                          color="primary"
                          type="submit"
                          :disabled="!addLinkMenuValid"
                        />
                      </v-card-actions>
                    </v-form>
                  </v-card>
                </v-menu>
              </v-card>
              <v-checkbox
                v-if="type === 'homework'"
                v-model="optional"
                :label="$t('event-create-dialog.optional-homework')"
                class="mt-8"
                :color="colorString"
              />
            </v-card-text>
            <v-card-actions>
              <v-fade-transition>
                <div
                  v-if="changes !== null && changes.length === 0"
                  class="caption ml-2 mr-2 warning--text"
                  v-text="$t('event-create-dialog.no-changes-message')"
                />
              </v-fade-transition>
              <v-spacer />
              <v-btn
                v-t="'cancel'"
                text
                @click="close()"
              />
              <v-btn
                :color="colorString"
                outlined
                type="submit"
                :disabled="!valid || (changes !== null && changes.length === 0)"
                :loading="submitLoading"
              >
                {{ $t('save') }}
              </v-btn>
            </v-card-actions>
          </v-col>
        </v-row>
      </v-form>
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
      userIsMember: {
        type: Boolean,
        required: false,
        default: null,
      },
    },
    data () {
      return {
        valid: false,
        subject: null,
        title: '',
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
          (v) => !!v || this.$t('event-create-dialog.rules.field-required'),
        ],
        titleRules: [
          (v) => v.trim().length > 0 || this.$t('event-create-dialog.rules.field-required'),
        ],
        addLinkMenuInputRules: [
          (v) => !v || (isUrl(v) || this.$t('event-create-dialog.rules.invalid-url')),
          (v) => !this.links.includes(v) || this.$t('event-create-dialog.rules.link-already-added'),
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
          language: this.$i18n.locale,
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
        return new Date(this.date).toLocaleDateString(this.$i18n.locale, {
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
      changes () {
        if (!this.edit || !this.event || !this.ready) return null;

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
      ready () {
        return !this.loading &&
          ((this.event && !this.event.archived) || !this.edit) &&
          this.$store.state.userAuth !== null &&
          this.userIsMember &&
          this.value &&
          this.typeValid;
      },
      type () {
        if (this.edit) {
          return this.event.type;
        }

        return this.$route.params.eventType;
      },
      typeValid () {
        return ['homework', 'test', 'lesson'].includes(this.type);
      },
    },
    watch: {
      ready: {
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
            archived: false,
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

          this.$toast(this.$t('toasts.event-added'));
          this.close();
        } catch (error) {
          console.error(error);
          this.$toast.error(this.$t('toasts.unexpected-error'));
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

          this.$toast(this.$t('toasts.event-edited'));
          this.close();
        } catch (error) {
          console.error(error);
          this.$toast.error(this.$t('toasts.unexpected-error'));
        }
      },
      close () {
        this.$emit('close');
      },
    },
  };
</script>
