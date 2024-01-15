import React from 'react';

import DatePicker from "react-datepicker";
import axios from 'axios';

import DeleteModal from './DeleteModal.jsx';

import Globals from '../globals.jsx';

import "./details.css";

const _ = require('lodash');


class DetailsUpdate extends React.Component {


    _internal = -1;

    constructor(props) {
        super(props);
        this.state = {
            record: {},
            isDirty: false
        };
        this.setupInputs = _.debounce(this.setupInputs,250);
        // console.log("Constructor", this.props.record);
    }

    // reverts to most recent.  Note that this also counts as an update, meaning it's effectively an undo button
    // with a depth of only 1.
    revertRecord = () => {
        document.body.style.cursor = 'wait';
        
        this.setState({
            isDirty: false,
            disabled: true
        });

        let updateUrl = new URL('update_log/restore_doc_last', Globals.currentHost);
        let update = new FormData();
        update.append("id", JSON.stringify(this.state.record.id));

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
                successString = "Successfully set most or all fields to before the most recent change.";
            } else {
                successString = "Failed to update."; // Server down?
            }
        }).catch(error => {
            networkString = Globals.getErrorMessage(error);
            successString = "Couldn't update; this record has probably never been changed.";
            console.error('revert error ', error);
        }).finally(e => {
            this.setState({
                networkError: networkString,
                successLabel: successString,
                disabled: false,
                titleLabel: "",
                dateError: "",
                typeError: ""
            }, () => {
                this._internal = -1;
                this.props.repopulate();
            });
    
            document.body.style.cursor = 'default'; 
        });
    }

    updateRecord = () => {
        if(!this.validated()) {
            return;
        }
        
        document.body.style.cursor = 'wait';
        
        this.setState({
            isDirty: false,
            disabled: true
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
            networkString = Globals.getErrorMessage(error);
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

    /**  TODO: Need to get direction on if we really want to do this - if we don't want the comments to be searchable
     * then we need to prepare a different design than what I have in mind.
    /* Front and back:
    /* Take title, prefix with "EPA comments for ", take comment filename, take date, create brand new record.
    /* Type will be "Comments" or "EPA Comments"?  After that it will theoretically be open to the extract/index 
    /* process so that could be run on the backend or done in a bulk call in the future, and then the letter itself
    /* will be searchable.  Process ID will be the same as the derived record.  If base rec has no process, make one?
     */
    extractCommentToNewRecord = () => {
        
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
    
    
    onCommentDateChange = (evt) => {
        console.log("Old date", this.state.record.epa_comment_letter_date);
        this.setState(prevState => {
            let record = { ...prevState.record };  // shallow copy of state variable
            record.epa_comment_letter_date = evt;                     // update the name property, assign a new value                 
            return { record };                                 // return new state object
        }, () =>{
            this.setState({
                isDirty: true
            });
            console.log("Date changed", this.state.record.epa_comment_letter_date);
        });
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
        // Props populated yet?  Record still unpopulated?  Different record now?
        if(this.props && this.props.record && !this.state.record.registerDate
                    && this.props.id !== this._internal) { 
            this._internal = this.props.id;
            // console.log("props", this.props.record);
            // let startState = { ...this.props.record}; /// shallow clone, would be fine today but maybe not tomorrow
            let startState = JSON.parse(JSON.stringify(this.props.record)); // Deep clone (new array/object properties cloned from props object are fully disconnected)

            // Handle date, standardize input names
            if(typeof(startState.registerDate) === "string"){
                startState.federal_register_date = Globals.getCorrectDate(startState.registerDate);
                startState.registerDate = null;
            }
            if(typeof(startState.commentDate) === "string"){
                startState.epa_comment_letter_date = Globals.getCorrectDate(startState.commentDate);
                startState.commentDate = null;
            }
            startState.document = startState.documentType;
            startState.comments_filename = startState.commentsFilename;
            startState.eis_identifier = startState.folder;
            startState.cooperating_agency = startState.cooperatingAgency;
            startState.process_id = startState.processId;

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
                console.log("Record clone", this.state.record);
            });
        } else if( this.props.id !== this._internal) {
            this._internal = this.props.id;
            this.setState({
                record: { },
                isDirty: false
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

                    <label className="update">Title</label>
                    <label className="loginErrorLabel">
                        {this.state.titleLabel}
                    </label>
                    <input type="text" name="title" value={"" + this.state.record.title} onInput={this.onInput} onChange={this.onChange}></input>
                    
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

                    <label className="update">Document type</label>
                    <label className="loginErrorLabel">
                        {this.state.typeError}
                    </label>
                    <input type="text" name="document" value={"" + this.state.record.document} onInput={this.onInput} onChange={this.onChange}></input>
                    
                    <label className="update">Agency</label>
                    <input type="text" name="agency" value={"" + this.state.record.agency} onInput={this.onInput} onChange={this.onChange}></input>
                    <label className="update">Cooperating Agency</label>
                    <input type="text" name="cooperating_agency" value={"" + this.state.record.cooperating_agency} onInput={this.onInput} onChange={this.onChange}></input>
                    <label className="update">Department</label>
                    <input type="text" name="department" value={"" + this.state.record.department} onInput={this.onInput} onChange={this.onChange}></input>
                    
                    <label className="update">Filename</label>
                    <input type="text" name="filename" value={"" + this.state.record.filename} onInput={this.onInput} onChange={this.onChange}></input>
                    <label className="update">Folder</label>
                    <input type="text" name="eis_identifier" value={"" + this.state.record.eis_identifier} onInput={this.onInput} onChange={this.onChange}></input>
                    
                    <label className="update">State</label>
                    <input type="text" name="state" value={"" + this.state.record.state} onInput={this.onInput} onChange={this.onChange}></input>
                    <label className="update">County</label>
                    <input type="text" name="county" value={"" + this.state.record.county} onInput={this.onInput} onChange={this.onChange}></input>

                    <label className="update">Process ID</label>
                    <input type="text" name="process_id" value={"" + this.state.record.process_id} onInput={this.onInput} onChange={this.onChange}></input>
                    <label className="update">Link</label>
                    <input type="text" name="link" value={"" + this.state.record.link} onInput={this.onInput} onChange={this.onChange}></input>
                    <label className="update">Notes</label>
                    <input type="text" name="notes" value={"" + this.state.record.notes} onInput={this.onInput} onChange={this.onChange}></input>

                    <label className="update">Subtype</label>
                    <input type="text" name="subtype" value={"" + this.state.record.subtype} onInput={this.onInput} onChange={this.onChange}></input>

                    <label className="update">Status</label>
                    <input type="text" name="status" value={"" + this.state.record.status} onInput={this.onInput} onChange={this.onChange}></input>

                    <label className="update">Action</label>
                    <input type="text" name="action" value={"" + this.state.record.action} onInput={this.onInput} onChange={this.onChange}></input>

                    <label className="update">Decision</label>
                    <input type="text" name="decision" value={"" + this.state.record.decision} onInput={this.onInput} onChange={this.onChange}></input>

                    <label className="update">EPA Comment Letter Date</label>
                    <label className="loginErrorLabel">
                        
                    </label>
                    <DatePicker
                        selected={this.state.record.epa_comment_letter_date} 
                        onChange={this.onCommentDateChange} 
                        dateFormat="yyyy-MM-dd" placeholderText="YYYY-MM-DD"
                        className="date block" 
                    />
                    <label className="update">Comments filename</label>
                    <input type="text" name="comments_filename" value={"" + this.state.record.comments_filename} onInput={this.onInput} onChange={this.onChange}></input>
                    
                    <h3 className="infoLabel">
                        {this.state.successLabel}
                    </h3>

                    <button type="button" className="button" disabled={!this.state.isDirty} onClick={this.updateRecord}>Save changes</button>
                    <hr />
                    {/* <button type="button" className="button" disabled={this.state.disabled} onClick={this.revertRecord}>Revert last change</button>
                    <hr /> */}
                    {/* <label>Delete metadata and all associated files cleanly from the database.  This cannot be reversed.</label> */}
                    {/* <button type="button" className="button" onClick={this.deleteRecord}>Delete everything</button> */}
                    <DeleteModal idToDelete={this.state.record.id} />
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
        // console.log("Mounted", this.state.record)
    }
    componentDidUpdate() {
        this.setupInputs();
        // console.log("Component update event", this.state.record);
    }
}

export default DetailsUpdate;

