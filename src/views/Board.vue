<template>
  <v-container class="board-container">
    <v-dialog
      v-model="dialog"
      max-width="700px"
    >
      <event-create-dialog @close="closeDialog()" />
    </v-dialog>
    <v-row v-if="$vuetify.breakpoint.mdAndUp">
      <v-col class="shrink">
        <v-btn
          block
          color="secondary"
          class="mb-4"
          large
          @click="dialog = true"
        >
          <v-icon left>
            mdi-plus
          </v-icon>
          Dodaj wpis
        </v-btn>
        <v-btn
          block
          class="mb-4"
          text
          outlined
        >
          <v-icon left>
            mdi-cog
          </v-icon>
          Ustawienia tablicy
        </v-btn>
        <v-date-picker
          v-model="picker"
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
      <div
        v-if="$vuetify.breakpoint.xsOnly"
        class="d-flex align-center"
      >
        <v-btn
          icon
        >
          <v-icon>mdi-calendar</v-icon>
        </v-btn>
        <v-spacer />
        <v-btn
          icon
        >
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <div
          class="text-center body-1 mx-1"
          v-text="dateString"
        />
        <v-btn
          icon
        >
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </div>
      <v-date-picker
        v-model="date"
        :no-title="$vuetify.breakpoint.xsOnly"
        :full-width="$vuetify.breakpoint.xsOnly || true"
        :landscape="$vuetify.breakpoint.smAndUp"
        class="mb-6"
        :class="{
          'align-self-center': $vuetify.breakpoint.smAndUp,
        }"
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
      @click="dialog = true"
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>
  </v-container>
</template>

<script>
  import EventList from '../components/board/EventList.vue';
  import EventCreateDialog from '../components/board/EventCreateDialog.vue';

  export default {
    name: 'Board',
    components: {
      EventList,
      EventCreateDialog,
    },
    data: () => ({
      date: new Date().toISOString().split('T')[0],
      dialog: false,
      picker: '',
    }),
    computed: {
      dateString () {
        return Date.parse(this.date);
      },
    },
    watch: {
      picker (pickerValue) {
        console.log(pickerValue);
      },
    },
    methods: {
      closeDialog () {
        this.dialog = false;
      },
    },
  };
</script>

<style scoped>
  .board-container {
    max-width: 1100px;
  }
</style>
