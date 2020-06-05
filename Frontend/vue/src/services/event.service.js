const obj = require('object-path');

export default {
	_event: {},
	// subscribe to an event that corresponds to the name
	subscribe: function(subscriber, event, callback) {
		obj.ensureExists(this._event, event, {})
		this._event[event][subscriber] = callback;
	},
	unsubscribe: function(subscriber, event) {
		// remove subscriber from the event
		if(this._event[event] && this._event[event][subscriber]) {
			delete this._event[event][subscriber]
		}
	},
	unsubscribe_all: function(subscriber) {
		for (let event of Object.keys(this._event)) {
			// remove subscriber from all events
			this.unsubscribe(subscriber, event);
		}
	},
	send: function(event) {
		let subscribers = obj.get(this._event, event.name, {});
		for (let sub of Object.keys(subscribers)) {
			if (subscribers[sub]) {
				setTimeout(() => {
					try {
						subscribers[sub](event)
					} catch(ex) {
						//console.error(subscribers[sub])
						//console.error(ex)
					}
				});
			}
		}
	},
};
