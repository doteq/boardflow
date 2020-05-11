<template>
  <div>
    <v-card
      class="overflow-hidden"
      :to="allEvents ? `/board/${$route.params.boardId}/all-events/event/${event.id}` : `/board/${$route.params.boardId}/event/${event.id}`"
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
        <v-col class="overflow-x-hidden">
          <v-card-title
            class="text-no-wrap text-truncate d-block"
            v-text="event.title"
          />
          <v-card-subtitle class="px-2">
            <div class="d-flex align-center px-2">
              <span
                :class="`${colorString}--text`"
                v-text="$t(`event-types.${event.type}`)"
              />
              <v-spacer />
              <v-sheet
                height="15"
                width="30"
                :color="event.subject.color"
              />
              <span
                class="ml-2"
                v-text="event.subject.name"
              />
            </div>
            <div class="d-flex">
              <event-element-icon
                v-if="allEvents"
                icon="mdi-calendar-outline"
                :tooltip="$t('event-element.time')"
              >
                {{ event.time ? `${event.date}, ${event.time}`: event.date }}
              </event-element-icon>
              <event-element-icon
                v-else-if="event.time"
                icon="mdi-clock-outline"
                :tooltip="$t('event-element.time')"
              >
                {{ event.time }}
              </event-element-icon>
              <event-element-icon
                v-if="event.duration"
                icon="mdi-timer-sand"
                :tooltip="$t('event-element.duration')"
              >
                {{ durationString }}
              </event-element-icon>
              <event-element-icon
                v-if="event.optional"
                icon="mdi-bullseye-arrow"
                :tooltip="$t('event-element.optional')"
              />
              <v-spacer />
              <event-element-icon
                v-if="event.description"
                icon="mdi-text"
                :tooltip="$t('event-element.has-description')"
                right
              />
              <event-element-icon
                v-if="event.links.length > 0"
                icon="mdi-link"
                :tooltip="$t('event-element.has-links')"
                right
              />
            </div>
          </v-card-subtitle>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
  import humanizeDuration from 'humanize-duration';
  import EventElementIcon from './EventElementIcon.vue';

  export default {
    name: 'EventElement',
    components: {
      EventElementIcon,
    },
    props: {
      event: {
        type: Object,
        required: true,
      },
      allEvents: {
        type: Boolean,
        required: false,
        default: false,
      },
    },
    data: () => ({
      done: false,
    }),
    computed: {
      colorString () {
        return this.event.type;
      },
      durationString () {
        if (!this.event.duration) return null;

        return humanizeDuration(this.event.duration * 60 * 1000, {
          language: this.$i18n.locale,
          units: ['h', 'm'],
        });
      },
    },
    watch: {
      done (value) {
        console.log(value);
      },
    },
  };
</script>
