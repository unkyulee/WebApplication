// @ts-nocheck
import {
  query,
  orderBy,
  getFirestore,
  collection,
  getDocs,
} from "firebase/firestore/lite";
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
      const navQuery = query(navCol, orderBy("order"));
      const navSnapshot = await getDocs(navQuery);

      navList = navSnapshot.docs.map((doc) => doc.data());
    } catch (ex) {
      console.error(ex);
    }

    // save to config
    config.set("navigation", navList);

    return navList;
  },
};
