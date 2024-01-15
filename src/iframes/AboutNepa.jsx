import React from 'react';
import {Helmet} from 'react-helmet';

import IframeResizer from 'iframe-resizer-react';
import './iframes.css';

export default class AboutNepa extends React.Component {
    render() {
        return (
            <div className="iframe-container">
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>About NEPA - NEPAccess</title>
                    <meta name="description" content="The National Environmental Policy Act (NEPA) of 1969 created a new approach that brought science and the public into federal environmental decision-making." data-react-helmet="true" />
                    <link rel="canonical" href="https://nepaccess.org/about-nepa" />
                </Helmet>
                

                <IframeResizer
                    // log
                    id="iframe-landing-container"
                    src="https://about.nepaccess.org/about-nepa/"
                    style={{ width: '1px', minWidth: '100%'}}
                />
            </div>
        );
    }
}