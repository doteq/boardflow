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
      <v-card-title
        v-t="'board-settings.members.remove-dialog.title'"
        class="break-word"
      />
      <v-card-text v-t="'board-settings.members.remove-dialog.description'" />
      <v-card-actions>
        <v-spacer />
        <v-btn
          v-t="'cancel'"
          text
          @click="visible = false"
        />
        <v-btn
          v-t="'board-settings.members.remove'"
          color="red"
          text
          @click="remove"
        />
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
      remove () {
        this.$emit('remove');
        this.visible = false;
      },
    },
  };
</script>
