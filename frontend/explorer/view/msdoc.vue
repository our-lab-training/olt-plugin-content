<template>
  <v-card>
    <v-toolbar dense>
      <back-btn />
      <v-toolbar-title>
        <span
          class="text-capitalize"
          ref="filename"
        >{{current.filename.replace(/\.[\w-]+$/, '')}}</span>.{{ext}}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-flex shrink>
        <v-select
          v-if="ext !== 'pdf'"
          :items="['MS Office', 'Google Docs']"
          v-model="render"
          label="Renderer"
        />
      </v-flex>
    </v-toolbar>
    <iframe
      v-if="url"
      :src="url"
      frameborder='0'
    >
      This is an embedded
      <a target='_blank' href='http://office.com'> Microsoft Office </a>
      document, powered by
      <a target='_blank' href='http://office.com/webapps'> Office Online </a>
      .
    </iframe>
  </v-card>
</template>
<script>
import { mapGetters, mapState } from 'vuex';
import backBtn from '../back.vue';

export default {
  components: {
    backBtn,
  },
  data() {
    return {
      presign: null,
      render: 'MS Office',
    };
  },
  computed: {
    ...mapGetters('content', ['current']),
    ...mapState('content', ['isOperationPending']),
    ext() { return this.current.filename.split('.').pop(); },
    path() { return this.$route.params.path; },
    url() {
      if (!this.presign) return '';
      if (this.ext === 'pdf') return this.presign.url;
      return this.render === 'Google Docs'
        ? `https://docs.google.com/gview?url=${this.presign.url.replace(/[&]/g, '%26')}&embedded=true`
        : `https://view.officeapps.live.com/op/embed.aspx?src=${this.presign.url.replace(/[&]/g, '%26')}`;
    },
  },
  mounted() {
    setTimeout(async () => {
      if (!this.current) return console.log('nope');
      const content = await this.$content._getPresign(this.current, 'read');
      this.presign = content.presign;
      return content;
    }, 200);
  },
  watch: {
    async path() {
      if (!this.current) return;
      const content = await this.$content._getPresign(this.current, 'read');
      this.presign = content.presign;
    },
  },
};
</script>

<style scoped>
iframe {
  width: 100%;
  height: 75vh;
}
</style>

