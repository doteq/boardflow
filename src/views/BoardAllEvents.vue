<template>
  <v-container class="board-events-container">
    <app-bar
      :back-to="`/board/${$route.params.boardId}`"
    >
      {{ $t('all-events.title') }}
    </app-bar>
    <board-all-events-list
      :events="notArchivedEvents"
      :loading="eventListLoading"
      :done-homework="doneHomework"
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
        all-events
        @close="closeEventDetailsDialog()"
      />
    </v-dialog>
  </v-container>
</template>

<script>
  import AppBar from '../components/AppBar.vue';
  import EventDetailsDialog from '../components/board/EventDetailsDialog.vue';
  import EventCreateDialog from '../components/board/EventCreateDialog.vue';
  import BoardAllEventsList from '../components/board-all-events/BoardAllEventsList.vue';

  export default {
    components: {
      AppBar,
      EventCreateDialog,
      EventDetailsDialog,
      BoardAllEventsList,
    },
    data: () => ({
      boardInfo: null,
      boardInfoLoaded: false,
      events: null,
      subjects: null,
      eventsAndSubjectsLoaded: false,
      lastDialogEvent: null,
      boardUserData: null,
      boardUserDataLoaded: false,
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
        const event = this.events.find((el) => el.id === this.$route.params.eventId);
        if (!event) return null;
        return {
          ...event,
          id: event.id,
          done: this.doneHomework && event.type === 'homework' ? this.doneHomework.includes(event.id) : null,
        };
      },
      eventListLoading () {
        return !this.eventsAndSubjectsLoaded || (this.userIsMember && !this.boardUserDataLoaded);
      },
      doneHomework () {
        if (!this.userIsMember || !this.boardUserDataLoaded) return null;
        return this.boardUserData ? this.boardUserData.doneHomework || [] : [];
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
      notArchivedEvents () {
        if (!this.events) return null;
        return this.events.filter((event) => !event.archived);
      },
    },
    watch: {
      userIsMember: {
        async handler (value) {
          if (value) {
            this.boardUserDataLoaded = false;
            try {
              const boardUserDataReference = this.$database
                .collection('boards').doc(this.$route.params.boardId)
                .collection('user-data').doc(this.$store.state.userAuth.uid);
              await this.$bind('boardUserData', boardUserDataReference);
              this.boardUserDataLoaded = true;
            } catch (error) {
              console.error(error);
              this.$toast.error(this.$t('toasts.unexpected-error'));
            }
          } else if (this.$firestoreRefs.boardUserData) {
            this.$unbind('boardUserData');
            this.boardUserDataLoaded = false;
          }
        },
        immediate: true,
      },
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
