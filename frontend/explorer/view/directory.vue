<template>
  <div>
    <v-card>
      <v-toolbar dense>
        <back-btn />
        <v-breadcrumbs :items="crumbs" v-if="$vuetify.breakpoint.mdAndUp">
          <v-icon slot="divider">fal fa-angle-right</v-icon>
          <template slot="item" slot-scope="props">
            <a
              :to="props.item.to"
              @click="$router.contPush(props.item.to)"
              v-if="props.item.to != $route.params.path"
            >
              {{ props.item.text.replace(/\b\w/g, l => l.toUpperCase()) }}
            </a>
            <span v-else>
              {{ props.item.text.replace(/\b\w/g, l => l.toUpperCase()) }}
            </span>
          </template>
        </v-breadcrumbs>
        <v-select
          v-else
          :items="crumbs"
          :value="$route.params.path"
          @input="$router.contPush($event)"
          item-value="to"
        ></v-select>
        <v-spacer/>
        <new-button />
      </v-toolbar>
      <v-card-text class="grey lighten-3">
        <v-container fluid grid-list-md v-if="subdirs.length"><v-layout
          align-start
          justify-start
          row wrap
        >
          <v-flex
            xs6 sm4 lg3 xl2
            v-for="(subdir) in subdirs.filter(d => !/^\./.test(d.name) || showHidden)"
            :key="subdir._id"
          >
            <v-card
              hover
              :to="subdir._id"
              @click.prevent="$router.contPush(subdir._id)"
              @contextmenu="showMenu($event, subdir)"
            >
              <v-card-title class="text-capitalize body-2">
                <file-icon :content="subdir" size="2"/>
                <v-badge
                  color="white"
                  :value="/^\./.test(subdir.name)"
                >
                  <v-icon slot="badge" small>fal fa-eye-slash</v-icon>
                  <span>
                    {{subdir.name}}
                  </span>
                </v-badge>
              </v-card-title>
            </v-card>
          </v-flex>
        </v-layout></v-container>
        <v-divider v-if="subdirs.length && subfiles.length"/>
        <v-container fluid grid-list-md v-if="subfiles.length"><v-layout
          align-start
          justify-start
          row wrap
        >
          <v-flex
            xs6 sm4 lg3 xl2
            v-for="(subfile) in subfiles.filter(f => !/^\./.test(f.filename) || showHidden)"
            :key="subfile.key"
          >
            <v-card
              hover
              :to="subfile._id"
              @click.prevent="
                $router.contPush(subfile._id)
              "
              @contextmenu="showMenu($event, subfile)"
            >
              <v-card-title class="body-2">
                <file-icon :content="subfile" size="2"/>
                <v-badge color="white" :value="/^\./.test(subfile.filename)">
                  <v-icon slot="badge" small>fal fa-eye-slash</v-icon>
                  <span>
                    {{subfile.filename}}
                  </span>
                </v-badge>
              </v-card-title>
            </v-card>
          </v-flex>
        </v-layout></v-container>
        <v-container fluid grid-list-md v-if="!subdirs.length && !subfiles.length"><v-layout
          align-center
          justify-center
          row wrap
        >
          <v-flex shrink>
            No files or folders found <new-button/>
          </v-flex>
        </v-layout></v-container>
      </v-card-text>
    </v-card>

    <v-menu
      v-model="menu.show"
      transition="slide-y-transition"
      :position-x="menu.x"
      :position-y="menu.y"
      absolute
      offset-y
    >
      <v-list>
        <v-list-tile
          class="error--text"
          @click.stop="$content.deleteFile(menu.context); menu.show=false;"
          v-if="hasPerm(`${currentGroup._id}.content.write`)"
        >
          <v-list-tile-action><v-icon>far fa-trash</v-icon></v-list-tile-action>
          <v-list-tile-title>Delete</v-list-tile-title>
        </v-list-tile>
        <v-list-tile
          v-if="menu.context && menu.context.type !== 'text/x-directory'"
          class="success--text"
          @click.stop="$content.downloadFile(menu.context); menu.show=false;"
        >
          <v-list-tile-action>
            <v-icon v-if="!isOperationPending">fal fa-cloud-download</v-icon>
            <v-icon v-else>fas fa-circle-notch fa-spin</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>Download</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import fileIcon from '../fileIcon.vue';
import newButton from '../new/button.vue';
import backBtn from '../back.vue';

export default {
  components: {
    fileIcon,
    newButton,
    backBtn,
  },
  data() {
    return {
      menu: {
        show: false,
        context: null,
        x: 0,
        y: 0,
      },
    };
  },
  computed: {
    ...mapGetters('groups', { currentGroup: 'current' }),
    ...mapGetters('content', { dir: 'current', findContent: 'find', getContent: 'get' }),
    ...mapState('content', ['isOperationPending']),
    ...mapGetters('users', { hasPerm: 'hasPerm' }),
    showHidden() { return typeof this.$route.query.showHidden !== 'undefined'; },
    subdirs() {
      let res = this.findContent({
        query: {
          parent: this.dir._id,
          type: 'text/x-directory',
        },
      }).data;
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      res = this.$content._sort(res);
      return res;
    },
    subfiles() {
      let res = this.findContent({
        query: {
          parent: this.dir._id,
          type: { $ne: 'text/x-directory' },
        },
      }).data;
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      res = this.$content._sort(res);
      return res;
    },
    crumbs() {
      if (!this.dir) return [];
      const crumbs = [];
      let curr = this.dir;
      while (curr.parent) {
        crumbs.push({ text: curr.name, to: curr._id });
        curr = this.getContent(curr.parent);
      }
      crumbs.push({ text: '/', to: '' });
      return crumbs.reverse();
    },
  },
  methods: {
    showMenu(e, context) {
      e.preventDefault();
      this.menu.show = false;
      this.menu.x = e.clientX;
      this.menu.y = e.clientY;
      this.menu.context = context;
      this.$nextTick(() => {
        this.menu.show = true;
      });
    },
  },
};
</script>

<style scoped>
.ifolder {
  padding-right: 1em;
}
</style>
