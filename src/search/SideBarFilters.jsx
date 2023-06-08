import React, { useState, useEffect } from 'react';.
import { Paper, Button, Input, Box, Divider, FormControl,Select, Autocomplete, InputLabel,ListItem,IconButton, TextField, Typography, Container, FormLabel } from '@mui/material';
import { styled } from '@mui/material/styles';
import theme from '../styles/theme';
//import Grid from '@mui/material/Grid'; // Grid version 1
import Grid from '@mui/material/Unstable_Grid2';
import { InputAdornment, SearchOutlined } from '@mui/icons-material';
import { proximityOptions, actionOptions, decisionOptions,agencyOptions,stateOptions,countyOptions} from '../search/options';
import SearchFilter from './SearchFilter';
import { makeStyles } from '@mui/styles';
import Globals from '../globals';


      const [state,setState] = useState({
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
        decision : '',
        decisionRaw: '',
        endComment: null,
        endPublish: null,
        fragmentSizeValue: 2,
        hideOrganization: false,
        iconClassName: 'icon icon--effect',
        isDirty: false,
        limit: 100,
        markup: true,
        needsComments: false,
        needsComments: false,
        needsDocument: false,
        needsDocument: false,  
        offset: 0,
        optionsChecked: true,
        optionsChecked: true,
        proximityDisabled: true,
        proximityOptions: null,
        search: '',
        searchOptions: [],
        searchOptionsChecked: false,
        searchOptionsChecked: false,
        startComment: null,
        startPublish: null,
        state: [],
        stateRaw: '',
        stateRaw: [],
        surveyChecked: true,
        surveyDone: false,
        test: Globals.enum.options,
        tooltipOpen: undefined,
        typeAll: true,
        typeDraft : true,
        typeEA : true,
        typeEAFinal : false,
        typeEAFinalFinal : false,
        typeFinal : true,
        typeNOI : false,
        typeNOIFinal : false,
        typeOther: false,
        typeROD : false,
        typeRODFinal : false,
        typeRODFinalFinal : false,
        typeScoping: false, 
        
      }),
      const debouncedSearch = _.debounce(props.search, 300);
      const filterBy = props.filterResultsBy;
  // this.filterBy = _.debounce(this.props.filterResultsBy, 200);

  this.debouncedSuggest = _.debounce(this.props.suggest, 300);

  this.myRef = React.createRef();

doSearch = (terms) => {
      setState({ ...state, 
        search: terms ,
        searchOptionsChecked: false,
        _lastSearchTerms: terms,
        titleRaw: parseTerms(terms),
        _lastSearchedTerm: parseTerms(terms),
        surveyChecked : false,
        surveyDone : false,
        isDirty : true,
      })
      debouncedSearch(state);
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
      setProximityValues(this.handleProximityValues(queryString));

        setlastSearchTerms(queryString);
          setTitleRaw(parseTerms(queryString)),
          setProximityDisabled(proximityValues.disableValue),
          setSurveyChecked(false),
          setSurveyDone(false),
          setIsDirty(true);
          setInputMessage(proximityValues._inputMessage);
     
          if(titleRaw){
              // console.log("Firing search with query param");
              setDebouncedSearch(state);
          }
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
  doSearch(titleRaw);
}
/** clears and disables proximity search option as well as clearing text */
onClearClick = (evt) => {
      setTitleRaw(''); 
      setProximityDisabledSet(true); 
      setProximityOption(null); 
      setInputMessage(""); 
  
     inputSearch.focus();
      // this.debouncedSuggest();
}

onClearFiltersClick = () => {
  setState(...{
      // titleRaw: '',
      StartPublish: null,
      EndPublish: null,
      StartComment: null,
      EndComment: null,
      Agency: [],
      AgencyRaw: [],
      CooperatingAgency: [],
      CooperatingAgencyRaw: [],
      State: [],
      StateRaw: [],
      County: [],
      CountyRaw: [],
      Decision: [],
      DecisionRaw: [],
      Action: [],
      ActionRaw: [],
      TypeAll: true,
      TypeFinal: false,
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
      this.doSearch(titleRaw);
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
      // this.debouncedSuggest(titleRaw);
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
      const indexIfExists = state.indexOf(geodata.abbrev);
      let _stateRaw = stateRaw;
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
      const indexIfExists = county.indexOf(geodata.abbrev);
      let _countyRaw = countyRaw;
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
      this.onCountyChange(countyOptions.filter(countyObj => county.includes(countyObj.value)));
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
 setState(...state, 
{ 
  county: countyValues,
  countyRaw: evt
});
}

onProximityChange = (evt) => {
  if(evt.value === -1) {
      this.setState(...{
          proximityOption: null
      });
  } else {
      this.setState({ ...state, 
          proximityOption: evt,
      })
}
}

onTitleOnlyChecked = (evt) => {
  if(evt.target.checked) {
      this.setState({
          searchOption: "C" // Title only
      });
  } else {
      setState(...state,{
          searchOption: "B" // Both fields, Lucene default scoring
      });
  }
}

getSearchBarText = () => {
  if(searchOption && searchOption === "C") { // title only
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
      needsDocument: !needsDocument
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
  this.setState({tooltipOpen: !tooltipOpen})
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
  if( startPublish ||
      endPublish ||
      startComment ||
      endComment ||
      agency.length > 0 ||
      cooperatingAgency.length > 0 ||
      state.length > 0 ||
      county.length > 0 ||
      decision.length > 0 ||
      action.length > 0 ||
      typeFinal ||
      typeDraft ||
      typeEA ||
      typeNOI ||
      typeROD ||
      typeScoping ||
      typeOther ||
      needsComments ||
      needsDocument)
  {
      return true;
  }
}

toggleFiltersHidden = () => {
  this.setState({
      filtersHidden: !filtersHidden
  }, () => {
      this.props.filterToggle(filtersHidden);
  });
}

renderClearFiltersButton = () => {
  if(this.filtersActive()) {
      return <div className={filtersHidden === false ? "margin height-30 right" : "clear-filters-hidden"}>
          <span id="clear-filters" className="link" onClick={() => this.onClearFiltersClick()}>Clear filters</span>
      </div>;
  }
}

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    // textAlign: 'center',
    color: theme.palette.text.secondary,
    elevation:0,
    border: 0, 
    borderRadius: 0,
    mt: 1,
    mb: 1,
    pl: 0,
    pr:0,
    "&:hover": {
      //           backgroundColor: //theme.palette.grey[200],
        boxShadow: '0px 4px 8px rgba(0.5, 0.5, 0.5, 0.15)',
        cursor: "pointer",
        "& .addIcon": {
          color: "purple"
        }
      }}));
const useStyles = makeStyles((theme) => ({
    formControl: {
    },
}));

export default function SideBarFilters(){
    const [search, setSearch] = useState('');
    const [county, setCounty] = useState('');
    const [location, setLocation] = useState('');
    const [proximity, setProximity] = useState('');
    const [selectedCounty, setSelectedCounty] = useState('');
    const [agencyRaw, setAgencyRaw] = useState('');
    const [proximityDisabled, setProximityDisabled] = useState(true);
    const [proximityOptionValue , setProximityOptionValue] = useState('');
    const [actionRaw, setActionRaw] = useState('');
    const classes = useStyles(theme);
    return(
        <>
            <Item>
                <SearchFilter filter={{
                  className: classes.formControl,
                  placeholder: 'Find within',
                  variant:"standard",
                  id:"proximity-select",
                  className: ((proximityDisabled) ? ' disabled' : ''),
                  // classNamePrefix="react-select control"
                  placeholder:"Keyword distance",
                  options:{proximityOptions},
                  value:{proximityOptionValue},
                  // menuIsOpen={true}
                  onChange:{onProximityChange},
                  label: 'Distance between search terms',
                  tabIndex: '1',
                }} />
                
            </Item>

            <Item>
                <SearchFilter filter={{
                  className: classes.formControl,
                  placeholder: 'Type or Select Lead Agencies',
                  value: (agencyRaw ? agencyRaw : ''),
                  onChange: onAgencyChange,
                  id: 'searchAgency',
                  type: Autocomplete,
                  options: agencyOptions,
                  label: 'Lead Agencies',
                  tabIndex: '3',
                }} />
            </Item>
           <Item>
               <SearchFilter filter={{
                  className: classes.formControl,
                  placeholder: 'Type or select Cooperating agencies',
                  value: (agencyRaw ? agencyRaw : ''),
                  onChange: onAgencyChange,
                  id: 'searchAgency',
                  name: 'cooperatingAgency',
                  type: Autocomplete,
                  options: agencyOptions,
                  label: 'Cooperating Agencies',
                  tabIndex: '4',
                }} />
           </Item>
          <Divider />
          <Item>
            <SearchFilter filter={{
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
            }} />

          </Item>

          <Item>
            <SearchFilter filter={{
              className: classes.formControl,
              placeholder: 'Type or Select a County',
              value: (countyOptions.filter(countyObj => county.includes(countyObj.value))),
              onChange: countyChange,
              id: 'searchCounty',
              name: 'county',
              type: Autocomplete,
              options: countyOptions,
              label: 'County / counties',
              tabIndex: '6',
            }} />
          </Item>
        </>
    )
}