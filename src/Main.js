import React from 'react';
import { Helmet } from 'react-helmet';
import axios from 'axios';

import './index.css';

import Landing from './Landing.js';
import App from './App';

import ProcessDetailsTab from './Details/ProcessDetailsTab.js';
import RecordDetailsTab from './Details/RecordDetailsTab.js';

// import OptOut from './User/OptOut';

import Login from './User/Login.js';
import Logout from './User/Logout.js';
import Reset from './User/Reset.js';
import UserDetails from './User/Profile.js';
import ForgotPassword from './User/ForgotPassword.js';
import Register from './User/Register.js';
import PreRegister from './User/PreRegister.js';
import Verify from './User/Verify.js';


import AboutNepa from './iframes/AboutNepa.js';
import AboutNepaccess from './iframes/AboutNepaccess.js';
import People from './iframes/People.js';
import SearchTips from './iframes/SearchTips.js';
import AvailableDocuments from './iframes/AvailableDocuments.js';
import Media from './iframes/Media.js';
import PrivacyPolicy from './iframes/PrivacyPolicy.js';
import DisclaimerTermsOfUse from './iframes/DisclaimerTermsOfUse.js';

import Contact from './Contact.js';
import Future from './iframes/Future.js';

import AboutHelpContents from './AboutHelpContents.js';
import AboutStats from './AboutStats.js';
import StatCounts from './StatCounts.js';
import InteractionLogs from './InteractionLogs.js';

import Iframes from './iframes/Iframes.js';

import Approve from './Approve.js';

import Importer from './Importer.js';
import Admin from './AdminPanel.js';
import AdminFiles from './AdminFiles.js';

import Test from './Test.js';
import SearchTest from './AppTest';
import Pairs from './Pairs.js';
import Pairs2 from './Pairs2';
import Pairs3 from './Pairs3';

import SearchLogs from './SearchLogs.js';
import Surveys from './Surveys.js';

import Excel from './Excel.js';
import ImporterGeo from './ImporterGeo.js';
import ImporterGeoLinks from './ImporterGeoLinks.js';
//import RecordDetailsTab from './RecordDetailsTab'


import Globals from './globals.js';
import Search from './Search.js';
import NoMatch from './components/Router/NoMatch';
import RouteError from './components/Router/RouterError';

//import { Link, Switch, Route, withRouter } from 'react-router-dom';

import { BrowserRouter, Route,Link,Routes} from 'react-router-dom';

import PropTypes from "prop-types";

import ImporterAlignment from './ImporterAlignment';
import { Details } from '@material-ui/icons';

const _ = require('lodash');

class Main extends React.Component {

    static propTypes = {
        location: PropTypes.object.isRequired
    }

    constructor(props) {
        super(props);
        console.log(`file: Main.js:87 ~ Main ~ constructor ~ props:`, props);

        this.state = {
            displayUsername: '',
            loggedIn: false,
            loggedInDisplay: 'display-none',
            loggedOutDisplay: '',
            loaderClass: 'loadDefault',
            role: null,
            currentPage: "",
            anonymous: false,
            headerLandingCss: ""
        };

        this.refresh = this.refresh.bind(this);
        this.refreshNav = this.refreshNav.bind(this);
        this.getRoleDebounced = _.debounce(this.getRole, 500);
        Globals.setUp();

        window.addEventListener("scroll", this.handleScroll);
    }

    /** This effectively replaces the original purpose of check(), especially with anonymous user support */
    getRole = () => {

        const checkURL = new URL('user/get_role', Globals.currentHost);
        axios.post(checkURL)
            .then(response => {
                const verified = response && response.status === 200;
                if (verified) {
                    localStorage.role = response.data.toLowerCase();
                    this.setState({ role: response.data.toLowerCase(), loggedIn: true, anonymous: false }, () => {
                        console.log('MAIN Refreshing Nav');
                        this.refreshNav();
                    });
                } else {
                    localStorage.clear();
                    this.setState({ role: undefined, loggedIn: false, anonymous: true });
                }
            })
            .catch((err) => { // Token expired or invalid, or server is down
                console.log(err);
                if (err.message === "Network Error") {
                    // do nothing
                } else { // token problem
                    localStorage.clear();
                    this.setState({ role: undefined, loggedIn: false, anonymous: true });
                }
            });
    }


    check = () => { // check if logged in (JWT is valid and not expired)
        // let verified = false;
        // let checkURL = new URL('test/check', Globals.currentHost);

        // axios.post(checkURL)
        // .then(response => {
        //     verified = response && response.status === 200;
        //     this.setState({
        //         loggedIn: verified
        //     }, () => {
        this.getRoleDebounced();
        // this.refreshNav();
        //     });
        // })
        // .catch((err) => { // Token expired or invalid, or server is down

        //     localStorage.removeItem("role");
        //     this.setState({
        //         loggedIn: false,
        //         role: null
        //     });
        // });
        // console.log("Main check");

    }

    // refresh() has a global listener so as to change the loggedIn state and then update the navbar
    // as needed, from child components
    refresh(verified) {
        this.setState({
            loggedIn: verified.loggedIn
        }, () => {
            this.getRoleDebounced();
            this.refreshNav();
        });
    }

    refreshNav() {
        this.setState({
            loggedOutDisplay: 'display-none',
            loggedInDisplay: 'display-none'
        });
        if (this.state.loggedIn) {
            // console.log("Logout etc. displaying");
            this.setState({
                loggedInDisplay: '',
            });
        } else {
            // console.log("Login button displaying");
            this.setState({
                loggedOutDisplay: '',
                role: null
            });
        }

        if (localStorage.username) {
            this.setState({
                displayUsername: localStorage.username
            });
        }
    }


    componentDidUpdate(prevProps) {
        if (this.props.location !== prevProps.location) {
            console.log(`file: Main.js:210 ~ Main ~ componentDidUpdate ~ prevProps:`, prevProps);
            console.log(`file: Main.js:210 ~ Main ~ componentDidUpdate ~ this.props:`, this.props);
            this.onRouteChanged();
        }
    }
    onRouteChanged() {
        console.log("Route changed", this.props.location.pathname);
        this.setState({
            currentPage: this.props.location.pathname
        });
    }

    getHeaderCss = () => {
        let headerCss = "no-select";
        if (!this.state.currentPage || this.state.currentPage === '/') {
            headerCss += " landing-header";
        }
        return headerCss;
    }
    handleScroll = (e) => {
        // For landing only
        if (this.state.currentPage && this.state.currentPage === '/') {
            let landingStyle = "";

            const position = window.pageYOffset;

            if (position > 100) {
                // console.log("Transition header background", position);
                landingStyle = " transition";
            }

            this.setState({
                headerLandingCss: landingStyle
            });
        }
    }


    render() {
        return (
            <div id="home-page">
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>NEPAccess</title>
                    <meta name="description" content="Bringing NEPA into the 21st Century through the power of data science. Find and engage with data from thousands of environmental review documents." />
                    <link rel="canonical" href="https://www.nepaccess.org/" />
                </Helmet>

                <div id="header" className={this.getHeaderCss() + this.state.headerLandingCss}>

                    <div id="logo" className="no-select">
                        <Link id="logo-link" to="/">
                        </Link>
                        <div id="logo-box">

                        </div>
                    </div>

                    <div id="top-menu" className="no-select">

                        {this.showMenuItems()}

                        <span id="profile-span" className={this.state.loggedInDisplay + " right-nav-item logged-in"}>
                            <Link className="top-menu-link" to="/profile">Profile</Link>
                        </span>
                        <span id="login-span" className={this.state.loggedOutDisplay + " logged-out"}>
                            <Link className="top-menu-link" to="/login">Log in</Link>
                        </span>
                        <span id="register-span" className={this.state.loggedOutDisplay + " right-nav-item logged-out"}>
                            <Link className="top-menu-link" to="/register">Register</Link>
                        </span>
                        <span className={this.state.loggedInDisplay + " right-nav-item logged-in"}>
                            <Link className="top-menu-link" to="/logout">Log out</Link>
                        </span>
                    </div>

                    <div id="main-menu">
                        <Link currentpage={(this.state.currentPage === "/search").toString()} className="main-menu-link" to="/search">
                            Search
                        </Link>
                        <div id="about-dropdown-2" className="main-menu-link dropdown">
                            <Link currentpage={(this.state.currentPage === "/search-tips" || this.state.currentPage === "/available-documents").toString()} id="about-button-2" className="main-menu-link drop-button" to="/search-tips">
                                Search Tips
                            </Link>
                            <i className="fa fa-caret-down"></i>
                            <div className="dropdown-content">
                                q      <Link to="/search-tips">Search Tips</Link>
                                <Link to="/available-documents">Available Files</Link>
                            </div>
                        </div>
                        <Link currentpage={(this.state.currentPage === "/about-nepa").toString()} className="main-menu-link" to="/about-nepa">
                            About NEPA
                        </Link>
                        <div id="about-dropdown" className="main-menu-link dropdown">
                            <Link currentpage={(this.state.currentPage === "/about-nepaccess" || this.state.currentPage === "/people" || this.state.currentPage === "/media").toString()} id="about-button" className="main-menu-link drop-button" to="/about-nepaccess">
                                About NEPAccess
                            </Link>
                            <i className="fa fa-caret-down"></i>
                            <div className="dropdown-content">
                                <Link to="/about-nepaccess">About NEPAccess</Link>
                                <Link to="/publications">Publications</Link>
                                <Link to="/media">
                                    News
                                </Link>
                                <Link to="/people">People</Link>
                            </div>
                        </div>

                        {/* <Link currentpage={(this.state.currentPage==="/future").toString()} className="main-menu-link" to="/future">
                        Future
                    </Link> */}
                        <Link currentpage={(this.state.currentPage === "/contact").toString()} className="main-menu-link" to="/contact">
                            Contact
                        </Link>

                    </div>
                            <Routes>
                                <Route path="/profile" element={<UserDetails />} />
                                <Route errorElement={<RouteError />} path="/login" element={<Login />} />
                                <Route errorElement={<RouteError />} path="/register" element={<Register />} />
                                <Route errorElement={<RouteError />} path="/pre_register" element={<PreRegister />} />
                                <Route errorElement={<RouteError />} path="/forgotPassword" element={<ForgotPassword />} />
                                <Route errorElement={<RouteError />} path="/reset" element={<Reset />} />
                                <Route errorElement={<RouteError />} path="/logout" element={<Logout />} />
                                <Route errorElement={<RouteError />} path="/about-nepa" element={<AboutNepa />} />
                                <Route errorElement={<RouteError />} path="/about-nepaccess" component={<AboutNepaccess />} />
                                <Route errorElement={<RouteError />} path="/people" element={<People />} />
                                <Route errorElement={<RouteError />} path="/search-tips" element={<SearchTips />} />
                                <Route errorElement={<RouteError />} path="/available-documents" element={<AvailableDocuments />} />
                                <Route errorElement={<RouteError />} path="/abouthelpcontents" component={<AboutHelpContents />} />
                                <Route errorElement={<RouteError />} path="/stats" element={<AboutStats />} />
                                <Route errorElement={<RouteError />} path="/media" element={<Media />} />
                                <Route errorElement={<RouteError />} path="/contact" element={<Contact />} />
                                <Route errorElement={<RouteError />} path="/future" element={<Future />} />
                                <Route errorElement={<RouteError />} path="/record-details" element={<RecordDetailsTab />} />
                                <Route errorElement={<RouteError />} path="/process-details" element={<ProcessDetailsTab />} />
                                <Route errorElement={<RouteError />} path="/importer" element={<Importer />} />
                                <Route errorElement={<RouteError />} path="/adminFiles" element={<AdminFiles />} />
                                <Route errorElement={<RouteError />} path="/iframes" element={<Iframes />} />
                                <Route errorElement={<RouteError />} path="/privacy-policy" element={<PrivacyPolicy />} />
                                <Route errorElement={<RouteError />} path="/disclaimer-terms-of-use" element={<DisclaimerTermsOfUse />} />
                                <Route errorElement={<RouteError />} path="/verify" element={<Verify />} />
                                <Route errorElement={<RouteError />} path="/approve" element={<Approve />} />
                                <Route errorElement={<RouteError />} path="/admin" element={<Admin />} />
                                <Route errorElement={<RouteError />} path="/pairs" element={<Pairs />}></Route>
                                <Route errorElement={<RouteError />} path="/pairs2" element={<Pairs2 />}></Route>
                                <Route errorElement={<RouteError />} path="/pairs3" element={<Pairs3 />}></Route>
                                <Route errorElement={<RouteError />} path="/search_logs" element={<SearchLogs />}></Route>
                                <Route errorElement={<RouteError />} path="/interaction_logs" element={<InteractionLogs />}></Route>
                                <Route errorElement={<RouteError />} path="/stat_counts" element={<StatCounts />}></Route>
                                <Route errorElement={<RouteError />} path="/surveys" element={<Surveys />}></Route>
                                <Route errorElement={<RouteError />} path="/excel" element={<Excel />}></Route>
                                <Route errorElement={<RouteError />} path="/search_test" element={<SearchTest />} />
                                <Route errorElement={<RouteError />} path="/up_geo" element={ImporterGeo} />
                                <Route errorElement={<RouteError />} path="/up_geo_links" element={ImporterGeoLinks} />
                                <Route errorElement={<RouteError />} path="/up_alignment" element={ImporterAlignment} />
                                <Route errorElement={<RouteError />} path="/record-details/?id=:id" element={<RecordDetailsTab history={history} />} />
                                <Route errorElement={<RouteError />} path="/record-details/" element={<RecordDetailsTab history={history} />} />
    
                                <Route errorElement={<RouteError />} index path="/process-details/processId=:id" element={<ProcessDetailsTab history={history} />} />
                                <Route errorElement={<RouteError />} path="/search" element={<App history={window.history} />}>
                                    <Route index element={<App history={window.history} location={window.location} />} />
                                    <Route path="q=:q" element={<App history={window.location.history} />} />
                                </Route>
    
    
                                <Route errorElement={<RouteError />} exact path="/" element={<Landing history={window.history} location={location} />} />
                                <Route errorElement={<RouteError />} path="*" element={<NoMatch />} />
                            </Routes>
                       {/* <Main location={window.location} history={window.history} /> */}
                </div>
                {/* <Route path="/profile" component={UserDetails}/>
                    <Route path="/login" element={Login}/>
                    <Route path="/register" element={Register}/>
                    <Route path="/pre_register" element={PreRegister}/>
                    <Route path="/forgotPassword" element={ForgotPassword}/>
                    <Route path="/reset" element={Reset}/>
                    <Route path="/logout" element={Logout}/>
    
                    <Route path="/search" element={App}/>
                    <Route path="/about-nepa" element={AboutNepa}/>
                    <Route path="/about-nepaccess" component={AboutNepaccess}/>
                    <Route path="/people" element={People}/>
                    <Route path="/search-tips" element={SearchTips}/>
                    <Route path="/available-documents" element={AvailableDocuments}/>
                    <Route path="/abouthelpcontents" component={AboutHelpContents}/>
                    <Route path="/stats" element={AboutStats}/>
                    <Route path="/media" element={Media}/>
    
                    <Route path="/contact" element={Contact}/>
                    <Route path="/future" element={Future}/>
    
                    <Route path="/record-details" element={RecordDetailsTab}/>
                    <Route path="/process-details" element={ProcessDetailsTab}/>
                    
                    <Route path="/importer" element={Importer}/>
                    <Route path="/adminFiles" element={AdminFiles}/>
    
                    <Route path="/iframes" element={Iframes} />
                    <Route path="/privacy-policy" element={PrivacyPolicy} />
                    <Route path="/disclaimer-terms-of-use" element={DisclaimerTermsOfUse} />
                    <Route path="/verify" element={Verify} />
                    <Route path="/approve" element={Approve} />
                    <Route path="/admin" element={Admin} />
                    <Route path="/pairs" element={Pairs}></Route>
                    <Route path="/pairs2" element={Pairs2}></Route>
                    <Route path="/pairs3" element={Pairs3}></Route>
                    <Route path="/search_logs" element={SearchLogs}></Route>
                    <Route path="/interaction_logs" element={InteractionLogs}></Route>
                    <Route path="/stat_counts" element={StatCounts}></Route>
                    <Route path="/surveys" element={Surveys}></Route>
                    <Route path="/excel" element={Excel}></Route>
                    
                    <Route path="/test" element={Test} />
                    <Route path="/search_test" element={SearchTest} />
                    <Route path="/up_geo" element={ImporterGeo} />
                    <Route path="/up_geo_links" element={ImporterGeoLinks} />
                    <Route path="/up_alignment" element={ImporterAlignment} />
     */}

            </div>
        )
    }

    showMenuItems = () => {

        return (
            <span id="admin-span" hidden={(!this.state.role || this.state.role === 'user')} className={this.state.loggedInDisplay + " right-nav-item logged-in"}>

                <div id="admin-dropdown" className="main-menu-link dropdown">
                    <Link id="admin-button" className="main-menu-link drop-button" to="/importer">
                        Admin
                    </Link>
                    <i className="fa fa-caret-down"></i>
                    <div className="dropdown-content">
                        <Link to="/admin" hidden={!(this.state.role === 'admin')}>Admin Panel</Link>
                        <Link to="/importer" hidden={!(this.state.role === 'curator' || this.state.role === 'admin')}>Import New Documents</Link>
                        <Link to="/adminFiles" hidden={!(this.state.role === 'curator' || this.state.role === 'admin')}>Find Missing Files</Link>
                        <Link to="/approve">Approve Users</Link>
                        <Link to="/pre_register">Pre-Register Users</Link>
                        <Link to="/interaction_logs">Interaction Logs</Link>
                        <Link to="/search_logs">Search Logs</Link>
                        <Link to="/abouthelpcontents">Database Contents</Link>
                        <Link to="/stats">Content Statistics</Link>
                        <Link to="/stat_counts">Stat Counts</Link>
                        <Link to="/surveys">Surveys</Link>
                    </div>
                </div>

            </span>
        );
    }


    componentDidMount() {
        // Role config allows admin menu and options to work properly
        console.log('MAIN HAS MOUNTED w/ PROPS:', this.props);
        if (!this.state.role) {
            if (localStorage.role) {
                this.setState({ role: localStorage.role });
            } else if (this.state.anonymous) {
            } else {
                this.getRoleDebounced();
            }
        }

        Globals.registerListener('refresh', this.refresh);
        console.log('Active URL', window.location);
        this.setState({
            currentPage: window.location.pathname
        });
        this.check();

        // if(navigator.userAgent.toLowerCase ().match (/mobile/i)) {
        //     console.log("Mobile device");
        // }
    }

    componentWillUnmount() {
        window.removeEventListener("scroll", this.handleScroll);
    }
}

//export default withRouter(Main);
export default Main;