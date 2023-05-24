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
  where,
} from "firebase/firestore/lite";

import auth from "../../auth.service";

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
  if (parameters.has("_sort_desc")) {
    queryParams.push(orderBy(parameters.get("_sort_desc"), "desc"));
    parameters.delete("_sort_desc");
  }

  if (parameters.has("_sort")) {
    queryParams.push(orderBy(parameters.get("_sort")));
    parameters.delete("_sort");
  }

  // apply filter
  let search = false;
  parameters.forEach((value, key) => {
    if (key.endsWith("_like")) {
      search = true;
    } else if (key.endsWith("_contains")) {
      let _key = key.replace("_contains", "");
      queryParams.push(where(_key, "array-contains", value));
    } else {
      // display navigation where it doesn't require login
      queryParams.push(where(key, "==", value));
    }
  });

  // request data
  const q = query(...queryParams);
  const s = await getDocs(q);

  let results = s.docs.map((doc) => doc.data());

  // if search is true then filter the results
  if (search) {
    for (let row of results) {
      parameters.forEach((value, key) => {
        if (key.endsWith("_like")) {
          let search_key = key.replace("_like", "");
          if (row[search_key].toLowerCase().includes(value.toLowerCase())) {
            response.data.push(row);
          }
        }
      });
    }
  } else {
    response.data = results;
  }

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

  // remove all keys that is not defined
  for (let key of Object.keys(data)) {
    if (typeof data[key] == "undefined") delete data[key];
  }

  // request data from the collection
  const db = getFirestore(firebase);
  const c = collection(db, name);

  // who created
  if (await auth.isAuthenticated()) {
    let user = await auth.client();
    if (user) {
      if (!data._createdBy) {
        data._createdBy = user.uid;
        data._createdByName = user.displayName;
      } else {
        data._updatedBy = user.uid;
        data._updatedByName = user.displayName;
      }
    }
  }

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
    await setDoc(doc(db, name, data._id), data);
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
