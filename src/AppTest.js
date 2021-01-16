import React from 'react';
import axios from 'axios';

import CardResultsTest from './CardResultsTest.js';
import Search from './Search.js';

import './User/login.css';

import Globals from './globals.js';
import persist from './persist.js';

/** For testing redesigned, consolidated search which is in progress */
export default class AppTest extends React.Component {

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
        count: 0,
		resultsText: 'Results',
		networkError: '',
		verified: false,
        searching: false,
        useSearchOptions: false,
        snippetsDisabled: false,
        isDirty: false
    }
    
    // For canceling a search when component unloads
    _mounted = false;

    // For canceling any running search if user starts a new search before results are done
    _searchId = 1;

    // For filtering results mid-search
    _searcherState = null; 

    // For display
    _searchTerms = "";

    optionsChanged = (val) => {
        this.setState({
            useSearchOptions: val
        });
    }

    matchesArray(field, val) {
        return function (a) {
            let returnValue = false;
            val.forEach(item =>{
                if (a[field] === item) {
                    returnValue = true;
                }
            });
            return returnValue;
        };
    }

    matchesStartDate(val) {
        return function (a) {
            return (a["registerDate"] >= val);
        };
    }
    
    matchesEndDate(val) {
        return function (a) {
            return (a["registerDate"] <= val); // should this be inclusive? <= or <
        };
    }
    
    matchesType(matchFinal, matchDraft) {
        return function (a) {
            return (
                (a["documentType"] === "Final" && matchFinal) || 
                (a["documentType"] === "Draft" && matchDraft)
            );
        };
    }

    /** Design: Search component calls this parent method which controls
    * the results, which gives a filtered version of results to CardResults */
    filterResultsBy = (searcherState) => {
        this._searcherState = searcherState; // for live filtering
        // Only filter if there are any results to filter
        if(this.state.searchResults && this.state.searchResults.length > 0){
            // Deep clone results
            let isDirty = false;
            let filteredResults = JSON.parse(JSON.stringify(this.state.searchResults));
            
            if(searcherState.agency && searcherState.agency.length > 0){
                isDirty = true;
                filteredResults = filteredResults.filter(this.matchesArray("agency", searcherState.agency));
            }
            if(searcherState.state && searcherState.state.length > 0){
                isDirty = true;
                filteredResults = filteredResults.filter(this.matchesArray("state", searcherState.state));
            }
            if(searcherState.startPublish){
                isDirty = true;
                let formattedDate = Globals.formatDate(searcherState.startPublish);
                filteredResults = filteredResults.filter(this.matchesStartDate(formattedDate));
            }
            if(searcherState.endPublish){
                isDirty = true;
                let formattedDate = Globals.formatDate(searcherState.endPublish);
                filteredResults = filteredResults.filter(this.matchesEndDate(formattedDate));
            }
            if(searcherState.typeFinal || searcherState.typeDraft){
                isDirty = true;
                filteredResults = filteredResults.filter(this.matchesType(searcherState.typeFinal, searcherState.typeDraft));
            }
            
            // If there are any active filters, display as "Matches", else "Results"
            if(isDirty){
                this.setState({
                    outputResults: filteredResults,
                    resultsText: filteredResults.length + " Matches"
                });
            } else {
                this.setState({
                    outputResults: filteredResults,
                    resultsText: filteredResults.length + " Results"
                });
            }
        }
    }

    // Sort search results on call from results component
    sort = (val) => {
        this.sortDataByField(val, true);
    }

    // TODO: asc/desc (> vs. <, default desc === >)
    sortDataByField = (field, ascending) => {
        this.setState({
            // searchResults: this.state.searchResults.sort((a, b) => (a[field] > b[field]) ? 1 : -1)
            outputResults: this.state.outputResults.sort((this.alphabetically(field, ascending)))
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

    // Start a brand new search.
    startNewSearch = (searcherState) => {
        this._searcherState = searcherState; // for live filtering

        // 1: Collect contextless results
        //        - Consolidate all of the filenames by metadata record into singular results
        //          (maintaining original order by first appearance)
        this.initialSearch(searcherState);
        // TODO: 2: Begin collecting text fragments 10-100 at a time or all for current page,  
        //          assign accordingly, in a cancelable recursive function
        //          IF TITLE ONLY SEARCH: We can stop here.

    }

    initialSearch = (searcherState) => {
        if(!this._mounted){ // User navigated away or reloaded
            return;
        }

		this.setState({
            // Fresh search, fresh results
            outputResults: [],
            searcherInputs: searcherState,
            isDirty: true,
            snippetsDisabled: searcherState.searchOption==="C",
			resultsText: "Loading results...",
            networkError: "", // Clear network error
            searching: true
		}, () => {

            // title-only
            let searchUrl = new URL('text/search', Globals.currentHost);
            
            // For the new search logic, the idea is that the limit and offset are only for the text
            // fragments.  The first search should get all of the results, without context.
            // We'll need to consolidate them in the frontend and also ask for text fragments and assign them
            // properly
            if(searcherState.searchOption && searcherState.searchOption === "A") {
                searchUrl = new URL('text/search_no_context', Globals.currentHost);
            } else if(searcherState.searchOption && searcherState.searchOption === "B") {
                searchUrl = new URL('text/search_no_context', Globals.currentHost);
            }

			if(!axios.defaults.headers.common['Authorization']){ // Don't have to do this but it can save a backend call
				this.props.history.push('/login') // Prompt login if no auth token
            }

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
                } else {
                    console.log(response.status);
                    return null;
                }
            }).then(currentResults => {
                let _data = [];
                if(currentResults && currentResults[0] && currentResults[0].doc) {
                    _data = currentResults.map((result, idx) =>{
                        let doc = result.doc;
                        let newObject = {title: doc.title, 
                            agency: doc.agency, 
                            commentDate: doc.commentDate, 
                            registerDate: doc.registerDate, 
                            state: doc.state, 
                            documentType: doc.documentType, 
                            filename: doc.filename, 
                            commentsFilename: doc.commentsFilename,
                            size: doc.size,
                            id: doc.id,
                            folder: doc.folder,
                            plaintext: result.highlights,
                            name: result.filenames,
                            relevance: idx
                        };
                        return newObject;
                    }); 
                    this.setState({
                        searchResults: _data,
                        outputResults: _data,
                        count: this.state.outputResults.length,
                        resultsText: currentResults.length + " Results",
                    }, () => {
                        this.filterResultsBy(this._searcherState);
                    
                        // title-only (or blank search===no text search at all): return
                        if(Globals.isEmptyOrSpaces(searcherState.titleRaw) || 
                                (searcherState.searchOption && searcherState.searchOption === "C"))
                        {
                            this.setState({
                                searching: false
                            });
                        } else {
                            this._searchId = this._searchId + 1;
                            // console.log("Launching fragment search ",this._searchId);
                            this.gatherHighlights(this._searchId, 0, searcherState, _data);
                        }
                    });
                } else {
                    // Found nothing
                    // console.log("No results");
                    this.setState({
                        searching: false,
                        resultsText: "No results found"
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
                } else {
                    this.setState({
                        networkError: 'Server is down or you may need to login again.'
                    });
                    this.setState({
                        resultsText: "Error: Couldn't get results from server"
                    });
                }
                this.setState({
                    searching: false
                });
            })
    
        });
    }
    
    // TODO
    gatherHighlights = (searchId, _offset, _inputs, currentResults) => {
        if(!this._mounted){ // User navigated away or reloaded
            return; // cancel search
        }
        if(searchId < this._searchId) { // Search interrupted
            return; // cancel search
        }
        if(!axios.defaults.headers.common['Authorization']){ // Don't have to do this but it can save a backend call
            this.props.history.push('/login'); // Prompt login if no auth token
        }
        if (typeof _offset === 'undefined') {
            _offset = 0;
        }
        if (typeof currentResults === 'undefined') {
            currentResults = [];
        }

        let _limit = 100; // start with 100

        this.setState({
            isDirty: true,
            snippetsDisabled: false,
			resultsText: "Searching file texts...",
            networkError: "", // Clear network error
		}, () => {
            
            // For the new search logic, the idea is that the limit and offset are only for the text
            // fragments.  The first search should get all of the results, without context.
            // We'll need to consolidate them in the frontend and also ask for text fragments and assign them
            // properly
            let searchUrl = new URL('text/get_highlights', Globals.currentHost);

            // TODO: Gather limit # IDs and filenames starting at offset # from current results,
            // feed as data.  Because we're deciding what we want from the backend, offset is handled
            // locally.
            let _unhighlighted = [];
            for(let i = _offset; i < Math.min(currentResults.length, _offset + _limit); i++){
                // Push EISDoc ID and comma-delimited list of filenames
                if(!Globals.isEmptyOrSpaces(currentResults[i].name)){
                    _unhighlighted.push({id: currentResults[i].id, filename: currentResults[i].name});
                }
            }
            // If everything is highlighted already, don't bother
            if(_unhighlighted.length === 0) {
                this.setState({
                    searching: false
                });
                return;
            }

			let dataToPass = { 
				unhighlighted: _unhighlighted,
                terms: _inputs.titleRaw,
            };
            // console.log("Filenames sent out: ",_unhighlighted);



            //Send the AJAX call to the server
            axios({
                method: 'POST', // or 'PUT'
                url: searchUrl,
                data: dataToPass
            }).then(response => {
                let responseOK = response && response.status === 200;
                if (responseOK) {
                    return response.data;
                } else {
                    return null;
                }
            }).then(parsedJson => {
                // console.log('this should be json', parsedJson);
                if(parsedJson){
                    let updatedResults = this.state.searchResults;

                    // Fill highlights here; update state
                    // TODO: Because each result can represent many highlights, CardResult expects
                    // array of highlights.
                    // Presumably comes back in order it was sent out, so we could just do this?:
                    let j = 0;
                    for(let i = _offset; i < Math.min(currentResults.length, _offset + _limit); i++) {
                        if(!Globals.isEmptyOrSpaces(currentResults[i].name)){
                            updatedResults[i].plaintext = parsedJson[j];
                            j++;
                        }
                    }
                    
                    // Verify one last time we want this before we actually commit to these results
                    // (new search could have started while getting them)
                    if(searchId < this._searchId) {
                        this.setState({
                            searching: false
                        });
                        return;
                    } else {
                        this.setState({
                            searchResults: updatedResults,
                            outputResults: updatedResults,
                            count: this.state.outputResults.length,
                            resultsText: currentResults.length + " Results",
                        }, () => {
                            this.filterResultsBy(this._searcherState);
                        });
                        
                        // If we got zero results specifically from this search, then we can stop.
                        // With current logic, this shouldn't happen - should've returned already.
                        if (!parsedJson || !parsedJson[0] || parsedJson[0].length<1) {
                            console.log("Got no more results");
                            this.setState({
                                searching: false
                            });
                            // console.log("Search done #",searchId);
                        } else {
                            // offset for next run should be incremented by previous limit used
                            this.gatherHighlights(searchId, _offset + _limit, _inputs, updatedResults);
                        }
                    }
                }
            }).catch(error => { // Server down or 408 (timeout)
                console.error('Server is down or verification failed.', error);
                if(error.response && error.response.status === 408) {
                    this.setState({
                        networkError: 'Request has timed out.',
                        resultsText: 'Timed out',
                        searching: false
                    });
                } else {
                    this.setState({
                        networkError: 'Server is down or you may need to login again.',
                        resultsText: 'Server unresponsive',
                        searching: false
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

	search = (searcherState, _offset, currentResults, searchId) => {
        if(!this._mounted){ // User navigated away or reloaded
            return;
        }
        if(searchId < this._searchId) { // Search interrupted, cancel this one
            // console.log("Search canceled: ", searchId);
            return;
        }

        // console.log("Search running: ", searchId);
        let _inputs = searcherState;

        // There is no longer an advanced search so this is no longer useful
        // if(!searcherState.optionsChecked){
        //     _inputs = Globals.convertToSimpleSearch(searcherState);
        // }
        
        if (typeof _offset === 'undefined') {
            // console.log("Offset undefined, using " + searcherState.offset);
            _offset = _inputs.offset;
        }
        if (typeof currentResults === 'undefined') {
            // console.log("Resetting results");
            currentResults = [];
        }
        
        // For now, first do a run of limit 100 with 0 offset, then a run of limit 1000000 and 100 offset
        
        let _limit = 100; // start with 100
        if(_inputs.titleRaw.trim().length < 1 
                || _inputs.searchOption==="C" 
                // || _offset === 100
                ) {
            _limit = 1000000; // go to 1000000 if this is the second pass (offset of 100) or textless/title-only search
        }

		this.setState({
            searcherInputs: _inputs,
            isDirty: true,
            snippetsDisabled: _inputs.searchOption==="C",
			resultsText: "Loading results...",
			networkError: "" // Clear network error
		}, () => {

            // title-only
            let searchUrl = new URL('text/search', Globals.currentHost);
            
            if(searcherState.searchOption && searcherState.searchOption === "A") {
                searchUrl = new URL('text/search_2', Globals.currentHost);
            } else if(searcherState.searchOption && searcherState.searchOption === "B") {
                searchUrl = new URL('text/search_2', Globals.currentHost);
            }

			if(!axios.defaults.headers.common['Authorization']){ // Don't have to do this but it can save a backend call
				this.props.history.push('/login') // Prompt login if no auth token
            }

			let dataToPass = { 
				title: this.state.searcherInputs.titleRaw, 
                limit: _limit,
                offset: _offset
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
                    needsDocument: this.state.searcherInputs.needsDocument,
                    limit: _limit,
                    offset: _offset
                };
            }

            this.setState({
                searching: true
            }, () => {
                //Send the AJAX call to the server
                // console.log("Running with offset: " + _offset + " and limit: " + this.state.searcherInputs.limit + " and searching state: " + this.state.searching);


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
                    })
                    } else {
                        return null;
                    }
                }).then(parsedJson => {
                    // console.log('this should be json', parsedJson);
                    if(parsedJson){

                        currentResults = currentResults.concat(parsedJson);

                        // console.log("Setup data");
                        let _data = [];
                        if(currentResults){
                            if(currentResults[0] && currentResults[0].doc) {
                                _data = currentResults.map((result, idx) =>{
                                    let doc = result.doc;
                                    let newObject = {title: doc.title, 
                                        agency: doc.agency, 
                                        commentDate: doc.commentDate, 
                                        registerDate: doc.registerDate, 
                                        state: doc.state, 
                                        documentType: doc.documentType, 
                                        filename: doc.filename, 
                                        commentsFilename: doc.commentsFilename,
                                        size: doc.size,
                                        id: doc.id,
                                        folder: doc.folder,
                                        plaintext: result.highlight,
                                        name: result.filename,
                                        relevance: idx
                                    };
                                    return newObject;
                                }); 
                            }
                        }
                        
                        // Verify one last time we want this before we actually commit to these results
                        // (new search could have started while getting them)
                        if(searchId < this._searchId) {
                            this.setState({
                                searching: false
                            });
                            return;
                        }

                        this.setState({
                            searchResults: _data,
                            outputResults: _data,
                            count: this.state.outputResults.length,
                            resultsText: currentResults.length + " Results",
                        }, () => {
                            this.filterResultsBy(this._searcherState);
                        });
                        
                        // If we got less results than our limit allowed, this could be because of
                        // the new results condensing.  Therefore we need a new way to know if we
                        // actually ran out of results.
                        // if (parsedJson.length < this.state.searcherInputs.limit) {

                        // With this logic we will always run at least two searches, however the second
                        // search may instantly return with no new results so there isn't much harm
                        
                        // If we got zero results specifically from this search, then we can stop.
                        // Or if we ran a title-only search (max limit) we can stop.
                        if (!parsedJson || !parsedJson[0] || _limit === 1000000) {
                            this.setState({
                                searching: false
                            //     searchResults: currentResults,
                            //     resultsText: currentResults.length + " Results",
                            });
                            // console.log("Search done",searchId);
                        } else {
                            // offset for next run should be incremented by previous limit used
                            this.search(searcherState, _offset + _limit, currentResults, searchId);
                        }


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
                    } else {
                        this.setState({
                            networkError: 'Server is down or you may need to login again.'
                        });
                        this.setState({
                            resultsText: "Error: Couldn't get results from server"
                        });
                    }
                    this.setState({
                        searching: false
                    });
                })
                // .finally(x => {
                //     this.setState({
                //         searching: false
                //     });
                // });
            });

            // axios({
            //     method: 'POST', // or 'PUT'
            //     url: searchUrl,
            //     // data: this.state.searcherInputs // data can be `string` or {object}
            //     data: dataToPass
            // }).then(response => {
            //     let responseOK = response && response.status === 200;
            //     if (responseOK) {
            //         return response.data;
            //         } else if (response.status === 204) {  // Probably invalid query due to misuse of *, "
            //         this.setState({
            //             resultsText: "No results: Please check use of * and \" characters"
            //         })
            //     } else {
            //         return null;
            //     }
            // }).then(parsedJson => {
            //     // console.log('this should be json', parsedJson);
            //     if(parsedJson){
            //         this.setState({
            //             searchResults: parsedJson,
            //             resultsText: parsedJson.length + " Results",
            //         });
            //     }
            // }).catch(error => { // If verification failed, it'll be a 403 error (includes expired tokens) or server down
            //     console.error('Server is down or verification failed.', error);
            //     this.setState({
            //         networkError: 'Server is down or you may need to login again.'
            //     });
            //     this.setState({
            //         resultsText: "Error: Couldn't get results from server"
            //     });
            // }).finally(x => {
            //     this.setState({
            //         searching: false
            //     });
            // });
		
        });
	}
	

	check = () => { // check if JWT is expired/invalid
		
		let checkURL = new URL('test/check', Globals.currentHost);
		let result = false;
		axios.post(checkURL)
		.then(response => {
			result = response && response.status === 200;
			this.setState({
				verified: result
			})
		})
		.catch((err) => { // This will catch a 403 from the server from a malformed/expired JWT, will also fire if server down
			if(!err.response){ // Probably no need to redirect to login if server isn't responding
				this.setState({
					networkError: "Server may be down, please try again later."
				});
			} else { // 403
				// this.props.history.push('/login');
			}
		})
		.finally(() => {
			// console.log("Returning... " + result);
		});
		// console.log("App check");
	}
	

	render() {
		if(this.state.verified){

			return (
				<div id="app-content">
					<label className="errorLabel">{this.state.networkError}</label>
                    <Search 
                        search={this.startNewSearch} 
                        filterResultsBy={this.filterResultsBy} 
                        searching={this.state.searching} 
                        useOptions={this.state.useSearchOptions}
                        optionsChanged={this.optionsChanged}
                        count={this.state.count}
                    />
                    <CardResultsTest 
                        sort={this.sort}
                        results={this.state.outputResults} 
                        resultsText={this.state.resultsText} 
                        searching={this.state.searching}
                        snippetsDisabled={this.state.snippetsDisabled} 
                    />
				</div>
			)

		}
		else 
		{
			return (
				<div className="content">
					<label className="logged-out-header">
                        NEPAccess searches are not currently available to the public.
                    </label>
				</div>
			)
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