import React from 'react';
import './iframes.css';

import IframeResizer from 'iframe-resizer-react';

export default class Iframes extends React.Component {

    render(){
        return (
            <div className="content">
                <IframeResizer 
                    src="https://about.nepaccess.org/about-nepa" 
                    title="Footer"
                    style={{ width: '1px', minWidth: '100%'}} 
                />
                <IframeResizer 
                    src="https://about.nepaccess.org/elementor-hf/footer/" 
                    title="Footer"
                    style={{ width: '1px', minWidth: '100%'}} 
                />
            </div>
        )
        
      }
      
}