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
        v-else-if="eventDates.length === 0"
        :key="'no-events-info'"
        class="mt-12 mx-6 d-flex flex-column align-center"
      >
        <h1
          class="d-block text-center headline"
          v-text="$t('no-events-message-all')"
        />
      </div>
      <div
        v-for="{ date, dateString, items } in eventDates"
        v-else
        :key="`date:${date}`"
        class="mt-3"
      >
        <v-subheader v-text="dateString" />
        <event-element
          v-for="event in items"
          :key="`event:${event.id}`"
          :event="event"
          class="mt-3"
          all-events
        />
      </div>
    </v-fade-transition>
  </v-container>
</template>

<script>
  import _ from 'lodash';
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
      eventDates () {
        if (this.loading) return null;
        const eventItems = this.events.map((event) => ({
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
        return _.toPairs(_.groupBy(
          _.orderBy(eventItems, [(item) => Date.parse(item.date)], ['desc']),
          (item) => item.date,
        )).map(([date, items]) => ({
          date,
          dateString: new Date(date).toLocaleDateString(this.$i18n.locale, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long',
          }),
          items: _.orderBy(items, [(event) => {
            if (!event.time) return 10000;
            const [hourOfDay, minuteOfHour] = event.time.split(':').map((string) => parseInt(string, 10));

            return hourOfDay * 60 + minuteOfHour;
          }], ['asc']),
        }));
      },
    },
  };
</script>
