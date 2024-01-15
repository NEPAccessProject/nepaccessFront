import React from 'react';
import {Helmet} from 'react-helmet';
import IframeResizer from 'iframe-resizer-react';

export default class People extends React.Component {
    render() {
        return (
            <div className="iframe-container">
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>People - NEPAccess</title>
                    <meta name="description" content="Our interdisciplinary team based at the University of Arizona has the vision and expertise needed to harness data science to bring NEPA into the 21st century." data-react-helmet="true" />
                    <link rel="canonical" href="https://nepaccess.org/people" />
                </Helmet>

                <IframeResizer
                    // log
                    id="iframe-landing-container"
                    src="https://about.nepaccess.org/people/"
                    style={{ width: '1px', minWidth: '100%'}}
                />
            </div>
        );
    }
}