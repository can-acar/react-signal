import { useEffect, useMemo, useState } from 'react';
import EventEmitter from './event-emitter';

class CreateSignal {
  constructor(initialValue) {
    this.emitter = new EventEmitter();
    this.proxy = this.createProxy({ value: initialValue });
  }

  createProxy = (target) => {
    const signal = this;
    return new Proxy(target, {
      get(target, property) {
        const value = Reflect.get(...arguments);
        if (typeof value === 'object' && value !== null) {
          return signal.createProxy(value);
        }
        return value;
      },

      set(target, property, value) {
        const oldValue = target[property];
        target[property] = value;
        if (oldValue !== value) {
          signal.emitter.emit('valueChanged', {
            property,
            oldValue,
            newValue: value,
          });
        }
        return Reflect.set(...arguments);
      },
    });
  };

  get value() {
    return this.proxy.value;
  }

  set value(newValue) {
    this.proxy.value = newValue;
  }
  /* this is magic */
  get useSignal() {
    const signal = this;
    const [_, forceUpdate] = useState();

    useEffect(() => {
      signal.emitter.on('valueChanged', ({ newValue }) => {
        forceUpdate(newValue);
      });
    });

    return useMemo(
      () => () => {
        return proxy;
      },
      [_]
    );
  }

  onListen(listener) {
    const signal = this;
    signal.emitter.on('valueChanged', (data) => {
      listener(data.property, data.oldValue, data.newValue);
    });
  }

  subscribe(listener) {
    return this.emitter.on('valueChanged', listener);
  }

  unsubscribe(listener) {
    this.emitter.off('valueChanged', listener);
  }

  update(fn) {
    const newValue = fn(this.value);
    this.setValue(newValue);
  }

  setValue(newValue) {
    if (this.value !== newValue) {
      const oldValue = this.value;
      this.value = newValue;
      this.emitter.emit('valueChanged', { oldValue, newValue });
    }
  }
}

const signal = (initialValue) => new CreateSignal(initialValue);

export default signal;
