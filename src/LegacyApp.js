import React from 'react';
import { Link } from 'react-router-dom';
import {Helmet} from 'react-helmet';

import axios from 'axios';

import SearchResults from './search/SearchResults.js';
import Search from './Search.js';

import Footer from './Footer.js';

import './User/login.css';

import Globals from './globals.js';
import persist from './persist.js';

/** For testing redesigned, consolidated search which is in progress */
export default class App extends React.Component {

	state = {
		searcherInputs: {
			startPublish: '',
			endPublish: '',
			agency: [],
			state: [],
			needsComments: false,
			needsDocument: false,
            limit: 1000000
		},
        searchResults: [],
        outputResults: [],
        displayRows: [],
        count: 0,
		resultsText: 'Results',
		networkError: '',
        parseError: '',
		verified: false,
        searching: false,
        useSearchOptions: false,
        snippetsDisabled: false,
        shouldUpdate: false,
        loaded: false,
        down: false
    }
    
    constructor(props){
        super(props);
        this.endRef = React.createRef();
    }
    
    // For canceling a search when component unloads
    _mounted = false;

    // For canceling a search on demand
    _canceled = false;

    // For canceling any running search if user starts a new search before results are done
    _searchId = 1;

    // For filtering results mid-search
    _searcherState = null; 

    // For display
    _searchTerms = "";

    // For sorting mid-search
    _sortVal = null;
    _ascVal = true;

    _finalCount = "";
    _draftCount = "";
    _eaCount = "";
    _rodCount = "";
    _scopingCount = "";

    resetTypeCounts = () => {
       this._finalCount = "";
       this._draftCount = "";
       
       this._eaCount = "";
       this._rodCount = "";
       this._scopingCount = "";
    }

    optionsChanged = (val) => {
        this.setState({
            useSearchOptions: val
        });
    }

    countTypes = () => {
        let finals = 0;
        let drafts = 0;
        let eas = 0;
        let rods = 0;
        let scopings = 0;

        this.state.searchResults.forEach(item => {
            if(Globals.isFinalType(item.documentType)) {
                finals++;
            }
            else if(Globals.isDraftType(item.documentType)) {
                drafts++;
            }
            else if(matchesEa(item.documentType)) {
                eas++;
            }
            else if(matchesRod(item.documentType)) {
                rods++;
            }
            else if(matchesScoping(item.documentType)) {
                scopings++;
            }
        })

        this._finalCount = "("+finals+")";
        this._draftCount = "("+drafts+")";
        this._eaCount = "("+eas+")";
        this._rodCount = "("+rods+")";
        this._scopingCount = "("+scopings+")";
        // this.setState({finalCount: "("+count+")"});
    }

    /** Design: Search component calls this parent method which controls
    * the results, which gives a filtered version of results to SearchResults */
    filterResultsBy = (searcherState) => {
        this._searcherState = searcherState; // for live filtering
        // Only filter if there are any results to filter
        if(this.state.searchResults && this.state.searchResults.length > 0){

            const filtered = Globals.doFilter(searcherState, this.state.searchResults, this.state.searchResults.length, true);
            
            // Even if there are no filters active we still need to update to reflect this,
            // because if there are no filters the results must be updated to the full unfiltered set
            this.setState({
                outputResults: filtered.filteredResults,
                resultsText: filtered.textToUse,
                shouldUpdate: true
            });
        }
    }

    // Sort search results on call from results component
    sort = (val, asc) => {
        this._sortVal = val;
        this._ascVal = asc;
        this.sortDataByField(val, asc);
    }

    // TODO: asc/desc (> vs. <, default desc === >)
    sortDataByField = (field, ascending) => {
        // console.log("Sorting");
        this.setState({
            // searchResults: this.state.searchResults.sort((a, b) => (a[field] > b[field]) ? 1 : -1)
            outputResults: this.state.outputResults.sort((this.alphabetically(field, ascending))),
            shouldUpdate: true
        });
    }

    /** Sorts falsy (undefined, null, NaN, 0, "", and false) field value to the end instead of the top */
    alphabetically(field, ascending) {

        return function (a, b) {
      
            // equal items sort equally
            if (a[field] === b[field]) {
                return 0;
            }
            // falsy sort after anything else
            else if (!a[field]) {
                return 1;
            }
            else if (!b[field]) {
                return -1;
            }
            // otherwise, if we're ascending, lowest sorts first
            else if (ascending) {
                return a[field] < b[field] ? -1 : 1;
            }
            // if descending, highest sorts first
            else { 
                return a[field] < b[field] ? 1 : -1;
            }
        
        };
      
    }

    // TODO: Can't set state here, state update logic needs to happen elsewhere?
    stopSearch = () => {
        this._canceled = true;
        // this.filterResultsBy(searcherState);
        // this.setState({searching:false})
        // this.setState({
        //     searching: false
        // }, () => {
        //     this.filterResultsBy(this._searcherState);
        // });
    }

    // Start a brand new search.
    startNewSearch = (searcherState) => {

        // throw out anything we really don't want to support/include
        searcherState.titleRaw = preProcessTerms(searcherState.titleRaw);

        // Parse terms, set to what Lucene will actually use for full transparency.  Disabled on request
        // const oldTerms = searcherState.titleRaw;

        // axios({
        //     method: 'GET', 
        //     url: Globals.currentHost + 'text/test_terms',
        //     params: {
        //         terms: searcherState.titleRaw
        //     }
        // }).then(response => {

        //     if(response.data !== oldTerms && "\""+response.data+"\"" !== oldTerms) {
        //         searcherState.titleRaw = response.data; // escape terms

        //         this.setState({
        //             parseError: 'Special characters were escaped to avoid parsing error.  Old search terms: ' + oldTerms
        //         })
        //     } else {
        //         this.setState({
        //             parseError: ''
        //         })
        //     }
            
        // reset sort
        this._sortVal = "relevance"; 
        this._ascVal = true;

        this._canceled = false;
        this._searcherState = searcherState; // for live filtering

        this.resetTypeCounts();
        
        // 0: Get top 100 results
        // 1: Collect contextless results
        //        - Consolidate all of the filenames by metadata record into singular results
        //          (maintaining original order by first appearance)
        this.startSearch(searcherState);
        // 2: Begin collecting text fragments 10-100 at a time or all for current page,  
        //          assign accordingly, in a cancelable recursive function
        //          IF TITLE ONLY SEARCH: We can stop here.

        // }).catch(error => {
        //     console.error(error);
        // })

    }

    /** Just get the top results quickly before launching the "full" search with initialSearch() */
    startSearch = (searcherState) => {
        if(!this._mounted){ // User navigated away or reloaded
            return;
        }

		this.setState({
            // Fresh search, fresh results
            outputResults: [],
            count: 0,
            searcherInputs: searcherState,
            snippetsDisabled: searcherState.searchOption==="C",
			resultsText: "Loading results...",
            networkError: "", // Clear network error
            searching: true,
            shouldUpdate: true
		}, () => {
            // title-only
            let searchUrl = new URL('text/search', Globals.currentHost);
            
            // For the new search logic, the idea is that the limit and offset are only for the text
            // fragments.  The first search should get all of the results, without context.
            // We'll need to consolidate them in the frontend and also ask for text fragments and assign them
            // properly
            if(searcherState.searchOption && searcherState.searchOption === "A") {
                searchUrl = new URL('text/search_top', Globals.currentHost);
            } else if(searcherState.searchOption && searcherState.searchOption === "B") {
                searchUrl = new URL('text/search_top', Globals.currentHost);
            }

            this._searchTerms = this.state.searcherInputs.titleRaw;

            // Update query params
            // We could also probably clear them on reload (component will unmount) if anyone wants
            let currentUrlParams = new URLSearchParams(window.location.search);
            currentUrlParams.set('q', this._searchTerms);
            this.props.history.push(window.location.pathname + "?" + currentUrlParams.toString());

			let dataToPass = { 
				title: this._searchTerms
            };

            // OPTION: If we restore a way to use search options for faster searches, we'll assign here
            if(this.state.useSearchOptions) {
                dataToPass = { 
                    title: this.state.searcherInputs.titleRaw, 
                    startPublish: this.state.searcherInputs.startPublish,
                    endPublish: this.state.searcherInputs.endPublish,
                    startComment: this.state.searcherInputs.startComment,
                    endComment: this.state.searcherInputs.endComment,
                    agency: this.state.searcherInputs.agency,
                    state: this.state.searcherInputs.state,
                    typeAll: this.state.searcherInputs.typeAll,
                    typeFinal: this.state.searcherInputs.typeFinal,
                    typeDraft: this.state.searcherInputs.typeDraft,
                    typeOther: this.state.searcherInputs.typeOther,
                    needsComments: this.state.searcherInputs.needsComments,
                    needsDocument: this.state.searcherInputs.needsDocument
                };
            }

            dataToPass.title = postProcessTerms(dataToPass.title);

            // Proximity search from UI - surround with quotes, append ~#
            if(!this.state.searcherInputs.proximityDisabled && this.state.searcherInputs.proximityOption)
            {
                if(this.state.searcherInputs.proximityOption.value >= 0) {
                    try {
                        dataToPass.title = 
                            ("\"" + dataToPass.title + "\"~" + this.state.searcherInputs.proximityOption.value);
                    } catch(e) {
                        
                    }
                }
            }

            //Send the AJAX call to the server
            let shouldContinue = true;

            // console.log("Search init");
            axios({
                method: 'POST', // or 'PUT'
                url: searchUrl,
                data: dataToPass
            }).then(response => {
                let responseOK = response && response.status === 200;
                if (responseOK) {
                    return response.data;
                } else if (response.status === 204) {  // Probably invalid query due to misuse of *, "
                    this.setState({
                        resultsText: "No results: Please check use of term modifiers"
                    });
                    return null;
                } else if(response.status === 403) {
                    // Not logged in
                    Globals.emitEvent('refresh', {
                        loggedIn: false
                    });
                } else if(response.status === 202) {
                    shouldContinue = false; // found all results already
                    return response.data;
                } else {
                    console.log(response.status);
                    return null;
                }
            }).then(currentResults => {
                let _data = [];
                if(currentResults && currentResults[0] && currentResults[0].doc) {
                    // console.log("Raw results",currentResults);
                    
                    _data = currentResults
                    // .filter((result) => { // Soft rollout logic
                    //     return result.doc.size > 200; // filter out if no files (200 bytes or less)
                    // })
                    .map((result, idx) =>{
                        let doc = result.doc;
                        let newObject = {title: doc.title, 
                            agency: doc.agency, 
                            cooperatingAgency: doc.cooperatingAgency,
                            commentDate: doc.commentDate, 
                            registerDate: doc.registerDate, 
                            state: doc.state, 
                            documentType: doc.documentType, 
                            filename: doc.filename, 
                            commentsFilename: doc.commentsFilename,
                            size: doc.size,
                            id: doc.id,
                            luceneIds: result.ids,
                            folder: doc.folder,
                            plaintext: result.highlights,
                            name: result.filenames,

                            link: doc.link,
                            firstRodDate: doc.firstRodDate,
                            processId: doc.processId,
                            notes: doc.notes,
                            status: doc.status,
                            subtype: doc.subtype,
                            county: doc.county,

                            relevance: idx + 1 // sort puts "falsy" values at the bottom incl. 0
                        };
                        return newObject;
                    }); 

                    this.setState({
                        searchResults: _data,
                        outputResults: _data,
                    }, () => {
                    
                        // title-only (or blank search===no text search at all): return
                        if(Globals.isEmptyOrSpaces(dataToPass.title) || 
                                (searcherState.searchOption && searcherState.searchOption === "C"))
                        {
                            this.filterResultsBy(this._searcherState);
                            this.countTypes();

                            this.setState({
                                searching: false,
                                snippetsDisabled: true,
                                shouldUpdate: true
                            });
                        } else if(!shouldContinue) {
                            // got all results already, so stop searching and start highlighting.
                            this.filterResultsBy(this._searcherState);
                            this.countTypes();
                        
                            this._searchId = this._searchId + 1;
                            // console.log("Launching fragment search ",this._searchId);
                            this.gatherHighlightsFVH(this._searchId, 0, searcherState, _data);
                        } else {
                            this.initialSearch(searcherState);
                        }
                    });
                } else {
                    this.setState({
                        searching: false,
                        searchResults: [],
                        outputResults: [],
                        resultsText: "No results found for " + this._searchTerms + " (try adding OR between words for less strict results?)"
                    });
                }
            }).catch(error => { // Server down or 408 (timeout)
                console.error('Server is down or verification failed.', error);
                if(error.response && error.response.status === 408) {
                    this.setState({
                        networkError: 'Request has timed out.'
                    });
                    this.setState({
                        resultsText: "Error: Request timed out"
                    });
                } else if (error.response && error.response.status === 403) { // token expired?
                    this.setState({
                        resultsText: "Error: Please login again (session expired)"
                    });
                    Globals.emitEvent('refresh', {
                        loggedIn: false
                    });
                } else if(error.response && error.response.status === 400) { // bad request
                    this.setState({
                        networkError: Globals.errorMessage.default,
                        resultsText: "Couldn't parse terms, please try removing any special characters"
                    });
                } else {
                    this.setState({
                        networkError: Globals.errorMessage.default,
                        resultsText: "Error: Couldn't get results from server"
                    });
                }
                this.setState({
                    searching: false
                });
            })
    
        });
    }

    /** Populates full results without text highlights and then starts the highlighting process */
    initialSearch = (searcherState) => {
        if(!this._mounted){ // User navigated away or reloaded
            return;
        }

        console.log("initialSearch");

        let searchUrl = new URL('text/search_no_context', Globals.currentHost);

        this._searchTerms = this.state.searcherInputs.titleRaw;

        let dataToPass = { 
            title: this.state.searcherInputs.titleRaw
        };

        // OPTION: If we restore a way to use search options for faster searches, we'll assign here
        if(this.state.useSearchOptions) {
            dataToPass = { 
                title: this.state.searcherInputs.titleRaw, 
                startPublish: this.state.searcherInputs.startPublish,
                endPublish: this.state.searcherInputs.endPublish,
                startComment: this.state.searcherInputs.startComment,
                endComment: this.state.searcherInputs.endComment,
                agency: this.state.searcherInputs.agency,
                state: this.state.searcherInputs.state,
                typeAll: this.state.searcherInputs.typeAll,
                typeFinal: this.state.searcherInputs.typeFinal,
                typeDraft: this.state.searcherInputs.typeDraft,
                typeOther: this.state.searcherInputs.typeOther,
                needsComments: this.state.searcherInputs.needsComments,
                needsDocument: this.state.searcherInputs.needsDocument
            };
        }

        dataToPass.title = postProcessTerms(dataToPass.title);

        // Proximity search from UI - surround with quotes, append ~#
        if(!this.state.searcherInputs.proximityDisabled && this.state.searcherInputs.proximityOption)
        {
            if(this.state.searcherInputs.proximityOption.value >= 0) {
                try {
                    dataToPass.title = 
                        ("\"" + dataToPass.title + "\"~" + this.state.searcherInputs.proximityOption.value);
                } catch(e) {
                    
                }
            }
        }

        //Send the AJAX call to the server

        // console.log("Search init");
        axios({
            method: 'POST', // or 'PUT'
            url: searchUrl,
            data: dataToPass
        }).then(response => {
            let responseOK = response && response.status === 200;
            if (responseOK) {
                return response.data;
            } else if (response.status === 204) {  // Probably invalid query due to misuse of *, "
                this.setState({
                    resultsText: "No results: Please check use of term modifiers"
                });
                return null;
            } else if(response.status === 403) {
                // Not logged in
                Globals.emitEvent('refresh', {
                    loggedIn: false
                });
            
            } else {
                console.log(response.status);
                return null;
            }
        }).then(currentResults => {
            let _data = [];
            if(currentResults && currentResults[0] && currentResults[0].doc) {
                
                _data = currentResults
                .map((result, idx) =>{
                    let doc = result.doc;
                    let newObject = {title: doc.title, 
                        agency: doc.agency, 
                        cooperatingAgency: doc.cooperatingAgency,
                        commentDate: doc.commentDate, 
                        registerDate: doc.registerDate, 
                        state: doc.state, 
                        documentType: doc.documentType, 
                        filename: doc.filename, 
                        commentsFilename: doc.commentsFilename,
                        size: doc.size,
                        id: doc.id,
                        luceneIds: result.ids,
                        folder: doc.folder,
                        plaintext: result.highlights,
                        name: result.filenames,

                        link: doc.link,
                        firstRodDate: doc.firstRodDate,
                        processId: doc.processId,
                        notes: doc.notes,
                        status: doc.status,
                        subtype: doc.subtype,
                        county: doc.county,

                        relevance: idx + 1 // sort puts "falsy" values at the bottom incl. 0
                    };
                    return newObject;
                }); 

                this.setState({
                    searchResults: _data,
                    outputResults: _data,
                    resultsText: _data.length + " Results",
                }, () => {
                    this.filterResultsBy(this._searcherState);
                    // console.log("Mapped data",_data);

                    this.countTypes();
                
                    this._searchId = this._searchId + 1;
                    // console.log("Launching fragment search ",this._searchId);
                    this.gatherHighlightsFVH(this._searchId, 0, searcherState, _data);
                });
            } else {
                // console.log("No results");
                this.setState({
                    searching: false,
                    searchResults: [],
                    outputResults: [],
                    resultsText: "No results found for " + this._searchTerms + " (try adding OR between words for less strict results?)"
                });
            }
        }).catch(error => { // Server down or 408 (timeout)
            console.error('Server is down or verification failed.', error);
            if(error.response && error.response.status === 408) {
                this.setState({
                    networkError: 'Request has timed out.'
                });
                this.setState({
                    resultsText: "Error: Request timed out"
                });
            } else if (error.response && error.response.status === 403) { // token expired?
                this.setState({
                    resultsText: "Error: Please login again (session expired)"
                });
                Globals.emitEvent('refresh', {
                    loggedIn: false
                });
            } else if(error.response && error.response.status === 400) { // bad request
                this.setState({
                    networkError: Globals.errorMessage.default,
                    resultsText: "Couldn't parse terms, please try removing any special characters"
                });
            } else {
                this.setState({
                    networkError: Globals.errorMessage.default,
                    resultsText: "Error: Couldn't get results from server"
                });
            }
            this.setState({
                searching: false
            });
        })
    }
    

    //     // Possible logic: 
    //     // 1. Send list of objects with filename + EISDoc ID.
    //     // Offset determines how many objects to send at a time.
    //     // They have to match the order that the frontend displays the filenames in, per card.
    //     // Getting highlights for page user is on, debounced, would be cool, but could be difficult.
    //     // Adding spinner as placeholder for highlights would also be cool.
    //     // 2. Backend gets text by matching on given list of data, and gets highlights from texts.
    //     // 3. Backend sends list of objects containing filename, EISDoc ID, highlight.
    //     // 4. Frontend receives, matches, updates highlights.

    //     // There shouldn't be any cause for giving the entire result set back to the backend.
    //     // Other logic would be to expect only highlights back in a particular order.  However sorting
    //     // would complicate this in several ways.

    

    // Because this seems so optimized on the backend now, we'll try getting 1000 at once after the first page.
    gatherHighlightsFVH = (searchId, _offset, _inputs, currentResults) => {
        if(!this._mounted){ // User navigated away or reloaded
            return; // cancel search
        }
        if(searchId < this._searchId) { // Search interrupted
            return; // cancel search
        }
        if(!axios.defaults.headers.common['Authorization']){ // Don't have to do this but it can save a backend call
            // this.props.history.push('/login'); // Prompt login if no auth token
        }
        if (typeof _offset === 'undefined') {
            _offset = 0;
        }
        if (typeof currentResults === 'undefined') {
            currentResults = [];
        }

        if(_offset > currentResults.length || this._canceled) {
            let resultsText = currentResults.length + " Results";
            if(this._canceled) {
                resultsText += " (stopped)";
            }
            // console.log("Nothing left to highlight",currentResults);
            this.setState({
                searching: false,
                resultsText: resultsText,
                shouldUpdate: true
            }, () => {
                this.filterResultsBy(this._searcherState);
            });
            return;
        }

        let _limit = 1000; // normally get 1000
        if(_offset === 0) {
            _limit = 10; // start with 10
        } else if(_offset === 10) {
            _limit = 990;
        }

        this.setState({
            snippetsDisabled: false,
			resultsText: currentResults.length + " Results.  Getting Texts...",
            networkError: "", // Clear network error
		}, () => {
            
            // For the new search logic, the idea is that the limit and offset are only for the text
            // fragments.  The first search should get all of the results, without context.
            // We'll need to consolidate them in the frontend and also ask for text fragments and assign them
            // properly
            let searchUrl = new URL('text/get_highlightsFVH', Globals.currentHost);

            // TODO: Gather limit # IDs and filenames starting at offset # from current results,
            // feed as data.  Because we're deciding what we want from the backend, offset is handled
            // locally.
            let _unhighlighted = [];
            for(let i = _offset; i < Math.min(currentResults.length, _offset + _limit); i++){
                // Push Lucene IDs and >-delimited list of filenames
                if(!Globals.isEmptyOrSpaces(currentResults[i].name)) {
                    // console.log("Pushing",i,j,currentResults[i].records[j].id);
                    _unhighlighted.push(
                        {
                            luceneIds: currentResults[i].luceneIds, 
                            filename: currentResults[i].name
                        }
                    );
                }
            }


            // If nothing to highlight in this batch, skip to next run
            if(_unhighlighted.length === 0) {
                if(searchId < this._searchId) {
                    return;
                } else {
                    this.gatherHighlightsFVH(searchId, _offset + _limit, _inputs, currentResults);
                }
                return;
            }

			let dataToPass = 
            { 
				unhighlighted: _unhighlighted,
                terms: postProcessTerms(_inputs.titleRaw),
                markup: _inputs.markup,
                fragmentSizeValue: _inputs.fragmentSizeValue
            };

            // console.log("For backend",dataToPass);

            //Send the AJAX call to the server
            axios({
                method: 'POST', // or 'PUT'
                url: searchUrl,
                data: (dataToPass)
            }).then(response => {
                let responseOK = response && response.status === 200;
                if (responseOK) {
                    return response.data;
                } else {
                    return null;
                }
            }).then(parsedJson => {
                if(parsedJson){
                    let updatedResults = this.state.searchResults;

                    // Fill highlights here
                    let x = 0;
                    for(let i = _offset; i < Math.min(currentResults.length, _offset + _limit); i++) {
                        // If search is interrupted, updatedResults[i] may be undefined (TypeError)
                        if(!Globals.isEmptyOrSpaces(currentResults[i].name)){
                            // console.log("Assigning",i,j,currentResults[i].records[j].name);
                            updatedResults[i].plaintext = parsedJson[x];
                            x++;
                        }
                    }
                    
                    // Verify one last time we want this before we actually commit to these results
                    if(searchId < this._searchId) {
                        return;
                    } else {
                        this.setState({
                            searchResults: updatedResults,
                            outputResults: updatedResults,
                            count: _offset,
                            // shouldUpdate: false
                        }, () => {
                            if(this._sortVal) {
                                this.sortDataByField(this._sortVal, this._ascVal);
                            }
                            this.filterResultsBy(this._searcherState);
                        });
                        
                        // offset for next run incremented by limit used
                        this.gatherHighlightsFVH(searchId, _offset + _limit, _inputs, updatedResults);
                    }
                }
            }).catch(error => { 
                if(error.name === 'TypeError') {
                    console.error(error);
                } else { // Server down or 408 (timeout)
                    console.error('Server is down or verification failed.', error);
                    let _networkError = 'Server is down or you may need to login again.';
                    let _resultsText = Globals.errorMessage.default;

                    if(error.response && error.response.status === 408) {
                        _networkError= 'Request has timed out.';
                        _resultsText = 'Timed out';
                    }

                    this.setState({
                        networkError: _networkError,
                        resultsText: Globals.errorMessage.default,
                        searching: false,
                        shouldUpdate: true
                    });
                }
            });
        });

        // Possible logic: 
        // 1. Send list of objects with filename + EISDoc ID.
        // Offset determines how many objects to send at a time.
        // They have to match the order that the frontend displays the filenames in, per card.
        // Getting highlights for page user is on, debounced, would be cool, but could be difficult.
        // Adding spinner as placeholder for highlights would also be cool.
        // 2. Backend gets text by matching on given list of data, and gets highlights from texts.
        // 3. Backend sends list of objects containing filename, EISDoc ID, highlight.
        // 4. Frontend receives, matches, updates highlights.

        // There shouldn't be any cause for giving the entire result set back to the backend.
        // Other logic would be to expect only highlights back in a particular order.  However sorting
        // would complicate this in several ways.

        
    }


	check = () => { // check if JWT is expired/invalid
		
        this.setState({loaded:false,down:false});

		let checkURL = new URL('test/check', Globals.currentHost);
		let result = false;
		axios.post(checkURL)
		.then(response => {
			result = response && response.status === 200;
			this.setState({
				verified: result,
			})
		})
		.catch((err) => { // This will catch a 403 from the server from a malformed/expired JWT, will also fire if server down
			if(!err.response){ // server isn't responding
				this.setState({
					networkError: Globals.errorMessage.default,
                    shouldUpdate: true,
                    down: true
				});
			} else if(err.response && err.response.status===403) {
                this.setState({
                    verified: false,
                    shouldUpdate: true
                });
                // this.props.history.push('/login');
                // this.setState({
                //     networkError: Globals.errorMessage.auth,
                //     shouldUpdate: true
                // });
            }
		})
		.finally(() => {
            this.setState({loaded:true});
			// console.log("Returning... " + result);
		});
		// console.log("App check");
    }
    
    /** Scroll to bottom on page change and populate full table with latest results */
    scrollToBottom = (_rows) => {
        try {
            // console.log("Page update");
            // console.log("Rows", _rows);
            // for(let i = 0; i < _rows.length; i++) {
            //     console.log(_rows[i].data);
            //     if(_rows[i].data.plaintext.length === 0){
            //         console.log("No text.  Should populate.");
            //         i = _rows.length;
            //     }
            // }
            this.setState({
                outputResults: this.state.searchResults,
                displayRows: _rows,
                shouldUpdate: true
            }, () => {
                setTimeout(() => {
                    this.endRef.current.scrollIntoView({ behavior: 'smooth' })
                }, 100);
            });
        } catch(e) {
            console.log("Scroll error", e);
        }
    }

    scrollToTop = () => {
        try {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch(e) {
            console.log("Scroll error", e);
        }
    }


    displayedRowsUnpopulated = () => {
        // console.log("Checking displayed rows...");
        for(let i = 0; i < this.state.displayRows.length; i++) {
            // console.log(this.state.displayRows[i].data);
            if(this.state.displayRows[i].data.plaintext.length === 0){
                console.log("No text.  Should populate.");
                return true;
            }
        }

        return false;
    }

    // Only works for records, not processes
    downloadCurrentAsTSV = () => {
        if(this.state.outputResults && this.state.outputResults.length > 0) {
            const resultsForDownload = this.state.outputResults.map((result, idx) => {
                // omit stuff like comments, highlights, relevance, lucene stuff
                let newResult = {
                    id: result.id,
                    title: result.title,
                    documentType: result.documentType,
                    registerDate: result.registerDate,
                    agency: result.agency,
                    cooperating_agency: result.cooperatingAgency,
                    state: result.state,
                    // county: result.county,
                    // subtype: result.subtype,
                    processId: result.processId,
                    // link: result.link,
                    notes: result.notes,
                    // rodDate: result.firstRodDate
                    status: result.status,
                    folder: result.folder
                }
                if(!newResult.processId) { // don't want to imply zeroes are valid
                    newResult.processId = '';
                }
                return newResult;
            });
            this.downloadResults(Globals.jsonToTSV(resultsForDownload));
        }
    }

    // best performance is to Blob it on demand
    downloadResults = (results) => {
        if(results) {
            const csvBlob = new Blob([results]);
            const today = new Date().toISOString();
            const csvFilename = `search_results_${today}.tsv`;

    
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
	

	render() {
		if(this.state.verified){

			return (
                <>
				<div id="app-content" className="footer-content">
                    <Helmet>
                        <meta charSet="utf-8" />
                        <title>Search - NEPAccess</title>
                        <link rel="canonical" href="https://nepaccess.org/search" />
                    </Helmet>
                    <Search 
                        search={this.startNewSearch} 
                        stop={this.stopSearch}
                        filterResultsBy={this.filterResultsBy} 
                        searching={this.state.searching} 
                        useOptions={this.state.useSearchOptions}
                        optionsChanged={this.optionsChanged}
                        count={this.state.count}
                        networkError={this.state.networkError}
                        parseError={this.state.parseError}
                        finalCount={this._finalCount}
                        draftCount={this._draftCount}
                        eaCount={this._eaCount}
                        rodCount={this._rodCount}
                        scopingCount={this._scopingCount}
                    />
                    <SearchResults 
                        sort={this.sort}
                        results={this.state.outputResults} 
                        resultsText={this.state.resultsText} 
                        searching={this.state.searching}
                        snippetsDisabled={this.state.snippetsDisabled} 
                        scrollToBottom={this.scrollToBottom}
                        scrollToTop={this.scrollToTop}
                        shouldUpdate={this.state.shouldUpdate}
                        download={this.downloadCurrentAsTSV}
                    />
				</div>
                <div ref={this.endRef} />
                <Footer id="footer"></Footer>
                </>
			)

		}
        else if(this.state.down) {
            return (
            <div className="content">
                <div>
                    <label className="logged-out-header">
                        Sorry, the server may be down for maintenance.  Please try reloading the page in a minute.
                    </label>
                </div>
            </div>);
        }
		else if(this.state.loaded)
		{
			return (
				<div className="content">
                    <div>
                        <label className="logged-out-header">
                            NEPAccess searches are not currently available to the public.  Please <Link to="/login">log in.</Link>
                        </label>
                    </div>
				</div>
			)
		}
        else { // show nothing until at least we've loaded
            return (<div className="content">

                <div className="loader-holder">
                    <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
                </div>
            </div>);
        }
    }
    
	// After render
	componentDidMount() {
        this.check();
        this._mounted = true;

        // Option: Rehydrate old search results and everything?
        try {
            const rehydrate = JSON.parse(persist.getItem('results'));
            // console.log("Old results", rehydrate);
            this.setState(
                rehydrate
            );
        }
        catch(e) {
            // do nothing
        }
    }
    
    async componentWillUnmount() {
        // console.log("Unmount app");
        this._mounted = false;

        // Option: Rehydrate if not interrupting a search
        if(!this.state.searching){
            persist.setItem('results', JSON.stringify(this.state));
        }
    }
	
}

function matchesEa(docType) {
    return (
        (docType === "EA") );
}

function matchesRod(docType) {
    return (
        (docType === "ROD") );
}

function matchesScoping(docType) {
    return (
        (docType === "Scoping Report") );
}

/** Return modified terms for user to see */
function preProcessTerms(terms) {
    return terms;
}

/** Return modified terms but not for user to see */
function postProcessTerms(terms) {
    return terms.replaceAll(':','');
        // .replaceAll(/(^|[\s]+)US($|[\s]+)/g,' ("U. S." | U.S. | US) ') // this was a very bad idea
        // .replaceAll(/(^|[\s]+)U\.S\.($|[\s]+)/g,' ("U. S." | U.S. | US) ');
}