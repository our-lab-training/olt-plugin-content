import router from '@/router';
import plugin from '../plugin.json';
import placehold from './placehold.vue';

router.addRoutes([
  {
    path: '/:groupId/content',
    component: placehold,
  },
]);

export default plugin;
