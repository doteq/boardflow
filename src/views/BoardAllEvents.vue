<template>
  <v-container class="board-events-container">
    <app-bar
      :back-to="`/board/${$route.params.boardId}`"
    />
    <event-list
      :events="currentEvents"
      all-events
    />
    <event-create-dialog
      ref="eventCreateDialog"
      :subjects="subjects"
      :initial-date="new Date().toISOString().split('T')[0]"
      :value="$route.name === 'BoardAllEventsEdit'"
      edit
      :loading="!eventsAndSubjectsLoaded || !boardInfoLoaded"
      :event="dialogEvent || lastDialogEvent"
      :user-is-member="userIsMember"
      @close="closeCreatorDialog()"
    />
    <v-dialog
      :value="$route.name === 'BoardAllEventsEvent' && canViewBoard === true"
      scrollable
      max-width="500px"
      persistent
      no-click-animation
      @click:outside="closeEventDetailsDialog()"
      @keydown.esc="closeEventDetailsDialog()"
    >
      <event-details-dialog
        :loading="!eventsAndSubjectsLoaded"
        :event="dialogEvent || lastDialogEvent"
        :user-is-member="userIsMember"
        @close="closeEventDetailsDialog()"
      />
    </v-dialog>
  </v-container>
</template>

<script>
  import AppBar from '../components/AppBar.vue';
  import EventList from '../components/board/EventList.vue';
  import EventDetailsDialog from '../components/board/EventDetailsDialog.vue';
  import EventCreateDialog from '../components/board/EventCreateDialog.vue';

  export default {
    components: {
      AppBar,
      EventList,
      EventDetailsDialog,
      EventCreateDialog,
    },
    data: () => ({
      boardInfo: null,
      boardInfoLoaded: false,
      events: null,
      subjects: null,
      eventsAndSubjectsLoaded: false,
      lastDialogEvent: null,
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
      dialogEvent () {
        if (!this.events) return null;
        if (!['BoardAllEventsEvent', 'BoardAllEventsEdit'].includes(this.$route.name)) return null;
        return this.events.find((event) => event.id === this.$route.params.eventId) || null;
      },
      currentEvents () {
        if (!this.eventsAndSubjectsLoaded || !this.events) return null;

        const visibleEvents = this.events.filter((event) => !event.archived);
        return visibleEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
      },
      routeTitle () {
        if (this.$route.name === 'BoardAllEventsEdit' && this.dialogEvent) {
          return this.$t('routes.all-events-edit', {
            event: this.dialogEvent.title,
          });
        }
        if (this.$route.name === 'BoardAllEventsEvent' && this.dialogEvent) {
          return this.$t('routes.all-events-event', {
            event: this.dialogEvent.title,
          });
        }
        return this.$t('routes.all-events');
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
            this.eventsAndSubjectsLoaded = false;
            try {
              const boardReference = this.$database
                .collection('boards').doc(this.$route.params.boardId);
              await Promise.all([
                this.$bind('events', boardReference.collection('events')),
                this.$bind('subjects', boardReference.collection('subjects')),
              ]);
            } catch (error) {
              console.error(error);
              this.$toast.error(this.$t('toasts.unexpected-error'));
            }
            this.eventsAndSubjectsLoaded = true;
          } else {
            this.eventsAndSubjectsLoaded = false;
            if (this.$firestoreRefs.events) {
              this.$unbind('events');
            }
            if (this.$firestoreRefs.subjects) {
              this.$unbind('subjects');
            }
          }
        },
        immediate: true,
      },
      routeTitle: {
        handler (value) {
          document.title = value;
        },
        immediate: true,
      },
    },
    methods: {
      closeEventDetailsDialog () {
        this.lastDialogEvent = this.dialogEvent;

        this.$router.push(`/board/${this.$route.params.boardId}/all-events`);

        setTimeout(() => {
          this.lastDialogEvent = null;
        }, 750);
      },
      closeCreatorDialog () {
        if (this.$route.name === 'BoardAllEventsEdit') {
          this.lastDialogEvent = this.dialogEvent;

          setTimeout(() => {
            this.lastDialogEvent = null;
          }, 750);
        }
        this.$router.push(`/board/${this.$route.params.boardId}/all-events`);
      },
    },
  };
</script>

<style lang="scss">
  .board-events-container {
    max-width: 700px;
  }
</style>
