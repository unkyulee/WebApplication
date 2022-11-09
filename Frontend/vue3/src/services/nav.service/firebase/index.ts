// @ts-nocheck
import {
  query,
  where,
  getFirestore,
  collection,
  getDocs,
} from "firebase/firestore/lite";
import config from "../../config.service";
import auth from "../../auth.service";

export default {
  async load() {
    let navList = [];

    // setup page title
    document.title = config.get("title");

    // check login status
    let isAuthenticated = await auth.isAuthenticated();

    // load from firestore
    try {
      const db = getFirestore(firebase);
      const c = collection(db, "navigation");

      // build query
      let queryParams = [c];

      // auth status filter
      if (isAuthenticated) {
        // display navigation includes login
        queryParams.push(where("login_hide", "==", false));
      } else {
        // display navigation where it doesn't require login
        queryParams.push(where("login", "==", false));
      }

      // fetch data
      const navSnapshot = await getDocs(query(...queryParams));
      navList = navSnapshot.docs.map((doc) => doc.data());

      // sort by order
      navList.sort((a, b) => a.order - b.order);
    } catch (ex) {
      console.error(ex);
    }

    // save to config
    config.set("navigation", navList);

    return navList;
  },
};
