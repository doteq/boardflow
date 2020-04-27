<template>
  <div>
    <h1
      v-t="'board-settings.general.title'"
      class="headline mb-6 text-center"
    />
    <v-form>
      <v-text-field
        v-model="name"
        :label="$t('board-settings.general.board-name')"
        outlined
        required
        autofocus
      />
      <v-select
        v-model="isPublic"
        :items="privacyItems"
        :label="$t('visibility.title')"
        :hint="privacyHint"
        persistent-hint
        required
        outlined
      />
    </v-form>
  </div>
</template>

<script>
  export default {
    data: () => ({
      name: 'Example Name',
      isPublic: false,
    }),
    computed: {
      privacyItems () {
        return ([
          {
            text: this.$t('visibility.public.title'),
            value: true,
          },
          {
            text: this.$t('visibility.private.title'),
            value: false,
          },
        ]);
      },
      privacyHint () {
        return this.$t(`visibility.${this.isPublic ? 'public' : 'private'}.description`);
      },
    },
  };
</script>
