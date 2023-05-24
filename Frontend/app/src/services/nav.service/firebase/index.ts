// @ts-nocheck
import {
  query,
  where,
  getFirestore,
  collection,
  getDocs,
  getDoc,
  doc,
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

      // filter if any roles are existing
      let roles = {};
      let client = await auth.client();
      for (let nav of navList) {
        if (nav.roles) {
          for (let r of nav.roles) {
            // check role cache
            if (roles[r]) continue;
            // check on database
            if (await roleExists(db, r, client)) continue;
            // delete the nav
            navList.splice(navList.indexOf(nav), 1);
          }
        }
      }
    } catch (ex) {
      console.error(ex);
    }

    // save to config
    config.set("navigation", navList);

    return navList;
  },
};

async function roleExists(db, role, client) {
  const docRef = doc(db, role, client.uid);
  const docSnap = await getDoc(docRef);

  return docSnap.exists();
}
