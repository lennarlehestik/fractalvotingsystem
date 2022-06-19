import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { UALProvider, withUAL } from 'ual-reactjs-renderer'
import { Anchor } from 'ual-anchor'

const appName = "Fractal Voting";

const chain = {
  chainId: "aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906",
  rpcEndpoints: [
    {
      protocol: "https",
      host: "eos.greymass.com",
      port: "",
    },
  ],
};

const anchor = new Anchor([chain], {
  appName,
});

const supportedChains = [chain];
const supportedAuthenticators = [
  anchor
];

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <UALProvider
      chains={supportedChains}
      authenticators={supportedAuthenticators}
      appName={appName}
    >
      <App />
    </UALProvider>
  </React.StrictMode>
);

reportWebVitals();
