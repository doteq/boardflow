<template>
  <v-dialog
    v-model="visible"
    max-width="500px"
  >
    <v-card>
      <v-card-title>
        Dodaj przedmiot
      </v-card-title>
      <v-form @submit.prevent="submit">
        <v-card-text class="mt-2 pb-0 d-flex">
          <v-menu
            ref="colorMenu"
            v-model="colorMenuVisible"
            :close-on-content-click="false"
            :close-on-click="false"
            :return-value.sync="color"
            transition="scale-transition"
            offset-y
          >
            <template v-slot:activator="{ on }">
              <v-btn
                :color="color"
                icon
                class="mr-2 mt-2"
                large
                v-on="on"
              >
                <v-icon>
                  mdi-palette
                </v-icon>
              </v-btn>
            </template>
            <v-card>
              <v-color-picker
                v-model="color"
                show-swatches
              />
              <v-card-actions>
                <v-spacer />
                <v-btn
                  text
                  color="primary"
                  @click="colorMenuVisible = false"
                >
                  Anuluj
                </v-btn>
                <v-btn
                  text
                  color="primary"
                  @click="$refs.colorMenu.save(color)"
                >
                  OK
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-menu>
          <v-text-field
            v-model="name"
            outlined
            label="Nazwa przedmiotu"
            autofocus
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="primary"
            text
            @click="visible = false"
          >
            Anuluj
          </v-btn>
          <v-btn
            color="primary"
            outlined
            type="submit"
            :disabled="!valid"
            :loading="submitLoading"
          >
            Dodaj
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
  import { getRandomMaterialColor } from '../utils';

  export default {
    data: () => ({
      visible: false,
      boardId: null,
      name: '',
      color: '',
      colorMenuVisible: false,
      submitLoading: false,
    }),
    computed: {
      valid () {
        return this.name.trim().length > 0;
      },
    },
    methods: {
      show (boardId) {
        this.boardId = boardId;
        this.name = '';
        this.color = getRandomMaterialColor();
        this.colorMenuVisible = false;
        this.visible = true;
      },
      async submit () {
        if (!this.valid || this.submitLoading) return;

        this.submitLoading = true;

        try {
          const subjectReference = await this.$database
            .collection('boards').doc(this.boardId)
            .collection('subjects').add({
              name: this.name,
              color: this.color,
            });

          this.$emit('created', subjectReference.id);
          this.visible = false;
        } catch (error) {
          console.error(error);
          this.$toast.error('Wystąpił nieoczekiwany błąd');
        }

        this.submitLoading = false;
      },
    },
  };
</script>
