import axios from "axios";
import React from "react";

//import DatePicker from "react-datepicker";
//import Select from 'react-select';

import "../css/tabulator.css";
import "../sidebar.css";
import "../survey.css";
import "./search.css";

import "react-datepicker/dist/react-datepicker.css";
import "tippy.js/dist/tippy.css"; // optional
import SearchDatePickers from "./SearchDatePickers";
import Globals from "../globals.js";
import persist from "../persist.js";
import { SearchOutlined } from "@mui/icons-material";
import {
    Autocomplete,
  Box,
  Divider,
  Grid,
  Hidden,
  IconButton,
  ListItem,
  Paper,
  Select,
  TextField,
  Typography,
  Input
} from "@mui/material";
import { withRouter } from "react-router";
import SearchContext from "./SearchContext.js";
import SearchResultOptions from "./SearchResultOptions.jsx";
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { styled } from '@mui/material/styles';
import theme from '../styles/theme';
//import Grid from '@mui/material/Grid'; // Grid version 1
import { makeStyles } from '@mui/styles';

import { agencyOptions, proximityOptions,actionOptions,decisionOptions,countyOptions } from './options';

const useStyles = makeStyles((theme) => ({
    formControl: {},
  }));
  const counties = Globals.counties;

// import PropTypes from "prop-types";

const _ = require("lodash");

const FULLSTYLE = {
  display: "block",
  margin: "0 auto",
  width: "80%",
  minWidth: "20%",
  maxWidth: "100%",
  marginBottom: "20px",
  border: "2px solid rgba(218, 218, 218, 1)",
  background: "rgba(240, 239, 237, 1)",
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

class Search extends React.Component {
  static contextType = SearchContext;
  _lastSearchTerms = "";

  // static propTypes = {
  // match: PropTypes.object.isRequired,
  // location: PropTypes.object.isRequired,
  // history: PropTypes.object.isRequired
  // };

  constructor(props) {
    super(props);
    console.log(
      "🚀 ~ file: Search.js:49 ~ Search ~ constructor ~ props:",
      props
    );
    this.state = {
      titleRaw: "",
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
      iconClassName: "icon icon--effect",
      limit: 100,
      offset: 0,
      searchOption: "B",
      test: Globals.anEnum.options,
      tooltipOpen: undefined,
      proximityOption: null,
      proximityDisabled: true,
      hideOrganization: true,
      markup: true,
      fragmentSizeValue: 2,
      isDirty: false,
      surveyChecked: true,
      surveyDone: true,
      surveyResult: "Haven't searched yet",
      filtersHidden: false,

      countyOptions: Globals.counties,
    };
    this.debouncedSearch = _.debounce(this.props.search, 300);
    this.filterBy = this.props.filterResultsBy;
    // this.filterBy = _.debounce(this.props.filterResultsBy, 200);

    this.debouncedSuggest = _.debounce(this.props.suggest, 300);

    this.myRef = React.createRef();
  }

  doSearch = (terms) => {
    this._lastSearchTerms = terms;
    this.setState(
      {
        titleRaw: parseTerms(terms),
        lastSearchedTerm: parseTerms(terms),
        surveyChecked: false,
        surveyDone: false,
        isDirty: true,
      },
      () => {
        this.debouncedSearch(this.state);
      }
    );
  };

  doSearchFromParams = () => {
    // console.log("Stored terms", this._lastSearchTerms);
    // console.log("State.", this.state);

    var queryString = Globals.getParameterByName("q");
    if (!this.props.count && (queryString === null || queryString === "")) {
      // No query param/blank terms: Launch no-term search - Only if we have no results saved here already
      // console.log("No query parameters, doing blank search.", this.props.count);
      this.doSearch("");
    } else if (queryString) {
      // Query terms: Handle proximity dropdown logic, launch search
      let proximityValues = this.handleProximityValues(queryString);

      this._lastSearchTerms = queryString;
      this.setState(
        {
          titleRaw: parseTerms(queryString),
          proximityDisabled: proximityValues.disableValue,
          surveyChecked: false,
          surveyDone: false,
          isDirty: true,
          inputMessage: proximityValues._inputMessage,
        },
        () => {
          if (this.state.titleRaw) {
            // console.log("Firing search with query param");
            this.debouncedSearch(this.state);
          }
        }
      );
    }
  };

  handleProximityValues = (string) => {
    let valuesResult = { _inputMessage: "", disableValue: true };

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
      valuesResult._inputMessage = "";
      valuesResult.disableValue = false;
    }

    return valuesResult;
  };

  /**
   * Event handlers
   */

  onIconClick = (evt) => {
    this.doSearch(this.state.titleRaw);
  };
  /** clears and disables proximity search option as well as clearing text */
  onClearClick = (evt) => {
    this.setState(
      {
        titleRaw: "",
        proximityDisabled: true,
        proximityOption: null,
        inputMessage: "",
      },
      () => {
        this.inputSearch.focus();
        // this.debouncedSuggest();
      }
    );
  };

  onClearFiltersClick = () => {
    this.setState(
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
        this.filterBy(this.state);
      }
    );
  };

  onRadioChange = (evt) => {
    this.setState({ [evt.target.name]: evt.target.value }, () => {
      // this.debouncedSearch(this.state);
    });
  };

  onKeyUp = (evt) => {
    if (evt.keyCode === 13) {
      evt.preventDefault();
      this.doSearch(this.state.titleRaw);
    }
  };
  /** For some reason, without this, calendars stay open after tabbing past them.
   *  (This is opposite to how react-datepicker's default behavior is described.) */
  onKeyDown = (e) => {
    if (e.key === "Tab") {
      if (this.datePickerStart) {
        this.datePickerStart.setOpen(false);
      }
      if (this.datePickerEnd) {
        this.datePickerEnd.setOpen(false);
      }
    }
  };

  onMarkupChange = (evt) => {
    let checked = evt.target.checked;
    this.setState({
      markup: checked,
    });
  };

  onInput = (evt) => {
    let userInput = evt.target.value;

    let proximityValues = this.handleProximityValues(userInput);

    //get the evt.target.name (defined by name= in Input)
    //and use it to target the key on our `state` object with the same name, using bracket syntax
    this.setState(
      {
        [evt.target.name]: userInput,
        proximityDisabled: proximityValues.disableValue,
        inputMessage: proximityValues._inputMessage,
      },
      () => {
        // auto-searching is currently too expensive until asynchronous results
        // this.debouncedSearch(this.state);
        // autocomplete/suggest/other functionality fires, starting here
        // TODO: May want to take out any special characters that never appear in titles or are otherwise unnecessary
        // this.debouncedSuggest(this.state.titleRaw);
      }
    );
  };

  // suppress warning that there's no onChange event, handler (despite onChange rarely being the best event to take advantage of)
  onChangeHandler = (evt) => {
    // do nothing
  };

  geoFilter = (geodata) => {
    // console.log(geodata.name, geodata.abbrev);
    if (geodata.geoType === Globals.geoType.STATE) {
      // Assuming Search and SearchResultsMap talk to each other, we'll want two-way interaction.
      // So if it's sending us a state, we may want to enable or disable it.
      const indexIfExists = this.state.state.indexOf(geodata.abbrev);
      let _stateRaw = this.state.stateRaw;
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
        this.onLocationChange(_stateRaw);
      }
    } else if (geodata.geoType === Globals.geoType.COUNTY) {
      const indexIfExists = this.state.county.indexOf(geodata.abbrev);
      let _countyRaw = this.state.countyRaw;
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
        this.onCountyChange(_countyRaw);
      }
    } else {
      // do nothing: filter has no supported functionality for "other" polygons
    }
  };

  onFragmentSizeChange = (evt) => {
    console.log("Val", evt.value);
    this.setState({
      fragmentSizeValue: evt.value,
      fragmentSize: evt,
    });
  };

  onAgencyChange = (evt) => {
    var agencyLabels = [];
    for (var i = 0; i < evt.length; i++) {
      agencyLabels.push(evt[i].label.replace(/ \([A-Z]*\)/gi, ""));
    }
    // this.setState(prevState => {
    //     let inputs = { ...prevState.inputs };  // creating copy of state variable inputs
    //     inputs.agency = agencyLabels;                     // update the name property, assign a new value
    //     return { inputs };                                 // return new object inputs object
    // }, () =>{
    //     this.debouncedSearch(this.state.inputs);
    // });
    this.setState(
      {
        agency: agencyLabels,
        agencyRaw: evt,
      },
      () => {
        this.filterBy(this.state);
      }
    );
  };
  onCooperatingAgencyChange = (evt) => {
    var agencyLabels = [];
    for (var i = 0; i < evt.length; i++) {
      agencyLabels.push(evt[i].label.replace(/ \([A-Z]*\)/gi, ""));
    }
    this.setState(
      {
        cooperatingAgency: agencyLabels,
        cooperatingAgencyRaw: evt,
      },
      () => {
        this.filterBy(this.state);
      }
    );
  };
  onActionChange = (evt) => {
    var actionLabels = [];
    for (var i = 0; i < evt.length; i++) {
      actionLabels.push(evt[i].label.replace(/ \([A-Z]*\)/gi, ""));
    }
    this.setState(
      {
        action: actionLabels,
        actionRaw: evt,
      },
      () => {
        this.filterBy(this.state);
      }
    );
  };
  onDecisionChange = (evt) => {
    var decisionLabels = [];
    for (var i = 0; i < evt.length; i++) {
      decisionLabels.push(evt[i].label.replace(/ \([A-Z]*\)/gi, ""));
    }
    this.setState(
      {
        decision: decisionLabels,
        decisionRaw: evt,
      },
      () => {
        this.filterBy(this.state);
      }
    );
  };
  onLocationChange = (evt, item) => {
    var stateValues = [];
    for (var i = 0; i < evt.length; i++) {
      stateValues.push(evt[i].value);
    }

    this.setState(
      {
        state: stateValues,
        stateRaw: evt,
        countyOptions: this.narrowCountyOptions(stateValues),
      },
      () => {
        // this.filterBy(this.state);
        // Purge invalid counties, which will then run filterBy
        this.onCountyChange(
          this.state.countyOptions.filter((countyObj) =>
            this.state.county.includes(countyObj.value)
          )
        );
      }
    );
  };
  /** Helper method for onLocationChange limits county options to selected states in filter,
   * or resets to all counties if no states selected */
  narrowCountyOptions = (stateValues) => {
    /** Filter logic for county array of specific label/value format given array of state abbreviations  */
    function countyFilter(_stateValues) {
      return function (a) {
        let returnValue = false;
        _stateValues.forEach((item) => {
          if (a.label.split(":")[0] === item) {
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
  onCountyChange = (evt, item) => {
    var countyValues = [];
    for (var i = 0; i < evt.length; i++) {
      countyValues.push(evt[i].value);
    }

    this.setState(
      {
        county: countyValues,
        countyRaw: evt,
      },
      () => {
        this.filterBy(this.state);
      }
    );
  };
  onProximityChange = (evt) => {
    if (evt.value === -1) {
      this.setState({
        proximityOption: null,
      });
    } else {
      this.setState(
        {
          proximityOption: evt,
        },
        () => {
          // console.log(this.state.proximityOption);
        }
      );
    }
  };

  onTitleOnlyChecked = (evt) => {
    if (evt.target.checked) {
      this.setState({
        searchOption: "C", // Title only
      });
    } else {
      this.setState({
        searchOption: "B", // Both fields, Lucene default scoring
      });
    }
  };

  getSearchBarText = () => {
    if (this.state.searchOption && this.state.searchOption === "C") {
      // title only
      return "Search titles of NEPA documents";
    } else {
      return "Search full texts and titles of NEPA documents";
    }
  };

  onUseOptionsChecked = (evt) => {
    this.props.optionsChanged(evt.target.checked);
  };

  onNeedsDocumentChecked = (evt) => {
    this.setState(
      {
        needsDocument: !this.state.needsDocument,
      },
      () => {
        this.filterBy(this.state);
      }
    );
  };

  onTypeChecked = (evt) => {
    if (evt.target.name === "optionsChecked") {
      this.setState({
        [evt.target.name]: evt.target.checked,
      });
    } else if (evt.target.name === "typeAll" && evt.target.checked) {
      // All: Check all, uncheck others
      this.setState(
        {
          typeAll: true,
          typeFinal: false,
          typeDraft: false,
          typeOther: false,
        },
        () => {
          this.filterBy(this.state);
          /**this.debouncedSearch(this.state);*/
        }
      );
    } else {
      // Not all: Check target, uncheck all
      this.setState(
        {
          [evt.target.name]: evt.target.checked,
          typeAll: false,
        },
        () => {
          this.filterBy(this.state);
          // this.debouncedSearch(this.state);
        }
      );
    }
  };

  // onChecked = (evt) => {
  //     this.setState( { [evt.target.name]: evt.target.checked}, () => { this.debouncedSearch(this.state); });
  // }

  onStartDateChange = (date) => {
    this.setState({ startPublish: date }, () => {
      this.filterBy(this.state);
      // this.debouncedSearch(this.state);
    });
  };
  // Tried quite a bit but I can't force the calendar to Dec 31 of a year as it's typed in without editing the library code itself.
  // I can change the value but the popper state won't update to reflect it (even when I force it to update).
  onEndDateChange = (date, evt) => {
    // should be true at 4 digits e.g. user typed in a year
    // if(evt && evt.target && evt.target.value && /^\d{4}$/.test(evt.target.value)) {
    //     // TODO: Is there a way to change the month/day focused without filling in those text values?
    //     // Goal is to focus Dec 31 of year instead of Jan 1 (defaults to 01 01 if nothing provided)
    //     console.log(new Date('12 31 ' + evt.target.value));
    //     console.log(this.datePickerEnd);
    //     this.datePickerEnd.value = new Date('12 31 ' + evt.target.value);
    //     this.datePickerEnd.state.preSelection = new Date('12 31 ' + evt.target.value);
    //     this.datePickerEnd.calendar.instanceRef.state.date = new Date('12 31 ' + evt.target.value);
    //     this.datePickerEnd.forceUpdate();

    //     this.setState( { endPublish: new Date('12 31 ' + evt.target.value) }, () => {
    //         this.datePickerEnd.value = this.state.endPublish;
    //         this.filterBy(this.state);
    //         console.log(this.state.endPublish);
    //         this.datePickerEnd.forceUpdate();
    //         // this.debouncedSearch(this.state);
    //     });
    // } else {

    this.setState({ endPublish: date }, () => {
      this.filterBy(this.state);
      // this.debouncedSearch(this.state);
    });
    // }
  };
  onStartCommentChange = (date) => {
    this.setState({ startComment: date }, () => {
      this.filterBy(this.state);
      // this.debouncedSearch(this.state);
    });
  };
  onEndCommentChange = (date) => {
    this.setState({ endComment: date }, () => {
      this.filterBy(this.state);
      // this.debouncedSearch(this.state);
    });
  };
  tooltipTrigger = (evt) => {
    this.setState({ tooltipOpen: !this.state.tooltipOpen });
  };
  closeTooltip = () => {
    this.setState({
      tooltipOpen: false,
    });
  };

  getCounts = () => {
    this.get("stats/earliest_year", "firstYear");
    this.get("stats/latest_year", "lastYear");
    this.get("stats/eis_count", "EISCount");
  };
  get = (url, stateName) => {
    const _url = new URL(url, Globals.currentHost);
    axios({
      url: _url,
      method: "GET",
      data: {},
    })
      .then((_response) => {
        const rsp = _response.data;
        this.setState({ [stateName]: rsp });
      })
      .catch((error) => {});
  };

  /** Helps getSuggestions() by returning clickable link to details page for given suggestion, which opens a new tab */
  getSuggestion = (suggestion, idx) => {
    let _href = "record-details?id=";
    if (suggestion.isProcess) {
      _href = "process-details?id=";
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
  getSuggestions = () => {
    if (this.props.lookupResult && this.props.lookupResult[0]) {
      return (
        <div className="suggestion-holder">
          <span className="block">Sample titles:</span>
          {this.props.lookupResult.map((result, i) => {
            return this.getSuggestion(result, i);
          })}
        </div>
      );
    }
  };

  filtersActive = () => {
    if (
      this.state.startPublish ||
      this.state.endPublish ||
      this.state.startComment ||
      this.state.endComment ||
      this.state.agency.length > 0 ||
      this.state.cooperatingAgency.length > 0 ||
      this.state.state.length > 0 ||
      this.state.county.length > 0 ||
      this.state.decision.length > 0 ||
      this.state.action.length > 0 ||
      this.state.typeFinal ||
      this.state.typeDraft ||
      this.state.typeEA ||
      this.state.typeNOI ||
      this.state.typeROD ||
      this.state.typeScoping ||
      this.state.typeOther ||
      this.state.needsComments ||
      this.state.needsDocument
    ) {
      return true;
    }
  };

  toggleFiltersHidden = () => {
    this.setState(
      {
        filtersHidden: !this.state.filtersHidden,
      },
      () => {
        this.props.filterToggle(this.state.filtersHidden);
      }
    );
  };

  renderClearFiltersButton = () => {
    if (this.filtersActive()) {
      return (
        <div
          className={
            this.state.filtersHidden === false
              ? "margin height-30 right"
              : "clear-filters-hidden"
          }
        >
          <span
            id="clear-filters"
            className="link"
            onClick={() => this.onClearFiltersClick()}
          >
            Clear filters
          </span>
        </div>
      );
    }
  };

  render() {
    // const { history } = this.props;
    const { state } = this.state;
    const customStyles = {
      option: (styles, state) => ({
        ...styles,
        borderBottom: "1px dotted",
        backgroundColor: "white",
        color: "black",
        "&:hover": {
          backgroundColor: "#348ECF",
        },
        // ':active': {
        //     ...styles[':active'],
        //     backgroundColor: !isDisabled && (isSelected ? data.color : color.alpha(0.3).css()),
        //   },
        //   padding: 20,
      }),
      control: (styles) => ({
        ...styles,
        backgroundColor: "white",
      }),
    };

    // original data has some abbreviation-only/incorrect/missing entries (ARD, FirstNet, NGB, URC?)
    // { value: 'ARD', label: 'ARD' }
    const stateOptions = Globals.locations;    
    //        const {state} = this.context
    const value = {
      state: this.state,
      setState: this.setState,
    };
    return (
      <SearchContext.Provider value={value}>
        <Paper marginTop={"150px"} border={1}>
          <h2>Start Search.js Header</h2>
          <Grid
            id="search-text-grid-container"
            display={"flex-root"}
            alignItems={"center"}
            container={true}
            layout={"row"}
            spacing={1}
            border={0}
            borderColor="darkgray"
          >
            <Hidden mdDown>
              <Grid item xs={12} md={2}>
                <Box
                  id="search-text-grid-item"
                  // backgroundColor="transparent"
                  height={115}
                  borderRadius={0}
                  borderRight={0}
                  borderColor={"#CCC"}
                >
                  <ListItem onClick={this.toggleSearchTipsDialog}>
                    <a href="#">Search Tips</a>
                  </ListItem>
                  <ListItem onClick={this.toggleAvailableFilesDialog}>
                    <a href="#">Available Files</a>
                  </ListItem>
                  <ListItem onClick={this.toggleQuickStartDialog}>
                    <a href="#">Quick-start guide</a>
                  </ListItem>
                </Box>
              </Grid>
            </Hidden>

            <Grid container flex={1}>
              <Grid
                item
                xs={12}
                border={0}
                borderColor={"#DDD"}
                md={12}
                borderLeft={0}
                marginTop={2}
                id="search-box-grid-item"
              >
                <Box
                  id="search-box-box-item"
                  display={"flex"}
                  justifyContent={"center"}
                  justifyItems={"center"}
                  alignItems={"center"}
                  alignContent={"center"}
                  height={60}
                  paddingLeft={0}
                  paddingRight={2}
                  padding={0}
                  elevation={1}
                  borderRadius={0}
                  border={0}
                  borderColor={"#CCC"}
                  borderLeft={0}
                  marginLeft={0}
                  marginRight={0}
                >
                  {" "}
                  <TextField
                    fullWidth
                    backgroundColor={"white"}
                    id="main-search-text-field"
                    name="titleRaw"
                    variant="outlined"
                    // focused
                    // onInput={onInput}
                    // onKeyUp={onKeyUp}
                    // onKeyDown={onKeyDown}
                    placeholder="Search for NEPA documents"
                    value={this.state.titleRaw ? this.state.titleRaw : ""}
                    autoFocus
                    InputProps={{
                      endAdornment: (
                        <IconButton
                          name="titleRaw"
                          value={this.state.titleRaw ? this.state.titleRaw : ""}
                          onClick={this.onIconClick}
                        >
                          <SearchOutlined />
                        </IconButton>
                      ),
                    }}
                  />
                </Box>
              </Grid>
              <Grid
                item
                xs={12}
                md={12}
                borderLeft={0}
                id="search-box-result-options-container"
              >
                <SearchResultOptions />
              </Grid>
            </Grid>
          </Grid>
          {/* Old Header Content */}
          {/* <div className="content" onSubmit={this.submitHandler}>
                    {this.props.parseError}              
                    <div className="search-holder" >
                        
                        <div className="search-bar-holder">
                            <h1 className="search-header-2">{this.getSearchBarText()}</h1>
    
                            <div className="pre-Input-bar">
                                <div id="tooltip4Container">
                                    <div>
                                        Search Tips
                                        <TippySearchTips />
                                    </div>
                                    <div>
                                        <Tippy className="tippy-tooltip--small searchTips" trigger='manual click' 
                                            hideOnClick={true}
                                            interactive={true}
                                            placement="bottom"
                                            content={
                                                <div>
                                                    <b>Totals</b>
                                                    Currently the site contains <b>{this.state.EISCount}</b> Draft or Final Environmental Impact Statements 
                                                    from: <b>{this.state.firstYear}-{this.state.lastYear}</b>. 
                                                    More files are being added continuously.
                                                    <div className="text-center margin-top">
                                                        <a href="available-documents" target="_blank" rel="noopener noreferrer">Available files</a>
                                                    </div>
                                                </div>}
                                            >
                                            {<span className={"side-link inline"}>
                                                Available files
                                            </span>}
                                        </Tippy>
                                    </div>
                                    
                                    <SlidesIframe />
                                </div>
                            </div>
    
                            <span id="search-proximity">
                                <Select 
                                    id="proximity-select"
                                    className={this.state.proximityDisabled ? " disabled" : ""}
                                    classNamePrefix="react-select control"
                                    placeholder="Find within..."
                                    options={proximityOptions} 
                                    value={this.state.proximityOption}
                                    // menuIsOpen={true}
                                    onChange={this.onProximityChange} 
                                    isMulti={false} />
                            </span>
                            <Input id="main-search-bar"
                                ref={(Input) => { this.inputSearch = Input; }}
                                className="search-bar" 
                                name="titleRaw" 
                                placeholder="Enter search terms (or leave blank to get all results)" 
                                tabIndex="1"
                                value={this.state.titleRaw}
                                autoFocus 
                                onChange={this.onChangeHandler}
                                onInput={this.onInput} onKeyUp={this.onKeyUp}
                            />
                            <svg id="main-search-icon"  onClick={this.onIconClick} className="search-icon" width="39" height="38" viewBox="0 0 39 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M26.4582 24.1397H28.2356L37.7751 33.3063C38.6976 34.1886 38.6976 35.6303 37.7751 36.5125C36.8526 37.3947 35.3452 37.3947 34.4228 36.5125L24.8607 27.3674V25.6675L24.2533 25.065C21.1034 27.6471 16.8061 28.9813 12.2388 28.2496C5.98416 27.2383 0.989399 22.2462 0.224437 16.2212C-0.945506 7.11911 7.0641 -0.541243 16.5811 0.577685C22.8808 1.30929 28.1006 6.08626 29.158 12.0682C29.923 16.4363 28.5281 20.5463 25.8282 23.5588L26.4582 24.1397ZM4.61171 14.4567C4.61171 19.8146 9.13399 24.1397 14.7362 24.1397C20.3384 24.1397 24.8607 19.8146 24.8607 14.4567C24.8607 9.09875 20.3384 4.77366 14.7362 4.77366C9.13399 4.77366 4.61171 9.09875 4.61171 14.4567Z" fill="black" fillOpacity="0.54"/>
                            </svg>
                            <svg id="main-search-clear" onClick={this.onClearClick} className="cancel-icon" width="24" height="24" viewBox="0 0 24 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path className="circle" d="M12.2689 1.92334C5.63289 1.92334 0.26889 7.28734 0.26889 13.9233C0.26889 20.5593 5.63289 25.9233 12.2689 25.9233C18.9049 25.9233 24.2689 20.5593 24.2689 13.9233C24.2689 7.28734 18.9049 1.92334 12.2689 1.92334Z" fill="#DADADA"
                                />
                                <path d="M17.4289 19.0834C16.9609 19.5514 16.2049 19.5514 15.7369 19.0834L12.2689 15.6154L8.80089 19.0834C8.33289 19.5514 7.57689 19.5514 7.10889 19.0834C6.88418 18.8592 6.7579 18.5548 6.7579 18.2374C6.7579 17.9199 6.88418 17.6155 7.10889 17.3914L10.5769 13.9234L7.10889 10.4554C6.88418 10.2312 6.7579 9.92677 6.7579 9.60935C6.7579 9.29193 6.88418 8.98755 7.10889 8.76335C7.57689 8.29535 8.33289 8.29535 8.80089 8.76335L12.2689 12.2314L15.7369 8.76335C16.2049 8.29535 16.9609 8.29535 17.4289 8.76335C17.8969 9.23135 17.8969 9.98735 17.4289 10.4554L13.9609 13.9234L17.4289 17.3914C17.8849 17.8474 17.8849 18.6154 17.4289 19.0834Z" fill="#737272"/>
                            </svg>
                            <div className="Input-bar-2">
                                <div className="Input-bar-left">
                                    <Input id="check1" className="pre-search-Input" type="checkbox" 
                                            checked={this.state.searchOption==="C"}
                                            onChange={this.onTitleOnlyChecked}
                                    />
                                    <label className="sidebar-check-label no-select" htmlFor="check1">
                                        Search only within titles
                                    </label>
                                </div>
                                <div className="surveyHolder" hidden={this.state.surveyChecked}>
                                    Did you find what you were looking for?
                                    <div className="radio-holder">
                                        <label className="surveyRadio" ><Input type="radio" value="Yes" checked={false} onChange={this.surveyClick} />
                                            Yes
                                        </label>
                                        <label className="surveyRadio" ><Input type="radio" value="Partially" checked={false} onChange={this.surveyClick} />
                                            Partially
                                        </label>
                                        <label className="surveyRadio" ><Input type="radio" value="No" checked={false} onChange={this.surveyClick} />
                                            No
                                        </label>
                                    </div>
                                </div>
                                <div className="surveyHolder" hidden={!this.state.surveyChecked || this.state.surveyDone}>
                                    <label className="surveyResult">You chose: <span>{this.state.surveyResult}</span></label>
                                    <button className="surveyButton" onClick={this.revert}>Show me the options again</button>
                                    <button className="surveyButton" onClick={this.surveySubmit}>Submit</button>
                                </div>
                                <div hidden={!this.state.surveyDone || !this.state.isDirty}>
                                    <div>Thank you for your feedback.</div>
                                </div>
                            </div>
                        </div>       
                    </div>
                </div> */}

          {this.getSuggestions()}
          <div className="loader-holder">
            {/* <div hidden={!this.props.networkError}>&nbsp;<span className="errorLabel">{this.props.networkError}</span></div> */}
            <div className="center" hidden={this.props.searching}>
              <span id="inputMessage">{this.state.inputMessage}</span>
            </div>
            {/* <div className="center" hidden={!this.props.searching}>Loaded text snippets for {this.props.count} results...</div> */}
            <div className="lds-ellipsis" hidden={!this.props.searching}>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>

          <div
            className="sidebar-filters"
            hidden={!this.state.filtersHidden}
            style={FULLSTYLE}
          >
            <span className="sidebar-header">
              Narrow your results
              <span
                className="filters-toggle"
                onClick={() => this.toggleFiltersHidden()}
              >
                +
              </span>
              {this.renderClearFiltersButton()}
            </span>
          </div>
          <div
            className="sidebar-filters"
            hidden={this.state.filtersHidden}
            // this would launch a new search on enter key, in some child inputs
            // onKeyUp={this.onKeyUp}
          >
            <b>Start Filters</b>
            <span className="sidebar-header">
              Narrow your results
              <span
                className="filters-toggle"
                onClick={() => this.toggleFiltersHidden()}
              >
                -
              </span>
            </span>

            <Divider />

            <div className="filter flex-1">
              <div className="checkbox-container-flex">
                <Input
                  type="checkbox"
                  name="needsDocument"
                  id="needsDocument"
                  className="sidebar-checkbox"
                  tabIndex="2"
                  checked={this.state.needsDocument}
                  onChange={this.onNeedsDocumentChecked}
                />
                <label
                  className="checkbox-text no-select cursor-pointer"
                  htmlFor="needsDocument"
                >
                  Has downloadable files
                </label>
              </div>

              {this.renderClearFiltersButton()}
            </div>

            <Divider />

            <div className="filter">
              <label className="sidebar-label" htmlFor="searchAgency">
                Lead agency or{" "}
                <span className="link" onClick={this.orgClick}>
                  agencies
                </span>
              </label>
              <Select
                id="searchAgency"
                className="multi"
                classNamePrefix="react-select"
                isMulti
                name="agency"
                isSearchable
                isClearable
                styles={customStyles}
                tabIndex="3"
                options={agencyOptions}
                onChange={this.onAgencyChange}
                value={this.state.agencyRaw}
                placeholder="Type or select agencies"
                // (temporarily) specify menuIsOpen={true} parameter to keep menu open to inspect elements.
                // menuIsOpen={true}
              />
            </div>
            <div className="filter">
              <label className="sidebar-label" htmlFor="searchAgency">
                Cooperating agencies
              </label>
              <Select
                id="searchAgency"
                className="multi"
                classNamePrefix="react-select"
                isMulti
                name="cooperatingAgency"
                isSearchable
                isClearable
                styles={customStyles}
                tabIndex="4"
                options={agencyOptions}
                onChange={this.onCooperatingAgencyChange}
                value={this.state.cooperatingAgencyRaw}
                placeholder="Type or select agencies"
                // (temporarily) specify menuIsOpen={true} parameter to keep menu open to inspect elements.
                // menuIsOpen={true}
              />
            </div>

            <div className="dropdown-group-end"></div>

            <div className="filter">
              <label className="sidebar-label" htmlFor="searchState">
                State(s) or location(s)
              </label>
              <Select
                id="searchState"
                className="multi"
                classNamePrefix="react-select"
                isMulti
                name="state"
                isSearchable
                isClearable
                styles={customStyles}
                tabIndex="5"
                options={stateOptions}
                onChange={this.onLocationChange}
                /** This filter logic is needed to work properly with interactive map */
                value={stateOptions.filter((stateObj) =>
                  this.state.state.includes(stateObj.value)
                )}
                placeholder="Type or select states"
              />
            </div>
            <div className="filter">
              <label className="sidebar-label" htmlFor="searchCounty">
                County/counties
              </label>
              <Select
                id="searchCounty"
                className="multi"
                classNamePrefix="react-select"
                isMulti
                name="county"
                isSearchable
                isClearable
                styles={customStyles}
                tabIndex="6"
                options={this.state.countyOptions}
                onChange={this.onCountyChange}
                /** This filter logic is needed to work properly with interactive map */
                value={this.state.countyOptions.filter((countyObj) =>
                  this.state.county.includes(countyObj.value)
                )}
                // value={this.state.countyRaw}
                placeholder="Type or select a county"
              />
            </div>

            <div hidden={!Globals.authorized()}>
              <div
                className="dropdown-group-end"
                hidden={!Globals.curatorOrHigher()}
              ></div>

              <div className="filter" hidden={!Globals.authorized()}>
                <label className="sidebar-label" htmlFor="searchAction">
                  Action Type
                  {/* <span className="new">New</span> */}
                </label>
                <Select
                  id="searchAction"
                  className="multi"
                  classNamePrefix="react-select"
                  isMulti
                  name="action"
                  isSearchable
                  isClearable
                  styles={customStyles}
                  tabIndex="7"
                  options={actionOptions}
                  onChange={this.onActionChange}
                  value={this.state.actionRaw}
                  placeholder="Type or select action type"
                />
              </div>
              <div className="filter" hidden={!Globals.authorized()}>
                <label className="sidebar-label" htmlFor="searchDecision">
                  Decision Type
                  {/* <span className="new">New</span> */}
                </label>
                <Select
                  id="searchDecision"
                  className="multi"
                  classNamePrefix="react-select"
                  isMulti
                  name="decision"
                  isSearchable
                  isClearable
                  styles={customStyles}
                  tabIndex="8"
                  options={decisionOptions}
                  onChange={this.onDecisionChange}
                  value={this.state.decisionRaw}
                  placeholder="Type or select decision"
                />
              </div>
            </div>

            <Divider />
            <Item>
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
          alignContent={'center'}
          justifyItems={'center'}
        >
          <SearchDatePickers onStartDateChange={this.onStartDateChange} onEndDateChange={this.onEndDateChange} startDate={this.state} endDate={Date.now - 1} />
        </Box>
      </Item>
            {/* <div className="filter">
              <label className="sidebar-label-date" htmlFor="dates">
                Date Range:
              </label>
              <div className="sidebar-dates">
                <span className="sidebar-date-text">From</span>
                <DatePicker
                  ref={(ref) => (this.datePickerStart = ref)}
                  selected={this.state.startPublish}
                  onChange={this.onStartDateChange}
                  onKeyDown={this.onKeyDown}
                  dateFormat="yyyy-MM-dd"
                  placeholderText="YYYY-MM-DD"
                  className="sidebar-date"
                  showMonthDropdown={true}
                  showYearDropdown={true}
                  adjustDateOnChange
                  tabIndex="9"
                  popperPlacement="right"
                  isClearable
                  // preventOpenOnFocus={true}
                />
                <span className="sidebar-date-text">To</span>
                <DatePicker
                  ref={(ref) => (this.datePickerEnd = ref)}
                  selected={this.state.endPublish}
                  onChange={this.onEndDateChange}
                  onKeyDown={this.onKeyDown}
                  dateFormat="yyyy-MM-dd"
                  placeholderText="YYYY-MM-DD"
                  className="sidebar-date"
                  showMonthDropdown={true}
                  showYearDropdown={true}
                  adjustDateOnChange
                  tabIndex="10"
                  popperPlacement="right"
                  isClearable
                  // preventOpenOnFocus={true}
                  // openToDate={new Date('12 31 2021')}
                />
              </div>
            </div> */}

            <Divider />

            <div className="filter">
              <label className="sidebar-label-date">Document Type</label>
              <div className="sidebar-checkboxes">
                <div className="checkbox-container">
                  <label className="clickable checkbox-text">
                    <Input
                      type="checkbox"
                      name="typeDraft"
                      className="sidebar-checkbox"
                      tabIndex="11"
                      checked={this.state.typeDraft}
                      onChange={this.onTypeChecked}
                    />
                    <span className="checkbox-text">
                      Draft EIS <i>{this.props.draftCount}</i>
                    </span>
                  </label>
                </div>
                <div className="checkbox-container">
                  <label className="clickable checkbox-text">
                    <Input
                      type="checkbox"
                      name="typeFinal"
                      className="sidebar-checkbox"
                      tabIndex="12"
                      checked={this.state.typeFinal}
                      onChange={this.onTypeChecked}
                    />
                    <span className="checkbox-text">
                      Final EIS <i>{this.props.finalCount}</i>
                    </span>
                  </label>
                </div>
                <div className="checkbox-container">
                  <label className="clickable checkbox-text">
                    <Input
                      type="checkbox"
                      name="typeEA"
                      className="sidebar-checkbox"
                      tabIndex="13"
                      checked={this.state.typeEA}
                      onChange={this.onTypeChecked}
                    />
                    <span className="checkbox-text">
                      EA <i>{this.props.eaCount}</i>
                    </span>
                  </label>
                </div>
                <div className="checkbox-container">
                  <label className="clickable checkbox-text">
                    <Input
                      type="checkbox"
                      name="typeNOI"
                      className="sidebar-checkbox"
                      tabIndex="14"
                      checked={this.state.typeNOI}
                      onChange={this.onTypeChecked}
                    />
                    <span className="checkbox-text">
                      NOI <i>{this.props.noiCount}</i>
                    </span>
                  </label>
                </div>
                <div className="checkbox-container">
                  <label className="clickable checkbox-text">
                    <Input
                      type="checkbox"
                      name="typeROD"
                      className="sidebar-checkbox"
                      tabIndex="15"
                      checked={this.state.typeROD}
                      onChange={this.onTypeChecked}
                    />
                    <span className="checkbox-text">
                      ROD <i>{this.props.rodCount}</i>
                    </span>
                  </label>
                </div>
                <div className="checkbox-container">
                  <label className="clickable checkbox-text">
                    <Input
                      type="checkbox"
                      name="typeScoping"
                      className="sidebar-checkbox"
                      tabIndex="16"
                      checked={this.state.typeScoping}
                      onChange={this.onTypeChecked}
                    />
                    <span className="checkbox-text">
                      Scoping Report <i>{this.props.scopingCount}</i>
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div className="filter" hidden={!Globals.curatorOrHigher()}>
              <Divider />

              <label className="sidebar-label-date">Advanced</label>
              <div className="sidebar-checkboxes">
                <Input
                  type="checkbox"
                  name="typeFinal"
                  className="sidebar-checkbox"
                  checked={this.props.useOptions}
                  onChange={this.onUseOptionsChecked}
                />
                <label className="checkbox-text" htmlFor="typeFinal">
                  Apply filters to search query
                </label>
              </div>
            </div>
          </div>
          <div hidden={this.state.hideOrganization} id="agency-svg-holder">
            <button onClick={this.orgClick}>x</button>
          </div>
        </Paper>
      </SearchContext.Provider>
    );
  }

  orgClick = () => {
    this.setState({ hideOrganization: !this.state.hideOrganization });
  };

  componentWillUnmount() {
    // For if user navigates away using top menu
    persist.setItem("appState", JSON.stringify(this.state));
  }

  // After render
  componentDidMount() {
    try {
      Globals.registerListener("geoFilter", this.geoFilter);

      // For if user navigates back using top menu
      const rehydrate = JSON.parse(persist.getItem("appState"));

      // Need to restore last searched term to support on-demand highlighting in case user navigates away from
      // and back to Search, using the top menu
      if (rehydrate.lastSearchedTerm) {
        rehydrate.titleRaw = rehydrate.lastSearchedTerm;
        this._lastSearchTerms = rehydrate.lastSearchedTerm;
      }

      // console.log(rehydrate.startPublish);
      // console.log(new Date(rehydrate.startPublish));

      if (typeof rehydrate.startPublish === "string") {
        rehydrate.startPublish = Globals.getCorrectDate(rehydrate.startPublish);
      } // else number

      if (typeof rehydrate.endPublish === "string") {
        rehydrate.endPublish = Globals.getCorrectDate(rehydrate.endPublish);
      }
      rehydrate.isDirty = false;
      rehydrate.surveyChecked = true;
      rehydrate.surveyDone = true;
      this.setState(rehydrate);
    } catch (e) {
      // do nothing
    }

    this.getCounts();

    // Get search params on mount and run search on them (implies came from landing page)
    // console.log("Search mounted, doing search from parameters.");
    this.doSearchFromParams();
  }

  componentDidUpdate() {}

  post = (postUrl, dataForm) => {
    axios({
      url: postUrl,
      method: "POST",
      data: dataForm,
    })
      .then((_response) => {
        const rsp = (this.resp += JSON.stringify({
          data: _response.data,
          status: _response.status,
        }));
        this.setState(
          {
            server_response: rsp,
          },
          () => {
            console.log(this.state.server_response);
          }
        );
        // let responseOK = response && response.status === 200;
      })
      .catch((error) => {
        // redirect
        console.error(error);
      });
  };

  surveyClick = (evt) => {
    this.setState({
      surveyResult: evt.target.value,
      surveyChecked: true,
    });
  };

  revert = (evt) => {
    this.setState({
      surveyChecked: false,
    });
  };

  surveySubmit = () => {
    this.setState(
      {
        surveyDone: true,
      },
      () => {
        const postUrl = new URL("survey/save", Globals.currentHost);
        const dataForm = new FormData();

        dataForm.append("surveyResult", this.state.surveyResult);
        if (!parseTerms(this._lastSearchTerms)) {
          dataForm.append("searchTerms", "");
        } else {
          dataForm.append("searchTerms", parseTerms(this._lastSearchTerms));
        }

        this.post(postUrl, dataForm);
      }
    );
  };
}

export default withRouter(Search);

/** Does a .replace with regex for these rules:
 * For the opening ', it could have either no characters before it, or whitespace.
 * Then another ' must be found after that one preceding either no characters,
 * or whitespace.  In between the two can be any characters, so technically this would count:
 * ' '.  That isn't really a problem, though.
 *
 * In other words, enforce /([\s]|^)'(.+)'([\s]|$)/g and replace surrounding pair of ' with "
 *
 * Also before then turn probable (roughly definitive) proximity search attempts into proper proximity searches */
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
