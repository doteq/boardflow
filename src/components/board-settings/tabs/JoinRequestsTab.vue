<template>
  <div>
    <h1 class="headline mb-6 text-center">
      Prośby o dołączenie
    </h1>
    <v-text-field
      id="board-link-input"
      :value="boardLink"
      outlined
      readonly
      dense
      class="mt-4"
      label="Link do tablicy"
    >
      <template v-slot:append>
        <v-btn
          outlined
          class="mr-0 ml-2 mb-2 p-0"
          @click="copyJoinLink()"
        >
          Kopiuj
        </v-btn>
      </template>
    </v-text-field>
    <v-card
      v-for="user in joinRequests"
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
          cols="auto"
          class="d-flex"
        >
          <v-btn
            color="error"
            outlined
            class="mr-3"
          >
            Odrzuć
          </v-btn>
          <v-btn color="primary black--text">
            Akceptuj
          </v-btn>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
  export default {
    data: () => ({
      joinRequests: [
        {
          name: 'doteq',
          uid: 'Ru1TAsTc9oc02v6RKKtsgNNS6uk1',
          photoURL: 'https://graph.facebook.com/893036034476358/picture',
        },
        {
          name: 'Dominik Korsa',
          uid: 'WfOGQoPKRYgly2C1DqUmMVoQMNU2',
          photoURL: 'https://lh3.googleusercontent.com/a-/AOh14GjPdMunHwOePJKhlU2yQmERL81yjmImxW7QcPfxtQ',
        },
      ],
    }),
    computed: {
      boardLink () {
        return new URL(`/board/${this.$route.params.boardId}`, window.location.origin);
      },
    },
    methods: {
      copyJoinLink () {
        const input = document.getElementById('board-link-input');
        input.select();
        document.execCommand('copy');
        this.$toast('Skopiowano link do schowka');
      },
    },
  };
</script>
