<template>
  <v-container class="board-container">
    <app-bar
      back-to="/"
      title-loading
      :board-settings-to="`/board/${$route.params.boardId}/settings`"
    >
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
    <v-row v-if="$vuetify.breakpoint.mdAndUp">
      <v-col class="shrink">
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
        <v-date-picker
          v-model="date"
          no-title
        />
      </v-col>
      <v-col>
        <event-list />
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
      <event-list />
    </div>
    <v-btn
      v-if="$vuetify.breakpoint.smAndDown"
      fab
      bottom
      right
      fixed
      color="secondary"
      @click="showCreateDialog"
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>
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
