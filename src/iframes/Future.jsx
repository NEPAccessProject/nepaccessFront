import React from 'react';
import {Helmet} from 'react-helmet';
import IframeResizer from 'iframe-resizer-react';

export default class Future extends React.Component {
    render() {
        return (
            <div className="iframe-container">
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>Future - NEPAccess</title>
                    <link rel="canonical" href="https://nepaccess.org/future" />
                </Helmet>

                <IframeResizer
                    // log
                    id="iframe-landing-container"
                    src="https://about.nepaccess.org/future/"
                    style={{ width: '1px', minWidth: '100%'}}
                />
            </div>
        );
    }
}