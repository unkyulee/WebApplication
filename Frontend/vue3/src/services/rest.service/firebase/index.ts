// @ts-nocheck
import {
  query,
  orderBy,
  getFirestore,
  collection,
  getDocs,
} from "firebase/firestore/lite";

export default {
  async request(url, data = {}, method, options) {
    let response = { data: [] };
    // parameters
    if (url.indexOf("?") == -1) url += "?";

    // before ?
    let location = url.substring(0, url.indexOf("?"));
    let parameters = url.substring(url.indexOf("?") + 1);
    parameters = new URLSearchParams(parameters);

    // collection
    let locations = location.split("/");
    let name = locations[locations.length - 1];

    // request data from the collection
    const db = getFirestore(firebase);
    const c = collection(db, name);
    let queryParams = [c];

    // sorting
    if (parameters.has("_sort_desc"))
      queryParams.push(orderBy(parameters.get("_sort_desc"), "desc"));
    if (parameters.has("_sort"))
      queryParams.push(orderBy(parameters.get("_sort")));

    // request data
    const q = query(...queryParams);
    const s = await getDocs(q);

    response.data = s.docs.map((doc) => doc.data());

    return response;
  },
};
