import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';

const Board = () => import(/* webpackChunkName: "board" */ '../views/Board.vue');
const BoardSettings = () => import(/* webpackChunkName: "board-settings" */ '../views/BoardSettings.vue');
const EventsArchive = () => import(/* webpackChunkName: "events-archive" */ '../views/EventsArchive.vue');
const Create = () => import(/* webpackChunkName: "create" */ '../views/Create.vue');
const RouteNotFound = () => import(/* webpackChunkName: "route-not-found" */ '../views/RouteNotFound.vue');

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
    path: '/board/:boardId/event/:eventId/edit',
    name: 'BoardEditEvent',
    component: Board,
  },
  {
    path: '/board/:boardId/create-event',
    name: 'BoardCreateEvent',
    component: Board,
  },
  {
    path: '/board/:boardId/create-event/:eventType',
    name: 'BoardCreateEvent',
    component: Board,
  },
  {
    path: '/board/:boardId/settings',
    component: BoardSettings,
    children: [
      {
        path: 'general',
        name: 'BoardSettingsGeneral',
      },
      {
        path: 'join-requests',
        name: 'BoardSettingsJoinRequests',
      },
      {
        path: 'members',
        name: 'BoardSettingsMembers',
      },
      {
        path: 'subjects',
        name: 'BoardSettingsSubjects',
      },
      {
        path: '',
        redirect: 'general',
      },
      {
        path: '*',
        redirect: 'general',
      },
    ],
  }, {
    path: '/board/:boardId/archive',
    name: 'EventsArchive',
    component: EventsArchive,
  },
  {
    path: '/create',
    name: 'Create',
    component: Create,
  },
  {
    path: '/d/boards/:boardId',
    redirect: '/board/:boardId',
  },
  {
    path: '/d/boards/:boardId/events/:eventId',
    redirect: '/board/:boardId/event/:eventId',
  },
  {
    path: '/d/boards-info/:boardId',
    redirect: '/board/:boardId',
  },
  {
    path: '*',
    name: 'RouteNotFound',
    component: RouteNotFound,
  },
];

const router = new VueRouter({
  routes,
  mode: 'history',
});

export default router;
