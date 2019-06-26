import React from "react";
import Button from "@material-ui/core/Button";
import safeEval from "safe-eval";

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

  condition = () => {
    let result = true;
    if (this.uiElement.condition) {
      try {
        result = safeEval(this.uiElement.condition, { ...this });
      } catch (e) {
        result = false;
      }
    }
    return result;
  };

  onClick = () => {
    if (this.uiElement.click) {
      try {
        safeEval(this.uiElement.click, { ...this });
      } catch (e) {
        console.error(e);
      }
    }
  };

  render() {
    // extract from props
    this.uiElement = this.props.uiElement;
    this.data = this.props.data;

    let screen = null;
    switch (this.uiElement.inputType) {
      default:
        screen = (
          <Button
            style={this.uiElement.style}
            className={this.uiElement.class}
            color={this.uiElement.color}
            onClick={this.onClick}
          >
            {this.uiElement.label}
          </Button>
        );
    }
    return screen;
  }
}

export default ButtonElem;
