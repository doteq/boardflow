import Vue from 'vue';
import Vuex from 'vuex';
import { vuexfireMutations, firestoreAction } from 'vuexfire';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    userAuth: null,
    userAuthLoaded: false,
    userData: null,
    userDataList: null,
    boardsInfo: null,
  },
  mutations: {
    updateUserAuth (state, { user }) {
      Vue.set(state, 'userAuth', user ? {
        uid: user.uid,
        photoURL: user.photoURL,
        displayName: user.displayName,
        email: user.email,
        providerData: user.providerData,
      } : null);
      state.userAuthLoaded = true;
    },
    ...vuexfireMutations,
  },
  actions: {
    updateUserAuth ({ state, commit }, value) {
      commit('updateUserAuth', value);
    },
    bindUserData: firestoreAction(
      (context, { database, userUid }) => context.bindFirestoreRef('userData', database.collection('user-data').doc(userUid)),
    ),
    unbindUserData: firestoreAction(
      (context) => context.unbindFirestoreRef('userData'),
    ),
    bindUserDataList: firestoreAction(
      (context, { database }) => context.bindFirestoreRef('userDataList', database.collection('user-data'), {
        wait: true,
      }),
    ),
    bindBoardsInfo: firestoreAction(
      (context, { database }) => context.bindFirestoreRef('boardsInfo', database.collection('boards-info'), {
        wait: true,
      }),
    ),
  },
});

export default store;
