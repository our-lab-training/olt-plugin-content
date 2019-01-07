<template>
  <v-container fluid grid-list-md style="padding:0;"><v-layout>
    <v-flex class="md4 lg3" v-if="$vuetify.breakpoint.mdAndUp">
      <tree />
    </v-flex>
    <v-flex class="xs12 md8 lg9">
      <viewFile v-if="typeof $route.query.edit === 'undefined'" />
      <editFile v-else />
    </v-flex>
  </v-layout></v-container>
</template>

<script>
import { mapGetters } from 'vuex';
import store from '@/store';
import router from '@/router';
import tree from './explorer/tree.vue';
import viewFile from './explorer/view.vue';
import editFile from './explorer/edit.vue';

const isDirectory = (path, parent = '', groupId) => {
  const name = `${groupId}${parent ? `/${parent}` : ''}${path ? `/${path.replace(/\/$/, '')}` : ''}/.directory`;
  const contents = store.getters['content/find']({ query: { name } }).data;
  return contents.length ? contents[0]._id : null;
};
const isFile = (path, parent = '', groupId) => {
  const name = `${groupId}${parent ? `/${parent}` : ''}${path ? `/${path.replace(/\/$/, '')}` : ''}`;
  const contents = store.getters['content/find']({ query: { name } }).data;
  return contents.length ? contents[0]._id : null;
};

const loadPath = (to, from, next) => {
  const group = store.getters['groups/current'];
  // console.log(to, store.getters['content/find']());
  const { path } = to.params;
  const { parent } = to.meta;
  const gPath = (to.meta.path || '').replace('{groupId}', group.slugs ? group.slugs[0] : group._id);
  router.contPush = p => router.push(gPath.replace(':path*', p));
  let pathId = isDirectory(path, parent, group._id);
  if (!pathId) pathId = isFile(path, parent, group._id);
  if (!pathId) return next(gPath.replace(':path*', '') || '/');
  store.commit('content/setCurrent', pathId);
  return next();
};

export default {
  components: {
    tree,
    viewFile,
    editFile,
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters('groups', { currentGroup: 'current' }),
    ...mapGetters('content', { currentContent: 'current' }),
  },
  beforeRouteEnter: async (to, from, next) => {
    const group = store.getters['groups/current'];
    await store.dispatch('content/find', { query: { groupId: group._id } });
    loadPath(to, from, next);
  },
  beforeRouteUpdate: async (to, from, next) => {
    const group = store.getters['groups/current'];
    await store.dispatch('content/find', { query: { groupId: group._id } });
    loadPath(to, from, next);
  },
  beforeRouteLeave: (to, from, next) => { store.commit('content/clearCurrent'); next(); },
};
</script>
