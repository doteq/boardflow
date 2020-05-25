import Firebase from 'firebase/app';
import store from '../store';
import 'firebase/firestore';
import 'firebase/auth';

console.log(process.env.NODE_ENV);

const config = process.env.NODE_ENV === 'production' ? {
  apiKey: 'AIzaSyD4c1k-Lbzc6kTc_sL-cAaSDNd_lYIX3DI',
  authDomain: 'boardflow-xyz.firebaseapp.com',
  databaseURL: 'https://boardflow-xyz.firebaseio.com',
  projectId: 'boardflow-xyz',
  storageBucket: 'boardflow-xyz.appspot.com',
  messagingSenderId: '153517485585',
  appId: '1:153517485585:web:c93556f380e7ee31a38bb0',
} : {
  apiKey: 'AIzaSyAA4qiaokBoR3aXGf7hwVbK0JcqpZIFhps',
  authDomain: 'task-overflow.firebaseapp.com',
  databaseURL: 'https://task-overflow.firebaseio.com',
  projectId: 'task-overflow',
  storageBucket: 'task-overflow.appspot.com',
  messagingSenderId: '948914702684',
  appId: '1:948914702684:web:7995368b5d8610c9991999',
};

export default {
  install (Vue, options) {
    const firebase = Firebase.initializeApp(config);
    const database = firebase.firestore();
    const auth = firebase.auth();
    const googleProvider = new Firebase.auth.GoogleAuthProvider();
    const facebookProvider = new Firebase.auth.FacebookAuthProvider();
    Vue.prototype.$auth = {
      signInWithGoogle: (redirect = false) => (redirect
        ? auth.signInWithRedirect(googleProvider)
        : auth.signInWithPopup(googleProvider)),
      signInWithFacebook: (redirect = false) => (redirect
        ? auth.signInWithRedirect(facebookProvider)
        : auth.signInWithPopup(facebookProvider)),
      linkGoogle: async () => {
        await auth.currentUser.linkWithPopup(googleProvider);
        store.dispatch('updateUserAuth', { user: auth.currentUser });
      },
      linkFacebook: async () => {
        await auth.currentUser.linkWithPopup(facebookProvider);
        store.dispatch('updateUserAuth', { user: auth.currentUser });
      },
      unlinkFacebook: async () => {
        await auth.currentUser.unlink(facebookProvider.providerId);
        store.dispatch('updateUserAuth', { user: auth.currentUser });
      },
      signOut: () => auth.signOut(),
    };
    auth.onAuthStateChanged(async (user) => {
      store.dispatch('updateUserAuth', { user });
      if (user) {
        try {
          const userDataDocReference = database.collection('user-data').doc(user.uid);
          if (!(await userDataDocReference.get()).exists) {
            userDataDocReference.set({
              name: user.displayName,
              photoURL: user.photoURL,
            });
          } else {
            userDataDocReference.update({
              photoURL: user.photoURL,
            });
          }
          store.dispatch('bindUserData', {
            database,
            userUid: user.uid,
          });
        } catch (error) {
          console.error(error);
        }
      } else {
        store.dispatch('unbindUserData');
      }
    });
    Vue.prototype.$database = database;

    store.dispatch('bindBoardsInfo', {
      database,
    });
    store.dispatch('bindUserDataList', {
      database,
    });
  },
};
