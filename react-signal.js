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

  const createProxy = (target) => {
    return new Proxy(target, {
      get(target, property) {
        const value = Reflect.get(...arguments);
        if (typeof value === 'object' && value !== null) {
          return createProxy(value); // Recursive olarak Proxy oluştur
        }
        return value;
      },
      set(target, property, value) {
        const oldValue = target[property];
        target[property] = value;
        if (oldValue !== value) {
          emitter.emit('valueChanged', { property, oldValue, newValue: value });
        }
        return Reflect.set(...arguments);
      },
    });
  };

  const proxy = createProxy({ value: initialValue });

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

    get useSignal() {
      const [_, forceUpdate] = useState();

      useEffect(() => {
        emitter.on('valueChanged', ({ newValue }) => {
          forceUpdate(newValue);
        });
      });

      return useMemo(
        () => () => {
          return proxy;
        },
        [_]
      );
    },

    onListen(listener) {
      emitter.on('valueChanged', (data) => {
        listener(data.property, data.oldValue, data.newValue);
      });
    },
  };
};
