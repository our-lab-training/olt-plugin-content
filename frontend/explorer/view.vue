<template>
  <component v-if="displayData.view" :is="displayData.view" :opts="displayData.opts || {}" />
</template>

<script>
import { mapGetters } from 'vuex';
import supportedFiles from '../../supportedFiles';
import directory from './view/directory.vue';
import textView from './view/text.vue';
import markdown from './view/markdown.vue';

export default {
  components: {
    directory,
    textView,
    markdown,
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters('content', { currentContent: 'current' }),
    displayData() { return supportedFiles[this.currentContent.type]; },
  },
};
</script>
