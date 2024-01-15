import React from 'react';

import Globals from '../globals.jsx';

import './login.css';

class Logout extends React.Component {
    render() {
        return (
            <div className="container login-form">
                <div className="form">
                    <div className="note">
                        Logout
                    </div>

                    <span hidden={!localStorage.role}>Logging out...</span>
                    <span id="logoutSpan" hidden={localStorage.role}>Successfully logged out.</span>
                </div>
            </div>
        )
    }

    componentDidMount() {
        Globals.signOut();
        setTimeout(() => {
            Globals.emitEvent('refresh', {
                loggedIn: false
            });
        }, 0);
    }
}



export default Logout;