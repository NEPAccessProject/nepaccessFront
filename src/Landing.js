import React from 'react';

import { Helmet } from 'react-helmet';

import './index.css';
import './landing.css';

import SearcherLanding from './search/SearcherLanding.js';
import './User/login.css';
import MediaQuery from 'react-responsive';
import IframeResizer from 'iframe-resizer-react';
import CalloutContainer from './CalloutContainer';
import globals from './globals';

class Landing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rawInput: '',
      render: 'landing',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleChange(inputId, inputValue) {
    console.log(`SearchLanding - Line 27 - HandleChanger() inputId: ${inputId} - inputValue: ${inputValue}`)
    this.setState({ [inputId]: inputValue });
  }

  handleClick(id, val) {
    console.log(`Searcher Landing - Line 32 - handleClick id: ${id}, val: ${val}`)
    this.setState({ [id]: val }, () => {
      this.props.history.push('search?q=' + this.state.rawInput);
    });
  }

  render() {
    return (
      <div id="landing">
        <Helmet>
          <meta charSet="utf-8" />
          <title>NEPAccess: Bringing NEPA into the 21st Century</title>
          <meta
            name="description"
            content="Search, download, and learn from environmental impact statements and other NEPA documents created under the National Environmental Policy Act of 1969."
            data-react-helmet="true"
          />
          <link
            rel="canonical"
            href="https://nepaccess.org/"
          />
        </Helmet>

        <MediaQuery minWidth={globals.mobileBreakPointWidth}>
          <div id="landing-images">
            <div
              id="headline"
              className="no-select cursor-default"
            >
              Width: {window.innerHeight} - Height: {window.innerWidth}
              <div id="landing-headline-container">
                <h1 id="landing-headline-left">
                  <span className="glow">
                    Fulfilling NEPA’s Promise Through the Power of Data Science
                  </span>
                </h1>
                <h2 id="landing-headline-right">
                  <span className="glow">
                    Help grow our community of knowledge and put our information infrastructure to
                    work for you.
                  </span>
                </h2>
              </div>
            </div>

            <SearcherLanding
              id="rawInput"
              onChange={this.handleChange}
              onClick={this.handleClick}
              value={this.state.rawInput}
            />
          </div>
        </MediaQuery>
        <MediaQuery maxWidth={globals.mobileBreakPointWidth}>
          <SearcherLanding
            id="rawInput"
            onChange={this.handleChange}
            onClick={this.handleClick}
            value={this.state.rawInput}
          />
        </MediaQuery>
        <IframeResizer
          data-nosnippet
          checkOrigin={false}
          id="iframe-landing-container"
          src="https://about.nepaccess.org/"
          style={{ width: '1px', minWidth: '100%' }}
        />
      </div>
    );
  }
}

export default Landing;