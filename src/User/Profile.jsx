import React from 'react';
import {Helmet} from 'react-helmet';

import axios from 'axios';

import Globals from '../globals';

import './profile.css';

// TODO: Move pieces to child components, and turn this page into a menu of links for them?

class UserDetails extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            newPassword: '',
            oldPassword: '',
            currentChecked: "password",
            newChecked: "password",
            successLabel: '',
            successLabelPassword: '',
            newPasswordError: '',
            oldPasswordError: '',
            userDetails: {
                username: '',
                firstName: '',
                lastName: '',
                affiliation: '',
                organization: '',
                jobTitle: ''
            },
            show: "change_password",
            disabled: true,
            disabledPassword: true
        }
    }

    changePassword = () => {
        if(this.invalidFields()){
            return;
        }
        document.body.style.cursor = 'wait';
        
        let changeUrl = new URL('user/details/changePassword', Globals.currentHost);

        let dataToPass = { oldPassword: this.state.oldPassword, newPassword: this.state.newPassword };
        axios({ 
            method: 'POST',
            url: changeUrl,
            data: dataToPass
        }).then(response => {
            let responseOK = response && response.status === 200;
            if (responseOK) {
                console.log("OK");
                return true;
            } else { // Server down?
                return false;
            }
        }).then(success => {
            if(success){
                // if HTTP 200 (ok), clear fields and display success
                this.setState({
                    successLabelPassword: "Password changed."
                });
                console.log("Changed");
            } else {
                // Server down?
            }
        }).catch(error => { // 401
            console.error('error message', error);
            this.setState({
                successLabelPassword: "Password was not changed."
            });
            this.setState({
                oldPasswordError: "Password incorrect."
            });
        });

        document.body.style.cursor = 'default';
    }
    
    showCurrentPassword = () => {
        let value = "password";
        if(this.state.currentChecked === value){
            value = "text";
        }
        this.setState({
            currentChecked: value
        });
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
    
    // Validation
    invalidFields = () => {
        // Run everything and all appropriate errors will show at once.
        let test1 = this.invalidNewPassword();
        let test2 = this.invalidOldPassword();
        this.setState({ disabledPassword: test1 || test2 });
        return (test1 || test2 );
    }
    // TODO: Enforce password length of ??? (maybe 50-100 characters)
    invalidNewPassword(){
        let invalid = !(Globals.validPassword(this.state.newPassword));
        let message = "";
        if(invalid){
            message = "Password must be at least 4 printable characters.";
        }
        this.setState({ newPasswordError: message, disabledPassword: invalid });
        return invalid;
    }
    invalidOldPassword(){
        let passwordPattern = /[ -~]/;
        let invalid = !(passwordPattern.test(this.state.oldPassword));
        let message = "";
        if(invalid){
            message = "Password invalid. Cannot be empty, must be printable characters.";
        }
        this.setState({ oldPasswordError: message, disabledPassword: invalid }); 
        return invalid;
    }

	onNewPasswordChange = (evt) => {
        this.setState({ newPassword: evt.target.value }, () => { this.invalidNewPassword(); });
    }
	onOldPasswordChange = (evt) => {
        this.setState({ oldPassword: evt.target.value }, () => { this.invalidOldPassword(); });
    }
    
    // Special change handler for userDetails {} variables, also triggers sanity checking
    onChangeDetails = (evt) => {
        if(evt && evt.target){
            let targetName = evt.target.name;
            let targetValue = evt.target.value;
            this.setState(prevState => {
                let userDetails = { ...prevState.userDetails };  // shallow copy of state variable
                userDetails[targetName] = targetValue;                
                return { userDetails };
            }, () =>{
                this.checkFields();
            });
        }
    }

    /** Validates first/last; title/org can be blank; not doing any others currently. */
    checkFields = () => {
        this.invalidFirst();
        this.invalidLast();
    }
    
    invalidFirst = () => {
        let usernamePattern = /[a-zA-Z\s]/;
        let invalid = !this.state.userDetails.firstName || !(usernamePattern.test(this.state.userDetails.firstName.trim()));
        let message = "";
        if(invalid){
            message = "Cannot be empty, alphabetical characters only.";
            message = "*";
        }
        this.setState({ firstNameError: message, disabled: invalid });
        return invalid;
    }
    invalidLast = () => {
        let usernamePattern = /[a-zA-Z\s]/;
        let invalid = !this.state.userDetails.lastName || !(usernamePattern.test(this.state.userDetails.lastName.trim()));
        let message = "";
        if(invalid){
            message = "Cannot be empty, alphabetical characters only.";
            message = "*";
        }
        this.setState({ lastNameError: message, disabled: invalid });
        return invalid;
    }


    get = (endPath, stateField) => {
        let getUrl = Globals.currentHost + endPath;
        
        axios.get(getUrl, {
            params: {
                
            }
        }).then(response => {
            let responseOK = response && response.status === 200;
            if (responseOK && response.data) {
                return response.data;
            } else {
                return null;
            }
        }).then(parsedJson => { 
            console.log(parsedJson);
            if(parsedJson){
                this.setState({
                    [stateField]: parsedJson,
                    ready: true
                }, () => {
                    console.log(this.state);
                });
            } else { 
                console.log("Null/404: " + endPath);
            }
        }).catch(error => {
            console.error(error);
        });
    }


    /** Currently this should always get a 200 back since searches were allowed when not logged in. */
    check = () => { // check if JWT is expired/invalid
		let verified = false;

		let checkURL = new URL('test/check', Globals.currentHost);
        axios({
            method: 'POST', // or 'PUT'
            url: checkURL
        }).then(response => {
            verified = response && response.status === 200;
            return verified;
        }).then(result => {
            if(!result){
                this.props.history.push('/login');
            }
        }).catch(error => { // probably 403 (not authorized)
            // TODO: Catch indication that server is down
            this.props.history.push('/login');
        });
	}

    /** Push changes to this user details */
    setDetails = () => {
        document.body.style.cursor = 'wait';
        this.setState({ 
            disabled: true
        });
        
        let postUrl = new URL('user/details/change_details', Globals.currentHost);

        const dataForm = new FormData();
        let dataToPass = this.state.userDetails;
        
        dataForm.append('jsonDetails', JSON.stringify(dataToPass));

        axios({ 
            method: 'POST',
            url: postUrl,
            data: dataForm,
            headers:{
                'Content-Type': 'application/json; charset=utf-8'
            }
        }).then(response => {
            let responseOK = response && response.status === 200;
        
            if(responseOK){ 
                this.setState({
                    successLabel: "Details changed."
                });
            } else { // server down?
                this.setState({
                    successLabel: "Error: Details not changed.  Please try again later.",
                    disabled: false
                });
            }
        }).catch(error => {
            this.setState({
                successLabel: "Error: Details not changed.  Please try again later.",
                disabled: false
            });
            console.error(error);
        });
        
        document.body.style.cursor = 'default';
    }

    handleClick = (evt) => {
        this.setState({
            show: evt.target.name
        });
    }

    showLinks = () => {
        return (
            <div className="flex-content-columns">
                <div className="profile-link-button-holder">
                    <input type="button" name="change_password" className="profile-link-button" value="Change password"
                        onClick={this.handleClick} />
                </div>
                <div className="profile-link-button-holder">
                    <input type="button" name="change_details" className="profile-link-button" value="Change details"
                        onClick={this.handleClick} />
                </div>
            </div>
        );
    }

    showContent= () => {
        return (
            <div className="form-content">
                <div id="profile-container">

                    <div id="change_details_div" hidden={this.state.show !== "change_details"}>
                        <h2 className="padding-left">Change User Details</h2>
                        
                        <div className="register-form-group">
                            <span className="leading-text">
                                Username:
                            </span>
                            <input type="text" className="form-control" id="username" name="username" 
                                value={this.state.userDetails.username} disabled />
                        </div>

                        <div className="register-form-input-group">
                            <div className="register-form-group">
                                <span className="leading-text">Your first name:</span>
                                <input type="text" maxLength="191"
                                    className="form-control" id="firstName" name="firstName" value={this.state.userDetails.firstName} autoFocus onChange={this.onChangeDetails} />
                                <label className="errorLabel">{this.state.firstNameError}</label>
                            </div>
                            <div className="register-form-group">
                                <span className="leading-text">Your last name:</span>
                                <input type="text" maxLength="191" value={this.state.userDetails.lastName || ""}
                                    className="form-control" id="lastName" name="lastName" onChange={this.onChangeDetails} />
                                <label className="errorLabel">{this.state.lastNameError}</label>
                            </div>
                            <div className="register-form-group">
                                <span className="leading-text">Your email address:</span>
                                <input type="text" 
                                    className="form-control" id="email" name="email" value={this.state.userDetails.email} disabled />
                            </div>
                        </div>
                        <div className="register-form-input-group">
                            <div className="register-form-group">
                                <span className="leading-text">Your user group:</span>
                                <input
                                    className="form-control"
                                    name="affiliation" 
                                    value={this.state.affiliation} 
                                    disabled />
                            </div>
                        </div>
                        
                        <div className="register-form-input-group">
                            <div className="register-form-group">
                                <span className="leading-text">
                                    Name of organization:
                                </span>
                                <input type="text" maxLength="1000" className="form-control" id="organization" name="organization" 
                                    value={this.state.userDetails.organization || ""} onChange={this.onChangeDetails} />
                            </div>
                            <div className="register-form-group">
                                <span className="leading-text">
                                    Your job title:
                                </span>
                                <input type="text" maxLength="1000" className="form-control" id="jobTitle" name="jobTitle" 
                                    value={this.state.userDetails.jobTitle || ""} onChange={this.onChangeDetails} />
                            </div>
                        </div>
                        
                        <span className="leading-text"></span>
                        <button type="button" className="button" disabled={this.state.disabled} 
                            onClick={this.setDetails}>Change Details
                        </button>

                        <label className="infoLabel">{this.state.successLabel}</label>
                    </div>
                    


                    <div id="change_password_div" hidden={this.state.show !== "change_password"}>
                        <h2 className="padding-left">Change Password</h2>
                        <div className="profile-row">
                            <span className="leading-text" htmlFor="currentPassword">Enter your current password:</span>
                            <input type={this.state.currentChecked} id="currentPassword" className="form-control password-field" name="currentPassword" placeholder="Current Password *" 
                                onChange={this.onOldPasswordChange}/>
                            <label className="loginErrorLabel">{this.state.oldPasswordError}</label>
                            <div>
                                <span className="leading-text"></span>
                                <input type="checkbox" id="showCurrentPassword" 
                                    onClick={this.showCurrentPassword}></input>
                                <label className="inline noSelect">Show password</label>
                            </div>
                        </div>
                        <div className="profile-row">
                            <span className="leading-text" htmlFor="newPassword">Enter a new password:</span>
                            <input type={this.state.newChecked} id="newPassword" className="form-control password-field" name="newPassword" placeholder="New Password *" 
                                onChange={this.onNewPasswordChange}/>
                            <label className="loginErrorLabel">{this.state.newPasswordError}</label>

                            <div>
                                <span className="leading-text"></span>
                                <input type="checkbox" id="showNewPassword" onClick={this.showNewPassword}></input>
                                <label className="inline noSelect">Show password</label>
                            </div>
                        </div>
                        
                        <span className="leading-text"></span>
                        <button type="button" className="button" disabled={this.state.disabledPassword} 
                            onClick={this.changePassword}>Change Password</button>

                        <label className="infoLabel">{this.state.successLabelPassword}</label>
                    </div>
                </div>
            </div>
        );
    }
	

    render() {
        if(localStorage.role === undefined) {
            return (<div className="content">
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>Profile - NEPAccess</title>
                    <link rel="canonical" href="https://nepaccess.org/profile" />
                </Helmet>
                
                Please log in.
            </div>);
        }
        else if(this.state.ready) {
            return (
                <div className="container login-form">
                    <Helmet>
                        <meta charSet="utf-8" />
                        <title>Profile - NEPAccess</title>
                        <link rel="canonical" href="https://nepaccess.org/profile" />
                    </Helmet>

                    <h1 className="note">
                        User Details
                    </h1>

                    <div className="profile-flex-container">
                        {this.showLinks()}
                    </div>

                    <hr />

                    {this.showContent()}
                    
                </div>
            )
        } else {
            return (<div className="content">
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>Profile - NEPAccess</title>
                    <link rel="canonical" href="https://nepaccess.org/profile" />
                </Helmet>
                
                <div className="loader-holder">
                    <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
                </div>
            </div>);
        }
    }

	componentDidMount() {
		this.check();
        this.get("user/details/get_details", 'userDetails');
	}
}

export default UserDetails;