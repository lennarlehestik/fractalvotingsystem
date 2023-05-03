import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Admin from './Admin';
import reportWebVitals from './reportWebVitals';
import { UALProvider, withUAL } from 'ual-reactjs-renderer'
import { Anchor } from 'ual-anchor'
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

const appName = "Fractal Voting";

const chain = {
  chainId: "aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906",
  rpcEndpoints: [
    {
      //protocol: "https",
      //host: "eos.greymass.com",
      //http://eos.api.eosnation.io
      protocol: "https",
      host: "eos.api.eosnation.io",
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
    <BrowserRouter>
        <UALProvider
          chains={supportedChains}
          authenticators={supportedAuthenticators}
          appName={appName}
        >
          <Routes>
            <Route path="/" element={<App />}/>
            <Route path="/admin" element={<Admin />}/>
          </Routes>
        </UALProvider>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
