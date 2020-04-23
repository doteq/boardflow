import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';

const Board = () => import(/* webpackChunkName: "board" */ '../views/Board.vue');
const BoardSettings = () => import(/* webpackChunkName: "board-settings" */ '../views/BoardSettings.vue');
const Create = () => import(/* webpackChunkName: "create" */ '../views/Create.vue');

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
  {
    path: '/board/:boardId/event/:eventId',
    name: 'BoardEvent',
    component: Board,
  },
  {
    path: '/board/:boardId/create-event',
    name: 'BoardCreateEvent',
    component: Board,
  },
  {
    path: '/board/:boardId/settings',
    name: 'BoardSettings',
    component: BoardSettings,
  },
  {
    path: '/create',
    name: 'Create',
    component: Create,
  },
];

const router = new VueRouter({
  routes,
  mode: 'history',
});

export default router;
