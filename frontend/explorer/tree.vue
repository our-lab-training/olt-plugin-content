<template>
  <v-card>
    <v-toolbar dense>
      <v-toolbar-title class="text-capitalize">
        {{$route.name}}
      </v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <v-treeview
        v-model="tree"
        :open="open"
        :items="items"
        activatable
        item-key="name"
        open-on-click
      >
        <template slot="prepend" slot-scope="{ item, open, leaf }">
          <v-icon
            v-if="item.type === 'text/x-directory'"
            class="folder-icon"
          >
            fal {{ open ? 'fa-folder-open' : 'fa-folder' }}
          </v-icon>
          <file-icon v-else :content="{ type: item.type }" style="font-size: 1.6em;"/>
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
      open: [],
      tree: [],
      supportedFiles,
    };
  },
  computed: {
    ...mapGetters('groups', { currentGroup: 'current' }),
    ...mapGetters('content', { currentContent: 'current', findCont: 'find' }),
    items() {
      const getPath = (path, parent) =>
        this.findCont({
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
        }).data.reduce((a, cont) => {
          if (cont._id === parent) return a;
          const child = {
            name: cont.type === 'text/x-directory'
              ? cont.path.split('/').pop()
              : cont.filename,
            type: cont.type,
          };
          if (cont.type === 'text/x-directory') child.children = getPath(cont.path, cont._id);
          return [...a, child];
        }, []);
      return getPath('', null);
    },
  },
};
</script>

<style>
.v-treeview-node:not(.v-treeview-node--leaf) .folder-icon {
  margin-left: 9px;
}
</style>

