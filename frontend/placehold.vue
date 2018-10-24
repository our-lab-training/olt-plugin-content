<template>
  <span>Content Placeholder for {{current.name}}</span>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      current: this.currentGroup || {},
    };
  },
  computed: {
    ...mapGetters('groups', { currentGroup: 'current' }),
  },
  watch: {
    currentGroup() {
      this.current = this.currentGroup || {};
    },
  },
};
</script>
