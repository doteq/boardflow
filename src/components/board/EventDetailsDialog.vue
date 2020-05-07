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
      <v-col class="d-flex flex-column fill-height">
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
          <v-card-subtitle
            v-show="event.archived"
            v-t="'event-details-dialog.archived'"
            class="red--text py-0 my-0 text-uppercase title"
          />
        </v-expand-transition>
        <v-card-text class="overflow-y-auto mt-2">
          <div
            v-if="event.description"
            class="my-2 d-flex align-start"
          >
            <v-icon left>
              mdi-text
            </v-icon>
            <div v-text="event.description" />
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
        <v-card-actions>
          <v-spacer />
          <template v-if="userIsMember">
            <v-btn
              v-if="event.archived"
              text
              :loading="restoreLoading"
              @click="restore"
            >
              {{ $t('restore') }}
            </v-btn>
            <v-btn
              v-else
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
              :to="`/board/${$route.params.boardId}/event/${event.id}/edit`"
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

  export default {
    name: 'EventDetailsDialog',
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
    },
  };
</script>
