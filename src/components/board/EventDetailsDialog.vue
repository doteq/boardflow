<template>
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
        @click="closeDialog()"
      />
    </v-card-actions>
  </v-card>
  <v-card v-else-if="!event">
    <v-card-title
      v-t="'event-not-found'"
      class="display-1 text-center pa-12 d-block"
    />
    <v-card-actions>
      <v-spacer />
      <v-btn
        v-t="'close'"
        text
        @click="closeDialog()"
      />
    </v-card-actions>
  </v-card>
  <v-card v-else>
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
      <v-col class="d-flex flex-column fill-height overflow-x-hidden">
        <v-card-title
          class="pb-1"
          v-text="event.title"
        />
        <v-card-subtitle class="d-flex align-center pb-0 pt-1 my-0">
          <span
            :class="`${colorString}--text`"
            v-text="$t(`event-types.${event.type}`)"
          />
          <v-spacer />
          <v-sheet
            height="15"
            width="30"
            :color="event.subject.color"
          />
          <span
            class="ml-2"
            v-text="event.subject.name"
          />
        </v-card-subtitle>
        <v-expand-transition>
          <div
            v-if="event.archived"
          >
            <v-alert
              color="red"
              text
              tile
              class="mb-0 mt-4"
            >
              <v-row
                align="center"
                no-gutters
              >
                <v-col class="grow">
                  {{ $t('event-details-dialog.archived') }}
                </v-col>
                <v-col class="shrink">
                  <v-btn
                    v-if="userIsMember && event.archived"
                    text
                    :loading="restoreLoading"
                    @click="restore"
                  >
                    {{ $t('restore') }}
                  </v-btn>
                </v-col>
              </v-row>
            </v-alert>
          </div>
          <div
            v-else-if="event.done !== null"
          >
            <v-alert
              :color="event.done ? 'primary' : 'amber'"
              tile
              text
              class="mb-0 mt-4"
              dense
            >
              <v-row
                align="center"
                no-gutters
              >
                <v-col class="grow">
                  {{ event.done ? $t('event-states.done') : $t('event-states.not-done') }}
                </v-col>
                <v-col class="shrink">
                  <v-btn
                    icon
                    @click="toggleDone()"
                  >
                    <v-icon v-if="event.done">
                      $checkboxOn
                    </v-icon>
                    <v-icon v-else>
                      $checkboxOff
                    </v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-alert>
          </div>
        </v-expand-transition>
        <v-card-text class="overflow-y-auto pt-4">
          <div
            v-if="event.description"
            class="my-2 d-flex align-start"
          >
            <v-icon left>
              mdi-text
            </v-icon>
            <vue-markdown
              :source="event.description"
              class="overflow-x-hidden"
            />
          </div>
          <div class="my-2 d-flex align-start">
            <v-icon left>
              mdi-calendar
            </v-icon>
            <div v-text="dateString" />
          </div>
          <div
            v-if="event.time"
            class="my-2 d-flex align-start"
          >
            <v-icon left>
              mdi-clock-outline
            </v-icon>
            <div v-text="event.time" />
          </div>
          <div
            v-if="event.duration"
            class="my-2 d-flex align-start"
          >
            <v-icon left>
              mdi-timer-sand
            </v-icon>
            <div v-text="durationString" />
          </div>
          <div
            v-if="event.optional"
            class="my-2 d-flex align-start"
          >
            <v-icon left>
              mdi-bullseye-arrow
            </v-icon>
            <div v-text="$t('event-details-dialog.optional-homework')" />
          </div>
          <div class="mt-2 d-flex align-start">
            <v-icon left>
              mdi-account-plus
            </v-icon>
            <div class="d-flex flex-wrap align-center">
              <i18n
                path="event-details-dialog.created.date"
                tag="div"
                class="text-no-wrap mr-1"
              >
                <template v-slot:date>
                  <span
                    class="font-weight-medium"
                    v-text="creationDateString"
                  />
                </template>
              </i18n>
              <i18n
                v-if="creationUser"
                path="event-details-dialog.created.user"
                tag="div"
                class="text-no-wrap"
              >
                <template v-slot:avatar>
                  <v-avatar
                    :size="24"
                  >
                    <v-img :src="creationUser.photoURL" />
                  </v-avatar>
                </template>
                <template v-slot:user>
                  <span
                    class="font-weight-medium"
                    v-text="creationUser.name"
                  />
                </template>
              </i18n>
            </div>
          </div>
        </v-card-text>
        <v-card
          v-if="event.links.length > 0"
          outlined
          class="mx-3 overflow-hidden"
        >
          <v-subheader v-t="'event-details-dialog.links'" />
          <v-list-item
            v-for="link in event.links"
            :key="link"
            :href="link"
            target="_blank"
          >
            <v-list-item-title v-text="link" />
            <v-icon
              small
              right
            >
              mdi-open-in-new
            </v-icon>
          </v-list-item>
        </v-card>
        <v-card-actions class="">
          <v-spacer />
          <template v-if="userIsMember && $vuetify.breakpoint.xsOnly">
            <v-tooltip
              v-if="!event.archived"
              top
            >
              <template v-slot:activator="{ on }">
                <v-btn
                  color="red"
                  icon
                  :loading="archiveLoading"
                  class="mr-2"
                  v-on="on"
                  @click="archive"
                >
                  <v-icon>mdi-archive-arrow-down</v-icon>
                </v-btn>
              </template>
              {{ $t('archive') }}
            </v-tooltip>
            <v-tooltip
              v-if="!event.archived"
              top
            >
              <template v-slot:activator="{ on }">
                <v-btn
                  v-if="!event.archived"
                  icon
                  :to="allEvents ? `/board/${$route.params.boardId}/all-events/event/${event.id}/edit` : `/board/${$route.params.boardId}/event/${event.id}/edit`"
                  v-on="on"
                >
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </template>
              {{ $t('edit') }}
            </v-tooltip>
          </template>
          <template v-else-if="userIsMember">
            <v-btn
              v-if="!event.archived"
              color="red"
              text
              :loading="archiveLoading"
              @click="archive"
            >
              {{ $t('archive') }}
            </v-btn>
            <v-btn
              v-if="!event.archived"
              v-t="'edit'"
              text
              :to="allEvents ? `/board/${$route.params.boardId}/all-events/event/${event.id}/edit` : `/board/${$route.params.boardId}/event/${event.id}/edit`"
            />
          </template>
          <v-btn
            v-t="'close'"
            text
            @click="closeDialog()"
          />
        </v-card-actions>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
  import firebase from 'firebase/app';
  import 'firebase/firestore';
  import humanizeDuration from 'humanize-duration';
  import VueMarkdown from 'vue-markdown';

  export default {
    name: 'EventDetailsDialog',
    components: {
      VueMarkdown,
    },
    props: {
      event: {
        type: Object,
        required: false,
        default: null,
      },
      userIsMember: {
        type: Boolean,
        required: true,
      },
      loading: {
        type: Boolean,
        required: false,
        default: false,
      },
      allEvents: {
        type: Boolean,
        required: false,
        default: false,
      },
    },
    data: () => ({
      archiveLoading: false,
      restoreLoading: false,
    }),
    computed: {
      colorString () {
        if (!this.event) return null;
        return this.event.type;
      },
      creationUser () {
        if (!this.event) return null;
        if (!this.$store.state.userDataList) return null;
        return this.$store.state.userDataList.find((user) => user.id === this.event.creation.user) || null;
      },
      dateString () {
        if (!this.event) return null;
        return new Date(this.event.date).toLocaleDateString(this.$i18n.locale, {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
      },
      creationDateString () {
        return this.event.creation.timestamp.toDate().toLocaleDateString(this.$i18n.locale, {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
      },
      durationString () {
        if (!this.event.duration) return null;

        return humanizeDuration(this.event.duration * 60 * 1000, {
          language: this.$i18n.locale,
          units: ['h', 'm'],
        });
      },
    },
    methods: {
      closeDialog () {
        this.$emit('close');
      },
      async archive () {
        if (this.archiveLoading) return;

        this.archiveLoading = true;

        await new Promise((resolve) => setTimeout(resolve, 250));

        try {
          const boardReference = this.$database.collection('boards').doc(this.$route.params.boardId);
          const eventReference = boardReference.collection('events').doc(this.$route.params.eventId);
          const activityDocumentReference = boardReference.collection('activity').doc();

          const batch = this.$database.batch();

          batch.update(eventReference, {
            archived: true,
          });

          batch.set(activityDocumentReference, {
            type: 'event-archive',
            event: eventReference,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            user: this.$store.state.userAuth.uid,
          });

          await batch.commit();
        } catch (error) {
          console.error(error);
          this.$toast.error(this.$t('toasts.unexpected-error'));
        }

        this.archiveLoading = false;
      },
      async restore () {
        if (this.restoreLoading) return;

        this.restoreLoading = true;

        await new Promise((resolve) => setTimeout(resolve, 250));

        try {
          const boardReference = this.$database.collection('boards').doc(this.$route.params.boardId);
          const eventReference = boardReference.collection('events').doc(this.$route.params.eventId);
          const activityDocumentReference = boardReference.collection('activity').doc();

          const batch = this.$database.batch();

          batch.update(eventReference, {
            archived: false,
          });

          batch.set(activityDocumentReference, {
            type: 'event-restore',
            event: eventReference,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            user: this.$store.state.userAuth.uid,
          });

          await batch.commit();
        } catch (error) {
          console.error(error);
          this.$toast.error(this.$t('toasts.unexpected-error'));
        }

        this.restoreLoading = false;
      },
      async toggleDone () {
        try {
          const boardUserDataReference = this.$database
            .collection('boards').doc(this.$route.params.boardId)
            .collection('user-data').doc(this.$store.state.userAuth.uid);

          if (this.event.done) {
            await boardUserDataReference.set({
              doneHomework: firebase.firestore.FieldValue.arrayRemove(this.event.id),
            }, {
              merge: true,
            });
          } else {
            await boardUserDataReference.set({
              doneHomework: firebase.firestore.FieldValue.arrayUnion(this.event.id),
            }, {
              merge: true,
            });
          }
        } catch (error) {
          console.error(error);
          this.$toast.error(this.$t('toasts.unexpected-error'));
        }
      },
    },
  };
</script>
