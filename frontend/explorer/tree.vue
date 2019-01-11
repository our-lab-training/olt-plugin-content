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
        open-on-click
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
    ...mapGetters('content', { currentContent: 'current', findCont: 'find', getCont: 'get' }),
    showHidden() { return typeof this.$route.query.showHidden !== 'undefined'; },
    items() {
      const roots = this.findCont({
        query: {
          name: '.directory',
          groupId: this.currentGroup._id,
          parent: { $exists: false },
        },
      }).data;
      if (!roots) return [{ name: 'Corrupt content configuration!' }];
      const getPath = (parent) => {
        let res = this.findCont({ query: { parent } }).data;
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        res = this.$content._sort(res);
        return res.reduce((a, cont) => {
          if (cont._id === parent) return a;
          const child = {
            name: cont.filename,
            type: cont.type,
          };
          if (/^\./.test(child.name) && !this.showHidden) return a;
          child.key = cont._id;
          if (cont.type === 'text/x-directory') {
            child.children = getPath(cont._id);
          }
          return [...a, child];
        }, []);
      };
      return [
        {
          name: '/',
          key: '',
          type: 'text/x-directory',
          children: getPath(roots[0]._id),
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
      if (
        this.multiple
        || this.active.length !== 1
        || this.active[0] === this.currentContent._id
      ) return;
      this.$router.contPush(this.active[0]);
    },
  },
  mounted() {
    if (!this.currentContent) return;
    let curr = this.currentContent;
    const open = ['', curr._id];
    while (curr.parent) {
      open.push(curr.parent);
      curr = this.getCont(curr.parent);
    }
    this.open = open;
    if (this.currentContent.type === 'text/x-directory') return;
    this.active = [this.currentContent._id];
  },
};
</script>

<style>
.v-treeview-node:not(.v-treeview-node--leaf) > div > div > .folder-icon {
  margin-left: 9px;
}

.v-treeview-node__content {
  cursor: pointer;
}
</style>

