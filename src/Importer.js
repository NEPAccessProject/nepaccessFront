import React, {Component} from 'react';
import {Helmet} from 'react-helmet';

import Dropzone from 'react-dropzone';

import Select from 'react-select';
import Creatable from 'react-select/creatable';
import DatePicker from "react-datepicker";

import { CSVReader } from 'react-papaparse';

import axios from 'axios';
import Globals from './globals';

import './importer.css';
import { ReactTabulator } from 'react-tabulator';

const options = Globals.tabulatorOptions;

/** Importer.js
 *  * Support for multiple files and also for a .csv which would be processed and should probably require:
    * - require, handle metadata+file link info (filename/foldername); handle loose/missing files in Spring and other components)
    * - typically require title, federal_register_date, document, state, agency 
 *  * multiple file upload functionality for a single record
 **/

// file: null would just become files: [] and files: evt.target.files instead of files[0]?

const agencyOptions = Globals.agencies;

const stateOptions = Globals.locations;

const typeOptions = [ { value: 'Final', label: 'Final' },{value: 'Draft', label: 'Draft'} 
];

const delimiterOptions = [{value:"", label:"auto-detect"}, {value:",", label:","}, {value:"\t", label:"tab"}
];

class Importer extends Component {

    constructor(props) {
        super(props);

        this.onDrop = (dropped) => {
            this.setState({
                files: dropped,
                dragClass: '',
                totalSize: 0
            }, ()=> {
                console.log(this.state.files);

                let _totalSize = 0;
                for(let i = 0; i < this.state.files.length; i++) {
                    _totalSize += this.state.files[i].size;
                }

                this.setState({
                    baseDirectory: this.getDirectoryName(),
                    basePath: this.getPath(),
                    totalSize: _totalSize
                });

                console.log("Base directory should be " + this.getDirectoryName());
            });
        };

        this.onDragEnter = (e) => {
            this.setState({
                dragClass: 'over'
            });
        }
    
        this.onDragLeave = (e) => {
            this.setState({
                dragClass: ''
            });
        }

        this.state = { 
            networkError: '',
            successLabel: '',
            titleLabel: '',
            csvLabel: '',
            csvError: '',
            admin: false,
            disabled: false,
            file: null,
            csv: null,
            canImportCSV: false,
            busy: false,
            filename: '',
            doc: {
                title: '',
                federal_register_date: '',
                state: '',
                agency: '',
                document: '',
                commentsFilename: '',
                filename: '',
            },
            dragClass: '',
            delimiter: {value:"", label:"auto-detect"}, // auto-detect
            files: [],
            importOption: "csv",
            baseDirectory: '',
            basePath: '',
            totalSize: 0,
            uploaded: 0,

            reportBusy: false,
            headers: '',
            columns: [],
            data: [],

            shouldReplace: false,
            filenames: [],
            filenamesRun: false
        };
        
        let checkUrl = new URL('user/checkCurator', Globals.currentHost);
        axios({
            url: checkUrl,
            method: 'POST'
          }).then(response => {
            console.log(`file: Importer.js:125 ~ Importer ~ constructor ~ response:`, response);
            let responseOK = response && response.status === 200;
            if (!responseOK) { // this probably isn't possible with current backend design (either 200 or error?)
                this.props.history.push('/');
            }
          }).catch(error => { // redirect
            this.props.history.push('/');
          })
          
          this.my_table = React.createRef();
    }

    checkAdmin = () => {
        let checkUrl = new URL('user/checkAdmin', Globals.currentHost);
        axios({
            url: checkUrl,
            method: 'POST'
        }).then(response => {
            console.log("Response", response);
            console.log("Status", response.status);
            let responseOK = response.data && response.status === 200;
            if (responseOK) {
                this.setState({
                    admin: true
                });
            } else {
                console.log("Else");
            }
        }).catch(error => {
            //
        })
    }



    getPath = () => {
        // full path that will be uploaded...  in Edge/Chrome at least, so user knows exactly what
        // directory structure they dropped in?
        return this.state.files[0].path;
    }

    /** Return the base directory of a folder drop to display to user */
    getDirectoryName = () => {
        //this logic works for both Edge and Chrome (10/30/2020), expected first folder format: /folder/
        let pathSegments = this.state.files[0].path.split('/');
        console.log(`file: Importer.js:169 ~ Importer ~ pathSegments:`, pathSegments);
        let baseFolder = "";
        if(pathSegments[1] && pathSegments[0].length === 0 && pathSegments[1].length > 0) {
            baseFolder = pathSegments[1];
        }
        console.log(`file: Importer.js:174 ~ Importer ~ baseFolder:`, baseFolder);
        return baseFolder;
    }

    getFilenameOnly = (idx) => {
        let pathSegments = this.state.files[idx].path.split('/');
        if(pathSegments) {
            return pathSegments[(pathSegments.length - 1)];
        } else {
            return null;
        }
    }

    /** returns true if this.state.shouldReplace or if the file at idx is a .zip and it is in the list of missing filenames */
    shouldUpload = (idx) => {
        console.log(`file: Importer.js:189 ~ Importer ~ idx:`, idx);
        if(this.state.shouldReplace) {
            return true;
        } else {
            // returns true if the file at idx is a .zip and it is in the list of missing filenames
            try {
                const filename = this.getFilenameOnly(idx);
                if(filename && (filename.substr(-4).toLocaleLowerCase() === ".zip")) {
                    return this.state.filenames.includes(filename);
                } else { // not a zip/no filename, that's a job for other logic
                    return true;
                }
            } catch(e) {
                return true;
            }
        }
    }

    // Pull full list of filenames with size < 200 bytes; compare on those
    getMissingFilenames = () => {
        this.setState({ reportBusy: true });

        let getUrl = Globals.currentHost + "test/findMissingFilenames";
        
        axios.get(getUrl, {
            params: {
                
            }
        }).then(response => {
            let responseOK = response && response.status === 200;
            if (responseOK && response.data) {
                return response.data;
            } else {
                return null;
            }
        }).then(parsedJson => { 
            if(parsedJson){
                this.setState({
                    filenames: parsedJson,
                    filenamesRun: true,
                    reportBusy: false
                });
            } else {
                console.log("Null");
            }
        }).catch(error => { // 401/404/...
            console.error(error);
            this.setState({ reportBusy: false, filenamesRun: true });
        });
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

    onChangeDummy = () => {

    }

    onChange = (evt) => {
        if(evt && evt.target){
    
            const name = evt.target.name;
            const value = evt.target.value;
    
            this.setState( prevState =>
            { 
                const updatedDoc = prevState.doc;
                updatedDoc[name] = value;
                return {
                    doc: updatedDoc
                }
            });
        }
    }

    onFileChange = (evt) => {
        if(evt != null && evt.target != null && evt.target.files[0] != null){ // Ignore aborted events
            this.setState({ 
                /** TODO: Add this component to record details modal and we can save it for the ID or title of that, 
                  * creating a link between metadata, file data, otherwise can create a new record with a new unique title and potentially more metadata **/
                file: evt.target.files[0],
                filename: evt.target.files[0].name // includes extension
            });
        }
    }

    onKeyUp = (evt) => {
        if(evt.keyCode === 13){
            evt.preventDefault();
            this.importFile();
        }
    }
    
    // set booleanOpton to name of radio button clicked
    onRadioChange = (evt) => {
        // console.log("Radio", evt.target.value);
        this.setState({ [evt.target.name]: evt.target.value });
    }
    
    handleOnDrop = (evt) => {

        let newArray = [];
        for(let i = 0; i < evt.length; i++){
            newArray.push(evt[i].data);
        }

        this.setState({ 
            csv: newArray,
            headers: getKeys(evt[0].data).toString().replaceAll(',',', ')
        }, () => {
            this.setState({ canImportCSV: true });
        });
    }

    handleOnRemoveFile = (evt) => { this.setState({ csv: null, canImportCSV: false }); }

    // Note: Just because errors are generated does not necessarily mean that parsing failed.
    handleOnError = (evt) => {}


    /** Validation */


    hasFiles = () => {
        let valid = true;
        let labelValue = "";

        if(this.state.files.length===0){ // No files
            valid = false;
            labelValue = "File(s) required";
        }
        
        this.setState({successLabel: labelValue});
        return valid;
    }

    validated = () => {
        let valid = true;
        let labelValue = "";

        if(!this.state.file && this.state.files.length===0){ // No file(s)
            valid = false;
            labelValue = "File is required";
        }

        if(this.state.doc.title.trim().length === 0){
            valid = false;
            this.setState({titleLabel: "Title required"});
        }
        if(this.state.doc.state.trim().length === 0){
            valid = false;
            this.setState({stateError: "State required"});
        } 
        if(this.state.doc.agency.trim().length === 0){
            valid = false;
            this.setState({agencyError: "Agency required"});
        } 
        // console.log("Date", this.state.doc.federal_register_date);
        if(!this.state.doc.federal_register_date || this.state.doc.federal_register_date.toString().trim().length === 0){
            valid = false;
            this.setState({dateError: "Date required"});
        } if (this.state.doc.document.trim().length === 0) {
            valid = false;
            this.setState({typeError: "Type required"});
        }

        if(labelValue.length===0 && valid === false){ // File, but invalid inputs
            labelValue = "Couldn't import: Please check inputs";
        }

        this.setState({successLabel: labelValue});
        return valid;
    }


    /** Files 
     * Upload limit determined by backend .properties e.g.
     *  server.tomcat.max-http-post-size=8GB
        spring.servlet.multipart.max-file-size=8GB
        spring.servlet.multipart.max-request-size=8GB
    */

    /** Import all files, one at a time, using doSingleImports() */ 
    bulkUpload = () => {
        if(!this.hasFiles()) {
            return;
        }

        document.body.style.cursor = 'wait';
        
        this.setState({ 
            networkError: '',
            importResults: '',
            successLabel: 'Uploading...  (this tab must remain open to finish)',
            disabled: true,
            busy: true,
            uploaded: 0
        }, () => {
            this.doSingleImport(0, this.state.files.length);
        });
    }
    
    // Tries to execute file upload and handles the results
    doImport = (i,limit) => {
        let networkString = '';
        let successString = '';
        let resultString = "" + this.state.importResults;

        let importUrl = new URL('file/uploadFilesBulk', Globals.currentHost);
            console.log(`file: Importer.js:433 ~ Importer ~ importUrl:`, importUrl);
        let uploadFiles = new FormData();
        uploadFiles.append("files", renameFile(this.state.files[i], this.state.files[i].path));

        axios({ 
            method: 'POST',
            url: importUrl,
            headers: {
                'Content-Type': "multipart/form-data"
            },
            data: uploadFiles
        }).then(response => {
            console.log(`file: Importer.js:446 ~ Importer ~ response:`, response);
            // console.log("Import response",response);
            let responseOK = response && response.status === 200;
            if (responseOK) {
                
                let responseArray = response.data;
                responseArray.forEach(element => {
                    resultString += element + "\n";
                });

                return true;
            } else { 
                return false;
            }
        }).then(success => {
            if(success){
                successString = "Successfully imported.";
            } else {
                successString = "Failed to import."; // Server down?
            }

            if(i+1 < limit) {
                this.setState({
                    importResults: resultString,
                    uploaded: (this.state.uploaded + this.state.files[i].size)
                }, () => {
                    this.doSingleImport((i+1), limit);
                });
            } else {
                document.body.style.cursor = 'default'; 

                this.setState({
                    networkError: networkString,
                    successLabel: successString,
                    importResults: resultString,
                    disabled: false,
                    busy: false
                });
        
            }
        }).catch(error => {
            document.body.style.cursor = 'default'; 
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
            console.error('error message', error);
            this.setState({
                networkError: networkString,
                successLabel: successString,
                importResults: resultString,
                disabled: false,
                busy: false
            });
    
        });
    }

    /** doImport() until we hit the length of this.state.files, 
     * skip upload if we won't be able to link */ 
    doSingleImport(i,limit) {
        let resultString = "" + this.state.importResults;

        // skip 0 byte files
        if(this.state.files[i] && this.state.files[i].size != null && this.state.files[i].size === 0) {
            resultString += this.state.files[i].path + ": Skipped uploading (0 byte file)\n";
            console.log(`file: Importer.js:519 ~ Importer ~ doSingleImport ~ resultString:`, resultString);
            if(i+1 < limit) {
                this.setState({
                    importResults: resultString,
                    uploaded: (this.state.uploaded + this.state.files[i].size)
                }, () => {
                    this.doSingleImport((i+1), limit);
                });
            } else {
                document.body.style.cursor = 'default'; 

                this.setState({
                    networkError: "",
                    successLabel: "Done",
                    importResults: resultString,
                    disabled: false,
                    busy: false
                }, () => {
                    this.getMissingFilenames();
                });
            }
        }
        // Check with server about if we can link
        // Backend takes path and derives both folder name and type if possible
        else if(this.state.files[i].path) {
            let getUrl = Globals.currentHost + 'file/can_link_folder_type';
            
            axios.get(getUrl, {
            params: {
                path: this.state.files[i].path
            }
            }).then(response => {
                // data should be boolean
                if (response && response.data && this.shouldUpload(i)) { 
                    console.log(`file: Importer.js:551 ~ Importer ~ doSingleImport ~ response:`, response);
                    // import
                    this.doImport(i,limit);
                } else {
                    // skip upload
                    if(!response || !response.data) {
                        resultString += this.state.files[i].path + ": Skipped uploading (no metadata record to link to)\n";
                    } else if(!this.shouldUpload(i)) {
                        resultString += this.state.files[i].path + ": Skipped uploading (file already uploaded)\n";
                    }

                    if(i+1 < limit) {
                        this.setState({
                            importResults: resultString,
                            uploaded: (this.state.uploaded + this.state.files[i].size)
                        }, () => {
                            this.doSingleImport((i+1), limit);
                        });
                    } else {
                        document.body.style.cursor = 'default'; 

                        this.setState({
                            networkError: "",
                            successLabel: "Done",
                            importResults: resultString,
                            disabled: false,
                            busy: false
                        }, () => {
                            this.getMissingFilenames();
                        });
                    }
                }
            }).catch(error => { 
                // May as well try to process it
                console.error(error);

                this.doImport(i,limit);
            })
        } else {
            // May as well try to process it; probably .zip
            this.doImport(i,limit);
        }
    }

    uploadFiles = () => {
        if(!this.validated()) {
            return;
        }
        
        document.body.style.cursor = 'wait';
        this.setState({ 
            networkError: '',
            titleLabel: '',
            agencyError: '',
            stateError: '',
            typeError: '',
            dateError: '',
            disabled: true ,
            busy: true
        });
        
        let importUrl = new URL('file/uploadFiles', Globals.currentHost);

        let uploadFiles = new FormData();
        for(let i=0; i < this.state.files.length; i++){
            uploadFiles.append("files", renameFile(this.state.files[i], this.state.files[i].path));
        }
        uploadFiles.append("doc", JSON.stringify(this.state.doc));
        console.log(`file: Importer.js:619 ~ Importer ~ uploadFiles:`, uploadFiles);

        let networkString = '';
        let successString = '';

        axios({ 
            method: 'POST',
            url: importUrl,
            headers: {
                'Content-Type': "multipart/form-data"
            },
            data: uploadFiles
        }).then(response => {
            console.log(`file: Importer.js:632 ~ Importer ~ response:`, response);
            let responseOK = response && response.status === 200;
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
                networkError: networkString,
                successLabel: successString,
                disabled: false,
                busy: false
            });
    
            document.body.style.cursor = 'default'; 
        });


        function renameFile(originalFile, newName) {
            return new File([originalFile], newName, {
                type: originalFile.type,
                lastModified: originalFile.lastModified,
            });
        }
    }

    importFile = () => {
        if(!this.validated()) {
            return;
        }
        
        document.body.style.cursor = 'wait';
        this.setState({ 
            networkError: '',
            titleLabel: '',
            agencyError: '',
            stateError: '',
            typeError: '',
            dateError: '',
            disabled: true 
        });
        
        let importUrl = new URL('file/uploadFile', Globals.currentHost);
        console.log(`file: Importer.js:694 ~ Importer ~ importUrl:`, importUrl);

        let uploadFile = new FormData();
        uploadFile.append("file", this.state.file);
        uploadFile.append("doc", JSON.stringify(this.state.doc));
        
        // uploadFile.append('file', new Blob([this.state.file]) );
        // uploadFile.append('file', new Blob([this.state.file], { type: 'text/csv' }) );

        // console.log(this.state.doc);
        // console.log(this.state.file);

        // axios.post(importUrl, uploadFile, { 
        //     headers: { 'Content-Type': 'multipart/form-data' } 
        // });
        // return;

        let networkString = '';
        let successString = '';

        axios({ 
            method: 'POST',
            url: importUrl,
            headers: {
                'Content-Type': "multipart/form-data"
            },
            data: uploadFile
        }).then(response => {
            console.log(`file: Importer.js:722 ~ Importer ~ response:`, response);
            let responseOK = response && response.status === 200;
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
                networkError: networkString,
                successLabel: successString,
                disabled: false
            });
    
            document.body.style.cursor = 'default'; 
        });

    }


    /** CSVs/TSVs/otherwise recognized delimited data */


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
            
            // Handle abnormal headers here
            if(newKey==="document_type" || newKey==="documenttype"){ 
                newKey="document";
            }
            if(newKey==="file name" || newKey==="file names" || newKey==="files"){
                newKey = "filename";
            }
            if(newKey==="register_date" || newKey==="registerdate"){
                newKey = "federal_register_date";
            }
            if(newKey==="comment_date" || newKey==="commentdate"){
                newKey = "epa_comment_letter_date";
            }
            if(newKey==="folder"){
                newKey = "eis_identifier";
            }
            if(newKey==="web_link"){
                newKey = "link";
            }
            if(newKey==="processid"){
                newKey = "process_id";
            }
            if(newKey==="firstroddate" || newKey ==="1st_rod_date"){
                newKey = "first_rod_date";
            }
            if(newKey==="commentsfilename") {
                newKey = "comments_filename";
            }
            if(newKey==="cooperatingagency") {
                newKey = "cooperating_agency";
            }


            // handle unstandardized weirdness we can predict for process imports here
            if(newKey==="draftid") {
                newKey = "draft_id";
            }
            if(newKey==="ds_id") {
                newKey = "draftsup_id";
            }
            if(newKey==="secds_id") {
                newKey = "secdraftsup_id";
            }
            if(newKey==="revisedfinal_id") {
                newKey = "revfinal_id";
            }
            
            newObj[newKey] = importRow[key];

            // Try to separate by ;, move appropriate value to new comments_filename column
            if(newKey==="filename" && importRow[key]) {
                // "Filename" could be only comments, so reset it first
                newObj["filename"] = "";
                try {
                    let files = importRow[key].split(';');
                    if(files && files.length > 0) {
                        files.forEach(filename => {
                            // If comment, send to comments_filename column
                            if(filename.includes("CommentLetters")) {
                                newObj["comments_filename"] = filename;
                            }
                            // If EIS, replace with only EIS filename in filename column
                            else if(filename.includes("EisDocument")) {
                                newObj["filename"] = filename;
                            } else { // Novel format? Just add as-is
                                newObj["filename"] = filename;
                            }
                        });
                    }
                } catch(e) {
                    console.log("Filename parsing error",e);
                }
            }
        }

        // console.log("New row",newObj);
        return newObj;
    }
    
    // helper methods for validation

    requiredHeadersTitleRegisterDateType(headers) {
        return (   'title' in headers 
                && 'federal_register_date' in headers 
                && 'document' in headers );
    }
    requiredHeadersTitleAgencyDocumentFile(headers) {
        return ('title' in headers 
                && 'agency' in headers 
                && 'document' in headers
                && ('filename' in headers || 'eis_identifier' in headers));
    }
    requiredHeadersTitleAgencyRegisterDateStateTypeFile(headers) {
        return ('title' in headers 
                && 'agency' in headers 
                && 'federal_register_date' in headers 
                && 'state' in headers 
                && ('document' in headers) 
                && ('filename' in headers || 'eis_identifier' in headers));
    }

    // validation

    // require just about everything
    csvValidated = (csv) => {
        let result = false;
        if(csv[0]){
            let headers = csv[0];
            // headers.forEach(header => console.log(header));
    
            // Check headers:
            result = this.requiredHeadersTitleRegisterDateType(headers);
    
            if(!result){
                this.setState({
                    csvError: "Missing one or more headers (title, federal register date, document)"
                });
            }
        } else {
            this.setState({
                csvError: "No headers found or no data found"
            });
        }

        return result;
    }
    // only require title/agency/document and either filename or eis identifier
    csvConstrainedValidated = (csv) => {
        let result = false;
        if(csv[0]){
            let headers = csv[0];
            result = this.requiredHeadersTitleAgencyDocumentFile(headers);
    
            if(!result){
                this.setState({
                    csvError: "Missing one or more headers (title, agency, document, filename/EIS Identifier)"
                });
            }
        } else {
            this.setState({
                csvError: "No headers found or no data found"
            });
        }

        return result;
    }
    // require only title
    titleOnlyValidate = (csv) => {
        if(csv[0] && 'title' in csv[0]){
            return true;
        } else {
            return false;
        }
    }
    // require only state, id
    stateIdOnlyValidate = (csv) => {
        if(csv[0] && 'id' in csv[0] && 'state' in csv[0]){
            return true;
        } else {
            return false;
        }
    }
    // no requirements; let backend deal with invalid data
    autoValidate = (csv) => {
        return true;
    }

    // CSV/TSV import

    /**  Expects these headers:
    * Title, Document, EPA Comment Letter Date, Federal Register Date, Agency, State, EIS Identifier or  
    * Filename, Cooperating agencies, Edited by, Edited on, Link, Summary, Notes.
    * Expects .tsv or .csv.
    * Tries to handle nonstandard input (ex. "file name" header and handling ;-delimited eis archive
    * plus comment letter in the same column) */
    importCSVHandler = (validation, urlToUse) => {
        let newCSV = [];
        for(let i = 0; i < this.state.csv.length; i++){
            let keys = Object.keys(this.state.csv[i]);

            if(!this.state.csv[i][keys[0]]) {
                // EOF?
            } else {
                newCSV[i] = this.translateRow(this.state.csv[i]);
                // Note: Space normalization now handled by backend entirely?  No need for this?
                if(newCSV[i]["title"]) {
                    newCSV[i]["title"] = newCSV[i]["title"].replace(/\s{2,}/g, ' ');
                }
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
            busy: true
        });

        
        let importUrl = new URL(urlToUse, Globals.currentHost);

        let uploadFile = new FormData();
        uploadFile.append("csv", JSON.stringify(newCSV));

        let networkString = '';
        let successString = '';
        let resultString = "";

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
                busy: false
            });
    
            document.body.style.cursor = 'default'; 
        });
    }



    showDate = () => {
        const setRegisterDate = (date) => {
            // console.log(date);
            this.setState( prevState =>
                { 
                    const updatedDoc = prevState.doc;
                    updatedDoc['federal_register_date'] = date;
                    return {
                        doc: updatedDoc
                    }
                }, () => {
                    // console.log(this.state.doc);
                }
            );
        }
        return (
            <DatePicker
                selected={this.state.doc.federal_register_date} 
                onChange={date => setRegisterDate(date)}
                name='federal_register_date'
                dateFormat="yyyy-MM-dd" placeholderText="YYYY-MM-DD"
                className="date no-margin" 
            />
        )
    }




    /* constructs a simple directory view from a filesystem */
    // makedir = (entries) => {

    //     const systems = entries.map(entry => traverse(entry, {}));
    //     return Promise.all(systems);

    //     async function traverse(entry, fs) {
    //         if (entry.isDirectory) {
    //         fs[entry.name] = {};
    //         let dirReader = entry.createReader();
    //         await new Promise((res, rej) => {
    //             dirReader.readEntries(async entries => {
    //             for (let e of entries) {
    //                 await traverse(e, fs[entry.name]);
    //             }
    //             res();
    //             }, rej);
    //         });
    //         } else if (entry.isFile) {
    //         await new Promise((res, rej) => {
    //             entry.file(file => {
    //                 fs[entry.name] = file;
    //                 res();
    //             }, rej);
    //         });
    //         }
    //         return fs;
    //     }
    // }

    // readDropped = (dT) => {
    //     const entries = [...dT.items].map(item => {
    //         return item.webkitGetAsEntry ? item.webkitGetAsEntry() : null;
    //         })
    //         .filter(entry => entry);
    //     if (entries.length) {
    //         this.makedir(entries)
    //         .then(this.output)
    //         .catch(this.handleSecurityLimitation);
    //     } 
    //     else {
    //         this.notadir();
    //     }

    // }

    // notadir = () => {
    //     this.setState({
    //         logText:  "wasn't a directory, or webkitdirectory is not supported"
    //     });
    // }

    // dropzoneOndragover = e => {
    //     if(e){
    //         e.preventDefault();
    //         this.setState({ dropzoneClass: 'over' });
    //     }
    // }
    
    // dropZoneDragStart = e => { /** do nothing */ }

    // dropzoneOnDragExit = e => { 
    //     if(e){
    //         this.setState({ dropzoneClass: '' });
    //     }
    // }

    // dropzoneOnDrop = e => {
    //     if(e){
    //         e.preventDefault();
    //         this.setState({ dropzoneClass: '' });
    //         this.readDropped(e.dataTransfer);
    //     }
    // }

    // output = (system_trees) => {
    //     console.log(system_trees);

    //     this.setState({
    //         files: []
    //     }, () => {
    //         this.setState({
    //             logText: JSON.stringify(system_trees, checkFile, 2)
    //         });
    //         this.uploadFiles(system_trees);
    //     });
        

    //     function checkFile(key, value) {
    //         if (value instanceof File) {
    //             return '{[File] ' + value.name + ', ' + value.size + 'b}';
    //         } else {
    //             return value;
    //         }
    //     }
    // }  

    // handleSecurityLimitation = (error) => {
    //     console.error(error);
    // }

    // these won't work for non admins so no need to show them to others
    renderAdminButtons = () => {
        let result;
        if(this.state.admin) {
            result = (<>
                <button type="button" className="button" id="submitCSVProcess" disabled={!this.state.canImportCSV || this.state.disabled} 
                        onClick={() => this.importCSVHandler(this.autoValidate,'file/uploadCSV_processes')}>
                    (admin) Process add tool
                </button>
            </>);
        }

        return result;
    }


    
    getAllDocs = () => {
        this.setState({ reportBusy: true });

        let getUrl = Globals.currentHost + "test/findAllDocs";
        
        axios.get(getUrl, {
            params: {
                
            }
        }).then(response => {
            let responseOK = response && response.status === 200;
            if (responseOK && response.data) {
                return response.data;
            } else {
                return null;
            }
        }).then(parsedJson => { 
            let newColumns = [];
            let headers = getKeys(parsedJson[0]);

            for(let i = 0; i < headers.length; i++) {
                newColumns[i] = {title: headers[i], field: headers[i], width: 100, headerFilter: "input"};
            }

            if(parsedJson){
                this.setState({
                    columns: newColumns,
                    data: parsedJson,
                    response: Globals.jsonToTSV(parsedJson),
                    reportBusy: false
                });
            } else {
                console.log("Null");
            }
        }).catch(error => { // 401/404/...
            console.error(error);
            this.setState({ reportBusy: false });
        });
    }


    render() {

        const files = this.state.files.map(file => (
            <li key={file.name}>
              {file.name} - {file.size} bytes
            </li>
        ));

        const customStyles = {
            option: (styles, state) => ({
                 ...styles,
                borderBottom: '1px dotted',
	            backgroundColor: 'white',
                color: 'black',
                '&:hover': {
                    backgroundColor: '#b2c5f5'
                },
                // ':active': {
                //     ...styles[':active'],
                //     backgroundColor: !isDisabled && (isSelected ? data.color : color.alpha(0.3).css()),
                //   },
                //   padding: 20,
            }),
            control: (styles) => ({
                ...styles,
                backgroundColor: 'white',
            })
        }

        return (
            <div className="form content">
                <Helmet>
                    <title>NEPAccess</title>
                    <link rel="canonical" href="https://nepaccess.org/import" />
                    <meta name="robots" content="noindex, nofollow" data-react-helmet="true" />
                </Helmet>
                
                <div className="note">
                    Import New Data
                </div>
                
                <label className="networkErrorLabel">
                    {this.state.networkError}
                </label>
                
                <div className="padding-all">

                    <h3 className="green">Current docs</h3>

                    <ReactTabulator
                        ref={this.my_table}
                        data={this.state.data}
                        columns={this.state.columns}
                        options={options}
                    />

                    <button className="button" onClick={this.getAllDocs}>Get or refresh view of all current metadata</button>
                    <button className="button" onClick={this.downloadResults}>Save full metadata table as tab-separated values file</button>

                </div>

                <div className="loader-holder">
                    <div className="lds-ellipsis" hidden={!this.state.reportBusy}><div></div><div></div><div></div><div></div></div>
                </div>
                

                <div className="import-meta">

                    <span className="advanced-radio" >
                        <label className="flex-center no-select cursor-pointer">
                            <input type="radio" className="cursor-pointer" name="importOption" value="csv" onChange={this.onRadioChange} 
                            defaultChecked />
                            Spreadsheet (.tsv or .csv)
                        </label>
                        <label className="flex-center no-select cursor-pointer">
                            <input type="radio" className="cursor-pointer" name="importOption" value="bulk" onChange={this.onRadioChange} 
                            />
                            Bulk file import (for adding and linking files to existing metadata)
                        </label>
                        {/* <label className="flex-center no-select cursor-pointer">
                            <input type="radio" className="cursor-pointer" name="importOption" value="single" onChange={this.onRadioChange} 
                            />
                            Single document
                        </label> */}
                    </span>

                    <hr />

                    <div className="importFile" hidden={this.state.importOption !== "csv"}>
                        <h2>Instructions:</h2>
                        <h3>One .tsv/.csv at a time supported.  </h3>
                        <h3>Header names must be exact.  </h3>
                        <h3>Expected date format: yyyy-MM-dd or MM-dd-yyyy</h3>
                        <h3>"EIS Identifier" must represent a foldername that will be uploaded with files in it. 
                            The file system expects subfolders. 
                            The "Document" field must be exactly the same as the subfolder name.  </h3>
                        <h3>Example: If you are going to upload NSF/NSF_00001/Final/file.pdf, then the corresponding CSV line must say Final under the Document header, and NSF_00001 for the EIS Identifier.  
                            When uploading, use bulk file import and drag the entire NSF/ base folder in.  
                            Otherwise, there will be incorrect search results and wrong/unavailable files listed for download.  
                            </h3>
                        <h3>The system detects matches by title, register date and document type.  
                            All non-blank, valid fields will overwrite existing fields. 
                            Existing metadata will be updated if it's a match except for the filename/folder values when there are files on disk. </h3>
                        <h3>If you're sure you want to overwrite existing folder or filenames, then use the Force Update header and put Yes for that row.
                            </h3>
                        <h3>Valid, non-duplicate data will become new metadata records.
                            </h3>
                        <h3>Update by internal ID works exactly the same, except it matches only by ID, and it does not add new records.
                            </h3>

                        <hr />
                        <h3>Required headers: Document, Federal Register Date, Title</h3>
                        <h3>Optional headers: Agency, State, Link, Notes, Comments Filename, EPA Comment Letter Date, Cooperating Agency, Summary, County, Subtype, Status, EIS identifier, Filename, Process ID, Force Update</h3>
                        
                        <hr />

                        <h1>Import CSV/TSV:</h1>
                        <label className="advanced-label">Delimiter to use (default auto-detect) </label>
                        <Creatable id="delimiter" className="multi inline-block" classNamePrefix="react-select" name="delimiter" isSearchable isClearable 
                                        styles={customStyles}
                                        options={delimiterOptions}
                                        selected={this.state.delimiter}
                                        onChange={this.onDelimiterChange} 
                                        placeholder="Type or select delimiter" 
                        />
                        <CSVReader
                            onDrop={this.handleOnDrop}
                            onError={this.handleOnError}
                            style={{}}
                            config={{
                                header:true,
                                delimiter: this.state.delimiter.value
                            }}
                            addRemoveButton
                            onRemoveFile={this.handleOnRemoveFile}
                        >
                            <span>Drop CSV file here or click to upload.</span>
                        </CSVReader>
                        <label className="bold">Headers: {this.state.headers}</label>

                        <button type="button" className="button" id="submitCSVDummy" disabled={!this.state.canImportCSV || this.state.disabled} 
                                onClick={() => this.importCSVHandler(this.csvValidated,'file/uploadCSV_dummy')}>
                            Test Import (Would-be results are returned, but nothing is added to database)
                        </button>
                        <button type="button" className="button" id="submitCSV" disabled={!this.state.canImportCSV || this.state.disabled} 
                                onClick={() => this.importCSVHandler(this.csvValidated,'file/uploadCSV')}>
                            Import CSV/TSV
                        </button>
                        
                        <button type="button" className="button" id="submitCSVIDs" disabled={!this.state.canImportCSV || this.state.disabled} 
                                onClick={() => this.importCSVHandler(this.autoValidate,'file/uploadCSV_ids')}>
                            Update all incoming columns for existing records by internal ID, ignores missing incoming columns
                        </button>

                        {this.renderAdminButtons()}

                        <div className="loader-holder">
                            <div className="lds-ellipsis" hidden={!this.state.busy}><div></div><div></div><div></div><div></div></div>
                        </div>

                        <h3 className="infoLabel">
                            {"CSV upload status: " + this.state.csvLabel}
                        </h3>
                        <label className="loginErrorLabel">
                            {this.state.csvError}
                        </label>
                        
                        <div className="importFile" hidden={this.state.importOption!=="csv"}>
                            <h1>Results from CSV import:</h1>
                            <textarea value={this.state.results} />
                        </div>
                        

                        
                    </div>

                    <div hidden={this.state.importOption !== "single"}>
                        <h1>
                            Import single record:
                        </h1>
                        
                        <div className="center title-container">
                            <div id="fake-search-box-import" className="inline-block">
                                <label className="loginErrorLabel">
                                    {this.state.titleLabel}
                                </label>
                                <input className="search-box" 
                                    name="title" 
                                    placeholder="Title" 
                                    value={this.state.doc.title}
                                    autoFocus 
                                    onChange={this.onChange}
                                />
                            </div>
                        </div>
                    

                        <table id="advanced-search-box" className="import-table"><tbody>
                            <tr>
                                <td>
                                    <label className="advanced-label" htmlFor="agency">Lead agency</label>
                                    <Select id="searchAgency" className="multi inline-block" classNamePrefix="react-select" name='agency' isSearchable isClearable 
                                        styles={customStyles}
                                        options={agencyOptions} 
                                        selected={this.state.doc.agency}
                                        onChange={this.onSelect} 
                                        placeholder="Type or select lead agency" 
                                        // (temporarily) specify menuIsOpen={true} parameter to keep menu open to inspect elements.
                                        // menuIsOpen={true}
                                    />
                                    <label className="loginErrorLabel">{this.state.agencyError}</label>
                                </td>
                                <td>
                                    <label className="advanced-label" htmlFor="state">State</label>
                                    <Select id="searchState" className="multi inline-block" classNamePrefix="react-select" name="state" isSearchable isClearable 
                                        styles={customStyles}
                                        options={stateOptions} 
                                        selected={this.state.doc.state}
                                        onChange={this.onSelect} 
                                        placeholder="Type or select state" 
                                    />
                                    <label className="loginErrorLabel">{this.state.stateError}</label>
                                </td>
                                
                                <td>
                                    {/**TODO: Grab all types from db? */}
                                    <label className="block advanced-label">Document type</label>
                                    {/** Creatable allows custom value, vs. Select */}
                                    <Creatable id="searchType" className="multi inline-block" classNamePrefix="react-select" name="document" isSearchable isClearable 
                                        styles={customStyles}
                                        options={typeOptions} 
                                        selected={this.state.doc.document}
                                        onChange={this.onSelect} 
                                        placeholder="Type or select document type" 
                                    />
                                    <label className="loginErrorLabel">{this.state.typeError}</label>
                                </td>

                            </tr>

                            <tr>
                                <td>
                                    <label className="advanced-label" htmlFor="federal_register_date">Date</label>
                                    <div id="date">
                                        {this.showDate()}
                                        <label className="loginErrorLabel">{this.state.dateError}</label>
                                    </div>
                                </td>
                            </tr>
                        </tbody></table>
                    
                
                        <div className="importFile">
                            <h2>
                                Option 1: Import with single file
                            </h2>
                            <div>
                                <label className="infoLabel">
                                    Note: Full text search may only function with .zip or .pdf uploads
                                </label>
                                <input title="Test" type="file" id="file" className="form-control" name="file" disabled={this.state.disabled} onChange={this.onFileChange} />
                            </div>
                        </div>
                        
                        <div className="importFile">
                            <button type="button" className="button" id="submitImport" disabled={this.state.disabled} onClick={this.importFile}>
                                Import Single Record With File
                            </button>
                        </div>
                    </div>
                    
                    
                    
                    <div className="importFile" hidden={this.state.importOption==="csv"}>
                        <div hidden={this.state.importOption !=="bulk"}>
                            <h2>Instructions:</h2>
                            <h3>Tested on Chrome and Edge, in Windows.  Results on other OSes/browsers is unpredictable.  Size cap 8GB</h3>
                            <h3>Import one or more directories, or import loose archives if appropriate.</h3>
                            <h3>If you have a structure like NSF/NSF_00001/..., you can drag the entire NSF folder in, or you can drag one or more identifying folders in (e.g. NSF_00001, NSF_00002, ...).  
                                If you're dragging the identifying folders in and not their base agency folder, then the folder must start with the base folder name followed by an underscore.  
                                So if you drag in EPA_5555, the system will still put the files in EPA/EPA_5555/.  </h3>
                            <h3>The system will check to see if each file has been converted to text and added to the database for the associated record before.  
                                If so, it's regarded as a duplicate and skipped.  
                                If there is no association found between the folder name and an existing EIS Identifier in the metadata, it's skipped.  
                                If there is a subfolder for document type like with EPA_5000/Final/..., the system will try to match the files with a metadata record with EIS Identifier EPA_5000 and document type Final.  
                                </h3>
                            <h3>The more new files being uploaded, the longer it will take.  The system also takes a bit to extract from archives, convert PDFs to text, add to database and index that text.</h3>

                            <hr></hr>

                            <h1>Bulk import:</h1>

                            <label>
                                Skip uploading existing archives
                                <input type="checkbox" 
                                    onClick={() => this.setState({shouldReplace: !this.state.shouldReplace})} 
                                    checked={!this.state.shouldReplace} />
                            </label>
                            
                            <h4>(Function: Upload new directories with PDFs, or standalone archives of PDFs)</h4>
                        </div>
                        <h2 hidden={this.state.importOption !== "single"}>Option 2: Import with multiple files</h2> 
                        

                        <Dropzone onDrop={this.onDrop} onDragEnter={this.onDragEnter} onDragLeave={this.onDragLeave} >
                            {({getRootProps, getInputProps}) => (
                                <section>
                                    <div className={this.state.dragClass} {...getRootProps({id: 'dropzone'})}>
                                        <input {...getInputProps()} />
                                        <span className="drag-inner-text">
                                            Drag and drop file(s), or directory/directories, here
                                        </span>
                                    </div>
                                    <aside className="dropzone-aside">
                                        <h3>First path found (either a unique .zip or should look like: /ABC/ABC_####/TYPE/....pdf, or: /ABC_####/TYPE/....pdf):</h3>
                                        <ul>{this.state.basePath}</ul>
                                        <h4>First folder found:</h4>
                                        <ul>{this.state.baseDirectory}</ul>
                                        <h4>All files found:</h4>
                                        <ul>{files}</ul>
                                        <h4>Total size:</h4>
                                        <ul>{Math.round(this.state.totalSize / 1024 / 1024)} MB</ul>
                                    </aside>
                                </section>
                            )}
                        </Dropzone>
                        
                        <button hidden={this.state.importOption !== "single"} type="button" className="button" id="submit" 
                                disabled={this.state.disabled} onClick={this.uploadFiles}>
                            Import Single Record with Multiple Files
                        </button>
                        <button hidden={this.state.importOption !== "bulk"} type="button" className="button" id="submitBulk" 
                                disabled={this.state.disabled} onClick={this.bulkUpload}>
                            Import Directories or Archives to Link with Existing Metadata
                        </button>
                        
                        <div className="loader-holder">
                            <div className="lds-ellipsis" hidden={!this.state.busy}><div></div><div></div><div></div><div></div></div>
                        </div>

                        <h3 className="infoLabel green">
                            {"Import status: " + this.state.successLabel}
                        </h3>
                        <div><label hidden={this.state.importOption === "csv" || !this.state.busy}>
                            <b>Uploaded: {Math.floor((this.state.uploaded / 1024 / 1024))} MB : ({Math.round((this.state.uploaded / this.state.totalSize)*100)}%)</b>
                        </label></div>
                        
                        <label hidden={this.state.importOption === "csv"}>
                            <b>Import results/server response:</b>
                        </label>
                        <textarea hidden={this.state.importOption !== "bulk"}
                            value={this.state.importResults} onChange={this.onChangeDummy}>
                        </textarea>
                    </div>
                </div>
                <hr />
            </div>
        )
    }

    
    // best performance is to Blob it on demand
    downloadResults = () => {
        if(this.state.response) {
            const csvBlob = new Blob([this.state.response]);
            const today = new Date().toISOString().split('T')[0];
            const csvFilename = `metadata_${today}.tsv`;

    
            if (window.navigator.msSaveOrOpenBlob) {  // IE hack; see http://msdn.microsoft.com/en-us/library/ie/hh779016.aspx
                window.navigator.msSaveBlob(csvBlob, csvFilename);
            }
            else {
                const temporaryDownloadLink = window.document.createElement("a");
                temporaryDownloadLink.href = window.URL.createObjectURL(csvBlob);
                temporaryDownloadLink.download = csvFilename;
                document.body.appendChild(temporaryDownloadLink);
                temporaryDownloadLink.click();  // IE: "Access is denied"; see: https://connect.microsoft.com/IE/feedback/details/797361/ie-10-treats-blob-url-as-cross-origin-and-denies-access
                document.body.removeChild(temporaryDownloadLink);
            }

        }
    }

    updateTable = () => {
        try {
            // seems necessary when using dynamic columns
            this.my_table.current.table.setColumns(this.state.columns);

            // this.my_table.current.table.replaceData(this.state.data);
        } catch (e) {
            console.error(e);
        }
    }

    componentDidUpdate() {
        if(this.my_table && this.my_table.current){
            this.updateTable();
        }
    }
    componentDidMount() {
        // console.log(this.state.importOption);
        this.checkAdmin();
        if(!this.state.filenamesRun) {
            this.getMissingFilenames();
        }
    }
}

export default Importer;

function renameFile(originalFile, newName) {
    return new File([originalFile], newName, {
        type: originalFile.type,
        lastModified: originalFile.lastModified,
    });
}

function getKeys(obj) {
    let keysArr = [];
    for (var key in obj) {
      keysArr.push(key);
    }
    return keysArr;
}