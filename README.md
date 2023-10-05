# react-signal




# React Signal Example

Bu örnek, React kullanarak sinyal (signal) kullanımını göstermektedir. Signal, React uygulamalarında durum yönetimini kolaylaştırmak için kullanılabilir.

## Kod Örneği

Aşağıda, sinyal kullanarak oluşturulmuş basit bir React uygulama kod örneği bulunmaktadır.

```javascript
import React, { useCallback, useEffect } from 'react';
import { signal } from 'react-signal';

const data = signal({
  key: 'key_1',
  value: 'value_1',
});

const count = signal(0);

const authentication = signal({
  isLogin: false,
});

const text = signal('');

count.onListen((value, prev, next) => {
  console.log('count:', value, prev, next);
});

text.onListen((value, prev, next) => {
  console.log('text:', value, prev, next);
});

export default function App() {
  const _count = count.useValue();
  const _text =  text.useValue();
  cont  _authentication  = authentication.useValue();

  const onUp = useCallback(() => {
    count.value += 1;
    authentication.value.isLogin = !authentication.value.isLogin;
    data.value.key = `key_${count.value}`;
  }, []);

  const onDown = useCallback(() => {
    count.value -= 1;
    data.value.key = `key_${count.value}`;
  }, [count]);

  const onType = useCallback(
    (e) => {
      text.value = e.target.value;
    },
    [text]
  );



  return (
    <div>
      <button onClick={onUp}>+ {count.value} </button>
      <p />
      <button onClick={onDown}>- {count.value}</button>
      <p />
      <input type="text" onChange={onType} />

      <pre>{JSON.stringify(count)}</pre>
      <pre>{count.value}</pre>
      <pre>{JSON.stringify(data)}</pre>
      <pre>{JSON.stringify(authentication)}</pre>
      <pre>{JSON.stringify(text)}</pre>
      <span>{text.value}</span>
    </div>
  );
}
```






Test and Run https://stackblitz.com/edit/react-signal?file=src%2FApp.js
