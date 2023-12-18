import React from 'react';
import { createRoot } from 'react-dom/client';
import { useHistory,useLocation,BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import './index.css';
import {
    Paper,
    Container,
    Grid,
} from '@mui/material';
import { createBrowserHistory } from 'history';
import * as serviceWorker from './serviceWorker';
import AboutHelpContents from './AboutHelpContents.js';
import AboutNepa from './iframes/AboutNepa.js';
import AboutNepaccess from './iframes/AboutNepaccess.js';
import AboutStats from './AboutStats.js';
import Admin from './AdminPanel.js';
import AdminFiles from './AdminFiles.js';
import App from './App';
import Approve from './Approve.js';
import AvailableDocuments from './iframes/AvailableDocuments.js';
import Contact from './Contact.js';
import DisclaimerTermsOfUse from './iframes/DisclaimerTermsOfUse.js';
import Excel from './Excel.js';
import ForgotPassword from './User/ForgotPassword.js';
import Future from './iframes/Future.js';
import Iframes from './iframes/Iframes.js';
import Importer from './Importer.js';
import ImporterGeo from './ImporterGeo.js';
import ImporterGeoLinks from './ImporterGeoLinks.js';
import InteractionLogs from './InteractionLogs.js';
import Landing from './Landing.js';
import Login from './User/Login.js';
import Logout from './User/Logout.js';
import Main from './Main.js';
import Media from './iframes/Media.js';
import Pairs from './Pairs.js';
import Pairs2 from './Pairs2';
import Pairs3 from './Pairs3';
import People from './iframes/People.js';
import PreRegister from './User/PreRegister.js';
import PrivacyPolicy from './iframes/PrivacyPolicy.js';
import ProcessDetailsTab from './Details/ProcessDetailsTab.js';
import RecordDetailsTab from './Details/RecordDetailsTab.js';
import Register from './User/Register.js';
import Reset from './User/Reset.js';
import SearchLogs from './SearchLogs.js';
import SearchTest from './AppTest';
import SearchTips from './iframes/SearchTips.js';
import StatCounts from './StatCounts.js';
import Surveys from './Surveys.js';
import Test from './Test.js';
import UserDetails from './User/Profile.js';
import Verify from './User/Verify.js';
import ImporterAlignment from './ImporterAlignment.js';
const container = document.getElementById('app');
const root = createRoot(document.getElementById('root'));
const history = createBrowserHistory();
console.log(`file: index.js:18 ~ location:`, location);
//const history = createBrowserHistory();
console.log(`file: index.js:20 ~ history:`, history);
  
  history.listen(({ action, location }) => {
    console.log(
      `The current URL is ${location.pathname}${location.search}${location.hash}`
    );
    console.log(`The last navigation action was ${action}`);
  });
  

root.render(
  <BrowserRouter>
    <Main/>
  </BrowserRouter>
)  
  // Listen for changes to the current location.
let unlisten = history.listen(({ location, action }) => {
    console.log(action, location.pathname, location.state);
  });

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
