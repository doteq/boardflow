<template>
  <v-container>
    <v-dialog
      v-model="dialog"
      scrollable
      max-width="500px"
    >
      <event-details-dialog
        :event="event"
        @close="closeDialog()"
      />
    </v-dialog>
    <v-card
      class="overflow-hidden"
      @click="dialog = true"
    >
      <v-row no-gutters>
        <v-col cols="auto">
          <v-sheet
            color="homework"
            class="fill-height"
            :width="6"
            tile
          />
        </v-col>
        <v-col>
          <v-row
            no-gutters
            class="align-center"
          >
            <v-col>
              <v-card-title>
                {{ event.title }}
              </v-card-title>
            </v-col>
            <v-col class="shrink">
              <v-simple-checkbox
                v-if="event.done !== undefined"
                v-model="event.done"
                class="mr-4"
                @click.stop.capture
              />
            </v-col>
          </v-row>
          <v-card-subtitle class="pt-0">
            <v-row no-gutters>
              <v-col class="text-left">
                <v-row no-gutters>
                  <v-col class="shrink d-flex align-center mr-2">
                    <v-sheet
                      width="25"
                      height="12"
                      :color="event.subject.color"
                    />
                  </v-col>
                  <v-col>
                    {{ event.subject.name }}
                  </v-col>
                </v-row>
              </v-col>
              <v-col class="text-center mx-3 hidden-xs-only">
                <span v-if="event.time">
                  <span v-if="event.type === 'homework'">Zadanie domowe</span>
                  <span v-else-if="event.type === 'lesson'">Lekcja</span>
                  <span v-else-if="event.type === 'test'">Sprawdzian/kartkówka</span>
                </span>
              </v-col>
              <v-col class="text-right">
                <span v-if="event.time"><v-icon>mdi-clock-outline</v-icon>{{ event.time }}</span>
                <span v-else>
                  <span v-if="event.type === 'homework'">Zadanie domowe</span>
                  <span v-else-if="event.type === 'lesson'">Lekcja</span>
                  <span v-else-if="event.type === 'test'">Sprawdzian/kartkówka</span>
                </span>
              </v-col>
            </v-row>
          </v-card-subtitle>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
  import EventDetailsDialog from './EventDetailsDialog.vue';

  export default {
    name: 'EventElement',
    components: {
      EventDetailsDialog,
    },
    props: {
      event: Object,
    },
    data: () => ({
      dialog: false,
      done: false,
    }),
    watch: {
      done (value) {
        console.log(value);
      },
    },
    methods: {
      closeDialog () {
        this.dialog = false;
      },
    },
  };
</script>
