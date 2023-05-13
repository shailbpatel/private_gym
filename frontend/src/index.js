import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/index.css';
import './css/App.css';
import './css/Classes.css';
import './css/Dashboard.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios';
 
const root = ReactDOM.createRoot(document.getElementById('root'));
axios.defaults.baseURL = 'http://ec2-52-90-252-145.compute-1.amazonaws.com:8020/';
 
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);