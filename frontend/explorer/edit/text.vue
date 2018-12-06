<template>
  <v-card @keyup.ctrl.83.stop="save">
    <v-toolbar dense>
      <v-btn
        @click.stop="$router.go(-1)"
        flat
        icon
      >
        <v-icon>far fa-arrow-alt-left</v-icon>
      </v-btn>
      <v-toolbar-title>
        <span
          class="text-capitalize"
          ref="filename"
          contenteditable
        >{{current.filename.replace(/\.[\w-]+$/, '')}}</span>.{{ext}}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-flex xs4 md2>
        <v-select
          :items="fileTypes"
          v-model="type"
        />
      </v-flex>
      <v-btn
        @click.stop="save"
        flat
        icon
        :loading="isOperationPending"
        :disabled="isOperationPending || text === savedText"
      >
        <v-icon>fal fa-save</v-icon>
      </v-btn>
    </v-toolbar>
    <v-card-text>
      <codemirror v-model="text" :options="Object.assign({ mode: type }, opts)"/>
    </v-card-text>
  </v-card>
</template>
<script>
/* eslint-disable import/no-extraneous-dependencies */
import 'codemirror/lib/codemirror.css';
import { codemirror } from 'vue-codemirror';
import { mapGetters, mapState } from 'vuex';
import store from '@/store';
import supportedFiles from '../../../supportedFiles';

export default {
  components: {
    codemirror,
  },
  data() {
    return {
      text: '',
      savedText: '',
      type: store.getters['content/current'].type,
      supportedFiles,
      loaded: null,
      opts: {
        lineNumbers: true,
        line: true,
      },
    };
  },
  computed: {
    ...mapGetters('content', ['current']),
    ...mapState('content', ['isOperationPending']),
    fileTypes() {
      return Object.keys(supportedFiles)
        .filter(i => supportedFiles[i].edit === 'textEdit')
        .map(i => ({ text: supportedFiles[i].name, value: i }));
    },
    filename() { return this.$refs.filename.innerHTML.trim(); },
    ext() {
      return this.current.type === this.type
        ? this.current.filename.split('.').pop()
        : supportedFiles[this.type].ext[0];
    },
  },
  mounted() { this.payload(); },
  updated() { this.payload(); },
  methods: {
    async payload() {
      if (!this.current) return '';
      if (this.current._id === this.loaded) return this.text;
      const file = await this.$content.readFile(this.current);
      const reader = new FileReader();
      reader.onload = (evt) => {
        this.text = evt.target.result;
        this.savedText = this.text;
        this.loaded = this.current._id;
      };
      return reader.readAsText(file);
    },
    async save() {
      if (!this.current) return;
      if (this.filename === this.current.filename.replace(/\.[\w-]+$/, '')) {
        const path = this.current.path ? `${this.current.path}/` : '';
        const newName = `${this.current.groupId}/${path}${this.filename}.${this.ext}`;
        await this.$content.renameFile(this.current, newName);
      }
      if (this.current.type !== this.type) {
        await this.$content.changeFileType(this.current, this.type);
      }
      await this.$content.writeFile(this.current, this.text);
      this.savedText = this.text;
    },
  },
};
</script>

<style scoped>
.v-card__text {
  padding: 0!important;
  height: calc(100vh - 108px - 34px);
}
</style>

<style>
.vue-codemirror,
.CodeMirror {
  height: 100%;
}
</style>

