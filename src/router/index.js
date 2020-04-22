import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';

const Board = () => import(/* webpackChunkName: "board" */ '../views/Board.vue');

Vue.use(VueRouter);

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/board/:boardId',
    name: 'Board',
    component: Board,
  },
];

const router = new VueRouter({
  routes,
  mode: 'history',
});

export default router;
