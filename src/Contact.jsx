import React from 'react';
import {Helmet} from 'react-helmet';
// import Select from 'react-select';
import Creatable from 'react-select/creatable';

import Footer from './Footer.jsx';

import axios from 'axios';
import globals from './globals.jsx';

import ReCAPTCHA from "react-google-recaptcha";

import './contact.css';

const subjects = [
    {value:"Problem using the website", label:"Problem using the website"}, 
    {value:"Question about NEPAccess", label:"Question about NEPAccess"}, 
    {value:"Feedback on website", label:"Feedback on website"}
];
const recaptchaRef = React.createRef();

export default class Contact extends React.Component {

    constructor(props) {
        super(props);
		this.state = {
            name: '',
            email: '',
            subject: '',
            message: '', 

            disabled: false,
            sent: false,
            busy: false,

            nameError: '*',
            emailError: '*',
            subjectError: '*',
            messageError: '*',

            statusLabel: '',
            statusClass: '',
        };

        document.body.style.cursor = 'default';
    }

    
    captchaChange = (value) => {
        // console.log("Captcha value:", value);
    }
    log = (value) => {
        console.log("Log", value);
    }
    

    /** Axios call to fill fields with full name and email address */
    getUserFields = () => {

        if(this.state.name.length > 0) {
            return;
        }

        document.body.style.cursor = 'wait';
        
        let _url = new URL('user/getFields', globals.currentHost);

        axios({ 
            method: 'GET',
            url: _url,
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        }).then(response => {
            // console.log(response);

            let responseOK = response && response.status === 200;
            if(responseOK) {
                if(response.data.name==="null null") { // Account created pre-beta, no name
                    response.data.name="";
                }
                this.setState({
                    name: response.data.name,
                    email: response.data.email,
                }, () => {
                    this.invalidFields();
                });
            }
        }).catch(error => {
            console.error(error);
        });
        
        document.body.style.cursor = 'default';
    }



    // Validation
    invalidFields = () => {
        // Run everything and all appropriate errors will show at once.
        let test1 = this.invalidEmail();
        let test2 = this.invalidName();
        let test3 = this.invalidSubject();
        let test4 = this.invalidMessage();

        // this.setState({ disabled: test1 || test2 || test3 || test4 });
        
        return ( test1 || test2 || test3 || test4 );
    }

    invalidName = () => {
        let usernamePattern = /[a-zA-Z\s]/;
        let invalid = !(usernamePattern.test(this.state.name.trim()));
        let message = "";
        if(invalid){
            message = "Cannot be empty.";
            message = "*";
        }
        this.setState({ 
            nameError: message, 
            // disabled: invalid 
        });
        return invalid;
    }
    invalidSubject = () => {
        let usernamePattern = /[a-zA-Z\s]/;
        let invalid = !(usernamePattern.test(this.state.subject.trim()));
        let message = "";
        if(invalid){
            message = "Cannot be empty.";
            message = "*";
        }
        this.setState({ 
            subjectError: message, 
            // disabled: invalid 
        });
        return invalid;
    }
    invalidMessage = () => {
        let usernamePattern = /[a-zA-Z\s]/;
        let invalid = !(usernamePattern.test(this.state.message.trim()));
        let message = "";
        if(invalid){
            message = "Cannot be empty.";
            message = "*";
        }

        this.setState({ 
            messageError: message,
            // disabled: invalid
         });
         
        return invalid;
    }
    invalidEmail(){
        let emailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let invalid = !(emailPattern.test(this.state.email));
        let message = "";
        if(invalid){
            message = "Please enter your email address.";
            message = "*";
        }
        this.setState({ emailError: message });
        return invalid;
    }

	onNameChange = (evt) => {
        this.setState({ [evt.target.name]: evt.target.value }, () => { this.invalidName(); });
    }
	onEmailChange = (evt) => {
        this.setState({ [evt.target.name]: evt.target.value }, () => { this.invalidEmail(); });
    }
    onChangeHandler = (evt) => {
		// evt.target.name defined by name= in input
        const name = evt.target.name;
		this.setState( 
		{ 
            [name]: evt.target.value,
        }, () => { 
            // validate (also disables button if invalid)
            
            switch (name) {
                case 'message':
                    this.invalidMessage();
                    break;
                default:
                    //
            }

        });
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
            subject: val.value
        }, () => {
            this.invalidSubject();
            // console.log("Subject", this.state.subject);
        });

    }
    onChange = (evt) => {
        this.setState({ [evt.target.name]: evt.target.value });
    }
    onChangeDummy = () => {
        // do nothing: can't change
    }

     


    /** Axios call to contact */
    contact = () => {
        if(this.invalidFields()){
            return;
        }
        document.body.style.cursor = 'wait';
        this.setState({ 
            disabled: true,
            busy: true,
            statusLabel: ''
         });
        
        let _url = new URL('user/contact', globals.currentHost);

        const recaptchaValue = recaptchaRef.current.getValue();
        const dataForm = new FormData();

        dataForm.append('recaptchaToken', recaptchaValue);

        let _data = { 
            name: this.state.name, 
            email: this.state.email,
            subject: this.state.subject,
            body: this.state.message
        };

        dataForm.append('contactData', JSON.stringify(_data));

        axios({ 
            method: 'POST',
            url: _url,
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
                    statusLabel: 'Email sent.',
                    sent: true
                });
            } else { // 500 or 503, or server down
                this.setState({
                    statusClass: 'errorLabel',
                    statusLabel: 'Sorry, an error has occurred. Server responded with ' + response.status,
                    disabled: false, 
                    busy: false
                });
            }
        }).catch(error => {
            if (error.response && error.response.status===424) {
                this.setState({
                    statusClass: 'errorLabel',
                    statusLabel: 'Sorry, an error has occurred with the captcha.',
                    disabled: false, 
                    busy: false
                }); 
            }
            else 
            {
                this.setState({
                    statusClass: 'errorLabel',
                    statusLabel: 'Sorry, an error has occurred.  Server may currently be down.  Please try again later.',
                    disabled: false, 
                    busy: false
                });
                console.error(error);
            }
        });

        document.body.style.cursor = 'default';
    }
    
    render() {
        if(this.state.sent) {
            return (
                <div id="contact-form">
                    <Helmet>
                        <meta charSet="utf-8" />
                        <title>Contact - NEPAccess</title>
                        <meta name="description" content="Contact us if you have a problem searching our database, or have a question or feedback. The University of Arizona, Udall Center for Studies in Public Policy." data-react-helmet="true" />
                        <link rel="canonical" href="https://www.nepaccess.org/contact" />
                    </Helmet>
                    <div className="note">
                        Contact Us
                    </div>
                    
                    <label className='successLabel large'>
                        Successfully submitted.
                    </label>
                </div>
            )
        } else {
            return (
                <div id="contact-form">
                    <Helmet>
                        <meta charSet="utf-8" />
                        <title>Contact - NEPAccess</title>
                        <meta name="description" content="Contact us if you have a problem searching our database, or have a question or feedback. The University of Arizona, Udall Center for Studies in Public Policy." data-react-helmet="true" />
                        <link rel="canonical" href="https://www.nepaccess.org/contact" />
                    </Helmet>
                    <div className="note">
                        Contact Us
                    </div>
                    <div className="loader-holder">
                        <div className="lds-ellipsis" hidden={!this.state.busy}><div></div><div></div><div></div><div></div></div>
                    </div>

                    <div id="contact-form-content">
                        <div id="contact-form-left">

                            <div className="form-input-group">
                                <div className="form-group">
                                    <span className="leading-text">Your full name:</span>
                                    <input type="text" maxLength="191"
                                        className="form-control" id="name" name="name" 
                                        // placeholder="" 
                                        value={this.state.name}
                                        onBlur={this.onNameChange}
                                        onChange={this.onChange}
                                    />
                                    <label className="errorLabel inline-block">{this.state.nameError}</label>
                                </div>
                                <div className="form-group">
                                    <span className="leading-text">Your email address:</span>
                                    <input type="text" maxLength="191"
                                        className="form-control" 
                                        id="email" 
                                        name="email" 
                                        // placeholder="" 
                                        value={this.state.email}
                                        onBlur={this.onEmailChange}
                                        onChange={this.onChange}
                                    />
                                    <label className="errorLabel inline-block">{this.state.emailError}</label>
                                </div>
                                <div className="form-group">
                                    <span className="leading-text">Subject:</span>
                                    <Creatable 
                                        className="inline-block"
                                        classNamePrefix="creatable"
                                        options={subjects}
                                        name="subject" 
                                        placeholder="Please type or choose a topic" 
                                        onChange={this.onSelectHandler}
                                        onBlur={this.invalidSubject}
                                    />
                                    <label className="errorLabel inline-block">{this.state.subjectError}</label>
                                </div>
                            </div>
                            <div className="form-input-group">
                                <div className="form-group">
                                    <span className="leading-text">Message:</span>
                                    <textarea 
                                        className="form-control" 
                                        id="contact-message" 
                                        name="message" 
                                        placeholder="" 
                                        onBlur={this.onChangeHandler}
                                    />
                                    <label className="errorLabel inline-block">{this.state.messageError}</label>
                                </div>
                            </div>
                            <span className="leading-text"></span>
                            <ReCAPTCHA
                                id="contact-captcha"
                                className="captcha inline-block"
                                ref={recaptchaRef}
                                sitekey="6LdLG5AaAAAAADg1ve-icSHsCLdw2oXYPidSiJWq"
                                onChange={this.captchaChange}
                                onErrored={this.log}
                            />

                            <div className="form-input-group">
                                <div className="form-group">
                                    <span className="leading-text"></span>
                                    <button type="button" className="button2 inline-block" id="contact-submit" 
                                            disabled={this.state.disabled} 
                                            onClick={this.contact}>
                                        Submit
                                    </button>
                                </div>
                                <label className={this.state.statusClass}>{this.state.statusLabel}</label>
                            </div>
                        </div>

                        <div id="contact-address">
                            <span>NEPAccess.org</span>
                            <span>University of Arizona</span>
                            <span>Udall Center for Studies in Public Policy</span>
                            <span>803 E. First St.</span>
                            <span>Tucson, Arizona 85719</span>
                            <span>USA</span>
                        </div>
                        

                    </div>
                    <Footer id="footer"></Footer>
                </div>
            )
        }
    }

    componentDidMount() {
        this.getUserFields();
    }
}