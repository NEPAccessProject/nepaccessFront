import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import './index.css';
import theme from './styles/theme';
import Main from './Main.js';

import * as serviceWorker from './serviceWorker';
import { ThemeProvider } from '@material-ui/core';
import * as Sentry from '@sentry/browser';
Sentry.init({
    dsn: "https://de8e659cc5086223380e30e385e62907@o4505920810778624.ingest.sentry.io/4505920813400064",
    integrations: [
      new Sentry.BrowserTracing({
        // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
        tracePropagationTargets: ["localhost", "https://nepaccess.gov\/*"],}),
      new Sentry.Replay(),
    ],
    // Performance Monitoring
    tracesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!
    // Session Replay
    replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
  });
  

ReactDOM.render(
    <BrowserRouter>
        <ThemeProvider theme={theme}>
        <Main />
        </ThemeProvider>
    </BrowserRouter>
    , document.getElementById('root')
);


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
