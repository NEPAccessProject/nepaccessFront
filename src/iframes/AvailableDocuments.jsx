import React from 'react';
import {Helmet} from 'react-helmet';
import IframeResizer from 'iframe-resizer-react';

export default class AvailableDocuments extends React.Component {
    render() {
        return (
            <div className="iframe-container">
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>NEPAccess - Available Files</title>
                    <meta name="description" content="NEPAccess is a work in progress. Our efforts to compile a complete set of environmental impact statements and other NEPA documents are ongoing." data-react-helmet="true" />
                    <link rel="canonical" href="https://nepaccess.org/available-documents" />
                </Helmet>

                <IframeResizer
                    // log
                    id="iframe-landing-container"
                    src="https://about.nepaccess.org/available-documents/"
                    style={{ width: '1px', minWidth: '100%'}}
                />
            </div>
        );
    }
}