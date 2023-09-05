class EventEmitter {
  constructor() {
    this.events = new Map();
  }

  on(eventName, listener) {
    if (!this.events.has(eventName)) {
      this.events.set(eventName, []);
    }
    this.events.get(eventName).push(listener);
    return () => this.off(eventName, listener); // Olay dinleyicisi kaldırma işlevini döndür
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
      this.off(eventName, onceListener); // Bir kez tetiklendikten sonra olay dinleyicisini kaldır
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

const signal = (initialValue) => {
  const emitter = new EventEmitter();
  const store = { value: initialValue };

  const proxy = new Proxy(store, {
    get(target, property) {
      const value = Reflect.get(target, property);
      return value;
    },
    set(target, property, value) {
      const oldValue = Reflect.get(target, property);
      emitter.emit('valueChanged', { property, oldValue, newValue: value });
      return Reflect.set(...arguments);
    },
  });

  return {
    get value() {
      return proxy.value;
    },

    set value(newValue) {
      proxy.value = newValue;
    },

    get notify() {
      return function (handler) {
        emitter.on('valueChanged', ({ newValue }) => {
          handler(newValue);
        });
      };
    },

    get useValue() {
      const [_, forceUpdate] = useState();

      useEffect(() => {
        emitter.on('valueChanged', ({ newValue }) => {
          forceUpdate(newValue);
        });
      });
    },

    onListen(listener) {
      emitter.on('valueChanged', (data) => {
        listener(data.property, data.oldValue, data.newValue);
      });
    },
  };
};

return signal;
