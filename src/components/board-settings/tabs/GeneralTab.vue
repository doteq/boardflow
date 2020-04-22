<template>
  <div>
    <h1 class="headline mb-6 text-center">
      Ogólne
    </h1>
    <v-form>
      <v-text-field
        v-model="name"
        label="Nazwa tablicy"
        outlined
        required
        autofocus
      />
      <v-select
        v-model="isPublic"
        :items="privacyItems"
        label="Prywatność tablicy"
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
      privacyItems: [
        {
          text: 'Publiczna',
          value: true,
        },
        {
          text: 'Niepubliczna',
          value: false,
        },
      ],
    }),
  };
</script>
