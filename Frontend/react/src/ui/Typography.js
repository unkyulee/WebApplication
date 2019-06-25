import React from "react";

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
        this._value = eval(this.uiElement.default);
      } catch (e) {}
    }

    // if format is specified
    if (this.uiElement.format) {
      try {
        let v = this._value;
        this._value = eval(this.uiElement.format);
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
        eval(this.uiElement.click);
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
        result = eval(this.uiElement.condition);
      } catch (e) {
        result = false;
      }
    }
    return result;
  }

  render() {
    const { uiElement, data } = this.props;

    let screen = null;
    screen = (
      <div
        style={uiElement.style}
        className={uiElement.class}
        dangerouslySetInnerHTML={{ __html: this.value }}
        onClick={this.onClick}
      />
    );

    return screen;
  }
}

export default Typography;
