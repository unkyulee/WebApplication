// @ts-nocheck
import { getFirestore, collection, getDocs } from "firebase/firestore/lite";
import config from "../../config.service";

export default {
  async load() {
    let navList = [];

    // setup page title
    document.title = config.get("title");

    // load from firestore
    try {
      const db = getFirestore(firebase);
      const navCol = collection(db, "navigation");
      const navSnapshot = await getDocs(navCol);
      navList = navSnapshot.docs.map((doc) => doc.data());
    } catch (ex) {
      console.error(ex);
    }

    // save to config
    config.set("navigation", navList);

    return navList;
  },
};
