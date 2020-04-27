<template>
  <div>
    <v-card
      class="overflow-hidden"
      :to="`/board/${$route.params.boardId}/event/${event.id}`"
    >
      <v-row no-gutters>
        <v-col cols="auto">
          <v-sheet
            :color="colorString"
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
                </span>
              </v-col>
              <v-col class="text-right">
                <span v-if="event.time"><v-icon>mdi-clock-outline</v-icon>{{ event.time }}</span>
                <span v-else>
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
                </span>
              </v-col>
            </v-row>
          </v-card-subtitle>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
  export default {
    name: 'EventElement',
    props: {
      event: {
        type: Object,
        required: true,
      },
    },
    data: () => ({
      done: false,
    }),
    computed: {
      colorString () {
        return this.event.type;
      },
    },
    watch: {
      done (value) {
        console.log(value);
      },
    },
  };
</script>
