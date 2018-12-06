<template>
  <component v-if="displayData.edit" :is="displayData.edit" :opts="displayData.opts || {}" />
</template>

<script>
import { mapGetters } from 'vuex';
import supportedFiles from '../../supportedFiles';
import markdown from './edit/markdown.vue';
import textEdit from './edit/text.vue';

export default {
  components: {
    markdown,
    textEdit,
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters('content', { currentContent: 'current' }),
    displayData() { return supportedFiles[this.currentContent.type]; },
  },
  updated() {
    if (!supportedFiles[this.currentContent.type].edit) {
      this.$route.replace({ ...this.$route, query: {} });
    }
  },
  mounted() {
    if (!supportedFiles[this.currentContent.type].edit) {
      this.$route.replace({ ...this.$route, query: {} });
    }
  },
};
</script>
