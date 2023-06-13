import React, { useState, useEffect } from 'react';
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
 
  
} from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

import { styled } from '@mui/material/styles';
import theme from '../../styles/theme';
//import Grid from '@mui/material/Grid'; // Grid version 1
import Grid from '@mui/material/Unstable_Grid2';
import { InputAdornment, SearchOutlined } from '@mui/icons-material';
import SearchFilter from './SearchFilter';
import { makeStyles } from '@mui/styles';
import Globals from '../../globals';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
const _ = require('lodash');

export default function SideBarFilters(props) {
  console.log('SideBarFilters props', props);
  const {proximityOptions, actionOptions, decisionOptions,searchOptions, agencyOptions, countyOptions, stateOptions} = props;
  const [searchState, setSearchState] = useState({
    action: [],
    actionRaw: '',
    agency: [],
    agencyRaw: '',
    agencyRaw: [],
    cooperatingAgency: [],
    cooperatingAgencyRaw: [],
    county: [],
    countyRaw: '',
    countyRaw: [],
    decision: '',
    decisionRaw: '',
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
    searchOptions: searchOptions,
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
  });
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
      proximityOption : null,
      inputMessage : ''
    });
    inputSearch.focus();
    // debouncedSuggest();
  };

  const onClearFiltersClick = () => {
    setSearchState(
      ...searchState,{
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
    setSearchState(...searchState,{ [evt.target.name]: evt.target.value }, () => {
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
    setSearchState(...searchState,{
      markup: checked,
    });
  };

  const onInput = (evt) => {
    let userInput = evt.target.value;

    let proximityValues = handleProximityValues(userInput);

    //get the evt.target.name (defined by name= in input)
    //and use it to target the key on our `state` object with the same name, using bracket syntax
    setSearchState(...searchState,
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
    setSearchState(...searchState,{
      fragmentSizeValue: evt.value,
      fragmentSize: evt,
    });
  };

  const onAgencyChange = (evt) => {
    var agencyLabels = [];
    for (var i = 0; i < evt.length; i++) {
      agencyLabels.push(evt[i].label.replace(/ \([A-Z]*\)/gi, ''));
    }

    setSearchState(...searchState,
      {
        agency: agencyLabels,
        agencyRaw: evt,
      },
      () => {
        filterBy(searchState);
      },
    );
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
    setSearchState(...searchState,
      {
        filtersHidden: !filtersHidden,
      },
      () => {
        props.filterToggle(filtersHidden);
      },
    );
  };

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

  const Item = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    // textAlign: 'center',
    color: theme.palette.text.secondary,
    elevation: 0,
    border: 0,
    borderRadius: 0,
    mt: 2,
    mb: 2,
    pl: 0,
    pr: 0,
    '&:hover': {
      //           backgroundColor: //theme.palette.grey[200],
      boxShadow: '0px 4px 8px rgba(0.5, 0.5, 0.5, 0.15)',
      cursor: 'pointer',
      '& .addIcon': {
        color: 'purple',
      },
    },
  }));
  const useStyles = makeStyles((theme) => ({
    formControl: {},
  }));

  const classes = useStyles(theme);
  console.log('SearchState', searchState);
  let { proximityDisabled,proximityOptionValue,markup, agencyRaw,stateRaw,county,actionRaw,typeFinal,typeDraft,typeEA,typeNOI,typeROD,typeScoping,typeOther,needsComments,needsDocument} = searchState;
  console.log('proximityDisabled',proximityDisabled,'markup',markup);
  return (
    <>
      <Item alignItems="center">
        <Box marginBottom={0}>
          <FormControlLabel
            control={<Checkbox checked={searchOptions} onChange={onTitleOnlyChecked} />}
            label="Has downloadable items"
          />
        </Box>
        <FormControlLabel
          control={<Checkbox checked={markup} onChange={onMarkupChange} />}
          label="Search only within titles"
        />
      </Item>
      <Item>
        <SearchFilter
          filter={{
            className: classes.formControl,
            placeholder: 'Find within',
            variant: 'standard',
            id: 'proximity-select',
            className: proximityDisabled ? ' disabled' : '',
            // classNamePrefix="react-select control"
            placeholder: 'Keyword distance',
            options: proximityOptions,
            // menuIsOpen={true}
            onChange: onProximityChange,
            label: 'Distance between search terms',
            tabIndex: '1',
          }}
        />
      </Item>

      <Item>
        <SearchFilter
          filter={{
            className: classes.formControl,
            placeholder: 'Type or Select Lead Agencies',
            value: agencyRaw ? agencyRaw : '',
            onChange: onAgencyChange,
            id: 'searchAgency',
            type: Autocomplete,
            options: agencyOptions,
            label: 'Lead Agencies',
            tabIndex: '3',
          }}
        />
      </Item>
      <Item>
        <SearchFilter
          filter={{
            className: classes.formControl,
            placeholder: 'Type or select Cooperating agencies',
            value: agencyRaw ? agencyRaw : '',
            onChange: onAgencyChange,
            id: 'searchAgency',
            name: 'cooperatingAgency',
            type: Autocomplete,
            options: agencyOptions,
            label: 'Cooperating Agencies',
            tabIndex: '4',
          }}
        />
      </Item>
      <Divider />
      <Item>
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
      </Item>

      <Item>
        <SearchFilter
          filter={{
            className: classes.formControl,
            placeholder: 'Type or Select a County',
            value: countyOptions.filter((countyObj) => county.includes(countyObj.value)),
            onChange: onCountyChange,
            id: 'searchCounty',
            name: 'county',
            type: Autocomplete,
            options: countyOptions,
            label: 'County / counties',
            tabIndex: '6',
          }}
        />
      </Item>
      <Divider />
      <Item>
        <Typography pb={1} variant="filterLabel">
          Date Range:
        </Typography>
        <Box display={'flex'} xs={12} flexDirection={'column'} border={0} padding={0} margin={0} width={'100%'}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box marginBottom={2} components={['DatePicker']} padding={0} width="100%">
              <DatePicker onChange={onStartDateChange} id="date-picker-from" label="From:" />
            </Box>
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box components={['DatePicker']} padding={0} width="100%">
              <DatePicker on={onEndDateChange} id="date-picker-to" label="To:" />
            </Box>
          </LocalizationProvider>
        </Box>
      </Item>
    </>
  );
}
