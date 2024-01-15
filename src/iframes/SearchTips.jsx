import React from 'react';
import {Helmet} from 'react-helmet';
import IframeResizer from 'iframe-resizer-react';

export default class SearchTips extends React.Component {
    render() {
        return (
            <div className="iframe-container">
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>Search Tips - NEPAccess</title>
                    <meta name="description" content="To make an advanced search in NEPAccess.org, use these keyboard symbols to narrow or expand your search within the search box." data-react-helmet="true" />
                    <link rel="canonical" href="https://nepaccess.org/search-tips" />
                </Helmet>
                
                <IframeResizer
                    // log
                    id="iframe-landing-container"
                    src="https://about.nepaccess.org/search-tips/"
                    style={{ width: '1px', minWidth: '100%'}}
                />
            </div>
        );
    }
}