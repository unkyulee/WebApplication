import React from "react";
import safeEval from "safe-eval";

class Typography extends React.Component {
  get value() {
    // extract from props
    const { uiElement, data } = this.props;
    this.uiElement = uiElement;
    this.data = data;

    // fixed text
    if (this.uiElement.text) {
      // set value
      this._value = this.uiElement.text;
    }

    // key exists
    else if (this.data && this.uiElement.key) {
      // set value
      this._value = this.data[this.uiElement.key];
    }

    // if null then assign default
    if (
      (typeof this._value === "undefined" || this._value === null) &&
      this.uiElement.default
    ) {
      this._value = this.uiElement.default;
      try {
        this._value = safeEval(this.uiElement.default, {...this});
      } catch (e) {}
    }

    // if format is specified
    if (this.uiElement.format) {
      try {
        this._value = safeEval(this.uiElement.format, {...this});
      } catch (e) {
        console.error(this.uiElement.format, e);
      }
    }

    return this._value;
  }

  onClick = () => {
    // extract from props
    const { uiElement, data } = this.props;
    this.uiElement = uiElement;
    this.data = data;

    if (this.uiElement.click) {
      try {
        safeEval(this.uiElement.click, {...this});
      } catch (e) {
        console.error(e);
      }
    }
  }

  condition = () => {
    // extract from props
    const { uiElement, data } = this.props;
    this.uiElement = uiElement;
    this.data = data;

    let result = true;
    if (this.uiElement.condition) {
      try {
        result = safeEval(this.uiElement.condition, {...this});
      } catch (e) {
        result = false;
      }
    }
    return result;
  }

  render() {
    this.uiElement = this.props.uiElement;
    this.data = this.props.data

    let screen = null;
    screen = (
      <div
        style={this.uiElement.style}
        className={this.uiElement.class}
        dangerouslySetInnerHTML={{ __html: this.value }}
        onClick={this.onClick}
      />
    );

    return screen;
  }
}

export default Typography;
