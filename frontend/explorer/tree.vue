<template>
  <v-card
    v-shortkey.once.push="['ctrl']"
    @shortkey="multiple = !multiple"
    style="overflow-x: auto;"
  >
    <v-toolbar dense>
      <v-toolbar-title class="text-capitalize">
        {{$route.name}}
      </v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <v-treeview
        v-model="tree"
        :open.sync="open"
        :items="items"
        :active.sync="active"
        activatable
        hoverable
        :multiple-active="multiple"
        item-key="key"
      >
        <template slot="prepend" slot-scope="{ item, open, leaf, active }">
          <v-icon
            v-if="item.type === 'text/x-directory'"
            class="folder-icon"
          >
            fal {{ open || active ? 'fa-folder-open' : 'fa-folder' }}
          </v-icon>
          <file-icon v-else :content="{ type: item.type }" custStyle="font-size: 1.6em;"/>
        </template>
      </v-treeview>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex';
import supportedFiles from '../../supportedFiles';
import fileIcon from './fileIcon.vue';

export default {
  components: {
    fileIcon,
  },
  data() {
    return {
      open: [''],
      tree: [],
      active: [],
      supportedFiles,
      multiple: false,
    };
  },
  computed: {
    ...mapGetters('groups', { currentGroup: 'current' }),
    ...mapGetters('content', { currentContent: 'current', findCont: 'find' }),
    showHidden() { return typeof this.$route.query.showHidden !== 'undefined'; },
    items() {
      const getPath = (path, parent) => {
        let res = this.findCont({
          query: {
            _id: { $ne: parent },
            groupId: this.currentGroup._id,
            $or: [{
              path: v => RegExp(`^${path ? `${path}/` : ''}[^/]+$`, 'i').test(v),
              type: 'text/x-directory',
            }, {
              path,
              type: { $ne: 'text/x-directory' },
            }],
          },
        }).data;
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        res = this.$content._sort(res);
        return res.reduce((a, cont) => {
          if (cont._id === parent) return a;
          const child = {
            name: cont.type === 'text/x-directory'
              ? cont.path.split('/').pop()
              : cont.filename,
            type: cont.type,
          };
          if (/^\./.test(child.name) && !this.showHidden) return a;
          child.key = `${cont.path ? `${cont.path}/` : ''}${cont.filename}`;
          if (cont.type === 'text/x-directory') {
            child.key = cont.path;
            child.children = getPath(cont.path, cont._id);
          }
          return [...a, child];
        }, []);
      };
      return [
        {
          name: '/',
          key: '',
          type: 'text/x-directory',
          children: getPath('', null),
        },
      ];
    },
  },
  methods: {
    openFile() {
      this.$router.push();
    },
  },
  watch: {
    active() {
      const path = this.currentContent.path ? `${this.currentContent.path}/` : '';
      if (
        this.multiple
        || this.active.length !== 1
        || (
          this.currentContent.type === 'text/x-directory'
          && this.active[0] === path
        ) || (
          this.currentContent.type !== 'text/x-directory'
          && this.active[0] === `${path}${this.currentContent.filename}`
        )
      ) return;
      this.$router.contPush(this.active[0]);
    },
  },
  mounted() {
    if (!this.currentContent) return;
    const path = this.currentContent.path ? `${this.currentContent.path}/` : '';
    const parts = path.split('/');
    const open = [''];
    parts.forEach((p) => {
      if (p) {
        const last = open[open.length - 1];
        open.push(`${last ? `${last}/` : ''}${p}`);
      }
    });
    this.open = open;
    if (this.currentContent.type === 'text/x-directory') return;
    this.active = [`${path}${this.currentContent.filename}`];
  },
};
</script>

<style>
.v-treeview-node:not(.v-treeview-node--leaf) > div > div > .folder-icon {
  margin-left: 9px;
}
</style>

