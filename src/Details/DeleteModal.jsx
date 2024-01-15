import React from 'react';

import ReactModal from 'react-modal';
import axios from 'axios';

import Globals from '../globals.jsx';

export default class DeleteFileLink extends React.Component {

	constructor(props){
		super(props);
        this.state = {
            networkError: '',
            show: false,
            deleteText: '',
            result: '',
            deleted: false,
            resultText: 'Record and associated texts have been deleted.'
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

    deleteStateChange = (evt) => {
        this.setState({ deleteText: evt.target.value });
    }


    deleteRecord = () => {
        // expecting this.props.idToDelete to identify ID of EISDoc record to delete
        if(this.props['idToDelete']) {
            // console.log("Deleting");
            // Clear error
            this.setState({ networkError: '' });
            this.delete();
        } else {
            this.setState({ networkError: 'Nothing found: Nothing deleted' });
        }
    }

    delete = () => {
        const deleteUrl = Globals.currentHost + "admin/deleteDoc";
        const idToDelete = this.props.idToDelete;
        
        //Send the AJAX call to the server
        axios({
            url: deleteUrl,
            method: 'POST', 
            data: idToDelete,
            headers:{
                'Content-Type': 'application/json; charset=utf-8'
            }
        }).then(response => {
            let responseOK = response && response.status === 200;
            if (responseOK) {
                this.setState({
                    result: response.data,
                    deleted: true
                });
            } else if(response && response.status === 202) {
                this.setState({
                    result: response.data,
                    deleted: true,
                    resultText: "Request submitted successfully."
                })
            } else { // 404 or server not up?
                this.setState({
                    networkError: "No record found or server is down; nothing was deleted"
                });
            }
        }).catch(error => {
            console.log(error);
            this.setState({
                networkError: error
            });
        });
    }

    
    Build = () => {
        // console.log("Build modal with ID", this.props.idToDelete);
    
        return (
            <button className='link block right warning' onClick={e => {
                this.showModal();
            }}>
                Delete EISDoc and all indexed texts (cannot be undone)
            </button>
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
                    isOpen={this.state.show}
                    parentSelector={() => document.body}
                    // ariaHideApp={false}
                >
                    <div hidden={this.state.deleted}>
                        <button className='button modal-close' onClick={this.hideModal}>Cancel</button>


                        <h2 className="title-color">Type DELETE and confirm to really delete this record:</h2>
                        
                        <span>Enter "DELETE" here to enable delete button: </span>
                        <input type="text" name="deleteTextBox" 
                            autoFocus
                            value={this.state.deleteText} onChange={this.deleteStateChange}
                        />

                        <hr />

                        <button className='button' onClick={this.deleteRecord} disabled={this.state.deleteText!=='DELETE'}>Delete</button>
                        <label className="errorLabel">{this.state.networkError}</label>
                    </div>
                    <div hidden={!this.state.deleted}>
                        <button className='button modal-close' onClick={this.hideModal}>Close</button>
                        <label className="errorLabel">{this.state.networkError}</label>
                        <h2 className="title-color">{this.state.resultText}</h2>
                    </div>
                </ReactModal>
            </div>
        );
    }

    componentDidUpdate() {
        // console.log("Modal update");
    }
}