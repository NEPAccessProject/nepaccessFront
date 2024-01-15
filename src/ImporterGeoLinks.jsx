import React, {Component} from 'react';

import Creatable from 'react-select/creatable';

import { CSVReader } from 'react-papaparse';

import axios from 'axios';
import Globals from './globals';

// TODO: Temporary list here. Later we'll build a database table to consult instead, but this way
// the services don't even need to be restarted to update just the frontend
/** Key is bad id, value is good id to use instead */
const bads = {
    "5000489": 5000463,
    "5000518": 5000413,
    "5000803": 5000312,
    "5001122": 5001121,
    "5002078": 5001633,
    "5002573": 5002571,
    "5002588": 5001039,
    "5004023": 5003987,
    "5004597": 5000359,
    "5004643": 5003066,
    "5004792": 5003067,
    "5005038": 5002429,
    "5005629": 5003593,
    "5005984": 5003964,
    "5006183": 5003893,
    "5006330": 5000111,
    "5006637": 5006178,
    "5006982": 5005210,
    "5007090": 5004572,
    "5007148": 5002928,
    "5007743": 5006578,
    "5008138": 5008135,
    "5008161": 5001171,
    "5008287": 5001633,
    "5008750": 5003253,
    "5008766": 5002808,
    "5008899": 5004317,
    "5009029": 5001081,
    "5009037": 5007716,
    "5010177": 5003493,
    "5010182": 5005992,
    "5010767": 5008435,
    "5010848": 5001143,
    "5010902": 5009787,
    "5010911": 5005338,
    "5011455": 5004500,
    "5011957": 5011852,
    "5012298": 5011932,
    "5012340": 5005031,
    "5012367": 5003885,
    "5012411": 5010425,
    "5012800": 5006090,
    "5013401": 5005779,
    "11001": 11 // dc?
}

const customStyles = {
    option: (styles, state) => ({
         ...styles,
        borderBottom: '1px dotted',
        backgroundColor: 'white',
        color: 'black',
        '&:hover': {
            backgroundColor: '#b2c5f5'
        },
    }),
    control: (styles) => ({
        ...styles,
        backgroundColor: 'white',
    })
}

const delimiterOptions = [{value:"", label:"auto-detect"}, {value:",", label:","}, {value:"\t", label:"tab"}
];

/** 
 * Goal is to support uploading: 
 * - .tsv/.csv with ID links between metadata OR process records, and geojson records 
 * (meta id linked to one or more custom-defined geojson ids)
 **/
export default class ImporterGeoLinks extends Component {

    constructor(props) {
        super(props);

        this.state = { 
            networkError: '',
            successLabel: '',
            csvLabel    : '',
            csvError    : '',
            disabled    : false,
            csv         : null,
            canImportCSV: false,
            busy        : false,
            delimiter   : {value:"", label:"auto-detect"}, // auto-detect

            reportBusy  : false,
            headers     : '',
        };
    }

    
    /** Validation */ 

    // no requirements; let backend deal with invalid data
    autoValidate = (csv) => {
        return true;
    }
    

    /** Event handlers */

    onDelimiterChange = (val, act) => {
        if(!val || !act){
            return;
        }
        
        this.setState({
            delimiter: val
        });
    }

    onSelect = (val, act) => {
        if(!val || !act){
            return;
        }

        let name = act.name;
        if(act.action === "create-option"){ // Custom value for document type support
            name = "document";
        }
        const value = val.value;

        this.setState( prevState =>
        { 
            const updatedDoc = prevState.doc;
            updatedDoc[name] = value;
            return {
                doc: updatedDoc
            }
        }, () => {
            // console.log(this.state.doc);
        });

    }

    handleOnDrop = (evt) => {

        let resultString = "Lines processed: " + evt.length + "\n";

        let newArray = [];
        for(let i = 0; i < evt.length; i++){
            if(evt[i].errors && evt[i].errors.length > 0) {
                resultString += "Error on line " + (i + 1) + " (this line was skipped): ";
                for(let j = 0; j < evt[i].errors.length; j++) {
                    resultString += evt[i].errors[j].message + " (can ignore this error if it's only on the last line)\n";
                }
            } else {
                newArray.push(evt[i].data);
            }
        }

        this.setState({ 
            csv       : newArray,
            otherError: resultString,
            headers   : Globals.getKeys(evt[0].data).toString().replaceAll(',',', ')
        }, () => {
            this.setState({ canImportCSV: true });
        });
    }

    handleOnRemoveFile = (evt) => { this.setState({ csv: null, canImportCSV: false }); }

    // Note: Just because errors are generated does not necessarily mean that parsing failed.
    handleOnError = (evt) => {}


    /** Import logic */

    // given row, try to return row with corrected headers, formatted to be ready for the backend
    translateRow(importRow) {
        // console.log("Row in",importRow);

        let key, keys = Object.keys(importRow);
        // console.log("Headers",keys);

        let n = keys.length;
        let newObj={};

        while (n--) {
            // Spaces to underscores, lowercase
            let newKey = keys[n].toLocaleLowerCase().replace(/ /g, "_").trim();
            // Keep original key we'll need for copying the value
            key = keys[n];

            // standardize anything anticipated to be wrong
            if(newKey=== "id" || newKey=== "metaid") {
                newKey = "meta_id";
            }
            if(newKey=== "processid") {
                newKey = "process_id";
            }
            if(newKey=== "geoid") {
                newKey = "geo_id";
            }
            
            newObj[newKey] = importRow[key];

            if(newKey=== "geo_id") {
                // TODO: Temporarily replacing bad ids here using a temporary static list
                const geoIDs = newObj.geo_id.split(';');
                let newIDs = [];
                let hasBad = false;
                geoIDs.forEach((id) => {
                    if(bads[id.trim()]) {
                        console.log("Replacing bad id",id,bads[id.trim()],newObj.geo_id);
                        newIDs.push(bads[id.trim()]);
                        hasBad = true;
                    } else {
                        newIDs.push(id.trim());
                    }
                });
                newObj.geo_id = newIDs.join(";");
                if(hasBad) {
                    console.log("New result",newObj.geo_id);
                }
            }
            
        }

        // console.log("New row",newObj);
        return newObj;
    }


    /** Expects .tsv or .csv
    * */
    importCSVHandler = (validation, urlToUse) => {
        let newCSV = [];
        for(let i = 0; i < this.state.csv.length; i++){
            let keys = Object.keys(this.state.csv[i]);

            if(!this.state.csv[i][keys[0]]) {
                // EOF?
            } else {
                newCSV[i] = this.translateRow(this.state.csv[i]);
            }

        }

        if(!validation(newCSV)) {
            return;
        }
        
        document.body.style.cursor = 'wait';
        this.setState({ 
            csvLabel: 'In progress...',
            csvError: '',
            disabled: true,
            busy    : true
        });

        
        let importUrl = new URL(urlToUse, Globals.currentHost);

        let uploadFile = new FormData();
        uploadFile.append("geoLinks", JSON.stringify(newCSV));

        let networkString = '';
        let successString = '';
        let resultString  = "";

        axios({ 
            method: 'POST',
            url: importUrl,
            headers: {
                'Content-Type': "multipart/form-data"
            },
            data: uploadFile
        }).then(response => {
            let responseOK = response && response.status === 200;
            // console.log(response);

            let responseArray = response.data;
            responseArray.forEach(element => {
                resultString += element + "\n";
            });
            
            if (responseOK) {
                return true;
            } else { 
                return false;
            }
        }).then(success => {
            if(success){
                successString = "Success.";
            } else {
                successString = "Failed to import."; // Server down?
            }
        }).catch(error => {
            if(error.response) {
                if (error.response.status === 500) {
                    networkString = "Internal server error.";
                } else if (error.response.status === 404) {
                    networkString = "Not found.";
                } 
            } else {
                networkString = "Server may be down (no response), please try again later.";
            }
            successString = "Couldn't import.";
            console.error('error message ', error);
        }).finally(e => {
            this.setState({
                csvError: networkString,
                csvLabel: successString,
                disabled: false,
                results : resultString,
                busy    : false
            });
    
            document.body.style.cursor = 'default'; 
        });
    }
    

    render() {

        if(!Globals.curatorOrHigher()) {
            return <div className="content">
                401 Unauthorized (not admin or try logging in again?)
            </div>;
        }

        return (
            <div className="form content">
                
                <div className="note">
                    Import GeoJSON ID Linking Data
                </div>
                
                <label className="networkErrorLabel">
                    {this.state.networkError}
                </label>

                <div className="loader-holder" hidden={!this.state.reportBusy}>
                    <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
                </div>
                

                <div className="import-meta">

                    <div className="importFile">
                        <h2>Instructions:</h2>
                        <h3>One .tsv or .csv file at a time supported.</h3>
                        <h3>Support for ; delimited list of geoIDs.</h3>
                        <h3>Header names case insensitive but otherwise must be exact.</h3>
                        <h3>Required headers: id; geo_id.  (id is for the metadata record ID)</h3>
                        <h3>Optional headers: process_id</h3>

                        <hr />

                        <h1>Import spreadsheet:</h1>
                        <label className="advanced-label">Delimiter to use (default auto-detect) </label>
                        <Creatable  id="delimiter" name="delimiter" 
                                    className="multi inline-block" classNamePrefix="react-select"  
                                    isSearchable isClearable 
                                    styles      = {customStyles}
                                    options     = {delimiterOptions}
                                    selected    = {this.state.delimiter}
                                    onChange    = {this.onDelimiterChange} 
                                    placeholder = "Type or select delimiter" 
                        />
                        <CSVReader
                            onDrop  = {this.handleOnDrop}
                            onError = {this.handleOnError}
                            style   = {{}}
                            config  = {{
                                header   : true,
                                delimiter: this.state.delimiter.value
                            }}
                            addRemoveButton
                            onRemoveFile = {this.handleOnRemoveFile}
                        >
                            <span>Drop .csv or .tsv file here or click to upload.</span>
                        </CSVReader>
                        

                        <label className="bold">Headers: {this.state.headers}</label>

                        <hr />
                        
                        <div>
                            <label>Errors or other messages below:</label>
                            <textarea className="errors" value={this.state.otherError} />
                        </div>

                        <button type="button" className="button" id="submitCSVGeoLinks" 
                                disabled = {!this.state.canImportCSV || this.state.disabled} 
                                onClick  = {() => this.importCSVHandler(this.autoValidate,'geojson/import_geo_links')}
                        >
                            Import Meta/GeoJSON link data (sets custom geo ID link by meta ID)
                        </button>

                        <div className="loader-holder">
                            <div className="lds-ellipsis" hidden={!this.state.busy}><div></div><div></div><div></div><div></div></div>
                        </div>

                        <h3 className="infoLabel">
                            {"CSV upload status: " + this.state.csvLabel}
                        </h3>
                        <label className="loginErrorLabel">
                            {this.state.csvError}
                        </label>
                        
                        <div className="importFile">
                            <h1>Results from CSV import:</h1>
                            <textarea value={this.state.results} />
                        </div>
                        
                    </div>
                </div>

            </div>
        );
    }

}