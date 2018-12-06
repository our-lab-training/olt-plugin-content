<template>
  <div>
    <v-card>
      <v-toolbar dense>
        <v-spacer/>
        <v-menu offset-y>
          <v-btn slot="activator" round color="primary" dark>
            <v-icon>add</v-icon> New File
          </v-btn>
          <v-list>
            <v-list-tile to="?new&type=markdown">
              <v-list-tile-action><v-icon>fal fa-file-invoice</v-icon></v-list-tile-action>
              <v-list-tile-title>New Document</v-list-tile-title>
            </v-list-tile>
            <v-list-tile to="?new&type=text">
              <v-list-tile-action><v-icon>fal fa-file-alt</v-icon></v-list-tile-action>
              <v-list-tile-title>New Text File</v-list-tile-title>
            </v-list-tile>
            <v-divider></v-divider>
            <v-list-tile to="?new&type=directory">
              <v-list-tile-action><v-icon>fal fa-folder-plus</v-icon></v-list-tile-action>
              <v-list-tile-title>New Folder</v-list-tile-title>
            </v-list-tile>
            <v-divider></v-divider>
            <v-list-tile to="?upload">
              <v-list-tile-action><v-icon>fal fa-cloud-upload</v-icon></v-list-tile-action>
              <v-list-tile-title>Upload File</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
      </v-toolbar>
      <v-card-text class="grey lighten-3">
        <v-container fluid grid-list-md><v-layout
          v-if="subdirs.length"
          align-start
          justify-start
          row wrap
        >
          <v-flex
            xs6 sm4 lg3 xl2
            v-for="(subdir) in subdirs"
            :key="subdir._id"
          >
            <v-card
              hover
              :to="{
                name: $route.name,
                params: {
                  groupRef: $route.params.groupRef,
                  path: subdir.path,
                },
              }"
              @contextmenu="showMenu($event, subdir)"
            >
              <v-card-title class="text-capitalize body-2">
                <file-icon :content="subdir" size="2"/>
                {{subdir.path.replace(RegExp(`$${dir.path}/`, 'i'), '')}}
              </v-card-title>
            </v-card>
          </v-flex>
        </v-layout></v-container>
        <v-divider/>
        <v-container fluid grid-list-md><v-layout
          v-if="subfiles.length"
          align-start
          justify-start
          row wrap
        >
          <v-flex
            xs6 sm4 lg3 xl2
            v-for="(subfile) in subfiles"
            :key="subfile.key"
          >
            <v-card
              hover
              :to="subfile.filename"
              @contextmenu="showMenu($event, subfile)"
            >
              <v-card-title class="text-capitalize body-2">
                <file-icon :content="subfile" size="2"/>
                {{subfile.filename}}
              </v-card-title>
            </v-card>
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
      </v-list>
    </v-menu>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import fileIcon from '../fileIcon.vue';

export default {
  components: {
    fileIcon,
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
    subdirs() {
      return this.findContent({
        query: {
          groupId: this.currentGroup._id,
          // eslint-disable-next-line
          path: v => RegExp(`^${this.dir.path ? `${this.dir.path}/` : ''}[^/]+$`, 'i').test(v),
          type: 'text/x-directory',
          _id: { $ne: this.dir._id },
        },
      }).data;
    },
    subfiles() {
      return this.findContent({
        query: {
          groupId: this.currentGroup._id,
          // eslint-disable-next-line
          path: this.dir.path,
          type: { $ne: 'text/x-directory' },
          _id: { $ne: this.dir._id },
        },
      }).data;
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
