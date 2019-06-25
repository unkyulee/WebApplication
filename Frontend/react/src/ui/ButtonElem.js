import React from "react";
import Button from "@material-ui/core/Button";

// user services
import authService from "../services/auth/auth.service";
import restService from "../services/rest.service";
import configService from "../services/config.service";
import eventService from "../services/event.service";
import navService from "../services/nav.service";

class ButtonElem extends React.Component {
  constructor() {
    super();
    // save as a services
    this.auth = authService;
    this.rest = restService;
    this.config = configService;
    this.event = eventService;
    this.nav = navService;
  }

  onClick = () => {
    // extract from props
    const { uiElement, data } = this.props;
    this.uiElement = uiElement;
    this.data = data;

    if (this.uiElement.click) {
      try {
        eval(this.uiElement.click);
      } catch (e) {
        console.error(e);
      }
    }
  };

  condition = () => {
    // extract from props
    const { uiElement, data } = this.props;
    this.uiElement = uiElement;
    this.data = data;

    let result = true;
    if (this.uiElement.condition) {
      try {
        result = eval(this.uiElement.condition);
      } catch (e) {
        result = false;
      }
    }
    return result;
  };

  render() {
    const { uiElement, data } = this.props;

    let screen = null;
    switch (uiElement.inputType) {
      default:
        screen = (
          <Button
            style={uiElement.style}
            className={uiElement.class}
            color={uiElement.color}
            onClick={this.onClick}
          >
            {uiElement.label}
          </Button>
        );
    }
    return screen;
  }
}

export default ButtonElem;
