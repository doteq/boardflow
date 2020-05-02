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
        <v-card-subtitle class="py-0 my-0">
          Zadanie domowe
        </v-card-subtitle>
        <v-expand-transition>
          <v-card-subtitle
            v-show="event.archived"
            class="red--text py-0 my-0 text-uppercase title"
          >
            Zarchiwizowane
          </v-card-subtitle>
        </v-expand-transition>
        <v-card-text class="overflow-y-auto mt-4">
          <span v-if="event.description">
            {{ event.description }}
          </span>
          <v-divider
            v-if="event.description"
            class="pa-2 mt-2"
          />
          <div>
            <v-icon>mdi-calendar</v-icon>
            Należy oddać do:
            <span
              class="font-weight-medium"
            >
              {{ dateString }}<span v-if="event.time">, {{ event.time }}</span>
            </span>
          </div>
          <div>
            <v-icon>mdi-account-outline</v-icon>
            Dodane
            <span
              class="font-weight-medium"
              v-text="creationDateString"
            />
            <span v-if="creationUser">
              przez
              <v-chip>
                <v-avatar left>
                  <v-img :src="creationUser.photoURL" />
                </v-avatar>
                {{ creationUser.name }}
              </v-chip>
            </span>
          </div>
          <div v-if="event.optional">
            <v-icon>mdi-newspaper-variant</v-icon> Zadanie nieobowiązkowe
          </div>
          <div v-else>
            <v-icon>mdi-newspaper-variant</v-icon> Zadanie obowiązkowe
          </div>
        </v-card-text>
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
  import firebase from 'firebase';

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
          year: '2-digit',
          month: 'numeric',
          day: 'numeric',
        });
      },
      creationDateString () {
        return this.event.creation.timestamp.toDate().toLocaleDateString(this.$i18n.locale, {
          year: '2-digit',
          month: 'numeric',
          day: 'numeric',
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
