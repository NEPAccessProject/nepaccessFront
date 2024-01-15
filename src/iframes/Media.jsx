import React from 'react';
import {Helmet} from 'react-helmet';
import IframeResizer from 'iframe-resizer-react';
import './media.css';

export default class Media extends React.Component {
    render() {
        return (
            <div className="iframe-container">
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>Videos - NEPAccess</title>
                    <meta name="description" content="These programs explain why we made NEPAccess.org, some of the challenges of the process, and perspectives of students working with the NEPAccess team." data-react-helmet="true" />
                    <link rel="canonical" href="https://nepaccess.org/media" />
                </Helmet>

                <IframeResizer
                    // log
                    id="iframe-landing-container"
                    src="https://about.nepaccess.org/media/"
                    style={{ width: '1px', minWidth: '100%'}}
                />
            </div>
        );
    }
}