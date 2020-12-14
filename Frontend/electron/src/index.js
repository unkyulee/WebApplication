if (window.process && window.process.type) {
  const Store = require("electron-store");
  window.store = new Store();

  // restore service_url
  let service_url = window.store.get("service_url");
  if (!localStorage.getItem("service_url") && service_url)
    localStorage.setItem("service_url", service_url);

  let token = window.store.get("local.token");
  if(!localStorage.getItem("token") && token) 
    localStorage.setItem("token", token);

  // handle events
  const { ipcRenderer } = require("electron");
  ipcRenderer.on("channel", (sender, $event) => {
    if ($event.data) {
      window.__CONFIG__.event.send($event.data);
      window.__CONFIG__.event.send({ name: "changed" });
    }
  });
}
