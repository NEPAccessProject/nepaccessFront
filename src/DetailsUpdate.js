import React from 'react';

import DatePicker from "react-datepicker";

import axios from 'axios';
import Globals from './globals';


import "./details.css";

// TODO: Add in save

class DetailsUpdate extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            record: {},
            isDirty: false
        };
        // console.log("Constructor", this.props.record);
    }

    updateRecord = () => {
        if(!this.validated()) {
            return;
        }
        
        document.body.style.cursor = 'wait';
        
        this.setState({
            isDirty: false
        });
        
        let updateUrl = new URL('test/update_doc', Globals.currentHost);

        let update = new FormData();
        update.append("doc", JSON.stringify(this.state.record));

        let networkString = '';
        let successString = '';

        axios({ 
            method: 'POST',
            url: updateUrl,
            headers: {
                'Content-Type': "multipart/form-data"
            },
            data: update
        }).then(response => {
            let responseOK = response && response.status === 200;
            if (responseOK) {
                return true;
            } else { 
                return false;
            }
        }).then(success => {
            if(success){
                successString = "Success.  You may need to reload the page to see the changes.";
            } else {
                successString = "Failed to update."; // Server down?
            }
        }).catch(error => {
            if(error.response) {
                if (error.response.status === 500) {
                    networkString = "Internal server error.";
                } else if (error.response.status === 404) {
                    networkString = "Not found.";
                } else {
                    networkString = "Error";
                }
            } else {
                networkString = "Server may be down (no response), please try again later.";
            }
            successString = "Couldn't update.";
            console.error('error message ', error);
        }).finally(e => {
            this.setState({
                networkError: networkString,
                successLabel: successString,
                disabled: false,
                titleLabel: "",
                dateError: "",
                typeError: ""
            });
    
            document.body.style.cursor = 'default'; 
        });



        console.log("Record updated");
    }

    // inferior to onInput but react complains if there's no onChange handler
    onChange = (evt) => {}

    onInput = (evt) => {
        if(evt && evt.target){
            let targetName = evt.target.name;
            let targetValue = evt.target.value;
            this.setState(prevState => {
                let record = { ...prevState.record };  // shallow copy of state variable
                record[targetName] = targetValue;                     // update the name property, assign a new value                 
                return { record };                                 // return new state object
            }, () =>{
                this.setState({
                    isDirty: true
                });
                // TODO: Validate inputs
            });
        }
    }

    validated = () => {
        let valid = true;

        if(this.state.record.title.trim().length === 0){
            valid = false;
            this.setState({titleLabel: "Title required"});
        }
        if(!this.state.record.federal_register_date || this.state.record.federal_register_date.toString().trim().length < 9){
            valid = false;
            this.setState({dateError: "YYYY-MM-DD date required"});
        } if (this.state.record.document.trim().length === 0) {
            valid = false;
            this.setState({typeError: "Type required"});
        }

        this.setState({ successLabel: "", isDirty: false });
        return valid;
    }
    
    onDateChange = (evt) => {
        console.log("Old date", this.state.record.federal_register_date);
        this.setState(prevState => {
            let record = { ...prevState.record };  // shallow copy of state variable
            record.federal_register_date = evt;                     // update the name property, assign a new value                 
            return { record };                                 // return new state object
        }, () =>{
            this.setState({
                isDirty: true
            });
            console.log("Date changed", this.state.record.federal_register_date);
        });
    }

    // Deep clone to state from props to populate inputs (options are either this or a backend call)
    setupInputs = () => {
        if(this.props && this.props.record && !this.state.record.registerDate) { // Props populated yet?  Record still unpopulated?
            // console.log("props", this.props.record);
            // let startState = { ...this.props.record}; /// shallow clone, would be fine today but maybe not tomorrow
            let startState = JSON.parse(JSON.stringify(this.props.record)); // Deep clone (new array/object properties cloned from props object are fully disconnected)

            // Handle date, standardize input names
            if(typeof(startState.registerDate) === "string"){
                startState.federal_register_date = Globals.getCorrectDate(startState.registerDate);
                startState.registerDate = null;
            }
            startState.document = startState.documentType;
            startState.epa_comment_letter_date = startState.commentDate;
            startState.eis_identifier = startState.folder;

			// prefer empty string to null
            Object.keys(startState).forEach(e => 
                {
                    if(startState[e]===null){
                        startState[e] = "";
                    }
                }
            );

            // populate state
            this.setState({
                record: startState,
                isDirty: false
            }, () => {
                console.log(this.state.record);
            });
        }
    }

	render() {
        try {
            return (
                <div className="update">
                    <label className="networkErrorLabel">
                        {this.state.networkError}
                    </label>
                    <hr />
                    <label className="update">Federal Register Date</label>
                    <label className="loginErrorLabel">
                        {this.state.dateError}
                    </label>
                    <DatePicker
                        selected={this.state.record.federal_register_date} 
                        onChange={this.onDateChange} 
                        dateFormat="yyyy-MM-dd" placeholderText="YYYY-MM-DD"
                        className="date block" 
                    />
                    <label className="update">Agency</label>
                    <input type="text" name="agency" value={"" + this.state.record.agency} onInput={this.onInput} onChange={this.onChange}></input>
                    {/* <input type="text" value={"" + this.state.record.commentDate} onInput={this.onInput} onChange={this.onChange}></input> */}
                    <label className="update">Comments filename</label>
                    <input type="text" name="commentsFilename" value={"" + this.state.record.commentsFilename} onInput={this.onInput} onChange={this.onChange}></input>
                    <label className="update">Document type</label>
                    <label className="loginErrorLabel">
                        {this.state.typeError}
                    </label>
                    <input type="text" name="document" value={"" + this.state.record.document} onInput={this.onInput} onChange={this.onChange}></input>
                    <label className="update">Filename</label>
                    <input type="text" name="filename" value={"" + this.state.record.filename} onInput={this.onInput} onChange={this.onChange}></input>
                    <label className="update">Folder</label>
                    <input type="text" name="eis_identifier" value={"" + this.state.record.eis_identifier} onInput={this.onInput} onChange={this.onChange}></input>
                    <label className="update">Link</label>
                    <input type="text" name="link" value={"" + this.state.record.link} onInput={this.onInput} onChange={this.onChange}></input>
                    <label className="update">Notes</label>
                    <input type="text" name="notes" value={"" + this.state.record.notes} onInput={this.onInput} onChange={this.onChange}></input>
                    <label className="update">State</label>
                    <input type="text" name="state" value={"" + this.state.record.state} onInput={this.onInput} onChange={this.onChange}></input>
                    <label className="update">Title</label>
                    <label className="loginErrorLabel">
                        {this.state.titleLabel}
                    </label>
                    <input type="text" name="title" value={"" + this.state.record.title} onInput={this.onInput} onChange={this.onChange}></input>

                    <h3 className="infoLabel">
                        {this.state.successLabel}
                    </h3>

                    <button type="button" className="button" disabled={!this.state.isDirty} onClick={this.updateRecord}>Save changes</button>
                </div>
            );
        }
        catch (e) {
            return (
                <div>
                    Unknown error; please try refreshing or try again later.
                </div>
            )
        }
    }
    
    componentDidMount() {
        this.setupInputs();
        console.log("Mounted", this.state.record)
    }
    componentDidUpdate() {
        console.log("Updated", this.state.record);
    }
}

export default DetailsUpdate;

