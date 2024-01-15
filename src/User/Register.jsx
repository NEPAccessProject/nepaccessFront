import React from 'react';
import {Helmet} from 'react-helmet';
import Select from 'react-select';

import Footer from '../Footer.jsx';

import axios from 'axios';
import globals from '../globals.jsx';

import ReCAPTCHA from 'react-google-recaptcha';

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
const recaptchaRef = React.createRef();
//<link href="//maxcdn.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css" rel="stylesheet" id="bootstrap-css">

class Register extends React.Component {

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
            firstNameError: '*',
            lastNameError: '*',
            affiliationError: '*',
            affiliationOtherError: '*',

            firstName: '',
            lastName: '',
            affiliation: '', // "Field"
            affiliationOther: '', 
            jobTitle: '', // optional
            organization: '', // optional

            statusLabel: '',
            statusClass: '',
            registered: false,
            busy: false

            // captcha: ''
        };

        this.checkUsername = _.debounce(this.checkUsername, 300);
        this.checkEmail = _.debounce(this.checkEmail, 300);
        document.body.style.cursor = 'default';
    }
    

    captchaChange = (value) => {
        // console.log("Captcha value:", value);
        // this.setState({
        //     captcha: value
        // });
    }
    log = (value) => {
        // console.log("Log", value);
    }

    termsChanged = (evt) => {
        // console.log("Target",evt.target);
        this.setState({ 
            termsAgreed: evt.target.checked 
        }, () => {
            this.termsInvalid();
        });
    }

    termsInvalid = () => {
        if(!this.state.termsAgreed) {
            this.setState({
                termsError: "*"
            });
        } else {
            this.setState({
                termsError: ""
            });
        }
        
        return !this.state.termsAgreed;
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
        let test4 = this.invalidFirst();
        let test5 = this.invalidLast();
        let test6 = this.invalidAffiliation();
        let test7 = this.invalidAffiliationOther();
        let test8 = this.termsInvalid();

        this.setState({ disabled: test1 || test2 || test3 || test4 || test5 || test6 || test7 || test8 });
        
        return (test1 || test2 || test3 || test4 || test5 || test6 || test7 || test8);
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
    invalidFirst = () => {
        let usernamePattern = /[a-zA-Z\s]/;
        let invalid = !(usernamePattern.test(this.state.firstName.trim()));
        let message = "";
        if(invalid){
            message = "Cannot be empty, alphabetical characters only.";
            message = "*";
        }
        this.setState({ firstNameError: message });
        this.setState({ disabled: invalid });
        return invalid;
    }
    invalidLast = () => {
        let usernamePattern = /[a-zA-Z\s]/;
        let invalid = !(usernamePattern.test(this.state.lastName.trim()));
        let message = "";
        if(invalid){
            message = "Cannot be empty, alphabetical characters only.";
            message = "*";
        }
        this.setState({ lastNameError: message });
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
    invalidAffiliation = () => {
        let usernamePattern = /[ -~]/;
        let invalid = !(usernamePattern.test(this.state.affiliation));
        let message = "";
        if(invalid){
            message = "Please select a field.  If other, select \"Other\" and then type field below.";
            message = "*";
        }
        this.setState({ affiliationError: message });
        this.setState({ disabled: invalid });
        return invalid;
    }
    
    invalidAffiliationOther = () => {
        let usernamePattern = /[ -~]/;
        let invalid = this.state.affiliation==="Other" && !(usernamePattern.test(this.state.affiliationOther));
        let message = "";
        if(invalid){
            message = "Required field when selecting \"Other\"";
            message = "*";
        }
        this.setState({ affiliationOtherError: message });
        this.setState({ disabled: invalid });
        return invalid;
    }
    invalidPassword = () => {
        let invalid = !( globals.validPassword(this.state.password) );
        let message = "";
        if(invalid){
            message = "Must be at least 4 characters, must be printable characters.";
            message = "*";
        }
        this.setState({ passwordError: message });
        this.setState({ disabled: invalid });
        return invalid;
    }



    // Check if email is taken to prevent submission of duplicates
    checkEmail = () => {
        if(this.state.registered) {
            this.setState({ disabled: true, emailError: '', usernameError: '' });
        }
        else if(this.invalidEmail()){
            this.setState({ disabled: true });
            return;
        } else {
            this.setState({ disabled: false });
        }

        let nameUrl = new URL('user/email-exists', globals.currentHost);
        
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
                this.setState({ emailError: "Email already claimed.  Please try another email." });
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
        if(this.state.registered) {
            this.setState({ disabled: true, emailError: '', usernameError: '' });
        }
        else if(this.invalidUsername()){
            this.setState({ disabled: true });
            return;
        } else {
            this.setState({ disabled: false });
        }

        let nameUrl = new URL('user/exists', globals.currentHost);
        
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
        this.setState({ [evt.target.name]: evt.target.value }, () => { this.checkUsername(); });
    }

	onPasswordChange = (evt) => {
        this.setState({ [evt.target.name]: evt.target.value }, () => { this.invalidPassword(); });
    }
    
	onEmailChange = (evt) => {
        this.setState({ [evt.target.name]: evt.target.value }, () => { this.checkEmail(); });
    }

    onAffiliationOtherChange = (evt) => {
        this.setState({ [evt.target.name]: evt.target.value }, () => { this.invalidAffiliationOther(); });
    }

    onChangeHandler = (evt) => {
		// evt.target.name defined by name= in input
        const name = evt.target.name;
		this.setState( 
		{ 
            [name]: evt.target.value,
        }, () => { 
            // validate (also disables register button if invalid)
            
            switch (name) {
                case 'affiliation':
                    this.invalidAffiliation();
                    break;
                case 'firstName':
                    this.invalidFirst();
                    break;
                case 'lastName':
                    this.invalidLast();
                    break;
                default:
                    this.invalidFields(); // org selection/other org name handles itself from here
            }

        });
    }

    onChange = (evt) => {
        const name = evt.target.name;
        this.setState({
                [name]: evt.target.value
        });
    }

    // silence irrelevant warnings
    onChangeDummy = (evt) => {
        // do nothing
    }

    onSelectHandler = (val, act) => {
        // console.log("Val/act",val,act);
        if(!val || !act){
            this.invalidAffiliation();
            return;
        }

        // if(act.action === ""){
        // }

        this.setState(
        { 
            affiliation: val.value
        }, () => {
            // this.invalidFields();
            this.invalidAffiliation();
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
        
        let registerUrl = new URL('user/register', globals.currentHost);

        const recaptchaValue = recaptchaRef.current.getValue();
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
        dataForm.append('recaptchaToken', recaptchaValue);

        axios({ 
            method: 'POST',
            url: registerUrl,
            data: dataForm,
            headers:{
                'Content-Type': 'application/json; charset=utf-8'
            }
        }).then(response => {
            let responseOK = response && response.status === 200;
            console.log(response.status);
        
            if(responseOK){ // 200
                this.setState({
                    statusClass: 'successLabel',
                    statusLabel: 'Successfully registered.  An email will be sent to you with a verification link.  After clicking that link, you can use the system.',
                    registered: true,
                    usernameError: '',
                    emailError: '',
                });
            } else { // 500 or 503, or server down
                this.setState({
                    statusClass: 'errorLabel',
                    statusLabel: 'Sorry, an error has occurred. Server responded with ' + response.status
                });
            }
        }).catch(error => {
            let _statusLabel = 'Sorry, an error has occurred.  Please try again later.';
            if(!error.response) {
                _statusLabel = 'Sorry, the server may currently be down.  Please try again later.';
            } else if(error.response.status===418) {
                _statusLabel = 'Sorry, that username is taken.';
            } else if (error.response.status===424) {
                _statusLabel = 'Sorry, an error has occurred with the captcha.';
            }
            this.setState({
                statusClass: 'errorLabel',
                statusLabel: _statusLabel,
                disabled: false, 
                busy: false
            });
            console.error(error);
        });

        this.setState({ disabled: false, busy: false });
        document.body.style.cursor = 'default';
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
        if(this.state.registered) {
            return (<div id="register-form">
                <div className="register-form-input-group">
                    <div className="register-form-group">
                        <label className='successLabel large'>
                            Successfully registered.  An email will be sent to you with a verification link.  After clicking that link, you can use the system.
                        </label>
                    </div>
                </div></div>
            );
        } else {
            return (
                <div id="register-form">
                    <Helmet>
                        <meta charSet="utf-8" />
                        <title>Register - NEPAccess</title>
                        <link rel="canonical" href="https://nepaccess.org/register" />
                    </Helmet>
                    <div className="note">
                        Register
                    </div>
                    <div className="loader-holder">
                        <div className="lds-ellipsis" hidden={!this.state.busy}><div></div><div></div><div></div><div></div></div>
                    </div>

                    <div className="form-content">
                        <div className="row">
                            
                        <div className="label-holder">
                            <span className="leading-text"></span>
                            <span className="errorLabel">* marks a required field</span>
                        </div>
                            <div className="register-form-input-group">
                                <div className="register-form-group">
                                    <span className="leading-text">Your first name:</span><input type="text" maxLength="191"
                                        className="form-control" id="firstName" name="firstName" placeholder="" autoFocus onBlur={this.onChangeHandler}/>
                                    <label className="errorLabel">{this.state.firstNameError}</label>
                                </div>
                                <div className="register-form-group">
                                    <span className="leading-text">Your last name:</span><input type="text" maxLength="191"
                                        className="form-control" id="lastName" name="lastName" placeholder="" onBlur={this.onChangeHandler}/>
                                    <label className="errorLabel">{this.state.lastNameError}</label>
                                </div>
                                <div className="register-form-group">
                                    <span className="leading-text">Your email address:</span><input type="text" maxLength="191"
                                        className="form-control" id="email" name="email" placeholder="" onBlur={this.onEmailChange}/>
                                    <label hidden={this.state.registered} className="errorLabel">{this.state.emailError}</label>
                                </div>
                            </div>
                            <div className="register-form-input-group">
                                <div className="register-form-group">
                                    <span className="leading-text">Your user group:</span><Select
                                            id="register-select"
                                            className="inline-block"
                                            classNamePrefix="creatable"
                                            options={affiliations}
                                            name="affiliation" 
                                            placeholder="" 
                                            onChange={this.onSelectHandler}
                                            onBlur={this.onSelectHandler}
                                    />
                                    <label className="errorLabel">{this.state.affiliationError}</label>
                                </div>
                                <div className="register-form-group"
                                        hidden={this.state.affiliation !== "Other"} >
                                    <span className="leading-text"></span>
                                    <input 
                                        disabled={this.state.affiliation !== "Other"} 
                                        type="text" maxLength="1000"
                                        className="form-control" id="affiliationOther" name="affiliationOther" 
                                        placeholder="If choosing &quot;other&quot; type it here" 
                                        onChange={this.onAffiliationOtherChange}
                                        onBlur={this.invalidAffiliationOther} />
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
                                        Your job title:
                                    </span>
                                    <input type="text" maxLength="1000" className="form-control" id="jobTitle" name="jobTitle" placeholder="" onChange={this.onChange} />
                                </div>
                                <div className="register-form-group">
                                    <span className="leading-text">
                                        Preferred username:
                                    </span>
                                    <input type="text" maxLength="191"
                                        className="form-control" id="username" name="username" placeholder="" onBlur={this.onUsernameChange}/>
                                    <label hidden={this.state.registered} className="errorLabel">{this.state.usernameError}</label>
                                </div>
                                <div className="register-form-group">
                                    <span className="leading-text">
                                        Password:
                                    </span>
                                    <input type={this.state.passwordType} maxLength="191" 
                                        id="password" className="form-control password-field" name="password" placeholder="" onBlur={this.onPasswordChange} />
                                    <label className="errorLabel">{this.state.passwordError}</label>
                                </div>
                                <div className="register-form-group">
                                    <span className="leading-text"></span>
                                    <input type="checkbox" id="showPassword" onClick={this.showPassword}></input>
                                    <label className="inline noSelect">Show password</label>
                                </div>
                            </div>
                        </div>

                        <div className="register-form-input-group"><div className="register-form-group">
                            <span className="leading-text"></span>
                            <input type="checkbox" 
                                name="terms" 
                                checked={this.state.termsAgreed}
                                onClick={this.termsChanged}
                                onChange={this.onChangeDummy}>
                            </input>
                            <span>I have read and agreed to the&nbsp;
                                <a href="https://about.nepaccess.org/privacy-policy/#terms-of-use" target="_blank" rel="noreferrer">
                                    Terms of Use
                                </a>
                            </span>
                            <label className="errorLabel">{this.state.termsError}</label>
                        </div></div>
                        
                        <div className="register-form-input-group">
                            <div className="register-form-group">
                                <span className="leading-text"></span>
                                <ReCAPTCHA
                                    className="captcha inline-block"
                                    ref={recaptchaRef}
                                    sitekey="6LdLG5AaAAAAADg1ve-icSHsCLdw2oXYPidSiJWq"
                                    onChange={this.captchaChange}
                                    onErrored={this.log}
                                />
                            </div>
                        </div>
                        <div className="register-form-input-group">
                            <div className="register-form-group">
                                <span className="leading-text"></span>
                                <button type="button" className="button2 inline-block" id="register-submit" 
                                // disabled={this.state.disabled} 
                                onClick={this.register}>Register</button>
                            </div>
                            <label className={this.state.statusClass}>{this.state.statusLabel}</label>
                        </div>

                    </div>
                    <Footer id="footer"></Footer>
                </div>
            )
        }
    }
}

export default Register;