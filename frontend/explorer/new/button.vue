<template>
  <v-menu offset-y>
    <v-btn slot="activator" round color="primary" dark>
      <v-icon>add</v-icon> New File
    </v-btn>
    <new-list />
  </v-menu>
</template>

<script>
import newList from './list.vue';

export default {
  components: {
    newList,
  },
};
</script>
