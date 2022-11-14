<template>
  <FileUpload
    name="files[]"
    :multiple="uiElement.multiple ?? true"
    :accept="uiElement.accept ?? 'image/*'"
    :maxFileSize="uiElement.maxFileSize ?? 1000000"
    :customUpload="uiElement.customUpload ?? false"
    @uploader="customUploader"
    @upload="uploadComplete($event)"
  >
    <template #content>
      <ul v-if="uploadedFiles && uploadedFiles[0]">
        <li v-for="file of uploadedFiles[0]" :key="file">
          {{ file.name }} - {{ file.size }} bytes
        </li>
      </ul>
    </template>
    <template #empty>
      <p>{{ uiElement.message ?? "Drag and drop files to here to upload." }}</p>
    </template>
  </FileUpload>
</template>

<script lang="ts">
// @ts-nocheck
import Base from "./Base";
import { defineComponent } from "vue";
export default defineComponent({
  extends: Base,
  data() {
    return {
      uploadedFiles: [],
      files: [],
      totalSize: 0,
      totalSizePercent: 0,
    };
  },
  methods: {
    async customUploader(event) {
      console.log(event);
      for (let file of event.files) {
        this.storage.upload(`images/${file.name}`, file);
      }

      //
      if (this.uiElement?.customUploader) {
        try {
          eval(this.uiElement.customUploader);
        } catch (ex) {
          console.error(ex);
        }
      }
    },
    uploadEvent(callback) {
      this.totalSizePercent = this.totalSize / 10;
      callback();
    },
    uploadComplete(event) {
      console.log(event);
    },
    formatSize(bytes) {
      if (bytes === 0) {
        return "0 B";
      }

      let k = 1000,
        dm = 3,
        sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
        i = Math.floor(Math.log(bytes) / Math.log(k));

      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
    },
  },
});
</script>
