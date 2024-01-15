import React from 'react';
import {Helmet} from 'react-helmet';
import IframeResizer from 'iframe-resizer-react';
import './iframes.css';

export default class PrivacyPolicy extends React.Component {
    render() {
        return (
            <div className="iframe-container">
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>About NEPA - NEPAccess</title>
                    <link rel="canonical" href="https://nepaccess.org/privacy-policy" />
                </Helmet>

                <IframeResizer
                    // log
                    id="iframe-landing-container"
                    src="https://about.nepaccess.org/privacy-policy/"
                    style={{ width: '1px', minWidth: '100%'}}
                />
            </div>
        );
    }
}