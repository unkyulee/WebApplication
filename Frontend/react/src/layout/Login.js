import React from "react";
import safeEval from "safe-eval";

// interface
import UILayoutWrapper from "../ui/UILayoutWrapper";

// user imports
import EventService from "../services/event.service";
import ConfigService from "../services/config.service";
import AuthService from "../services/auth/auth.service";

export default class Login extends React.Component {
  constructor() {
    super();

    // save as services
    this.auth = AuthService;
    this.event = EventService;
    this.config = ConfigService;

    // state
    this.state = {};

    // get login screen
    this.uiElement = this.config.get("login");
  }

  componentDidMount() {
    // event handler
    this.onEvent = this.event.onEvent.subscribe(event =>
      this.eventHandler(event)
    );
  }

  componentWillUnmount() {
    this.onEvent.unsubscribe();
  }

  eventHandler = async event => {
    if (event.name === "login") {
      if (event.data) this.data = Object.assign(this.data, event.data);
      await this.authenticate();
    }
  };

  // login
  async authenticate() {
    // validate input
    this.data.error = "";
    for (let ui of this.uiElement.screen) {
      if (ui.errorCondition) {
        let error = safeEval(ui.errorCondition, {...this});
        if (error) this.data.error += `${ui.errorMessage}\n`;
      }
    }

    // if there are error don't continue
    if (this.data.error) {
      this.setState(this.data);
      return;
    }

    // try login
    this.event.send("splash-show"); // show splash
    try {
      await this.auth.login(this.data);
      // login success
      this.event.send("authenticated");
    } catch (e) {
      // login error
      this.data.error = e;
      this.setState(this.data);
    }
    this.event.send("splash-hide"); // hide splash
  }

  handleMenuClick = () => {
    this.event.send({ name: "drawer-toggle" });
  };

  render() {
    // retrieve data from props
    this.data = this.props.data;

    let screen;
    if (this.uiElement && this.uiElement.screen) {
      screen = this.uiElement.screen.map((x, i) => {
        return <UILayoutWrapper key={i} uiElement={x} data={this.data} />;
      });
    }

    return (
      <div style={this.uiElement.layoutStyle}>
        <div style={this.uiElement.style} className={this.uiElement.class}>
          {screen}
        </div>
      </div>
    );
  }
}
