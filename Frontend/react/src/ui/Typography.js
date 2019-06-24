import React from "react";

class Typography extends React.Component {
  generate(ui, data) {
    let screen = null;
    screen = (
      <div style={ui.style} className={ui.class} />
    );

    return screen;
  }
}

export default new Typography();
