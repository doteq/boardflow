<template>
  <v-menu
    left
    offset-y
  >
    <template v-slot:activator="{ on }">
      <v-btn
        icon
        class="mr-2"
        v-on="on"
      >
        <v-icon>mdi-translate</v-icon>
      </v-btn>
    </template>
    <v-list :dense="$vuetify.breakpoint.smAndDown">
      <v-list-item-group
        v-model="$i18n.locale"
        color="primary"
        mandatory
      >
        <v-list-item
          v-for="locale in locales"
          :key="locale.value"
          :value="locale.value"
        >
          <v-list-item-icon>
            <v-img
              :src="locale.icon"
              width="24"
            />
          </v-list-item-icon>

          <v-list-item-title v-text="locale.name" />
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-menu>
</template>

<script>
  export default {
    data: () => ({
      locales: [
        {
          value: 'en',
          name: 'English',
          icon: 'https://www.countryflags.io/gb/flat/64.png',
        },
        {
          value: 'pl',
          name: 'Polski',
          icon: 'https://www.countryflags.io/pl/flat/64.png',
        },
      ],
    }),
  };
</script>
