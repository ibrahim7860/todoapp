import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
let color = '#' +  Math.random().toString(16).substr(-6);

root.render(
  <React.StrictMode>
    <App backgroundColor={color}/>
  </React.StrictMode>
);
