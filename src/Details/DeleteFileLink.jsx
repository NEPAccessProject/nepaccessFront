import React from 'react';

import axios from 'axios';

import Globals from '../globals.jsx';

// TODO: Confirmation box or at a minimum require two clicks
class DeleteFileLink extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            buttonText: "Delete this now",
            buttonDisabled: false
        }
    }

    deleteRecord = () => {
        // console.log("ID", this.props.cell._cell.row.data.id);
        // console.log("Folder", this.props.cell._cell.row.data.folder); // If no folder, have to assume documenttext
        
        let deleteUrl = Globals.currentHost;
        const idToDelete = this.props.cell._cell.row.data.id;
        
        if(!this.props.cell._cell.row.data.folder) {
            // Delete DocumentText by ID
            deleteUrl += "admin/delete_text";
            console.log("No folder: DocumentText, not NEPAFile record");
        } else {
            // Delete NEPAFile by ID
            deleteUrl += "admin/delete_nepa_file";
        }
            
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
                        buttonText: "Deleted",
                        buttonDisabled: true
                    });
					// return response.data;
                } else if(response && response.status === 202) {
                    this.setState({
                        buttonText: "Request received",
                        buttonDisabled: true
                    });
				} else { // impossible?  Should be 200, 202, or error.
                    this.setState({
                        buttonText: response.status
                    });
				}
			}).catch(error => {
                this.setState({
                    buttonText: Globals.getErrorMessage(error) + ": Failed to delete"
                });
                console.log(error);
            });
    }

    render(){
        // console.log("DeleteFileLink active", this.props.cell._cell.row.data);
        return(
            <button disabled={this.state.buttonDisabled} className="" onClick={this.deleteRecord}>{this.state.buttonText}</button>
        );
    }

    componentDidMount() {
        if(localStorage.role && localStorage.role === 'curator' && this.state.buttonText==="Delete this now") { 
            this.setState({
                buttonText: "Request delete"
            })
        }
    }
}

export default DeleteFileLink;