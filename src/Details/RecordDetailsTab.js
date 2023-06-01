import React from 'react';
import {Helmet} from 'react-helmet';

import Select from 'react-select';
import axios from 'axios';

import DownloadFile from '../DownloadFile.js';
import MatchSearcher from './MatchSearcher.js';
import MatchResults from './MatchResults.js';
import DetailsUpdate from './DetailsUpdate.js';
import DetailsFileResults from './DetailsFileResults.js';
import DetailsRestore from './DetailsRestore.js';
import GeojsonMap from '../GeojsonMap.js';

import '../index.css';
import './match.css';
import '../leaflet.css';

import Globals from '../globals.js';
import DownloadFiles from '../DownloadFiles.js';
import DownloadComments from '../DownloadComments.js';

const _ = require('lodash');
// 1. User clicks Record
// 2. Tab opens, shows Record metadata from backend call
// Good place to put curation options for authorized users
// i.e. alter metadata, import new relations (maybe do this elsewhere), verify/unlink existing relations...  
// and the database updates to reflect it after they confirm changes (confirmation window is a big plus, also cancel/reset option to put the original values back in)

export default class RecordDetailsTab extends React.Component {

    // Receives needed props from React-Tabular instance in SearchResults.js
	constructor(props){
		super(props);
        this.state = {
            searcherInputs: {
                id: 0,
                matchPercent: 50,
            },
            details: {

            },
            dropdownOption: {value: 'Details', label: 'Details'},
            detailsID: 0,
            searchResults: [

            ],
            networkError: '',
            searcherClassName: '',
            resultsText: "",
            exists: true,
            hasGeojson: false,

            logged: false
        };

        // this.debouncedSize = _.debounce(this.getFileSize, 300);
        this.debouncedFilenames = _.debounce(this.getFilenames, 300);
    }

    get = async (_url, _params) => {
        try {
            const response = await axios.get(_url, {
                params: _params
            });
            let responseOK = response && response.status === 200;
            if (responseOK) {
                return response.data;
            }
        } catch (error) { 
            this.setState({ 
                networkError: Globals.getErrorMessage(error)
            });

            throw error; 
        }
    }

    getNepaFileResults = () => {
        const url = Globals.currentHost + "file/nepafiles";
        const params = {id: this.state.detailsID};

        this.get(url, params).then(results => {
            if(results){
                this.setState({
                    nepaResults: results,
                }, () => {
                    if(!this.state.nepaResults || !this.state.nepaResults[0]){
                        this.getDocumentTextResults();
                    }
                });
            } else { // null
    
            }
        }).catch(e => {
            console.error(e);
        });
    }
    
    getDocumentTextResults = () => {
        const populateUrl = Globals.currentHost + "file/doc_texts";
        const params = {id: this.state.detailsID};

        this.get(populateUrl, params).then(results => {
            if(results){
                this.setState({
                    textResults: results,
                });
            } else { // null
                
            }
        }).catch(e => {
            console.error(e);
        });
    }

    
	onDropdownChange = (evt) => {
        this.setState({ dropdownOption: evt });
    }
    
    /** Log details page "click" (render) -
     * user could type the page in or navigate from related process member, could check if a search preceded it.
     */
    logInteraction = () => {
        const _url = new URL('interaction/set', Globals.currentHost);
        const dataForm = new FormData(); 

        dataForm.append('source',"UNKNOWN"); // Can't actually know this with current logic
        dataForm.append('type',"DETAILS_CLICK"); 
        dataForm.append('docId',this.state.detailsID);
        
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

    populate = () => {
        const populateUrl = Globals.currentHost + "test/get_by_id";
        const params = {id: this.state.detailsID};
            
        this.get(populateUrl, params).then(results => {
            if(results){
                const alreadyLogged = this.state.logged;
                this.setState({
                    details: results,
                    logged: true
                }, () => {
                    if(!alreadyLogged) {
                        this.logInteraction();
                    }
                });
            } else { // null (no record?)
                this.setState({
                    networkError: "No record found (try a different ID)",
                    exists: false
                });
            }
        });
    }

    // Match search (title alignment)
    search = (searcherState) => {

        let matchUrl = new URL('test/match', Globals.currentHost);

        // "advanced" match search uses additional heuristics for more probable "linked" records
        if(searcherState.matchType && searcherState.matchType === 'advanced'){
			matchUrl = new URL('test/match_advanced', Globals.currentHost);
        }

		this.setState({
			searcherInputs: searcherState,
			resultsText: "Loading results...",
			networkError: "" // Clear network error
		}, () => {
			let dataToPass = { 
				id: this.state.searcherInputs.id,
				matchPercent: (this.state.searcherInputs.matchPercent/100)
			};

			// console.log("Inputs");
            // console.log(JSON.stringify(this.state.searcherInputs));
            
			//Send the AJAX call to the server
			axios({
				method: 'POST',
				url: matchUrl,
				data: dataToPass
			}).then(response => {
				let responseOK = response && response.status === 200;
				if (responseOK) {
					return response.data;
				} else {
					return null;
				}
			}).then(parsedJson => { // can be empty (no results)
				// console.log('this should be json', parsedJson); 
				if(parsedJson){
                    this.parseMatches(parsedJson, searcherState.matchType);
				} else { // 200 from server, but empty results
					this.setState({
                        searchResults: [],
						resultsText: "No related documents at " + this.state.searcherInputs.matchPercent + "% match score (or better)"
					});
				}
			}).catch(error => {
				this.setState({
					networkError: Globals.getErrorMessage(error)
				});
				this.setState({
					resultsText: "Error: Couldn't get results"
				});
			});
		
        });
    }

    parseMatches = (results, searchType) => {

        console.log("Raw results",results);

        let resultsText = " ";
        let data = [];

        let matches = results.matches.map((result, idx) => {
            let newObject = {
                matchId: result.match_id, document1: result.document1, document2: result.document2,
                matchPercent: result.match_percent
            };
            return newObject;
        });
        let docs = results.docs.map((result, idx) =>{
            let newObject = {title: result.title, 
                agency: result.agency, 
                commentDate: result.commentDate, 
                registerDate: result.registerDate, 
                state: result.state, 
                documentType: result.documentType, 
                filename: result.filename, 
                commentsFilename: result.commentsFilename,
                size: result.size,
                id: result.id,
                folder: result.folder,
            };
            return newObject;
        });

        docs.forEach(function(document) {
            matches.forEach(function(match) {
                // If corresponding elements, concatenate them
                if(document.id === match.document1 || document.id === match.document2) {
                    document.matchPercent = match.matchPercent;
                    data.push(document);
                }
            });
        });

        if(data.length > 0){
            data.sort((a, b)  => (a.matchPercent < b.matchPercent) ? 1 : -1);
        }
        // At this point, weed out the identical types and only keep the highest, if advanced

        if(searchType && searchType === "advanced") {
            

            const docsByType = {};

            data.forEach(doc => {
                const entries = docsByType[doc.documentType] || []
                entries.push(doc)
                docsByType[doc.documentType] = entries
            });

            const masterSet = [];

            Object.keys(docsByType).forEach(documentType => {
                const entries = docsByType[documentType]
                // entries.sort((a, b) => {
                // return b.score - a.score // or whatever
                // })

                const best = entries[0]
                masterSet.push(best)
            });

            data = masterSet;
        }

        if(data.length === 1){
            resultsText = " Result";
        } else {
            resultsText = " Results";
        }

        this.setState({
            searchResults: data,
            resultsText: data.length + resultsText
        }, () => {
            console.log(this.state.searchResults);
        });
    }
    
    
    getIdParam = () => {
        let idString = Globals.getParameterByName("id");
        return parseInt(idString);
    }
    
    getFilenames = (_id) => {
        if(this.state.filenames){
            // do nothing (already have this data)
        } else {
            let filenamesUrl = Globals.currentHost + "file/filenames";

            // console.log("Inputs");
            // console.log(JSON.stringify(this.state.searcherInputs));
            
            //Send the AJAX call to the server
            axios.get(filenamesUrl, {
                params: {
                    document_id: _id
                }
                }).then(response => {
                    let responseOK = response && response.status === 200;
                    if (responseOK && response.data && response.data.length > 0) {
                        this.setState({
                            filenames: response.data
                        });
                    } else {
                        // console.log("Can't have filenames");
                        return null;
                    }
                }).then(parsedJson => { // can be empty (no results)
                    // return "Unknown";
                }).catch(error => {
                    // return "Unknown (server error)";
            });
            
        }
    }

    showView = () => {
        // One benefit of switching here instead of dynamically hiding elements is that Tabulator doesn't error out when hidden
        if(this.state.dropdownOption.value === 'Details'){ // Show details panel
            return (
                <div className="record-details">
                    <h2 className="title-color">Record details</h2>
                    {this.showTitle()}
                    <div className="containers">
                        <div className="metadata-container-container">
                            <div className="metadata-container">
                                <h3>Metadata</h3>
                                {this.showDetails()}
                                {this.showMap()}
                            </div>
                            <div className="metadata-container files-container">
                                <h3>Download Files</h3>
                                {this.showFiles()}
                            </div>
                        </div>
                    </div>
                    {this.buildProcess()}
                </div>
            );
        } else if(this.state.dropdownOption.value === 'Match') {
            return (
                <div className="record-details">
                    <h2 className="title-color">Find similar documents by title:</h2>
                    <div><p className='modal-line'><span className='modal-title'>Title:</span> 
                        <span className="bold">{this.state.details.title}</span> 
                    </p></div>
                    {this.showDocuments()}
                </div>
            );
        } else if(this.state.dropdownOption.value === 'Restore') {
            return this.showRestore()
        } else { // Show update panel
            return (
                <div className="record-details">
                    {this.showUpdate()}
                </div>
            );
        }
    }

    showFilenames = (_id) => {
        this.debouncedFilenames(_id);
        if(this.state.filenames) {
            if(this.state.details.folder) {
                const filenamesForDownload = this.state.filenames.map(
                    (_filename) => 
                    <span key={_filename} className="detail-filename">
                        <DownloadFile key={_filename} downloadType="nepafile" 
                                id={_id}
                                filename={_filename}/>
                    </span>
                    
                );

                return (<div className='modal-line'>
                <span className='detail-filenames modal-title bold'>Individual files</span>
                    {/* <p>{filenameItems}</p> */}
                    <p>{filenamesForDownload}</p>
                </div>);
            } else {
                const filenameItems = this.state.filenames.map(
                    (_filename) => <span key={_filename} className="detail-filename">{_filename}</span>
                );

                return (<div className='modal-line'>
                <span className='detail-filenames modal-title bold'>Individual files</span>
                    <p>{filenameItems}</p>
                </div>);
            }
        }
    }

    showTitle = () => {
        let cellData = this.state.details;
        if(cellData.title) {
            return (<p key={-1} className='modal-line'><span className='modal-title'>Title:</span> 
                <span className="bold record-details-title">{cellData.title}</span>
            </p>);
        }
    }

    showFiles = () => {
        let cellData = this.state.details;
        if(cellData && cellData['size']) {
            return Object.keys(cellData).map( ((key, i) => {
                // Title now needs its own style
                if(key==='folder' && cellData[key] && cellData[key].length > 0) {
                    let filenames = this.showFilenames(cellData.id);
                    if(filenames){
                        return (<div key={i}>
                            <p className='modal-line'>
                                <span className='modal-title bold'>All files</span> 
                                <DownloadFiles 
                                    downloadType="Folder" 
                                    id={cellData["id"]}
                                    innerText={cellData[key]}
                                    size={Math.ceil(cellData.size / 1024 / 10.24)/100}
                                />
                            </p>
                            {/* <p>
                                <span className='modal-title bold'>Folder size</span>
                                {Math.ceil(cellData.size / 1024 / 10.24)/100} MB
                            </p> */}
                            {filenames}
                        </div>);
                    }
                } else if(key==='filename') {
                    // If we have a folder available for download, never mind showing the filename, certainly not a (probably invalid) download link for it
                    if (cellData[key] && cellData[key].length > 0
                                && (!cellData["folder"] || !(cellData["folder"].length > 0))) {
                        let filenames = this.showFilenames(cellData.id);
                        if(filenames) {
                            /** If we do have just a filename then we should be able to get the filesize */
                            return <div key={i}>
                                <span className='modal-line'>
                                    <span className='modal-title bold'>All files</span> 
                                    <DownloadFiles 
                                        size={Math.ceil(cellData.size / 1024 / 10.24)/100} 
                                        downloadType="EIS" 
                                        filename={cellData[key]}
                                    />
                                </span>

                                <p><span className='modal-title bold'>File size</span>{Math.ceil(cellData.size / 1024 / 10.24)/100} MB</p>

                                {filenames}
                            </div>;
                        }
                    } else {
                        return '';
                    }
                } else if(key==='commentsFilename') {
                    if (cellData[key] && cellData[key].length > 0) {
                        return (
                            <p key={i} className='modal-line'>
                                <span className='modal-title bold'>EPA comments</span> 
                                <DownloadComments downloadType="Comments" filename={cellData[key]}
                                    id={cellData["id"]} />
                                {/* &nbsp;{cellData[key]} */}
                            </p>
                        );
                    } else {
                        return '';
                    }
                } 
                // else: everything else
                return '';
            }));
        } else {
            if(cellData['commentsFilename']) {
                return <>
                    <p className='warning'>Sorry, we're still working on collecting these files.</p>
                    <p className='modal-line'>
                        <span className='modal-title bold'>EPA comments</span> 
                        <DownloadComments downloadType="Comments" filename={cellData['commentsFilename']} 
                                    id={cellData["id"]} />
                    </p></>
            } else {
                return <p className='warning'>Sorry, we're still working on collecting these files.</p> 
            }
        }
    }

    interpretProcess = (proc) => {
        // console.log("proc",proc);
        return Object.keys(proc).map( ((key, i) => {
            if(proc[key] && proc[key]['id']) {
                let docId = proc[key].id;
                let docType = proc[key].documentType;
                if( docType.toLowerCase() === this.state.details.documentType.toLowerCase() ) {
                    // console.log("No show",docType,this.state.details.documentType,docId);
                    return "";
                } else {
                    return (
                        <p key={"proc_p_"+key} className='modal-line'>
                            <span className='modal-title'>
                                <b>{docType}</b>:
                            </span>
                            <a href={window.location.href.split("?")[0]+"?id="+docId}>
                                {proc[key].title}
                            </a>
                        </p>
                    );
                }
            } else {
                return "";
            }
        }));
    }

    buildProcess = () => {
        
        let processId = this.state.details["processId"];
        
        if(this.state.details && processId) {
            if(this.state.processId && this.state.process) {

                // already have this data. No need for any axios calls
                if(this.state.process.length > 1) { // a process with only itself does not call for this html
                    return (
                    <div className="metadata-container tinted">
                        <h3>Other files from this NEPA process</h3>
                        {this.interpretProcess(this.state.process)}
                    </div>);
                }
                // return this.interpretProcess(this.state.process);
    
            } else {
    
                // need to get and build
                let url = Globals.currentHost + "test/get_process";
    
                //Send the AJAX call to the server
                axios.get(url, {
                    params: {
                        processId: processId
                    }
                }).then(response => {
                    let responseOK = response && response.status === 200;
                    if (responseOK && response.data) {
                        this.setState({
                            processId: processId,
                            process: response.data
                        }, () => {
                            return <>
                            <h3>Other files from this NEPA process</h3>
                            {this.interpretProcess(this.state.process)}
                            </>
                        });
                    }
                }).catch(error => {
                    return <></>;
                });
    
            }
        }
    }

    /** Return all metadata, not just what search table shows */
    showDetails = () => {
        let cellData = this.state.details;
        // console.log("Cell",cellData);
        if(cellData) {
            return Object.keys(cellData).map( ((key, i) => {
                let keyName = key;
                // Title now outside this structure, skip nulls here also
                if(key==='title' || cellData[key] === null) {
                    return '';
                } 
                // Space after semicolon
                else if(key==='state') {
                    return (<p key={i} className='modal-line'><span className='modal-title'>{keyName}:</span> <span className="bold">{cellData[key].replaceAll(';',"; ")}</span></p>);
                } else if(key==='county') {
                    return (<p key={i} className='modal-line'><span className='modal-title'>{keyName}:</span> <span className="bold">{cellData[key].replaceAll(';',"; ")}</span></p>);
                }
                // hide blank fields
                else if(!cellData[key] || cellData[key].length === 0) {
                    return '';
                // reword fields
                } else if(key==='registerDate') {
                    keyName = 'date';
                } else if (key==='documentType') {
                    keyName = 'type';
                } else if (key==='cooperatingAgency') {
                    keyName = 'Cooperating agencies';
                    const coops = cellData[key].split(';').map((coop,idx) => {
                        return <div  key={`${coop}-${idx}`} className="cooperating"><b>{coop}</b></div>;
                    })
                    return (<p key={i} className='modal-line'><span className='modal-title'>{keyName}:</span> {coops}</p>);
                } else if (key==='noiDate') {
                    keyName = 'Notice of Intent (NOI) date'
                } else if (key==='draftNoa') {
                    keyName = 'Draft EIS Notice of Availability (NOA) date'
                } else if (key==='finalNoa') {
                    keyName = 'Final EIS Notice of Availability (NOA) date'
                } else if (key==='firstRodDate') {
                    keyName = 'Record of Decision (ROD) date'
                // exclusions:
                } else if(key==='size' || key==='matchPercent' || key==='commentDate' || key==='id' || key==='id_'  
                        || key==='plaintext' || key==='folder' || key==='link' || key==='notes' || key==='commentsFilename'
                        || key === 'filename' || key==='luceneIds' || key==='status') { 
                    return '';
                // special exclusions:
                } else if(!Globals.authorized() && (key==='decision' || key==='action')) {
                    return '';
                } else if(key==='summaryText') {
                    return (<p key={i} className='modal-line'><span className='modal-title'>Summary:</span> {cellData[key].replaceAll('�','"')}</p>);
                }  else if(key==='processId') {
                    return ''; // handled elsewhere
                    // return (<>
                    //     <hr />
                    //     <h3>Other files from this NEPA process</h3>
                    //     {this.buildProcess(cellData[key])}
                    //     </>
                    // );
                }
                // else: everything else
                return (<p key={i} className='modal-line'><span className='modal-title'>{keyName}:</span> <span className="bold">{cellData[key]}</span></p>);
            }));
        }
    }

    showDocuments = () => {
        return (
            <>
                <MatchSearcher search={this.search} matchPercent={this.state.searcherInputs.matchPercent} id={this.getIdParam()} />
                <MatchResults results={this.state.searchResults} resultsText={this.state.resultsText} />
            </>
        )
    }
    
    showUpdate = () => {
        return (<>
                <DetailsUpdate record={this.state.details} repopulate={this.populate} id={null} />
                <DetailsFileResults results={this.state.nepaResults} headerText="Downloadable file records" />
                <DetailsFileResults results={this.state.textResults} headerText="Texts" />
            </>
        );
    }

    showRestore = () => {
        return <DetailsRestore id={this.getIdParam()} repopulate={this.populate} />
    }


    showDropdown = () => {        
        let curator = Globals.curatorOrHigher();
        // Don't show dropdown at all if curator, now that we've hidden the title alignment also
        if(curator) {

            // let viewOptions = [ { value: 'Details', label: 'Details' }, {value: 'Match', label: 'More documents from this process'}];
            let viewOptions = [ { value: 'Details', label: 'Details' } ];
            if(curator) {
                viewOptions.push({ value: 'Match', label: 'Title alignment' });
                viewOptions.push({ value: 'Update', label: 'Edit' });
                viewOptions.push({ value: 'Restore', label: 'Restore' });
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
                    width: "500px",
                }),
                control: (styles) => ({
                    ...styles,
                    backgroundColor: 'white',
                })
            }

            return (<>
                <h3 className="advanced-label inline" htmlFor="detailsDropdown">Select view: </h3>
                <Select id="detailsDropdown" className="multi inline-block" classNamePrefix="react-select" name="detailsDropdown" isSearchable 
                    styles={customStyles}
                    options={viewOptions} 
                    onChange={this.onDropdownChange} 
                    value={this.state.dropdownOption}
                    // (temporarily) specify menuIsOpen={true} parameter to keep menu open to inspect elements.
                    // menuIsOpen={true}
                />
            </>);
        } else {
            return "";
        }
    }

    hasGeojson = () => {
        let _id = this.state.detailsID;
        let url = Globals.currentHost + "geojson/exists_for_eisdoc";
        axios.get(url, {
            params: {
                id: _id
            }
        }).then(response => {
            let responseOK = response && response.status === 200;
            if (responseOK && response.data) {
                this.setState({
                    hasGeojson: response.data
                });
            } else {
                this.setState({
                    hasGeojson: false
                });
            }
        });
    }
    showMap = () => {
        if(this.state.hasGeojson) {
            return (
                <div className="map-container-internal">
                    <h3 className="map-header">Map</h3>
                    <GeojsonMap docId={this.state.detailsID} />
                </div>
            );
        }
    }


    render () {

        if(!this.state.exists) {
            return (
                <div id="details">
                    <label className="errorLabel">{this.state.networkError}</label>
                </div>
            )
        } else {
            return (
                <div id="details">
                    <Helmet>
                        <meta charSet="utf-8" />
                        <title>Record Details - NEPAccess</title>
                        <link rel="canonical" href={"https://nepaccess.org/record-details?id="+Globals.getParameterByName("id")} />
                    </Helmet>
                    <label className="errorLabel">{this.state.networkError}</label>
                    <br />
                    {this.showDropdown()}
                    {this.showView()}
                </div>
            );
        }
        
    }


    // After render
	componentDidMount() {
        // console.log("Mtd",this.props.id);
        if(this.props.id) {
            if(!this.state.detailsID || this.state.detailsID !== this.props.id) {
                this.setState({
                    detailsID: this.props.id
                }, () => {
                    this.populate();
                    this.getNepaFileResults();
                    this.hasGeojson();
                });
            } else {
                this.populate();
                this.getNepaFileResults();
                this.hasGeojson();
            }
        } else {
            const idString = Globals.getParameterByName("id");
            if(idString){
                this.setState({
                    detailsID: idString
                }, () => {
                    if(this.state.detailsID){
                        this.populate();
                        this.getNepaFileResults();
                        this.hasGeojson();
                    } else {
                        this.setState({
                            networkError: "No record found (try a different ID)"
                        });
                    }
                });
            }
        }
	}

    componentDidUpdate() {
        // console.log("Update");
        if(this.props.id) {
            if(!this.state.detailsID || this.state.detailsID !== this.props.id) {
                this.setState({
                    detailsID: this.props.id
                }, () => {
                    this.populate();
                    this.getNepaFileResults();
                    this.hasGeojson();
                });
            }
        }
    }
}