// @ts-nocheck
import {
  query,
  orderBy,
  getFirestore,
  collection,
  getDocs,
  setDoc,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore/lite";

export default {
  async request(url, data, method, options) {
    if (!method || method == "get")
      return await get(url, data, method, options);
    else if (method == "post") return await post(url, data, method, options);
    else if (method == "delete") return await del(url, data, method, options);
  },
};

async function get(url, data, method, options) {
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
}

async function post(url, data, method, options) {
  let response = { status: 200, data };

  // parameters
  if (url.indexOf("?") == -1) url += "?";

  // before ?
  let location = url.substring(0, url.indexOf("?"));
  let parameters = url.substring(url.indexOf("?") + 1);
  parameters = new URLSearchParams(parameters);

  // collection
  let locations = location.split("/");
  let name = locations[locations.length - 1];

  // clean up data
  for (let key of Object.keys(data)) {
    if (!data[key]) delete data[key];
  }

  // request data from the collection
  const db = getFirestore(firebase);
  const c = collection(db, name);

  // save data
  if (data._id) {
    // update
    data._updated = new Date();
    await setDoc(doc(db, name, data._id), data);
  } else {
    // insert
    data._created = new Date();
    data._updated = new Date();

    // remove all keys that is not defined
    for (let key of Object.keys(data)) {
      if (typeof data[key] == "undefined") delete data[key];
    }
    const docRef = await addDoc(c, data);

    // save id
    data._id = docRef.id;
  }

  return response;
}

async function del(url, data, method, options) {
  let response = { status: 200, data };

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

  // save data
  if (data._id) await deleteDoc(doc(db, name, data._id));

  return response;
}
