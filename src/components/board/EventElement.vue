<template>
  <div>
    <v-card
      class="overflow-hidden"
      :to="allEvents ? `/board/${$route.params.boardId}/all-events/event/${event.id}` : `/board/${$route.params.boardId}/event/${event.id}`"
      :elevation="event.done ? 0 : undefined"
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
          <div class="d-flex">
            <v-card-title
              class="text-no-wrap text-truncate d-block grow pb-0"
              :class="{
                'text--disabled': event.done,
              }"
              v-text="event.title"
            />
            <v-tooltip
              v-if="event.done !== null"
              bottom
            >
              <template v-slot:activator="{ on }">
                <v-btn
                  icon
                  class="mr-3 mt-3"
                  :color="event.done ? 'primary' : ''"
                  :disabled="doneToggleLoading"
                  @mousedown.stop="() => {}"
                  v-on="on"
                  @click.prevent.native="toggleDone()"
                >
                  <v-icon v-if="event.done">
                    $checkboxOn
                  </v-icon>
                  <v-icon v-else>
                    $checkboxOff
                  </v-icon>
                </v-btn>
              </template>
              Zadanie zrobione
            </v-tooltip>
          </div>
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
                icon="mdi-calendar"
                :tooltip="$t('event-element.date')"
              >
                {{
                  event.time ?
                    $t('event-element.date-time-string', {
                      date: dateString,
                      time:event.time
                    }) :
                    dateString
                }}
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
  import firebase from 'firebase/app';
  import EventElementIcon from './EventElementIcon.vue';
  import 'firebase/firestore';

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
      doneToggleLoading: false,
    }),
    computed: {
      colorString () {
        if (this.event.type === 'homework' && this.event.done) return 'homework-done';
        return this.event.type;
      },
      dateString () {
        return new Date(this.event.date).toLocaleDateString(this.$i18n.locale, {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
      },
      durationString () {
        if (!this.event.duration) return null;

        return humanizeDuration(this.event.duration * 60 * 1000, {
          language: this.$i18n.locale,
          units: ['h', 'm'],
        });
      },
    },
    methods: {
      async toggleDone () {
        this.doneToggleLoading = true;
        try {
          const boardUserDataReference = this.$database
            .collection('boards').doc(this.$route.params.boardId)
            .collection('user-data').doc(this.$store.state.userAuth.uid);

          if (this.event.done) {
            await boardUserDataReference.set({
              doneHomework: firebase.firestore.FieldValue.arrayRemove(this.event.id),
            }, {
              merge: true,
            });
          } else {
            await boardUserDataReference.set({
              doneHomework: firebase.firestore.FieldValue.arrayUnion(this.event.id),
            }, {
              merge: true,
            });
          }
        } catch (error) {
          console.error(error);
          this.$toast.error(this.$t('toasts.unexpected-error'));
        }
        this.doneToggleLoading = false;
      },
    },
  };
</script>
