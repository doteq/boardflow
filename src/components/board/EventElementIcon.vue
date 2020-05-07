<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on }">
      <div
        class="mt-2 mx-2"
        :class="{
          'ml-4': marginLeft && false,
          'mr-4': marginRight && false
        }"
        v-on="on"
      >
        <v-icon
          :small="$vuetify.breakpoint.xsOnly"
          v-text="icon"
        />
        <slot />
      </div>
    </template>
    {{ tooltip }}
  </v-tooltip>
</template>

<script>
  export default {
    props: {
      icon: {
        type: String,
        required: true,
      },
      tooltip: {
        type: String,
        required: true,
      },
      marginLeft: {
        type: Boolean,
        required: false,
        default: false,
      },
      marginRight: {
        type: Boolean,
        required: false,
        default: false,
      },
    },
    data () {
      return {
        tooltipVisible: false,
      };
    },
  };
</script>
