import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
// import reportWebVitals from './reportWebVitals';
import './index.css';
import theme from './styles/theme.js';
import Main from './Main.js';
import { ThemeProvider } from'@mui/styles';

import * as serviceWorker from './serviceWorker';


ReactDOM.render(
    <ThemeProvider theme={theme}>
    <BrowserRouter>
        <Main />
    </BrowserRouter>
    </ThemeProvider>
    , document.getElementById('root')
);


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
