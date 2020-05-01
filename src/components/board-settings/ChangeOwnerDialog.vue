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
        v-t="'board-settings.members.change-owner-dialog.title'"
        class="break-word"
      />
      <div class="overflow-hidden d-flex">
        <div class="align-self-center mx-6 hidden-xs-only">
          <v-icon
            x-large
            color="warning"
          >
            mdi-alert
          </v-icon>
        </div>
        <v-card-text
          v-t="'board-settings.members.change-owner-dialog.description'"
          :class="{
            'pl-0': $vuetify.breakpoint.smAndUp,
          }"
        />
      </div>
      <v-card-actions>
        <v-spacer />
        <v-btn
          v-t="'cancel'"
          text
          @click="visible = false"
        />
        <v-btn
          v-t="'board-settings.members.change-owner-dialog.change'"
          color="warning"
          text
          @click="change"
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
      change () {
        this.$emit('change');
        this.visible = false;
      },
    },
  };
</script>
