import React from "react";
import ToolbarLayout from "./ToolbarLayout";
import NavigationDrawer from "./NavigationDrawer";

export default class Layout extends React.Component {
  render() {
    return (
      <div>
        <ToolbarLayout />
        <NavigationDrawer />
      </div>
    );
  }
}
