<template>
  <v-container class="pa-0">
    <event-element
      v-for="event in events"
      :key="event.id"
      :event="event"
    />
    <h1 v-if="eventsUndone.length > 0">
      Do zrobienia:
    </h1>
    <event-element
      v-for="event in eventsUndone"
      :key="event.id"
      :event="event"
    />
    <h1 v-if="eventsDone.length > 0">
      Zrobione:
    </h1>
    <event-element
      v-for="event in eventsDone"
      :key="event.id"
      :event="event"
    />
  </v-container>
</template>

<script>
  import EventElement from './EventElement.vue';

  export default {
    name: 'EventList',
    components: {
      EventElement,
    },
    data: () => ({
      EventList: [
        {
          id: '31231231235646',
          type: 'homework',
          title: 'To jest tytuł.',
          description: 'To jest opis',
          date: '2020-04-21',
          time: '22:30',
          subject: {
            name: 'Polski',
            color: '#ffffff',
          },
          optional: false,
          done: false,
          addBy: 'doteq',
        },
        {
          id: '3123123124124',
          type: 'homework',
          title: 'To jest tytuł.',
          date: '2020-04-21',
          subject: {
            name: 'Polski',
            color: '#000000',
          },
          optional: true,
          done: undefined,
          addBy: 'doteq',
        },
      ],
    }),
    computed: {
      eventsDone () {
        return this.EventList.filter((event) => event.done);
      },
      eventsUndone () {
        return this.EventList.filter((event) => event.done === false);
      },
      events () {
        return this.EventList.filter((event) => event.done === undefined);
      },
    },
  };
</script>

<style scoped>

</style>
