// @ts-nocheck
import {
  getStorage,
  ref,
  uploadBytes,
  listAll,
  getDownloadURL,
} from "firebase/storage";

export default {
  // upload file to a folder
  async upload(path, file) {
    const storage = getStorage(firebase);
    const storageRef = ref(storage, path);

    await uploadBytes(storageRef, file);
  },

  async list(path) {
    const storage = getStorage(firebase);
    const listRef = ref(storage, path);

    let response = await listAll(listRef);
    let files = [];

    // add folders
    for (let folder of response.prefixes) {
      files.push({
        type: "folder",
        path: folder.fullPath,
        name: folder.name,
      });
    }

    // add files
    for (let file of response.items) {
      files.push({
        type: "file",
        path: file.fullPath,
        name: file.name,
      });
    }

    return files;
  },

  async url(path) {
    const storage = getStorage(firebase);
    const fileRef = ref(storage, path);

    return await getDownloadURL(fileRef);
  },
};
