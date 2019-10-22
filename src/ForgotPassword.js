import React from 'react';
import axios from 'axios';
import Globals from './globals';
import './login.css';

class ForgotPassword extends React.Component {


    constructor(props) {
        super(props);
        this.state = { 
            networkError: '',
            emailError: '',
            successLabel: '',
            resetEmail: {
                email: ''
            }
        };
        this.onChange = this.onChange.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
        this.sendResetLink = this.sendResetLink.bind(this);
    }
    
    
    onChange = (evt) => {
        const name = evt.target.name;
        const value = evt.target.value;

        this.setState( prevState =>
        { 
            const updatedEmail = prevState.resetEmail;
            updatedEmail[name] = value;
            return {
                resetEmail: updatedEmail
            }
        });
    }

    onKeyUp = (evt) => {
        if(evt.keyCode ===13){
            evt.preventDefault();
            this.sendResetLink();
        }
    }

    
    invalidEmail(){
        let emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let invalid = !(emailPattern.test(this.state.resetEmail.email));
        if(!invalid){
            if(this.state.resetEmail.email.length > 191){ // Max length
                invalid = true;
            }
        }
        let message = "";
        if(invalid){
            message = "Email address invalid.";
        }
        this.setState({ emailError: message });
        // this.setState({ disabled: invalid });
        return invalid;
    }
    

    sendResetLink = () => {
        if(this.invalidEmail()){
            return;
        }
        
        document.body.style.cursor = 'wait';
        this.setState({ emailError: '', networkError: '' });
        
        let resetUrl = new URL('reset/send', Globals.currentHost);

        axios({ 
            method: 'POST',
            url: resetUrl,
            data: this.state.resetEmail
        }).then(response => {
            let responseOK = response && response.status === 200;
            if (responseOK) {
                return true;
            } else { // Server down?
                return false;
            }
        }).then(success => {
            if(success){
                this.setState({
                    successLabel: "Reset link sent to provided email address."
                });
            } else {
                // Server down?
            }
        }).catch(error => {
            if(error.response) {
                if (error.response.status === 418) {
                    this.setState({ 
                        networkError: "Too many reset emails sent, please wait 24 hours between requests."
                    });
                } else if (error.response.status === 500) {
                    this.setState({ // 500
                        networkError: "Unknown email server error, please try again later."
                    });
                } 
            } else {
                this.setState({
                    networkError: "Server may be down, please try again later."
                });
            }
            this.setState({
                successLabel: "Email could not be sent."
            });
            console.error('error message', error);
        });

        document.body.style.cursor = 'default';
    }


    render() {
        return (
            <div className="container login-form">
                <label className="errorLabel">{this.state.networkError}</label>
                <div className="form">
                    <div className="note">
                        <p>Reset Password</p>
                    </div>

                    <div className="form-content">
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <input type="text" id="email" className="form-control" name="email" 
                                    placeholder="Email address" autoFocus onChange={this.onChange} onKeyUp={this.onKeyUp}/>
                                    <label className="errorLabel">{this.state.emailError}</label>
                                </div>
                            </div>
                        </div>
                        <button type="button" className="button" id="submit" onClick={this.sendResetLink} >Send reset link</button>
                        <label className="infoLabel">{this.state.successLabel}</label>
                    </div>
                </div>
            </div>
        )
    }
}

export default ForgotPassword;