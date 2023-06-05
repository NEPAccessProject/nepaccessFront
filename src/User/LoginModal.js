import React from 'react';

import ReactModal from 'react-modal';

import axios from 'axios';

import Globals from '../globals.js';

import './login.css';

export default class LoginModal extends React.Component {
    
    constructor(props) {
        super(props);
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
    
    
    showModal = (e) => { 
        this.setState({ show: true }); 
    }
    hideModal = (e) => {   
        this.setState({ show: false });
    }
    
    onKeyUp = (evt) => {
        if(evt.key === "Escape"){
            this.hideModal();
        }
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
            let responseOK = response && response.status === 200;
            if (responseOK) {
                return response.data;
            } else { // ???
                return null;
            }
        }).then(jsonResponse => {
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
                    console.log('Globals.currentHost:', Globals.currentHost);
                    axios.post(checkURL)
                    .then(response => {
                        const verified = response && response.status === 200;
                        if(verified) {
                            localStorage.role = response.data.toLowerCase();
                        }
                    })
                    .catch((err) => { // Token expired or invalid, or server is down
                        console.error('Server Auth Error:',err);
                    });
                }); 
                this.hideModal();
                if(this.props.closeParent) { // i.e. hide tutorial window containing this login modal
                    this.props.closeParent();
                }
            } else {
                this.setState({
                    networkError: "Semething went wrong, please try reloading the page. If you are on a VPN, please try connecting without the VPN. If the issue persists, the server may be down briefly for maintenance."
                });
            }
            this.setState({busy: false});
        }).catch(error => {
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
            console.error(error);
            this.setState({busy: false});
        });

    }

    
    Build = () => {
        if(this.props.message) {
            return (
                <button className='link' onClick={e => {
                    this.showModal();
                }}>
                    {this.props.message}
                </button>
            );
        } else {
            return (
                <button className='link' onClick={e => {
                    this.showModal();
                }}>
                    log in
                </button>
            );
        }
    }


    render() {
        if(!this.state.show) {
            return this.Build();
        } 

        if (typeof(window) !== 'undefined') {
            ReactModal.setAppElement('body');
        }

        return (
            <div className="inline" onKeyUp={this.onKeyUp}>
                {this.Build()}
                <ReactModal 
                    id="login-modal"
                    onRequestClose={this.hideModal}
                    isOpen={this.state.show}
                    parentSelector={() => document.body}
                    // ariaHideApp={false}
                >
                    <div className="container login-form-small">
                        <button className="float-right" onClick={this.hideModal}>x</button>

                        <div className="form">
                            <label className="loginErrorLabel">{this.state.networkError}</label>

                                <span className="bold">
                                    Please log in or <a href="/register" target="_blank">create an account</a>
                                </span>

                            <div className="form-content">
                                
                                <div className="login-row">
                                    <div className="form-group">
                                        <span>
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
                                <div className="login-row">
                                    <div className="form-group">
                                        <span>
                                            Your password:
                                        </span>
                                        <input type={this.state.passwordType} id="password" className="form-control" 
                                            name="password" 
                                            placeholder="" 
                                            value={this.state.password} 
                                            onChange={this.onChange} 
                                            onKeyUp={this.onKeyUp}/>
                                        <label className="loginErrorLabel">{this.state.passwordError}</label>
                                    </div>
                                </div>

                                <span className="leading-text"></span>
                                <button type="button" className="button2" id="login-submit" onClick={this.login} >
                                    Log in
                                </button>

                                <div className="login-row">
                                    <a target="_blank" href="/forgotPassword">Forgot password?</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </ReactModal>
            </div>
        );
    }

    componentDidMount() {
        Globals.emitEvent(false);
	}
}