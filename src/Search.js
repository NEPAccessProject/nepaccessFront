import React from 'react';

import SlidesIframe from './Tutorial/SlidesIframe.js';

import axios from 'axios';


import './css/tabulator.css';
import "./search.css";
import "./sidebar.css";
import './survey.css';
//import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from 'react-datepicker';
import 'tippy.js/dist/tippy.css'; // optional
import Tippy from '@tippyjs/react';
import Checkbox from '@mui/material/Checkbox';
import Globals from './globals.js';
import persist from './persist.js';
import theme from './styles/theme.js';
import { withRouter } from "react-router";
import TippySearchTips from './TippySearchTips.js';
import { Paper, Button, Box, Divider, FormControl, Select,Autocomplete,Input,InputLabel,TextField } from '@mui/material';
import { InputAdornment } from '@mui/icons-material';
import { makeStyles,withStyles } from '@mui/styles';
//import { DatePicker } from '@mui/lab';
// import PropTypes from "prop-types";
const drawerWidth = 200;const _ = require('lodash');

const FULLSTYLE = {display: 'block',
    margin: '0 auto',
    width: '80%',
    minWidth: '20%',
    maxWidth: '100%',
    marginBottom: '20px',
    border: '2px solid rgba(218, 218, 218, 1)',
    background: 'rgba(240, 239, 237, 1)'
};
console.log('theme', theme);
//@follow-up Styles
const styles = (theme) => ({
  root: {
    display: 'flex',
    m: 2,
  },

  drawer: {
    width: drawerWidth,
    flexShrink: 1,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerContainer: {
    overflow: 'auto',
    // padding: theme.spacing(2),
  },
  datapicker: {
    p: 0,
    m: 0,
    minWidth: 220,
    width: '100%',
  },
  formControl: {
    // marginBottom: theme.spacing(2),
    minWidth: 120,
    width: '100%',
  },
  submitButton: {
    //margin: theme.spacing(3, 0, 2),},
  },
  formLabel: {
    // fontSize: '1.2em',
    // fontWeight: 'bold',
    padding: 0,
    margin: 0,
    display: 'block',
  },
  box: {
    margin: 5,
    padding: 5,
  },
  autocomplete: {
    p: 0,
    m: 0,
    width: '100%',
    minWidth: 300,
    maxHeight: 50,
  },
  select: {
    border: 'none',
    //backgroundColor: theme.palette.grey[150],
    '&:hover': {
      p: 0,
      //   backgroundColor: theme.palette.grey[100],
      '&:hover': {
        // backgroundColor: theme.palette.grey[150],
        // boxShadow: theme.palette.grey[300],
        cursor: 'pointer',
      },
    },
  },
});
class Search extends React.Component {
    _lastSearchTerms = "";

	// static propTypes = {
        // match: PropTypes.object.isRequired,
        // location: PropTypes.object.isRequired,
        // history: PropTypes.object.isRequired
    // };

    constructor(props) {
        super(props);
        console.log('SEARCH PROPS',props);
        this.classes = props.classes;
		this.state = {
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
            iconClassName: 'icon icon--effect',
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

            countyOptions: Globals.counties
		};
        this.debouncedSearch = _.debounce(this.props.search, 300);
        this.filterBy = this.props.filterResultsBy;
        // this.filterBy = _.debounce(this.props.filterResultsBy, 200);

        this.debouncedSuggest = _.debounce(this.props.suggest, 300);

        this.myRef = React.createRef();
    }

    doSearch = (terms) => {
        this._lastSearchTerms = terms;
        this.setState({
            titleRaw: parseTerms(terms),
            lastSearchedTerm: parseTerms(terms),
            surveyChecked: false,
            surveyDone: false,
            isDirty: true
        }, () => {
            this.debouncedSearch(this.state);
        });
    }

    doSearchFromParams = () => {
        // console.log("Stored terms", this._lastSearchTerms);
        // console.log("State.", this.state);

        var queryString = Globals.getParameterByName("q");
        if( !this.props.count && (queryString === null || queryString === '') ) {
            // No query param/blank terms: Launch no-term search - Only if we have no results saved here already
            // console.log("No query parameters, doing blank search.", this.props.count);
            this.doSearch("");
        } else if(queryString){
            // Query terms: Handle proximity dropdown logic, launch search
            let proximityValues = this.handleProximityValues(queryString);

            this._lastSearchTerms = queryString;
            this.setState({
                titleRaw: parseTerms(queryString),
                proximityDisabled: proximityValues.disableValue,
                surveyChecked: false,
                surveyDone: false,
                isDirty: true,
                inputMessage: proximityValues._inputMessage
            }, () => {
                if(this.state.titleRaw){
                    // console.log("Firing search with query param");
                    this.debouncedSearch(this.state);
                }
            });
        }
    }

    handleProximityValues = (string) => {
        let valuesResult = {_inputMessage:"", disableValue: true};

        // Disable prox dropdown if conflicting characters in terms
        if( string.match(/["?*~]+/) ) {
            // _inputMessage = "Wildcard, phrase or proximity search character found in terms: "
            //     + userInput.match(/["\?\*~]+/)[0][0]
            //     + ".  Disabled proximity search dropdown to prevent unpredictable results."
            valuesResult._inputMessage = "Proximity dropdown is disabled when certain special characters are used: ~ ? \" *";
            valuesResult.disableValue = true;
        }
        // Disable ui proximity search unless search is at least two strings separated by whitespace
        else if( string.trim().match(/\s+/) ) {
            valuesResult._inputMessage = "";
            valuesResult.disableValue = false;
        }

        return valuesResult;
    }

    /**
     * Event handlers
     */


    onIconClick = (evt) => {
        this.doSearch(this.state.titleRaw);
    }
    /** clears and disables proximity search option as well as clearing text */
    onClearClick = (evt) => {
        this.setState({
            titleRaw: '',
            proximityDisabled: true,
            proximityOption: null,
            inputMessage: ""
        }, () => {
            this.inputSearch.focus();
            // this.debouncedSuggest();
        });
    }

    onClearFiltersClick = () => {
        this.setState({
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

            countyOptions: Globals.counties
        }, () => {
            this.filterBy(this.state);
        });

    }

    onRadioChange = (evt) => {
        this.setState({ [evt.target.name]: evt.target.value }, () => {
            // this.debouncedSearch(this.state);
        });
    }

    onKeyUp = (evt) => {
        if(evt.keyCode === 13){
            evt.preventDefault();
            this.doSearch(this.state.titleRaw);
        }
    }
    /** For some reason, without this, calendars stay open after tabbing past them.
     *  (This is opposite to how react-datepicker's default behavior is described.) */
    onKeyDown = (e) => {
        if (e.key === "Tab") {
            if(this.datePickerStart) {
                this.datePickerStart.setOpen(false);
            }
            if(this.datePickerEnd) {
                this.datePickerEnd.setOpen(false);
            }
        }
    }

    onMarkupChange = (evt) => {
        let checked = evt.target.checked;
        this.setState({
            markup: checked
        });
    }

	onInput = (evt) => {
        let userInput = evt.target.value;

        let proximityValues = this.handleProximityValues(userInput);

		//get the evt.target.name (defined by name= in input)
		//and use it to target the key on our `state` object with the same name, using bracket syntax
		this.setState(
		{
            [evt.target.name]: userInput,
            proximityDisabled: proximityValues.disableValue,
            inputMessage: proximityValues._inputMessage
        }, () => {
            // auto-searching is currently too expensive until asynchronous results
            // this.debouncedSearch(this.state);

            // autocomplete/suggest/other functionality fires, starting here
            // TODO: May want to take out any special characters that never appear in titles or are otherwise unnecessary
            // this.debouncedSuggest(this.state.titleRaw);
        });
    }

    // suppress warning that there's no onChange event, handler (despite onChange rarely being the best event to take advantage of)
    onChangeHandler = (evt) => {
        // do nothing
    }

    geoFilter = (geodata) => {
        // console.log(geodata.name, geodata.abbrev);
        if(geodata.geoType === Globals.geoType.STATE) {

            // Assuming Search and SearchResultsMap talk to each other, we'll want two-way interaction.
            // So if it's sending us a state, we may want to enable or disable it.
            const indexIfExists = this.state.state.indexOf(geodata.abbrev);
            let _stateRaw = this.state.stateRaw;
            try {
                if(indexIfExists === -1) { // Enable
                    _stateRaw.push({value: geodata.abbrev, label: geodata.name});
                } else { // Disable
                    _stateRaw.splice(indexIfExists, 1);
                }
            } catch(e) {
                console.error(e);
            } finally {
                this.onLocationChange(_stateRaw);
            }

        } else if (geodata.geoType === Globals.geoType.COUNTY) {
            const indexIfExists = this.state.county.indexOf(geodata.abbrev);
            let _countyRaw = this.state.countyRaw;
            try {
                if(indexIfExists === -1) { // Enable
                    _countyRaw.push({value: geodata.abbrev, label: geodata.abbrev});
                } else { // Disable
                    _countyRaw.splice(indexIfExists, 1);
                }
            } catch(e) {
                console.error(e);
            } finally {
                this.onCountyChange(_countyRaw);
            }
        } else {
            // do nothing: filter has no supported functionality for "other" polygons
        }
    }

    onFragmentSizeChange = (evt) => {
        console.log("Val",evt.value);
        this.setState({
            fragmentSizeValue: evt.value,
            fragmentSize: evt
        });
    }

	onAgencyChange = (evt) => {
		var agencyLabels = [];
		for(var i = 0; i < evt.length; i++){
			agencyLabels.push(evt[i].label.replace(/ \([A-Z]*\)/gi,""));
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
            agencyRaw: evt
		}, () => {
			this.filterBy(this.state);
		});
    }
	onCooperatingAgencyChange = (evt) => {
		var agencyLabels = [];
		for(var i = 0; i < evt.length; i++){
			agencyLabels.push(evt[i].label.replace(/ \([A-Z]*\)/gi,""));
        }
        this.setState(
		{
            cooperatingAgency: agencyLabels,
            cooperatingAgencyRaw: evt
		}, () => {
			this.filterBy(this.state);
		});
    }
	onActionChange = (evt) => {
		var actionLabels = [];
		for(var i = 0; i < evt.length; i++){
			actionLabels.push(evt[i].label.replace(/ \([A-Z]*\)/gi,""));
        }
        this.setState(
		{
            action: actionLabels,
            actionRaw: evt
		}, () => {
			this.filterBy(this.state);
		});
    }
	onDecisionChange = (evt) => {
		var decisionLabels = [];
		for(var i = 0; i < evt.length; i++){
			decisionLabels.push(evt[i].label.replace(/ \([A-Z]*\)/gi,""));
        }
        this.setState(
		{
            decision: decisionLabels,
            decisionRaw: evt
		}, () => {
			this.filterBy(this.state);
		});
    }
	onLocationChange = (evt,item) => {
        var stateValues = [];
		for(var i = 0; i < evt.length; i++){
			stateValues.push(evt[i].value);
		}

        this.setState(
		{
			state: stateValues,
            stateRaw: evt,
            countyOptions: this.narrowCountyOptions(stateValues)
		}, () => {
			// this.filterBy(this.state);
            // Purge invalid counties, which will then run filterBy
            this.onCountyChange(this.state.countyOptions.filter(countyObj => this.state.county.includes(countyObj.value)));
        });
    }
    /** Helper method for onLocationChange limits county options to selected states in filter,
     * or resets to all counties if no states selected */
    narrowCountyOptions = (stateValues) => {
        /** Filter logic for county array of specific label/value format given array of state abbreviations  */
        function countyFilter(_stateValues) {
            return function (a) {
                let returnValue = false;
                _stateValues.forEach(item =>{
                    if (a.label.split(':')[0] === item) { // a.label.split(':')[0] gets 'AZ' from expected 'AZ: Arizona'
                        returnValue = true;
                    }
                });
                return returnValue;
            };
        }

        let filteredCounties = Globals.counties;
        if(stateValues && stateValues.length > 0){
            filteredCounties = filteredCounties.filter(countyFilter(stateValues));
        }

        return filteredCounties;
    }
	onCountyChange = (evt, item) => {
		var countyValues = [];
		for(var i = 0; i < evt.length; i++){
			countyValues.push(evt[i].value);
		}

        this.setState(
		{
			county: countyValues,
            countyRaw: evt
		}, () => {
			this.filterBy(this.state);
        });
    }
	onProximityChange = (evt) => {
        if(evt.value === -1) {
            this.setState({
                proximityOption: null
            });
        } else {
            this.setState(
            {
                proximityOption: evt,
            }, () => {
                // console.log(this.state.proximityOption);
            });
        }
    }

    onTitleOnlyChecked = (evt) => {
        if(evt.target.checked) {
            this.setState({
                searchOption: "C" // Title only
            });
        } else {
            this.setState({
                searchOption: "B" // Both fields, Lucene default scoring
            });
        }
    }

    getSearchBarText = () => {
        if(this.state.searchOption && this.state.searchOption === "C") { // title only
            return "Search titles of NEPA documents";
        } else {
            return "Search full texts and titles of NEPA documents";
        }
    }

    onUseOptionsChecked = (evt) => {
        this.props.optionsChanged(evt.target.checked);
    }

    onNeedsDocumentChecked = (evt) => {
        this.setState({
            needsDocument: !this.state.needsDocument
		}, () => {
			this.filterBy(this.state);
        });
    }

    onTypeChecked = (evt) => {
        if(evt.target.name==="optionsChecked") {
            this.setState({
                [evt.target.name]: evt.target.checked
            });
        } else if(evt.target.name==="typeAll" && evt.target.checked) { // All: Check all, uncheck others
            this.setState({
                typeAll: true,
                typeFinal: false,
                typeDraft: false,
                typeOther: false
            }, () => {
                this.filterBy(this.state);
                /**this.debouncedSearch(this.state);*/
            });
        } else { // Not all: Check target, uncheck all
            this.setState({
                [evt.target.name]: evt.target.checked,
                typeAll: false
            }, () => {
                this.filterBy(this.state);
                // this.debouncedSearch(this.state);
            });
        }
    }

	// onChecked = (evt) => {
	//     this.setState( { [evt.target.name]: evt.target.checked}, () => { this.debouncedSearch(this.state); });
    // }

    onStartDateChange = (date) => {
        this.setState( { startPublish: date }, () => {
			this.filterBy(this.state);
            // this.debouncedSearch(this.state);
        });
    }
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

            this.setState( { endPublish: date }, () => {
                this.filterBy(this.state);
                // this.debouncedSearch(this.state);
            });
        // }

    }
    onStartCommentChange = (date) => {
        this.setState( { startComment: date }, () => {
			this.filterBy(this.state);
            // this.debouncedSearch(this.state);
        });
    }
    onEndCommentChange = (date) => {
        this.setState( { endComment: date }, () => {
			this.filterBy(this.state);
            // this.debouncedSearch(this.state);
        });
    }
    tooltipTrigger = (evt) => {
        this.setState({tooltipOpen: !this.state.tooltipOpen})
    }
    closeTooltip = () => {
        this.setState({
            tooltipOpen: false
        })
    }


    getCounts = () => {
        this.get('stats/earliest_year','firstYear');
        this.get('stats/latest_year','lastYear');
        this.get('stats/eis_count','EISCount')
    }
    get = (url, stateName) => {
        const _url = new URL(url, Globals.currentHost);
        axios({
            url: _url,
            method: 'GET',
            data: { }
        }).then(_response => {
            const rsp = _response.data;
            this.setState({ [stateName]: rsp });
        }).catch(error => {
        })
    }

    /** Helps getSuggestions() by returning clickable link to details page for given suggestion, which opens a new tab */
    getSuggestion = (suggestion, idx) => {
        let _href = "record-details?id=";
        if(suggestion.isProcess) {
            _href = "process-details?id=";
        }

        if(suggestion.id && suggestion.title) {
            return (
                <div>
                    <a href={_href + suggestion.id} target="_blank" rel="noreferrer"
                        key={idx}
                        dangerouslySetInnerHTML={{
                            __html: suggestion.title
                        }}
                    />
                </div>
            );
        }
    }
    /** If we can complete the current search terms into a title, show links to up to three suggested details pages.
     * AnalyzingInfixSuggester.lookup logic seems to see if the rightmost term can be expanded to match titles.
     *
     * So the terms 'rose mine' won't find anything, because a word MUST be 'rose' - but 'mine rose' will find rosemont
     * copper mine, because it's basically looking for mine AND rose*, whereas rose AND mine* doesn't match any titles.
     */
    getSuggestions = () => {
        if(this.props.lookupResult && this.props.lookupResult[0]) {
            return (
                <div className="suggestion-holder">
                    <span className="block">Sample titles:</span>
                    {this.props.lookupResult.map((result,i) => {
                        return this.getSuggestion(result,i)
                    })}
                </div>
            );
        }
    }

    filtersActive = () => {
        if( this.state.startPublish ||
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
            this.state.needsDocument)
        {
            return true;
        }
    }

    toggleFiltersHidden = () => {
        this.setState({
            filtersHidden: !this.state.filtersHidden
        }, () => {
            this.props.filterToggle(this.state.filtersHidden);
        });
    }

    renderClearFiltersButton = () => {
        if(this.filtersActive()) {
            return <div className={this.state.filtersHidden === false ? "margin height-30 right" : "clear-filters-hidden"}>
                <span id="clear-filters" className="link" onClick={() => this.onClearFiltersClick()}>Clear filters</span>
            </div>;
        }
    }


    render () {
        // const { history } = this.props;

        const customStyles = {
            option: (styles, state) => ({
                 ...styles,
                borderBottom: '1px dotted',
	            backgroundColor: 'white',
                color: 'black',
                '&:hover': {
                    backgroundColor: '#348ECF'
                },
                // ':active': {
                //     ...styles[':active'],
                //     backgroundColor: !isDisabled && (isSelected ? data.color : color.alpha(0.3).css()),
                //   },
                //   padding: 20,
            }),
            control: (styles) => ({
                ...styles,
                backgroundColor: 'white',
            })
        }

        // original data has some abbreviation-only/incorrect/missing entries (ARD, FirstNet, NGB, URC?)
        // { value: 'ARD', label: 'ARD' }
        const agencyOptions = [
            { value: 'ACHP', label: 'Advisory Council on Historic Preservation (ACHP)' },{ value: 'USAID', label: 'Agency for International Development (USAID)' },{ value: 'ARS', label: 'Agriculture Research Service (ARS)' },{ value: 'APHIS', label: 'Animal and Plant Health Inspection Service (APHIS)' },{ value: 'AFRH', label: 'Armed Forces Retirement Home (AFRH)' },{ value: 'BPA', label: 'Bonneville Power Administration (BPA)' },{ value: 'BIA', label: 'Bureau of Indian Affairs (BIA)' },{ value: 'BLM', label: 'Bureau of Land Management (BLM)' },{ value: 'USBM', label: 'Bureau of Mines (USBM)' },{ value: 'BOEM', label: 'Bureau of Ocean Energy Management (BOEM)' },{ value: 'BOP', label: 'Bureau of Prisons (BOP)' },{ value: 'BR', label: 'Bureau of Reclamation (BR)' },{ value: 'Caltrans', label: 'California Department of Transportation (Caltrans)' },{ value: 'CHSRA', label: 'California High-Speed Rail Authority (CHSRA)' },{ value: 'CIA', label: 'Central Intelligence Agency (CIA)' },{ value: 'NYCOMB', label: 'City of New York, Office of Management and Budget (NYCOMB)' },{ value: 'CDBG', label: 'Community Development Block Grant (CDBG)' },{ value: 'CTDOH', label: 'Connecticut Department of Housing (CTDOH)' },{ value: 'BRAC', label: 'Defense Base Closure and Realignment Commission (BRAC)' },{ value: 'DLA', label: 'Defense Logistics Agency (DLA)' },{ value: 'DNA', label: 'Defense Nuclear Agency (DNA)' },{ value: 'DNFSB', label: 'Defense Nuclear Fac. Safety Board (DNFSB)' },{ value: 'DSA', label: 'Defense Supply Agency (DSA)' },{ value: 'DRB', label: 'Delaware River Basin Commission (DRB)' },{ value: 'DC', label: 'Denali Commission (DC)' },{ value: 'USDA', label: 'Department of Agriculture (USDA)' },{ value: 'DOC', label: 'Department of Commerce (DOC)' },{ value: 'DOD', label: 'Department of Defense (DOD)' },{ value: 'DOE', label: 'Department of Energy (DOE)' },{ value: 'HHS', label: 'Department of Health and Human Services (HHS)' },{ value: 'DHS', label: 'Department of Homeland Security (DHS)' },{ value: 'HUD', label: 'Department of Housing and Urban Development (HUD)' },{ value: 'DOJ', label: 'Department of Justice (DOJ)' },{ value: 'DOL', label: 'Department of Labor (DOL)' },{ value: 'DOS', label: 'Department of State (DOS)' },{ value: 'DOT', label: 'Department of Transportation (DOT)' },{ value: 'TREAS', label: 'Department of Treasury (TREAS)' },{ value: 'VA', label: 'Department of Veteran Affairs (VA)' },{ value: 'DOI', label: 'Department of the Interior (DOI)' },{ value: 'DEA', label: 'Drug Enforcement Administration (DEA)' },{ value: 'EDA', label: 'Economic Development Administration (EDA)' },{ value: 'ERA', label: 'Energy Regulatory Administration (ERA)' },{ value: 'ERDA', label: 'Energy Research and Development Administration (ERDA)' },{ value: 'EPA', label: 'Environmental Protection Agency (EPA)' },{ value: 'FSA', label: 'Farm Service Agency (FSA)' },{ value: 'FHA', label: 'Farmers Home Administration (FHA)' },{ value: 'FAA', label: 'Federal Aviation Administration (FAA)' },{ value: 'FCC', label: 'Federal Communications Commission (FCC)' },{ value: 'FEMA', label: 'Federal Emergency Management Agency (FEMA)' },{ value: 'FEA', label: 'Federal Energy Administration (FEA)' },{ value: 'FERC', label: 'Federal Energy Regulatory Commission (FERC)' },{ value: 'FHWA', label: 'Federal Highway Administration (FHWA)' },{ value: 'FMC', label: 'Federal Maritime Commission (FMC)' },{ value: 'FMSHRC', label: 'Federal Mine Safety and Health Review Commission (FMSHRC)' },{ value: 'FMCSA', label: 'Federal Motor Carrier Safety Administration (FMCSA)' },{ value: 'FPC', label: 'Federal Power Commission (FPC)' },{ value: 'FRA', label: 'Federal Railroad Administration (FRA)' },{ value: 'FRBSF', label: 'Federal Reserve Bank of San Francisco (FRBSF)' },{ value: 'FTA', label: 'Federal Transit Administration (FTA)' }
            ,{ value: 'FirstNet', label: 'First Responder Network Authority (FirstNet)' },{ value: 'USFWS', label: 'Fish and Wildlife Service (USFWS)' },{ value: 'FDOT', label: 'Florida Department of Transportation (FDOT)' },{ value: 'FDA', label: 'Food and Drug Administration (FDA)' },{ value: 'USFS', label: 'Forest Service (USFS)' },{ value: 'GSA', label: 'General Services Administration (GSA)' },{ value: 'USGS', label: 'Geological Survey (USGS)' },{ value: 'GLB', label: 'Great Lakes Basin Commission (GLB)' },{ value: 'IHS', label: 'Indian Health Service (IHS)' },{ value: 'IRS', label: 'Internal Revenue Service (IRS)' },{ value: 'IBWC', label: 'International Boundary and Water Commission (IBWC)' },{ value: 'ICC', label: 'Interstate Commerce Commission (ICC)' },{ value: 'JCS', label: 'Joint Chiefs of Staff (JCS)' },{ value: 'MARAD', label: 'Maritime Administration (MARAD)' },{ value: 'MTB', label: 'Materials Transportation Bureau (MTB)' },{ value: 'MSHA', label: 'Mine Safety and Health Administration (MSHA)' },{ value: 'MMS', label: 'Minerals Management Service (MMS)' },{ value: 'MESA', label: 'Mining Enforcement and Safety (MESA)' },{ value: 'MRB', label: 'Missouri River Basin Commission (MRB)' },{ value: 'NASA', label: 'National Aeronautics and Space Administration (NASA)' },{ value: 'NCPC', label: 'National Capital Planning Commission (NCPC)' },{ value: 'NGA', label: 'National Geospatial-Intelligence Agency (NGA)' }
            ,{ value: 'NGB', label: 'National Guard Bureau (NGB)' },{ value: 'NHTSA', label: 'National Highway Traffic Safety Administration (NHTSA)' },{ value: 'NIGC', label: 'National Indian Gaming Commission (NIGC)' },{ value: 'NIH', label: 'National Institute of Health (NIH)' },{ value: 'NMFS', label: 'National Marine Fisheries Service (NMFS)' },{ value: 'NNSA', label: 'National Nuclear Security Administration (NNSA)' },{ value: 'NOAA', label: 'National Oceanic and Atmospheric Administration (NOAA)' },{ value: 'NPS', label: 'National Park Service (NPS)' },{ value: 'NSF', label: 'National Science Foundation (NSF)' },{ value: 'NSA', label: 'National Security Agency (NSA)' },{ value: 'NTSB', label: 'National Transportation Safety Board (NTSB)' },{ value: 'NRCS', label: 'Natural Resource Conservation Service (NRCS)' },{ value: 'NER', label: 'New England River Basin Commission (NER)' },{ value: 'NJDEP', label: 'New Jersey Department of Environmental Protection (NJDEP)' },{ value: 'NRC', label: 'Nuclear Regulatory Commission (NRC)' },{ value: 'OCR', label: 'Office of Coal Research (OCR)' }
            ,{ value: 'OSMRE', label: 'Office of Surface Mining Reclamation and Enforcement (OSMRE)' },{ value: 'OBR', label: 'Ohio River Basin Commission (OBR)' },{ value: 'RSPA', label: 'Research and Special Programs (RSPA)' },{ value: 'REA', label: 'Rural Electrification Administration (REA)' },{ value: 'RUS', label: 'Rural Utilities Service (RUS)' },{ value: 'SEC', label: 'Security and Exchange Commission (SEC)' },{ value: 'SBA', label: 'Small Business Administration (SBA)' },{ value: 'SCS', label: 'Soil Conservation Service (SCS)' },{ value: 'SRB', label: 'Souris-Red-Rainy River Basin Commission (SRB)' },{ value: 'STB', label: 'Surface Transportation Board (STB)' },{ value: 'SRC', label: 'Susquehanna River Basin Commission (SRC)' },{ value: 'TVA', label: 'Tennessee Valley Authority (TVA)' },{ value: 'TxDOT', label: 'Texas Department of Transportation (TxDOT)' },{ value: 'TPT', label: 'The Presidio Trust (TPT)' },{ value: 'TDA', label: 'Trade and Development Agency (TDA)' },{ value: 'USACE', label: 'U.S. Army Corps of Engineers (USACE)' },{ value: 'USCG', label: 'U.S. Coast Guard (USCG)' },{ value: 'CBP', label: 'U.S. Customs and Border Protection (CBP)' },{ value: 'RRB', label: 'U.S. Railroad Retirement Board (RRB)' },{ value: 'USAF', label: 'United States Air Force (USAF)' },{ value: 'USA', label: 'United States Army (USA)' },{ value: 'USMC', label: 'United States Marine Corps (USMC)' },{ value: 'USN', label: 'United States Navy (USN)' },{ value: 'USPS', label: 'United States Postal Service (USPS)' },{ value: 'USTR', label: 'United States Trade Representative (USTR)' },{ value: 'UMR', label: 'Upper Mississippi Basin Commission (UMR)' },{ value: 'UMTA', label: 'Urban Mass Transportation Administration (UMTA)' },{ value: 'UDOT', label: 'Utah Department of Transportation (UDOT)' }
            ,{ value: 'URC', label: 'Utah Reclamation Mitigation and Conservation Commission (URC)' },{ value: 'WAPA', label: 'Western Area Power Administration (WAPA)' }
        ];
        const stateOptions = Globals.locations;

        const actionOptions = [
            {value:"Conservation/Restoration/ Bio. Resource use", label:"Conservation/Restoration/ Bio. Resource use"},
            {value:"Recreation", label:"Recreation"},
            {value:"Cultural/Historical", label:"Cultural/Historical"},
            {value:"Land Management Plan", label:"Land Management Plan"},
            {value:"Land Exchange", label:"Land Exchange"},
            {value:"Economic and Urban Development/Commerce", label:"Economic and Urban Development/Commerce"},
            {value:"Water Works", label:"Water Works"},
            {value:"Mineral Resource Extraction", label:"Mineral Resource Extraction"},
            {value:"Energy generation/transmission", label:"Energy generation/transmission"},
            {value:"Transportation", label:"Transportation"},
            {value:"Government Facilities/Operation", label:"Government Facilities/Operation"}];
        const decisionOptions = [
            {value:"Policy", label:"Policy"},
            {value:"Plan", label:"Plan"},
            {value:"Program", label:"Program"},
            {value:"Project", label:"Project"},
            {value:"Legislative", label:"Legislative"}];

        // const tooltipTitle = "<p class=tooltip-line><span class=bold>Search word connectors</span></p>"
        // + "<p class=tooltip-line><span class=tooltip-connector>AND</span>This is the default. <span class=bold>All</span> words you enter must be found together to return a result.</p>"
        // + "<p class=tooltip-line><span class=tooltip-connector>OR</span> (all caps) to search for <span class=bold>any</span> of those words.</p>"
        // + "<p class=tooltip-line><span class=tooltip-connector>NOT</span> (all caps) to <span class=bold>exclude</span> a word or phrase.</p>"
        // + "<p class=tooltip-line><span class=tooltip-connector>&quot; &quot;</span> Surround words with quotes (&quot; &quot;) to search for an <span class=bold>exact phrase.</span></p>"
        // + "<p class=tooltip-line><span class=tooltip-connector></span> <a href=search-tips>More search tips.</a></p>";

        const proximityOptions = [
            {value: 0, label: 'exact phrase'},
            {value: 10, label: '10 words'},
            {value: 50, label: '50 words'},
            {value: 100, label: '100 words'},
            {value: 500, label: '500 words'},
            {value: -1, label: 'any distance (default)'}
        ];

        // const fragmentOptions = [
        //     {value: 0, label: 'Small'},
        //     {value: 1, label: 'Medium'},
        //     {value: 2, label: 'Large'},
        //     {value: 3, label: 'Huge'}
        // ]

        // const tooltipTitle = "<div class=tooltip-header>Search word connectors <button className=>x</button></div>"
        // + "<table class=tooltip-table><tbody>"
        //     + "<tr class=tooltip-line>"
        //         + "<td>&nbsp;</td><td>&nbsp;</td>"
        //     + "</tr>"
        //     + "<tr class=tooltip-line><td class=tooltip-connector>AND</td>"
        //         + "<td>This is the default. <span class=bold>All</span> words you enter must be found together to return a result.</td>"
        //     + "</tr>"
        //     + "<tr class=tooltip-line>"
        //         + "<td>&nbsp;</td><td>&nbsp;</td>"
        //     + "</tr>"
        //     + "<tr class=tooltip-line><td class=tooltip-connector>OR</td>"
        //         + "<td>(all caps) to search for <span class=bold>any</span> of those words.</td>"
        //     + "</tr>"
        //     + "<tr class=tooltip-line>"
        //         + "<td>&nbsp;</td><td>&nbsp;</td>"
        //     + "</tr>"
        //     + "<tr class=tooltip-line><td class=tooltip-connector>NOT</td>"
        //         + "<td>(all caps) to <span class=bold>exclude</span> a word or phrase.</td>"
        //     + "</tr>"
        //     + "<tr class=tooltip-line>"
        //         + "<td>&nbsp;</td><td>&nbsp;</td>"
        //     + "</tr>"
        //     + "<tr class=tooltip-line><td class=tooltip-connector>&quot; &quot;</td>"
        //         + "<td>Surround words with quotes (&quot; &quot;) to search for an <span class=bold>exact phrase.</td>"
        //     + "</tr>"
        //     + "<tr class=tooltip-line>"
        //         + "<td>&nbsp;</td><td>&nbsp;</td>"
        //     + "</tr>"
        //     + "<tr class=tooltip-line><td class=tooltip-connector></td>"
        //         + "<td><a href=search-tips target=_blank rel=noopener noreferrer>More search tips.</a></td>"
        //     + "</tr>"
        // + "</tbody></table>";



        return (
          <>
            <div className="content" onSubmit={this.submitHandler}>
              {/* <div className="maintenance-message">
                    <span>
                    </span>
                </div> */}
              {this.props.parseError}
              {/* <h1 className="search-header">Search for NEPA documents</h1> */}
              <div className="search-holder">
                <div className="search-bar-holder">
                  <h1 className="search-header-2">{this.getSearchBarText()}</h1>

                  <div className="pre-input-bar">
                    <div id="tooltip4Container">
                      <div>
                        <TippySearchTips />
                      </div>
                      <div>
                        <Tippy
                          className="tippy-tooltip--small searchTips"
                          trigger="manual click"
                          hideOnClick={true}
                          interactive={true}
                          placement="bottom"
                          content={
                            <div>
                              Currently the site contains <b>{this.state.EISCount}</b> Draft or
                              Final Environmental Impact Statements from:{' '}
                              <b>
                                {this.state.firstYear}-{this.state.lastYear}
                              </b>
                              . More files are being added continuously.
                              <div className="text-center margin-top">
                                <a
                                  href="available-documents"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  Available files
                                </a>
                              </div>
                            </div>
                          }
                        >
                          {<span className={'side-link inline'}>Available files</span>}
                        </Tippy>
                      </div>

                      <SlidesIframe />
                    </div>
                  </div>

                  <span id="search-proximity">
                    <Box>
                      <FormControl variant="filled">
                        {/* <InputLabel
                          htmlFor="proximity-select"
                          //   className={classes.formLabel}
                        ></InputLabel> */}
                        <Autocomplete
                          sx={{
                            width: '100%',
                            minWidth: 250,
                            height: 50,
                            p: 0,
                            m: 0,
                          }}
                          id="proximity-select"
                          className={this.state.proximityDisabled ? ' disabled' : ''}
                          classNamePrefix="react-select control"
                          placeholder="Find within..."
                          options={proximityOptions}
                          value={this.state.proximityOption}
                          // menuIsOpen={true}
                          onChange={this.onProximityChange}
                          getOptionLabel={(option) => option.label}
                          isMulti={false}
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </FormControl>
                      <Divider />
                    </Box>
                    {/* <Select
                      id="proximity-select"
                      className={this.state.proximityDisabled ? ' disabled' : ''}
                      classNamePrefix="react-select control"
                      placeholder="Find within..."
                      options={proximityOptions}
                      value={this.state.proximityOption}
                      // menuIsOpen={true}
                      onChange={this.onProximityChange}
                      isMulti={false}
                    /> */}
                  </span>
                  <input
                    id="main-search-bar"
                    ref={(input) => {
                      this.inputSearch = input;
                    }}
                    className="search-bar"
                    name="titleRaw"
                    placeholder="Enter search terms (or leave blank to get all results)"
                    tabIndex="1"
                    value={this.state.titleRaw}
                    autoFocus
                    onChange={this.onChangeHandler}
                    onInput={this.onInput}
                    onKeyUp={this.onKeyUp}
                  />
                  <svg
                    id="main-search-icon"
                    onClick={this.onIconClick}
                    className="search-icon"
                    width="39"
                    height="38"
                    viewBox="0 0 39 38"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M26.4582 24.1397H28.2356L37.7751 33.3063C38.6976 34.1886 38.6976 35.6303 37.7751 36.5125C36.8526 37.3947 35.3452 37.3947 34.4228 36.5125L24.8607 27.3674V25.6675L24.2533 25.065C21.1034 27.6471 16.8061 28.9813 12.2388 28.2496C5.98416 27.2383 0.989399 22.2462 0.224437 16.2212C-0.945506 7.11911 7.0641 -0.541243 16.5811 0.577685C22.8808 1.30929 28.1006 6.08626 29.158 12.0682C29.923 16.4363 28.5281 20.5463 25.8282 23.5588L26.4582 24.1397ZM4.61171 14.4567C4.61171 19.8146 9.13399 24.1397 14.7362 24.1397C20.3384 24.1397 24.8607 19.8146 24.8607 14.4567C24.8607 9.09875 20.3384 4.77366 14.7362 4.77366C9.13399 4.77366 4.61171 9.09875 4.61171 14.4567Z"
                      fill="black"
                      fillOpacity="0.54"
                    />
                  </svg>
                  <svg
                    id="main-search-clear"
                    onClick={this.onClearClick}
                    className="cancel-icon"
                    width="24"
                    height="24"
                    viewBox="0 0 24 26"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      className="circle"
                      d="M12.2689 1.92334C5.63289 1.92334 0.26889 7.28734 0.26889 13.9233C0.26889 20.5593 5.63289 25.9233 12.2689 25.9233C18.9049 25.9233 24.2689 20.5593 24.2689 13.9233C24.2689 7.28734 18.9049 1.92334 12.2689 1.92334Z"
                      fill="#DADADA"
                    />
                    <path
                      d="M17.4289 19.0834C16.9609 19.5514 16.2049 19.5514 15.7369 19.0834L12.2689 15.6154L8.80089 19.0834C8.33289 19.5514 7.57689 19.5514 7.10889 19.0834C6.88418 18.8592 6.7579 18.5548 6.7579 18.2374C6.7579 17.9199 6.88418 17.6155 7.10889 17.3914L10.5769 13.9234L7.10889 10.4554C6.88418 10.2312 6.7579 9.92677 6.7579 9.60935C6.7579 9.29193 6.88418 8.98755 7.10889 8.76335C7.57689 8.29535 8.33289 8.29535 8.80089 8.76335L12.2689 12.2314L15.7369 8.76335C16.2049 8.29535 16.9609 8.29535 17.4289 8.76335C17.8969 9.23135 17.8969 9.98735 17.4289 10.4554L13.9609 13.9234L17.4289 17.3914C17.8849 17.8474 17.8849 18.6154 17.4289 19.0834Z"
                      fill="#737272"
                    />
                  </svg>

                  {/* <div className="pre-checkbox-bar"></div> */}
                  <div className="input-bar-2">
                    <div className="input-bar-left">
                      <input
                        id="check1"
                        className="pre-search-input"
                        type="checkbox"
                        checked={this.state.searchOption === 'C'}
                        onChange={this.onTitleOnlyChecked}
                      />
                      <label className="sidebar-check-label no-select" htmlFor="check1">
                        Search only within titles
                      </label>
                      {/* &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                <input id="check2" className="pre-search-input" type="checkbox"
                                        checked={this.state.markup}
                                        onChange={this.onMarkupChange}
                                />
                                <label className="sidebar-check-label no-select" htmlFor="check2">
                                    Normalize snippet whitespace
                                </label> */}
                      {/* &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                <div className="inline-block">
                                    <Select id="fragmentSize" className="multi" classNamePrefix="react-select" name="fragmentSize"
                                        styles={customStyles}
                                        options={fragmentOptions}
                                        onChange={this.onFragmentSizeChange}
                                        value={this.state.fragmentSize}
                                        placeholder="Default"
                                        // (temporarily) specify menuIsOpen={true} parameter to keep menu open to inspect elements.
                                        // menuIsOpen={true}
                                    />
                                </div>
                                &nbsp;
                                <label className="sidebar-check-label no-select inline-block">
                                    Text Snippet Size
                                </label> */}
                    </div>
                    <div className="surveyHolder" hidden={this.state.surveyChecked}>
                      Did you find what you were looking for?
                      <div className="radio-holder">
                        <label className="surveyRadio">
                          <input
                            type="radio"
                            value="Yes"
                            checked={false}
                            onChange={this.surveyClick}
                          />
                          Yes
                        </label>
                        <label className="surveyRadio">
                          <input
                            type="radio"
                            value="Partially"
                            checked={false}
                            onChange={this.surveyClick}
                          />
                          Partially
                        </label>
                        <label className="surveyRadio">
                          <input
                            type="radio"
                            value="No"
                            checked={false}
                            onChange={this.surveyClick}
                          />
                          No
                        </label>
                      </div>
                    </div>
                    <div
                      className="surveyHolder"
                      hidden={!this.state.surveyChecked || this.state.surveyDone}
                    >
                      <label className="surveyResult">
                        You chose: <span>{this.state.surveyResult}</span>
                      </label>
                      <button className="surveyButton" onClick={this.revert}>
                        Show me the options again
                      </button>
                      <button className="surveyButton" onClick={this.surveySubmit}>
                        Submit
                      </button>
                    </div>
                    <div hidden={!this.state.surveyDone || !this.state.isDirty}>
                      <div>Thank you for your feedback.</div>
                    </div>
                    {/* <div id="post-search-box-text">Leave search box blank to return all results in database.</div> */}
                  </div>
                </div>
              </div>
            </div>

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

            <div className="sidebar-filters" hidden={!this.state.filtersHidden} style={FULLSTYLE}>
              <span className="sidebar-header">
                Narrow your results
                <span className="filters-toggle" onClick={() => this.toggleFiltersHidden()}>
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
              <span className="sidebar-header">
                Narrow your results
                <span className="filters-toggle" onClick={() => this.toggleFiltersHidden()}>
                  -
                </span>
              </span>

              <div className="sidebar-hr"></div>

              <div className="filter flex-1">
                <div className="checkbox-container-flex">
                  <input
                    type="checkbox"
                    name="needsDocument"
                    id="needsDocument"
                    className="sidebar-checkbox"
                    tabIndex="2"
                    checked={this.state.needsDocument}
                    onChange={this.onNeedsDocumentChecked}
                  />
                  <label className="checkbox-text no-select cursor-pointer" htmlFor="needsDocument">
                    Has downloadable files
                  </label>
                </div>

                {this.renderClearFiltersButton()}
              </div>

              <div className="sidebar-hr"></div>

              <div>
                <Box className={this.classes.box}>
                  <FormControl variant="filled" className={this.classes.formControl}>
                    {/* <InputLabel className={this.classes.formLabel} htmlFor="searchAgency">
                      Lead agency or{' '}
                      <span className="link" onClick={this.orgClick}>
                        agencies
                      </span>
                    </InputLabel> */}
                    <Autocomplete
                      id="searchAgency"
                      sx={{ width: 300 }}
                      options={agencyOptions}
                      onChange={this.onAgencyChange}
                      value={this.state.agencyRaw ? this.state.agencyRaw : ''}
                      autoHighlight
                    //   getOptionLabel={(option) => option.label}
                      renderOption={(props, option) => <>{option.label}</>}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          inputProps={{
                            ...params.inputProps,
                            placeholder: 'Type or Select Lead Agencies', // disable autocomplete and autofill
                          }}
                        />
                      )}
                    />
                  </FormControl>
                  <Divider />
                </Box>
              </div>
              {/* <div>
                <Box className={this.classes.box}>
                  <FormControl variant="filled" className={this.classes.formControl}>
   
                    <Autocomplete
                      id="searchAgency"
                      sx={{ width: 300 }}
                      options={agencyOptions}
                      onChange={this.onAgencyChange}
                      value={this.state.agencyRaw ? this.state.agencyRaw : ''}
                      autoHighlight
                      placeholder="Type or select Cooperating agencies"
                       getOptionLabel={(option) => option.label}
                      renderOption={(props, option) => <>{option.label}</>}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Type or select agencies"
                          inputProps={{
                            ...params.inputProps,
                            placeholder: 'Type or Select Agencies', // disable autocomplete and autofill
                          }}
                        />
                      )}
                    />
                  </FormControl>
                  <Divider />
                </Box>
              </div> */}
              {/* <Box className={this.classes.box}>
                <FormControl variant="filled" className={this.classes.formControl}>
                  <Autocomplete
                    disablePortal
                    sx={{}}
                    className={this.classes.autocomplete}
                    renderInput={(params) => (
                      <TextField
                        id="searchAgency"
                        className={this.classes.Autocomplete}
                        isMulti
                        name="agency"
                        isSearchable
                        isClearable
                        styles={customStyles}
                        tabIndex="3"
                        options={agencyOptions}
                        onChange={this.onAgencyChange}
                        value={this.state.agencyRaw}
                        placeholder="Type or select Cooperating agencies"
                        sx={{
                          p: 0,
                          m: 0,
                          width: '100%',
                          minWidth: 300,
                        }}
                      />
                    )}
                  />
                </FormControl>
                <Divider />
              </Box> */}

              {/* <div>
                <Box className={this.classes.box}>
                  <FormControl variant="filled" className={this.classes.formControl}>
                    <Autocomplete
                      id="searchAgency"
                      sx={{ width: 300 }}
                      options={agencyOptions}
                      onChange={this.onAgencyChange}
                      value={this.state.agencyRaw}
                      autoHighlight
                      placeholder="Type or select Cooperating agencies"
                      getOptionLabel={(option) => option.label}
                      renderOption={(props, option) => <>{option.label}</>}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Type or select agencies"
                          inputProps={{
                            ...params.inputProps,
                            placeholder: 'Type or Select Agencies', // disable autocomplete and autofill
                          }}
                        />
                      )}
                    />
                  </FormControl>
                  <Divider />
                </Box>
              </div> */}
              {/* <Box className={this.classes.box}>
                <FormControl variant="filled" className={this.classes.formControl}>
                  <Autocomplete
                    disablePortal
                    sx={{}}
                    className={this.classes.autocomplete}
                    renderInput={(params) => (
                      <TextField
                        id="searchAgency"
                        className={this.classes.autocomplete}
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
                        placeholder="Type or select Cooperating agencies"
                        sx={{
                          p: 0,
                          m: 0,
                          width: '100%',
                          minWidth: 300,
                        }}
                      />
                    )}
                  />
                </FormControl>
                <Divider />
              </Box> */}
              {/* <div>
                <Box className={this.classes.box}>
                  <FormControl variant="filled" className={this.classes.formControl}>
                    <Autocomplete
                      id="searchState"
                      sx={{ width: 300 }}
                      options={stateOptions}
                      onChange={this.onLocationChange}
                      autoHighlight
                      placeholder="Type or select Cooperating agencies"
                      getOptionLabel={(option) => option.label}
                      renderOption={(props, option) => <>{option.label}</>}
                      value={stateOptions.filter((stateObj) =>
                        this.state.state.includes(stateObj.value),
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Type or Select States"
                          inputProps={{
                            ...params.inputProps,
                            autoComplete: 'Type or Select States', // disable autocomplete and autofill
                          }}
                        />
                      )}
                    />
                  </FormControl>
                  <Divider />
                </Box>
              </div> */}
              {/* <Box className={this.classes.box}>
                <FormControl variant="filled" className={this.classes.formControl}>
                  <Autocomplete
                    disablePortal
                    sx={{}}
                    className={this.classes.autocomplete}
                    renderInput={(params) => (
                      <TextField
                        className={this.classes.autocomplete}
                        id="searchState"
                        classNamePrefix="react-select"
                        isMulti
                        name="state"
                        isSearchable
                        isClearable
                        styles={customStyles}
                        tabIndex="5"
                        options={stateOptions}
                        onChange={this.onLocationChange}
                        value={stateOptions.filter((stateObj) =>
                          this.state.state.includes(stateObj.value),
                        )}
                        placeholder="Type or select states"
                        sx={{
                          p: 0,
                          m: 0,
                          width: '100%',
                          minWidth: 300,
                        }}
                      />
                    )}
                  />
                </FormControl>
                <Divider />
              </Box> */}
              {/* <div>
                <Box className={this.classes.box}>
                  <FormControl variant="filled" className={this.classes.formControl}>
                    <Autocomplete
                      id="searchCounty"
                      sx={{ width: 300 }}
                      options={this.state.countyOptions}
                      autoHighlight
                      placeholder="Type or Select a County"
                      getOptionLabel={(option) => option.label}
                      renderOption={(props, option) => <>{option.label}</>}
                      name="county"
                      tabIndex="6"
                      onChange={this.onCountyChange}
                      value={this.state.countyOptions.filter((countyObj) =>
                        this.state.county.includes(countyObj.value),
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Type or Select States"
                          inputProps={{
                            ...params.inputProps,
                            autoComplete: 'Type or Select States', // disable autocomplete and autofill
                          }}
                        />
                      )}
                    />
                  </FormControl>
                  <Divider />
                </Box>
              </div> */}
              {/* <Box className={this.classes.box}>
                <FormControl variant="filled" className={this.classes.formControl}>
                  <Autocomplete
                    disablePortal
                    sx={{}}
                    className={this.classes.autocomplete}
                    renderInput={(params) => (
                      <TextField
                        className={this.classes.autocomplete}
                        id="searchCounty"
                        classNamePrefix="react-select"
                        name="county"
                        tabIndex="6"
                        options={this.state.countyOptions}
                        onChange={this.onCountyChange}
                        value={this.state.countyOptions.filter((countyObj) =>
                          this.state.county.includes(countyObj.value),
                        )}
                        placeholder="Type or select a county"
                        sx={{
                          p: 0,
                          m: 0,
                          width: '100%',
                          minWidth: 300,
                        }}
                      />
                    )}
                  />
                </FormControl>
                <Divider />
              </Box> */}

              <div hidden={!Globals.authorized()}>
                <div className="dropdown-group-end" hidden={!Globals.curatorOrHigher()}></div>
                {/*
                <Box className={this.classes.box}>
                  <FormControl variant="filled" className={this.classes.formControl}>
                    <Autocomplete
                      disablePortal
                      sx={{}}
                      className={this.classes.autocomplete}
                      renderInput={(params) => (
                        <Input
                          className={this.classes.autocomplete}
                          id="searchAction"
                          classNamePrefix="react-select"
                          name="action"
                          tabIndex="7"
                          options={actionOptions}
                          onChange={this.onActionChange}
                          value={this.state.actionRaw}
                          placeholder="Type or select action type"
                          sx={{
                            p: 0,
                            m: 0,
                            width: '100%',
                            minWidth: 300,
                          }}
                        />
                      )}
                    />
                  </FormControl>
                  <Divider />
                </Box> */}
                {/* <Box className={this.classes.box}>
                  <FormControl variant="filled" className={this.classes.formControl}>
                    <Autocomplete
                      disablePortal
                      sx={{}}
                      className={this.classes.autocomplete}
                      renderInput={(params) => (
                        <Input
                          className={this.classes.autocomplete}
                          id="searchAction"
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
                          sx={{
                            p: 0,
                            m: 0,
                            width: '100%',
                            minWidth: 300,
                          }}
                        />
                      )}
                    />
                  </FormControl>
                  <Divider />
                </Box> */}
                {/* <Box className={this.classes.box}>
                  <FormControl variant="filled" className={this.classes.formControl}>

                    <Autocomplete
                      disablePortal
                      sx={{}}
                      className={this.classes.autocomplete}
                      renderInput={(params) => (
                        <Input
                          className={this.classes.autocomplete}
                          id="searchDecision"
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
                          placeholder="Type or select a decision"
                          sx={{
                            p: 0,
                            m: 0,
                            width: '100%',
                            minWidth: 300,
                          }}
                        />
                      )}
                    />
                  </FormControl>
                  <Divider />
                </Box> */}
              </div>
              <Divider />

              <Box className={this.classes.box}>
                <span className="sidebar-date-text">From</span>
                <DatePicker
                  type="date"
                  onChange={this.onStartDateChange}
                  onKeyDown={this.onKeyDown}
                  placeholder="YYYY-MM-DD"
                  ref={(ref) => (this.datePickerStart = ref)}
                  value={this.state.startPublish}
                  tabIndex="9"
                  className={this.classes.datePicker}
                  sx={{
                    p: 0,
                    m: 0,
                    minWidth: 220,
                    width: '100%',
                  }}
                />
                {/* <DatePicker
                    adjustDateOnChange
                    className="sidebar-date"
                    dateFormat="yyyy-MM-dd"
                    isClearable
                    onChange={this.onStartDateChange}
                    onKeyDown={this.onKeyDown}
                    placeholderText="YYYY-MM-DD"
                    popperPlacement="right"
                    ref={(ref) => (this.datePickerStart = ref)}
                    selected={this.state.startPublish}
                    showMonthDropdown={true}
                    showYearDropdown={true}
                    tabIndex="9"
                    // preventOpenOnFocus={true}
                  /> */}
                {/* <span className="sidebar-date-text">To</span>
                    <TextField
                      type= "date"
                      ref={(ref) => (this.datePickerEnd = ref)}
                      onChange={this.onEndDateChange}
                      onKeyDown={this.onKeyDown}
                      placeholder="YYYY-MM-DD"
                      value={this.state.endPublish}
                      className={this.classes.datePicker}
                      tabIndex="10"
                      sx={{
                        p: 0,
                        m: 0,
                        minWidth: 220,
                        width: '100%',
                      }}
                    /> */}
              </Box>
              {/* <DatePicker
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
                  /> */}

              <div className="sidebar-hr"></div>

              <div className="filter">
                <label className="sidebar-label-date">Document Type</label>
                <div className="sidebar-checkboxes">
                  <div className="checkbox-container">
                    <label className="clickable checkbox-text">
                      <Checkbox
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
                      <Checkbox
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
                      <Checkbox
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
                      <Checkbox
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
                    <Checkbox className="clickable checkbox-text">
                      <input
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
                    </Checkbox>
                  </div>
                  <div className="checkbox-container">
                    <label className="clickable checkbox-text">
                      <DatePicker
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
                <div className="sidebar-hr"></div>

                <label className="sidebar-label-date">Advanced</label>
                <div className="sidebar-checkboxes">
                  <label className="checkbox-text" htmlFor="typeFinal">
                    Apply filters to search query
                  </label>
                </div>
              </div>
            </div>
            <div hidden={this.state.hideOrganization} id="agency-svg-holder">
              <button onClick={this.orgClick}>x</button>
            </div>
          </>
        );
    }

    orgClick = () => {
        this.setState({hideOrganization: !this.state.hideOrganization})
    }

    componentWillUnmount() { // For if user navigates away using top menu
		persist.setItem('appState', JSON.stringify(this.state));
	}

	// After render
	componentDidMount() {
        try {
            Globals.registerListener('geoFilter', this.geoFilter);

            // For if user navigates back using top menu
            const rehydrate = JSON.parse(persist.getItem('appState'));

            // Need to restore last searched term to support on-demand highlighting in case user navigates away from
            // and back to Search, using the top menu
            if(rehydrate.lastSearchedTerm) {
                rehydrate.titleRaw = rehydrate.lastSearchedTerm;
                this._lastSearchTerms = rehydrate.lastSearchedTerm;
            }

            // console.log(rehydrate.startPublish);
            // console.log(new Date(rehydrate.startPublish));

            if(typeof(rehydrate.startPublish) === "string"){
                rehydrate.startPublish = Globals.getCorrectDate(rehydrate.startPublish);
            } // else number

            if(typeof(rehydrate.endPublish) === "string"){
                rehydrate.endPublish = Globals.getCorrectDate(rehydrate.endPublish);
            }
            rehydrate.isDirty = false;
            rehydrate.surveyChecked = true;
            rehydrate.surveyDone = true;
            this.setState(rehydrate);
        }
        catch(e) {
            // do nothing
        }

        this.getCounts();

        // Get search params on mount and run search on them (implies came from landing page)
        // console.log("Search mounted, doing search from parameters.");
        this.doSearchFromParams();
	}

    componentDidUpdate() {
    }


    post = (postUrl, dataForm) => {
        axios({
            url: postUrl,
            method: 'POST',
            data: dataForm
        }).then(_response => {
            const rsp = this.resp += (JSON.stringify({data: _response.data, status: _response.status}));
            this.setState({
                server_response: rsp
            }, () => {
                console.log(this.state.server_response);
            });
            // let responseOK = response && response.status === 200;
        }).catch(error => { // redirect
            console.error(error);
        })
    }


    surveyClick = (evt) => {
        this.setState({
            surveyResult: evt.target.value,
            surveyChecked: true
        })
    }

    revert = (evt) => {
        this.setState({
            surveyChecked: false
        })
    }

    surveySubmit = () => {
        this.setState({
            surveyDone: true
        }, () => {
            const postUrl = new URL('survey/save', Globals.currentHost);
            const dataForm = new FormData();

            dataForm.append('surveyResult', this.state.surveyResult);
            if(!parseTerms(this._lastSearchTerms)) {
                dataForm.append('searchTerms', "");
            } else {
                dataForm.append('searchTerms', parseTerms(this._lastSearchTerms));
            }

            this.post(postUrl,dataForm);
        })
    }


}

//export default withRouter((withStyles(styles))(Search));
export default withRouter(withStyles(styles)(Search))
//export default withRouter(Search);

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

    str = str.replace(/"(.+)"[\s]*~[\s]*([0-9]+)/g, "\"$1\"~$2"); // "this" ~ 100 -> "this"~100

    // so this regex works correctly, but after replacing, it matches internal single quotes again.
    // Therefore we shouldn't even run this if there are already double quotes.
    // If the user is using double quotes already, we don't need to try to help them out anyway.
    if(!str.includes('"')) {
        str = str.replace(/([\s]|^)'(.+)'([\s]|$)/g, "$1\"$2\"$3"); // 'this's a mistake' -> "this's a mistake"
    }

    return str;
}