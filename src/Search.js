import React from 'react';

import Select from 'react-select';
import DatePicker from "react-datepicker";

import './css/tabulator.css';
import "./search.css";
import "./sidebar.css";

import "react-datepicker/dist/react-datepicker.css";
import 'react-tippy/dist/tippy.css';
import {Tooltip,} from 'react-tippy';

import globals from './globals.js';
import persist from './persist.js';

import { withRouter } from "react-router";

// import PropTypes from "prop-types";

const _ = require('lodash');

class Search extends React.Component {

	// static propTypes = {
        // match: PropTypes.object.isRequired,
        // location: PropTypes.object.isRequired,
        // history: PropTypes.object.isRequired
    // };

    constructor(props) {
        super(props);
		this.state = {
            titleRaw: '',
            startPublish: null,
            endPublish: null,
            startComment: null,
            endComment: null,
            agency: [],
            state: [],
            typeAll: true,
            typeFinal: false,
            typeDraft: false,
            typeOther: false,
            needsComments: false,
            needsDocument: false,
            optionsChecked: true,
            iconClassName: 'icon icon--effect',
            limit: 100,
            offset: 0,
            searchOption: "B",
            test: globals.anEnum.options
		};
        this.debouncedSearch = _.debounce(this.props.search, 300);
        this.filterBy = this.props.filterResultsBy;
        // this.filterBy = _.debounce(this.props.filterResultsBy, 200);

        this.myRef = React.createRef();
    }
    
    /**
     * Event handlers
     */  

    onIconClick = (evt) => {
        this.debouncedSearch(this.state);
    }
    onClearClick = (evt) => {
        this.setState({ titleRaw: '' }); 
    }

    onRadioChange = (evt) => {
        this.setState({ [evt.target.name]: evt.target.value }, () => {
            // this.debouncedSearch(this.state);
        });
    }

    onKeyUp = (evt) => {        
        if(evt.keyCode === 13){
            evt.preventDefault();
            this.debouncedSearch(this.state);
        }
    }

	onInput = (evt) => {
		//get the evt.target.name (defined by name= in input)
		//and use it to target the key on our `state` object with the same name, using bracket syntax
		this.setState( 
		{ 
            [evt.target.name]: evt.target.value,
        }, () => { // auto-searching is currently too expensive until asynchronous results
            // this.debouncedSearch(this.state);
        });
    }

    // suppress warning that there's no onChange event, handler (despite onChange rarely being the best event to take advantage of)
    onChangeHandler = (evt) => {
        // do nothing
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
	onLocationChange = (evt) => {
		var stateValues = [];
		for(var i = 0; i < evt.length; i++){
			stateValues.push(evt[i].value);
		}
        this.setState( 
		{ 
			state: stateValues,
            stateRaw: evt
		}, () => { 
			this.filterBy(this.state);
        });
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
    onEndDateChange = (date) => { 
        this.setState( { endPublish: date }, () => { 
			this.filterBy(this.state);
            // this.debouncedSearch(this.state); 
        }); 
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

    render () {
        // const { history } = this.props;

        const customStyles = {
            option: (styles, state) => ({
                 ...styles,
                borderBottom: '1px dotted',
	            backgroundColor: 'white',
                color: 'black',
                '&:hover': {
                    backgroundColor: 'lightgreen'
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

        const agencyOptions = [	{ value: 'ACHP', label: 'Advisory Council on Historic Preservation (ACHP)' },{ value: 'USAID', label: 'Agency for International Development (USAID)' },{ value: 'ARS', label: 'Agriculture Research Service (ARS)' },{ value: 'APHIS', label: 'Animal and Plant Health Inspection Service (APHIS)' },{ value: 'AFRH', label: 'Armed Forces Retirement Home (AFRH)' },{ value: 'BPA', label: 'Bonneville Power Administration (BPA)' },{ value: 'BIA', label: 'Bureau of Indian Affairs (BIA)' },{ value: 'BLM', label: 'Bureau of Land Management (BLM)' },{ value: 'USBM', label: 'Bureau of Mines (USBM)' },{ value: 'BOEM', label: 'Bureau of Ocean Energy Management (BOEM)' },{ value: 'BOP', label: 'Bureau of Prisons (BOP)' },{ value: 'BR', label: 'Bureau of Reclamation (BR)' },{ value: 'Caltrans', label: 'California Department of Transportation (Caltrans)' },{ value: 'CHSRA', label: 'California High-Speed Rail Authority (CHSRA)' },{ value: 'CIA', label: 'Central Intelligence Agency (CIA)' },{ value: 'NYCOMB', label: 'City of New York, Office of Management and Budget (NYCOMB)' },{ value: 'CDBG', label: 'Community Development Block Grant (CDBG)' },{ value: 'CTDOH', label: 'Connecticut Department of Housing (CTDOH)' },{ value: 'BRAC', label: 'Defense Base Closure and Realignment Commission (BRAC)' },{ value: 'DLA', label: 'Defense Logistics Agency (DLA)' },{ value: 'DNA', label: 'Defense Nuclear Agency (DNA)' },{ value: 'DNFSB', label: 'Defense Nuclear Fac. Safety Board (DNFSB)' },{ value: 'DSA', label: 'Defense Supply Agency (DSA)' },{ value: 'DRB', label: 'Delaware River Basin Commission (DRB)' },{ value: 'DC', label: 'Denali Commission (DC)' },{ value: 'USDA', label: 'Department of Agriculture (USDA)' },{ value: 'DOC', label: 'Department of Commerce (DOC)' },{ value: 'DOD', label: 'Department of Defense (DOD)' },{ value: 'DOE', label: 'Department of Energy (DOE)' },{ value: 'HHS', label: 'Department of Health and Human Services (HHS)' },{ value: 'DHS', label: 'Department of Homeland Security (DHS)' },{ value: 'HUD', label: 'Department of Housing and Urban Development (HUD)' },{ value: 'DOJ', label: 'Department of Justice (DOJ)' },{ value: 'DOL', label: 'Department of Labor (DOL)' },{ value: 'DOS', label: 'Department of State (DOS)' },{ value: 'DOT', label: 'Department of Transportation (DOT)' },{ value: 'TREAS', label: 'Department of Treasury (TREAS)' },{ value: 'VA', label: 'Department of Veteran Affairs (VA)' },{ value: 'DOI', label: 'Department of the Interior (DOI)' },{ value: 'DEA', label: 'Drug Enforcement Administration (DEA)' },{ value: 'EDA', label: 'Economic Development Administration (EDA)' },{ value: 'ERA', label: 'Energy Regulatory Administration (ERA)' },{ value: 'ERDA', label: 'Energy Research and Development Administration (ERDA)' },{ value: 'EPA', label: 'Environmental Protection Agency (EPA)' },{ value: 'FSA', label: 'Farm Service Agency (FSA)' },{ value: 'FHA', label: 'Farmers Home Administration (FHA)' },{ value: 'FAA', label: 'Federal Aviation Administration (FAA)' },{ value: 'FCC', label: 'Federal Communications Commission (FCC)' },{ value: 'FEMA', label: 'Federal Emergency Management Agency (FEMA)' },{ value: 'FEA', label: 'Federal Energy Administration (FEA)' },{ value: 'FERC', label: 'Federal Energy Regulatory Commission (FERC)' },{ value: 'FHWA', label: 'Federal Highway Administration (FHWA)' },{ value: 'FMC', label: 'Federal Maritime Commission (FMC)' },{ value: 'FMSHRC', label: 'Federal Mine Safety and Health Review Commission (FMSHRC)' },{ value: 'FMCSA', label: 'Federal Motor Carrier Safety Administration (FMCSA)' },{ value: 'FPC', label: 'Federal Power Commission (FPC)' },{ value: 'FRA', label: 'Federal Railroad Administration (FRA)' },{ value: 'FRBSF', label: 'Federal Reserve Bank of San Francisco (FRBSF)' },{ value: 'FTA', label: 'Federal Transit Administration (FTA)' },{ value: 'USFWS', label: 'Fish and Wildlife Service (USFWS)' },{ value: 'FDOT', label: 'Florida Department of Transportation (FDOT)' },{ value: 'FDA', label: 'Food and Drug Administration (FDA)' },{ value: 'USFS', label: 'Forest Service (USFS)' },{ value: 'GSA', label: 'General Services Administration (GSA)' },{ value: 'USGS', label: 'Geological Survey (USGS)' },{ value: 'GLB', label: 'Great Lakes Basin Commission (GLB)' },{ value: 'IHS', label: 'Indian Health Service (IHS)' },{ value: 'IRS', label: 'Internal Revenue Service (IRS)' },{ value: 'IBWC', label: 'International Boundary and Water Commission (IBWC)' },{ value: 'ICC', label: 'Interstate Commerce Commission (ICC)' },{ value: 'JCS', label: 'Joint Chiefs of Staff (JCS)' },{ value: 'MARAD', label: 'Maritime Administration (MARAD)' },{ value: 'MTB', label: 'Materials Transportation Bureau (MTB)' },{ value: 'MSHA', label: 'Mine Safety and Health Administration (MSHA)' },{ value: 'MMS', label: 'Minerals Management Service (MMS)' },{ value: 'MESA', label: 'Mining Enforcement and Safety (MESA)' },{ value: 'MRB', label: 'Missouri River Basin Commission (MRB)' },{ value: 'NASA', label: 'National Aeronautics and Space Administration (NASA)' },{ value: 'NCPC', label: 'National Capital Planning Commission (NCPC)' },{ value: 'NGA', label: 'National Geospatial-Intelligence Agency (NGA)' },{ value: 'NHTSA', label: 'National Highway Traffic Safety Administration (NHTSA)' },{ value: 'NIGC', label: 'National Indian Gaming Commission (NIGC)' },{ value: 'NIH', label: 'National Institute of Health (NIH)' },{ value: 'NMFS', label: 'National Marine Fisheries Service (NMFS)' },{ value: 'NNSA', label: 'National Nuclear Security Administration (NNSA)' },{ value: 'NOAA', label: 'National Oceanic and Atmospheric Administration (NOAA)' },{ value: 'NPS', label: 'National Park Service (NPS)' },{ value: 'NSF', label: 'National Science Foundation (NSF)' },{ value: 'NSA', label: 'National Security Agency (NSA)' },{ value: 'NTSB', label: 'National Transportation Safety Board (NTSB)' },{ value: 'NRCS', label: 'Natural Resource Conservation Service (NRCS)' },{ value: 'NER', label: 'New England River Basin Commission (NER)' },{ value: 'NJDEP', label: 'New Jersey Department of Environmental Protection (NJDEP)' },{ value: 'NRC', label: 'Nuclear Regulatory Commission (NRC)' },{ value: 'OCR', label: 'Office of Coal Research (OCR)' },{ value: 'OSM', label: 'Office of Surface Mining (OSM)' },{ value: 'OBR', label: 'Ohio River Basin Commission (OBR)' },{ value: 'RSPA', label: 'Research and Special Programs (RSPA)' },{ value: 'REA', label: 'Rural Electrification Administration (REA)' },{ value: 'RUS', label: 'Rural Utilities Service (RUS)' },{ value: 'SEC', label: 'Security and Exchange Commission (SEC)' },{ value: 'SBA', label: 'Small Business Administration (SBA)' },{ value: 'SCS', label: 'Soil Conservation Service (SCS)' },{ value: 'SRB', label: 'Souris-Red-Rainy River Basin Commission (SRB)' },{ value: 'STB', label: 'Surface Transportation Board (STB)' },{ value: 'SRC', label: 'Susquehanna River Basin Commission (SRC)' },{ value: 'TVA', label: 'Tennessee Valley Authority (TVA)' },{ value: 'TxDOT', label: 'Texas Department of Transportation (TxDOT)' },{ value: 'TPT', label: 'The Presidio Trust (TPT)' },{ value: 'TDA', label: 'Trade and Development Agency (TDA)' },{ value: 'USACE', label: 'U.S. Army Corps of Engineers (USACE)' },{ value: 'USCG', label: 'U.S. Coast Guard (USCG)' },{ value: 'CBP', label: 'U.S. Customs and Border Protection (CBP)' },{ value: 'RRB', label: 'U.S. Railroad Retirement Board (RRB)' },{ value: 'USAF', label: 'United States Air Force (USAF)' },{ value: 'USA', label: 'United States Army (USA)' },{ value: 'USMC', label: 'United States Marine Corps (USMC)' },{ value: 'USN', label: 'United States Navy (USN)' },{ value: 'USPS', label: 'United States Postal Service (USPS)' },{ value: 'USTR', label: 'United States Trade Representative (USTR)' },{ value: 'UMR', label: 'Upper Mississippi Basin Commission (UMR)' },{ value: 'UMTA', label: 'Urban Mass Transportation Administration (UMTA)' },{ value: 'UDOT', label: 'Utah Department of Transportation (UDOT)' },{ value: 'WAPA', label: 'Western Area Power Administration (WAPA)' }
        ];
        const stateOptions = [ { value: 'AK', label: 'Alaska' },{ value: 'AL', label: 'Alabama' },{ value: 'AQ', label: 'Antarctica' },{ value: 'AR', label: 'Arkansas' },{ value: 'AS', label: 'American Samoa' },{ value: 'AZ', label: 'Arizona' },{ value: 'CA', label: 'California' },{ value: 'CO', label: 'Colorado' },{ value: 'CT', label: 'Connecticut' },{ value: 'DC', label: 'District of Columbia' },{ value: 'DE', label: 'Delaware' },{ value: 'FL', label: 'Florida' },{ value: 'GA', label: 'Georgia' },{ value: 'GU', label: 'Guam' },{ value: 'HI', label: 'Hawaii' },{ value: 'IA', label: 'Iowa' },{ value: 'ID', label: 'Idaho' },{ value: 'IL', label: 'Illinois' },{ value: 'IN', label: 'Indiana' },{ value: 'KS', label: 'Kansas' },{ value: 'KY', label: 'Kentucky' },{ value: 'LA', label: 'Louisiana' },{ value: 'MA', label: 'Massachusetts' },{ value: 'MD', label: 'Maryland' },{ value: 'ME', label: 'Maine' },{ value: 'MI', label: 'Michigan' },{ value: 'MN', label: 'Minnesota' },{ value: 'MO', label: 'Missouri' },{ value: 'MS', label: 'Mississippi' },{ value: 'MT', label: 'Montana' },{ value: 'Multi', label: 'Multiple' },{ value: 'NAT', label: 'National' },{ value: 'NC', label: 'North Carolina' },{ value: 'ND', label: 'North Dakota' },{ value: 'NE', label: 'Nebraska' },{ value: 'NH', label: 'New Hampshire' },{ value: 'NJ', label: 'New Jersey' },{ value: 'NM', label: 'New Mexico' },{ value: 'NV', label: 'Nevada' },{ value: 'NY', label: 'New York' },{ value: 'OH', label: 'Ohio' },{ value: 'OK', label: 'Oklahoma' },{ value: 'OR', label: 'Oregon' },{ value: 'PA', label: 'Pennsylvania' },{ value: 'PRO', label: 'Programmatic' },{ value: 'PR', label: 'Puerto Rico' },{ value: 'RI', label: 'Rhode Island' },{ value: 'SC', label: 'South Carolina' },{ value: 'SD', label: 'South Dakota' },{ value: 'TN', label: 'Tennessee' },{ value: 'TT', label: 'Trust Territory of the Pacific Islands' },{ value: 'TX', label: 'Texas' },{ value: 'UT', label: 'Utah' },{ value: 'VA', label: 'Virginia' },{ value: 'VI', label: 'Virgin Islands' },{ value: 'VT', label: 'Vermont' },{ value: 'WA', label: 'Washington' },{ value: 'WI', label: 'Wisconsin' },{ value: 'WV', label: 'West Virginia' },{ value: 'WY', label: 'Wyoming' }
        ];
        const tooltipTitle = "<p class=tooltip-line><span class=bold>Search Tips</span></p>"
        + "<p class=&quot;tooltip-line&quot;>&bull; Search for words in the title and document text.</p>"
        + "<p class=&quot;tooltip-line&quot;>&bull; <span class=bold>All</span> words you enter must be found together to return a result.</p>"
        + "<p class=&quot;tooltip-line&quot;>&bull; Type OR (all caps) to search for <span class=bold>any</span> of those words.</p>"
        + "<p class=&quot;tooltip-line&quot;>&bull; Type NOT (all caps) to <span class=bold>exclude</span> a word or phrase.</p>"
        + "<p class=&quot;tooltip-line&quot;>&bull; Surround words with quotes(&quot; &quot;) to search for an <span class=bold>exact phrase.</span></p>";

        return (
            <>
            <div className="content" onSubmit={this.submitHandler}>
                <h1 className="search-header">Search for NEPA documents</h1>
                <div className="search-holder" >

                    <div className="pre-checkbox-bar"></div>
                    <div className="input-bar">
                        <input id="check1" className="pre-search-input" type="checkbox" 
                                checked={this.state.searchOption==="C"}
                                onChange={this.onTitleOnlyChecked}
                                disabled={this.props.searching} />
                        <label className="sidebar-check-label" htmlFor="check1">
                            Search only within titles
                        </label>
                    </div>
                    
                    <div className="search-bar-holder">

                        <div className="pre-input-bar">
                            <Tooltip 
                                className="cursor-default no-select"
                                position="bottom"
                                // arrow="true"
                                size="small"
                                // distance="80"
                                // offset="80"
                                // open="true"
                                title={tooltipTitle}
                            >
                                <svg className="cursor-default no-select" id="tooltip3" width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M31.1311 16.5925C31.1311 24.7452 24.4282 31.3772 16.1311 31.3772C7.83402 31.3772 1.1311 24.7452 1.1311 16.5925C1.1311 8.43982 7.83402 1.80774 16.1311 1.80774C24.4282 1.80774 31.1311 8.43982 31.1311 16.5925Z" fill="#E5E5E5" stroke="black" strokeWidth="2"/>
                                    <text className="bold" x="13" y="22" text-align="center" fill="black">?</text>
                                </svg>
                                {/* <span id="tooltip3Mark" className="cursor-default no-select">?</span> */}
                            </Tooltip>
                        </div>

                        <input className="search-bar" 
                            name="titleRaw" 
                            placeholder="Search by keywords within document title or text" 
                            value={this.state.titleRaw}
                            autoFocus 
                            onChange={this.onChangeHandler}
                            onInput={this.onInput} onKeyUp={this.onKeyUp}
                            disabled={this.props.searching}
                        />
                        <svg onClick={this.onIconClick} className="search-icon" width="39" height="38" viewBox="0 0 39 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M26.4582 24.1397H28.2356L37.7751 33.3063C38.6976 34.1886 38.6976 35.6303 37.7751 36.5125C36.8526 37.3947 35.3452 37.3947 34.4228 36.5125L24.8607 27.3674V25.6675L24.2533 25.065C21.1034 27.6471 16.8061 28.9813 12.2388 28.2496C5.98416 27.2383 0.989399 22.2462 0.224437 16.2212C-0.945506 7.11911 7.0641 -0.541243 16.5811 0.577685C22.8808 1.30929 28.1006 6.08626 29.158 12.0682C29.923 16.4363 28.5281 20.5463 25.8282 23.5588L26.4582 24.1397ZM4.61171 14.4567C4.61171 19.8146 9.13399 24.1397 14.7362 24.1397C20.3384 24.1397 24.8607 19.8146 24.8607 14.4567C24.8607 9.09875 20.3384 4.77366 14.7362 4.77366C9.13399 4.77366 4.61171 9.09875 4.61171 14.4567Z" fill="black" fillOpacity="0.54"/>
                        </svg>
                        <svg onClick={this.onClearClick} className="cancel-icon" width="24" height="24" viewBox="0 0 24 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12.2689 1.92334C5.63289 1.92334 0.26889 7.28734 0.26889 13.9233C0.26889 20.5593 5.63289 25.9233 12.2689 25.9233C18.9049 25.9233 24.2689 20.5593 24.2689 13.9233C24.2689 7.28734 18.9049 1.92334 12.2689 1.92334Z" fill="#DADADA"/>
                            <path d="M17.4289 19.0834C16.9609 19.5514 16.2049 19.5514 15.7369 19.0834L12.2689 15.6154L8.80089 19.0834C8.33289 19.5514 7.57689 19.5514 7.10889 19.0834C6.88418 18.8592 6.7579 18.5548 6.7579 18.2374C6.7579 17.9199 6.88418 17.6155 7.10889 17.3914L10.5769 13.9234L7.10889 10.4554C6.88418 10.2312 6.7579 9.92677 6.7579 9.60935C6.7579 9.29193 6.88418 8.98755 7.10889 8.76335C7.57689 8.29535 8.33289 8.29535 8.80089 8.76335L12.2689 12.2314L15.7369 8.76335C16.2049 8.29535 16.9609 8.29535 17.4289 8.76335C17.8969 9.23135 17.8969 9.98735 17.4289 10.4554L13.9609 13.9234L17.4289 17.3914C17.8849 17.8474 17.8849 18.6154 17.4289 19.0834Z" fill="#737272"/>
                        </svg>

                        <div id="post-search-box-text">Leave search box blank to return all results in database.</div>

                    </div>

                </div>
            </div>
            <div className="loader-holder">
                <div className="lds-ellipsis" hidden={!this.props.searching}><div></div><div></div><div></div><div></div></div>
            </div>
            
            <div className="sidebar-filters" onKeyUp={this.onKeyUp}>
                <span className="sidebar-header">Narrow your results</span>
                <div className="sidebar-hr"></div>
                <div className="filter">
                    <label className="sidebar-label" htmlFor="searchAgency">Lead agency</label>
                    <Select id="searchAgency" className="multi" classNamePrefix="react-select" isMulti name="agency" isSearchable isClearable 
                        styles={customStyles}
                        options={agencyOptions} 
                        onChange={this.onAgencyChange} 
                        value={this.state.agencyRaw}
                        placeholder="Type or select lead agency" 
                        // (temporarily) specify menuIsOpen={true} parameter to keep menu open to inspect elements.
                        // menuIsOpen={true}
                    />
                </div>
                <div className="filter">
                    <label className="sidebar-label" htmlFor="searchState">State</label>
                    <Select id="searchState" className="multi" classNamePrefix="react-select" isMulti name="state" isSearchable isClearable 
                        styles={customStyles}
                        options={stateOptions} 
                        onChange={this.onLocationChange} 
                        value={this.state.stateRaw}
                        placeholder="Type or select state" 
                        />
                </div>

                <div className="sidebar-hr"></div>

                <div className="filter">
                    <label className="sidebar-label-date" htmlFor="dates">Date Range:</label>
                    <div className="sidebar-dates">
                        <span className="sidebar-date-text">
                            From
                        </span>
                        <DatePicker
                            selected={this.state.startPublish} onChange={this.onStartDateChange} 
                            dateFormat="yyyy-MM-dd" placeholderText="YYYY-MM-DD"
                            className="sidebar-date" 
                        />
                        <span className="sidebar-date-text">
                            To
                        </span>
                        <DatePicker
                            selected={this.state.endPublish} onChange={this.onEndDateChange}
                            dateFormat="yyyy-MM-dd" placeholderText="YYYY-MM-DD"
                            className="sidebar-date" 
                        />
                    </div>
                </div>

                <div className="sidebar-hr"></div>
                
                <div className="filter">
                    <label className="sidebar-label">Document type</label>
                    <div className="sidebar-checkboxes">
                        <div className="checkbox-container">
                            <input type="checkbox" name="typeDraft" className="sidebar-checkbox"
                                    checked={this.state.typeDraft} onChange={this.onTypeChecked} />
                            <label className="checkbox-text" htmlFor="typeDraft">
                                Draft
                            </label>
                        </div>
                        <div className="checkbox-container">
                            <input type="checkbox" name="typeFinal" className="sidebar-checkbox"
                                    checked={this.state.typeFinal} onChange={this.onTypeChecked} />
                            <label className="checkbox-text" htmlFor="typeFinal">
                                Final
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            </>
        )
    }

    componentWillUnmount() {
		persist.setItem('appState', JSON.stringify(this.state));
	}
	  
	// After render
	componentDidMount() {
        try {
            const rehydrate = JSON.parse(persist.getItem('appState'));
            // console.log(rehydrate.startPublish);
            // console.log(new Date(rehydrate.startPublish));
            if(typeof(rehydrate.startPublish) === "string"){
                rehydrate.startPublish = globals.getCorrectDate(rehydrate.startPublish);
            } // else number
            
            if(typeof(rehydrate.endPublish) === "string"){
                rehydrate.endPublish = globals.getCorrectDate(rehydrate.endPublish);
            }
            this.setState(rehydrate);
        }
        catch(e) {
            // do nothing
        }
        // Get search params on mount and run search on them (implies came from landing page)
        var queryString = globals.getParameterByName("q");
        if(queryString){
            this.setState({
                titleRaw: queryString
            }, () => {
                if(this.state.titleRaw){
                    this.debouncedSearch(this.state);
                }
            });
        } else {
            // Option: Search on load to get all results so user can start filtering?
        }
	}
}

export default withRouter(Search);