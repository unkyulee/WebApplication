if (window.process && window.process.type) {

  // handle events
  const { ipcRenderer } = require("electron");
  ipcRenderer.on("channel", (sender, $event) => {
    if ($event.data) {
      window.__CONFIG__.event.send($event.data);
      window.__CONFIG__.event.send({ name: "changed" });
    }
  });

  // load electron-store
  const Store = require("electron-store");
  window.store = new Store();
}
