import React from 'react';

import ReactModal from 'react-modal';

export default class BasicModal extends React.Component {

	constructor(props){
		super(props);
        this.state = {
            networkError: '',
            show: false,
            text: '',
            result: ''
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
    
    Build = () => {
        return (
            <div className={this.props.divClassName}>
                <span 
                    className={this.props.className + " " + (this.state.show===true ? "open" : "")} 
                    onClick={e => {
                        this.showModal();
                    }}
                >
                    Available files
                </span>
            </div>
        );
    }

    showContent = () => {
        return (
                this.props.html
        );
    }

    render() {
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
                    onRequestClose={this.hideModal}
                    // isOpen={this.state.show}
                    isOpen={true}
                    parentSelector={() => document.body}
                    id={this.props.id}
                    // ariaHideApp={false}
                >
                    <div className="modal-button-space">
                        <button className='float-right' onClick={this.hideModal}>x</button>
                    </div>

                    <div>
                        <label className="errorLabel">{this.state.networkError}</label>
                    </div>

                    {this.showContent()}

                </ReactModal>
            </div>
        );
    }

    componentDidUpdate() {
        // console.log("Modal update");
    }
}