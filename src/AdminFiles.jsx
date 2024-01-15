import React from 'react';
import axios from 'axios';

import Globals from './globals.jsx';

import { ReactTabulator } from 'react-tabulator';

import './adminFiles.css';


const options = Globals.tabulatorOptions;

export default class AdminFiles extends React.Component {
    

    constructor(props) {
        super(props);

        this.state = {
            files: [{}],
            data: [],
            columns: [],
            networkError: "",
            networkStatus: "",
            goToId: 1
        }
        
        let checkUrl = new URL('user/checkCurator', Globals.currentHost);
        axios({
            url: checkUrl,
            method: 'POST'
        }).then(response => {
            let responseOK = response && response.status === 200;
            if (!responseOK) { // impossible? (either 200 or error?)
                this.props.history.push('/');
            }
        }).catch(error => { // redirect
            this.props.history.push('/');
        })
        
        this.my_table = React.createRef();
    }




    get = () => {
        this.setState({ busy: true });

        let getUrl = Globals.currentHost + "file/missing_size";
        
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

            console.log("Keys",headers);

            for(let i = 0; i < headers.length; i++) {
                newColumns[i] = {title: headers[i], field: headers[i], width: 100, headerFilter: "input"};
            }

            if(parsedJson){
                this.setState({
                    columns: newColumns,
                    data: parsedJson,
                    response: Globals.jsonToTSV(parsedJson),
                    busy: false
                });
            } else {
                console.log("Null");
            }
        }).catch(error => { // 401/404/...
            console.error(error);
            this.setState({ busy: false });
        });
    }
    
    updateTable = () => {
        try {
            // seems necessary when using dynamic columns
            this.my_table.current.table.setColumns(this.state.columns);
        } catch (e) {
            console.error(e);
        }
    }


    reCheck = () => {
        this.setState({
            networkStatus: "Checking for new files..."
        });
        
        let checkUrl = new URL('file/filesizes_missing', Globals.currentHost);
        axios({
            url: checkUrl,
            method: 'GET'
        }).then(response => {
            let responseOK = response && response.status === 200;
            if (!responseOK) { 
                this.setState({
                    networkError: response.status.toString()
                })
            } else {
                this.setState({
                    networkError: "",
                    networkStatus: "OK: Files re-checked"
                }, () => {
                    this.getMissingFiles();
                })
            }
        }).catch(error => { 
            this.setState({
                networkError: error.toString()
            })
        })
    }

    getMissingFiles = () => {
        this.setState({
            networkStatus: "Getting missing files..."
        });
        let checkUrl = new URL('file/missing_files', Globals.currentHost);
        axios({
            url: checkUrl,
            method: 'GET'
        }).then(response => {
            let responseOK = response && response.status === 200;
            if (!responseOK) { 
                this.setState({
                    networkError: response.status.toString(),
                    networkStatus: "Error? Status not 200"
                })
            } else {
                let firstId = 1;
                if(response.data && response.data[0] && response.data[0][1]) { 
                    firstId = response.data[0][1];
                }

                this.setState({
                    networkError: "",
                    networkStatus: "OK: File list returned; ~" + response.data.length + " files missing.",
                    files: response.data.join('\n'),
                    goToId: firstId
                });
            }
        }).catch(error => { 
            this.setState({
                networkError: error.toString(),
                networkStatus: "Error"
            });
        })
    }

    copyResults = () => {
        const el = this.textArea
        let textToCopy = el.innerHTML;
        if(navigator.clipboard) {
            navigator.clipboard.writeText(textToCopy).then(() => {
                console.log('copied');
            });
        } else {
            console.log('unsupported');
        }
    }


    goToRecord = () => {
        this.props.history.push('/record-details?id=' + this.state.goToId);
    }

    onChangeDummy = () => {
        // do nothing
    }
    onChange = (evt) => {
        this.setState({ [evt.target.name]: evt.target.value });
    }

    

    // best performance is to Blob it on demand
    downloadResults = () => {
        if(this.state.response) {
            const csvBlob = new Blob([this.state.response]);
            const today = new Date().toISOString().split('T')[0];
            const csvFilename = `missing_${today}.tsv`;

    
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
    downloadMetadata = () => {
        this.setState({ busy: true });

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

            if(parsedJson){
                this.setState({
                    metadata: Globals.jsonToTSV(parsedJson),
                    busy: false
                }, () => {
                    if(this.state.metadata) {
                        const csvBlob = new Blob([this.state.metadata]);
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
                });
            } else {
                console.log("Null");
            }
        }).catch(error => { // 401/404/...
            console.error(error);
            this.setState({ busy: false });
        });
    }

    render() {
        return (<>
            <div className="content">
                <div className="note">
                    Missing Files
                </div>
                <div id="admin-files-content">
                    <div className="padding-all">
                        <button 
                            className="button"
                            onClick={this.downloadMetadata}
                        >
                            Download .tsv of entire metadata table
                        </button>
                    </div>

                    <h3>Expectation: Metadata listing folder or filename should have files.  
                        This page lists the discrepancy.</h3>
                    
                    
                    <label className="networkErrorLabel">
                        {this.state.networkError}
                    </label>

                    <div>
                        <label id="admin-files-button-label" className="block">
                            Click button if the automated system missed files:
                        </label>
                        <button id="admin-files-button"
                                className="button"
                                disabled={this.state.networkStatus==="Checking for new files..."}
                                onClick={this.reCheck}>
                            Re-check missing files manually
                        </button>
                    </div>

                    <div id="admin-files-section1">
                        
                        <label className="networkLabel">
                            {this.state.networkStatus}
                        </label>

                        <button id="admin-files-copy" className="button"
                                onClick={this.copyResults}>Copy results to clipboard</button>
                        
                    </div>

                    <div>
                        <a target="_blank" rel="noreferrer" href={"https://www.nepaccess.org/record-details?id="+this.state.goToId}>Go to record:</a>
                        <input name="goToId" value={this.state.goToId} onChange={this.onChange} />
                    </div>
                    
                    <div>
                        <label className="block bold" htmlFor="fileList">CSV of records where files on disk were expected: Folder,ID,Document Type,Filename</label>
                        <textarea 
                                className="server-response"
                                ref={(textarea) => this.textArea = textarea}
                                id="fileList" value={this.state.files} onChange={this.onChangeDummy} />
                    </div>

                    <br />
                    <hr />
                    <br />

                    <div className="padding-all">
                        <h3>ALL records with no apparent files on disk:</h3>
                        <ReactTabulator
                            ref={this.my_table}
                            data={this.state.data}
                            columns={this.state.columns}
                            options={options}
                        />
                        <button 
                            className="button"
                            onClick={this.downloadResults}
                        >
                            Download this full has-no-files list as a .tsv file
                        </button>
                        <br />
                    </div>

                </div>
            </div>
        </>);
    }




    componentDidMount() {
        this.getMissingFiles();
        this.get();
    }

    componentDidUpdate() {
        if(this.my_table && this.my_table.current){
            this.updateTable();
        }
    }
}

function getKeys(obj) {
    let keysArr = [];
    for (var key in obj) {
      keysArr.push(key);
    }
    return keysArr;
}