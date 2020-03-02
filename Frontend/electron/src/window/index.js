const { process, ipcRenderer } = require("electron");

// services
const event = require("../service/event");
const config = require("../service/config");

// custom titlebar
if (process.platform !== 'darwin') {
  const titlebar = require("custom-electron-titlebar");
  // Create main window titlebar
  let mainTitlebar = new titlebar.Titlebar({
    backgroundColor: titlebar.Color.fromHex("#202224"),
    itemBackgroundColor: titlebar.Color.fromHex("#1c2028"),
    icon: config.get("module.desktop.icon")
  });

  // Setting title explicitly
  mainTitlebar.updateTitle(config.get("module.desktop.title"));
}


