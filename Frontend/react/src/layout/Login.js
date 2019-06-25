import React from "react";

// interface
import UILayoutWrapper from "../ui/UILayoutWrapper";

// user imports
import EventService from "../services/event.service";
import ConfigService from "../services/config.service";

export default class Login extends React.Component {
  constructor() {
    super();

    // state
    this.state = {};

    // save as services
    this.event = EventService;
    this.config = ConfigService;
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
    if (event.name == "login") {
      if (event.data) this.data = Object.assign(this.data, event.data);
      await this.authenticate();
    }
  };

  // login
  async authenticate() {
    // extract from props
    const { uiElement } = this.props;
    this.uiElement = uiElement;
    this.data = this.state;

    // validate input
    this.data.error = "";
    for (let ui of this.login.screen) {
      let value = this.data[ui.key]; // used by the evaluation script
      if (ui.errorCondition) {
        let error = eval(ui.errorCondition);
        if (error) this.data.error += `${ui.errorMessage}\n`;
      }
    }

    // if there are error don't continue
    if (this.data.error) {
      this.setState(this.data)
      return;
    }

    // try login
    this.event.send("splash-show"); // show splash
    try {
      await this.auth.login(this.data);
      console.log(this.data)
      // login success
      this.event.send("authenticated");
    } catch (e) {
      // login error
      this.data.error = e;
    }
    this.event.send("splash-hide"); // hide splash
  }

  handleMenuClick = () => {
    this.event.send({ name: "drawer-toggle" });
  };

  render() {
    this.login = this.config.get("login");
    let screen;
    if (this.login && this.login.screen) {
      screen = this.login.screen.map((x, i) => {
        return <UILayoutWrapper key={i} uiElement={x} data={this.data} />;
      });
    }

    return (
      <div style={this.login.layoutStyle}>
        <div style={this.login.style} className={this.login.class}>
          {screen}
        </div>
      </div>
    );
  }
}
