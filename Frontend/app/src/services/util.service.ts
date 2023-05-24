// @ts-nocheck
import { readAndCompressImage } from "browser-image-resizer";

export default {
  timeout(ms) {
    return new Promise((res) => setTimeout(res, ms));
  },

  async resize(file, config) {
    return await readAndCompressImage(file, config);
  },
};
