import React from 'react';
//import './iframes.css';

import IframeResizer from 'iframe-resizer-react';
import { withRouter } from 'react-router-dom';

const Publications = () => {

    return (
        <div style={{marginTop:-5, border: '2px solid red'}} className="content">
            <iframe
                src="https://about.nepaccess.org/publications"
                title="Footer"
                style={{ width: '1px', minWidth: '100%', height: '1200px', minHeight: '10vh' }}
            />
        </div>
    )
}

export default withRouter(Publications);