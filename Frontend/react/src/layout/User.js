import React from "react";
import Base from "../ui/Base";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import ButtonGroup from '@material-ui/core/ButtonGroup';
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";

// interface
import UILayoutWrapper from "../ui/UILayoutWrapper";

// user imports
import EventService from "../services/event.service";
import ConfigService from "../services/config.service";
import AuthService from "../services/auth/auth.service";
import UserService from "../services/user/user.service";

export default class User extends Base {
  constructor() {
    super();

    // save as services
    this.auth = AuthService;
    this.event = EventService;
    this.config = ConfigService;

    // state
    this.state = {
      open: false,
      preOpen: false,
      selectedIndex: 1,
      anchorRef: null
    };

    //
    this.options = [
      "Create a merge commit",
      "Squash and merge",
      "Rebase and merge"
    ];
  }

  handleClick = (event) => {
    console.log(event.currentTarget)
    this.setState({ anchorRef: event.currentTarget })
    alert(`You clicked ${this.options[this.state.selectedIndex]}`);
  }

  handleMenuItemClick = (event, index) => {
    this.setState({
      selectedIndex: index,
      open: false
    });
  };

  handleToggle = () => {
    this.setState({
      open: !this.state.open
    });
  };

  handleClose = (event) => {
    if (
      this.anchorRef.current &&
      this.anchorRef.current.contains(event.target)
    ) {
      return;
    }

    this.setState({ open: false });
  };

  render() {

    return (
      <Grid container>
        <Grid item xs={12} align="center">
          <ButtonGroup
            variant="contained"
            color="primary"
            ref={this.state.anchorRef}
            aria-label="Split button"
          >
            <Button onClick={this.handleClick}>{this.options[this.state.selectedIndex]}</Button>
            <Button
              color="primary"
              variant="contained"
              size="small"
              aria-owns={this.state.open ? "menu-list-grow" : undefined}
              aria-haspopup="true"
              onClick={this.handleToggle}
            >
              <ArrowDropDownIcon />
            </Button>
          </ButtonGroup>
          <Popper
            open={this.state.open}
            anchorEl={this.anchorRef}
            transition
            disablePortal
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                style={{
                  transformOrigin:
                    placement === "bottom" ? "center top" : "center bottom"
                }}
              >
                <Paper id="menu-list-grow">
                  <ClickAwayListener onClickAway={this.handleClose}>
                    <MenuList>
                      {this.options.map((option, index) => (
                        <MenuItem
                          key={option}
                          disabled={index === 2}
                          selected={index === this.state.selectedIndex}
                          onClick={event => this.handleMenuItemClick(event, index)}
                        >
                          {option}
                        </MenuItem>
                      ))}
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </Grid>
      </Grid>
    );
  }
}
