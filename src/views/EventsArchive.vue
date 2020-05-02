<template>
  <v-container
    class="events-archive-container"
    :class="{
      'fill-height': (boardInfoLoaded && !boardInfo) || canViewBoard === false || (eventsLoaded && eventItems.length === 0)
    }"
  >
    <app-bar :back-to="`/board/${$route.params.boardId}`">
      {{ $t('events-archive.title') }}
    </app-bar>
    <div
      v-if="boardInfoLoaded && !boardInfo"
      class="d-flex fill-height flex-column align-center justify-center grow"
    >
      <h1
        class="display-1"
        v-text="$t('board-not-found-message')"
      />
    </div>
    <div
      v-else-if="canViewBoard === false"
      class="d-flex fill-height fill-width flex-column align-center justify-center grow"
    >
      <h1
        class="display-1 text-center"
        v-text="$t('board-is-private-message')"
      />
    </div>
    <v-skeleton-loader
      v-else-if="!eventsLoaded"
      type="article"
    />
    <div
      v-else-if="eventItems.length === 0"
      class="d-flex fill-height fill-width flex-column align-center justify-center grow"
    >
      <h1
        class="display-1 text-center"
        v-text="$t('events-archive.no-archived-events')"
      />
    </div>
    <v-card
      v-for="event in eventItems"
      v-else
      :key="event.id"
      class="overflow-hidden mb-3"
    >
      <v-row no-gutters>
        <v-col cols="auto">
          <v-sheet
            :color="event.colorString"
            class="fill-height"
            :width="6"
            tile
          />
        </v-col>
        <v-col>
          <v-card-title v-text="event.title" />
          <v-card-subtitle class="my-0">
            <v-row no-gutters>
              <v-col
                cols="auto"
                class="d-flex align-center mr-2"
              >
                <v-sheet
                  width="25"
                  height="12"
                  :color="event.subject.color"
                />
              </v-col>
              <v-col
                cols="auto"
                v-text="event.subject.name"
              />
              <v-spacer />
              <v-col cols="auto">
                <span
                  v-if="event.type === 'homework'"
                  v-text="$t('event-types.homework')"
                />
                <span
                  v-else-if="event.type === 'lesson'"
                  v-text="$t('event-types.lesson')"
                />
                <span
                  v-else-if="event.type === 'test'"
                  v-text="$t('event-types.test')"
                />
              </v-col>
            </v-row>
          </v-card-subtitle>
          <v-divider />
          <v-card-actions class="pl-0">
            <v-card-subtitle
              cols="auto"
              class="align-self-center py-0"
              v-text="event.time ? $t('events-archive.date-time-string', {date: event.dateString, time: event.time}) : event.dateString"
            />
            <v-spacer />
            <v-btn
              text
              :loading="restoreLoading[event.id] === true"
              @click="restore(event.id)"
            >
              <v-icon left>
                mdi-restore
              </v-icon>
              {{ $t('restore') }}
            </v-btn>
          </v-card-actions>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
  import firebase from 'firebase/app';
  import AppBar from '../components/AppBar.vue';
  import 'firebase/firestore';

  export default {
    components: {
      AppBar,
    },
    data: () => ({
      boardInfo: null,
      boardInfoLoaded: false,
      events: null,
      eventsLoaded: false,
      restoreLoading: {},
    }),
    computed: {
      userIsMember () {
        if (!this.boardInfo) return null;
        if (!this.$store.state.userAuth) return false;
        return this.boardInfo.members.includes(this.$store.state.userAuth.uid);
      },
      canViewBoard () {
        if (!this.boardInfo) return null;
        if (this.userIsMember) return true;
        return this.boardInfo.public;
      },
      eventItems () {
        if (!this.events) return null;
        return this.events.filter((event) => event.archived).map((event) => ({
          id: event.id,
          type: event.type,
          title: event.title,
          subject: event.subject,
          time: event.time,
          dateString: new Date(event.date).toLocaleDateString(this.$i18n.locale, {
            year: this.$vuetify.breakpoint.xsOnly ? '2-digit' : 'numeric',
            month: this.$vuetify.breakpoint.xsOnly ? 'numeric' : 'long',
            day: 'numeric',
          }),
          colorString: event.type,
        }));
      },
    },
    watch: {
      '$route.params.boardId': {
        async handler (value) {
          this.boardInfoLoaded = false;
          try {
            await this.$bind('boardInfo', this.$database.collection('boards-info').doc(value));
          } catch (error) {
            console.error(error);
            this.$toast.error(this.$t('toasts.unexpected-error'));
          }
          this.boardInfoLoaded = true;
        },
        immediate: true,
      },
      canViewBoard: {
        async handler (value) {
          if (value) {
            this.eventsLoaded = false;
            try {
              const boardReference = this.$database
                .collection('boards').doc(this.$route.params.boardId);
              await this.$bind('events', boardReference.collection('events'));
            } catch (error) {
              console.error(error);
              this.$toast.error(this.$t('toasts.unexpected-error'));
            }
            this.eventsLoaded = true;
          } else {
            this.eventsLoaded = false;
            if (this.$firestoreRefs.events) {
              this.$unbind('events');
            }
          }
        },
        immediate: true,
      },
    },
    methods: {
      async restore (eventId) {
        if (this.restoreLoading[eventId]) return;

        this.restoreLoading[eventId] = true;

        await new Promise((resolve) => setTimeout(resolve, 250));

        try {
          const boardReference = this.$database.collection('boards').doc(this.$route.params.boardId);
          const eventReference = boardReference.collection('events').doc(eventId);
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

        this.restoreLoading[eventId] = false;
      },
    },
  };
</script>

<style lang="scss">
  .events-archive-container {
    max-width: 700px;
  }
</style>
