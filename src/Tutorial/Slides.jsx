import React from 'react';

import ReactModal from 'react-modal';

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
                        id={'slides-modal'}
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
                            <div className="image-slide-holder-container">
                                <div className="image-slide-holder" onClick={() => this.changeSlide(FORWARD)}>

                                    <div id={`slide-0`} className={"image-slide " + this.state.slideClass[0]}></div>
                                    <div id={`slide-1`} className={"image-slide " + this.state.slideClass[1]}></div>
                                    <div id={`slide-2`} className={"image-slide " + this.state.slideClass[2]}></div>

                                    {/* <div id={`slide-${this.state.currentSlide - 1}`} className={"image-slide " + this.state.slideClass[this.state.currentSlide - 1]}></div>
                                    <div id={`slide-${this.state.currentSlide}`} className={"image-slide " + this.state.slideClass[this.state.currentSlide]}></div>
                                    <div id={`slide-${this.state.currentSlide + 1}`} className={"image-slide " + this.state.slideClass[this.state.currentSlide + 1]}></div> */}

                                </div>
                                <div className="slide-button-holder">
                                    <button className="left" onClick={() => this.changeSlide(BACKWARD)}>Go to previous slide</button>
                                    <button className="right" onClick={() => this.changeSlide(FORWARD)}>Go to next slide</button>
                                </div>
                            </div>
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