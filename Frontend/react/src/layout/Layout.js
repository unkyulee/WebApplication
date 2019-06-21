import React from "react";

// user imports layout
import ToolbarLayout from "./ToolbarLayout";
import NavigationDrawer from "./NavigationDrawer";
import Login from "./Login";

// user imports services
import AuthService from "../services/auth/auth.service";

export default class Layout extends React.Component {
  constructor() {
    super();
    // save as a services
    this.auth = AuthService;

    // state
    this.state = {
      isAuthenticated: false,
      isLoading: true // while checking for authentication status
    };
  }
  componentDidMount() {
    // check for authentication status
    this.auth.isAuthenticated().then(r => {
      console.log(r);
      this.setState({ isAuthenticated: r, isLoading: false });
    });
  }
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
        screen = <Login />;
      }
    }

    return screen;
  }
}
