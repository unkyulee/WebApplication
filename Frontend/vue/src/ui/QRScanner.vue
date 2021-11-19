<template>
  <div id="reader"></div>
</template>

<script>
import Vue from "vue";
import Base from "./Base";
const obj = require("object-path");
const moment = require("moment");
// To use Html5QrcodeScanner (more info below)
import { Html5QrcodeScanner } from "html5-qrcode";
// To use Html5Qrcode (more info below)
import { Html5Qrcode } from "html5-qrcode";

export default Vue.component("qr-scanner", {
  extends: Base,
  data: function() {
    return {
      scanner: null
    }
  },
  mounted() {
    this.scanner = new Html5QrcodeScanner("reader", {
      fps: 10,
      qrbox: { width: this.uiElement.width, height: this.uiElement.height },
    });
    this.scanner.render(this.onScanSuccess);
  },
  methods: {
    async onScanSuccess(decodedText, decodedResult) {
      // handle the scanned code as you like, for example:      
      if(this.uiElement.scan) {
        try {
          eval(this.uiElement.scan);
        } catch(ex) {
          console.error(ex)
        }
      }
    },
  },
});
</script>