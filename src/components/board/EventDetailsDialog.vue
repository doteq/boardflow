<template>
  <v-card>
    <v-row
      no-gutters
      class="fill-height"
    >
      <v-col cols="auto">
        <v-sheet
          :color="colorString"
          class="fill-height"
          :width="6"
          tile
        />
      </v-col>
      <v-col class="d-flex flex-column fill-height">
        <v-card-title>{{ event.title }}</v-card-title>
        <v-card-subtitle>Zadanie domowe</v-card-subtitle>
        <v-card-text class="overflow-y-auto">
          <span v-if="event.description">
            {{ event.description }}
          </span>
          <v-divider
            v-if="event.description"
            class="pa-2 mt-2"
          />
          <v-icon>mdi-calendar</v-icon> Należy oddać do: {{ event.date }}<span v-if="event.time">, {{ event.time }}</span><br>
          <v-icon>mdi-account-outline</v-icon> Dodane przez: {{ event.addBy }}<br>
          <span v-if="!event.optional"><v-icon>mdi-newspaper-variant</v-icon> Zadanie obowiązkowe<br></span>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            text
          >
            Edytuj
          </v-btn>
          <v-btn
            text
            @click="closeDialog()"
          >
            Zamknij
          </v-btn>
        </v-card-actions>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
  export default {
    name: 'EventDetailsDialog',
    props: {
      event: Object,
    },
    computed: {
      colorString () {
        return this.event.type;
      },
    },
    methods: {
      closeDialog () {
        this.$emit('close');
      },
    },
  };
</script>
