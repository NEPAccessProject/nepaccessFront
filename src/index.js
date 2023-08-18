import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import './index.css';

import { MuiThemeProvider } from '@material-ui/core';
import Main from './Main.js';
import * as serviceWorker from './serviceWorker';
import theme from './styles/theme';
console.log("🚀 ~ file: index.js:11 ~ theme:", theme)

ReactDOM.render(
    <BrowserRouter>
    <MuiThemeProvider theme={theme}>
        
            <Main />
    </MuiThemeProvider>
    </BrowserRouter>
    , document.getElementById('root')
);


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
