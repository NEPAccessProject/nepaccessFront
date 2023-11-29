import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import { createRoot } from 'react-dom/client';
import './index.css';

import { ThemeProvider } from '@material-ui/core';
import Main from './Main.js';
import * as serviceWorker from './serviceWorker';
import theme from './styles/theme';
console.log("🚀 ~ file: index.js:11 ~ theme:", theme)
const container = document.getElementById('app');

// const root = createRoot(document.getElementById('root'));

// root.render(
//   <BrowserRouter>
//     <ThemeProvider theme={theme}>
//       <Main />
//     </ThemeProvider>
//   </BrowserRouter>
//   , document.getElementById('root')
// );




ReactDOM.render(
    <BrowserRouter>
        <Main />
    </BrowserRouter>
    , document.getElementById('root')
);


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
