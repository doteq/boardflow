<template>
  <v-container class="pa-0 pb-12">
    <v-fade-transition
      group
      hide-on-leave
    >
      <template v-if="loading">
        <v-skeleton-loader
          key="loader-heading-1"
          type="heading"
        />
        <v-skeleton-loader
          key="loader-article-1"
          class="mt-4"
          type="article"
        />
        <v-skeleton-loader
          key="loader-heading-2"
          class="mt-4"
          type="heading"
        />
        <v-skeleton-loader
          key="loader-article-2"
          class="mt-4"
          type="article"
        />
      </template>
      <div
        v-else-if="eventItems.length === 0"
        :key="'no-events-info'"
        class="mt-12 mx-6 d-flex flex-column align-center"
      >
        <h1
          v-if="!allEvents"
          class="d-block text-center headline"
          v-text="$t('no-events-on-selected-day-message')"
        />
        <h1
          v-else
          class="d-block text-center headline"
          v-text="$t('no-events-message-all')"
        />
        <v-menu
          offset-y
          bottom
          :nudge-bottom="8"
        >
          <template v-slot:activator="{ on }">
            <v-btn
              class="mt-12"
              color="secondary"
              large
              v-on="on"
            >
              <v-icon left>
                mdi-plus
              </v-icon>
              {{ $t('add-new-event') }}
            </v-btn>
          </template>
          <event-type-select-menu-list />
        </v-menu>
      </div>
      <template v-else>
        <event-element
          v-for="(event, index) in eventItemsOther"
          :key="event.id"
          :event="event"
          :class="{
            'mt-3': index !== 0
          }"
          :all-events="allEvents"
        />
        <h1
          v-if="eventItemsNotDone.length > 0"
          v-text="$t('event-states.not-done')"
        />
        <event-element
          v-for="event in eventItemsNotDone"
          :key="event.id"
          :event="event"
          class="mt-3"
          :all-events="allEvents"
        />
        <h1
          v-if="eventItemsListDone.length > 0"
          v-text="$t('event-states.done')"
        />
        <event-element
          v-for="event in eventItemsListDone"
          :key="event.id"
          :event="event"
          class="mt-3"
          :all-events="allEvents"
        />
      </template>
    </v-fade-transition>
  </v-container>
</template>

<script>
  import EventElement from './EventElement.vue';
  import EventTypeSelectMenuList from './EventTypeSelectMenuList.vue';

  export default {
    name: 'EventList',
    components: {
      EventElement,
      EventTypeSelectMenuList,
    },
    props: {
      events: {
        type: Array,
        required: false,
        default: null,
      },
      allEvents: {
        type: Boolean,
        required: false,
        default: false,
      },
    },
    computed: {
      loading () {
        return !this.events;
      },
      eventItems () {
        if (this.loading) return null;
        return this.events.map((event) => ({
          id: event.id,
          type: event.type,
          title: event.title,
          subject: event.subject,
          description: event.description,
          date: event.date,
          time: event.time,
          duration: event.duration,
          links: event.links,
          creation: event.creation,
          edits: event.edits,
          optional: event.optional,
          done: undefined, // TODO: DODAĆ
        }));
      },
      eventItemsListDone () {
        return this.eventItems.filter((event) => event.done);
      },
      eventItemsNotDone () {
        return this.eventItems.filter((event) => event.done === false);
      },
      eventItemsOther () {
        return this.eventItems.filter((event) => event.done === undefined);
      },
    },
  };
</script>
