import React from "react";

// user imports layout
import ToolbarLayout from "./ToolbarLayout";
import NavigationDrawer from "./NavigationDrawer";
import Login from "./Login";

// user imports services
import AuthService from "../services/auth/auth.service";
import eventService from "../services/event.service";

export default class Layout extends React.Component {
  constructor() {
    super();
    // save as a services
    this.auth = AuthService;
    this.event = eventService;

    // state
    this.state = {
      isAuthenticated: false,
      isLoading: true, // while checking for authentication status
      data: {}
    };
  }
  componentDidMount() {
    // check for authentication status
    this.auth.isAuthenticated().then(r => {
      this.setState({ isAuthenticated: r, isLoading: false });
    });
    // event handler
    this.onEvent = this.event.onEvent.subscribe(event =>
      this.eventHandler(event)
    );
  }
  componentWillUnmount() {
    this.onEvent.unsubscribe();
  }

  eventHandler = async event => {
    if (event === "authenticated") {
      this.setState({ isAuthenticated: true });
    } else if (event && event.name === "data-update") {
      this.setState({ data: {...this.state.data, ...event.data} });
    }
  };

  render() {
    let screen = <p>Loading ...</p>;
    if (!this.state.isLoading) {
      if (this.state.isAuthenticated) {
        screen = (
          <div>
            <ToolbarLayout />
            <NavigationDrawer />
          </div>
        );
      } else {
        screen = <Login data={this.state.data} />;
      }
    }

    return screen;
  }
}
