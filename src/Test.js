import React from 'react';
import {Helmet} from "react-helmet";
import IframeResizer from 'iframe-resizer-react';

import Slides from './Tutorial/SlidesIframe.js';

// import ReCAPTCHA from "react-google-recaptcha";

// import FlipNumbers from 'react-flip-numbers';

// import axios from 'axios';

// import Globals from './globals.js';

// const recaptchaRef = React.createRef();

export default class Test extends React.Component {

    constructor(props) {
        super(props);
		this.state = {
            // captcha: '',
            // approver: false,
            // total: 12345,
            // num: 0
        };

        // let checkUrl = new URL('user/checkApprover', Globals.currentHost);
        // axios({
        //     url: checkUrl,
        //     method: 'POST'
        // }).then(response => {
        //     let responseOK = response && response.status === 200;
        //     if (responseOK) { 
        //         this.setState({approver: true});
        //     }
        // }).catch(error => { // redirect
        //     this.props.history.push('/');
        // })

    }
    
    // captchaValid = () => {
    //     let valid = false;

    //     const recaptchaValue = recaptchaRef.current.getValue();
    //     const recaptchaUrl = new URL('user/recaptcha_test', Globals.currentHost);
    //     const dataForm = new FormData();
    //     dataForm.append('recaptcha', recaptchaValue);

    //     axios({
    //         url: recaptchaUrl,
    //         method: 'POST',
    //         data: dataForm
    //     }).then(response => {
    //         let responseOK = response && response.status === 200;
    //         valid = responseOK;
    //     }).catch(error => { 
    //         console.error(error);
    //         // TODO: Handle 424 code (current code used for captcha invalid)
    //     })
        
    //     return valid;
    // }

    // testClick = () => {
    //     // this.props.onSubmit(recaptchaValue);
    //     console.log("Valid?", this.captchaValid());
    // }
    // // onInput = (evt) => {
    // //     this.setState({ [evt.target.name]: evt.target.value });
    // // }
    // captchaChange(value) {
    //     console.log("Captcha value:", value);
    //     this.setState({
    //         captcha: value
    //     });
    // }
    // log(val) {
    //     console.log("Log", val);
    // }

    // showFlipNum = () => {
    //     if(this.state.num) {
    //         return <FlipNumbers 
    //             id="flipNumbers"
    //             height={20} width={20} color="white" background="rgba(0,0,0,0.4)" 
    //             play={true} duration={0} delay={0} numbers={`${this.state.num}`} 
    //         />;
    //     }
    // }
    

    // renderSlides = () => {
    //     if(window.AtomiSaola) {
    //         console.log("OK");
    //         console.log(window.AtomiSaola);
    //         return ((function() {
    //             var li = {"color":"#2090e6","density":9,"diameter":60,"range":1,"shape":"oval","speed":1};
    //             window.AtomiSaola.openDoc('NEPAccess-demo-2.js', 'hqrrCRwD', {paused:false, preloaderOptions: li, center: 'both'});})(window.AtomiSaola));
    //     } 
    // }

    render () {
        return (
            <div className="content">
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>Test - NEPAccess</title>
                    <link rel="canonical" href="https://nepaccess.org/test" />
                    {/* <meta name="robots" content="noindex, nofollow" data-react-helmet="true" /> */}
                </Helmet>

                <Slides />

                {/* <div id="hqrrCRwD" style={{position: 'relative', height: '100%'}}></div> */}
                {/* <button onClick={this.renderSlides}>render slides</button> */}

                {/* {this.showFlipNum()} */}

                {/* <span>test</span>
                <div>
                    <ReCAPTCHA
                        ref={recaptchaRef}
                        sitekey="6LdLG5AaAAAAADg1ve-icSHsCLdw2oXYPidSiJWq"
                        onChange={this.captchaChange}
                        onErrored={this.log}
                    />
                    <button type='button' onClick={this.testClick}>Submit</button>
                </div> */}

                {/* <IframeResizer
                    data-hj-allow-iframe="true"
                    id="iframe-test-container"
                    src="https://paulmirocha.com/nepa/"
                    style={{ width: '900px', minWidth: '100%', height: '600px', minHeight: '100%'}}
                /> */}
                
                {/* <IframeResizer
                    // log
                    data-hj-allow-iframe="true"
                    id="iframe-test-container"
                    src="https://about.nepaccess.org/test/"
                    style={{ width: '1px', minWidth: '100%'}}
                /> */}

            </div>
        );
    }
    
    componentDidMount() {
    //     this.timer = setInterval(() => {
    //         if(this.state.num < this.state.total) {
    //             this.setState({
    //               num: this.state.num + 1,
    //             });
    //         }
    //     }, 10);
    }
    
    componentWillUnmount() {
    //     clearInterval(this.timer);
    }
}