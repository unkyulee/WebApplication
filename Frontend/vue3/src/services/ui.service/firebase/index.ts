// @ts-nocheck
import { getFirestore, doc, getDoc } from "firebase/firestore/lite";
import auth from "../../auth.service";

export default {
  cache: {},
  async get(uiElementId) {
    // load from firestore
    let ui = {};
    if (this.cache[uiElementId]) {
      return this.cache[uiElementId];
    }
    try {
      const db = getFirestore(firebase);
      const uiRef = doc(db, "ui", uiElementId);
      const uiSnap = await getDoc(uiRef);

      if (uiSnap.exists()) {
        ui = uiSnap.data();
        this.cache[uiElementId] = ui;
      }
    } catch (ex) {
      console.error(ex);
    }

    return ui;
  },

  async page(_id) {
    if (_id == "login") {
      // requested login page
      return await auth.login();
    }

    // load from firestore
    let page = {};
    if (this.cache[_id]) {
      return this.cache[_id];
    }
    try {
      const db = getFirestore(firebase);
      const pageRef = doc(db, "page", _id);
      const pageSnap = await getDoc(pageRef);

      if (pageSnap.exists()) {
        page = pageSnap.data();
        this.cache[_id] = page;
      }
    } catch (ex) {
      console.error(ex);
    }

    return page;
  },
};
