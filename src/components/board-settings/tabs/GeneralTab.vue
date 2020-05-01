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
      <v-form>
        <v-text-field
          v-model="name"
          :label="$t('board-settings.general.board-name')"
          outlined
          required
          autofocus
        />
      </v-form>

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
  export default {
    props: {
      boardInfo: {
        type: Object,
        required: false,
        default: null,
      },
    },
    data: () => ({
      name: 'Example Name',
      isPublic: false,
      isPublicLoading: false,
    }),
    computed: {
      loading () {
        return !this.boardInfo;
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
    },
  };
</script>

<style scoped>
  .background-color-transition {
    transition: background-color 200ms;
  }
</style>
