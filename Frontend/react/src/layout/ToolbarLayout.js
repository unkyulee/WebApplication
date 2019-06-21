import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Icon from "@material-ui/core/Icon";
import IconButton from "@material-ui/core/IconButton";

// user imports
import EventService from "../services/event.service";

class ToolbarLayout extends React.Component {
  constructor() {
    super();
    this.event = EventService;
  }

  handleMenuClick = () => {
    this.event.send({ name: "drawer-toggle" });
  };

  render() {
    return (
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={this.handleMenuClick}
          >
            <Icon>menu</Icon>
          </IconButton>
          <Typography variant="h6">Toolbar</Typography>
        </Toolbar>
      </AppBar>
    );
  }
}

export default ToolbarLayout;
