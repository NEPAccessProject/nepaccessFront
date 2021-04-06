import React from 'react';
import {Helmet} from 'react-helmet';

export default class AboutSearchTips extends React.Component {
    render() {
        return (
            <div className="iframe-container">
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>Search Tips - NEPAccess</title>
                    <link rel="canonical" href="https://nepaccess.org/search-tips" />
                </Helmet>
                <iframe src="https://about.nepaccess.org/search-tips/" title="Search Tips"
                    scrolling="yes" frameBorder="0" width="100%" height="100%" name="ContentCenter">
                        <p>
                            This should only display if your browser doesn't support iframes 
                            or if you have iframe support turned off.
                        </p>
                </iframe>
            </div>
        );
    }
}