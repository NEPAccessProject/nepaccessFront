import React from 'react';
import Main from './Main';
import { createRoot } from 'react-dom/client';
import { useHistory,useLocation,BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
const container = document.getElementById('app');
import { createBrowserHistory } from 'history';
const root = createRoot(document.getElementById('root'));
const history = createBrowserHistory();
import * as serviceWorker from './serviceWorker';
let location = window.location;
console.log(`file: index.js:18 ~ location:`, location);
//const history = createBrowserHistory();
console.log(`file: index.js:20 ~ history:`, history);
  
  history.listen(({ action, location }) => {
    console.log(`history.listen ~ location:`, location);
    console.log(
      `The current URL is ${location.pathname}${location.search}${location.hash}`
    );
    console.log(`The last navigation action was ${action}`);
  });
  

root.render(
  <BrowserRouter>
    <Main location={location} history={history}/>
  </BrowserRouter>
)  
  // Listen for changes to the current location.
let unlisten = history.listen(({ location, action }) => {
    console.log(action, location.pathname, location.state);
  });

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
//serviceWorker.unregister();
