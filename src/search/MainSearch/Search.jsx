import React, { useCallback, useEffect, useState } from 'react';
import Globals from '../../globals';
//import Grid from '@mui/material/Grid'; // Grid version 1
import { Box, Container, Divider, Paper, useMediaQuery } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { ThemeProvider, styled } from '@mui/material/styles';
import axios from 'axios';
import theme from '../../styles/theme';
import SearchContext from './SearchContext';
import SearchHeader from './SearchHeader';
import SearchResults from './SearchResults';
import SearchSideBarFilters from './SearchSideBarFilters';
const _ = require('lodash');

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  padding: theme.spacing(1),
  color: theme.palette.text.secondary,
  elevation: 1,
  borderRadius: 1,
  mt: 1,
  mb: 1,
  pl: 0,
  pr: 0,
  '&:hover': {
    // //           backgroundColor: //theme.palette.grey[200],
    // boxShadow: '0px 4px 8px rgba(0.5, 0.5, 0.5, 0.25)',
    // backgroundColor: '#eee',
    // cursor: 'pointer',
    // '& .addIcon': {
    //   color: 'darkgrey',
    // },
  },
}));

const FilterItem = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  // ...theme.typography.body2,
  padding: theme.spacing(1),
  // textAlign: 'center',
  color: theme.palette.text.secondary,
  elevation: 1,
  borderRadius: 1,
  mt: 1,
  mb: 1,
  pl: 0,
  pr: 0,
  '&:hover': {
    //           backgroundColor: //theme.palette.grey[200],
    boxShadow: '0px 4px 8px rgba(0.5, 0.5, 0.5, 0.25)',
    backgroundColor: '#eee',
    cursor: 'pointer',
    '& .addIcon': {
      color: 'darkgrey',
    },
  },
}));

const useStyles = (theme) => ({
  formControl: {},
  autocomplete: {},
});

const styles = {
  fontFamily: 'sans-serif',
  textAlign: 'center',
};
const section = {
  height: '100%',
  paddingTop: 5,
  backgroundColor: '#fff',
};
const summary = {
  marginTop: 15,
  marginBottom: 15,
  padding: 10,
  backgroundColor: '#d4d4d4',
};

export default function Search(props) {
  //  console.log("SEARCH PROPS", props)
  const classes = useStyles(theme);
  const isMobile = useMediaQuery('(max-width:768px)');
  //  console.log("🚀 ~ file: Search.jsx:121 ~ Search ~ results:", results)
  const filterBy = props.filterResultsBy;
  const myRef = React.createRef();
  let _mounted = React.createRef(false);
  let _queryParams = [];
  // Necessary for on-demand highlighting per page

  const doSearch = (terms) => {
    console.log('doSearch terms', terms);
    const searchTerm = parseTerms(terms);
    setSearchState({
      ...searchState,
      search: terms,
      searchOptionsChecked: false,
      _lastSearchTerms: terms,
      titleRaw: searchTerm ? searchTerm : searchState.titleRaw,
      _lastSearchedTerm: parseTerms(terms),
      surveyChecked: false,
      surveyDone: false,
      isDirty: true,
    });
    debouncedSearch(searchState);

    //startNewSearch(searchState);
    //debouncedSearch(searchState);
    //    startNewSearch(searchState);
    //    initialSearch(searchState);
  };

  function parseTerms(str) {
    if (!str) return str;

    str = str.replace(/"(.+)"[\s]*~[\s]*([0-9]+)/g, '"$1"~$2'); // "this" ~ 100 -> "this"~100

    // so this regex works correctly, but after replacing, it matches internal single quotes again.
    // Therefore we shouldn't even run this if there are already double quotes.
    // If the user is using double quotes already, we don't need to try to help them out anyway.
    if (!str.includes('"')) {
      str = str.replace(/([\s]|^)'(.+)'([\s]|$)/g, '$1"$2"$3'); // 'this's a mistake' -> "this's a mistake"
    }
    return str;
  }

  const resetTypeCounts = () => {
    _finalCount = '';
    _draftCount = '';

    _eaCount = '';
    _noiCount = '';
    _rodCount = '';
    _scopingCount = '';
  };

  const optionsChanged = (val) => {
    setSearchState({
      ...searchState,
      useSearchOptions: val,
    });
  };

  const setPageInfo = (page, pageSize) => {
    _page = page;
    _pageSize = pageSize;
    console.log('page, pageSize', _page, _pageSize);
    _searchId = _searchId + 1;
    console.log('getatherPageHighlights _searchId', _searchId, searchState, searchState.results);
    gatherPageHighlights(_searchId, searchState, searchState.results);
  };

  const countTypes = () => {
    let finals = 0;
    let drafts = 0;
    let eas = 0;
    let rods = 0;
    let nois = 0;
    let scopings = 0;
    console.log('Count Types Fired with searchState.results', searchState.results);
    searchState.results.forEach((process) => {
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

    _finalCount = '(' + finals + ')';
    _draftCount = '(' + drafts + ')';
    _eaCount = '(' + eas + ')';
    _rodCount = '(' + rods + ')';
    _noiCount = '(' + nois + ')';
    _scopingCount = '(' + scopings + ')';
    setSearchState({
      ...searchState,
      finalCount: '(' + _finalCount + ')',
    });
  };

  /** Get all state/county geodata. Doesn't hit backend if we have the data in state. */
  const getAllGeoData = () => {
    if (!searchState.geoResults || !searchState.geoResults[0]) {
      let url = Globals.currentHost + 'geojson/get_all_state_county';

      axios
        .get(url)
        .then((response) => {
          if (response.data && response.data[0]) {
            for (let i = 0; i < response.data.length; i++) {
              let json = JSON.parse(response.data[i]['geojson']);
              json.style = {};
              json.sortPriority = 0;

              if (json.properties.COUNTYFP) {
                json.originalColor = '#3388ff';
                json.style.color = '#3388ff'; // county: default (blue)
                json.style.fillColor = '#3388ff';
                json.sortPriority = 5;
              } else if (json.properties.STATENS) {
                json.originalColor = '#000';
                json.style.color = '#000'; // state: black
                json.style.fillColor = '#000';
                json.sortPriority = 4;
              } else {
                json.originalColor = '#D54E21';
                json.style.color = '#D54E21';
                json.style.fillColor = '#D54E21';
                json.sortPriority = 6;
              }
              response.data[i] = json;
            }

            let sortedData = response.data.sort(
              (a, b) => parseInt(a.sortPriority) - parseInt(b.sortPriority),
            );

            setSearchState({
              ...searchState,
              geoResults: sortedData,
              geoLoading: false,
            });
          } else {
            setSearchState({
              ...searchState,
              geoLoading: false,
            });
          }
        })
        .catch((err) => {
          console.error('Error retriving GeoJSON ', err);
          setSearchState({
            ...searchState,
            geoLoading: false,
            geoResults: [],
          });
        });
    }
  };

  /** Design: Search component calls this parent method which controls
   * the results, which gives a filtered version of results to results.
   * Sorts by existing sort/asc values before updating state for a more responsive UX.
   * Gets highlights for current page whenever it's called. */
  const filterResultsBy = (searchState) => {
    //const _searchState = searchState; // for live filtering
    // Only filter if there are any results to filter
    if (searchState.results && searchState.results.length > 0) {
      const filtered = Globals.doFilter(
        searchState,
        searchState.results,
        searchState.results.length,
        false,
      );
      const results = filtered.filteredResults.sort(alphabetically(_sortVal, _ascVal));
      console.log('Filter Results By filtered Results', results);
      // Even if there are no filters active we still need to update to reflect this,
      // because if there are no filters the results must be updated to the full unfiltered set
      if (results && results.length) {
        console.log('Filtered Results?', results);
        setSearchState({
          ...searchState,
          results: results,
          resultsText: filtered.textToUse,
          searching: true,
          shouldUpdate: true,
        });
      } else {
        console.log('Filtered Results is empty!', results);
        //don't want to overwrite existing results with an empty array [TODO] figure out why sort is buggy
        setSearchState({
          ...searchState,
          resultsText: filtered.textToUse,
          searching: true,
          shouldUpdate: true,
        });
      }
      //[TODO} can't do callback in setSearchState would need to do useEffect to do so
      //() => {
      // getGeoDebounced(filtered.filteredResults);
      getGeoDebounced();

      _searchId = _searchId + 1;
      console.log('🚀 ~ file: Search.jsx:349 ~ filterResultsBy ~ _searchId:', _searchId);
      gatherPageHighlightsDebounced(_searchId, searchState, filtered.filteredResults);
    }
  };

  /** Sort search results on call from SearchProcessResults.java, assigns _sortVal and _ascVal in case we need them
   * and then activates sortDataByFieldThenHighlight() which then asks for highlighting if needed
   */
  const sort = (val, asc) => {
    _sortVal = val;
    _ascVal = asc;
    sortDataByFieldThenHighlight(val, asc);
  };

  /** Sort, then highlight */
  const sortDataByFieldThenHighlight = (field, ascending) => {
    setSearchState({
      ...searchState,
      searching: true,
      results: searchState.results.sort(alphabetically(field, ascending)),
    }); //, () => {
    gatherPageHighlightsDebounced(_searchId, searchState, searchState.results);
    //});
  };

  /** Do all cleanup needed: Just set searching to false */
  const endEarly = () => {
    console.log('search ended early. Search State:', searchState);
    if (searchState.searching) {
      setSearchState({
        ...searchState,

        searching: false,
      });
    } else {
      console.log('searchState.searching is false already');
      14;
    }
  };

  /** Sorts falsy (undefined, null, NaN, 0, "", and false) field value to the end instead of the top */
  const alphabetically = (field, ascending) => {
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
  };

  /** Assign any existing highlights from the first-page highlight pass, which is now done before full record population */
  const mergeHighlights = (data) => {
    console.log('trying to merge highlights data: ', data);
    if (!searchState.results || !searchState.results[0]) {
      console.log('Nothing here yet');
      return data;
    }

    for (let i = 0; i < searchState.results.length; i++) {
      if (data[i]) {
        console.log('searchState plaintext ? ', data[i]);

        for (let j = 0; j < searchState.results[i].records.length; j++) {
          if (
            data[i].records[j] &&
            searchState.results[i].records[j] &&
            searchState.results[i].records[j].plaintext &&
            searchState.results[i].records[j].plaintext[0]
          ) {
            let same = data[i].records[j].id === searchState.results[i].records[j].id;
            if (same) {
              data[i].records[j].plaintext = searchState.results[i].records[j].plaintext;
            }
          } else {
            //do nothing for now
            console.log("Doesn't exist for data[i]", data[i]);
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
  const buildData = (data) => {
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
        processResults[key] = { records: [], processId: key, isProcess: true, originalIndex: i };
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
        processResults[key].relevance = Math.min(datum.relevance, processResults[key].relevance);
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

    const highlights = mergeHighlights(
      Object.values(processResults).sort(function (a, b) {
        return a.relevance - b.relevance;
      }),
    );
    return highlights;
  };

  // Start a brand new search.
  const startNewSearch = (searchState) => {
    //    console.log("Starting New Search with searchState:", searchState)

    // Reset page, page size
    _page = 1;
    _pageSize = 10;

    // throw out anything we really don't want to support/include
    const terms = preProcessTerms(searchState.titleRaw);
    setSearchState({
      ...searchState,
      titleRaw: terms,
    });

    // Parse terms, set to what Lucene will actually use for full transparency.  Disabled on request
    // const oldTerms = searchState.titleRaw;

    // axios({
    //     method: 'GET',
    //     url: Globals.currentHost + 'text/test_terms',
    //     params: {
    //         terms: searchState.titleRaw
    //     }
    // }).then(response => {

    //     if(response.data !== oldTerms && "\""+response.data+"\"" !== oldTerms) {
    //         searchState.titleRaw = response.data; // escape terms

    //         setSearchState({
    //             parseError: 'Special characters were escaped to avoid parsing error.  Old search terms: ' + oldTerms
    //         })
    //     } else {
    //         setSearchState({
    //             parseError: ''
    //         })
    //     }

    // reset sort
    _sortVal = 'relevance';
    _ascVal = true;

    //_searchState = searchState; // for live filtering

    resetTypeCounts();

    // 0: Get top 100 results
    // 1: Collect contextless results
    //        - Consolidate all of the filenames by metadata record into singular results
    //          (maintaining original order by first appearance)
    startSearch(searchState);
    // 2: Begin collecting text fragments 10-100 at a time or all for current page,
    //          assign accordingly, in a cancelable recursive function
    //          IF TITLE ONLY SEARCH: We can stop here.

    // }).catch(error => {
    //     console.error(error);
    // })
  };
  const debouncedSearch = _.debounce(startNewSearch, 300);
  /** Just get the top results quickly before launching the "full" search with initialSearch() */
  const startSearch = (searchState) => {
    console.log('start search starting with searchState', searchState);
    Globals.emitEvent('new_search');
    // if (!_mounted) { // User navigated away or reloaded
    //   console.log('not mounted returned false', _mounted)
    //     return;
    // }

    setSearchState({
      ...searchState,
      // Fresh search, fresh results
      //        results: [],
      // geoResults: null,
      count: 0,
      searcherInputs: searchState,
      snippetsDisabled: searchState.searchOption === 'C',
      resultsText: 'Loading results...',
      networkError: '', // Clear network error
      searching: true,
      shouldUpdate: true,
      lastSearchedTerm: searchState.titleRaw,
    });

    // title-only
    let searchUrl = new URL('text/search', Globals.currentHost);

    // For the new search logic, the idea is that the limit and offset are only for the text
    // fragments.  The first search should get all of the results, without context.
    // We'll need to consolidate them in the frontend and also ask for text fragments and assign them
    // properly
    if (searchState.searchOption && searchState.searchOption === 'A') {
      searchUrl = new URL('text/search_top', Globals.currentHost);
    } else if (searchState.searchOption && searchState.searchOption === 'B') {
      searchUrl = new URL('text/search_top', Globals.currentHost);
    }

    _searchTerms = searchState.titleRaw;
    console.log('🚀 ~ file: Search.jsx:649 ~ startSearch ~ _searchTerms:', _searchTerms);

    // Update query params
    // We could also probably clear them on reload (component will unmount) if anyone wants
    let currentUrlParams = new URLSearchParams(window.location.search);
    currentUrlParams.set('q', _searchTerms);
    props.history.push(window.location.pathname + '?' + currentUrlParams.toString());

    let dataToPass = {
      title: _searchTerms,
    };

    // OPTION: If we restore a way to use search options for faster searches, we'll assign here
    if (searchState.useSearchOptions) {
      dataToPass = {
        title: searchState.searcherInputs.titleRaw,
        startPublish: searchState.searcherInputs.startPublish,
        endPublish: searchState.searcherInputs.endPublish,
        startComment: searchState.searcherInputs.startComment,
        endComment: searchState.searcherInputs.endComment,
        agency: searchState.searcherInputs.agency,
        state: searchState.searcherInputs.state,
        typeAll: searchState.searcherInputs.typeAll,
        typeFinal: searchState.searcherInputs.typeFinal,
        typeDraft: searchState.searcherInputs.typeDraft,
        typeOther: searchState.searcherInputs.typeOther,
        needsComments: searchState.searcherInputs.needsComments,
        needsDocument: searchState.searcherInputs.needsDocument,
      };
    }

    dataToPass.title = postProcessTerms(dataToPass.title);
    // Proximity search from UI - surround with quotes, append ~#
    if (!searchState.proximityDisabled && searchState.proximityOption) {
      if (searchState.proximityOption.value >= 0) {
        try {
          system.out.println('Proximity search: ' + dataToPass.title);
          dataToPass.title = '"' + dataToPass.title + '"~' + searchState.proximityOption.value;
        } catch (e) {
          System.out.println('Error parsing proximity search ' + e.getMessage());
          e.printStackTrace();
        }
      }
    }

    //Send the AJAX call to the server
    let shouldContinue = true;

    console.log('Search init for url ' + searchUrl);

    axios({
      method: 'POST', // or 'PUT'
      url: searchUrl,
      data: dataToPass,
    })
      .then((response) => {
        console.log(
          'Search got response with01a status of ' + response.status + ' response: ',
          response,
        );
        let responseOK = response && response.status === 200;
        if (responseOK) {
          console.log('Initial search results returned with 202 with data? ', response.data);
          setSearchState({
            results: response.data,
          });
          return response.data;
        } else if (response.status === 204) {
          // Probably invalid query due to misuse of *, "
          setSearchState({
            ...searchState,
            resultsText: 'No results: Please check use of term modifiers',
          });
          return null;
        } else if (response.status === 403) {
          // Not authorized
          console.warn('Search Request was not authorized');
          Globals.emitEvent('refresh', {
            loggedIn: false,
          });
        } else if (response.status === 202) {
          //shouldContinue = false; // found all results already
          console.log('202 with response data', response.data);
          shouldContinue = false;
          // setSearchState({
          //   ...searchState,
          //   //results: response.data,
          //   shouldContinue: true,
          //   results: response.data,
          // });
          return response.data;
        } else {
          console.log(
            `Unhandled response.status ${respons.status} - with response data`,
            response.data,
          );
          return null;
        }
      })
      .then((currentResults) => {
        let _data = [];
        console.log('Raw results _data', _data, 'current Results', currentResults.length);
        if (currentResults && currentResults[0] && currentResults[0].doc) {
          _data = currentResults
            // .filter((result) => { // Soft rollout logic
            //     return result.doc.size > 200; // filter out if no files (200 bytes or less)
            // })
            .map((result, idx) => {
              let doc = result.doc;
              console.log("🚀 ~ file: Search.jsx:702 ~ .map ~ doc:", doc)
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
          processResults = buildData(_data);
          console.log("🚀 ~ file: Search.jsx:739 ~ .then ~ processResults:", processResults)
          _data = processResults;

          // At this point we don't need the hashmap design anymore, it's just very fast for its purpose.
          // Now we have to iterate through all of it anyway, and it makes sense to put it in an array.
          console.log('Setting results from _data', _data);
          setSearchState({
            ...searchState,
            searchResults: _data,
            outputResults: _data,
          });
          //[TODO] no callback with setSearchState would have to useEffect

          console.log('All results', _data);

          // title-only (or blank search===no text search at all): return
          if (
            Globals.isEmptyOrSpaces(dataToPass.title) ||
            (searchState.searcherInputs.searchOption &&
              searchState.searcherInputs.searchOption === 'C')
          ) {
            filterResultsBy(searchState.searcherInputs);
            countTypes();

            setSearchState({
              ...searchState,
              searching: false,
              snippetsDisabled: true,
              shouldUpdate: true,
            });
          } else if (!shouldContinue) {
            console.log('First pass got everything');
            // got all results already, so stop searching and start highlighting.
            console.log(
              `Gather first page highlights 760 - no results, filter by : ${_searchId} with data`,
              _data,
            );
            filterResultsBy(searchState.searcherInputs);
            countTypes();
          } else {
            // Highlight first page using function which then gets the rest of the metadata
            console.log(
              `Gather first page highlights 808 - searchId : ${_searchId} with data`,
              _data,
            );
            gatherFirstPageHighlightsThenFinishSearch(_searchId, searchState.searcherInputs, _data);
          }
        } else {
          console.log('No results for ' + _searchTerms);
          setSearchState({
            ...searchState,
            searching: false,
            //results: [],
            resultsText:
              'No results found for ' +
              _searchTerms +
              ' (try adding OR between words for less strict results?)',
          });
        }
      })
      .catch((error) => {
        // Server down or 408 (timeout)
        console.error('Exception', error);
        console.log('Error searching for ' + _searchTerms + ' error ' + error);
        //        console.error('Error searching for ' + _searchTerms + ' error ' + error.response);
        if (error.response && error.response.status === 408) {
          setSearchState({
            ...searchState,
            networkError: 'Request has timed out.',
          });
          setSearchState({
            ...searchState,
            resultsText: 'Error: Request timed out',
          });
        } else if (error.response && error.response.status === 403) {
          // token expired?
          setSearchState({
            ...searchState,
            resultsText: 'Error: Please login again (session expired)',
          });
          Globals.emitEvent('refresh', {
            loggedIn: false,
          });
        } else if (error.response && error.response.status && error.response.status === 400) {
          // bad request
          console.log('400 response' + error.response);
          setSearchState({
            ...searchState,
            networkError: Globals.errorMessage.default,
            resultsText: "Couldn't parse terms, please try removing any special characters",
          });
        } else if (error && error.response && error.response.status === 202) {
          console.log('Error with 202 status, data? ', response.data);
          setSearchState({
            ...searchState,
            networkError: Globals.errorMessage.default,
            resultsText: "Error: Couldn't get results from server",
          });
          console.log('searchState', searchState);
        } else {
          console.warn('Unhandled Response error:', error);
        }
        setSearchState({
          ...searchState,
          searching: false,
        });
      });
  };

  /** Populates full results without text highlights and then starts the highlighting process */
  const initialSearch = () => {
    // console.log('Is mounted? ' + _mounted);
    // if (!_mounted) { // User navigated away or reloaded
    //     return;
    // }

    console.log('initialSearch');

    let searchUrl = new URL('text/search_no_context', Globals.currentHost);

    let dataToPass = {
      title: searchState.titleRaw,
    };
    console.log(`passing data to url ${searchUrl}`, dataToPass);

    // OPTION: If we restore a way to use search options for faster searches, we'll assign here
    if (searchState.useSearchOptions) {
      dataToPass = {
        title: searchState.searcherInputs.titleRaw,
        startPublish: searchState.searcherInputs.startPublish,
        endPublish: searchState.searcherInputs.endPublish,
        startComment: searchState.searcherInputs.startComment,
        endComment: searchState.searcherInputs.endComment,
        agency: searchState.searcherInputs.agency,
        state: searchState.searcherInputs.state,
        typeAll: searchState.searcherInputs.typeAll,
        typeFinal: searchState.searcherInputs.typeFinal,
        typeDraft: searchState.searcherInputs.typeDraft,
        typeOther: searchState.searcherInputs.typeOther,
        needsComments: searchState.searcherInputs.needsComments,
        needsDocument: searchState.searcherInputs.needsDocument,
      };
    }

    dataToPass.title = postProcessTerms(dataToPass.title);

    // Proximity search from UI - surround with quotes, append ~#
    if (
      !searchState.searcherInputs.proximityDisabled &&
      searchState.searcherInputs.proximityOption
    ) {
      if (searchState.searcherInputs.proximityOption.value >= 0) {
        try {
          dataToPass.title =
            '"' + dataToPass.title + '"~' + searchState.searcherInputs.proximityOption.value;
        } catch (e) {
          console.error('Error doing a proximity search error:', e);
        }
      }
    }

    //Send the AJAX call to the server

    axios({
      method: 'POST', // or 'PUT'
      url: searchUrl,
      data: dataToPass,
    })
      .then((response) => {
        let responseOK = response && response.status === 200;
        if (responseOK) {
          console.log(`Recived response from ${searchUrl} got data:`, response.data);
          setSearchState({
            ...searchState,
            results: response.data,
          });
          return response.data;
        } else if (response.status === 204) {
          // Probably invalid query due to misuse of *, "
          setSearchState({
            ...searchState,
            results: response.data,
            resultsText: 'No results: Please check use of term modifiers',
          });
          return null;
        } else if (response.status === 202) {
          // Probably invalid query due to misuse of *, "
          setSearchState({
            ...searchState,
            results: response.data,
            resultsText: 'No results: Please check use of term modifiers',
          });
          console.log('🚀 ~ file: Search.jsx:923 ~ initialSearch ~ response.data:', response.data);
          return response.data;
        } else if (response.status === 403) {
          // Not logged in
          Globals.emitEvent('refresh', {
            loggedIn: false,
          });
        } else {
          console.log(response.status);
          return null;
        }
      })
      .then((currentResults) => {
        console.log("🚀 ~ file: Search.jsx:941 ~ .then ~ currentResults:", currentResults)
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
          processResults = buildData(_data);
          _data = processResults;
          setSearchState(
            {
              ...searchState,
              results: _data,
              resultsText: _data.length + ' Results',
            },
            () => {
              filterResultsBy(searchState);
              console.log('Mapped data', _data);
              countTypes();
            },
          );
        } else {
          console.log('No results');
          setSearchState({
            ...searchState,
            searching: false,
            resultsText:
              'No results found for ' +
              _searchTerms +
              ' (try adding OR between words for less strict results?)',
          });
        }
      })
      .catch((error) => {
        // Server down or 408 (timeout)
        if (error.response && error.response.status === 408) {
          setSearchState(
            {
              ...searchState,
              resultsText: 'Error: Request timed out',
            },
            () => {
              console.log('set State call back from error', searchState);
            },
          );
        } else if (error.response && error.response.status === 403) {
          // token expired?
          setSearchState({
            ...searchState,
            resultsText: 'Error: Please login again (session expired)',
          });
          Globals.emitEvent('refresh', {
            loggedIn: false,
          });
        } else if (error.response && error.response.status === 400) {
          // bad request
          setSearchState({
            ...searchState,
            networkError: Globals.errorMessage.default,
            resultsText: "Couldn't parse terms, please try removing any special characters",
          });
        } else {
          setSearchState({
            ...searchState,
            networkError: Globals.errorMessage.default,
            resultsText: "Error: Couldn't get results from server",
          });
        }
        setSearchState({
          ...searchState,
          searching: false,
        });
      });
  };

  const suggestFromTerms = (_terms) => {
    if (_terms) {
      axios({
        method: 'GET',
        url: Globals.currentHost + 'text/search/suggest',
        params: {
          terms: _terms,
        },
      }).then((response) => {
        console.log('Suggester response', response);

        setSearchState({
          ...searchState,
          // lookupResult: response.data
          lookupResult: response.data,
        });
      });
    } else {
      setSearchState({
        ...searchState,
        lookupResult: null,
      });
    }
  };

  const onSnippetsToggle = () => {
    setSearchState({
      ...searchState,
      snippetsDisabled: !searchState.snippetsDisabled,
    });
  };
  /** Gathers all highlights for a single record, if we don't have them already. Invoked by "show more text snippets"
   * button click, inside SearchProcessResult (this button appears for every record with multiple files,
   * after a full text search).
   *
   * SearchProcessResult can give us the entire record and the master card _index,
   * which we can use to skip having to loop through everything.
   */
  const gatherSpecificHighlights = (_index, record) => {
    console.log(`gatherSpecificHighlights index: ${_index}`, record);
    if (!_mounted) {
      // User navigated away or reloaded
      console.log('Cancel specific highlighting');
      return; // cancel search
    }

    if (!state.outputResults) {
      console.log('Nothing here right now to highlight specifically');
      return;
    }

    let _unhighlighted = [];

    // No need for offset or limit. We just need to find the unhighlighted files for one record.

    setSearchState(
      {
        ...searchState,
        snippetsDisabled: false,
        searching: true,
        networkError: '', // Clear network error
      });
      
        let searchUrl = new URL('text/get_highlightsFVH', Globals.currentHost);
        // Need to skip this entry on both sides if it already has full plaintext (has been toggled at least once
        // before and therefore has at least 2 highlights)

        if (!record.plaintext || record.plaintext[0] || record.plaintext[1]) {
          // No need to redo the work on the first file here
          let endLuceneIds = record.luceneIds.slice(1);
          let endFilenamesArray = record.name.split('>').slice(1);
          let endFilenames = endFilenamesArray.join('>');

          // Filenames delimited by > (impossible filename character)
          _unhighlighted.push({
            luceneIds: endLuceneIds,
            filename: endFilenames,
          });
        }

        if (_unhighlighted.length === 0) {
          // nothing to do
          console.log('Specific record already highlighted fully.');
          endEarly();
          return;
        }

        // console.log("terms, last", _searchTerms, state.lastSearchedTerm);

        if (!_searchTerms) {
          _searchTerms = searchState.lastSearchedTerm;
        }

        let dataToPass = {
          unhighlighted: _unhighlighted,
          //terms: _searchTerms,
          terms: "Nuclear Weapon Complex",
          markup: true, // default
          fragmentSizeValue: 2, // default
        };

        //Send the AJAX call to the server
        axios({
          method: 'POST', // or 'PUT'
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
              let allResults = setSearchState.searchResults;

              // Iterate through records until we find the correct one (sort/filter could change index within card)
              for (let j = 0; j < allResults[_index].records.length; j++) {
                // Only bother checking ID if it has files
                if (!Globals.isEmptyOrSpaces(allResults[_index].records[j].name)) {
                  if (record.id === allResults[_index].records[j].id) {
                    allResults[_index].records[j].plaintext = allResults[_index].records[
                      j
                    ].plaintext.concat(parsedJson[0]);

                    // done
                    j = allResults[_index].records.length;
                  }
                }
              }

              // Fin
              setSearchState(
                {
                  ...searchState,
                  searchResults: allResults,
                  outputResults: currentResults,
                  output: allResults,
                  searching: false,
                  shouldUpdate: true,
                });
                  // Run our filter + sort which will intelligently populate outputResults from updated searchResults
                  // and update the table
                  filterResultsBy(_searcherState);
                  // console.log("All done with page highlights: all results, displayed results",
                  //     allResults, currentResults);
            }
          })
          .catch((error) => {
            if (error.name === 'TypeError') {
              console.error(error);
            } else {
              // Server down or 408 (timeout)
              let _networkError = 'Server may be down or you may need to login again.';
              let _resultsText = Globals.errorMessage.default;

              if (error.response && error.response.status === 408) {
                _networkError = 'Request has timed out.';
                _resultsText = 'Timed out';
              }

              setSearchState({
                ...searchState,
                networkError: _networkError,
                resultsText: _resultsText,
                searching: false,
                shouldUpdate: true,
              });
            }
          });

  };

  const gatherFirstPageHighlightsThenFinishSearch = (searchId, _inputs, currentResults) => {
    console.log('gatherFirstPageHighlightsThenFinishSearch');
    if (!_inputs) {
      if (searchState.searcherInputs) {
        _inputs = searchState.searcherInputs;
      } else if (Globals.getParameterByName('q')) {
        _inputs = { titleRaw: Globals.getParameterByName('q') };
      }
    }
    console.log('Gathering page highlights', searchId, _page, _pageSize);
    // if (!_mounted) { // User navigated away or reloaded
    //     return; // cancel search
    // }
    if (searchId < _searchId) {
      // Search interrupted
      console.log(`Search Interupted searchId ${searchId} _searchId: ${_searchId}`);
      return; // cancel search
    }
    if (typeof currentResults === 'undefined') {
      currentResults = [];
    }

    setSearchState({
      ...searchState,
      snippetsDisabled: false,
      searching: true,
      networkError: '', // Clear network error
    });

    let searchUrl = new URL('text/get_highlightsFVH', Globals.currentHost);

    let mustSkip = {};
    let _unhighlighted = []; // List of records to request a text highlight for
    let startPoint = _page * _pageSize - _pageSize;
    let endPoint = _page * _pageSize;

    // Assuming filenames come in the correct order, we can ask for the first one only, and then
    // additional logic elsewhere could ask for all of the highlights.
    // Then we would never get any "hidden" highlights, resulting in more responsive UX

    for (let i = startPoint; i < Math.min(currentResults.length, endPoint); i++) {
      // For each result card on current page
      for (let j = 0; j < currentResults[i].records.length; j++) {
        // For each record in result card
        // Push first lucene ID and filename
        if (!Globals.isEmptyOrSpaces(currentResults[i].records[j].name)) {
          console.log('Pushing', i, j, currentResults[i].records[j].id);

          // Need to skip this entry on both sides if it already has plaintext.
          // If it has any, then skip here - we can get more on demand elsewhere, in separate logic.
          if (
            !currentResults[i].records[j].plaintext ||
            !currentResults[i].records[j].plaintext[0]
          ) {
            // Filenames delimited by > (impossible filename character)
            let firstFilename = currentResults[i].records[j].name.split('>')[0];
            let firstLuceneId = [currentResults[i].records[j].luceneIds[0]];

            console.log('First filename, record ID and lucene ID'),
              //     firstFilename, currentResults[i].records[j].id, firstLuceneId);

              _unhighlighted.push({
                luceneIds: firstLuceneId,
                filename: firstFilename,
              });
          } else {
            console.log('Adding skip ID ' + [currentResults[i].records[j].id]);
            mustSkip[currentResults[i].records[j].id] = true;
          }
        }
      }
    }

    // If nothing to highlight, nothing to do on this page
    if (_unhighlighted.length === 0 || searchId < _searchId) {
      console.log('nothing to highlight: finish search');
      initialSearch(_inputs);
      return;
    }

    const terms = postProcessTerms(_inputs.titleRaw);
    console.log("🚀 ~ file: Search.jsx:1308 ~ gatherFirstPageHighlightsThenFinishSearch ~ terms:", terms)
    let dataToPass = {
      unhighlighted: _unhighlighted,
      terms: "Nuclear Weapon Complex",
      markup: _inputs.markup,
      fragmentSizeValue: _inputs.fragmentSizeValue,
    };

    console.log('For backend', dataToPass);

    //Send the AJAX call to the server
    axios({
      method: 'POST', // or 'PUT'
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
        console.log('get_highlightsFVH response', response);
        if (parsedJson) {
          console.log('Adding highlights', parsedJson);

          let allResults = searchState.results;

          let x = 0;
          for (let i = startPoint; i < Math.min(currentResults.length, endPoint); i++) {
            for (let j = 0; j < currentResults[i].records.length; j++) {
              // If search is interrupted, updatedResults[i] may be undefined (TypeError)
              if (!Globals.isEmptyOrSpaces(currentResults[i].records[j].name)) {
                console.log('Assigning', i, j, currentResults[i].records[j].name);

                if (mustSkip[currentResults[i].records[j].id]) {
                  // do nothing; skip
                  console.log('Skipping ID ' + [currentResults[i].records[j].id]);
                } else {
                  // Instead of currentResults[i].records[j].id, use the stored index
                  //     currentResults[i].originalIndex for record j);
                  currentResults[i].records[j].plaintext = parsedJson[x];
                  allResults[currentResults[i].originalIndex].records[j].plaintext = parsedJson[x];
                  x++;
                }
              }
            }
          }
          console.log('Setting currentResults line 1312', currentResults);
          console.log('Setting allResults line 1312', allResults);
          setSearchState({
            ...searchState,
            searchResults: allResults,
            outputResults: currentResults,
            output: allResults,
            shouldUpdate: true,
          });
          console.log('Got highlights, finish search');
          initialSearch(_inputs);
        }
      })
      .catch((error) => {
        console.log("🚀 ~ file: Search.jsx:1372 ~ gatherFirstPageHighlightsThenFinishSearch ~ error:", error)
        if (error.name === 'TypeError') {
          console.error(error);
        } else {
          // Server down or 408 (timeout)
          let _networkError = 'Server is down or you may need to login again.';
          let _resultsText = Globals.errorMessage.default;

          if (error.response && error.response.status === 408) {
            _networkError = 'Request has timed out.';
            _resultsText = 'Timed out';
          }

          setSearchState(
            {
              ...searchState,
              networkError: _networkError,
              resultsText: _resultsText,
              shouldUpdate: true,
            },
            () => {
              console.log('Error, finish search, doing initalSearch with _inputs', _inputs);
              initialSearch(_inputs);
            },
          );
        }
      });
  };

  const gatherPageHighlights = (searchId, _inputs, currentResults) => {
        console.log('Gathering page highlights', searchId, _page, _pageSize);
    if (!_inputs) {
      if (searchState.searcherInputs) {
        _inputs = searchState.searcherInputs;
      } else if (Globals.getParameterByName('q')) {
        _inputs = { titleRaw: Globals.getParameterByName('q') };
      }
    }

    // if (!_mounted) { // User navigated away or reloaded
    //     return; // cancel search
    // }
    if (searchId < _searchId) {
      // Search interrupted
      console.log(`Search Interupted searchId ${searchId} _searchId: ${_searchId}`);
      return; // cancel search
    }
    if (typeof currentResults === 'undefined') {
      currentResults = [];
    }
    console.log('currentResults', currentResults);
    // No need for offset or limit. We just need to find the unhighlighted files on this page.
    // This requires only page number, number of cards per page and number of cards on page
    // (could be less than max page size)

    let searchUrl = new URL('text/get_highlightsFVH', Globals.currentHost);

    let mustSkip = {};
    let _unhighlighted = [];
    let startPoint = _page * _pageSize - _pageSize;
    let endPoint = _page * _pageSize;

    // Assuming filenames come in the correct order, we can ask for the first one only, and then
    // additional logic elsewhere could ask for all of the highlights.
    // Then we would never get any "hidden" highlights, resulting in more responsive UX
    console.log('get_highlightsFVH currentResults', currentResults);
    if (currentResults && currentResults.length > 0) {
      for (let i = startPoint; i < Math.min(currentResults.length, endPoint); i++) {
        for (let j = 0; j < currentResults[i].records.length; j++) {
          // Push first lucene ID and filename
          if (!Globals.isEmptyOrSpaces(currentResults[i].records[j].name)) {
            console.log('Pushing', i, j, currentResults[i].records[j].id);

            // Need to skip this entry on both sides if it already has plaintext.
            // If it has any, then skip here - we can get more on demand elsewhere, in separate logic.
            if (
              !currentResults[i] ||
              !currentResults.records ||
              !currentResults[i].records[j].plaintext ||
              !currentResults[i].records[j].plaintext[0]
            ) {
              // Filenames delimited by > (impossible filename character)
              let firstFilename = currentResults[i].records[j].name.split('>')[0];
              let firstLuceneId = [currentResults[i].records[j].luceneIds[0]];

              console.log(
                'First filename, record ID and lucene ID',
                firstFilename,
                currentResults[i].records[j].id,
                firstLuceneId,
              );

              _unhighlighted.push({
                luceneIds: firstLuceneId,
                filename: firstFilename,
              });
            } else {
              console.log('Adding skip ID ' + [currentResults[i].records[j].id]);
              mustSkip[currentResults[i].records[j].id] = true;
            }
          }
        }
      }
    } else {
      console.log('No currentResults', currentResults);
    }

    // If nothing to highlight, nothing to do on this page
    if ((!_unhighlighted && _unhighlighted.length === 0) || searchId < _searchId) {
      console.warn(
        `nothing to highlight:ending early for search searchId ${searchId} _searchId: ${_searchId}`,
      );
      endEarly();
      return;
    }

    // Set state a little later to avoid table updating on a page that hasn't actually changed
    setSearchState({
      ...searchState,
      snippetsDisabled: false,
      searching: true,
      networkError: '', // Clear network error
    });

    let dataToPass = {
      unhighlighted: _unhighlighted,
      terms: postProcessTerms(_inputs.titleRaw),
      markup: _inputs.markup,
      fragmentSizeValue: _inputs.fragmentSizeValue,
    };

    console.log('For backend', dataToPass);

    //Send the AJAX call to the server
    axios({
      method: 'POST', // or 'PUT'
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
          console.log('Adding highlights', parsedJson);

          // TODO: If we want to avoid checking every ID until we run out of highlights,
          // data structures and a lot more must be changed

          let allResults = searchState.results;

          let x = 0;
          for (let i = startPoint; i < Math.min(currentResults.length, endPoint); i++) {
            for (let j = 0; j < currentResults[i].records.length; j++) {
              // If search is interrupted, updatedResults[i] may be undefined (TypeError)
              if (!Globals.isEmptyOrSpaces(currentResults[i].records[j].name)) {
                console.log('Assigning', i, j, currentResults[i].records[j].name);

                if (mustSkip[currentResults[i].records[j].id]) {
                  console.log('Skipping ID ' + [currentResults[i].records[j].id]);
                } else {
                  currentResults[i].records[j].plaintext = parsedJson[x];
                  allResults[currentResults[i].originalIndex].records[j].plaintext = parsedJson[x];
                  x++;
                }
              }
            }
          }

          // Verify one last time we want this before we actually commit to these results,
          // otherwise it could be jarring UX to setSearchState here
          if (searchId < _searchId) {
            console.log("There's another search call happening");
            return;
          } else {
            // Fin
            let resultsText = currentResults.length + ' Results';
            setSearchState({
              ...searchState,
              searchResults: allResults,
              outputResults: currentResults,
              output: allResults,
              // count: updatedResults.length,
              searching: false,
              resultsText: resultsText,
              shouldUpdate: true,
            });
          }
        }
      })
      .catch((error) => {
        if (error.name === 'TypeError') {
          console.error(error);
        } else {
          // Server down or 408 (timeout)
          let _networkError = 'Server is down or you may need to login again.';
          let _resultsText = Globals.errorMessage.default;

          if (error.response && error.response.status === 408) {
            _networkError = 'Request has timed out.';
            _resultsText = 'Timed out';
          }

          setSearchState({
            ...searchState,
            networkError: _networkError,
            resultsText: _resultsText,
            searching: false,
            shouldUpdate: true,
          });
        }
      })
      .finally(() => {
        console.log('get_highlightsFVH finally. State: ', searchState);
      });
  };

  /** Currently this should always get a 200 back since searches were allowed when not logged in. */
  const check = () => {
    // check if JWT is expired/invalid
    setSearchState({
      ...searchState,
      loaded: false,
      down: false,
    });

    let checkURL = new URL('test/check', Globals.currentHost);
    let result = false;
    axios
      .post(checkURL)
      .then((response) => {
        console.log('Recived response from check call', response);
        result = response && response.status === 200;
        setSearchState({
          ...searchState,
          verified: result,
        });
      })
      .catch((err) => {
        // This will catch a 403 from the server from a malformed/expired JWT, will also fire if server down
        console.error(`Error calling the check endpoint`, err);
        if (!err.response) {
          // server isn't responding
          setSearchState({
            ...searchState,
            networkError: Globals.errorMessage.default,
            shouldUpdate: true,
            down: true,
          });
        } else if (err.response && err.response.status === 403) {
          console.log('CHECK ERROR ERR', err);
          setSearchState({
            ...searchState,
            verified: false,
            shouldUpdate: true,
          });
        }
      })
      .finally(() => {
        setSearchState({
          ...searchState,
          loaded: true,
        });
        console.log('Finally SearchState loaded... ' + searchState);
      });
  };

  /** Scroll to bottom on page change and populate full table with latest results */
  const scrollToBottom = (_rows) => {
    try {
      setSearchState(
        {
          ...searchState,
          results: searchState.results,
          displayRows: _rows,
          shouldUpdate: true,
        },
        () => {
          setTimeout(() => {
            endRef.current.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        },
      );
    } catch (e) {
      console.log('Scroll error', e);
    }
  };

  const scrollToTop = () => {
    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      console.log('Scroll error', e);
    }
  };

  const displayedRowsUnpopulated = () => {
    console.log('Checking displayed rows...');
    for (let i = 0; i < searchState.displayRows.length; i++) {
      console.log(searchState.displayRows[i].data);
      if (searchState.displayRows[i].data.plaintext.length === 0) {
        console.log('No text.  Should populate.');
        return true;
      }
    }

    return false;
  };

  /** Flattens results to relevant fields for basic users */
  const exportToCSV = () => {
    if (searchState.results && searchState.results.length > 0) {
      const resultsForDownload = searchState.results.map((process, idx) => {
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
            newRecord.processId = '';
          }
          return newRecord;
        });
        return newResult;
      });

      // flatten, sort, convert to TSV, download
      downloadResults(
        Globals.jsonToCSV(
          resultsForDownload
            .flat() // have to flatten from process structure
            .sort((a, b) => a.title.localeCompare(b.title)), // just sort by title?
        ),
        'csv',
      );
    }
  };

  /** Flattens process-oriented data to download as record metadata */
  const constdownloadCurrentAsTSV = () => {
    if (searchState.results && searchState.results.length > 0) {
      const resultsForDownload = searchState.results.map((process, idx) => {
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
            newRecord.processId = '';
          }
          return newRecord;
        });
        return newResult;
      });

      // flatten, sort, convert to TSV, download
      downloadResults(
        Globals.jsonToTSV(
          resultsForDownload
            .flat() // have to flatten from process structure
            .sort(function (a, b) {
              // sort by ID
              return a.id - b.id;
            }),
        ),
        'tsv',
      );
    }
  };

  // best performance is to Blob it on demand
  const downloadResults = (results, fileExt) => {
    if (results) {
      const csvBlob = new Blob([results]);
      const today = new Date().toISOString();
      const csvFilename = `search_results_${today}.${fileExt}`;

      if (window.navigator.msSaveOrOpenBlob) {
        // IE hack; see http://msdn.microsoft.com/en-us/library/ie/hh779016.aspx
        window.navigator.msSaveBlob(csvBlob, csvFilename);
      } else {
        const temporaryDownloadLink = window.document.createElement('a');
        temporaryDownloadLink.href = window.URL.createObjectURL(csvBlob);
        temporaryDownloadLink.download = csvFilename;
        document.body.appendChild(temporaryDownloadLink);
        temporaryDownloadLink.click(); // IE: "Access is denied"; see: https://connect.microsoft.com/IE/feedback/details/797361/ie-10-treats-blob-url-as-cross-origin-and-denies-access
        document.body.removeChild(temporaryDownloadLink);
      }
    }
  };
  const toggleMapHide = () => {
    setSearchState({
      ...searchState,
      isMapHidden: !searchState.isMapHidden,
    });
  };
  const filterToggle = (boolVal) => {
    setSearchState({
      ...searchState,
      filtersHidden: boolVal,
    });
  };
  const handleProximityValues = (string) => {
    let valuesResult = { _inputMessage: '', disableValue: true };

    // Disable prox dropdown if conflicting characters in terms
    if (string.match(/["?*~]+/)) {
      // _inputMessage = "Wildcard, phrase or proximity search character found in terms: "
      //     + userInput.match(/["\?\*~]+/)[0][0]
      //     + ".  Disabled proximity search dropdown to prevent unpredictable results."
      valuesResult._inputMessage =
        'Proximity dropdown is disabled when certain special characters are used: ~ ? " *';
      valuesResult.disableValue = true;
    }
    // Disable ui proximity search unless search is at least two strings separated by whitespace
    else if (string.trim().match(/\s+/)) {
      valuesResult._inputMessage = '';
      valuesResult.disableValue = false;
    }

    return valuesResult;
  };

  const onIconClick = (evt) => {
    console.log('onIconClick clicked', evt.target.name);
    setSearchState({
      ...searchState,
      titleRaw: evt.target.name,
    });
    doSearch(searchState.titleRaw);
  };
  /** clears and disables proximity search option as well as clearing text */
  const onClearClick = (evt) => {
    setSearchState({
      ...searchState,
      titleRaw: '',
      proximityDisabledSet: true,
      proximityOption: null,
      inputMessage: '',
    });
    inputSearch.focus();
    // debouncedSuggest();
  };

  const onClearFiltersClick = () => {
    setSearchState({
      ...searchState,
      titleRaw: '',
      startPublish: null,
      endPublish: null,
      startComment: null,
      endComment: null,
      agency: [],
      agencyRaw: [],
      cooperatingAgency: [],
      cooperatingAgencyRaw: [],
      state: [],
      stateRaw: [],
      county: [],
      countyRaw: [],
      decision: [],
      decisionRaw: [],
      action: [],
      actionRaw: [],
      typeAll: true,
      numPages: null,
      pageNumber: 1,
      typeFinal: false,
      typeDraft: false,
      typeEA: false,
      typeNOI: false,
      typeROD: false,
      typeScoping: false,
      typeOther: false,
      needsComments: false,
      needsDocument: false,
      optionsChecked: true,
      countyOptions: Globals.counties,
    });
  };

  const onRadioChange = (evt) => {
    setSearchState({ ...searchState, [evt.target.name]: evt.target.value });
  };

  const onKeyUp = (evt) => {
    if (evt.keyCode === 13) {
      //evt.preventDefault();
      doSearch(searchState.titleRaw);
    }
  };
  /** For some reason, without this, calendars stay open after tabbing past them.
   *  (This is opposite to how react-datepicker's default behavior is described.) */
  const onKeyDown = (e) => {
    if (e.key === 'Tab') {
      if (datePickerStart) {
        datePickerStart.setOpen(false);
      }
      if (datePickerEnd) {
        datePickerEnd.setOpen(false);
      }
    }
  };

  const onInput = (evt) => {
    let userInput = evt.target.value;
    console.log('on input evt.target.name' + evt.target.name);
    console.log('onInput userInput', userInput);
    // if(!userInput || userInput.length <= 3){
    //     console.log(`${userInput} is not long enught`)
    // }
    let proximityValues = handleProximityValues(userInput);

    //get the evt.target.name (defined by name= in input)
    //and use it to target the key on our `state` object with the same name, using bracket syntax
    setSearchState({
      ...searchState,
      [evt.target.name]: userInput,
      proximityDisabled: proximityValues.disableValue,
      inputMessage: proximityValues._inputMessage,
    });
  };

  // suppress warning that there's no onChange event, handler (despite onChange rarely being the best event to take advantage of)
  const onChangeHandler = (evt) => {
    console.log('onChangeHandler', evt.target.value);
    // do nothing
  };
  const toggleSearchTipDialogClose = (isOpen) => {
    isOpen == true
      ? setSearchState({
          ...searchState, // keep all other key-value pairs
          isSearchTipsDialogIsOpen: false, // update the value of specific key
        })
      : setSearchState({
          ...prevState, // keep all other key-value pairs
          isSearchTipsDialogIsOpen: true, // update the value of specific key
        });
  };
  const onDialogOpen = () => {
    console.log('onDialogOpen');
    setDialogOpen(true);
  };
  const geoFilter = (geodata) => {
    // console.log(geodata.name, geodata.abbrev);
    if (geodata.geoType === Globals.geoType.STATE) {
      // Assuming Search and resultsMap talk to each other, we'll want two-way interaction.
      // So if it's sending us a state, we may want to enable or disable it.
      const indexIfExists = state.indexOf(geodata.abbrev);
      let _stateRaw = stateRaw;
      try {
        if (indexIfExists === -1) {
          // Enable
          _stateRaw.push({ value: geodata.abbrev, label: geodata.name });
        } else {
          // Disable
          _stateRaw.splice(indexIfExists, 1);
        }
      } catch (e) {
        console.error(e);
      } finally {
        onLocationChange(_stateRaw);
      }
    } else if (geodata.geoType === Globals.geoType.COUNTY) {
      const indexIfExists = county.indexOf(geodata.abbrev);
      let _countyRaw = countyRaw;
      try {
        if (indexIfExists === -1) {
          // Enable
          _countyRaw.push({ value: geodata.abbrev, label: geodata.abbrev });
        } else {
          // Disable
          _countyRaw.splice(indexIfExists, 1);
        }
      } catch (e) {
        console.error(e);
      } finally {
        onCountyChange(_countyRaw);
      }
    } else {
      // do nothing: filter has no supported functionality for "other" polygons
    }
  };

  const onFragmentSizeChange = (evt) => {
    console.log('Val', evt.value);
    setSearchState({ ...searchState, fragmentSizeValue: evt.value, fragmentSize: evt });
  };

  const onActionChange = (evt) => {
    var actionLabels = [];
    for (var i = 0; i < evt.length; i++) {
      actionLabels.push(evt[i].label.replace(/ \([A-Z]*\)/gi, ''));
    }
    setSearchState({
      ...searchState,
      action: actionLabels,
      actionRaw: evt,
    });
  };
  const onDecisionChange = (evt) => {
    var decisionLabels = [];
    for (var i = 0; i < evt.length; i++) {
      decisionLabels.push(evt[i].label.replace(/ \([A-Z]*\)/gi, ''));
    }
    setSearchState({
      ...searchState,
      decision: decisionLabels,
      decisionRaw: evt,
    });
  };
  /** Helper method for onLocationChange limits county options to selected states in filter,
   * or resets to all counties if no states selected */
  const narrowCountyOptions = (stateValues) => {
    /** Filter logic for county array of specific label/value format given array of state abbreviations  */
    function countyFilter(_stateValues) {
      return function (a) {
        let returnValue = false;
        _stateValues.forEach((item) => {
          if (a.label.split(':')[0] === item) {
            // a.label.split(':')[0] gets 'AZ' from expected 'AZ: Arizona'
            returnValue = true;
          }
        });
        return returnValue;
      };
    }

    let filteredCounties = Globals.counties;
    if (stateValues && stateValues.length > 0) {
      filteredCounties = filteredCounties.filter(countyFilter(stateValues));
    }

    return filteredCounties;
  };

  const getSearchBarText = () => {
    if (searchOption && searchOption === 'C') {
      // title only
      return 'Search titles of NEPA documents';
    } else {
      return 'Search full texts and titles of NEPA documents';
    }
  };

  const onUseOptionsChecked = (evt) => {
    props.optionsChanged(evt.target.checked);
  };

  const onNeedsDocumentChecked = (evt) => {
    setSearchState({
      ...searchState,
      needsDocument: !needsDocument,
    });
  };
  const onProximityChange = (evt) => {
    console.log('OnProximityChange', evt.target.value);
    if (evt.target.value === -1) {
      setSearchState({
        ...searchState,
        proximityOption: null,
      });
    } else {
      console.log(
        'OnProximityChange searchState proximityOption before update',
        searchState.proximityOption,
      );
      setSearchState({
        ...searchState,
        proximityOption: evt,
      });
    }
  };
  const onLocationChange = (evt, item) => {
    console.log('🚀 ~ file: SideBarFilters.jsx:86 ~ onLocationChange ~ evt:', evt);
    var stateValues = [];
    for (var i = 0; i < evt.length; i++) {
      stateValues.push(evt[i].value);
    }
    console.log('State Values Length', stateValues.length);
    setSearchState({
      ...searchState,
      state: stateValues,
      stateRaw: evt,
      countyOptions: narrowCountyOptions(stateValues),
    });
  };

  const onCountyChange = (evt, item) => {
    debugger;
    console.log('onCountyChange - Value:', evt);
    var countyValues = [];
    for (var i = 0; i < evt.length; i++) {
      countyValues.push(evt[i].value);
    }
    console.log('🚀 ~ file: Search.jsx:528 ~ onCountyChange ~ countyValues:', countyValues);
    setSearchState({ ...searchState, county: countyValues, countyRaw: evt });
  };
  const onAgencyChange = (evt) => {
    console.log(`onAgencyChange evt.length: ${evt.length} evt.target.value`, evt.target.value);
    var agencyLabels = [];
    for (var i = 0; i < evt.length; i++) {
      agencyLabels.push(evt[i].label.replace(/ \([A-Z]*\)/gi, ''));
    }
    console.log('agency labels', agencyLabels);
    setSearchState({
      ...searchState,
      agency: agencyLabels,
      agencyRaw: evt,
    });
  };

  const onCooperatingAgencyChange = (evt) => {
    console.log('onCooperatingAgencyChange', evt.target.value);
    var agencyLabels = [];
    for (var i = 0; i < evt.length; i++) {
      agencyLabels.push(evt[i].label.replace(/ \([A-Z]*\)/gi, ''));
    }
    setSearchState({
      ...searchState,
      cooperatingAgency: agencyLabels,
      cooperatingAgencyRaw: evt.target.value,
    });
  };
  const onTitleOnlyChecked = (evt) => {
    console.log('onTitleOnlyChecked', evt.target.checked);
    if (evt.target.checked) {
      setSearchState({
        ...searchState,
        searchOption: 'C', // Title only
      });
    } else {
      setSearchState({
        ...searchState,
        searchOption: 'B', // Both fields, Lucene default scoring
      });
    }
  };

  const onMarkupChange = (evt) => {
    console.log('onMarkupChange', evt.target.checked);
    let checked = evt.target.checked;
    setSearchState({
      ...searchState,
      markup: checked,
    });
  };
  const onTypeChecked = (evt) => {
    console.log('🚀 ~ file: Search.jsx:520 ~ onTypeChecked ~ evt:', evt);
    if (evt.target.name === 'optionsChecked') {
      setSearchState({ ...searchState, [evt.target.name]: evt.target.checked });
    } else if (evt.target.name === 'typeAll' && evt.target.checked) {
      // All: Check all, uncheck others
      setSearchState({
        ...searchState,
        typeAll: true,
        typeFinal: false,
        typeDraft: false,
        typeOther: false,
      });
    } else {
      // Not all: Check target, uncheck all
      setSearchState({
        ...searchState,
        [evt.target.name]: evt.target.checked,
        typeAll: false,
      });
    }
  };

  // onChecked = (evt) => {
  //     setSearchState(...searchState, { [evt.target.name]: evt.target.checked}, () => { debouncedSearch(state); });
  // }

  const onStartCommentChange = (date) => {
    setSearchState({ ...searchState, startComment: date });
  };
  const onEndCommentChange = (date) => {
    setSearchState({ ...searchState, endComment: date });
  };
  const tooltipTrigger = (evt) => {
    setSearchState({ ...searchState, tooltipOpen: !tooltipOpen });
  };
  const closeTooltip = () => {
    setSearchState({
      ...searchState,
      tooltipOpen: false,
    });
  };

  const get = (url, stateName) => {
    const _url = new URL(url, Globals.currentHost);
    //console.log('Calling URL',_url);
    axios({
      url: _url,
      method: 'GET',
      data: {},
    })
      .then((_response) => {
        const rsp = _response.data;
        return rsp;
        //        setSearchState({ ...searchState, [stateName]: rsp });
      })
      .catch((error) => {
        console.log('Error getting Results from the Server at ' + url, error);
      });
  };

  /** Helps getSuggestions() by returning clickable link to details page for given suggestion, which opens a new tab */
  const getSuggestion = (suggestion, idx) => {
    let _href = 'record-details?id=';
    if (suggestion.isProcess) {
      _href = 'process-details?id=';
    }

    if (suggestion.id && suggestion.title) {
      return (
        <div>
          <a
            href={_href + suggestion.id}
            target="_blank"
            rel="noreferrer"
            key={idx}
            dangerouslySetInnerHTML={{
              __html: suggestion.title,
            }}
          />
        </div>
      );
    }
  };
  /** If we can complete the current search terms into a title, show links to up to three suggested details pages.
   * AnalyzingInfixSuggester.lookup logic seems to see if the rightmost term can be expanded to match titles.
   *
   * So the terms 'rose mine' won't find anything, because a word MUST be 'rose' - but 'mine rose' will find rosemont
   * copper mine, because it's basically looking for mine AND rose*, whereas rose AND mine* doesn't match any titles.
   */
  const getSuggestions = () => {
    if (props.lookupResult && props.lookupResult[0]) {
      return (
        <div className="suggestion-holder">
          <span className="block">Sample titles:</span>
          {props.lookupResult.map((result, i) => {
            return getSuggestion(result, i);
          })}
        </div>
      );
    }
  };

  const filtersActive = () => {
    if (
      searchState.startPublish ||
      searchState.endPublish ||
      searchState.startComment ||
      searchState.endComment ||
      searchState.agency.length > 0 ||
      searchState.cooperatingAgency.length > 0 ||
      searchState.state.length > 0 ||
      searchState.county.length > 0 ||
      searchState.decision.length > 0 ||
      searchState.action.length > 0 ||
      searchState.typeFinal ||
      searchState.typeDraft ||
      searchState.typeEA ||
      searchState.typeNOI ||
      searchState.typeROD ||
      searchState.typeScoping ||
      searchState.typeOther ||
      searchState.needsComments ||
      searchState.needsDocument
    ) {
      return true;
    }
  };

  const toggleFiltersHidden = () => {
    setSearchState({
      ...searchState,
      filtersHidden: !filtersHidden,
    });
  };
  //[TODO] We can use this to create a full screen modal if needed
  //const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const renderClearFiltersButton = () => {
    if (filtersActive()) {
      return (
        <div
          className={filtersHidden === false ? 'margin height-30 right' : 'clear-filters-hidden'}
        >
          <span id="clear-filters" className="link" onClick={() => onClearFiltersClick()}>
            Clear filters
          </span>
        </div>
      );
    }
  };

  const toggleSearchTipsDialog = () => {
    console.log('toggleSearchTipsDialog with', searchState.isSearchTipsDialogIsOpen);
    setSearchState({
      ...searchState,
      isSearchTipsDialogIsOpen: !searchState.isSearchTipsDialogIsOpen,
    });
    console.log('toggleSearchTipsDialog after', searchState.isSearchTipsDialogIsOpen);
  };
  const toggleAvailableFilesDialog = () => {
    console.log('toggleAvailableFiltersDialog');
    setSearchState({
      ...searchState,
      isAvailableFiltersDialogOpen: !searchState.isAvailableFiltersDialogOpen,
    });
  };
  const toggleQuickStartDialog = () => {
    console.log('toggleQuickStartDialog');
    setSearchState({
      ...searchState,
      isQuickStartDialogOpen: !searchState.isQuickStartDialogOpen,
    });
  };
  const onSortByChangeHandler = (evt) => {
    console.log('onSortByChangeHandler', evt.target.value);
    setSearchState({
      ...searchState,
      sortBy: evt.target.value,
    });
  };

  const onLimitChangeHandler = (evt) => {
    console.log('onLimitChangeHandler', evt.target.value);
    setSearchState({
      ...searchState,
      limit: evt.target.value,
    });
  };
  const onSortDirectionChangeHandler = (evt) => {
    console.log('onSortDirectionChangeHandler', evt.target.value);
    setSearchState({
      ...searchState,
      sortDirection: evt.target.value,
    });
  };
  const onDownloadClick = (evt) => {
    console.log('onDownloadClick', evt);
  };
  const onSaveresultsClick = (evt) => {
    console.log('onSaveresultsClick');
  };

  const [searchState, setSearchState] = useState({
    agency: [],
    endPublish: '',
    limit: 100,
    needsComments: false,
    needsDocument: false,
    startPublish: '',
    state: [],
    action: [],
    actionRaw: [],
    agency: [],
    agencyRaw: [],
    cooperatingAgency: [],
    cooperatingAgencyRaw: [],
    count: 0,
    county: [],
    countyOptions: Globals.counties,
    countyRaw: [],
    decision: [],
    decisionRaw: [],
    displayRows: [],
    down: false,
    eis_count: 0,
    EISCount: 0,
    endComment: null,
    endPublish: null,
    filtersHidden: false,
    firstYear: null,
    fragmentSizeValue: 2,
    geoLoading: true,
    geoResults: null,
    hideOrganization: true,
    hideText: false, //for testing should be true
    hidden: false, //same as above
    iconClassName: 'icon icon--effect',
    isAvailableFiltersDialogOpen: false,
    isDirty: false,
    isMapHidden: false,
    isQuickStartDialogOpen: false,
    isSearchTipsDialogIsOpen: false,
    lastSearchedTerm: '',
    lastYear: null,
    limit: 100,
    loaded: false,
    lookupResult: [[null]],
    markup: true,
    needsDocument: false,
    networkError: '',
    numPages: 0,
    offset: 0,
    optionsChecked: true,
    parseError: '',
    proximityDisabled: true,
    proximityOption: null,
    resultsText: 'Results',
    results: [],
    searcherInputs: {
      agency: [],
      endPublish: '',
      limit: 100,
      needsComments: false,
      needsDocument: false,
      startPublish: '',
      state: [],
    },

    searching: false,
    searchOption: 'B',
    shouldUpdate: false,
    showContext: false, //default should be false
    snippetsDisabled: false,
    sortBy: 'relevance',
    sortDirection: 'ASC',
    startComment: null,
    startPublish: null,
    state: [],
    stateOptions: Globals.locations,
    stateRaw: [],
    surveyChecked: true,
    surveyDone: true,
    surveyResult: "Haven't searched yet",
    test: Globals.anEnum.options,
    titleRaw: '',
    tooltipOpen: undefined,
    typeAll: true,
    typeDraft: false,
    typeEA: false,
    typeFinal: false,
    typeNOI: false,
    typeOther: false,
    typeROD: false,
    typeScoping: false,
    useSearchOptions: false,
    verified: false,
  });

  const gatherPageHighlightsDebounced = _.debounce(gatherPageHighlights, 500);

  let _page = 1;
  let _pageSize = 10;

  // For canceling a search when component unloads
  //  let _mounted = useRef(false);

  // For canceling any running search if user starts a new search before results are done
  let _searchId = 1;

  // For filtering results mid-search
  let _searcherState = searchState;

  // For display
  let _searchTerms = '';

  // For sorting mid-search
  let _sortVal = null;
  let _ascVal = true;

  let _finalCount = '';
  let _draftCount = '';
  let _eaCount = '';
  let _noiCount = '';
  let _rodCount = '';
  let _scopingCount = '';
      
  const doSearchFromParams = useCallback(() => {
    // console.log("Stored terms", _lastSearchTerms);
    // console.log("State.", state);

    var queryString = Globals.getParameterByName('q');
    console.log('queryString params', queryString);
    if (queryString === null || queryString === '') {
      // No query param/blank terms: Launch no-term search - Only if we have no results saved here already
      // console.log("No query parameters, doing blank search.", props.count);
      //[TODO] I don't think we should return all records on the first load
      //doSearch("");
    } else if (queryString && queryString.length && queryString !== 'undefined') {
      // Query terms: Handle proximity dropdown logic, launch search
      let proximityValues = handleProximityValues(queryString);

      let terms = parseTerms(queryString);

      const _lastSearchTerms = queryString;
      console.log(
        '🚀 ~ file: Search.jsx:2377 ~ doSearchFromParams ~ _lastSearchTerms:',
        _lastSearchTerms,
      );
      setSearchState({
        ...searchState,
        titleRaw: terms,
        proximityDisabled: proximityValues.disableValue,
        surveyChecked: false,
        surveyDone: false,
        isDirty: true,
        inputMessage: proximityValues._inputMessage,
      });
      doSearch(terms);
    }
  });

  const getEISDocCounts = useCallback(() => {
    const count = get('stats/eis_count', 'EISCount');
    console.log(
      '🚀 ~ file: Search.jsx ~ line 2456 ~ getEISDocCounts ~ count',
      JSON.stringify(count),
    );
    setSearchState({
      ...searchState,
      eis_count: count,
    }),
      () => {
        console.log('Cleanup getEISDocCounts', searchState);
      };
  }, [searchState.eis_count]);

//#endregion
  useEffect(() => {
    if (_mounted.value === false) {
      return; //do nothing till cleanup
    }
    _mounted.current = true;
    console.log(`Mounted `, _mounted);
    () => {
      console.log('cleaning up mounted check after useEffect');
      _mounted.current = false;
    };
  }, [_mounted.current]);

  useEffect(() => {
    console.log(
      'searchState.searchResults useEffect fired searchResults',
      searchState.searchResults,
    );
  },[searchState.searchResults])

  // useEffect(()=>{
  //   console.log('getPageHighlights setting pageInfo')
  //   //gatherPageHighlights();
  //   setPageInfo(1, 25);
  // },[searchState.snippetsDisabled, searchState.searching, searchState.networkError]);
  const hideText = (_offsetY, _index, record) => {
    offsetY = _offsetY;

    if (hidden.has(record.id)) {
      hidden.delete(record.id);
      setSearchState({ ...searchState, hidden: hidden });
    } else {
      hidden.add(record.id);
      setSearchState({...searchState, hidden: hidden }, () => {
        gatherSpecificHighlights(_index, record);
      });
    }
  };
    
  // useEffect(() => {
  //   console.log('getPageHighlights setting gatherSpecificHighlights');
  //   gatherPageHighlights();
  // }, [searchState.results]);

  useEffect(() => {
    if(_mounted.value === false){
        return;
    }
    let terms = parseTerms(searchState.titleRaw);
      const currentTerm = searchState.titleRaw;
      console.log('useEffect for currentTerm',currentTerm);
      const q = Globals.getParameterByName("q");
      console.log("🚀 ~ file: Search.jsx:2576 ~ useEffect ~ q :", q )
      if(q && currentTerm &&  currentTerm.length === 0){
      console.log('Search Terms from Params',q);
      setSearchState({
        ...searchState,
        titleRaw: q
      });
      //if there is a search term in the query params and the current term is empty set the search term to query params
      // if(currentTerm == "" && searchTerm && searchTerm.length){
      //   const terms = searchTerm;
      //   setSearchState({
      //     ...searchState,
      //     titleRaw: searchTerm,
      //   });
      // }
      // if(searchState.results && searchState.results.length === 0){
      //   //if there is no search results but queryparams are present than start
      //   console.log('No results from queryParams - startNewSearch',searchState.results);
      //   debouncedSearch(searchTerm);
      // }
    }});

  // useEffect(() => {
  //   if (_mounted.current === false) {
  //     return false;
  //   }
  //   console.log(`UseEffect for results `, searchState.results);
  //   searchState.results.map(
  //     (result, idx) => {
  //       console.log(`result gatherSpecific Highlights for idx: ${idx}`, result);
  //       gatherSpecificHighlights(idx, result.doc);
  //     },
  //     [searchState.results],
  //   );

  //   console.log('Results use Effect fired', searchState.results);
  // }, [searchState.results]);

  // useEffect(()=>{
  //   if(_mounted.current === false){
  //     return false;
  //   }

  //   console.log('Use Effect for Title Raw',searchState.titleRaw);
  //   },[searchState.titleRaw])

  // useEffect(()=>{
  //   if(_mounted.current === false){
  //     return false;
  //   }
  //   console.log(`searchState useEffect:`,searchState)
  // },[searchState]);

  //  const { markup, proximityDisabled, agencyRaw, state, county, proximityOption } = searchState;
  const value = {
    searchState,
    hideText,
    onAgencyChange,
    onChangeHandler,
    onClearFiltersClick,
    onCooperatingAgencyChange,
    onCountyChange,
    onDownloadClick,
    onIconClick,
    onInput,
    onKeyDown,
    onKeyUp,
    onLimitChangeHandler,
    onLocationChange,
    onMarkupChange,
    onProximityChange,
    onProximityChange,
    onSaveresultsClick,
    onSnippetsToggle,
    onSortByChangeHandler,
    onSortDirectionChangeHandler,
    onTitleOnlyChecked,
    onTitleOnlyChecked,
    onTypeChecked,
    setSearchState,
    toggleAvailableFilesDialog,
    toggleQuickStartDialog,
    toggleSearchTipsDialog,
  };
  //console.log('SEARCH SearchState',searchState);
  // #region Return Method

  return (
    <SearchContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <Container disableGutters={true} id="search-app-container">
          <Grid
            // textAlign={'left'}
            // alignContent={'flex-start'}
            spacing={2}
            // justifyContent={'flex-start'}
            container
            marginTop={isMobile ? '55px' : '105px'}
          >
            <Grid item xs={12}>
              <Item>
                <SearchHeader />
              </Item>
            </Grid>
            {/* #region SideBarFilters */}
            <Grid xs={12} md={3} id="side-bar-filters-container">
              <Paper id="side-bar-filters-paper" elevation={1}>
                <SearchSideBarFilters />
              </Paper>
            </Grid>
            {/* #endregion */}
            {/* #region Search Results */}
            <Grid md={9} xs={12}>
              <Paper>
                <Box
                  sx={{
                    height: '100%',
                  }}
                >
                  <Divider />

                  <Grid container flex={1} flexGrow={1}>
                    <Grid item xs={12} width={'100%'}>
                      <>
                      <h1>Output Results</h1>
                      {JSON.stringify(searchState.outputResults)}
                      <h1>Search Results</h1>
                      {JSON.stringify(searchState.searchResults)}
                      <h1>Results</h1>
                      {JSON.stringify(searchState.results)}
                        {/* {Object.keys(searchState).map((key, idx) => {
                          return (
                            <div key={idx}>
                              {key} : {searchState[key]}
                            </div>
                          );
                        })} */}
                        {/* <h1>searchResults</h1>
                        {searchState.searchResults}
                        <h1>All Results</h1>
                        {searchState.results} */}
                        <Divider />
                        {searchState.outputResults && searchState.outputResults.length ? (
                          <SearchResults results={searchState.outputResults} />
                        ) : (
                          <div>No results found for {searchState.titleRaw}</div>
                        )}
                      </>
                    </Grid>
                  </Grid>
                </Box>
              </Paper>
            </Grid>
            {/* #endregion */}
          </Grid>
        </Container>
        {/* <SearchTipsDialog isOpen={searchState.isSearchTipsDialogIsOpen} /> */}
      </ThemeProvider>
    </SearchContext.Provider>
  );
  // #endregion
}

function matchesEa(docType) {
  return docType.toLowerCase() === 'ea';
}

function matchesRod(docType) {
  return docType.toLowerCase() === 'rod';
}

function matchesScoping(docType) {
  return docType.toLowerCase() === 'scoping report';
}
function matchesNOI(docType) {
  return docType.toLowerCase() === 'noi';
}

/** Return modified terms for user to see */
function preProcessTerms(terms) {
  return terms;
}

/** Return modified terms but not for user to see */
function postProcessTerms(terms) {
  console.log('🚀 ~ file: Search.jsx:2562 ~ postProcessTerms ~ terms:', terms);
  return terms ? terms.replaceAll(':', '') : '';
  // .replaceAll(/(^|[\s]+)US($|[\s]+)/g,' ("U. S." | U.S. | US) ') // this was a very bad idea
  // .replaceAll(/(^|[\s]+)U\.S\.($|[\s]+)/g,' ("U. S." | U.S. | US) ');
}
