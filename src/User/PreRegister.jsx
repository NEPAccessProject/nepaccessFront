import React from 'react';
import {Helmet} from 'react-helmet';
import Select from 'react-select';

import axios from 'axios';
import Globals from '../globals.jsx';

import './login.css';
import './register.css';

const _ = require('lodash');
const affiliations = [
    {value:"Federal government", label:"Federal government"}, 
    {value:"Tribal government", label:"Tribal government"}, 
    {value:"State/local government", label:"State/local government"}, 
    {value:"NEPA consultant/preparer", label:"NEPA consultant/preparer"}, 
    {value:"Private industry", label:"Private industry"}, 
    {value:"NGO", label:"NGO"}, 
    {value:"Lawyer", label:"Lawyer"}, 
    {value:"Academic research", label:"Academic research"}, 
    {value:"General public", label:"General public"}, 
    {value:"Other", label:"Other"}
];
// const recaptchaRef = React.createRef();

export default class PreRegister extends React.Component {

    constructor(props) {
        super(props);
		this.state = {
            username: '',
            password: '',
            email: '',
            disabled: false,
            passwordType: "password",
            termsAgreed: false,
            termsError: "*",

            usernameError: '*',
            emailError: '*',
            passwordError: '*',
            affiliationOtherError: '*',

            firstName: '',
            lastName: '',
            affiliation: '', // "Field/User Group/..."
            affiliationOther: '', 
            jobTitle: '', // optional
            organization: '', // optional

            statusLabel: '',
            statusClass: '',
            registered: false,
            busy: false,

            approver: false

            // captcha: ''
        };

        this.checkUsername = _.debounce(this.checkUsername, 300);
        this.checkEmail = _.debounce(this.checkEmail, 300);
        document.body.style.cursor = 'default';
    }

    checkApprover = () => {
        let checkUrl = new URL('user/checkApprover', Globals.currentHost);
        axios({
            url: checkUrl,
            method: 'POST'
        }).then(response => {
            console.log("Response", response);
            console.log("Status", response.status);
            let responseOK = response.data && response.status === 200;
            if (responseOK) {
                this.setState({
                    approver: true
                });
            } else {
                console.log("Else");
            }
        }).catch(error => {
            //
        })
    }

    // Validation
    invalidFields = () => {
        if(this.state.registered) {
            return true;
        }
        // Run everything and all appropriate errors will show at once.
        let test1 = this.checkEmail();
        let test2 = this.checkUsername();
        let test3 = this.invalidPassword();
        let test4 = this.invalidAffiliationOther();

        let _disabled = (test1 || test2 || test3 || test4);

        this.setState({ disabled: _disabled });
        
        return (_disabled);
    }
    invalidUsername = () => {
        let usernamePattern = /[a-zA-Z0-9]/;
        let invalid = !(usernamePattern.test(this.state.username));
        let message = "";
        if(invalid){
            message = "Cannot be empty, alphanumeric only.";
            message = "*";
        }
        this.setState({ usernameError: message });
        this.setState({ disabled: invalid });
        return invalid;
    }
    invalidEmail = () => {
        let emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let invalid = !(emailPattern.test(this.state.email));
        let message = "";
        if(invalid){
            message = "Please enter a valid email address.";
        }
        this.setState({ emailError: message });
        this.setState({ disabled: invalid });
        return invalid;
    }
    
    invalidAffiliationOther = () => {
        let usernamePattern = /[ -~]/;
        let invalid = this.state.affiliation==="Other" && !(usernamePattern.test(this.state.affiliationOther));
        let message = "";
        if(invalid){
            // message = "Required field when selecting \"Other\"";
            message = "*";
        }
        this.setState({ affiliationOtherError: message });
        this.setState({ disabled: invalid });
        return invalid;
    }
    invalidPassword = () => {
        let invalid = ( !Globals.validPassword(this.state.password) );
        let message = "";
        if(invalid){
            // message = "Must be at least 4 characters; must be printable characters.";
            message = "*";
        }
        this.setState({ passwordError: message });
        this.setState({ disabled: invalid });
        return invalid;
    }



    // Check if email is taken to prevent submission of duplicates
    checkEmail = () => {
        if(this.invalidEmail() || this.state.registered){
            this.setState({ disabled: true });
            return;
        } else {
            this.setState({ disabled: false });
        }

        let nameUrl = new URL('user/email-exists', Globals.currentHost);
        
        fetch(nameUrl, { 
            method: 'POST',
            body: this.state.email,
            headers:{
                'Content-Type': 'application/json; charset=utf-8'
            }
        }).then(response => {
            if(response.ok){ // 200
                return response.json();
            } else { // 403
                return null;
            }
        }).then(jsonResponse => {
            if(jsonResponse && jsonResponse === true){
                this.setState({ emailError: "Email found in system.  Please try another email." });
            } else if(jsonResponse === false) {
                this.setState({ emailError: "" });
            }
        }).catch(error => {
            this.setState({
                statusClass: 'errorLabel',
                statusLabel: 'Sorry, an error has occurred.  Server may currently be down.  Please try again later.'
            });
            console.error('Server probably down.', error);
        });
    }

    // Check if username is taken to prevent submission of duplicates
    checkUsername = () => {
        if(this.invalidUsername() || this.state.registered){
            this.setState({ disabled: true });
            return;
        } else {
            this.setState({ disabled: false });
        }

        let nameUrl = new URL('user/exists', Globals.currentHost);
        
        fetch(nameUrl, { 
            method: 'POST',
            body: this.state.username,
            headers:{
                'Content-Type': 'application/json; charset=utf-8'
            }
        }).then(response => {
            if(response.ok){ // 200
                return response.json();
            } else { // 403
                return null;
            }
        }).then(jsonResponse => {
            if(jsonResponse && jsonResponse === true){
                this.setState({ usernameError: "Username taken.  Please try another username." });
            } else if(jsonResponse === false) {
                this.setState({ usernameError: "" });
            }
        }).catch(error => {
            this.setState({
                statusClass: 'errorLabel',
                statusLabel: 'Sorry, an error has occurred.  Server may currently be down.  Please try again later.'
            });
            console.error('Server probably down.', error);
        });
    }

	onUsernameChange = (evt) => {
        this.setState({ [evt.target.name]: evt.target.value.trim() }, () => { this.checkUsername(); });
    }

	onPasswordChange = (evt) => {
        this.setState({ [evt.target.name]: evt.target.value }, () => { this.invalidPassword(); });
    }
    
	onEmailChange = (evt) => {
        this.setState({ [evt.target.name]: evt.target.value.trim() }, () => { this.checkEmail(); });
    }
    
    onAffiliationOtherChange = (evt) => {
        this.setState({ [evt.target.name]: evt.target.value }, () => { this.invalidAffiliationOther(); });
    }

    onChange = (evt) => {
        const name = evt.target.name;
        this.setState({
                [name]: evt.target.value
        });
    }

    onChangeHandler = (evt) => {
		// evt.target.name defined by name= in input
        const name = evt.target.name;
		this.setState( 
		{ 
            [name]: evt.target.value
        }, () => { 
            // validate (also disables register button if invalid)
            this.invalidFields(); // org selection/other org name handles itself from here

        });
    }

    // silence irrelevant warnings
    onChangeDummy = (evt) => {
        // do nothing
    }

    onSelectHandler = (val, act) => {
        // console.log("Val/act",val,act);
        if(!val || !act){
            return;
        }

        // if(act.action === ""){
        // }

        this.setState(
        { 
            affiliation: val.value
        }, () => {
            // this.invalidFields();
        });

    }

    // Register
    register = () => {
        if(this.invalidFields()){
            return;
        }
        document.body.style.cursor = 'wait';
        this.setState({ 
            disabled: true,
            busy: true,
            statusLabel: ''
         });
        
        let registerUrl = new URL('user/pre_register', Globals.currentHost);

        const dataForm = new FormData();

        let dataToPass = { 
            username: this.state.username, 
            password: this.state.password, 
            email: this.state.email,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            affiliation: this.state.affiliation,
            organization: this.state.organization,
            jobTitle: this.state.jobTitle
        };

        if(this.state.affiliation==="Other") {
            dataToPass.affiliation = this.state.affiliationOther;
        }
        
        dataForm.append('jsonUser', JSON.stringify(dataToPass));

        axios({ 
            method: 'POST',
            url: registerUrl,
            data: dataForm,
            headers:{
                'Content-Type': 'application/json; charset=utf-8'
            }
        }).then(response => {
            let responseOK = response && response.status === 200;
        
            if(responseOK){ // 200
                this.setState({
                    statusClass: 'successLabel',
                    statusLabel: 'Successfully registered.  An email will be sent to you with a verification link.  After clicking that, your account will still need to be approved before you can use the system.',
                    registered: true
                });
            } else { // 500 or 503, or server down
                this.setState({
                    statusClass: 'errorLabel',
                    statusLabel: 'Sorry, an error has occurred. Server responded with ' + response.status
                });
            }
        }).catch(error => {
            if(!error.response) {
                this.setState({
                    statusClass: 'errorLabel',
                    statusLabel: 'Server seems to be down, please try again in a few minutes.',
                    disabled: false, 
                    busy: false
                });
            } else if(error.response.status===418) {
                this.setState({
                    statusClass: 'errorLabel',
                    statusLabel: 'Sorry, that username is taken.',
                    disabled: false, 
                    busy: false
                });
            } else {
                this.setState({
                    statusClass: 'errorLabel',
                    statusLabel: 'Sorry, an error has occurred. Please try again later. Server responded with ' + error.response.status,
                    disabled: false, 
                    busy: false
                });
            }
        });

        this.setState({ disabled: false, busy: false });
        document.body.style.cursor = 'default';
    }

    generatePassword = () => {
        let _password = makeNewPassword();
        this.setState({
            password: _password,
            passwordType: "text"
        });
        
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
    
    render() {
        if(this.state.approver) {
            if(this.state.registered) {
                return (<div id="register-form">
                    <Helmet>
                        <title>NEPAccess</title>
                        <link rel="canonical" href="https://nepaccess.org/pre_register" />
                        <meta name="robots" content="noindex, nofollow" data-react-helmet="true" />
                    </Helmet>
                    <div className="register-form-input-group">
                        <div className="register-form-group">
                            <label className='successLabel large'>
                                Successfully added new user.
                            </label>
                        </div>

                        <div className="register-form-group">
                            <span className="leading-text">Email address:</span><span>{this.state.email}</span>
                        </div>
                        <div className="register-form-group">
                            <span className="leading-text">
                                Username:
                            </span>
                            <span>
                                {this.state.username}
                            </span>
                        </div>
                        <div className="register-form-group" 
                                hidden={this.state.passwordType === 'password'}>
                            <span className="leading-text">
                                Password:
                            </span>
                            <span>
                                {this.state.password}
                            </span>
                        </div>
                        <div className="register-form-group">
                            <span className="leading-text"></span>
                            <input type="checkbox" 
                                    id="showPassword" 
                                    onClick={this.showPassword}
                                    onChange={this.showPassword}
                                    checked={this.state.passwordType==="text"}>
                            </input>
                            <label className="inline noSelect">Show password</label>
                        </div>
                    </div></div>
                );
            } else {
                return (
                    <div id="register-form">
                        <Helmet>
                            <title>NEPAccess</title>
                            <link rel="canonical" href="https://nepaccess.org/pre_register" />
                            <meta name="robots" content="noindex, nofollow" data-react-helmet="true" />
                        </Helmet>
                        <div className="note">
                            Pre-register beta tester
                        </div>
                        <div className="loader-holder">
                            <div className="lds-ellipsis" hidden={!this.state.busy}><div></div><div></div><div></div><div></div></div>
                        </div>

                        <div className="form-content">
                            <div className="register-form-input-group">
                                <div className="register-form-group">
                                    <span className="leading-text"></span>
                                    <h3 className="padding-left">
                                        This form will add a user to the database pre-verified and pre-approved, but the system will not send any automated emails.  
                                    </h3>
                            </div></div>
                            <div className="register-form-input-group">
                                <div className="register-form-group">
                                    <span className="leading-text"></span>
                                    <h3 className="padding-left">
                                        Please remember the username/password/email for later use.
                                    </h3>
                            </div></div>
                            <div className="row">
                                
                                <div className="label-holder">
                                    <span className="leading-text"></span>
                                    <span className="errorLabel">* marks a required field</span>
                                </div>
                                <div className="register-form-input-group">
                                    <div className="register-form-group">
                                        <span className="leading-text">First name:</span><input type="text" maxLength="191"
                                            className="form-control" id="firstName" name="firstName" placeholder="" autoFocus onBlur={this.onChangeHandler}/>
                                    </div>
                                    <div className="register-form-group">
                                        <span className="leading-text">Last name:</span><input type="text" maxLength="191"
                                            className="form-control" id="lastName" name="lastName" placeholder="" onBlur={this.onChangeHandler}/>
                                    </div>
                                    <div className="register-form-group">
                                        <span className="leading-text">Email address:</span><input type="text" maxLength="191"
                                            className="form-control" id="email" name="email" placeholder="" onBlur={this.onEmailChange}/>
                                        <label hidden={this.state.registered} className="errorLabel">{this.state.emailError}</label>
                                    </div>
                                </div>
                                <div className="register-form-input-group">
                                    <div className="register-form-group">
                                        <span className="leading-text">User group:</span><Select
                                                id="register-select"
                                                className="inline-block"
                                                classNamePrefix="creatable"
                                                options={affiliations}
                                                name="affiliation" 
                                                placeholder="" 
                                                onChange={this.onSelectHandler}
                                        />
                                    </div>
                                    <div className="register-form-group"
                                            hidden={this.state.affiliation !== "Other"} >
                                        <span className="leading-text"></span>
                                        <input 
                                            disabled={this.state.affiliation !== "Other"} 
                                            type="text" maxLength="1000"
                                            className="form-control" id="affiliationOther" name="affiliationOther" 
                                            placeholder="If choosing &quot;other&quot; type it here" 
                                            onChange={this.onAffiliationOtherChange} />
                                        <label className="errorLabel">{this.state.affiliationOtherError}</label>
                                    </div>
                                </div>
                                
                                <div className="register-form-input-group">
                                    <div className="register-form-group">
                                        <span className="leading-text">
                                            Name of organization:
                                        </span>
                                        <input type="text" maxLength="1000" className="form-control" id="organization" name="organization" placeholder="" onChange={this.onChange} />
                                    </div>
                                    <div className="register-form-group">
                                        <span className="leading-text">
                                            Job title:
                                        </span>
                                        <input type="text" maxLength="1000" className="form-control" id="jobTitle" name="jobTitle" placeholder="" onChange={this.onChange} />
                                    </div>
                                    <div className="register-form-group">
                                        <span className="leading-text">
                                            Username:
                                        </span>
                                        <input type="text" maxLength="191" value={this.state.username}
                                            className="form-control" id="username" name="username" placeholder="" onChange={this.onUsernameChange}/>
                                        <label hidden={this.state.registered} className="errorLabel">{this.state.usernameError}</label>
                                    </div>
                                    <div className="register-form-group">
                                        <span className="leading-text">
                                            Password:
                                        </span>
                                        <input type={this.state.passwordType} maxLength="191" 
                                            id="password" 
                                            className="form-control password-field" 
                                            name="password" placeholder="" 
                                            onChange={this.onPasswordChange}
                                            onBlur={this.onPasswordChange} 
                                            value={this.state.password} />
                                            <button onClick={this.generatePassword}>Generate 8-character password</button>
                                        <label className="errorLabel">{this.state.passwordError}</label>
                                    </div>
                                    <div className="register-form-group">
                                        <span className="leading-text"></span>
                                        <input type="checkbox" 
                                            id="showPassword" 
                                            onClick={this.showPassword}
                                            onChange={this.showPassword}
                                            checked={this.state.passwordType==="text"}></input>
                                        <label className="inline noSelect">Show password</label>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="register-form-input-group">
                                <div className="register-form-group">
                                    <span className="leading-text"></span>
                                    <button type="button" className="button2 inline-block" id="register-submit" 
                                        onClick={this.register}>Register
                                    </button>
                                </div>
                                <label className={this.state.statusClass}>{this.state.statusLabel}</label>
                            </div>

                        </div>
                    </div>
                )
            }
        } else {
            return <div className="content">
                <Helmet>
                    <title>NEPAccess</title>
                    <link rel="canonical" href="https://nepaccess.org/pre_register" />
                    <meta name="robots" content="noindex, nofollow" data-react-helmet="true" />
                </Helmet>
                401
            </div>
        }
    }

    componentDidMount = () => {
        try {
            this.checkApprover();
        } catch(e) {
            console.error(e);
        }
    }
}

function makeNewPassword() {
    var length = 8,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        result = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        result += charset.charAt(Math.floor(Math.random() * n));
    }
    return result;
}