import axios from "axios";
import React from "react";
//import DatePicker from "react-datepicker";
//import Select from 'react-select';

import "../css/tabulator.css";
import "../sidebar.css";
import "../survey.css";
import "./search.css";

import {
  Box,
  Container,
  Paper
} from "@mui/material";
import Grid from '@mui/material/Grid'; // Grid version 1
import { ThemeProvider, styled } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
import "react-datepicker/dist/react-datepicker.css";
import { withRouter } from "react-router";
import "tippy.js/dist/tippy.css"; // optional
import Globals from "../globals.js";
import persist from "../persist.js";
import theme from "../styles/theme";
import SearchContext from "./SearchContext.js";
import SideBarFilters from './SideBarFilters';
import PropTypes from "prop-types";
import ResultsHeader from "./ResultsHeader";
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
  background: "rgba(240, 239, 237, 1)",
};
const useStyles = makeStyles((theme) => ({
  resultItem: {
    mt: 2,
    mb: 2,
    pl: 0,
    pr: 0,
    "&:hover": {
      //           backgroundColor: theme.palette.grey[200],
      boxShadow: "0px 4px 8px rgba(0.5, 0.5, 0.5, 0.15)",
      cursor: "pointer",
      "& .addIcon": {
        color: "purple",
      },
    },
  }
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
    console.log(`file: Search.js:75 ~ Search ~ constructor ~ props:`, props);


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
      showQuickTipsDialog: false,
      showPDFDialog: false,
      showSearchTipsDialog: false,
      needsComments: false,
      needsDocument: false,
      optionsChecked: true,
      iconClassName: "icon icon--effect",
      limit: 10,
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
    };
    this.debouncedSearch = _.debounce(this.props.search, 300);
    this.filterResultsBy = this.props.filterResultsBy;
    // this.filterBy = _.debounce(this.props.filterResultsBy, 200);
    this.countyOptions = Globals.counties;

    this.debouncedSuggest = _.debounce(this.props.suggest, 300);

    this.myRef = React.createRef();
  }

  handleChange(inputId, inputValue) {

    this.setState({ [inputId]: inputValue });
  }

  doSearch = (terms) => {


    //[TODO][BUG] Look into why last search term is being set as the same as the current one?
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
    // 
    // 

    var queryString = Globals.getParameterByName("q");
    this.setState({
      hasSearched: true
    })
    if (!this.props.count && (queryString === null || queryString === "")) {
      // No query param/blank terms: Launch no-term search - Only if we have no results saved here already
      // 
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

  onClearFilter = (evt, reason) => {

    this.setState({ [evt.target.name]: [] }, () => {

      // this.debouncedSearch(this.state);
    });

  }

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

      },
      () => {
        this.filterResultsBy(this.state);
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
    //		
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
    // 
    if (geodata.geoType === Globals.geoType.STATE) {
      // Assuming Search and SearchResultsMap talk to each other, we'll want two-way interaction.
      // So if it's sending us a state, we may want to enable or disable it.
      const indexIfExists = this.state.state.indexOf(geodata.abbrev);
      console.log(`file: Search.js:355 ~ Search ~ indexIfExists:`, indexIfExists);
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
        console.log(`file: Search.js:368 ~ Search ~ _stateRaw:`, _stateRaw);
        this.onMapLocationChange(_stateRaw);
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

    this.setState({
      fragmentSizeValue: evt.value,
      fragmentSize: evt,
    });
  };

  onAgencyChange = (evt, selected, reason) => {


    let agencies = [];
    if (reason === "selectOption") {
      agencies = this.state.agency || [];
      selected.map(s => {

        return agencies.push(s.value);
      });
    }
    this.setState(
      {
        agency: agencies,//selected,
        agencyRaw: evt,
      },
      () => {

        this.filterResultsBy(this.state);
      }
    );
  };
  onCooperatingAgencyChange = (evt, selected, reason) => {

    let agencies = [];
    if (reason === "selectOption") {
      agencies = this.state.cooperatingAgency || [];
      selected.map(s => {

        return agencies.push(s.value);
      });
    }

    this.setState(
      {
        cooperatingAgency: agencies,
        cooperatingAgencyRaw: evt,
      },
      () => {
        this.filterResultsBy(this.state);
      }
    );
  }
  onActionChange = (evt, selected, reason) => {



    let actions = [];
    if (reason === "selectOption") {
      actions = this.state.action || [];
      selected.map(s => {
        return actions.push(s.value);
      });
    }
    //[TODO] remove these from event handlers once the value arg is passed consistently
    this.setState(
      {
        action: actions,//selected.replace(/ \([A-Z]*\)/gi, ""),
        actionRaw: evt,
      },
      () => {
        this.filterResultsBy(this.state);
      }
    );
  };
  onDecisionChange = (evt, selected, reason) => {
    let decisions = [];
    if (reason === "selectOption") {
      this.state.decision || [];
      selected.map(s => {
        decisions.push(s.value)
      })
    }

    this.setState(
      {
        decision: decisions,
        decisionRaw: evt,
      },
      () => {
        this.filterResultsBy(this.state);
      }
    );
  };
  onLocationChange = (evt, selected, reason) => {
    //    
    let states = [];
    if (reason === 'selectOption')
      states = state.state || [];
    selected.map(s => {
      states.push(s.value)
    })
    const countyOptions = this.narrowCountyOptions(selected);
    console.log(`file: Search.js:490 ~ Search ~ # OF COUNTIES:`, countyOptions.length);
    
    
    console.log(`file: Search.js:499 ~ Search ~ states:`, states);
    this.setState(
      {
        state: states,
        stateRaw: selected,
        countyOptions: countyOptions,
      },
      () => {
        console.log(`file: Search.js:502 ~ Search ~ UPDATED STATE - Before Sorting:`, this.state);
        this.filterResultsBy(this.state);
        // Purge invalid counties, which will then run filterBy

        //[TODO] FIX THIS 
        this.onCountyChange(
          this.state.countyOptions.filter((countyObj) => {
            
            const matches =  this.state.county.includes(countyObj.value)
            console.log(`file: Search.js:507 ~ Search ~ this.state.countyOptions.filter ~ matches:`, matches);
            return matches;
          })          
        );
      }
    );
  };
  onMapLocationChange(_stateRaw) {
  console.log(`file: Search.js:521 ~ Search ~ onMapLocationChange ~ _stateRaw:`, _stateRaw);
  if(!_stateRaw){
    console.warn('Warning no state was received from the map filter!!!')
    return;
  }
}
  /** Helper method for onLocationChange limits county options to selected states in filter,
   * or resets to all counties if no states selected */
  narrowCountyOptions = (stateValues) => {
    console.log(`file: Search.js:517 ~ Search ~ stateValues:`, stateValues.length,stateValues[0]);
    
/** Filter logic for county array of specific label/value format given array of state abbreviations  */
function countyFilter(stateValues) {
  console.log(`file: Search.js:521 ~ Search ~ countyFilter ~ stateValues:`, stateValues);
  return function (a) {
    const matches = stateValues.some(item => a.label.split(":")[0] === item.value);
    return matches;
  };
}

    let filteredCounties = Globals.counties;
    if (stateValues && stateValues.length > 0) {
      filteredCounties = filteredCounties.filter(countyFilter(stateValues));
    }
    console.log(`file: Search.js:535 ~ Search ~ filteredCounties:`, filteredCounties);
    

    return filteredCounties;
  };
  onCountyChange = (evt, selected, reason) => {
    console.log(`file: Search.js:543 ~ Search ~ evt, selected, reason:`, evt, selected, reason);
    
    
    let counties = [];
    if (reason && reason === 'selectOption') {
      //[TODO] Debuging only reseting state
      //counties = this.state.county || [];
      if (_.isArray(selected)) {
        selected.map(s => {
          counties.push(s.value)
        })
      }
      else if(!reason && evt.length){
        console.log(`file: Search.js:556 ~ Search ~ evt:`, evt, evt.length);
        evt.map(s => {
          counties.push(s.value)
        })

      }
      else {
        counties.push(selected.value)
        
      }


      this.setState(
        {
          county: counties,
          countyRaw: evt,
        },
        () => {
          this.filterResultsBy(this.state);
        }
      );
    }
  }
  // onMapLocationChange = (_state) => {
  //     let states = this.state.state || [];
  //     _state.map(s => {
  //       states.push(s.value);
  //     })
  //     this.filterCounties(states);
  // }

  // onLocationChange = (evt, selected, reason) => {
  //   //    
  //   let states = [];
  //   if (reason === 'selectOption') {
  //     states = this.state.state || [];
  //     selected.map(s => {
  //       states.push(s.value)
  //     })
  //   }

  //   this.filterCounties(states);
    
  // };

  filterCounties = (states) => {
    console.log(`file: Search.js:506 ~ Search ~ states:`, states);
    //filter out counties not in the selected state(s)
    const countyOptions = this.narrowCountyOptions(states);
    
    //match the signature of onCountyChange, so it can be called from here
    const reason = "selectOption";

    this.setState(
      {
        state: states,
        countyOptions: countyOptions,
      },
      () => {
        this.filterResultsBy(this.state);
        // Purge invalid counties, which will then run filterBy

        this.onCountyChange(
          this.state.countyOptions.filter(countyObj => this.state.county.includes(countyObj.value)));

        //[TODO] FIX THIS 
        this.onCountyChange(
          this.state.countyOptions.filter((countyObj) => {

            const matches = this.state.county.includes(countyObj.value)
            console.log(`file: Search.js:507 ~ Search ~ this.state.countyOptions.filter ~ matches:`, matches);
            return matches;
          }),
          states,
          reason,
        );
      }
    );
  }

  onProximityChange = (evt, selected, reason) => {


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
          // 
        }
      );
    }
  };
  onSortByChangeHandler = (evt) => {
    console.log(`onSortByChangeHandler Event`, evt);
    this.setState({
      searcherInputs: {
        sortBy: evt.target.value,
      }
    }, () => {

    })
  }

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
        this.filterResultsBy(this.state);
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
          this.filterResultsBy(this.state);
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
          this.filterResultsBy(this.state);
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
      this.filterResultsBy(this.state);
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
    //     
    //     
    //     this.datePickerEnd.value = new Date('12 31 ' + evt.target.value);
    //     this.datePickerEnd.state.preSelection = new Date('12 31 ' + evt.target.value);
    //     this.datePickerEnd.calendar.instanceRef.state.date = new Date('12 31 ' + evt.target.value);
    //     this.datePickerEnd.forceUpdate();

    //     this.setState( { endPublish: new Date('12 31 ' + evt.target.value) }, () => {
    //         this.datePickerEnd.value = this.state.endPublish;
    //         this.filterBy(this.state);
    //         
    //         this.datePickerEnd.forceUpdate();
    //         // this.debouncedSearch(this.state);
    //     });
    // } else {

    this.setState({ endPublish: date }, () => {
      this.filterResultsBy(this.state);
      // this.debouncedSearch(this.state);
    });
    // }
  };
  onStartCommentChange = (date) => {
    this.setState({ startComment: date }, () => {
      this.filterResultsBy(this.state);
      // this.debouncedSearch(this.state);
    });
  };
  onEndCommentChange = (date) => {
    this.setState({ endComment: date }, () => {
      this.filterResultsBy(this.state);
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
      .catch((error) => { });
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
            onClick={(evt) => this.onClearFiltersClick(evt)}
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
        //				borderBottom: "1px dotted",
        backgroundColor: "white",
        color: "black",
        "&:hover": {
          backgroundColor: "#348ECF",
        },
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
      <Container
        disableGutters={false}
        sx={{
          //					marginTop: 15,
        }}
      >
        <ThemeProvider theme={theme}>
          <SearchContext.Provider value={value}>
            <Paper sx={{
              marginTop: 0
            }}>
              <Grid Border={0} columnSpacing={0} id="result-header-grid-container" container>{''}
                <Grid
                  container
                  xs={12}
                  id="results-header-grid-container"
                  flex={1}
                  flexGrow={1}>
                  <ResultsHeader
                    {...this.props}
                    sort={this.props.sort}
                    state={this.state}
                    setPageInfo={this.props.setPageInfo}
                    handleProximityValues={this.handleProximityValues}
                    onInput={this.onInput}
                    onKeyUp={this.onKeyUp}
                    onKeyDown={this.onKeyDown}
                    onIconClick={this.onIconClick}
                    titleRaw={this.state.titleRaw}
                    results={this.state.results}
                    total={this.state.total}
                    onSortByChangeHandler={this.onSortByChangeHandler}
                    onLimitChangeHandler={this.onLimitChangeHandler}
                    onDownloadClick={this.onDownloadClick}
                  />
                </Grid>
                <Grid
                  columnSpacing={2}
                  Border={0}
                  borderColor={'blue'}
                  container
                  xs={12}
                  flex={1}
                  margin={0}
                  padding={0}
                  id="filters-grid-container">
                  <Grid Border={0} item xs={3} id="filters-grid-item">
                    {!this.state.filtersHidden &&
                      //[TODO] it would probably be simpler showing these into context
                      <SideBarFilters
                        {...this.props}
                        onActionChange={this.onActionChange}
                        onAgencyChange={this.onAgencyChange}
                        onClearFilter={this.onClearFilter}
                        onCountyChange={this.onCountyChange}
                        onLocationChange={this.onLocationChange}
                        onDecisionChange={this.onDecisionChange}
                        onTypeChecked={this.onTypeChecked}
                        onClearFiltersClick={this.onClearFiltersClick}
                        filtersHidden={this.state.filtersHidden}
                        orgClick={this.orgClick}
                        onUseOptionsChecked={this.onUseOptionsChecked}
                        onCooperatingAgencyChange={this.onCooperatingAgencyChange}
                        onStartDateChange={this.onStartDateChange}
                        onEndDateChange={this.onEndDateChange}
                        toggleFiltersHidden={this.toggleFiltersHidden}
                        onNeedsDocumentChecked={this.onNeedsDocumentChecked}
                        renderClearFiltersButton={this.renderClearFiltersButton}
                        onTitleOnlyChecked={this.onTitleOnlyChecked}
                      />
                    }
                  </Grid>
                  <Grid item xs={9} pl={2}>
                    {this.props.children}
                  </Grid>
                </Grid>

              </Grid>
              {/* End Header*/}
              {/* <Item xs={2} id="filter-container-items" >
									</Item>
									<Item display={'flex'} xs={9}  id="results-container-items">
									</Item>  */}
              {this.getSuggestions()}
              <div id="loader-holder">
                {/* <div className="center" hidden={this.props.searching}>
									<span id="inputMessage"><CircularProgress/> {this.state.inputMessage}</span>
								</div> */}
                <div className="lds-ellipsis" hidden={!this.props.searching}>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              </div>
            </Paper>
          </SearchContext.Provider>
        </ThemeProvider>
      </Container>
    );
  }

  orgClick = () => {
    this.setState({ hideOrganization: !this.state.hideOrganization });
  };

  componentWillUnmount() {
    // For if user navigates away using top menu
    try {
      persist.setItem("appState", JSON.stringify(this.state));
    } catch (e) {
      console.warn('Error while unmounting appState in Search.js: ', e);
    }
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

      // 
      // 

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
      console.warn('Error rehydrating appState in Search.js componentDidMount(): ', e);

      // do nothing
    }

    this.getCounts();

    // Get search params on mount and run search on them (implies came from landing page)
    // 
    this.doSearchFromParams();
  }

  componentDidUpdate() { }

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
};

const styles = theme => ({
  ...theme,
})
Search.propTypes = {
  results: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      title: PropTypes.string,
      processId: PropTypes.number
    })),
  onSearch: PropTypes.func.isRequired,
  onSort: PropTypes.func.isRequired,
  onFilter: PropTypes.func.isRequired,
  searchParams: PropTypes.object.isRequired,
  setSearchParams: PropTypes.func.isRequired,
  titleRaw: PropTypes.string,
  agencyRaw: PropTypes.string,
  stateRaw: PropTypes.string,
  countyRaw: PropTypes.string,
  startDateRaw: PropTypes.string,
  endDateRaw: PropTypes.string,
  documentTypeRaw: PropTypes.string,
  decisionTypeRaw: PropTypes.string,
  //these should be required debug why it's missing
  sort: PropTypes.string,
  order: PropTypes.bool,
  page: PropTypes.number,
  pageSize: PropTypes.number.isRequired,
  facets: PropTypes.array.isRequired,
  suggestions: PropTypes.array,
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.object,
};

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
