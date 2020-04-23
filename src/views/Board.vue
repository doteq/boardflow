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
          v-if="$vuetify.breakpoint.smOnly && boardSettingsTo"
          text
          class="mr-2"
          :to="`/board/${$route.params.boardId}/settings`"
        >
          <v-icon left>
            mdi-cog
          </v-icon>
          Ustawienia tablicy
        </v-btn>

        <v-tooltip v-if="$vuetify.breakpoint.xsOnly && boardSettingsTo">
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
              />
            </v-dialog>
          </div>
        </div>
      </template>
    </app-bar>

    <event-create-dialog ref="eventCreateDialog" />
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
              @click="showCreateDialog()"
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
          />
        </v-col>
        <v-col>
          <event-list
            :events="eventsLoaded ? events : null"
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
        />
        <event-list
          :events="eventsLoaded ? events : null"
        />
      </div>
      <v-btn
        v-if="$vuetify.breakpoint.smAndDown && userIsMember"
        fab
        bottom
        right
        fixed
        color="secondary"
        @click="showCreateDialog"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </template>
  </v-container>
</template>

<script>
  import EventList from '../components/board/EventList.vue';
  import EventCreateDialog from '../components/board/EventCreateDialog.vue';
  import AppBar from '../components/AppBar.vue';

  export default {
    name: 'Board',
    components: {
      EventList,
      EventCreateDialog,
      AppBar,
    },
    data: () => ({
      date: new Date().toISOString().split('T')[0],
      calendarDialogVisible: false,
      boardInfo: null,
      boardInfoLoaded: false,
      events: null,
      eventsLoaded: false,
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
            this.eventsLoaded = false;
            try {
              const boardReference = this.$database
                .collection('boards').doc(this.$route.params.boardId);
              await this.$bind('events', boardReference.collection('events'));
            } catch (error) {
              console.error(error);
              this.$toast.error('Wystąpił nieoczekiwany błąd');
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
      showCreateDialog () {
        this.$refs.eventCreateDialog.showCreateDialog(this.date);
      },
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
    },
  };
</script>

<style scoped>
  .board-container {
    max-width: 1100px;
  }
</style>
