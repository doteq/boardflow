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
          class="d-block text-center headline"
          v-text="$t('no-events-message-all')"
        />
      </div>
      <template v-else>
        <event-element
          v-for="(event, index) in eventItems"
          :key="event.id"
          :event="event"
          :class="{
            'mt-3': index !== 0
          }"
          all-events
        />
      </template>
    </v-fade-transition>
  </v-container>
</template>

<script>
  import EventElement from '../board/EventElement.vue';

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
      doneHomework: {
        type: Array,
        required: false,
        default: null,
      },
      loading: {
        type: Boolean,
        required: false,
        default: false,
      },
    },
    computed: {
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
          done: event.type === 'homework' ? this.doneHomework.includes(event.id) : null,
        }));
      },
    },
  };
</script>
