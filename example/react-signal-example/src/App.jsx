import {useCallback, useState} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import signal from "../../../src/react-signal.js";

const count = signal(0);

count.onListen((value, prev, next) => {
    console.log('count:', {prev, next});
});

function App() {
    const item = count.useValue()
    const onUp = useCallback(() => {
        item.value++;
        
    }, []);
    
    const onDown = useCallback(() => {
        item.value--;
        
    }, []);
    
    return (
        <>
            <div>
                <a href="https://vitejs.dev" target="_blank">
                    <img src={viteLogo} className="logo" alt="Vite logo"/>
                </a>
                <a href="https://react.dev" target="_blank">
                    <img src={reactLogo} className="logo react" alt="React logo"/>
                </a>
            </div>
            <h1>Vite + React + React Signal</h1>
            <div className="card">
                <button onClick={onUp}>
                    up is {item.value}
                </button>
                {' '}
                <button onClick={onDown}>
                    down is {item.value}
                </button>
                <p>
                    Edit <code>src/App.jsx</code> and save to test HMR
                </p>
            </div>
            <p className="read-the-docs">
                Click on the Vite and React logos to learn more
            </p>
        </>
    )
}

export default App
