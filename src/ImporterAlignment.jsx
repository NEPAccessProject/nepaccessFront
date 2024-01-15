import React, {Component} from 'react';

import Dropzone from 'react-dropzone';

import axios from 'axios';
import Globals from './globals.jsx';

let reader;

/** Handle and prepare json in a way that Java will appreciate, then send it to backend and show the results to user */
export default class ImporterAlignment extends Component {

    constructor(props) {
        super(props);

        this.state = { 
            alignment: [],

            networkError: '',
            successLabel: "Not ready",
            failLabel: '',
            results: "",

            dragClass: '',
            files: [],
            
            disabled: false,
            busy: false,
        };
    }


    onDrop = (dropped) => {

        const setText = (text) => {
            let json = JSON.parse(text);

            // console.log("Text",text);
            console.log("JSON",json);
            // Note: Might expect each array to take ~5 seconds for 1000 items, so for 120 arrays, 10 minutes expected
            // However if we only care about "good" scores of .5 or .66 higher for example, it will likely take
            // 1% or 0.1% as much time.
            console.log("Base ID count", Object.keys(json).length);
            let baseIds = Object.keys(json);
            console.log(baseIds);
            let totalCount = 0;
            for(let baseId = 0; baseId < baseIds.length; baseId++) {
                totalCount += json[baseIds[baseId]].length;
            }
            // Might expect ~100,000+ if up to 200 arrays
            console.log("Total scores #: " + totalCount);

            this.setState({
                alignment: json,
                successLabel: "Ready"
            });
        }

        reader.onload = function(e) {
            let text = e.target.result;

            setText(text);
        };

        this.setState({
            files: dropped,
            dragClass: '',
        }, ()=> {
            console.log("Files", this.state.files);

            this.state.files.forEach((file)=> {
                console.log("File", file);

                reader.readAsText(file);
            });
        });

    };

    onDragEnter = (e) => {
        this.setState({
            dragClass: 'over'
        });
    }

    onDragLeave = (e) => {
        this.setState({
            dragClass: ''
        });
    }

    onChangeDummy = () => {}

    validated = () => {
        let valid = true;
        let labelValue = "";

        if(!this.state.alignment || this.state.alignment.length===0){ // No file(s)
            valid = false;
            labelValue = "File is required";
        }

        this.setState({failLabel: labelValue});
        return valid;
    }

    uploadAll = () => {
        const importUrl = new URL('file/import_json_alignment', Globals.currentHost);

        let uploadFile = new FormData();
        uploadFile.append("alignment", JSON.stringify(this.state.alignment));

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

            if(response.data) {
                let responseArray = response.data;
                responseArray.forEach(element => {
                    resultString += element + "\n";
                });
            } else {
                resultString += "No response data\n";
                responseOK = false;
            }
            
            if (responseOK) {
                return true;
            } else { 
                return false;
            }
        }).catch(error => {
            if(error.response) {
                if (error.response.status === 500) {
                    resultString += "\n::Internal server error.::";
                } else if (error.response.status === 404) {
                    resultString += "\n::Not found.::";
                } 
            } else {
                resultString += "\n::Server may be down (no response), please try again later.::";
            }
            console.error('error message ', error);

            return false;
        }).finally(e => { 
            this.setState({
                results : this.state.results.concat(resultString)
            });
        });

        // Finish
        this.setState({
            successLabel: 'Done',
            disabled: false,
            busy: false
        });
        document.body.style.cursor = 'default'; 
        
    }

    checkFileAPI = () => {
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            reader = new FileReader();

            return true; 
        } else {
            alert('The File APIs are not fully supported by your browser. Fallback required.');
            
            return false;
        }
    }


    render() {

        if(!Globals.curatorOrHigher()) {
            return <div className="content">
                401 Unauthorized (not admin or try logging in again?)
            </div>
        }

        const files = this.state.files.map(file => (
            <li key={file.name}>
              {file.name} - {file.size} bytes
            </li>
        ));

        return (
            <div className="form content">
                
                <div className="note">
                    Import New Alignment JSON Data
                </div>
                
                <label className="networkErrorLabel">
                    {this.state.networkError}
                </label>

                <div className="import-meta">
                    
                    <div className="importFile">
                        <div>
                            <h2>Instructions:</h2>
                            <h3>Drop .json file in box and click import to add alignment data to database.</h3>
                            <hr />
                        </div>

                        <Dropzone 
                            multiple={false} // Note: If we want to support multiple json files, this should be true
                            onDrop={this.onDrop} 
                            onDragEnter={this.onDragEnter} 
                            onDragLeave={this.onDragLeave} >
                            {({getRootProps, getInputProps}) => (
                                <section>
                                    <div className={this.state.dragClass} {...getRootProps({id: 'dropzone'})}>
                                        <input {...getInputProps()} />
                                        <span className="drag-inner-text">
                                            Drag and drop ONE file here, or click this box to use file explorer
                                        </span>
                                    </div>
                                    <aside className="dropzone-aside">
                                        <h4>File list:</h4>
                                        <ul>{files}</ul>
                                    </aside>
                                </section>
                            )}
                        </Dropzone>

                        
                        {/* <button type="button" className="button" id="submitBulk" 
                                disabled={this.state.disabled} onClick={this.uploadStart}>
                            Import All In Sequence
                        </button> */}
                        <button type="button" className="button" id="submitBulk" 
                                disabled={this.state.disabled} onClick={this.uploadAll}>
                            Import All At Once
                        </button>
                        <label className="errorLabel">{this.state.failLabel}</label>
                        
                        <div className="loader-holder">
                            <div className="lds-ellipsis" hidden={!this.state.busy}><div></div><div></div><div></div><div></div></div>
                        </div>

                        <h3 className="infoLabel green">
                            {"Import status: " + this.state.successLabel}
                        </h3>
                        
                        <label>
                            <b>Server response:</b>
                        </label>
                        <textarea onChange={this.onChangeDummy}
                            value={this.state.results}>
                        </textarea>


                        <button type="button" className="button" id="getMatches" 
                                disabled={true} 
                                onClick={() => {}} >
                            (in progress) Download .tsv of likely process matches
                        </button>


                    </div>
                </div>
                <hr />
            </div>
        );
    }

    componentDidMount() {
        this.checkFileAPI();
    }
}