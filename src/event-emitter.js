class EventEmitter {
    constructor() {
        this.events = new Map();
    }
    
    on(eventName, listener) {
        if (!this.events.has(eventName)) {
            this.events.set(eventName, []);
        }
        this.events.get(eventName).push(listener);
        return () => this.off(eventName, listener);
    }
    
    off(eventName, listener) {
        if (this.events.has(eventName)) {
            const listeners = this.events.get(eventName);
            const index = listeners.indexOf(listener);
            if (index !== -1) {
                listeners.splice(index, 1);
            }
            if (listeners.length === 0) {
                this.events.delete(eventName);
            }
        }
    }
    
    once(eventName, listener) {
        const onceListener = (...args) => {
            listener(...args);
            this.off(eventName, onceListener);
        };
        this.on(eventName, onceListener);
    }
    
    emit(eventName, ...args) {
        const eventListeners = this.events.get(eventName);
        if (eventListeners) {
            eventListeners.forEach((listener) => listener(...args));
        }
    }
}

export default EventEmitter;
  