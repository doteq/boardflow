<template>
  <v-list>
    <v-list-item
      v-for="type in ['homework', 'lesson', 'test']"
      :key="type"
      :to="`/board/${$route.params.boardId}/create-event/${type}`"
    >
      <v-list-item-icon>
        <v-icon
          v-if="type === 'homework'"
          color="homework"
        >
          mdi-clipboard-text
        </v-icon>
        <v-icon
          v-else-if="type === 'lesson'"
          color="lesson"
        >
          mdi-message-video
        </v-icon> <v-icon
          v-else-if="type === 'test'"
          color="test"
        >
          mdi-comment-question
        </v-icon>
      </v-list-item-icon>

      <v-list-item-title
        v-t="`event-types.${type}`"
        :class="`${type}--text`"
      />
    </v-list-item>
  </v-list>
</template>
