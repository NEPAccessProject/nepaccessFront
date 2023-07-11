import CloseIcon from '@mui/icons-material/Close';
import Globals from '../../globals';
//import Grid from '@mui/material/Grid'; // Grid version 1
import Grid from '@mui/material/Unstable_Grid2';
import ProximitySelect from './ProximitySelect';
import React, { useState, useReducer, useContext, useEffect } from 'react';
import ResponsiveSearchResults from './SearchResults';
import SearchContext from './SearchContext';
import SearchSideBarFilters from './SearchSideBarFilters';
import theme from '../../styles/theme';
import {Document, Page, pdfjs} from 'react-pdf';
import {
  Paper,
  Button,
  Input,
  Box,
  Divider,
  FormControl,
  Select,
  Autocomplete,
  InputLabel,
  ListItem,
  IconButton,
  TextField,
  Typography,
  Container,
  FormLabel,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogContentText,
  DialogActions,
  FormControlLabel,
  Checkbox,
  useMediaQuery,
} from '@mui/material';
import {
  proximityOptions,
  actionOptions,
  decisionOptions,
  agencyOptions,
  stateOptions,
  countyOptions,
} from '../options';
import { ThemeProvider, styled } from '@mui/material/styles';
import SearchHeader from './SearchHeader';

import axios from 'axios';
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
  console.log("SEARCH PROPS", props)
  const classes = useStyles(theme);
  const isMobile = useMediaQuery('(max-width:768px)');

  const filterBy = props.filterResultsBy;
  const myRef = React.createRef();
  const doSearch = (terms) => {
    console.log('doSearch terms', terms);
    setSearchState({
      ...searchState,
      search: terms,
      searchOptionsChecked: false,
      _lastSearchTerms: terms,
      titleRaw: parseTerms(terms),
      _lastSearchedTerm: parseTerms(terms),
      surveyChecked: false,
      surveyDone: false,
      isDirty: true,
    });
    debouncedSearch(searchState);
  };

function parseTerms(str) {
    console.log("🚀 ~ file: Search.jsx:138 ~ parseTerms ~ str:", str)
    if (!str) return str;
  
    str = str.replace(/"(.+)"[\s]*~[\s]*([0-9]+)/g, "\"$1\"~$2"); // "this" ~ 100 -> "this"~100
  
    // so this regex works correctly, but after replacing, it matches internal single quotes again.
    // Therefore we shouldn't even run this if there are already double quotes.
    // If the user is using double quotes already, we don't need to try to help them out anyway.
    if (!str.includes('"')) {
      str = str.replace(/([\s]|^)'(.+)'([\s]|$)/g, "$1\"$2\"$3"); // 'this's a mistake' -> "this's a mistake"
    }
    console.log("🚀 ~ file: Search.jsx:150 ~ UPDATED parseTerms ~ str:", str)
    return str;
  }

  const doSearchFromParams = () => {
    var queryString = Globals.getParameterByName('q');
    if (!props.count && (queryString === null || queryString === '')) {
      // No query param/blank terms: Launch no-term search - Only if we have no results saved here already
      doSearch('');
    } else if (queryString) {
      // Query terms: Handle proximity dropdown logic, launch search
      setProximityValues(handleProximityValues(queryString));

      setSearchState({
        ...searchState,
        _lastSearchTerms: queryString,
        titleRaw: parseTerms(queryString),
        proximityDisabled: proximityValues.disableValue,
        surveyChecked: false,
        surveyDone: false,
        isDirty: true,
      });
      setInputMessage(proximityValues._inputMessage);

      if (searchState.titleRaw) {
        setDebouncedSearch(state);
      }
    }
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
    console.log('onIconClick clicked', evt.target);
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
      doSearch(titleRaw);
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
    console.log('onIpunt evt.target',evt.target)
    let userInput = evt.target.value;
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
      // Assuming Search and SearchResultsMap talk to each other, we'll want two-way interaction.
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
    console.log("🚀 ~ file: Search.jsx:520 ~ onTypeChecked ~ evt:", evt)
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

  const getFirstYearCount = () => {
    get('stats/earliest_year', 'firstYear');
  };

  const getLastYearCount = () => {
    get('stats/latest_year', 'lastYear');
  };

  const getEISDocCounts = () => {
    get('stats/eis_count', 'EISCount');
  };
  const get = (url, stateName) => {
    const _url = new URL(url, Globals.currentHost);
    console.log('Calling URL',_url);
    axios({
      url: _url,
      method: 'GET',
      data: {},
    })
      .then((_response) => {
        const rsp = _response.data;
        setSearchState({ ...searchState, [stateName]: rsp });
      })
      .catch((error) => {
        console.log('Error getting Results from the Server at ' + url, error)
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
    console.log('toggleSearchTipsDialog with',searchState.isSearchTipsDialogIsOpen);
    setSearchState({
      ...searchState,
      isSearchTipsDialogIsOpen: !searchState.isSearchTipsDialogIsOpen,
    });
    console.log('toggleSearchTipsDialog after',searchState.isSearchTipsDialogIsOpen);
  };
  const toggleAvailableFilesDialog = () => {
    console.log('toggleAvailableFiltersDialog');
    setSearchState({
      ...searchState,
      isAvailableFiltersDialogOpen: !searchState.isAvailableFiltersDialogOpen,
  });
}
  const toggleQuickStartDialog = () => {
    console.log('toggleQuickStartDialog');
    setSearchState({
      ...searchState,
      isQuickStartDialogOpen: !searchState.isQuickStartDialogOpen,
  });
}
const onSortByChangeHandler = (evt) => {
  console.log('onSortByChangeHandler', evt.target.value);
  setSearchState({
    ...searchState,
    sortBy: evt.target.value,
})
};

const onLimitChangeHandler = (evt) =>{
  console.log('onLimitChangeHandler', evt.target.value);
  setSearchState({
    ...searchState,
    limit: evt.target.value,
})
};
const onSortDirectionChangeHandler = (evt) =>{
  console.log('onSortDirectionChangeHandler', evt.target.value);
  setSearchState({
    ...searchState,
    sortDirection: evt.target.value,
  })
}
const onDownloadClick = (evt) => {
  console.log('onDownloadClick',evt);
};
const onSaveSearchResultsClick = (evt) => {
  console.log('onSaveSearchResultsClick');
};  

const [searchState, setSearchState] = useState({
  // test: Globals.enum.options,
  firstYear: null,
  lastYear: null,
  eis_count :0,
  isQuickStartDialogOpen: false,
  isSearchTipsDialogIsOpen: false,
  isAvailableFiltersDialogOpen: false,
  action: [],
  actionRaw: [],
  agency: [],
  agencyRaw: [],
  cooperatingAgency: [],
  cooperatingAgencyRaw: [],
  county: [],
  countyRaw: [],
  decision: [],
  decisionRaw: [],
  EISCount: 0,
  endComment: null,
  endPublish: null,
  filtersHidden: false,
  firstYear: null,
  fragmentSizeValue: 2,
  hideOrganization: true,
  iconClassName: 'icon icon--effect',
  isDirty: false,
  lastYear: null,
  limit: 100,
  markup: true,
  needsComments: false,
  needsDocument: false,
  numPages: 0,
  offset: 0,
  optionsChecked: true,
  proximityDisabled: true,
  proximityOption: null,
  searchOption: 'B',
  sortBy: 'relevance',
  sortDirection: 'ASC',
  startComment: null,
  startPublish: null,
  state: [],
  stateRaw: [],
  stateOptions: Globals.locations,
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
  countyOptions: Globals.counties,
});

//[TODO] a lot of duplication BUT it fixed the reRender Loop. Need to revisit to combine into a singleFunction
useEffect(() => {
//  console.log('USE Effect for searchState:',searchState);
  //getCounts();
  getFirstYearCount();
 // console.log('searchState.lastYear',searchState.lastYear);
  // console.log('searchState.EISCount',searchState.EISCount);
  return ()=>{
//    console.log('USE EFFECT DISMOUNT searchState',searchState);
  }
},[searchState.firstYear]);

useEffect(() => {
  //  console.log('USE Effect for searchState:',searchState);
    //getCounts();
    getLastYearCount();
   // console.log('searchState.lastYear',searchState.lastYear);
    // console.log('searchState.EISCount',searchState.EISCount);
    return ()=>{
  //    console.log('USE EFFECT DISMOUNT searchState',searchState);
    }
  },[searchState.lastYear]);

  useEffect(() => {
    getEISDocCounts();
    return()=>{
      //console.log('useEffect getEISCount Dismount state',searchState);
    }

  },[searchState.EISCount])

  useEffect(()=> {
    console.log('UseEffect props search',props.search);
    const debouncedSearch = _.debounce(props.search, 300);
    const filterBy = props.filterResultsBy;
    // this.filterBy = _.debounce(this.props.filterResultsBy, 200);
    const debouncedSuggest = _.debounce(props.suggest, 300);
  },[props.search])


//const debouncedSearch = _.debounce(searchState.titleRaw, 500);
const debouncedSearch =(func,interval) => {
  console.log('Debounced search mock,',func,interval)
}
//     this.debouncedSearch = _.debounce(this.props.search, 300);

  const { markup, proximityDisabled, agencyRaw, state, county, proximityOption } = searchState;
  const value = {
    searchState,
    onKeyDown,
    onKeyUp,
		onInput,
    setSearchState,
    onProximityChange,
    onTitleOnlyChecked,
    onMarkupChange,
    onProximityChange,
    onCooperatingAgencyChange,
    onAgencyChange,
    onLocationChange,
    onCountyChange,
    onClearFiltersClick,
    onIconClick,
    onTitleOnlyChecked,
    // proximityDisabled,
    // agencyRaw,
    // state,
    // county,
    toggleQuickStartDialog,
    toggleAvailableFilesDialog,
    toggleSearchTipsDialog,
    onChangeHandler,
    onSortByChangeHandler,
    onLimitChangeHandler,
    onSortDirectionChangeHandler,
    onDownloadClick,
    onSaveSearchResultsClick,
    onTypeChecked,
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
                  <Item><SearchHeader /></Item>
  
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
                   
                    <Grid container>
                     
                          <ResponsiveSearchResults
                            title="Environmental Impact Statement"
                            id={17704}
                            status="Final"
                            content="Probability That Monthly Flow below Lake Ralph Hall Dam at Bakers Creek Exceeds"
                          />
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
