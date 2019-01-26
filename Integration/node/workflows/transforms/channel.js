const fs = require('fs');
const pdf = require('pdf-parse');

class Channel_Transform {
  constructor(context, property) {
    this.context = context
    this.property = property
  }

  // initialized
  async init() {
    // listen to events from inputs
    for (let input of this.property.inputs) {
      this.context.event.on(input, input, async (count, data) => { await this.incoming(count, data) });
    }
  }

  async finish() {
    // remove handler
    for (let input of this.property.inputs) {
      this.context.event.remove(input)
    }
  }

  async incoming(count, data) {
    // transform
    if(this.property.transform) {      
      await eval(this.property.transform)
    }
      

    // forward the events to the outputs
    for (let output of this.property.outputs)
      await this.context.event.emit(output, count, data)
  }

  async start() {
    // nothing to do at start
  }

}

module.exports = Channel_Transform