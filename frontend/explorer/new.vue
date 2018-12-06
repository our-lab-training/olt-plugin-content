<template>
  <v-dialog
      v-model="dialog"
      max-width="290"
    >
      <v-card>
        <v-card-title class="headline">Create a new {{fileRef}}.</v-card-title>
        <v-card-text>
          <span v-if="error" class="error--text">{{error}}<br><br></span>
          Create a {{fileRef}} at <code>/{{parent.path}}</code>
          <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="create()">
            <v-text-field
              :label="`Unique ${fileRef[0].toUpperCase()}${fileRef.slice(1)} Name`"
              :suffix="suffix"
              :hint="(!suffix && fileRef !== 'folder')
                ? 'You must add a file extension. e.g. `.txt`'
                : ''
              "
              v-model="filename"
              :rules="filenameRules"
              validate-on-blur
              required
            />
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            flat="flat"
            @click="dialog = false"
          >
            Cancel
          </v-btn>

          <v-btn
            color="green darken-1"
            flat="flat"
            @click.stop="create()"
            :loading="isOperationPending"
            :disabled="!valid || isOperationPending"
          >
            Create
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import { capitalize } from 'lodash';
import store from '@/store';
import router from '@/router';
import supportedFiles from '../../supportedFiles';

const getType = (filename) => {
  const ext = filename.split('.').pop();
  if (!ext) return undefined;
  return Object.keys(supportedFiles).find(i => supportedFiles[i].ext.indexOf(ext) !== -1);
};
let suffix;

export default {
  data() {
    return {
      valid: true,
      filename: '',
      filenameRules: [
        v => /^[\w-. ]+$/.test(v) || 'Invalid file name charaters.',
        (v) => {
          let filename = v;
          if (suffix && !RegExp(`${suffix.replace('.', '\\.')}$`).test(filename)) {
            filename += suffix;
          }
          if (router.history.current.query.type === 'directory') filename += '/.directory';
          if (!getType(filename)) return 'Invalid file extension.';
          return !store.getters['content/find']({ query: { filename } }).data.length || 'This file name is already taken.';
        },
      ],
      dialog: true,
      error: '',
    };
  },
  methods: {
    async create() {
      this.error = '';
      if (!this.$refs.form.validate()) return;
      let content = '';
      if (this.$route.query.type === 'markdown') content += `# ${capitalize(this.filename.split('.').shift())}`;
      let { filename } = this;
      if (this.suffix && !RegExp(`${this.suffix.replace('.', '\\.')}$`).test(filename)) {
        filename += this.suffix;
      }
      if (this.$route.query.type === 'directory') filename += '/.directory';
      const name = `${this.currentGroup._id}/${this.parent.path ? `${this.parent.path}/` : ''}${filename}`;
      const perms = (this.parent.perms || []).filter(p => p !== 'superadmin.content.deleteroots');
      console.log(name, perms);
      try {
        await this.$content.createFile(name, content, getType(filename), perms);
      } catch (err) {
        this.error = `An error occured creating the new ${this.fileRef}, please contact an administrator.`;
        return console.error(err); // eslint-disable-line no-console, consistent-return
      }
      this.dialog = false;
      this.$router.replace('?');
    },
  },
  computed: {
    ...mapGetters('content', {
      currentContent: 'current',
      getContent: 'get',
      findContent: 'find',
    }),
    ...mapState('content', ['isOperationPending']),
    ...mapGetters('groups', { currentGroup: 'current' }),
    parent() {
      return this.$route.query.parent
        ? this.getContent(this.$route.query.parent)
        : this.currentContent;
    },
    suffix() { suffix = this.$route.query.type === 'markdown' ? '.md' : ''; return suffix; },
    fileRef() { return this.$route.query.type === 'directory' ? 'folder' : 'file'; },
  },
};
</script>

<style scoped>
</style>
