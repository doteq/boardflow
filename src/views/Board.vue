<template>
  <v-container
    class="board-container"
    :class="{
      'fill-height': (boardInfoLoaded && !boardInfo) || canViewBoard === false
    }"
  >
    <app-bar
      back-to="/"
      :title-loading="!boardInfoLoaded"
    >
      {{ boardInfo ? boardInfo.name : 'Nie znaleziono tablicy' }}
      <template
        v-if="userIsMember"
        v-slot:buttons
      >
        <v-btn
          v-if="$vuetify.breakpoint.smOnly"
          text
          class="mr-2"
          :to="`/board/${$route.params.boardId}/settings`"
        >
          <v-icon left>
            mdi-cog
          </v-icon>
          Ustawienia tablicy
        </v-btn>

        <v-tooltip v-if="$vuetify.breakpoint.xsOnly">
          <template v-slot:activator="{ on }">
            <v-btn
              icon
              class="mr-2"
              :to="`/board/${$route.params.boardId}/settings`"
              v-on="on"
            >
              <v-icon>mdi-cog</v-icon>
            </v-btn>
          </template>
          <span>Ustawienia tablicy</span>
        </v-tooltip>
      </template>
      <template
        v-if="$vuetify.breakpoint.xsOnly"
        v-slot:extension
      >
        <div class="grow">
          <div
            class="d-flex align-center"
          >
            <v-btn
              icon
              @click="datePrevious"
            >
              <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
            <div
              class="text-center body-1 mx-1 grow"
              v-text="dateString"
            />
            <v-btn
              icon
              @click="dateNext"
            >
              <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
            <v-dialog v-model="calendarDialogVisible">
              <template v-slot:activator="{ on }">
                <v-btn
                  icon
                  v-on="on"
                >
                  <v-icon>mdi-calendar</v-icon>
                </v-btn>
              </template>
              <v-date-picker
                v-model="date"
                full-width
                :events="calendarEventColor"
                color="secondary"
              />
            </v-dialog>
          </div>
        </div>
      </template>
    </app-bar>
    <div
      v-if="boardInfoLoaded && !boardInfo"
      class="d-flex fill-height flex-column align-center justify-center grow"
    >
      <h1 class="display-1">
        Nie znaleziono tablicy
      </h1>
    </div>
    <div
      v-else-if="canViewBoard === false"
      class="d-flex fill-height flex-column align-center justify-center grow"
    >
      <h1 class="display-1">
        Ta tablica jest prywatna
      </h1>
      <v-btn
        v-if="!this.$store.state.userAuth"
        color="primary black--text"
        class="mt-8"
        large
        @click="showSignInSheet"
      >
        Zaloguj się
      </v-btn>
      <v-btn
        v-else
        color="primary black--text"
        class="mt-8"
        large
      >
        Poproś o dołączenie
      </v-btn>
    </div>
    <template v-else>
      <v-row v-if="$vuetify.breakpoint.mdAndUp">
        <v-col class="shrink">
          <template v-if="!boardInfoLoaded">
            <v-skeleton-loader
              type="image"
              width="100%"
              height="44px"
              class="mb-4"
            />
            <v-skeleton-loader
              type="image"
              width="100%"
              height="36px"
              class="mb-4"
            />
          </template>
          <template v-else-if="userIsMember">
            <v-btn
              block
              color="secondary"
              class="mb-4"
              large
              :to="`/board/${$route.params.boardId}/create-event`"
            >
              <v-icon left>
                mdi-plus
              </v-icon>
              Dodaj wpis
            </v-btn>
            <v-badge
              bordered
              color="red"
              content="5"
              overlap
              class="d-block"
            >
              <v-btn
                block
                class="mb-4"
                outlined
                :to="`/board/${$route.params.boardId}/settings`"
              >
                <v-icon left>
                  mdi-cog
                </v-icon>
                Ustawienia tablicy
              </v-btn>
            </v-badge>
          </template>
          <v-date-picker
            v-model="date"
            no-title
            :events="calendarEventColor"
            color="secondary"
          />
        </v-col>
        <v-col>
          <event-list
            :events="currentEvents"
          />
        </v-col>
      </v-row>
      <div
        v-else
        class="d-flex flex-column"
      >
        <v-date-picker
          v-if="$vuetify.breakpoint.smOnly"
          v-model="date"
          full-width
          landscape
          class="mb-6"
          :events="calendarEventColor"
          color="secondary"
        />
        <event-list
          :events="currentEvents"
        />
      </div>
      <v-btn
        v-if="$vuetify.breakpoint.smAndDown && userIsMember"
        fab
        bottom
        right
        fixed
        color="secondary"
        :to="`/board/${$route.params.boardId}/create-event`"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </template>
    <v-dialog
      :value="$route.name === 'BoardCreateEvent' && userIsMember === false"
      persistent
      no-click-animation
      max-width="550px"
      @click:outside="closeCreatorDialog()"
      @keydown.esc="closeCreatorDialog()"
    >
      <v-card>
        <v-card-title
          class="display-1 text-center pa-12 d-block"
        >
          Nie jesteś członkiem tablicy
        </v-card-title>
        <v-card-actions>
          <v-spacer />
          <v-btn
            text
            @click="closeCreatorDialog()"
          >
            Zamknij
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <event-create-dialog
      ref="eventCreateDialog"
      :subjects="subjects"
      :initial-date="date"
      :value="($route.name === 'BoardCreateEvent' || $route.name === 'BoardEditEvent') && userIsMember === true"
      :edit="$route.name === 'BoardEditEvent' || lastDialogState.edit"
      :loading="!eventsAndSubjectsLoaded"
      :event="dialogEvent || lastDialogState.event"
      @close="closeCreatorDialog()"
    />
    <v-dialog
      :value="$route.name === 'BoardEvent' && canViewBoard === true"
      scrollable
      max-width="500px"
      persistent
      no-click-animation
      @click:outside="closeEventDetailsDialog()"
      @keydown.esc="closeEventDetailsDialog()"
    >
      <event-details-dialog
        :loading="!eventsAndSubjectsLoaded"
        :event="dialogEvent || lastDialogState.event"
        @close="closeEventDetailsDialog()"
      />
    </v-dialog>
    <sign-in-sheet ref="signInSheet" />
  </v-container>
</template>

<script>
  import EventList from '../components/board/EventList.vue';
  import EventCreateDialog from '../components/board/EventCreateDialog.vue';
  import AppBar from '../components/AppBar.vue';
  import EventDetailsDialog from '../components/board/EventDetailsDialog.vue';
  import SignInSheet from '../components/SignInSheet.vue';

  export default {
    name: 'Board',
    components: {
      EventList,
      EventCreateDialog,
      AppBar,
      EventDetailsDialog,
      SignInSheet,
    },
    data: () => ({
      date: new Date().toISOString().split('T')[0],
      calendarDialogVisible: false,
      boardInfo: null,
      boardInfoLoaded: false,
      events: null,
      subjects: null,
      eventsAndSubjectsLoaded: false,
      lastDialogState: {
        event: null,
        edit: false,
      },
    }),
    computed: {
      dateString () {
        return new Date(this.date).toLocaleDateString('pl', {
          weekday: 'short',
          year: '2-digit',
          month: 'numeric',
          day: 'numeric',
        });
      },
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
        if (!['BoardEvent', 'BoardEditEvent'].includes(this.$route.name)) return null;
        return this.events.find((event) => event.id === this.$route.params.eventId) || null;
      },
      currentEvents () {
        if (!this.eventsAndSubjectsLoaded || !this.events) return null;

        return this.events.filter((event) => event.date === this.date);
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
            this.$toast.error('Wystąpił nieoczekiwany błąd');
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
              this.$toast.error('Wystąpił nieoczekiwany błąd');
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
    },
    methods: {
      dateNext () {
        const newDate = new Date();
        newDate.setDate(new Date(this.date).getDate() + 1);
        [this.date] = newDate.toISOString().split('T');
      },
      datePrevious () {
        const newDate = new Date();
        newDate.setDate(new Date(this.date).getDate() - 1);
        [this.date] = newDate.toISOString().split('T');
      },
      closeCreatorDialog () {
        if (this.$route.name === 'BoardEditEvent') {
          this.lastDialogState.edit = true;
          this.lastDialogState.event = this.dialogEvent;

          setTimeout(() => {
            this.lastDialogState.edit = false;
            this.lastDialogState.event = null;
          }, 750);
        }
        this.$router.push(`/board/${this.$route.params.boardId}`);
      },
      closeEventDetailsDialog () {
        this.lastDialogState.event = this.dialogEvent;

        this.$router.push(`/board/${this.$route.params.boardId}`);

        setTimeout(() => {
          this.lastDialogState.event = null;
        }, 750);
      },
      calendarEventColor (date) {
        if (!this.eventsAndSubjectsLoaded || !this.events) return [];
        const dateEvents = this.events.filter((event) => event.date === date);
        const colors = [];
        if (dateEvents.findIndex((event) => event.type === 'homework') !== -1) colors.push('homework');
        if (dateEvents.findIndex((event) => event.type === 'lesson') !== -1) colors.push('lesson');
        if (dateEvents.findIndex((event) => event.type === 'test') !== -1) colors.push('test');
        return colors;
      },
      showSignInSheet () {
        this.$refs.signInSheet.show();
      },
    },
  };
</script>

<style scoped>
  .board-container {
    max-width: 1100px;
  }
</style>
