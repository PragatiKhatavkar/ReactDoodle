// Import necessary dependencies
import React from 'react';
import ReactDOM from 'react-dom/client'; // This is the modern way of rendering the app (React 18+)
import App from './App'; // Import your root App component
import './app.css'

import { Provider } from 'react-redux';
import store from './redux/app/store'
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the App component into the root element
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
