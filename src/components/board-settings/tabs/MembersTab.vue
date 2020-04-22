<template>
  <div>
    <h1 class="headline mb-6 text-center">
      Lista członków
    </h1>
    <v-card
      v-for="user in memberList"
      :key="user.uid"
      class="mb-3"
      outlined
    >
      <v-row
        class="align-center pl-4 pr-5 py-2"
        no-gutters
      >
        <v-col cols="auto">
          <v-avatar
            class="elevation-4"
            :size="48"
          >
            <v-img
              :src="user.photoURL"
              :alt="user.name"
            />
          </v-avatar>
        </v-col>
        <v-col>
          <v-card-title v-text="user.name" />
        </v-col>
        <v-col
          :cols="4"
          class="mr-3"
        >
          <v-select
            outlined
            hide-details
            dense
            :items="permissionItems"
            :value="permissionValue"
            @change="permissionChanged(permissionValue, user.uid)"
          />
        </v-col>
        <v-col
          cols="auto"
        >
          <v-btn
            color="error"
            outlined
          >
            Wyrzuć
          </v-btn>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
  export default {
    data: () => ({
      memberList: [
        {
          name: 'doteq',
          uid: 'Ru1TAsTc9oc02v6RKKtsgNNS6uk1',
          photoURL: 'https://graph.facebook.com/893036034476358/picture',
          admin: true,
          self: true,
        },
      ],
      permissionItems: [
        {
          text: 'Admin',
          value: true,
        },
        {
          text: 'Członek',
          value: false,
        },
      ],
      permissionValue: '',
    }),
    methods: {
      permissionChanged (item, item2) {
        console.log(item, item2);
        return true;
      },
    },
  };
</script>
