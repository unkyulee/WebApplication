import React from "react";

// interface
import UILayoutWrapper from "../ui/UILayoutWrapper";

// user imports
import EventService from "../services/event.service";
import ConfigService from "../services/config.service";

export default class Login extends React.Component {
  constructor() {
    super();

    // save as services
    this.event = EventService;
    this.config = ConfigService;
  }

  handleMenuClick = () => {
    this.event.send({ name: "drawer-toggle" });
  };

  render() {
    let login = this.config.get("login");
    let screen;
    if (login && login.screen) {
      screen = login.screen.map((x, i) => {
        return <div key={i}>{UILayoutWrapper.generate(x, this.data)}</div>;
      });
    }

    return (
      <div style={login.layoutStyle}>
        <div style={login.style} className={login.class}>
          {screen}
        </div>
      </div>
    );
  }
}
