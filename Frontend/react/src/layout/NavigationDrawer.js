import React from "react";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";

import EventService from "../services/event.service";
import NavService from "../services/nav.service";

export default class NavigationDrawer extends React.Component {
  constructor() {
    super();

    // save as services
    this.event = EventService;
    this.nav = NavService;

    this.state = {
      open: false
    };
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

  onEvent = null;
  eventHandler(event) {
    if (event && event.name === "drawer-toggle") {
      this.setState({
        open: !this.state.open
      });
    }
  }

  handleOnClose = () => {
    this.setState({ open: false });
  };

  handlerOnOpen = () => {
    this.setState({ open: true });
  };

  render() {
    return (
      <SwipeableDrawer
        open={this.state.open}
        onClose={this.handleOnClose}
        onOpen={this.handlerOnOpen}
      >
        <p>Hi asdfasdfasdfasdfasdfasdf</p>
      </SwipeableDrawer>
    );
  }
}
