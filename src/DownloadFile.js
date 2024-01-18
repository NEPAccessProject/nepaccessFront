import React from 'react';
import axios from 'axios';
import './User/login.css';
import Globals from './globals.js';
import propTypes from 'prop-types';
import LoginModal from './User/LoginModal.js';

export default class DownloadFile extends React.Component {

	// Receives needed props from React-Tabular instance in SearchResults.js
	constructor(props) {
		super(props);
		this.state = { // Each and every download link via <DownloadFile /> has its own state
			progressValue: null,
            downloadPreText: null,
			downloadText: 'Download single file',
			downloadClass: 'document-download',
			downloadClass2: ''
		};
	}
    
    /** Log download */
    logInteraction = (downloadedAll) => {
        const _url = new URL('interaction/set', Globals.currentHost);
        const dataForm = new FormData(); 

        // DownloadFile component shows up in both main results and details page, so SearchResult includes .results=true prop
        if(this.props.results) {
            dataForm.append('source',"RESULTS");
        } else {
            dataForm.append('source',"DETAILS");
        }

        if(downloadedAll) {
            dataForm.append('type',"DOWNLOAD_ARCHIVE"); 
        } else {
            // individual file OR epa comments archive.  
            // Can differentiate if important but even the distinction between single file/all is just a bonus already.
            dataForm.append('type',"DOWNLOAD_ONE"); 
        }

        if(this.props.recordId) {
            dataForm.append('docId',this.props.recordId);
        } else {
            dataForm.append('docId',this.props.id); // TODO: May not have this every time unfortunately, need to clean up outside logic    
        }
        
        axios({
            url: _url,
            method: 'POST',
            data: dataForm
        }).then(response => {
            // let responseOK = response && response.status === 200;
            console.log(response.status);
        }).catch(error => { 
            console.error(error);
        })
    }

    downloadNepaFile = (_filename,_id) => {
        const FileDownload = require('js-file-download');

		// Indicate download
		this.setState({
			downloadText: 'Downloading...',
			downloadClass2: 'disabled_download'
        });
        
        let getRoute = Globals.currentHost + 'file/download_nepa_file';
        
		axios.get(getRoute, {
				params: {
                    filename: _filename,
                    id: _id
				},
				responseType: 'blob',
				onDownloadProgress: (evt) => { // Show progress if available
                    const progressEvent = evt.event;
					const totalLength = progressEvent.lengthComputable ? progressEvent.total : progressEvent.target.getResponseHeader('content-length') || progressEvent.target.getResponseHeader('x-decompressed-content-length');
                    
					if (totalLength !== null) { // Progress as percent, if we have total
						this.setState({
							progressValue: '('+Math.round((progressEvent.loaded * 100) / totalLength) + '% downloaded)'
						});
                    } else if(progressEvent.loaded) { // Progress as MB
						this.setState({
							progressValue: '('+( Math.round(progressEvent.loaded / 1024 / 1024) ) + 'MB downloaded)'
						});
                    }
                    // else progress remains blank
				}
			}).then((response) => {

                // Indicate download completed as file is saved/prompted save as (depending on browser settings)
                if(response) {
                    this.setState({
                        downloadText: 'Done'
                    });
                    FileDownload(response.data, _filename);

                    this.logInteraction(false);
                }
                
				// verified = response && response.status === 200;
			})
			.catch((error) => {
                if(error.response && error.response.status === 404) {
                    this.setState({
                        downloadText: 'File not found',
                        downloadClass2: 'disabled_download'
                    });
                } else if(error.response && error.response.status === 403) {
                    this.setState({
                        downloadPreText: <LoginModal message="Session expired: Please click here to login again"/>,
                        downloadClass: 'document-download',
                        downloadClass2: ''
                    });
                } else {
                    this.setState({
                        downloadText: 'Server may be down for maintenance, please try again later',
                        downloadClass2: 'disabled_download'
                    });
                }
			});
    }

    // TODO: Cell resets to default state if parent re-renders, preserve the fact it was downloaded
    // at least until user reloads the page or navigates?  This was working before, but got more complex with process view
    // TODO: reset download link if canceled
    // these could be very difficult to figure out for low payoff, however
	download = (filenameOrID, isFolder) => {
        // console.log("Downloading: " + filenameOrID);
        // console.log("Folder: " + isFolder);
		const FileDownload = require('js-file-download');

		// Indicate download
		this.setState({
			downloadText: 'Downloading...',
			downloadClass: 'disabled_download'
        });
        
        let _filename = filenameOrID;
        if(isFolder){ // folder case handles this on download if _filename===null
            _filename = null;
        }

        let getRoute = Globals.currentHost + 'file/downloadFile';
        if(isFolder) {
            getRoute = Globals.currentHost + 'file/downloadFolder';
        }
		axios.get(getRoute, {
				params: {
                    filename: filenameOrID,
                    id: filenameOrID
				},
				responseType: 'blob',
				onDownloadProgress: (evt) => { // Show progress if available
                    const progressEvent = evt.event;

					const totalLength = progressEvent.lengthComputable ? progressEvent.total : progressEvent.target.getResponseHeader('content-length') || progressEvent.target.getResponseHeader('x-decompressed-content-length');
                    
                    if(isFolder && !_filename) { // multi-file case, archive filename needs to be extracted from header
                        // filename is surrounded by "quotes" so get that and remove those
                        let fileInfo = progressEvent.target.getResponseHeader('content-disposition');
                        if (!fileInfo){
                            return null; // Never mind
                        }
                        let fileInfoName = fileInfo.split("filename=");

                        // set filename for saving from backend, sans quotes
                        _filename = fileInfoName[1].substr(1, fileInfoName[1].length - 2);
                    }

					if (totalLength !== null) { // Progress as percent, if we have total
						this.setState({
							progressValue: '('+Math.round((progressEvent.loaded * 100) / totalLength) + '% downloaded)'
						});
                    } else if(progressEvent.loaded) { // Progress as MB
						this.setState({
							progressValue: '('+( Math.round(progressEvent.loaded / 1024 / 1024) ) + 'MB downloaded)'
						});
                    }
                    // else progress remains blank
				}
			}).then((response) => {

                // Indicate download completed as file is saved/prompted save as (depending on browser settings)
                if(response) {
                    this.setState({
                        downloadText: 'Done'
                    });
                    FileDownload(response.data, _filename);

                    this.logInteraction(true);
                }
                
				// verified = response && response.status === 200;
			})
			.catch((error) => { 
                if(error.response && error.response.status === 404) {
                    this.setState({
                        downloadText: 'File not found',
                        downloadClass2: 'disabled_download'
                    });
                } else if(error.response && error.response.status === 403) {
                    this.setState({
                        downloadPreText: <LoginModal message="Session expired: Please click here to login again"/>,
                        downloadClass: 'document-download',
                        downloadClass2: ''
                    });
                } else {
                    this.setState({
                        downloadText: 'Server may be down for maintenance, please try again later',
                        downloadClass2: 'disabled_download'
                    });
                }
			});

	}

    handleLoginClick = () => {
        this.props.history.push('/login');
    }

	render() {
        if(localStorage.role === undefined) {
            return <span className="not-logged-in">
                Please <LoginModal /> or <a className="not-logged-in" href='register' target='_blank' rel='noopener noreferrer'>register</a> to download files.
            </span>
        }
		else if (this.props) {
			let cellData = null;
            let propFilename = null;
            let propID = null;
			if (this.props.cell) { // filename/cell data from React-Tabulator props
                cellData = this.props.cell._cell.row.data;
                // console.log(cellData);
				if (this.props.downloadType === "Comments") {
                    propFilename = cellData.commentsFilename;
                }
                else if (cellData.id && cellData.folder) {
                    propID = cellData.id;
                }
				else if (this.props.downloadType === "EIS") {
					propFilename = cellData.filename;
                }
			}
            else if (this.props.downloadType && this.props.downloadType === "Folder") { // from record details page
                propID = this.props.id;
            }
            else if (this.props.filename) { // filename only
                // console.log("Filename only?: " + this.props.filename);
				propFilename = this.props.filename;
			} 

            let sizeText = "";
            if(this.props.size) {
                sizeText = this.props.size+"MB";
            }

            if(this.props.downloadType && this.props.downloadType === "nepafile") {
                propID = this.props.id;
                return (<>
                    {this.state.downloadPreText}
                    <button className = {this.state.downloadClass2} onClick = { () => {this.downloadNepaFile(propFilename, propID)} }> 
                        {this.state.downloadText} {sizeText} {this.state.progressValue} 
                    </button> <span className="propFilename">{propFilename}</span>
                    </>
                );
            }
			else if (propFilename) {
                return (<>
                    {this.state.downloadPreText}
                    <button className = {this.state.downloadClass} onClick = { () => {this.download(propFilename, false)} }> 
                        {this.state.downloadText} {sizeText} {this.state.progressValue} 
                    </button> <span className="propFilename">{propFilename}</span>
                    </>
                );
			} else if (propID) {
                // folder downloads are zipped on demand and should therefore display as .zip
                let innerText = this.props.innerText;
                if(innerText && innerText.length>4 && innerText.substr(-4).toLowerCase() !== '.zip') {
                    innerText+=".zip";
                }
                
                return (
                    <>
                    {this.state.downloadPreText}
                    <button className = {this.state.downloadClass} onClick = { () => {this.download(propID, true)} }> 
                        {this.state.downloadText} <b>{innerText.replaceAll(' ','_')}</b> - {sizeText} {this.state.progressValue}
                    </button> 
                    </>
                );
            } else {
				return propFilename;
			}
		}
		else {
			return "";
		}
	}
}