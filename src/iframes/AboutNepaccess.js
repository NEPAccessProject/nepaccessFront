import React from 'react';

export default class AboutNepaccess extends React.Component {
    render() {
        return (
            <div className="iframe-container">
                <iframe src="https://about.nepaccess.org/about-nepaccess/" title="About Nepaccess"
                    scrolling="yes" frameborder="0" width="100%" height="100%" name="ContentCenter">
                        <p>
                            This should only display if your browser doesn't support iframes 
                            or if you have iframe support turned off.
                        </p>
                </iframe>
            </div>
        );
    }
}