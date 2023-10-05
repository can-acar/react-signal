export class SignalSaga {
    constructor() {
      this.emitter = new EventEmitter();
    }
  
    take(actionType) {
      return new Promise((resolve) => {
        const listener = (action) => {
          if (action.type === actionType) {
            this.emitter.off(actionType, listener);
            resolve(action);
          }
        };
        this.emitter.on(actionType, listener);
      });
    }
  
    put(action) {
      this.emitter.emit(action.type, action);
    }
  
    all(effects) {
      const promises = Object.values(effects).map((effect) =>
        effect instanceof Promise ? effect : Promise.resolve(effect)
      );
      return Promise.all(promises);
    }
  
    race(effects) {
      return new Promise((resolve) => {
        for (const key in effects) {
          if (effects.hasOwnProperty(key)) {
            const effect = effects[key];
            if (effect instanceof Promise) {
              effect.then((result) => {
                resolve({ [key]: result });
              });
            } else {
              resolve({ [key]: effect });
            }
          }
        }
      });
    }
  
    run(generatorFunction) {
      const iterator = generatorFunction();
      const next = (value) => {
        const result = iterator.next(value);
        if (!result.done) {
          if (result.value instanceof Promise) {
            result.value.then((resolvedValue) => {
              next(resolvedValue);
            });
          } else {
            next(result.value);
          }
        }
      };
      next();
    }
  }
  
  export default SignalSaga;
  