import React from 'react';
import {Helmet} from 'react-helmet';

import Footer from '../Footer.jsx';

import axios from 'axios';

import Globals from '../globals.jsx';

import './optout.css';

/** No one ever opted out, so this page was never used and should now be irrelevant. */
export default class OptOut extends React.Component {
    
    constructor(props) {
        super(props);
        
        this.state = { 
            optOutUser: {
                name: '',
                email: ''
            },
            nameError: '',
            emailError: '',
            networkError: '',
            submittedMessage: 'Successfully submitted.',

            submitted: false
        };
    }

    optOut = () => {
        if(!this.invalidFields()){
            document.body.style.cursor = 'wait';
            
            let _url = new URL('user/opt_out', Globals.currentHost);
    
            axios({ 
                method: 'POST',
                url: _url,
                data: this.state.optOutUser
            }).then(response => {
                let responseOK = response && response.status === 200;
                if (responseOK) {
                    this.setState({
                        submitted: true
                    });
                } else if(response.status === 208) { // already in?
                    this.setState({
                        submitted: true,
                        submittedMessage: "Thank you, this email has been submitted."
                    });
                }
            }).catch(error => { // 400/500
                console.error('error message', error);
                this.setState({
                    networkError: "Sorry, the server ran into an error: " + error.response.status
                });
            });
    
            document.body.style.cursor = 'default';
        }
    }
    
    onChange = (evt) => {
        const name = evt.target.name;
        const value = evt.target.value;

        this.setState( prevState =>
        { 
            const updatedUser = prevState.optOutUser;
            updatedUser[name] = value;
            return {
                optOutUser: updatedUser
            }
        });
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
        // We'll allow blank names.
        // let test1 = this.invalidName();
        let test2 = this.invalidEmail();

        return (test2);
    }
    // invalidName = () => {
    //     let usernamePattern = /[ -~]/;
    //     let invalid = !(usernamePattern.test(this.state.optOutUser.name));
    //     let message = "";

    //     if(invalid){
    //         message = "Cannot be empty, must be printable characters.";
    //     }
    //     this.setState({
    //         nameError: message
    //     });

    //     return invalid;
    // }
    invalidEmail = () => {
        let emailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let invalid = !(emailPattern.test(this.state.optOutUser.email));
        let message = "";

        if(invalid){
            message = "Please enter a valid email address.";
        }
        this.setState({ 
            emailError: message 
        });

        return invalid;
    }

    // silence irrelevant warnings
    onChangeDummy = (evt) => {
        // do nothing
    }

    render() {
        if(this.state.submitted) {
            return <div className="container login-form">{this.state.submittedMessage}</div>
        } else {

            return (
                <div className="container login-form">
                    <Helmet>
                        <meta charSet="utf-8" />
                        <title>Opt out - NEPAccess</title>
                        <link rel="canonical" href="https://nepaccess.org/opt_out" />
                        <meta name="robots" content="noindex, nofollow" data-react-helmet="true" />
                    </Helmet>

                    <div className="form">
                        <label className="loginErrorLabel">{this.state.networkError}</label>

                        <div className="form-content">
                            
                            <div className="login-row">
                                <div className="form-group">
                                    <span className="leading-text">
                                        
                                    </span>
                                    <span className="green-title">Stay informed about NEPAccess</span>
                                </div>
                                <div>
                                    <span className="leading-text">
                                        
                                    </span>
                                    <span className="after-text">We understand you may not want to participate at this time.</span>
                                </div>
                                <div>
                                    <span className="leading-text">
                                        
                                    </span>
                                    <span className="after-text">By leaving your name and email below, we will inform you</span>
                                </div>
                                <div className="form-group">
                                    <span className="leading-text">
                                        
                                    </span>
                                    <span className="after-text">about the public rollout of NEPAccess.org.</span>
                                </div>

                                <div className="form-group">
                                    <span className="leading-text">
                                        Your name
                                    </span>
                                    <input type="text" className="form-control" 
                                        name="name" 
                                        placeholder="" 
                                        value={this.state.name} 
                                        autoFocus 
                                        onChange={this.onChange} 
                                        onKeyUp={this.onKeyUp}/>
                                    <label className="loginErrorLabel">{this.state.nameError}</label>
                                </div>
                                <div className="form-group">
                                    <span className="leading-text">
                                        Your email
                                    </span>
                                    <input type="text" className="form-control" 
                                        name="email" 
                                        placeholder="" 
                                        value={this.state.email} 
                                        onChange={this.onChange} 
                                        onKeyUp={this.onKeyUp}/>
                                    <label className="loginErrorLabel">{this.state.emailError}</label>
                                </div>
                            </div>

                            <span className="leading-text"></span>
                            <button type="button" className="button2 right-justify" onClick={this.optOut} >
                                Submit
                            </button>
                        </div>
                    </div>

                    <Footer id="footer"></Footer>
                </div>
            )
            
        }
    }

    componentDidMount() {

	}

}