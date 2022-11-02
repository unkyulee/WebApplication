// @ts-nocheck
import { getFirestore, doc, getDoc } from "firebase/firestore/lite";

export default {
  async get(uiElementId) {
    // load from firestore
    let ui = {};
    try {
      const db = getFirestore(firebase);
      const uiRef = doc(db, "ui", uiElementId);
      const uiSnap = await getDoc(uiRef);

      if (uiSnap.exists()) {
        ui = uiSnap.data();
      }
    } catch (ex) {
      console.error(ex);
    }

    return ui;
  },

  async page(_id) {
    // load from firestore
    let page = {};
    try {
      const db = getFirestore(firebase);
      const pageRef = doc(db, "page", _id);
      const pageSnap = await getDoc(pageRef);

      if (pageSnap.exists()) {
        page = pageSnap.data();
      }
    } catch (ex) {
      console.error(ex);
    }

    return page;
  },
};
