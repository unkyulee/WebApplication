// @ts-nocheck
import {
  getAuth,
  GoogleAuthProvider,
  signInWithRedirect,
  onAuthStateChanged,
} from "firebase/auth";

export default {
  async login(data) {
    const provider = new GoogleAuthProvider();
    const auth = getAuth(firebase);

    signInWithRedirect(auth, provider);
    return true;
  },

  async logout() {},

  async isAuthenticated() {
    const auth = getAuth(firebase);

    return new Promise((resolve) => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  },

  async client() {
    return {};
  },
};
