import React from 'react';
import {Helmet} from 'react-helmet';

import axios from 'axios';

import Globals from '../globals.jsx';

import './login.css';

export default class Verify extends React.Component {

    constructor(props) {
        super(props);
		this.state = {
            successLabel: ''
        };
    }

    verify = (verifyToken) => { // check if JWT is expired/invalid
		let verified = false;

        let checkURL = new URL('user/verify', Globals.currentHost);
        
        axios({
            method: 'POST', // or 'PUT'
            headers: {Authorization: verifyToken},
            url: checkURL
        }).then(response => {
            verified = response && response.status === 200;
            console.log(response);

            if(verified) {
                this.setState({
                    successLabel: 'Email has been verified.  You can now login and begin using the system.'
                });
            } else if(response && response.status === 208) {
                this.setState({
                    successLabel: 'This email address has already been verified.'
                });
            } else {
                this.setState({
                    successLabel: 'Sorry, we were unable to verify this email address.'
                });
            }
        }).catch(error => { // invalid JWT?
            // If the JWT is invalid (i.e. incomplete, expired or wrong) the backend will return a 403 trying to parse it
            // and throws a com.auth0.jwt.exceptions.JWTDecodeException: the incoming string doesn't have a valid JSON format.
            console.error(error);
            this.setState({
                successLabel: 'Sorry, our system was unable to verify this email address. Please copy the entire verification link and try again.'
            });
        });
    }

    
    
    render() {
        return (
            <div className="content">
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>Verify Email - NEPAccess</title>
                    <link rel="canonical" href="https://nepaccess.org/verify" />
                </Helmet>
                <div className="note">
                    Verify email address
                </div>
                <div id="verifyEmailContent">
                    <label className="infoLabel">{this.state.successLabel}</label>
                </div>
            </div>
        )
    }

	componentDidMount() {
        const query = new URLSearchParams(this.props.location.search);
        if(query && query.get('token')){ // If there's a reset token provided, set JWT and check it
            const verifyToken = (`Bearer ${query.get('token')}`); // .../verify?token={resetToken}
            this.verify(verifyToken);
        }
	}
}