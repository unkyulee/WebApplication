import React from "react";

// user imports
import EventService from "../services/event.service";

export default class Login extends React.Component {
  constructor() {
    super();

    // save as services
    this.event = EventService;
  }

  handleMenuClick = () => {
    this.event.send({ name: "drawer-toggle" });
  };

  render() {
    return (
      <div>
          Login Screen
      </div>
    );
  }
}
