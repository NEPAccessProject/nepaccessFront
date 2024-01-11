import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route,Routes,HashRouter,useHistory,useLocation } from 'react-router-dom';

import './index.css';
import { createBrowserHistory } from 'history';
import * as serviceWorker from './serviceWorker';

import Main from './Main.js';
const container = document.getElementById('root');
console.log(`file: index.js:20 ~ container:`, container);
const root = createRoot(container);
console.log(`file: index.js:20 ~ root:`, root);
const history = createBrowserHistory();
console.log(`file: index.js:20 ~ history:`, history);

  history.listen(({ action, location }) => {
    console.log(
      `The current URL is ${location.pathname}${location.search}${location.hash}`
    );
    console.log(`The last navigation action was ${action}`);
  });

root.render(
    <BrowserRouter>
        <Main history={history} />
    </BrowserRouter>
);


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
