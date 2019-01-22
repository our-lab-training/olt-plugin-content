import explore from './explore.vue';
import './content';
import perms from '../perms';

export default {
  ref: 'content',
  name: 'Content',
  settingsLink: '/group/{groupId}/content/settings',
  routes: {
    content: {
      name: 'Content',
      entry: true,
      component: explore,
      path: '/group/{groupId}/content/:path*',
      icon: 'folder',
      visiblePerms: [
        '{groupId}.content.read',
      ],
    },
  },
  store: {
    content: {
      state: {
        isOperationPending: false,
      },
      mutations: {
        unsetOperationPending(state) {
          state.isOperationPending = false;
        },
        setOperationPending(state) {
          state.isOperationPending = true;
        },
      },
    },
  },
  perms,
};
