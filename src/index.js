import React from 'react';
import ReactDOM from 'react-dom/client';
import './frontend/styles/index.css';
import App from './frontend/App';
import reportWebVitals from './frontend/reportWebVitals';
import {BrowserRouter} from 'react-router-dom';
import { UserProvider } from "./frontend/UserContext";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <UserProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </UserProvider >
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
