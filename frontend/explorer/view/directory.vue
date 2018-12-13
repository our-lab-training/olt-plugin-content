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
            v-for="(subdir) in subdirs"
            :key="subdir._id"
            v-if="!/^\./.test(subdir.path.replace(RegExp(`$${dir.path}/`, 'i'), '')) || showHidden"
          >
            <v-card
              hover
              :to="subdir.path"
              @click.prevent="$router.contPush(subdir.path)"
              @contextmenu="showMenu($event, subdir)"
            >
              <v-card-title class="text-capitalize body-2">
                <file-icon :content="subdir" size="2"/>
                <v-badge
                  color="white"
                  :value="/^\./.test(subdir.path.replace(RegExp(`^${dir.path}/`, 'i'), ''))"
                >
                  <v-icon slot="badge" small>fal fa-eye-slash</v-icon>
                  <span>
                    {{subdir.path.replace(RegExp(`^${dir.path}/`, 'i'), '')}}
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
            v-for="(subfile) in subfiles"
            :key="subfile.key"
            v-if="!/^\./.test(subfile.filename) || showHidden"
          >
            <v-card
              hover
              :to="`${subfile.path ? `${subfile.path}/` : ''}${subfile.filename}`"
              @click.prevent="
                $router.contPush(`${subfile.path ? `${subfile.path}/` : ''}${subfile.filename}`)
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
          @click.stop="$content.deleteFile(menu.context.name); menu.show=false;"
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
    ...mapGetters('content', { dir: 'current', findContent: 'find' }),
    ...mapState('content', ['isOperationPending']),
    showHidden() { return typeof this.$route.query.showHidden !== 'undefined'; },
    subdirs() {
      let res = this.findContent({
        query: {
          groupId: this.currentGroup._id,
          // eslint-disable-next-line
          path: v => RegExp(`^${this.dir.path ? `${this.dir.path}/` : ''}[^/]+$`, 'i').test(v),
          type: 'text/x-directory',
          _id: { $ne: this.dir._id },
        },
      }).data;
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      res = this.$content._sort(res);
      return res;
    },
    subfiles() {
      let res = this.findContent({
        query: {
          groupId: this.currentGroup._id,
          // eslint-disable-next-line
          path: this.dir.path,
          type: { $ne: 'text/x-directory' },
          _id: { $ne: this.dir._id },
        },
      }).data;
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      res = this.$content._sort(res);
      return res;
    },
    crumbs() {
      if (!this.dir) return [];
      const path = this.dir.path ? `${this.dir.path}/` : '';
      const parts = path.split('/');
      const crumbs = [{ text: '/', to: '' }];
      parts.forEach((p) => {
        if (p) {
          const last = crumbs[crumbs.length - 1];
          crumbs.push({
            text: p,
            to: `${last.to ? `${last.to}/` : ''}${p}`,
          });
        }
      });
      console.log(crumbs);
      return crumbs;
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
