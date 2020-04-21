<template>
  <v-card>
    <v-card-title>Polski</v-card-title>
    <v-card-subtitle>Zadanie domowe</v-card-subtitle>
    <v-card-text>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce ut volutpat purus. Ut iaculis lectus ac elementum aliquam. Sed ullamcorper consequat egestas. Donec ut risus condimentum, cursus nisi sit amet, consequat nulla. Ut sed risus libero. Duis at leo non mi consequat fermentum. Nullam sollicitudin tortor sapien, quis efficitur odio mollis quis. Duis vitae ante tortor. Nunc pellentesque a metus at tincidunt.

      Nunc in dapibus quam, at ornare massa. Morbi volutpat feugiat nisl laoreet malesuada. Praesent sollicitudin quis eros ut lacinia. Maecenas ullamcorper tellus at turpis consequat sodales. Praesent ipsum metus, tincidunt eget lorem at, laoreet vehicula metus. Curabitur tristique, mi eu ullamcorper porttitor, magna arcu feugiat libero, eget imperdiet nisl nisi ut mi. Ut nec metus erat. Sed pharetra gravida magna eget aliquet. Nullam blandit tempus massa, non semper mauris pulvinar sed. Curabitur vel malesuada massa. Proin semper, est id lobortis lobortis, tellus ligula elementum velit, in iaculis orci augue convallis mi. Mauris pretium eget erat vel fringilla. Curabitur eleifend est ac eleifend dignissim. Sed lectus augue, auctor non pretium ut, dapibus et justo. Aliquam ornare sagittis velit, eget convallis urna accumsan eget.

      Nulla molestie euismod nisi in faucibus. Praesent in mauris non lorem volutpat aliquet. Sed placerat dolor dolor, in pretium orci ullamcorper vitae. Praesent vitae leo tristique, euismod erat et, pulvinar magna. Pellentesque efficitur sagittis congue. Praesent gravida, nunc in lacinia eleifend, erat nisl euismod libero, vel venenatis est tortor sed nulla. Nulla convallis mattis quam id condimentum. Morbi pharetra nunc a enim porta, ut mollis odio gravida.

      Aliquam at odio gravida, venenatis nisi at, sagittis nisl. Fusce laoreet magna et leo suscipit auctor. Suspendisse consequat, ex eget tempus dictum, sem sem tristique eros, non convallis erat justo non purus. Curabitur mollis ipsum vel auctor eleifend. Nullam rutrum enim nulla, non luctus diam tempus in. Cras auctor nisl vel mauris mattis, ac fermentum diam egestas. Morbi tincidunt convallis consectetur.

      Aenean egestas vestibulum nibh, ac rutrum libero tempor ut. Mauris pharetra mauris ac vestibulum dapibus. Quisque suscipit orci lacus, nec pellentesque justo elementum a. Sed id ipsum sem. Integer in vestibulum neque. Ut venenatis fringilla nisl eu vulputate. Aenean elementum fringilla nunc, eget auctor lectus. Etiam tincidunt, velit nec cursus ullamcorper, enim tortor vehicula diam, in eleifend est est sit amet risus. Vestibulum ipsum sem, tempus quis faucibus quis, egestas quis lacus. Quisque metus diam, pellentesque quis risus sed, maximus dictum lorem. Phasellus eget porttitor est. Ut sodales lacus elit.
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn @click="closeDialog()">
        Zamknij
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
  export default {
    name: 'EventDetailsDialog',
    methods: {
      closeDialog () {
        this.$emit('close');
      },
    },
  };
</script>

<style scoped>

</style>
