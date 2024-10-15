import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { WebAppProvider } from '@twa-dev/sdk/react';

ReactDOM.render(
  <React.StrictMode>
    <WebAppProvider>
      <App />
    </WebAppProvider>
  </React.StrictMode>,
  document.getElementById('root')
);