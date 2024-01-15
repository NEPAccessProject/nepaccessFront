import React from 'react';
import {Helmet} from 'react-helmet';
import IframeResizer from 'iframe-resizer-react';

export default class DisclaimerTermsOfUse extends React.Component {
    render() {
        return (
            <div className="iframe-container">
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>NEPAccess - Disclaimer/Terms of Use</title>
                    <link rel="canonical" href="https://nepaccess.org/disclaimer-terms-of-use" />
                </Helmet>

                <IframeResizer
                    // log
                    id="iframe-landing-container"
                    src="https://about.nepaccess.org/disclaimer-terms-of-use/"
                    style={{ width: '1px', minWidth: '100%'}}
                />
            </div>
        );
    }
}