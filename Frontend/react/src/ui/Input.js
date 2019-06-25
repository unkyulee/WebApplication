import React from "react";
import TextField from "@material-ui/core/TextField";
import { Subject } from "rxjs";

// user services
import AuthService from "../services/auth/auth.service";


class Input extends React.Component {
  constructor() {
    super();
    // save as a services
    this.auth = AuthService;

    // variables
    this.typeAheadEventEmitter = new Subject();
  }

  get value() {
    // extract from props
    const { uiElement, data } = this.props;
    this.uiElement = uiElement;
    this.data = data;

    let v = '';

    // do not set value if it is password
    if (this.uiElement.inputType === "password")
      return '';

    if (this.data && this.uiElement.key) {
      // if null then assign default
      if (typeof this.data[this.uiElement.key] === "undefined") {
        let def = this.uiElement.default;
        try {
          def = eval(this.uiElement.default);
        } catch (e) {}
        this.data[this.uiElement.key] = def;
      }

      // set value
      v = this.data[this.uiElement.key];
    }

    // Transform
    if (this.uiElement.transform) {
      try {
        v = eval(this.uiElement.transform);
      } catch (e) {}
    }

    // if number
    if (v && this.uiElement.inputType === "number") v = parseFloat(v);

    // if the value is programmatically updated without set property called
    // then set it explicitly
    if (this._value !== v) {
      this._value = v;
      this.value = v;
    }

    return v;
  }

  set value(v) {
    // extract from props
    const { uiElement, data } = this.props;
    this.uiElement = uiElement;
    this.data = data;

    if (this._value !== v) {
      this._value = v;

      if (this.data && this.uiElement.key) {
        this.data[this.uiElement.key] = v;
        // if number
        if (v && this.uiElement.inputType === "number")
          this.data[this.uiElement.key] = parseFloat(v);
      }
    }

    this.typeAheadEventEmitter.next(v);
  }

  onClick = () => {
    // extract from props
    const { uiElement, data } = this.props;
    this.uiElement = uiElement;
    this.data = data;

    if (this.uiElement.click) {
      try {
        eval(this.uiElement.click);
      } catch (e) {
        console.error(e);
      }
    }
  };

  condition = () => {
    // extract from props
    const { uiElement, data } = this.props;
    this.uiElement = uiElement;
    this.data = data;

    let result = true;
    if (this.uiElement.condition) {
      try {
        result = eval(this.uiElement.condition);
      } catch (e) {
        result = false;
      }
    }
    return result;
  };

  handleChange = v => {
    console.log(v);
  };

  render() {
    const { uiElement, data } = this.props;

    let screen = null;
    switch (uiElement.inputType) {
      default:
        screen = (
          <div style={uiElement.style} className={uiElement.class}>
            <TextField label={uiElement.label} value={this.value} />
          </div>
        );
    }
    return screen;
  }
}

export default Input;
