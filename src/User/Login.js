import React from 'react';
import {Helmet} from 'react-helmet';
import { Link } from 'react-router-dom';

import Footer from '../Footer.js';

import axios from 'axios';

import Globals from '../globals.js';

import './login.css';

class Login extends React.Component {
    
    constructor(props) {
        super(props);
		// this.state = {
        //     username: '',
        //     password: '',
        //     usernameError: '',
        //     passwordError: '',
        //     passwordType: "password"
        // };
        this.state = { 
            user: {
                username: '',
                password: ''
            },
            usernameError: '',
            passwordError: '',
            networkError: '',
            passwordType: "password",
            busy: false,
        };
        this.onChange = this.onChange.bind(this);
        this.login = this.login.bind(this);
    }
    

    onChange = (evt) => {
        const name = evt.target.name;
        const value = evt.target.value;

        this.setState( prevState =>
        { 
            const updatedUser = prevState.user;
            updatedUser[name] = value;
            return {
                user: updatedUser
            }
        });
    }

    // Backend now strips surrounding whitespace from username on register
    onUsernameChange = (evt) => {
        const value = evt.target.value.trim();
        
        this.setState( prevState => {
            const updatedUser = prevState.user;
            updatedUser.username = value;
            return {
                user: updatedUser
            }
        })
    }

    onKeyUp = (evt) => {
        if(evt.keyCode ===13){
            evt.preventDefault();
            this.login();
        }
    }

    // Validation
    invalidFields = () => {
        // Run everything and all appropriate errors will show at once.
        let test1 = this.invalidUsername();
        let test2 = this.invalidPassword();
        return (test1 || test2);
    }
    invalidUsername = () => {
        let usernamePattern = /[ -~]/;
        let invalid = !(usernamePattern.test(this.state.user.username));
        let message = "";
        if(invalid){
            message = "Cannot be empty, must be printable characters.";
        }
        this.setState({
            usernameError: message
        });
        return invalid;
    }
    invalidPassword = () =>{
        let passwordPattern = /[ -~]/;
        let invalid = !(passwordPattern.test(this.state.user.password));
        let message = "";
        if(invalid){
            message = "Cannot be empty, must be printable characters.";
        }
        this.setState({
            passwordError: message
        });
        return invalid;
    }

    showPassword = () => {
        let value = "password";
        if(this.state.passwordType === value){
            value = "text";
        }
        this.setState({
            passwordType: value
        });
    } 
    

    check = () => {
				
		let verified = false;

		let checkURL = new URL('test/check', Globals.currentHost);
		if(localStorage.username){ // If they have a username saved, check if JWT is expired/invalid
            axios({
                method: 'POST', // or 'PUT'
                url: checkURL
            }).then(response => {
                console.log(`Login ~ response:`, response);
                // console.log(response.data);
                verified = response && response.status === 200;
                // Logged in user hitting login with valid JWT should be redirected to search, or user should logout.
                if(verified) {
                    this.props.history.push('/search');
                }
            }).catch(error => { // JWT is invalid or missing, or server problem
                console.error(`Login ~ error:`, error);
                if (!error.response) { // If no response, should mean server is down
                    this.setState({
                        networkError: 'Error: Network Error'
                    });
                } else { // should be a 403 for expired/invalid JWT, backend fires TokenExpiredException if expired
                    // console.log(error.response);
                }
            });
        }

        
    }

    // silence irrelevant warnings
    onChangeDummy = (evt) => {
        // do nothing
    }
    

    login = () => {
        if(this.invalidFields()){
            return;
        }
        this.setState({busy: true});

        let loginUrl = new URL('login', Globals.currentHost);

        axios({ 
            method: 'POST',
            url: loginUrl,
            data: this.state.user
        }).then(response => {
            console.log(`Login ~ response:`, response);
            let responseOK = response && response.status === 200;
            if (responseOK) {
                return response.data;
            } else { // ???
                return null;
            }
        }).then(jsonResponse => {
            console.log(`Login ~ jsonResponse:`, jsonResponse);
            if(jsonResponse){
                // if HTTP 200 (ok), save JWT, username, role and clear login
                localStorage.JWT = jsonResponse.Authorization;
                localStorage.username = this.state.user.username;

                Globals.signIn();
                Globals.emitEvent('refresh', {
                    loggedIn: true
                });

                // Set role
                this.setState({ user: {} }, () => { // clear
                    const checkURL = new URL('user/get_role', Globals.currentHost);
                    axios.post(checkURL)
                    .then(response => {
                        const verified = response && response.status === 200;
                        if(verified) {
                            localStorage.role = response.data.toLowerCase();
                        }
                    })
                    .catch((err) => { // Token expired or invalid, or server is down
                    });
                }); 
                
                // TODO: Other logic than .push() for navigation?
                this.props.history.push('/')
                this.props.history.refresh();
                // this.setState({
                //     username: '',
                //     password: ''
                // });
            } else {
                console.log("No response from server");
                this.setState({
                    networkError: "Server may be down.  If you are on a VPN, please try connecting without the VPN."
                });
            }
            this.setState({busy: false});
        }).catch(error => {
            console.error(`Failed to Login ~ error:`, error);
            // TODO: Less brittle way to check error type
            if(error.toString() === 'Error: Network Error') {
                this.setState({
                    networkError: "Semething went wrong, please try reloading the page. If you are on a VPN, please try connecting without the VPN. If the issue persists, the server may be down briefly for maintenance."
                });
            }
            else {
                this.setState({
                    passwordError: "Couldn't login with that username/password combination, please try again."
                });
            }
            this.setState({busy: false});
        });

    }

    render() {
        // console.log("Login");
        return (
            <div className="container login-form">
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>Login - NEPAccess</title>
                    <link rel="canonical" href="https://nepaccess.org/login" />
                </Helmet>

                <div className="form">
                    <div className="note">
                        Log in
                    </div>
                    <div className="loader-holder">
                        <div className="lds-ellipsis" hidden={!this.state.busy}><div></div><div></div><div></div><div></div></div>
                    </div>
                    <label className="loginErrorLabel">{this.state.networkError}</label>

                    <div className="form-content">
                        
                        <div className="login-row">
                            <span className="leading-text"></span>
                            <span className="bold">
                                Please log in or <Link to="/register">create an account</Link>
                            </span>
                        </div>
                        <div className="login-row">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <span className="leading-text">
                                        Your username:
                                    </span>
                                    <input type="text" id="username" className="form-control" 
                                        name="username" 
                                        placeholder="" 
                                        value={this.state.username} 
                                        autoFocus 
                                        onChange={this.onUsernameChange} 
                                        onKeyUp={this.onKeyUp}/>
                                    <label className="loginErrorLabel">{this.state.usernameError}</label>
                                </div>
                            </div>
                        </div>
                        <div className="login-row">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <span className="leading-text">
                                        Your password:
                                    </span>
                                    <input type={this.state.passwordType} id="password" className="form-control" 
                                        name="password" 
                                        placeholder="" 
                                        value={this.state.password} 
                                        onChange={this.onChange} 
                                        onKeyUp={this.onKeyUp}/>
                                    <label className="loginErrorLabel">{this.state.passwordError}</label>
                                    <br />
                                    <input type="checkbox" onClick={this.showPassword}></input>
                                    <span className="leading-text"></span>
                                    <label id="login-show-password" className="inline noSelect form-control">
                                        Show password
                                    </label>
                                </div>
                            </div>
                        </div>

                        <span className="leading-text"></span>
                        <button type="button" className="button2" id="login-submit" onClick={this.login} >
                            Log in
                        </button>
                        
                        <div className="login-row">
                            <span className="leading-text"></span>
                            <Link id="forgot" to="/forgotPassword">Forgot password?</Link>
                        </div>
                    </div>
                </div>

                <Footer id="footer"></Footer>
            </div>
            
        )
    }

    componentDidMount() {
        this.check();
        Globals.emitEvent(false);
	}
}

export default Login;