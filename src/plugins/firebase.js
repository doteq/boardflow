import Firebase from 'firebase/app';
import store from '../store';
import 'firebase/firestore';
import 'firebase/auth';

const config = {
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
  },
};
