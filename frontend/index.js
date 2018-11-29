import placehold from './placehold.vue';
import './content';

export default {
  ref: 'content',
  name: 'Content',
  settingsLink: '/group/{groupId}/content/settings',
  routes: {
    content: {
      name: 'Content',
      entry: true,
      component: placehold,
      path: '/group/{groupId}/content',
      icon: 'folder',
      visiblePerms: [
        '{groupId}.content.write',
        '{groupId}.group.update',
      ],
    },
  },
  store: { content: {} },
};
