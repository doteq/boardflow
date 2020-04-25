<template>
  <v-dialog
    v-model="visible"
    :max-width="500"
  >
    <template v-slot:activator="{ on }">
      <slot
        name="activator"
        v-bind="{ on }"
        v-on="on"
      />
    </template>
    <v-card>
      <v-card-title class="break-word">
        Na pewno chcesz odrzucić prośbę o dołączenie?
      </v-card-title>
      <v-card-text>
        Użytkownik nadal będzie mógł ponownie poprosić o dołączenie.
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          text
          @click="visible = false"
        >
          Anuluj
        </v-btn>
        <v-btn
          color="red"
          text
          @click="reject"
        >
          Odrzuć
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    data: () => ({
      visible: false,
    }),
    methods: {
      reject () {
        this.$emit('reject');
        this.visible = false;
      },
    },
  };
</script>
