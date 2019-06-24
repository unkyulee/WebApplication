import Typography from "./Typography";

class UILayoutWrapper {
  generate(ui, data) {
    switch (ui.type) {
      case "typography":
      default:
        return Typography.generate(ui, data);
    }
  }
}

export default new UILayoutWrapper();
