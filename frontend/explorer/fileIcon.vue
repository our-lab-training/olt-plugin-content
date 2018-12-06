<template>
  <span :class="`file-icon ${displayData.stack ? 'fa-stack' : ''} fa-${size || 1}x`" :style="style">
    <i v-if="displayData.stack" class="fal fa-file fa-stack-1x"></i>
    <i :class="`fal fa-${displayData.icon} ${displayData.stack ? 'fa-stack-1x' : ''}`"></i>
  </span>
</template>

<script>
import supportedFiles from '../../supportedFiles';

export default {
  props: ['content', 'size', 'style'],
  data() {
    return {};
  },
  computed: {
    displayData() { return this.content ? supportedFiles[this.content.type] : {}; },
  },
};
</script>

<style scoped>
.file-icon {
  margin-right: 0.5em!important;
}
</style>
