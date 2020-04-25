<template>
  <v-container class="pa-0">
    <template v-if="loading">
      <v-skeleton-loader
        type="heading"
      />
      <v-skeleton-loader
        class="mt-4"
        type="article"
      />
      <v-skeleton-loader
        class="mt-4"
        type="heading"
      />
      <v-skeleton-loader
        class="mt-4"
        type="article"
      />
    </template>
    <template v-else>
      <event-element
        v-for="(event, index) in eventItemsOther"
        :key="event.id"
        :event="event"
        :class="{
          'mt-3': index !== 0
        }"
      />
      <h1 v-if="eventItemsNotDone.length > 0">
        Do zrobienia:
      </h1>
      <event-element
        v-for="event in eventItemsNotDone"
        :key="event.id"
        :event="event"
        class="mt-3"
      />
      <h1 v-if="eventItemsListDone.length > 0">
        Zrobione:
      </h1>
      <event-element
        v-for="event in eventItemsListDone"
        :key="event.id"
        :event="event"
        class="mt-3"
      />
    </template>
  </v-container>
</template>

<script>
  import EventElement from './EventElement.vue';

  export default {
    name: 'EventList',
    components: {
      EventElement,
    },
    props: {
      events: {
        type: Array,
        required: false,
        default: null,
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

<style scoped>

</style>
