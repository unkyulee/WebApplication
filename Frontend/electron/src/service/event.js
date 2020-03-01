const obj = require("object-path");
_event = {};

module.exports = {
  status: function() {
    return _event;
  },
  // subscribe to an event that corresponds to the name
  subscribe: function(subscriber, event, callback) {
    obj.set(_event, `${event}.${subscriber}`, callback);
  },
  unsubscribe: function(subscriber, event) {
    // remove subscriber from the event
    if (obj.has(_event, `${event}.${subscriber}`))
      obj.del(_event, `${event}.${subscriber}`);
  },
  unsubscribe_all: function(subscriber) {
    for (let event of Object.keys(_event)) {
      // remove subscriber from all events
      this.unsubscribe(subscriber, event)
    }
  },
  send: function(event, data) {
    let subscribers = obj.get(_event, event, {});
    for (let sub of Object.keys(subscribers)) {
      if (subscribers[sub]) {
        setTimeout(() => subscribers[sub](data));
      }
    }
  }
};
