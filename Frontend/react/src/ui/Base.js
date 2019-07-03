import React from "react";
import safeEval from "safe-eval";

class Base extends React.Component {
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

  // format to date on the column
  format(v, transform, row) {
    // transform
    if (transform) {
      try {
        v = safeEval(transform, { ...this });
      } catch (e) {
        console.error(e);
      }
    }
    return v;
  }
}

export default Base;
