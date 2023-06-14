import React, { useState, useReducer, useContext } from 'react';
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
import { ThemeProvider, styled } from '@mui/material/styles';
import theme from '../../styles/theme';
//import Grid from '@mui/material/Grid'; // Grid version 1
import Grid from '@mui/material/Unstable_Grid2';
import { InputAdornment, SearchOutlined } from '@mui/icons-material';
import {
  proximityOptions,
  actionOptions,
  decisionOptions,
  agencyOptions,
  stateOptions,
  countyOptions,
} from '../options';
import { withStyles } from '@mui/styles';
import SideBarFilters from './SideBarFilters';
import SearchFilter from './SearchFilter';
import ResponsiveSearchResults from './ResponsivSearchResults';
import { lightBlue } from '@mui/material/colors';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import SearchResultItems from './SearchResultsItems';
import CloseIcon from '@mui/icons-material/Close';
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  // ...theme.typography.body2,
  padding: theme.spacing(1),
  // textAlign: 'center',
  color: theme.palette.text.secondary,
  elevation: 1,
  borderRadius: 0,
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
  borderRadius: 0,
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
  const classes = useStyles(theme);
// #region State Declaration
  const [searchState, setSearchState] = useState({
    action: [],
    actionRaw: '',
    agency: [],
    agencyRaw: '',
    agencyRaw: [],
    cooperatingAgency: [],
    cooperatingAgencyRaw: [],
    county: countyOptions,
    countyRaw: '',
    countyRaw: [],
    decision: '',
    decisionRaw: '',
    dialogIsOpen: false,
    endComment: null,
    endPublish: null,
    fragmentSizeValue: 2,
    hideOrganization: false,
    iconClassName: 'icon icon--effect',
    isDirty: false,
    limit: 100,
    markup: false,
    needsComments: false,
    needsComments: false,
    needsDocument: false,
    needsDocument: false,
    offset: 0,
    optionsChecked: true,
    optionsChecked: true,
    proximityDisabled: true,
    proximityOptions: proximityOptions,
    search: '',
    searchOption: 'B',
    searchOptionsChecked: false,
    searchOptionsChecked: false,
    startComment: null,
    startPublish: null,
    state: [],
    stateRaw: '',
    stateRaw: [],
    surveyChecked: true,
    surveyDone: false,
    // test: Globals.enum.options,
    tooltipOpen: undefined,
    typeAll: true,
    typeDraft: true,
    typeEA: true,
    typeEAFinal: false,
    typeEAFinalFinal: false,
    typeFinal: true,
    typeNOI: false,
    typeNOIFinal: false,
    typeOther: false,
    typeROD: false,
    typeRODFinal: false,
    typeRODFinalFinal: false,
    typeScoping: false,
    isSearchTipsDialogIsOpen : false,
    isFilesTipsDialogIsOpen : false,
    isQuickStartDialogIsopen : false,
  });

// #endregion
  const filterBy = props.filterResultsBy;
  const myRef = React.createRef();
  const doSearch = (terms) => {
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

  const doSearchFromParams = () => {
    // console.log("Stored terms", _lastSearchTerms);
    // console.log("State.", state);

    var queryString = Globals.getParameterByName('q');
    if (!props.count && (queryString === null || queryString === '')) {
      // No query param/blank terms: Launch no-term search - Only if we have no results saved here already
      // console.log("No query parameters, doing blank search.", props.count);
      doSearch('');
    } else if (queryString) {
      // Query terms: Handle proximity dropdown logic, launch search
      setProximityValues(handleProximityValues(queryString));

      setSearchState(...searchState, {
        _lastSearchTerms: queryString,
        titleRaw: parseTerms(queryString),
        proximityDisabled: proximityValues.disableValue,
        surveyChecked: false,
        surveyDone: false,
        isDirty: true,
      });
      setInputMessage(proximityValues._inputMessage);

      if (titleRaw) {
        // console.log("Firing search with query param");
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

  /**
   * Event handlers
   */

  const onIconClick = (evt) => {
    doSearch(titleRaw);
  };
  /** clears and disables proximity search option as well as clearing text */
  const onClearClick = (evt) => {
    setSearchState(...searchState, {
      titleRaw: '',
      proximityDisabledSet: true,
      proximityOption: null,
      inputMessage: '',
    });
    inputSearch.focus();
    // debouncedSuggest();
  };

  const onClearFiltersClick = () => {
    setSearchState(
      ...searchState,
      {
        // titleRaw: '',
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
      },
      () => {
        filterBy(searchState);
      },
    );
  };

  const onRadioChange = (evt) => {
    setSearchState(...searchState, { [evt.target.name]: evt.target.value }, () => {
      // debouncedSearch(state);
    });
  };

  const onKeyUp = (evt) => {
    if (evt.keyCode === 13) {
      evt.preventDefault();
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
  const onMarkupChange = (evt) => {
    let checked = evt.target.checked;
    setSearchState(...searchState, {
      markup: checked,
    });
  };

  const onInput = (evt) => {
    let userInput = evt.target.value;

    let proximityValues = handleProximityValues(userInput);

    //get the evt.target.name (defined by name= in input)
    //and use it to target the key on our `state` object with the same name, using bracket syntax
    setSearchState(
      ...searchState,
      {
        [evt.target.name]: userInput,
        proximityDisabled: proximityValues.disableValue,
        inputMessage: proximityValues._inputMessage,
      },
      () => {
        // auto-searching is currently too expensive until asynchronous results
        // debouncedSearch(state);
        // autocomplete/suggest/other functionality fires, starting here
        // TODO: May want to take out any special characters that never appear in titles or are otherwise unnecessary
        // debouncedSuggest(titleRaw);
      },
    );
  };

  // suppress warning that there's no onChange event, handler (despite onChange rarely being the best event to take advantage of)
  const onChangeHandler = (evt) => {
    // do nothing
  };
  const toggleSearchTipDialogClose = (isOpen) => {
    (isOpen == true) 
      ?  setSearchState(prevState => ({
            ...prevState,    // keep all other key-value pairs
            isSearchTipsDialogIsOpen: false       // update the value of specific key
        }))
      :  setSearchState(prevState => ({
        ...prevState,    // keep all other key-value pairs
        isSearchTipsDialogIsOpen: true       // update the value of specific key
    }))

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
    setSearchState(...searchState, {
      fragmentSizeValue: evt.value,
      fragmentSize: evt,
    });
  };

  const onAgencyChange = (evt) => {
    var agencyLabels = [];
    for (var i = 0; i < evt.length; i++) {
      agencyLabels.push(evt[i].label.replace(/ \([A-Z]*\)/gi, ''));
    }

    setSearchState({
      agency: agencyLabels,
      agencyRaw: evt,
    });
  };
  const onCooperatingAgencyChange = (evt) => {
    var agencyLabels = [];
    for (var i = 0; i < evt.length; i++) {
      agencyLabels.push(evt[i].label.replace(/ \([A-Z]*\)/gi, ''));
    }
    setSearchState(
      ...searchState,
      {
        cooperatingAgency: agencyLabels,
        cooperatingAgencyRaw: evt,
      },
      () => {
        filterBy(searchState);
      },
    );
  };
  const onActionChange = (evt) => {
    var actionLabels = [];
    for (var i = 0; i < evt.length; i++) {
      actionLabels.push(evt[i].label.replace(/ \([A-Z]*\)/gi, ''));
    }
    setSearchState(
      ...searchState,
      {
        action: actionLabels,
        actionRaw: evt,
      },
      () => {
        filterBy(searchState);
      },
    );
  };
  const onDecisionChange = (evt) => {
    var decisionLabels = [];
    for (var i = 0; i < evt.length; i++) {
      decisionLabels.push(evt[i].label.replace(/ \([A-Z]*\)/gi, ''));
    }
    setSearchState(
      ...searchState,
      {
        decision: decisionLabels,
        decisionRaw: evt,
      },
      () => {
        filterBy(searchState);
      },
    );
  };
  const onLocationChange = (evt, item) => {
    var stateValues = [];
    for (var i = 0; i < evt.length; i++) {
      stateValues.push(evt[i].value);
    }

    setSearchState(
      ...searchState,
      {
        state: stateValues,
        stateRaw: evt,
        countyOptions: narrowCountyOptions(stateValues),
      },
      () => {
        // filterBy(searchState);
        // Purge invalid counties, which will then run filterBy
        onCountyChange(countyOptions.filter((countyObj) => county.includes(countyObj.value)));
      },
    );
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
  const onCountyChange = (evt, item) => {
    var countyValues = [];
    for (var i = 0; i < evt.length; i++) {
      countyValues.push(evt[i].value);
    }
    setSearchState(...searchState, {
      county: countyValues,
      countyRaw: evt,
    });
  };

  const onProximityChange = (evt) => {
    if (evt.value === -1) {
      setSearchState(
        ...searchState,
        ...{
          proximityOption: null,
        },
      );
    } else {
      setSearchState(...searchState, { ...state, proximityOption: evt });
    }
  };

  const onTitleOnlyChecked = (evt) => {
    if (evt.target.checked) {
      setSearchState(...searchState, {
        searchOption: 'C', // Title only
      });
    } else {
      setSearchState(...searchState, {
        searchOption: 'B', // Both fields, Lucene default scoring
      });
    }
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
    setSearchState(
      ...searchState,
      {
        needsDocument: !needsDocument,
      },
      () => {
        filterBy(searchState);
      },
    );
  };

  const onTypeChecked = (evt) => {
    if (evt.target.name === 'optionsChecked') {
      setSearchState(...searchState, {
        [evt.target.name]: evt.target.checked,
      });
    } else if (evt.target.name === 'typeAll' && evt.target.checked) {
      // All: Check all, uncheck others
      setSearchState(
        ...searchState,
        {
          typeAll: true,
          typeFinal: false,
          typeDraft: false,
          typeOther: false,
        },
        () => {
          filterBy(searchState);
          /**debouncedSearch(state);*/
        },
      );
    } else {
      // Not all: Check target, uncheck all
      setSearchState(
        ...searchState,
        {
          [evt.target.name]: evt.target.checked,
          typeAll: false,
        },
        () => {
          filterBy(setSearchState);
          // debouncedSearch(state);
        },
      );
    }
  };

  // onChecked = (evt) => {
  //     setSearchState(...searchState, { [evt.target.name]: evt.target.checked}, () => { debouncedSearch(state); });
  // }

  const onStartDateChange = (date) => {
    setSearchState(...searchState, { startPublish: date }, () => {
      filterBy(searchState);
      // debouncedSearch(state);
    });
  };
  // Tried quite a bit but I can't force the calendar to Dec 31 of a year as it's typed in without editing the library code itself.
  // I can change the value but the popper state won't update to reflect it (even when I force it to update).
  const onEndDateChange = (date, evt) => {
    setSearchState(...searchState, { endPublish: date }, () => {
      filterBy(searchState);
      // debouncedSearch(state);
    });
    // }
  };
  const onStartCommentChange = (date) => {
    setSearchState(...searchState, { startComment: date }, () => {
      filterBy(searchState);
      // debouncedSearch(state);
    });
  };
  const onEndCommentChange = (date) => {
    setSearchState(...searchState, { endComment: date }, () => {
      filterBy(searchState);
      // debouncedSearch(state);
    });
  };
  const tooltipTrigger = (evt) => {
    setSearchState(...searchState, { tooltipOpen: !tooltipOpen });
  };
  const closeTooltip = () => {
    setSearchState(...searchState, {
      tooltipOpen: false,
    });
  };

  const getCounts = () => {
    get('stats/earliest_year', 'firstYear');
    get('stats/latest_year', 'lastYear');
    get('stats/eis_count', 'EISCount');
  };
  const get = (url, stateName) => {
    const _url = new URL(url, Globals.currentHost);
    axios({
      url: _url,
      method: 'GET',
      data: {},
    })
      .then((_response) => {
        const rsp = _response.data;
        setSearchState(...searchState, { [stateName]: rsp });
      })
      .catch((error) => {});
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
    setSearchState(
      ...searchState,
      {
        filtersHidden: !filtersHidden,
      },
      () => {
        props.filterToggle(filtersHidden);
      },
    );
  };
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
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
  
// #region Return Method
  return (
    <ThemeProvider theme={theme}>
      <Container disableGutters={true} sx={{}}>
        <Paper>
          <div style={styles} id="search-text-div">
            <Grid
              id="search-text-grid-container"
              display={'flex-root'}
              alignItems={'center'}
              container={true}
              layout={'row'}
              spacing={1}
              border={0}
              borderColor={'#CCC'}
            >
              <Grid
                id="search-text-grid-item"
                item={true}
                xs={2}
                border={0}
                backgroundColor="transparent"
                height={115}
                borderRadius={0}
                borderColor={'#CCC'}
                borderRight={1}
              >
            
                <div style={section}>
                  {' '}
                  <ListItem >Search Tips</ListItem>
                  <ListItem >Available Files</ListItem>
                  <ListItem>Quick-start guide</ListItem>
                </div>
              </Grid>
              <Grid item={true} xs={2}>
                <Box
                  id="proximity-search-box"
                  width={'100%'}
                  display={'flex'}
                  alignItems={'center'}
                  justifyContent={'flex-end'}
                  paddingLeft={1}
                >
                  <ProximitySelect
                    onProximityChange={onProximityChange}
                    options={proximityOptions}
                  />
                </Box>
              </Grid>
              <Grid item={true} xs={8} borderLeft={0} id="search-box-grid-item">
                <Box
                  id="search-box-box-item"
                  xs={12}
                  display={'flex'}
                  justifyContent={'center'}
                  justifyItems={'center'}
                  alignItems={'center'}
                  alignContent={'center'}
                  height={115}
                  paddingLeft={2}
                  paddingRight={2}
                  padding={1}
                  elevation={1}
                  borderRadius={0}
                  borderColor={'#CCC'}
                  borderLeft={0}
                  marginLeft={0}
                  marginRight={0}
                >
                  {' '}
                  <TextField
                    fullWidth
                    backgroundColor={'white'}
                    id="main-search-text-field"
                    variant="standard"
                    onInput={onInput}
                    onKeyUp={onKeyUp}
                    placeholder="Search for NEPA documents"
                    value={searchState.titleRaw ? searchState.titleRaw : ''}
                    autoFocus
                    InputProps={{
                      endAdornment: (
                        <IconButton onClick={(evt) => onChangeHandler(evt)}>
                          <SearchOutlined />
                        </IconButton>
                      ),
                    }}
                  />
                </Box>
              </Grid>
            </Grid>
          </div>
        </Paper>

        <Grid
          mt={2}
          textAlign={'left'}
          alignContent={'flex-start'}
          spacing={2}
          justifyContent={'flex-start'}
          container={true}
        >
 {/* #region SideBarFilters */}
          <Grid xs={3} p={0} item={true}>
            <Box>
              <Item>
                <Box marginBottom={0}>
                  <FormControlLabel
                    control={
                      <Checkbox checked={searchState.searchOption} onChange={onTitleOnlyChecked} />
                    }
                    label="Has downloadable items"
                  />
                </Box>
                <FormControlLabel
                  control={<Checkbox checked={searchState.markup} onChange={onMarkupChange} />}
                  label="Search only within titles"
                />
              </Item>
              <FilterItem>
                <SearchFilter
                  filter={{
                    className: classes.formControl,
                    placeholder: 'Find within',
                    variant: 'standard',
                    id: 'proximity-select',
                    className: searchState.proximityDisabled ? ' disabled' : '',
                    // classNamePrefix="react-select control"
                    placeholder: 'Keyword distance',
                    options: proximityOptions,
                    // menuIsOpen={true}
                    onChange: onProximityChange,
                    label: 'Distance Between Search Terms',
                    tabIndex: '1',
                  }}
                />
              </FilterItem>

              <FilterItem>
                <SearchFilter
                  filter={{
                    className: classes.formControl,
                    placeholder: 'Type or Select Lead Agencies',
                    value: searchState.agencyRaw ? searchState.agencyRaw : '',
                    onChange: onAgencyChange,
                    id: 'searchAgency',
                    type: Autocomplete,
                    options: agencyOptions,
                    label: 'Lead Agencies',
                    tabIndex: '3',
                  }}
                />
              </FilterItem>
              <FilterItem>
                <SearchFilter
                  filter={{
                    className: classes.formControl,
                    placeholder: 'Type or select Cooperating agencies',
                    value: searchState.agencyRaw ? searchState.agencyRaw : '',
                    onChange: onAgencyChange,
                    id: 'searchAgency',
                    name: 'cooperatingAgency',
                    type: Autocomplete,
                    options: agencyOptions,
                    label: 'Cooperating Agencies',
                    tabIndex: '4',
                  }}
                />
              </FilterItem>
              <Divider />
              <FilterItem>
                <SearchFilter
                  filter={{
                    className: classes.formControl,
                    placeholder: 'Type or Select State(s) or Location(s)',
                    value: (stateOptions.filter = (stateObj) => state.includes(stateObj.value)),
                    onChange: onLocationChange,
                    id: 'searchState',
                    name: 'state',
                    type: Autocomplete,
                    options: stateOptions,
                    label: 'State(s) or Location(s)',
                    tabIndex: '5',
                  }}
                />
              </FilterItem>

              <FilterItem>
                <SearchFilter
                  filter={{
                    className: classes.formControl,
                    placeholder: 'Type or Select a County',
                    value: countyOptions.filter((countyObj) =>
                      searchState.county.includes(countyObj.value),
                    ),
                    onChange: onCountyChange,
                    id: 'searchCounty',
                    name: 'county',
                    type: Autocomplete,
                    options: countyOptions,
                    label: 'County / counties',
                    tabIndex: '6',
                  }}
                />
              </FilterItem>
              <Divider />
              <FilterItem>
                <Typography pb={1} variant="filterLabel">
                  Date Range:
                </Typography>
                <Box
                  display={'flex'}
                  xs={12}
                  flexDirection={'column'}
                  border={0}
                  padding={0}
                  margin={0}
                  width={'100%'}
                >
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Box marginBottom={2} components={['DatePicker']} padding={0} width="100%">
                      <DatePicker
                        onChange={onStartDateChange}
                        id="date-picker-from"
                        label="From:"
                      />
                    </Box>
                  </LocalizationProvider>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Box components={['DatePicker']} padding={0} width="100%">
                      <DatePicker on={onEndDateChange} id="date-picker-to" label="To:" />
                    </Box>
                  </LocalizationProvider>
                </Box>
              </FilterItem>
            </Box>
            <Divider />
          </Grid>
{/* #endregion */}
          {/* #region Search Results */}
          <Grid xs={9}>
            <Paper>
              <Box
                sx={{
                  height: '100%',
                }}
              >
                <Box padding={1} marginTop={0} marginBottom={0}>
                  <Typography
                    variant="searchResultTitle"
                    paddingTop={1}
                    paddingBottom={1}
                    marginTop={2}
                    marginBottom={2}
                  >
                    Search Results
                  </Typography>
                </Box>
                <Divider />
                <Grid container>
                  <Box p={1} marginTop={1} marginBottom={1}>
                    <Typography variant="searchResultSubTitle">
                      Lake Ralph Hall Regional Water Supply Reservoir Project
                    </Typography>
                  </Box>
                  <Divider />
                  <Grid container xs={12}>
                    <Grid
                      padding={2}
                      flexWrap={'wrap'}
                      container
                      xs={12}
                      flexDirection={'row'}
                      flex={1}
                      border={0}
                    >
                      <Item>
                        Status: <b>Final</b>
                      </Item>
                      <Item>
                        Date: <b>2020-01-01</b>
                      </Item>
                      <Item>
                        State: <b>TX</b>
                      </Item>
                      <Item>
                        County: <b>TX: Fannin</b>
                      </Item>
                      <Item>
                        Action: <b>Water Work</b>
                      </Item>
                      <Item>
                        Decision <b>Project</b>
                      </Item>
                      <Item>
                        Action: <b>Transportation</b>
                      </Item>
                      <Item>
                        Decision <b>Project</b>
                      </Item>
                      <Item>
                        County: <b>AZ: Pima; AZ: Santa Cruz; AZ: Yavapai</b>
                      </Item>
                    </Grid>

                    <Grid xs={12} container>
                      <Item xs={12}>
                        <SearchResultItems
                          title="Environmental Impact Statement"
                          id={17704}
                          status="Pending"
                          content="Probability That Monthly Flow below Lake Ralph Hall Dam at Bakers Creek Exceeds
                      Channel Pool Volume of 175 ac-ft: 62.2% 73.0%Probability That Monthly Flow at North
                      Sulphur River Gage near Cooper Exceeds Channel Pool Volume of 175 ac-ft: 82.1%
                      83.8%PER- EXCEED-CENTILE ENCEPROBA-BILITY From From From From From From From From
                      From From From FromRiverWare WAM RiverWare WAM RiverWare WAM RiverWare WAM RiverWare
                      WAM RiverWare WAM% % ac-ft/mon ac-ft/mon ac-ft/mon ac-ft/mon ac-ft/mon ac-ft/mon
                      ac-ft/mon ac-ft/mon ac-ft/mon ac-ft/mon ac-ft/mon ac-ft/mon1.0% 99.0% 0 0 0 0 0 2 1
                      3 308 208 308 2842.0% 98.0% 0 0 0 0 0 3 5 4 316 310 341 4163.0% 97.0% 0 0 0 0 0 4 11
                      10 343 378 369 4724.0% 96.0% 3 2 1 3 4 9 30 23 350 384 442 5095.0% 95.0% 5 4 1 5 9
                      16 38 34 394 423 527 5907.0% 93.0% 13 8 3 9 22 28 63 57 455 473 720 75110.0% 90.0%
                      27 17 5 19 45 54 114 121 658 587 1,046 1,18015.0% 85.0% 76 48 14 47 115 149 288 364
                      1,051 1,053 1,740 1,91916.2% 83.8% 90 57 18 53 147 175 329 425 1,151 1,201"
                        />
                      </Item>
                    </Grid>
                    <Grid>
                      <Item xs={12}>
                        <SearchResultItems
                          title="Environmental Impact Statement"
                          id={17704}
                          status="Draft"
                          content="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Mi proin sed libero enim. Morbi tincidunt ornare massa eget. Venenatis lectus magna fringilla urna porttitor. Habitasse platea dictumst vestibulum rhoncus. Neque sodales ut etiam sit amet nisl. Tincidunt dui ut ornare lectus sit amet est. Suspendisse in est ante in. Et malesuada fames ac turpis egestas maecenas. Gravida in fermentum et sollicitudin ac orci phasellus. Risus viverra adipiscing at in tellus integer. Sem et tortor consequat id porta nibh venenatis. Porttitor leo a diam sollicitudin tempor id eu nisl."
                        />
                      </Item>
                    </Grid>
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
  );
// #endregion
}// #region SubComponents

export function ProximitySelect(props) {
  const { options, proximityDisabled, onProximityChange } = props;
  const [proximityOptionValue, setProximityOptionValue] = React.useState(proximityOptions[0]);
  console.log('ProximitySelect options', proximityOptions ? proximityOptions.length : 0);
  const classes = useStyles(theme);
  const isDisabled = proximityDisabled ? false : true;
  // (props.proximityOptionValue) ? setProximityOptionValue(props.proximityOptionValue) : setProximityOptionValue(proximityOptions[0]);
  return (
    <>
      <Autocomplete
        id={'proximity-select-autocomplete'}
        fullWidth={true}
        autoComplete={true}
        cc
        autoHighlight={true}
        tabIndex={3}
        className={classes.autocomplete}
        options={options ? options : []}
        disablePortal={true}
        // value={value}
        // menuIsOpen={true}
        onChange={onProximityChange}
        getOptionLabel={(option) => option.label || label}
        renderInput={(params) => <TextField placeholder="Search Within..." {...params} />}
        sx={{
          p: 0,
        }}
      />
    </>
  );
}
export function SearchTipsDialog(props){
  console.log('SearchTipsDialog props', props);
  return (
    <Dialog open={props.isOpen} onClose={props.onDialogClose}>
    <Grid container={true} spacing={1}>
            <Grid item={true} xs={11} flexDirection="row" flexWrap={'nowrap'} alignItems={'center'} alignContent={'center'} justifyContent={'center'} >
              <Box paddingLeft={2}><Typography fontSize={'large'} fontWeight={'bold'}>Search word Connectors</Typography></Box>
            </Grid>
            {/* <Grid item={true} xs={1} justifyContent={'center'}>
              <IconButton onClick={onDialogClose}><Typography fontSize={'medium'}>X</Typography></IconButton>
            </Grid> */}
          </Grid>
          <Grid container={true} spacing={1}>
            <Grid item={true} xs={11}>
              <b>Search Word Connectors</b>
            </Grid>
            <Grid item={true} xs={1}>
              X
            </Grid>
          </Grid>
      <DialogContent>
      
        <DialogContentText>
        <Grid container={true} spacing={1}>
            <Grid item={true} xs={2}>
              <b>AND</b>
            </Grid>
            <Grid item={true} xs={10}>
              This is the default. <b>all</b> words you enter must be found together to return a
              result.
            </Grid>
          </Grid>
          <Grid container={true} spacing={1}>
            <Grid item={true} xs={2}>
              <b>AND</b>
            </Grid>
            <Grid item={true} xs={10}>
              This is the default. <b>all</b> words you enter must be found together to return a
              result.
            </Grid>
          </Grid>
          <Grid container={true} spacing={1}>
            <Grid item={true} xs={2}>
              <b>OR</b>
            </Grid>
            <Grid item={true} xs={10}>
              (all caps) to search for <b>any</b> of those words.
            </Grid>
          </Grid>
          <Grid container={true} spacing={1}>
            <Grid item={true} xs={2}>
              <b>NOT</b>
            </Grid>
            <Grid item={true} xs={10}>
              (all caps) to search to <b>exclude</b>words or a phrase.
            </Grid>
          </Grid>
          <Grid container={true} spacing={1}>
            <Grid item={true} xs={2}>
              <b>{'" "'}</b>
            </Grid>
            <Grid item={true} xs={10}>
              Surround words with quotes (" ") to search for an exact phrase.
            </Grid>
          </Grid>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  ) 
}
// #endregion