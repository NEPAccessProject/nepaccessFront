import React from "react";
// import { Link } from 'react-router-dom';
import { Helmet } from "react-helmet";

import axios from "axios";

import Search from "./search/Search.js";
import SearchProcessResults from "./search/SearchProcessResults.js";

import Footer from "./Footer.js";

import { CssBaseline } from "@material-ui/core";
import { Typography } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import "./User/login.css";
import Globals from "./globals.js";
import persist from "./persist.js";
import SearchContext from "./search/SearchContext.js";
import theme from "./styles/theme";
const _ = require("lodash");

/** For testing redesigned, consolidated search which is in progress */
export default class App extends React.Component {
  state = {
    searcherInputs: {
      startPublish: "",
      endPublish: "",
      agency: [],
      state: [],
      needsComments: false,
      needsDocument: true,
      limit: 25,
    },
    searchResults: [],
    outputResults: [],
    displayRows: [],
    geoResults: null,
    geoLoading: true,
    count: 0,
    resultsText: "Results",
    networkError: "",
    parseError: "",
    verified: false,
    searching: false,
    useSearchOptions: false,
    snippetsDisabled: false,
    shouldUpdate: false,
    loaded: false,
    down: false,
    isMapHidden: false,
    filtersHidden: false,
    lookupResult: null,
    lastSearchedTerm: "",
  };

  constructor(props) {
    super(props);
    //        console.log("🚀 ~ file: App.js:56 ~ App ~ constructor ~ props:", props)
    this.endRef = React.createRef();
    // this.getGeoDebounced = _.debounce(this.getGeoData,1000);
    this.getGeoDebounced = _.debounce(this.getAllGeoData, 1000);
    this.gatherPageHighlightsDebounced = _.debounce(
      this.gatherPageHighlights,
      1000
    );
  }

  // Necessary for on-demand highlighting per page
  _page = 1;
  _pageSize = 10;

  // For canceling a search when component unloads
  _mounted = false;

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
  _noiCount = "";
  _rodCount = "";
  _scopingCount = "";

  resetTypeCounts = () => {
    this._finalCount = "";
    this._draftCount = "";

    this._eaCount = "";
    this._noiCount = "";
    this._rodCount = "";
    this._scopingCount = "";
  };

  optionsChanged = (val) => {
    this.setState({
      useSearchOptions: val,
    });
  };

  setPageInfo = (page, pageSize) => {
    this._page = page;
    this._pageSize = pageSize;
    // console.log("page, pageSize",this._page,this._pageSize);
    this._searchId = this._searchId + 1;
    this.gatherPageHighlightsDebounced(
      this._searchId,
      this._searcherState,
      this.state.outputResults
    );
  };

  countTypes = () => {
    let finals = 0;
    let drafts = 0;
    let eas = 0;
    let rods = 0;
    let nois = 0;
    let scopings = 0;

    this.state.searchResults.forEach((process) => {
      process.records.forEach((item) => {
        if (Globals.isFinalType(item.documentType)) {
          finals++;
        } else if (Globals.isDraftType(item.documentType)) {
          drafts++;
        } else if (matchesEa(item.documentType)) {
          eas++;
        } else if (matchesRod(item.documentType)) {
          rods++;
        } else if (matchesScoping(item.documentType)) {
          scopings++;
        } else if (matchesNOI(item.documentType)) {
          nois++;
        }
      });
    });

    this._finalCount = "(" + finals + ")";
    this._draftCount = "(" + drafts + ")";
    this._eaCount = "(" + eas + ")";
    this._rodCount = "(" + rods + ")";
    this._noiCount = "(" + nois + ")";
    this._scopingCount = "(" + scopings + ")";
    // this.setState({finalCount: "("+count+")"});
  };

  /** Get all state/county geodata. Doesn't hit backend if we have the data in state. */
  getAllGeoData = () => {
    if (!this.state.geoResults || !this.state.geoResults[0]) {
      let url = Globals.currentHost + "geojson/get_all_state_county";

      axios.get(url).then((response) => {
        if (response.data && response.data[0]) {
          for (let i = 0; i < response.data.length; i++) {
            // console.log(response.data[i].count); // TODO: use count
            let json = JSON.parse(response.data[i]["geojson"]);
            json.style = {};
            json.sortPriority = 0;

            if (json.properties.COUNTYFP) {
              json.originalColor = "#3388ff";
              json.style.color = "#3388ff"; // county: default (blue)
              json.style.fillColor = "#3388ff";
              json.sortPriority = 5;
            } else if (json.properties.STATENS) {
              json.originalColor = "#000";
              json.style.color = "#000"; // state: black
              json.style.fillColor = "#000";
              json.sortPriority = 4;
            } else {
              json.originalColor = "#D54E21";
              json.style.color = "#D54E21";
              json.style.fillColor = "#D54E21";
              json.sortPriority = 6;
            }
            response.data[i] = json;
          }

          let sortedData = response.data.sort(
            (a, b) => parseInt(a.sortPriority) - parseInt(b.sortPriority)
          );

          // console.log("Called for geodata", sortedData);
          this.setState({
            geoResults: sortedData,
            geoLoading: false,
          });
        } else {
          this.setState({
            geoLoading: false,
          });
        }
      });
    }
  };

  /** Design: Search component calls this parent method which controls
   * the results, which gives a filtered version of results to SearchResults.
   * Sorts by existing sort/asc values before updating state for a more responsive UX.
   * Gets highlights for current page whenever it's called. */
  filterResultsBy = (searcherState) => {
    console.log(`file: App.js:213 ~ App ~ searcherState:`, searcherState);
    // console.log("Filtering");
    this._searcherState = searcherState; // for live filtering
    // Only filter if there are any results to filter
    if (this.state.searchResults && this.state.searchResults.length > 0) {
      const filtered = Globals.doFilter(
        searcherState,
        this.state.searchResults,
        this.state.searchResults.length,
        false
      );

      // Even if there are no filters active we still need to update to reflect this,
      // because if there are no filters the results must be updated to the full unfiltered set
      this.setState(
        {
          outputResults: filtered.filteredResults.sort(
            this.alphabetically(this._sortVal, this._ascVal)
          ),
          resultsText: filtered.textToUse,
          searching: true,
          shouldUpdate: true,
        },
        () => {
          // this.getGeoDebounced(filtered.filteredResults);
          this.getGeoDebounced();

          this._searchId = this._searchId + 1;
          this.gatherPageHighlightsDebounced(
            this._searchId,
            searcherState,
            filtered.filteredResults
          );
        }
      );
    }
  };

  /** Sort search results on call from SearchProcessResults.java, assigns _sortVal and _ascVal in case we need them
   * and then activates sortDataByFieldThenHighlight() which then asks for highlighting if needed
   */
  sort = (val, asc) => {
    this._sortVal = val;
    this._ascVal = asc;
    this.sortDataByFieldThenHighlight(val, asc);
  };

  /** Sort, then highlight */
  sortDataByFieldThenHighlight = (field, ascending) => {
    // console.log("Sorting");
    this.setState(
      {
        // searchResults: this.state.searchResults.sort((a, b) => (a[field] > b[field]) ? 1 : -1)
        searching: true,
        outputResults: this.state.outputResults.sort(
          this.alphabetically(field, ascending)
        ),
      },
      () => {
        this.gatherPageHighlightsDebounced(
          this._searchId,
          this._searcherState,
          this.state.outputResults
        );
      }
    );
  };

  /** Do all cleanup needed: Just set searching to false */
  endEarly = () => {
    if (this.state.searching) {
      this.setState({
        searching: false,
      });
    }
  };

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
      } else if (!b[field]) {
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

  /** Assign any existing highlights from the first-page highlight pass, which is now done before full record population */
  mergeHighlights = (data) => {
    // console.log("Merge highlights",data, this.state.searchResults);
    if (!this.state.searchResults || !this.state.searchResults[0]) {
      // console.log("Nothing here yet");
      return data;
    }

    for (let i = 0; i < this.state.searchResults.length; i++) {
      if (data[i]) {
        for (let j = 0; j < this.state.searchResults[i].records.length; j++) {
          if (
            data[i].records[j] &&
            this.state.searchResults[i].records[j] &&
            this.state.searchResults[i].records[j].plaintext &&
            this.state.searchResults[i].records[j].plaintext[0]
          ) {
            let same =
              data[i].records[j].id ===
              this.state.searchResults[i].records[j].id;
            // console.log("Same?", same, data[i].records[j].id, this.state.searchResults[i].records[j].id);
            if (same) {
              data[i].records[j].plaintext =
                this.state.searchResults[i].records[j].plaintext;
              // console.log("Assigned plaintext", this.state.searchResults[i].records[j].plaintext);
            }
          } else {
            // console.log("Doesn't exist");
          }
        }
      }
    }

    return data;
  };

  /** Rebuild results into process-oriented results, where a new object property is created for every process ID.
   * It's basically a hashmap where the processIDs are keys.
   * A new unique key is created if there is no process.
   * So results returned look like: results{
   *  key: {title: "", agency: "", state: "", relevance: #, date?: ..., records: [...]},
   *  otherKey: {...}, ...
   * }
   *
   * can iterate over a results object later using forEach() if you transform the object into an array first,
   * using Object.keys(), Object.values(), or Object.entries()
   */
  buildData = (data) => {
    console.log(`file: App.js:362 ~ App ~ data:`, data);
    // console.log("Building",data);
    let processResults = {};
    let newUniqueKey = -1;
    let i = 0;

    data.forEach((datum) => {
      // Use process IDs as keys
      let key = datum.processId;

      // Set impossible process ids as keys for records without one and use them as "solo" process items
      if (key === null || key === 0) {
        key = newUniqueKey;
        newUniqueKey = newUniqueKey - 1;
      }

      // Init if necessary
      if (!processResults[key]) {
        // New card: New original card index, can be useful later
        processResults[key] = {
          records: [],
          processId: key,
          isProcess: true,
          originalIndex: i,
        };
        i++;
      }
      if (key < 0) {
        // Solo process, use ID
        processResults[key].processId = datum.id;
        processResults[key].isProcess = false;
      }

      // Assign latest date and latest title at the same time
      if (!processResults[key].registerDate && datum.registerDate) {
        processResults[key].registerDate = datum.registerDate;
        processResults[key].title = datum.title;
      } else if (
        datum.registerDate &&
        processResults[key].registerDate &&
        processResults[key].registerDate < datum.registerDate
      ) {
        processResults[key].registerDate = datum.registerDate;
        processResults[key].title = datum.title;
      }

      // Try to simply get first non-null county, if available (if multiple choices, we don't know which is
      // the most accurate)
      if (!processResults[key].county) {
        processResults[key].county = datum.county;
      }

      if (!processResults[key].action) {
        processResults[key].action = datum.action;
      }
      if (!processResults[key].decision) {
        processResults[key].decision = datum.decision;
      }

      // Add record to array of records for this "key"
      processResults[key].records.push(datum);

      // Lowest number = highest relevance; keep the highest relevance.  All datums have a relevance value.
      if (processResults[key].relevance) {
        // already have relevance: use lowest
        processResults[key].relevance = Math.min(
          datum.relevance,
          processResults[key].relevance
        );
      } else {
        // don't have relevance yet: init
        processResults[key].relevance = datum.relevance;
      }

      // Assume state and agency are consistent
      if (!processResults[key].agency) {
        processResults[key].agency = datum.agency;
      }
      if (!processResults[key].state) {
        processResults[key].state = datum.state;
      }

      // titles change, which makes everything harder.
      // This logic just assigns the first final type's title as the title.
      // if(!processResults[key].title) {
      //     processResults[key].title = _title;
      // } else if(Globals.isFinalType(datum.documentType)) {
      //     processResults[key].title = datum.title;
      // }
    });

    // Have to "flatten" and also sort that by relevance, then merge any existing highlights
    return this.mergeHighlights(
      Object.values(processResults).sort(function (a, b) {
        return a.relevance - b.relevance;
      })
    );
  };

  // Start a brand new search.
  startNewSearch = (searcherState) => {
    console.log("START NEW SEARCH", searcherState);

    // Reset page, page size
    this._page = searcherState.page || 1;
    this._pageSize = searcherState.limit || 10;

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
  };

  /** Just get the top results quickly before launching the "full" search with initialSearch() */
  startSearch = (searcherState) => {
    console.log(`file: App.js:517 ~ App ~ searcherState - startSearch():`, searcherState);
    Globals.emitEvent("new_search");
    if (!this._mounted) {
      // User navigated away or reloaded
      return;
    }

    // console.log("Start search");

    this.setState(
      {
        // Fresh search, fresh results
        searchResults: [],
        outputResults: [],
        // geoResults: null,
        count: 0,
        searcherInputs: searcherState,
        snippetsDisabled: searcherState.searchOption === "C",
        resultsText: "Loading results...",
        networkError: "", // Clear network error
        searching: true,
        shouldUpdate: true,
        lastSearchedTerm: searcherState.titleRaw,
      },
      () => {
        // title-only
        let searchUrl = new URL("text/search", Globals.currentHost);

        // For the new search logic, the idea is that the limit and offset are only for the text
        // fragments.  The first search should get all of the results, without context.
        // We'll need to consolidate them in the frontend and also ask for text fragments and assign them
        // properly
        if (searcherState.searchOption && searcherState.searchOption === "A") {
          searchUrl = new URL("text/search_top", Globals.currentHost);
        } else if (
          searcherState.searchOption &&
          searcherState.searchOption === "B"
        ) {
          searchUrl = new URL("text/search_top", Globals.currentHost);
        }

        this._searchTerms = searcherState.titleRaw;

        // Update query params
        // We could also probably clear them on reload (component will unmount) if anyone wants
        let currentUrlParams = new URLSearchParams(window.location.search);
        currentUrlParams.set("q", this._searchTerms);
        this.props.history.push(
          window.location.pathname + "?" + currentUrlParams.toString()
        );

        let dataToPass = {
          title: this._searchTerms,
        };

        // OPTION: If we restore a way to use search options for faster searches, we'll assign here
        console.log(`file: App.js:574 ~ App ~ this.state.useSearchOptions:`, this.state.useSearchOptions);
        if (this.state.useSearchOptions) {
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
          };
        }

        dataToPass.title = postProcessTerms(dataToPass.title);

        // Proximity search from UI - surround with quotes, append ~#
        if (
          !this.state.searcherInputs.proximityDisabled &&
          this.state.searcherInputs.proximityOption
        ) {
          if (this.state.searcherInputs.proximityOption.value >= 0) {
            try {
              dataToPass.title =
                '"' +
                dataToPass.title +
                '"~' +
                this.state.searcherInputs.proximityOption.value;
            } catch (e) {}
          }
        }

        //Send the AJAX call to the server
        let shouldContinue = true;

        // console.log("Search init");
        axios({
          method: "POST", // or 'PUT'
          url: searchUrl,
          data: dataToPass,
        })
          .then((response) => {
            let responseOK = response && response.status === 200;
            console.log(`${searchUrl} returned ${response.data.length} results`)
            if (responseOK) {
              // console.log("Initial search results returned");
              return response.data;
            } else if (response.status === 204) {
              // Probably invalid query due to misuse of *, "
              this.setState({
                resultsText: "No results: Please check use of term modifiers",
              });
              return null;
            } else if (response.status === 403) {
              // Not authorized
              Globals.emitEvent("refresh", {
                loggedIn: false,
              });
            } else if (response.status === 202) {
              shouldContinue = false; // found all results already
              return response.data;
            } else {
              console.log(response.status);
              return null;
            }
          })
          .then((currentResults) => {
            console.log(`🚀 ~ file: App.js:643 ~ App ~ .then ~ currentResults length:`, currentResults.length);

            let _data = [];
            if (currentResults && currentResults[0] && currentResults[0].doc) {
              // console.log("Raw results",currentResults);

              _data = currentResults
                // .filter((result) => { // Soft rollout logic
                //     return result.doc.size > 200; // filter out if no files (200 bytes or less)
                // })
                .map((result, idx) => {
                  let doc = result.doc;
                  let newObject = {
                    title: doc.title,
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

                    action: doc.action,
                    decision: doc.decision,

                    relevance: idx + 1, // sort puts "falsy" values at the bottom incl. 0
                  };
                  return newObject;
                });

              // Important: This is where we're shifting to process-based results.
              let processResults = {};
              processResults = this.buildData(_data);
              _data = processResults;
              console.log(`🚀 ~ file: App.js:692 ~ App ~ .then ~ _data length:`, _data.length);

              // console.log("Process oriented results flattened",_data);

              // At this point we don't need the hashmap design anymore, it's just very fast for its purpose.
              // Now we have to iterate through all of it anyway, and it makes sense to put it in an array.

              this.setState(
                {
                  searchResults: _data,
                  outputResults: _data,
                  processResults: processResults,
                  results: _data,
                },
                () => {
                  // console.log("All results", _data);

                  // title-only (or blank search===no text search at all): return
                  if (
                    Globals.isEmptyOrSpaces(dataToPass.title) ||
                    (this.state.searcherInputs.searchOption &&
                      this.state.searcherInputs.searchOption === "C")
                  ) {
                    this.filterResultsBy(this.state.searcherInputs);
                    this.countTypes();

                    this.setState({
                      searching: false,
                      snippetsDisabled: true,
                      shouldUpdate: true,
                    });
                  } else if (!shouldContinue) {
                    console.log("First pass got everything");
                    // got all results already, so stop searching and start highlighting.
                    this.filterResultsBy(this.state.searcherInputs);
                    this.countTypes();
                  } else {
                    // Highlight first page using function which then gets the rest of the metadata
                    console.log("Gather first page highlights");
                    this.gatherFirstPageHighlightsThenFinishSearch(
                      this._searchId,
                      this.state.searcherInputs,
                      this.state.searchResults
                    );
                  }
                }
              );
            } else {
              // console.log("No results");
              this.setState({
                searching: false,
                searchResults: [],
                outputResults: [],
                resultsText:
                  "No results found for " +
                  this._searchTerms +
                  " (try adding OR between words for less strict results?)",
              });
            }
          })
          .catch((error) => {
            // Server down or 408 (timeout)
            if (error.response && error.response.status === 408) {
              this.setState({
                networkError: "Request has timed out.",
              });
              this.setState({
                resultsText: "Error: Request timed out",
              });
            } else if (error.response && error.response.status === 403) {
              // token expired?
              this.setState({
                resultsText: "Error: Please login again (session expired)",
              });
              Globals.emitEvent("refresh", {
                loggedIn: false,
              });
            } else if (error.response && error.response.status === 400) {
              // bad request
              this.setState({
                networkError: Globals.errorMessage.default,
                resultsText:
                  "Couldn't parse terms, please try removing any special characters",
              });
            } else {
              // No response? Server is down?
              this.setState({
                networkError: Globals.errorMessage.default,
                resultsText: "Error: Couldn't get results from server",
              });
            }
            this.setState({
              searching: false,
            });
          });
      }
    );
  };

  /** Populates full results without text highlights and then starts the highlighting process */
  initialSearch = () => {
    if (!this._mounted) {
      // User navigated away or reloaded
      return;
    }

    // console.log("initialSearch");

    let searchUrl = new URL("text/search_no_context", Globals.currentHost);

    let dataToPass = {
      title: this.state.searcherInputs.titleRaw,
    };

    // OPTION: If we restore a way to use search options for faster searches, we'll assign here
    if (this.state.useSearchOptions) {
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
      };
    }

    dataToPass.title = postProcessTerms(dataToPass.title);

    // Proximity search from UI - surround with quotes, append ~#
    if (
      !this.state.searcherInputs.proximityDisabled &&
      this.state.searcherInputs.proximityOption
    ) {
      if (this.state.searcherInputs.proximityOption.value >= 0) {
        try {
          dataToPass.title =
            '"' +
            dataToPass.title +
            '"~' +
            this.state.searcherInputs.proximityOption.value;
        } catch (e) {}
      }
    }

    //Send the AJAX call to the server

    // console.log("Search init");

    axios({
      method: "POST", // or 'PUT'
      url: searchUrl,
      data: dataToPass,
    })
      .then((response) => {
        let responseOK = response && response.status === 200;
        console.log(`🚀 ~ file: App.js:854 ~ App ~ .then ~ response length`, response.length);

        if (responseOK) {
          return response.data;
        } else if (response.status === 204) {
          // Probably invalid query due to misuse of *, "
          this.setState({
            resultsText: "No results: Please check use of term modifiers",
          });
          return null;
        } else if (response.status === 403) {
          // Not logged in
          Globals.emitEvent("refresh", {
            loggedIn: false,
          });
        } else {
          console.log(response.status);
          return null;
        }
      })
      .then((currentResults) => {
        let _data = [];
        if (currentResults && currentResults[0] && currentResults[0].doc) {
          _data = currentResults.map((result, idx) => {
            let doc = result.doc;
            let newObject = {
              title: doc.title,
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

              action: doc.action,
              decision: doc.decision,

              relevance: idx + 1, // sort puts "falsy" values at the bottom incl. 0
            };
            return newObject;
          });

          // Important: This is where we're shifting to process-based results.
          let processResults = {};
          processResults = this.buildData(_data);
          _data = processResults;

          this.setState(
            {
              searchResults: _data,
              outputResults: _data,
              resultsText: _data.length + " Results",
            },
            () => {
              this.filterResultsBy(this._searcherState);
              // console.log("Mapped data",_data);

              this.countTypes();
            }
          );
        } else {
          // console.log("No results");
          this.setState({
            searching: false,
            searchResults: [],
            outputResults: [],
            resultsText:
              "No results found for " +
              this._searchTerms +
              " (try adding OR between words for less strict results?)",
          });
        }
      })
      .catch((error) => {
        // Server down or 408 (timeout)
        if (error.response && error.response.status === 408) {
          this.setState({
            networkError: "Request has timed out.",
          });
          this.setState({
            resultsText: "Error: Request timed out",
          });
        } else if (error.response && error.response.status === 403) {
          // token expired?
          this.setState({
            resultsText: "Error: Please login again (session expired)",
          });
          Globals.emitEvent("refresh", {
            loggedIn: false,
          });
        } else if (error.response && error.response.status === 400) {
          // bad request
          this.setState({
            networkError: Globals.errorMessage.default,
            resultsText:
              "Couldn't parse terms, please try removing any special characters",
          });
        } else {
          this.setState({
            networkError: Globals.errorMessage.default,
            resultsText: "Error: Couldn't get results from server",
          });
        }
        this.setState({
          searching: false,
        });
      });
  };

  suggestFromTerms = (_terms) => {
    if (_terms) {
      axios({
        method: "GET",
        url: Globals.currentHost + "text/search/suggest",
        params: {
          terms: _terms,
        },
      }).then((response) => {
        // console.log("Suggester response", response);

        this.setState({
          // lookupResult: response.data
          lookupResult: response.data,
        });
      });
    } else {
      this.setState({
        lookupResult: null,
      });
    }
  };

  /** Gathers all highlights for a single record, if we don't have them already. Invoked by "show more text snippets"
   * button click, inside SearchProcessResult (this button appears for every record with multiple files,
   * after a full text search).
   *
   * SearchProcessResult can give us the entire record and the master card _index,
   * which we can use to skip having to loop through everything.
   */
  gatherSpecificHighlights = (_index, record) => {
    console.log("gatherSpecificHighlights");
    if (!this._mounted) {
      // User navigated away or reloaded
      console.log("Cancel specific highlighting");
      return; // cancel search
    }

    if (!this.state.outputResults) {
      console.log("Nothing here right now to highlight specifically");
      return;
    }

    let _unhighlighted = [];

    // No need for offset or limit. We just need to find the unhighlighted files for one record.

    this.setState(
      {
        snippetsDisabled: false,
        searching: true,
        networkError: "", // Clear network error
      },
      () => {
        let searchUrl = new URL("text/get_highlightsFVH", Globals.currentHost);
        // Need to skip this entry on both sides if it already has full plaintext (has been toggled at least once
        // before and therefore has at least 2 highlights)
        if (!record.plaintext || record.plaintext[0] || record.plaintext[1]) {
          // No need to redo the work on the first file here
          let endLuceneIds = record.luceneIds.slice(1);
          let endFilenamesArray = record.name.split(">").slice(1);
          let endFilenames = endFilenamesArray.join(">");

          // Filenames delimited by > (impossible filename character)
          _unhighlighted.push({
            luceneIds: endLuceneIds,
            filename: endFilenames,
          });
        }

        if (_unhighlighted.length === 0) {
          // nothing to do
          console.log("Specific record already highlighted fully.");
          this.endEarly();
          return;
        }

        // console.log("terms, last", this._searchTerms, this.state.lastSearchedTerm);

        if (!this._searchTerms) {
          this._searchTerms = this.state.lastSearchedTerm;
        }

        let dataToPass = {
          unhighlighted: _unhighlighted,
          terms: this._searchTerms,
          markup: true, // default
          fragmentSizeValue: 2, // default
        };

        //Send the AJAX call to the server
        axios({
          method: "POST", // or 'PUT'
          url: searchUrl,
          data: dataToPass,
        })
          .then((response) => {
            let responseOK = response && response.status === 200;
            if (responseOK) {
              return response.data;
            } else {
              return null;
            }
          })
          .then((parsedJson) => {
            if (parsedJson) {
              // console.log("Adding highlights", parsedJson);
              let allResults = this.state.searchResults;

              // Iterate through records until we find the correct one (sort/filter could change index within card)
              for (let j = 0; j < allResults[_index].records.length; j++) {
                // Only bother checking ID if it has files
                if (
                  !Globals.isEmptyOrSpaces(allResults[_index].records[j].name)
                ) {
                  if (record.id === allResults[_index].records[j].id) {
                    allResults[_index].records[j].plaintext = allResults[
                      _index
                    ].records[j].plaintext.concat(parsedJson[0]);

                    // done
                    j = allResults[_index].records.length;
                  }
                }
              }

              // Fin
              this.setState(
                {
                  searchResults: allResults,
                  // outputResults: currentResults,
                  searching: false,
                  shouldUpdate: true,
                },
                () => {
                  // Run our filter + sort which will intelligently populate outputResults from updated searchResults
                  // and update the table
                  this.filterResultsBy(this._searcherState);
                  // console.log("All done with page highlights: all results, displayed results",
                  //     allResults, currentResults);
                }
              );
            }
          })
          .catch((error) => {
            if (error.name === "TypeError") {
              console.error(error);
            } else {
              // Server down or 408 (timeout)
              let _networkError =
                "Server may be down or you may need to login again.";
              let _resultsText = Globals.errorMessage.default;

              if (error.response && error.response.status === 408) {
                _networkError = "Request has timed out.";
                _resultsText = "Timed out";
              }

              this.setState({
                networkError: _networkError,
                resultsText: _resultsText,
                searching: false,
                shouldUpdate: true,
              });
            }
          });
      }
    );
  };

  gatherFirstPageHighlightsThenFinishSearch = (
    searchId,
    _inputs,
    currentResults
  ) => {
    console.log("gatherFirstPageHighlightsThenFinishSearch");
    if (!_inputs) {
      if (this.state.searcherInputs) {
        _inputs = this.state.searcherInputs;
      } else if (Globals.getParameterByName("q")) {
        _inputs = { titleRaw: Globals.getParameterByName("q") };
      }
    }
    // console.log("Gathering page highlights", searchId, this._page, this._pageSize);
    if (!this._mounted) {
      // User navigated away or reloaded
      return; // cancel search
    }
    if (searchId < this._searchId) {
      // Search interrupted
      return; // cancel search
    }
    if (typeof currentResults === "undefined") {
      currentResults = [];
    }

    this.setState(
      {
        snippetsDisabled: false,
        searching: true,
        networkError: "", // Clear network error
      },
      () => {
        let searchUrl = new URL("text/get_highlightsFVH", Globals.currentHost);

        let mustSkip = {};
        let _unhighlighted = []; // List of records to request a text highlight for
        let startPoint = this._page * this._pageSize - this._pageSize;
        let endPoint = this._page * this._pageSize;

        // Assuming filenames come in the correct order, we can ask for the first one only, and then
        // additional logic elsewhere could ask for all of the highlights.
        // Then we would never get any "hidden" highlights, resulting in more responsive UX

        for (
          let i = startPoint;
          i < Math.min(currentResults.length, endPoint);
          i++
        ) {
          // For each result card on current page
          for (let j = 0; j < currentResults[i].records.length; j++) {
            // For each record in result card
            // Push first lucene ID and filename
            if (!Globals.isEmptyOrSpaces(currentResults[i].records[j].name)) {
              // console.log("Pushing",i,j,currentResults[i].records[j].id);

              // Need to skip this entry on both sides if it already has plaintext.
              // If it has any, then skip here - we can get more on demand elsewhere, in separate logic.
              if (
                !currentResults[i].records[j].plaintext ||
                !currentResults[i].records[j].plaintext[0]
              ) {
                // Filenames delimited by > (impossible filename character)
                let firstFilename =
                  currentResults[i].records[j].name.split(">")[0];
                let firstLuceneId = [currentResults[i].records[j].luceneIds[0]];

                // console.log("First filename, record ID and lucene ID",
                //     firstFilename, currentResults[i].records[j].id, firstLuceneId);

                _unhighlighted.push({
                  luceneIds: firstLuceneId,
                  filename: firstFilename,
                });
              } else {
                // console.log("Adding skip ID " + [currentResults[i].records[j].id]);
                mustSkip[currentResults[i].records[j].id] = true;
              }
            }
          }
        }

        // If nothing to highlight, nothing to do on this page
        if (_unhighlighted.length === 0 || searchId < this._searchId) {
          console.log("nothing to highlight: finish search");
          this.initialSearch(_inputs);
          return;
        }

        let dataToPass = {
          unhighlighted: _unhighlighted,
          terms: postProcessTerms(_inputs.titleRaw),
          markup: _inputs.markup,
          fragmentSizeValue: _inputs.fragmentSizeValue,
        };

        // console.log("For backend",dataToPass);

        //Send the AJAX call to the server
        axios({
          method: "POST", // or 'PUT'
          url: searchUrl,
          data: dataToPass,
        })
          .then((response) => {
            let responseOK = response && response.status === 200;
            if (responseOK) {
              return response.data;
            } else {
              return null;
            }
          })
          .then((parsedJson) => {
            if (parsedJson) {
              // console.log("Adding highlights", parsedJson);

              let allResults = this.state.searchResults;

              let x = 0;
              for (
                let i = startPoint;
                i < Math.min(currentResults.length, endPoint);
                i++
              ) {
                for (let j = 0; j < currentResults[i].records.length; j++) {
                  // If search is interrupted, updatedResults[i] may be undefined (TypeError)
                  if (
                    !Globals.isEmptyOrSpaces(currentResults[i].records[j].name)
                  ) {
                    // console.log("Assigning",i,j,currentResults[i].records[j].name);

                    if (mustSkip[currentResults[i].records[j].id]) {
                      // do nothing; skip
                      // console.log("Skipping ID " + [currentResults[i].records[j].id]);
                    } else {
                      // Instead of currentResults[i].records[j].id, use the stored index
                      //     currentResults[i].originalIndex for record j);
                      currentResults[i].records[j].plaintext = parsedJson[x];
                      allResults[currentResults[i].originalIndex].records[
                        j
                      ].plaintext = parsedJson[x];
                      x++;
                    }
                  }
                }
              }

              this.setState(
                {
                  searchResults: allResults,
                  outputResults: currentResults,
                  shouldUpdate: true,
                },
                () => {
                  console.log("Got highlights, finish search");
                  this.initialSearch(_inputs);
                }
              );
            }
          })
          .catch((error) => {
            if (error.name === "TypeError") {
              console.error(error);
            } else {
              // Server down or 408 (timeout)
              let _networkError =
                "Server is down or you may need to login again.";
              let _resultsText = Globals.errorMessage.default;

              if (error.response && error.response.status === 408) {
                _networkError = "Request has timed out.";
                _resultsText = "Timed out";
              }

              this.setState(
                {
                  networkError: _networkError,
                  resultsText: _resultsText,
                  shouldUpdate: true,
                },
                () => {
                  console.log("Error, finish search");
                  this.initialSearch(_inputs);
                }
              );
            }
          });
      }
    );
  };

  gatherPageHighlights = (searchId, _inputs, currentResults) => {
    console.log(`file: App.js:1345 ~ App ~ searchId, _inputs, currentResults:`, searchId, _inputs, currentResults);
    if (!_inputs) {
      if (this.state.searcherInputs) {
        _inputs = this.state.searcherInputs;
      } else if (Globals.getParameterByName("q")) {
        _inputs = { titleRaw: Globals.getParameterByName("q") };
      }
    }
    // console.log("Gathering page highlights", searchId, this._page, this._pageSize);
    if (!this._mounted) {
      // User navigated away or reloaded
      return; // cancel search
    }
    if (searchId < this._searchId) {
      // Search interrupted
      return; // cancel search
    }
    if (typeof currentResults === "undefined") {
      currentResults = [];
    }

    // No need for offset or limit. We just need to find the unhighlighted files on this page.
    // This requires only page number, number of cards per page and number of cards on page
    // (could be less than max page size)

    let searchUrl = new URL("text/get_highlightsFVH", Globals.currentHost);

    let mustSkip = {};
    let _unhighlighted = [];
    let startPoint = this._page * this._pageSize - this._pageSize;
    let endPoint = this._page * this._pageSize;

    // Assuming filenames come in the correct order, we can ask for the first one only, and then
    // additional logic elsewhere could ask for all of the highlights.
    // Then we would never get any "hidden" highlights, resulting in more responsive UX

    for (
      let i = startPoint;
      i < Math.min(currentResults.length, endPoint);
      i++
    ) {
      for (let j = 0; j < currentResults[i].records.length; j++) {
        // Push first lucene ID and filename
        if (!Globals.isEmptyOrSpaces(currentResults[i].records[j].name)) {
          // console.log("Pushing",i,j,currentResults[i].records[j].id);

          // Need to skip this entry on both sides if it already has plaintext.
          // If it has any, then skip here - we can get more on demand elsewhere, in separate logic.
          if (
            !currentResults[i].records[j].plaintext ||
            !currentResults[i].records[j].plaintext[0]
          ) {
            // Filenames delimited by > (impossible filename character)
            let firstFilename = currentResults[i].records[j].name.split(">")[0];
            let firstLuceneId = [currentResults[i].records[j].luceneIds[0]];

            // console.log("First filename, record ID and lucene ID",
            //     firstFilename, currentResults[i].records[j].id, firstLuceneId);

            _unhighlighted.push({
              luceneIds: firstLuceneId,
              filename: firstFilename,
            });
          } else {
            // console.log("Adding skip ID " + [currentResults[i].records[j].id]);
            mustSkip[currentResults[i].records[j].id] = true;
          }
        }
      }
    }

    // If nothing to highlight, nothing to do on this page
    if (_unhighlighted.length === 0 || searchId < this._searchId) {
      this.endEarly();
      return;
    }

    // Set state a little later to avoid table updating on a page that hasn't actually changed
    this.setState(
      {
        snippetsDisabled: false,
        searching: true,
        networkError: "", // Clear network error
      },
      () => {
        let dataToPass = {
          unhighlighted: _unhighlighted,
          terms: postProcessTerms(_inputs.titleRaw),
          markup: _inputs.markup,
          fragmentSizeValue: _inputs.fragmentSizeValue,
        };

        // console.log("For backend",dataToPass);

        //Send the AJAX call to the server
        axios({
          method: "POST", // or 'PUT'
          url: searchUrl,
          data: dataToPass,
        })
          .then((response) => {
            let responseOK = response && response.status === 200;
            if (responseOK) {
              return response.data;
            } else {
              return null;
            }
          })
          .then((parsedJson) => {
            if (parsedJson) {
              // console.log("Adding highlights", parsedJson);

              // TODO: If we want to avoid checking every ID until we run out of highlights,
              // data structures and a lot more must be changed

              let allResults = this.state.searchResults;

              let x = 0;
              for (
                let i = startPoint;
                i < Math.min(currentResults.length, endPoint);
                i++
              ) {
                for (let j = 0; j < currentResults[i].records.length; j++) {
                  // If search is interrupted, updatedResults[i] may be undefined (TypeError)
                  if (
                    !Globals.isEmptyOrSpaces(currentResults[i].records[j].name)
                  ) {
                    // console.log("Assigning",i,j,currentResults[i].records[j].name);

                    if (mustSkip[currentResults[i].records[j].id]) {
                      // console.log("Skipping ID " + [currentResults[i].records[j].id]);
                    } else {
                      currentResults[i].records[j].plaintext = parsedJson[x];
                      allResults[currentResults[i].originalIndex].records[
                        j
                      ].plaintext = parsedJson[x];
                      x++;
                    }
                  }
                }
              }

              // Verify one last time we want this before we actually commit to these results,
              // otherwise it could be jarring UX to setState here
              if (searchId < this._searchId) {
                // console.log("There's another search call happening");
                return;
              } else {
                // Fin
                // let resultsText = currentResults.length + " Results";
                this.setState(
                  {
                    searchResults: allResults,
                    outputResults: currentResults,
                    // count: updatedResults.length,
                    searching: false,
                    // resultsText: resultsText,
                    shouldUpdate: true,
                  },
                  () => {
                    // console.log("All done with page highlights: all results, displayed results",
                    //     allResults, currentResults);
                  }
                );
              }
            }
          })
          .catch((error) => {
            if (error.name === "TypeError") {
              console.error(error);
            } else {
              // Server down or 408 (timeout)
              let _networkError =
                "Server is down or you may need to login again.";
              let _resultsText = Globals.errorMessage.default;

              if (error.response && error.response.status === 408) {
                _networkError = "Request has timed out.";
                _resultsText = "Timed out";
              }

              this.setState({
                networkError: _networkError,
                resultsText: _resultsText,
                searching: false,
                shouldUpdate: true,
              });
            }
          });
      }
    );
  };

  /** Currently this should always get a 200 back since searches were allowed when not logged in. */
  check = () => {
    // check if JWT is expired/invalid
    this.setState({ loaded: false, down: false });

    let checkURL = new URL("test/check", Globals.currentHost);
    let result = false;
    axios
      .post(checkURL)
      .then((response) => {
        result = response && response.status === 200;
        this.setState({
          verified: result,
        });
      })
      .catch((err) => {
        // This will catch a 403 from the server from a malformed/expired JWT, will also fire if server down
        if (!err.response) {
          // server isn't responding
          this.setState({
            networkError: Globals.errorMessage.default,
            shouldUpdate: true,
            down: true,
          });
        } else if (err.response && err.response.status === 403) {
          this.setState({
            verified: false,
            shouldUpdate: true,
          });
        }
      })
      .finally(() => {
        this.setState({ loaded: true });
        // console.log("Returning... " + result);
      });
    // console.log("App check");
  };

  /** Scroll to bottom on page change and populate full table with latest results */
  scrollToBottom = (_rows) => {
    try {
      this.setState(
        {
          outputResults: this.state.searchResults,
          displayRows: _rows,
          shouldUpdate: true,
        },
        () => {
          setTimeout(() => {
            this.endRef.current.scrollIntoView({ behavior: "smooth" });
          }, 100);
        }
      );
    } catch (e) {
      console.log("Scroll error", e);
    }
  };

  scrollToTop = () => {
    try {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      console.log("Scroll error", e);
    }
  };

  displayedRowsUnpopulated = () => {
    // console.log("Checking displayed rows...");
    for (let i = 0; i < this.state.displayRows.length; i++) {
      // console.log(this.state.displayRows[i].data);
      if (this.state.displayRows[i].data.plaintext.length === 0) {
        console.log("No text.  Should populate.");
        return true;
      }
    }

    return false;
  };

  /** Flattens results to relevant fields for basic users */
  exportToCSV = () => {
    if (this.state.outputResults && this.state.outputResults.length > 0) {
      const resultsForDownload = this.state.outputResults.map(
        (process, idx) => {
          let newResult = process.records.map((result, idx) => {
            let newRecord = {
              title: result.title,
              documentType: result.documentType,
              registerDate: result.registerDate,
              agency: result.agency,
              cooperating_agency: result.cooperatingAgency,
              state: result.state,
              county: result.county,
              // action: result.action,
              // decision: result.decision,
              processId: result.processId,
            };
            if (!newRecord.processId) {
              // don't want to imply zeroes are valid
              newRecord.processId = "";
            }
            return newRecord;
          });
          return newResult;
        }
      );

      // flatten, sort, convert to TSV, download
      this.downloadResults(
        Globals.jsonToCSV(
          resultsForDownload
            .flat() // have to flatten from process structure
            .sort((a, b) => a.title.localeCompare(b.title)) // just sort by title?
        ),
        "csv"
      );
    }
  };

  /** Flattens process-oriented data to download as record metadata */
  downloadCurrentAsTSV = () => {
    if (this.state.outputResults && this.state.outputResults.length > 0) {
      const resultsForDownload = this.state.outputResults.map(
        (process, idx) => {
          let newResult = process.records.map((result, idx) => {
            let newRecord = {
              id: result.id,
              title: result.title,
              documentType: result.documentType,
              registerDate: result.registerDate,
              agency: result.agency,
              cooperating_agency: result.cooperatingAgency,
              state: result.state,
              county: result.county,
              processId: result.processId,
              notes: result.notes,
              status: result.status,
              folder: result.folder,
              action: result.action,
              decision: result.decision,
              size: result.size,
            };
            if (!newRecord.processId) {
              // don't want to imply zeroes are valid
              newRecord.processId = "";
            }
            return newRecord;
          });
          return newResult;
        }
      );

      // flatten, sort, convert to TSV, download
      this.downloadResults(
        Globals.jsonToTSV(
          resultsForDownload
            .flat() // have to flatten from process structure
            .sort(function (a, b) {
              // sort by ID
              return a.id - b.id;
            })
        ),
        "tsv"
      );
    }
  };

  // best performance is to Blob it on demand
  downloadResults = (results, fileExt) => {
    if (results) {
      const csvBlob = new Blob([results]);
      const today = new Date().toISOString();
      const csvFilename = `search_results_${today}.${fileExt}`;

      if (window.navigator.msSaveOrOpenBlob) {
        // IE hack; see http://msdn.microsoft.com/en-us/library/ie/hh779016.aspx
        window.navigator.msSaveBlob(csvBlob, csvFilename);
      } else {
        const temporaryDownloadLink = window.document.createElement("a");
        temporaryDownloadLink.href = window.URL.createObjectURL(csvBlob);
        temporaryDownloadLink.download = csvFilename;
        document.body.appendChild(temporaryDownloadLink);
        temporaryDownloadLink.click(); // IE: "Access is denied"; see: https://connect.microsoft.com/IE/feedback/details/797361/ie-10-treats-blob-url-as-cross-origin-and-denies-access
        document.body.removeChild(temporaryDownloadLink);
      }
    }
  };
  toggleMapHide = () => {
    this.setState({ isMapHidden: !this.state.isMapHidden });
  };
  filterToggle = (boolVal) => {
    this.setState({ filtersHidden: boolVal });
  };

  render() {
    if (this.state.verified) {
      const value = {
        state: this.state,
        setState: this.setState,
      };
      return (
        <>
          <CssBaseline />
          <ThemeProvider theme={theme}>
            <SearchContext.Provider value={value}>
              <div id="app-content" className="footer-content">
                <Helmet>
                  <meta charSet="utf-8" />
                  <title>Search - NEPAccess</title>
                  <meta
                    name="description"
                    content="Search, download, and analyze environmental impact statements and other NEPA documents created under the US National Environmental Policy Act of 1969."
                    data-react-helmet="true"
                  />
                  <link
                    rel="canonical"
                    href="https://www.nepaccess.org/search"
                  />
                </Helmet>
                <Search
                  results={this.state.outputResults}
                  searchResults={this.state.searchResults}
                  outputResults={this.state.outputResults}
                  search={this.startNewSearch}
                  suggest={this.suggestFromTerms}
                  lookupResult={this.state.lookupResult}
                  filterResultsBy={this.filterResultsBy}
                  searching={this.state.searching}
                  useOptions={this.state.useSearchOptions}
                  optionsChanged={this.optionsChanged}
                  count={this.state.searchResults.length}
                  filterToggle={this.filterToggle}
                  networkError={this.state.networkError}
                  parseError={this.state.parseError}
                  finalCount={this._finalCount}
                  draftCount={this._draftCount}
                  eaCount={this._eaCount}
                  noiCount={this._noiCount}
                  rodCount={this._rodCount}
                  scopingCount={this._scopingCount}
                >
                  <SearchProcessResults
                    {...this.props}
                    sort={this.sort}
                    informAppPage={this.setPageInfo}
                    gatherSpecificHighlights={this.gatherSpecificHighlights}
                    results={this.state.outputResults}
                    search={this.startNewSearch}
                    //                        searchResults={this.state.searchResults}
                    geoResults={this.state.geoResults}
                    filtersHidden={this.state.filtersHidden}
                    // searcherState={this._searcherState}
                    geoLoading={this.state.geoLoading}
                    resultsText={this.state.resultsText}
                    searching={this.state.searching}
                    snippetsDisabled={this.state.snippetsDisabled}
                    scrollToBottom={this.scrollToBottom}
                    scrollToTop={this.scrollToTop}
                    shouldUpdate={this.state.shouldUpdate}
                    download={this.downloadCurrentAsTSV}
                    exportToSpreadsheet={this.exportToCSV}
                    isMapHidden={this.state.isMapHidden}
                    toggleMapHide={this.toggleMapHide}
                  />
                </Search>
              </div>
              <div ref={this.endRef} />
              <Footer id="footer"></Footer>
            </SearchContext.Provider>
          </ThemeProvider>
        </>
      );
    } else if (this.state.down) {
      return (
        <div className="content">
          <Helmet>
            <meta charSet="utf-8" />
            <title>Search - NEPAccess</title>
            <meta
              name="description"
              content="Search, download, and analyze environmental impact statements and other NEPA documents created under the US National Environmental Policy Act of 1969."
              data-react-helmet="true"
            />
            <link rel="canonical" href="https://www.nepaccess.org/search" />
          </Helmet>
          <div>
            <label className="logged-out-header">
              Sorry, the server isn't responding. If you're on a VPN, please try
              a different network, or else the server may be down for
              maintenance.
            </label>
          </div>
        </div>
      );
    } else {
      // show nothing until at least we've loaded
      return (
        <div className="content">
          <Helmet>
            <meta charSet="utf-8" />
            <title>Search - NEPAccess</title>
            <meta
              name="description"
              content="Search, download, and analyze environmental impact statements and other NEPA documents created under the US National Environmental Policy Act of 1969."
              data-react-helmet="true"
            />
            <link rel="canonical" href="https://www.nepaccess.org/search" />
          </Helmet>

          <div className="loader-holder">
            <div className="lds-ellipsis">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        </div>
      );
    }
  }

  // After render
  componentDidMount() {
    this.check();
    this._mounted = true;

    // Running this here fixes polygons if user interrupts this process initiated by child component by navigating away
    this.getGeoDebounced();

    // Option: Rehydrate old search results and everything?
    try {
      const rehydrate = JSON.parse(persist.getItem("results"));
      // console.log("Old results", rehydrate);
      this.setState(rehydrate);
    } catch (e) {
      // do nothing
    }
  }

  async componentWillUnmount() {
    // console.log("Unmount app");
    this._mounted = false;

    // Option: Rehydrate only if not interrupting a search?
    // if(!this.state.searching){
    try{
      persist.setItem("results", JSON.stringify(this.state));
      }
      catch(err){
        console.warn('Error while unmounting appState in Search.js: ', err);
      }
    // }
  }
}

function matchesEa(docType) {
  return docType.toLowerCase() === "ea";
}

function matchesRod(docType) {
  return docType.toLowerCase() === "rod";
}

function matchesScoping(docType) {
  return docType.toLowerCase() === "scoping report";
}
function matchesNOI(docType) {
  return docType.toLowerCase() === "noi";
}

/** Return modified terms for user to see */
function preProcessTerms(terms) {
  return terms;
}

/** Return modified terms but not for user to see */
function postProcessTerms(terms) {
  return terms.replaceAll(":", "");
  // .replaceAll(/(^|[\s]+)US($|[\s]+)/g,' ("U. S." | U.S. | US) ') // this was a very bad idea
  // .replaceAll(/(^|[\s]+)U\.S\.($|[\s]+)/g,' ("U. S." | U.S. | US) ');
}
