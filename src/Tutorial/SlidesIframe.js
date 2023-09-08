import React from 'react';

import IframeResizer from 'iframe-resizer-react';
import ReactModal from 'react-modal';

import LoginModal from '../User/LoginModal';

import './slides.css';

// http://reactcommunity.org/react-modal/styles/
// default:
// style={{
//     overlay: {
//       position: 'fixed',
//       top: 0,
//       left: 0,
//       right: 0,
//       bottom: 0,
//       backgroundColor: 'rgba(255, 255, 255, 0.75)'
//     },
//     content: {
//       position: 'absolute',
//       top: '40px',
//       left: '40px',
//       right: '40px',
//       bottom: '40px',
//       border: '1px solid #ccc',
//       background: '#fff',
//       overflow: 'auto',
//       WebkitOverflowScrolling: 'touch',
//       outline: 'none',
//       padding: '20px'
//     }
//   }}


function getHeight() {
    if(localStorage.role) {
        return "422px";
    } else {
        return "442px";
    }
}
// override these defaults:
const tutorialModalStyle = {
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.50)',
    },
    content: {
        border: 'none',
        overflow: 'visible',
        padding: '0px',
        height: getHeight()
    }
}

export default class Slides extends React.Component {

    _currentSlide = 0;

    constructor(props) {
        super(props);
		this.state = {
            show: false
        };
    }
    
    showModal = (e) => { 
        this.setState({ show: true }); 
    }
    hideModal = (e) => { 
        localStorage.hideTutorial = true;
        this.setState({ show: false }); 
    }
    
    onKeyUp = (evt) => {
        if(evt.key === "Escape"){
            this.hideModal();
        }
    }
    
    renderLoginLink = () => {
        if(localStorage.role === undefined) {
            return <span id="tutorial-login" className="not-logged-in">
                Already know how to use NEPAccess? Please <span onClick={this.hideModalOpenLogin}><LoginModal closeParent={this.hideModal}/></span> or <a className="not-logged-in" href='register' rel='noopener noreferrer'>register</a> here.
            </span>
        } else {
            return ''
        }
    }

    Build = () => {
        return (
            // <div id="tutorial-link-holder">
            //     <div className='link'>
                    <span 
                        className={(this.state.show===true ? "open side-link" : "side-link")} 
                        onClick={e => {
                            this.showModal();
                        }}
                    >
                        Quick-start guide
                    </span>
            //     </div>
            // </div>
        );
    }

    getLoggedInClass = () => {
        if(localStorage.role) {
            return " logged-in";
        }
    }


    render () {
        if(!this.state.show) {
            return this.Build();
        } 

        if (typeof(window) !== 'undefined') {
            ReactModal.setAppElement('body');
        }


        return (
            <div onKeyUp={this.onKeyUp}>
                {this.Build()}
                <ReactModal 
                        id={'slides-iframe-modal'}
                        onRequestClose={this.hideModal}
                        // isOpen={this.state.show}
                        isOpen={true}
                        parentSelector={() => document.body}
                        style={tutorialModalStyle}
                        // ariaHideApp={false}
                >
                        <div id="tutorial-top" className={"modal-button-space" + this.getLoggedInClass()}>
                            {this.renderLoginLink()}
                            <button id="tutorial-close" onClick={this.hideModal}>x</button>
                        </div>

                        <div>
                            {/* <div className="image-slide-holder-container"> */}
                                <IframeResizer
                                    id="iframe-test-container"
                                    // src="https://paulmirocha.com/nepa/"
                                    src="https://about.nepaccess.org/wp-content/uploads/demo/"
                                    style={{ width: '1px', minWidth: '100%', height: getHeight(), minHeight: '100%'}}
                                />
                            {/* </div> */}
                        </div>
                </ReactModal>
            </div>
        );
    }

    startOpenIfLoggedIn = () => {
        // window.addEventListener("load", () => {
        //     // user agent breakdown by device type
        //     var isMobile = navigator.userAgent.toLowerCase().match(/mobile/i),
        //         isTablet = navigator.userAgent.toLowerCase().match(/tablet/i),
        //         isAndroid = navigator.userAgent.toLowerCase().match(/android/i),
        //         isiPhone = navigator.userAgent.toLowerCase().match(/iphone/i),
        //         isiPad = navigator.userAgent.toLowerCase().match(/ipad/i);
           
        //     // detected device 
        //     console.log("Mobile", isMobile);
        //     console.log("Tablet", isTablet);
        //     console.log("Android", isAndroid);
        //     console.log("iPhone", isiPhone);
        //     console.log("iPad", isiPad);
        // });

        if(navigator.userAgent.toLowerCase ().match (/mobile/i)) {
            // console.log("Mobile device");
        } else {
            if(!localStorage.role && !localStorage.hideTutorial) {
                this.setState({ show: true });
            }
        }
    }
    
    componentDidMount() {
        // console.log("Mount");
        this.startOpenIfLoggedIn();
    }
    
    componentWillUnmount() {
    }
}