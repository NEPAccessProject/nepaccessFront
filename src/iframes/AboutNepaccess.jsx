import React from 'react';
import {Helmet} from 'react-helmet';
import IframeResizer from 'iframe-resizer-react';

export default class AboutNepaccess extends React.Component {
    render() {
        return (
            <div className="iframe-container">
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>About NEPAccess</title>
                    <meta name="description" content="A new platform that uses AI and machine learning to search and analyze thousands of documents from the 1969 National Environmental Policy Act (NEPA)." data-react-helmet="true" />
                    
                    <link rel="canonical" href="https://nepaccess.org/about-nepaccess" />
                </Helmet>
                
                <IframeResizer
                    // log
                    id="iframe-landing-container"
                    src="https://about.nepaccess.org/about-nepaccess/"
                    style={{ width: '1px', minWidth: '100%'}}
                />
            </div>
        );
    }
}