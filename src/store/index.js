import Vue from 'vue';
import Vuex from 'vuex';
import { vuexfireMutations, firestoreAction } from 'vuexfire';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    userAuth: null,
    userData: null,
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
  },
});

export default store;
