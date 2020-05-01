<template>
  <div>
    <h1
      class="headline mb-6 text-center"
      v-text="$t('board-settings.general.title')"
    />
    <div
      v-if="loading"
      class="d-flex py-8 align-center justify-center"
    >
      <v-progress-circular
        indeterminate
        :size="64"
        color="primary"
      />
    </div>
    <template v-else>
      <v-text-field
        v-model="name"
        :label="$t('board-settings.general.board-name')"
        outlined
        required
        autofocus
        :counter="50"
        :counter-value="(value) => value.trim().length"
        :error-messages="nameErrors"
      >
        <template v-slot:append>
          <v-progress-circular
            v-if="nameLoading"
            indeterminate
            :size="24"
            :width="2"
            color="secondary"
          />
        </template>
      </v-text-field>

      <div
        class="px-1 subtitle-2"
        v-text="$t('visibility.title')"
      />
      <v-item-group
        :value="boardInfo.public"
        active-class="primary"
        mandatory
      >
        <v-row>
          <v-col
            :cols="12"
            :sm="6"
          >
            <v-item
              v-slot:default="{ active }"
              :value="true"
            >
              <v-card
                :raised="active"
                :flat="!active"
                class="fill-height grow d-flex flex-column background-color-transition"
                :color="active ? 'accent' : undefined"
              >
                <v-card-title class="text-center d-block">
                  <v-icon left>
                    mdi-eye
                  </v-icon>
                  {{ $t('visibility.public.title') }}
                </v-card-title>
                <v-card-text
                  v-t="'visibility.public.description'"
                  class="text-justify grow"
                />
                <v-card-actions>
                  <v-btn
                    block
                    text
                    :disabled="active"
                    :loading="isPublicLoading && !active"
                    @click="setVisibility(true)"
                  >
                    {{ active ? $t('create.selected') : $t('create.select') }}
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-item>
          </v-col>
          <v-col
            :cols="12"
            :sm="6"
          >
            <v-item
              v-slot:default="{ active }"
              :value="false"
            >
              <v-card
                :raised="active"
                :flat="!active"
                class="fill-height grow d-flex flex-column background-color-transition"
                :color="active ? 'accent' : undefined"
              >
                <v-card-title class="text-center d-block">
                  <v-icon left>
                    mdi-lock
                  </v-icon>
                  {{ $t('visibility.private.title') }}
                </v-card-title>
                <v-card-text
                  v-t="'visibility.private.description'"
                  class="text-justify grow"
                />
                <v-card-actions>
                  <v-btn
                    block
                    text
                    :disabled="active"
                    :loading="isPublicLoading && !active"
                    @click="setVisibility(false)"
                  >
                    {{ active ? $t('create.selected') : $t('create.select') }}
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-item>
          </v-col>
        </v-row>
      </v-item-group>
    </template>
  </div>
</template>

<script>
  import _ from 'lodash';

  export default {
    props: {
      boardInfo: {
        type: Object,
        required: false,
        default: null,
      },
    },
    data () {
      return ({
        name: '',
        isPublic: false,
        isPublicLoading: false,
        saveNameDebounced: _.debounce(this.saveName, 500),
        nameLoading: false,
      });
    },
    computed: {
      loading () {
        return !this.boardInfo;
      },
      nameErrors () {
        const errors = [];

        if (this.name.trim() === '') errors.push(this.$t('board-settings.general.field-required'));
        if (this.name.trim().length > 50) errors.push(this.$t('board-settings.general.max-length-50'));

        return errors;
      },
    },
    watch: {
      'boardInfo.name': {
        handler (value) {
          if (!value) return;
          this.name = value;
        },
        immediate: true,
      },
      name (value) {
        this.saveNameDebounced(value);
      },
    },
    methods: {
      async setVisibility (isPublic) {
        this.isPublicLoading = true;
        try {
          await this.$database.collection('boards-info').doc(this.$route.params.boardId).update({
            public: isPublic,
          });
        } catch (error) {
          console.error(error);
          this.$toast.error(this.$t('toasts.unexpected-error'));
        }
        this.isPublicLoading = false;
      },
      async saveName (value) {
        if (this.nameLoading) {
          this.saveNameDebounced(value);
          return;
        }

        if (value.trim() === '') return;
        if (value.length > 50) return;

        if (value.trim() === this.boardInfo.name) return;

        this.nameLoading = true;

        try {
          await this.$database.collection('boards-info').doc(this.$route.params.boardId).update({
            name: value.trim(),
          });
        } catch (error) {
          this.$toast.error(this.$t('toasts.unexpected-error'));
          console.error(error);
        }

        this.nameLoading = false;
      },
    },
  };
</script>

<style scoped>
  .background-color-transition {
    transition: background-color 200ms;
  }
</style>
