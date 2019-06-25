import React from "react";

// ui elements
import Typography from "./Typography";
import Input from "./Input";
import ButtonElem from "./ButtonElem";

class UILayoutWrapper extends React.Component {
  render() {
    const { uiElement, data } = this.props;
    switch (uiElement.type) {
      case "button":
        return (
          <ButtonElem
            uiElement={uiElement}
            data={data}
            style={uiElement.layoutStyle}
          />
        );
      case "input":
        return (
          <Input
            uiElement={uiElement}
            data={data}
            style={uiElement.layoutStyle}
          />
        );
      case "typography":
      default:
        return (
          <Typography
            uiElement={uiElement}
            data={data}
            style={uiElement.layoutStyle}
          />
        );
    }
  }
}

export default UILayoutWrapper;
