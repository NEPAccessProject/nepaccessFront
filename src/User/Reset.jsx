import React from 'react';
import {Helmet} from 'react-helmet';

import axios from 'axios';

import Globals from '../globals.jsx';

import './login.css';

class Reset extends React.Component {

    constructor(props) {
        super(props);
		this.state = {
            newPassword: '',
            newChecked: "password",
            successLabel: '',
            newPasswordError: '',
            shouldRender: true
        };
    }
    

    // Validation
    invalidFields = () => {
        // Run everything and all appropriate errors will show at once.
        let test1 = this.invalidNewPassword();
        this.setState({ disabled: test1 });
        return (test1);
    }
    
    invalidNewPassword(){
        let invalid = !( Globals.validPassword(this.state.newPassword) );
        let message = "";
        if(invalid){
            message = "Password invalid. Must be at least 4 characters, must be printable characters.";
        }
        this.setState({ newPasswordError: message });
        this.setState({ disabled: invalid });
        return invalid;
    }


	onNewPasswordChange = (evt) => {
        this.setState({ newPassword: evt.target.value }, () => { this.invalidNewPassword(); });
    }


    check = () => { // check if JWT is expired/invalid
		let verified = false;

        let checkURL = new URL('reset/check', Globals.currentHost);

        const rToken = this.getResetTokenFromParams();
        
        axios({
            method: 'POST', // or 'PUT'
            headers: {Authorization: rToken},
            url: checkURL
        }).then(response => {
            verified = response && response.status === 200;
            return verified;
        }).catch(error => {
            console.error('Server is down or token is invalid/expired.', error);
            this.setState({
                shouldRender: false
            });
        });
    }

    
    changePassword = () => {
        if(this.invalidFields()){
            return;
        }
        document.body.style.cursor = 'wait';

        const rToken = this.getResetTokenFromParams();
        
        let changeUrl = new URL('reset/change', Globals.currentHost);

        axios({ 
            method: 'POST',
            url: changeUrl,
            headers: {Authorization: rToken},
            data: {newPassword: this.state.newPassword}
        }).then(response => {
            let responseOK = response && response.status === 200;
            if (responseOK) {
                this.setState({
                    newPassword: '',
                    successLabel: 'Password changed.'
                });
            } else {
                // Server down?
            }
        }).catch(error => { // 401/403
            console.error('error message', error);
            this.setState({
                successLabel: "Password was not changed."
            });
            this.setState({
                newPasswordError: "Reset token may be expired or invalid, or server may be down."
            });
        });

        document.body.style.cursor = 'default';
    }
    
    showNewPassword = () => {
        let value = "password";
        if(this.state.newChecked === value){
            value = "text";
        }
        this.setState({
            newChecked: value
        });
    } 
    
    
    render() {
        if(!this.state.shouldRender)
        {
            return (
                <div id="main" className="container login-form">
                    <Helmet>
                        <meta charSet="utf-8" />
                        <title>Reset Password - NEPAccess</title>
                        <link rel="canonical" href="https://nepaccess.org/reset" />
                    </Helmet>
                    <div className="form">
                        <div className="note">
                            Set New Password
                        </div>
                        <div className="col-md-6">
                            <label className="loginErrorLabel">Token is expired or invalid, please try again.</label>
                        </div>
                    </div>
                </div>)
        } else {
            return (
                <div className="container login-form">
                    <Helmet>
                        <meta charSet="utf-8" />
                        <title>Reset Password - NEPAccess</title>
                        <link rel="canonical" href="https://nepaccess.org/reset" />
                    </Helmet>
                    <div className="form-content">
                        <div className="note">
                            Set New Password
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label htmlFor="newPassword">Enter a new password:</label>
                                <input type={this.state.newChecked} id="newPassword" className="form-control password-field" 
                                    name="newPassword" placeholder="New Password *" value={this.state.newPassword} onChange={this.onNewPasswordChange}/>
                                <label className="loginErrorLabel">{this.state.newPasswordError}</label>
                                <br />
                                <input type="checkbox" id="showNewPassword" onClick={this.showNewPassword}></input>
                                <label className="inline noSelect">Show password</label>
                            </div>
                        </div>
                        <br />
                        <br />
                        <button type="button" className="button" disabled={this.state.disabled} onClick={this.changePassword}>Change Password</button>
                        <label className="infoLabel">{this.state.successLabel}</label>
                    </div>
                </div>
            )
        }
    }

    getResetTokenFromParams = () => {
        const query = new URLSearchParams(this.props.location.search);
        if(query && query.get('token')){ // Reset token provided?
            const resetToken = ("Bearer " + query.get('token')); // .../reset?token={resetToken}
            return resetToken;
        } else {
            console.log("No token found");
            return null;
        }
    }

	componentDidMount() {
        const query = new URLSearchParams(this.props.location.search);
        if(query && query.get('token')){ // If there's a reset token provided, set JWT and check it
            const resetToken = ("Bearer " + query.get('token')); // .../reset?token={resetToken}
            this.check();
        } else { // otherwise no point in showing the page as usual
            this.setState({
                shouldRender: false
            });
        }
	}
}

export default Reset;