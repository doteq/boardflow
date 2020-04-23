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
          <div>
            <v-icon>mdi-calendar</v-icon>
            Należy oddać do:
            <span
              class="font-weight-medium"
            >
              {{ dateString }}<span v-if="event.time">, {{ event.time }}</span>
            </span>
          </div>
          <div>
            <v-icon>mdi-account-outline</v-icon>
            Dodane
            <span
              class="font-weight-medium"
              v-text="creationDateString"
            />
            <span v-if="creationUser">
              przez
              <v-chip>
                <v-avatar left>
                  <v-img :src="creationUser.photoURL" />
                </v-avatar>
                {{ creationUser.name }}
              </v-chip>
            </span>
          </div>
          <div v-if="event.optional">
            <v-icon>mdi-newspaper-variant</v-icon> Zadanie nieobowiązkowe
          </div>
          <div v-else>
            <v-icon>mdi-newspaper-variant</v-icon> Zadanie obowiązkowe
          </div>
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
      creationUser () {
        if (!this.$store.state.userDataList) return null;
        return this.$store.state.userDataList.find((user) => user.id === this.event.creation.user) || null;
      },
      dateString () {
        return new Date(this.event.date).toLocaleDateString('pl', {
          year: '2-digit',
          month: 'numeric',
          day: 'numeric',
        });
      },
      creationDateString () {
        return this.event.creation.timestamp.toDate().toLocaleDateString('pl', {
          year: '2-digit',
          month: 'numeric',
          day: 'numeric',
        });
      },
    },
    methods: {
      closeDialog () {
        this.$emit('close');
      },
    },
  };
</script>
