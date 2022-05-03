import React from 'react';

import ReactModal from 'react-modal';
import IframeResizer from 'iframe-resizer-react';

import LoginModal from '../User/LoginModal';

import './slides.css';

const FORWARD = 1;
const BACKWARD = -1;

export default class Slides extends React.Component {

    _currentSlide = 0;

    constructor(props) {
        super(props);
		this.state = {
            slideClass: [],
            classLength: 3,
            currentSlide: 0,

            show: false
        };
    }
    
    showModal = (e) => { 
        this.setState({ show: true }); 
    }
    hideModal = (e) => { this.setState({ show: false }); }
    
    onKeyUp = (evt) => {
        if(evt.key === "Escape"){
            this.hideModal();
        }
    }

    changeSlide = (direction) => {
        let classes = this.state.slideClass;
        let classI = this.state.currentSlide;

        if(direction === FORWARD) {
            if( classI < (this.state.classLength - 1) ) {
                classes[classI] = "fade-out";
                classes[classI + 1] = "fade-in";

                classI = classI + 1;
            } else {
                console.log("Already at end");
            }

        } else if(direction === BACKWARD) {
            if( classI > 0 ) {
                classes[classI] = "fade-out";
                classes[classI - 1] = "fade-in";
                
                classI = classI - 1;
            } else {
                console.log("Already at beginning");
            }

        }

        this.setState({
            slideClass: classes,
            currentSlide: classI
        }, () => {
            // console.log(direction, this.state.slideClass);
        });
    }
    
    renderLoginLink = () => {
        if(localStorage.role === undefined) {
            return <span id="tutorial-login" className="not-logged-in">
                Already know how to use NEPAccess? Please <LoginModal /> or <a className="not-logged-in" href='register' target='_blank' rel='noopener noreferrer'>register</a> here.
            </span>
        } else {
            return ''
        }
    }

    Build = () => {
        return (
            <div id="tutorial-link-holder">
                <div className='link'>
                    <span 
                        className={(this.state.show===true ? "open" : "")} 
                        onClick={e => {
                            this.showModal();
                        }}
                    >
                        How To Use NEPAccess
                    </span>
                </div>
            </div>
        );
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
                        // ariaHideApp={false}
                >
                        <div className="modal-button-space">
                            <button className='float-right' onClick={this.hideModal}>x</button>
                        </div>

                        <div>
                            {this.renderLoginLink()}
                            {/* <div className="image-slide-holder-container"> */}
                                <IframeResizer
                                    data-hj-allow-iframe="true"
                                    id="iframe-test-container"
                                    src="https://paulmirocha.com/nepa/"
                                    style={{ width: '900px', minWidth: '100%', height: '600px', minHeight: '100%'}}
                                />
                            {/* </div> */}
                        </div>
                </ReactModal>
            </div>
        );
    }

    populateClasses = () => {
        let classes = this.state.slideClass;
        for(let i = 0; i < this.state.classLength; i++) {
            classes[i] = "";
        }

        // first/current "slide" should be visible (100% opacity)
        classes[this.state.currentSlide] = "fade-in";
        
        this.setState({
            slideClass: classes
        });
    }
    
    componentDidMount() {
        this.populateClasses();
    }
    
    componentWillUnmount() {
    }
}