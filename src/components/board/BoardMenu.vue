<template>
  <v-menu
    v-model="visible"
    offset-y
  >
    <template v-slot:activator="{ on }">
      <slot
        :value="visible"
        name="activator"
        :on="on"
        :badge-count="badgeCount"
      />
    </template>
    <v-list :dense="dense">
      <v-list-item :to="`/board/${$route.params.boardId}/settings`">
        <v-list-item-icon>
          <v-badge
            content="5"
            color="red"
            :overlap="dense"
          >
            <v-icon>mdi-cog</v-icon>
          </v-badge>
        </v-list-item-icon>

        <v-list-item-title v-t="'board-settings.title'" />
      </v-list-item>
      <v-list-item :to="`/board/${$route.params.boardId}/settings/subjects`">
        <v-list-item-icon>
          <v-icon>mdi-book</v-icon>
        </v-list-item-icon>

        <v-list-item-title v-t="'board-settings.subjects.title'" />
      </v-list-item>
      <!--      <v-list-item>-->
      <!--        <v-list-item-icon>-->
      <!--          <v-icon>mdi-label</v-icon>-->
      <!--        </v-list-item-icon>-->

      <!--        <v-list-item-title>-->
      <!--          Lista etykiet-->
      <!--        </v-list-item-title>-->
      <!--      </v-list-item>-->
      <v-divider />
      <!--      <v-list-item>-->
      <!--        <v-list-item-icon>-->
      <!--          <v-icon>mdi-calendar</v-icon>-->
      <!--        </v-list-item-icon>-->

      <!--        <v-list-item-title>-->
      <!--          Połącz Kalendarz Google-->
      <!--        </v-list-item-title>-->
      <!--      </v-list-item>-->
      <v-list-item disabled>
        <v-list-item-icon>
          <v-icon>mdi-logout</v-icon>
        </v-list-item-icon>

        <v-list-item-title v-t="'leave-board'" />
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
  export default {
    props: {
      dense: {
        type: Boolean,
        default: false,
        required: false,
      },
    },
    data: () => ({
      visible: false,
      settingsBadgeCount: 5,
    }),
    computed: {
      badgeCount () {
        return this.settingsBadgeCount;
      },
    },
  };
</script>
