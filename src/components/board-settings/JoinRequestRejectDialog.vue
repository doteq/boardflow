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
        v-t="'join-request-reject-dialog.title'"
        class="break-word"
      />
      <v-card-text v-t="'join-request-reject-dialog.description'" />
      <v-card-actions>
        <v-spacer />
        <v-btn
          v-t="'cancel'"
          text
          @click="visible = false"
        />
        <v-btn
          v-t="'reject'"
          color="red"
          text
          @click="reject"
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
      reject () {
        this.$emit('reject');
        this.visible = false;
      },
    },
  };
</script>
