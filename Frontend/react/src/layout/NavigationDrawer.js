import React from "react";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import Icon from "@material-ui/core/Icon";
import IconButton from "@material-ui/core/IconButton";
import Base from "../ui/Base";

// user service
import EventService from "../services/event.service";
import NavService from "../services/nav.service";
import configService from "../services/config.service";

// user component
import UILayoutWrapper from "../ui/UILayoutWrapper";
import User from "./User"

export default class NavigationDrawer extends Base {
  constructor() {
    super();

    // save as services
    this.event = EventService;
    this.nav = NavService;
    this.config = configService;

    this.state = {
      open: false,
      currUrl: null
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
    } else if (event && event.name === "navigation-changed") {
    }
  }

  onClose = () => {
    this.setState({ open: false });
  };

  onOpen = () => {
    this.setState({ open: true });
  };

  onClickClose = () => {
    this.event.send({ name: "drawer-toggle" });
  };

  render() {
    // header
    let headerScreen;
    let headerConfig = this.config.get("navigation.header.screen");
    if (headerConfig) {
      headerScreen = headerConfig.map((x, i) => {
        return <UILayoutWrapper key={i} uiElement={x} data={this.data} />;
      });
    }

    // menu items
    let menuScreen;
    let menuConfig = this.nav.navigation;
    if (menuConfig) {
      menuScreen = menuConfig.map((x, i) => {
      });
    }

    return (
      <SwipeableDrawer
        open={this.state.open}
        onClose={this.onClose}
        onOpen={this.onOpen}
      >
        <div style={this.config.get("navigation.style")}>
          <IconButton
            onClick={this.onClickClose}
            style={Object.assign(
              {},
              this.config.get("navigation.close.style"),
              {
                position: "absolute",
                right: 0
              }
            )}
          >
            <Icon>close</Icon>
          </IconButton>

          <div style={this.config.get("navigation.header.style")}>
            {headerScreen}
          </div>

          <User></User>

          {menuScreen}
        </div>
      </SwipeableDrawer>
    );
  }
}
