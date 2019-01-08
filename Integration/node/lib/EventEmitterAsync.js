class EventEmitterAsync {
    constructor() {
        this.listeners = {}
    }

    on(listener_id, event_id, handler) {
        if (!this.listeners[event_id]) this.listeners[event_id] = {}
        this.listeners[event_id][listener_id] = handler
    }

    remove(listener_id) {
        for (let event_id of Object.keys(this.listeners))
            if (this.listeners[event_id])
                if (this.listeners[event_id][listener_id])
                    delete this.listeners[event_id][listener_id]
    }

    clear() {
        this.listeners = {}
    }

    async emit(event_id, data, extra) {
        // send to all listener
        let listeners = this.listeners[event_id]
        if (listeners) {
            for (let listener_id of Object.keys(listeners)) {
                await listeners[listener_id](data, extra)
            }
        }
    }
}

module.exports = EventEmitterAsync