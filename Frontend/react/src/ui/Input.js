import React from "react";
import TextField from "@material-ui/core/TextField";
import safeEval from "safe-eval";

// user services
import AuthService from "../services/auth/auth.service";
import eventService from "../services/event.service";

class Input extends React.Component {
  constructor() {
    super();

    // save as a services
    this.auth = AuthService;
    this.event = eventService;
  }

  get value() {
    // deafult input value can't be null
    // must be an empty string
    let v;

    if (this.data && this.uiElement.key) {
      // if null then assign default
      if (typeof this.data[this.uiElement.key] === "undefined") {
        let def = this.uiElement.default;
        try {
          def = safeEval(this.uiElement.default, { ...this });
        } catch (e) {}
        this.data[this.uiElement.key] = def;
      }

      // set value
      v = this.data[this.uiElement.key];
    }

    // Transform
    if (this.uiElement.transform) {
      try {
        v = safeEval(this.uiElement.transform, { ...this });
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
    if (this._value !== v) {
      this._value = v;

      // send data-update to the root element
      this.event.send({
        name: "data-update",
        data: { [this.uiElement.key]: v }
      });

      if (this.data && this.uiElement.key) {
        this.data[this.uiElement.key] = v;
        // if number
        if (v && this.uiElement.inputType === "number")
          this.data[this.uiElement.key] = parseFloat(v);
      }
    }
  }

  onClick = () => {
    if (this.uiElement.click) {
      try {
        safeEval(this.uiElement.click, { ...this });
      } catch (e) {
        console.error(e);
      }
    }
  };

  condition = () => {
    let result = true;
    if (this.uiElement.condition) {
      try {
        result = safeEval(this.uiElement.condition, { ...this });
      } catch (e) {
        result = false;
      }
    }
    return result;
  };

  handleChange = name => event => {
    // see if there are any input change handlers
    if (this.uiElement.changed) {
      try {
        safeEval(this.uiElement.changed, { ...this });
      } catch (ex) {
        console.error(ex);
      }
    }

    // set value
    this.value = event.target.value;
  };

  render() {
    this.uiElement = this.props.uiElement;
    this.data = this.props.data;

    let screen = null;
    if (this.condition()) {
      switch (this.uiElement.inputType) {

        case "hidden":
          screen = <input type="hidden" value={this.value || ""} />;
        default:
          screen = (
            <div style={this.uiElement.style} className={this.uiElement.class}>
              <TextField
                type={this.uiElement.inputType}
                label={this.uiElement.label}
                onChange={this.handleChange(this.uiElement.key)}
                value={this.value || ""}
                InputLabelProps={this.uiElement.props}
              />
            </div>
          );
      }
      return screen;
    }
  }
}

export default Input;
