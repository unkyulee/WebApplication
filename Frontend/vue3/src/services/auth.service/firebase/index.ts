// @ts-nocheck
import {
  getAuth,
  GoogleAuthProvider,
  signInWithRedirect,
  onAuthStateChanged,
  signOut,
  getRedirectResult,
} from "firebase/auth";

import event from "../../event.service";
import rest from "../../rest.service";

export default {
  _client: {},

  async login(data) {
    const auth = getAuth(firebase);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    signInWithRedirect(auth, provider);
    return true;
  },

  async logout() {
    const auth = getAuth(firebase);

    // signout from firebase
    await signOut(auth);

    //
    // Sign-out successful.
    event.send({ name: "init" });
  },

  async isAuthenticated() {
    const auth = getAuth(firebase);

    try {
      let result = await getRedirectResult(auth);
      if (result && result.user) {
        // register auth data to database
        let data = JSON.parse(JSON.stringify(auth.currentUser));
        data._id = data.email;
        await rest.request(`/api/admin/user`, data, "post");
        return true;
      }
    } catch (ex) {
      alert(ex.message);
    }

    return new Promise((resolve) => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          this._client = user;
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  },

  async client() {
    return this._client;
  },
};
