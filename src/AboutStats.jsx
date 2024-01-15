import React from 'react';
import axios from 'axios';
import Select from 'react-select';
import Globals from './globals.jsx';

import ChartBar from './ChartBar.jsx';

import './stats.css';

const typeLabels = ["Draft",
    "Final",
    "Second Draft",
    "Second Final",
    "Revised Draft",
    "Revised Final",
    "Draft Supplement",
    "Final Supplement",
    "Second Draft Supplemental",
    "Second Final Supplemental",
    "Third Draft Supplemental",
    "Third Final Supplemental",
    "Other"];


export default class AboutStats extends React.Component {
    
	constructor(props) {
		super(props);
		this.state = { 
            agencyLabels: [],
            yearLabels: [],
            typeCount: [],
			downloadableCountByType: [],
            draftFinalCountByYear: [],
            draftFinalCountByState: [],
            draftFinalCountByAgency: [],
            chartOption: {value: "Record Count by Document Type", label: "Record Count by Document Type"}
        };

        // time to get the stats
        this.getStats();
    }

    getStats = () => {
        this.getTypeCount();
        this.getDownloadableCountByType();
        this.getDraftFinalCountByAgency();
        this.getDraftFinalCountByState();
        this.getYears();
        // this.getDraftFinalCountByYear();
        // this.getMetadataCountByYear();
        // this.getDownloadableCountByYear();
    }

    getTypeCount = () => {
        let populateUrl = Globals.currentHost + "stats/type_count";
        
        axios.get(populateUrl, {
            params: {
                
            }
        }).then(response => {
            let responseOK = response && response.status === 200;
            if (responseOK && response.data && response.data.length > 0) {
                return response.data;
            } else {
                return null;
            }
        }).then(parsedJson => {
            if(parsedJson){
                this.setState({
                    typeCount: transformDocTypeArrays(parsedJson)
                });
            } else { // null/404

            }
        }).catch(error => {
            
        });
        
    }
    getDownloadableCountByType = () => {
        let populateUrl = Globals.currentHost + "stats/downloadable_count_type";
        
        axios.get(populateUrl, {
            params: {
                
            }
        }).then(response => {
            let responseOK = response && response.status === 200;
            if (responseOK && response.data && response.data.length > 0) {
                return response.data;
            } else {
                return null;
            }
        }).then(parsedJson => { 
            if(parsedJson){
                this.setState({
                    downloadableCountByType: transformDocTypeArrays(parsedJson)
                });
            } else { // null/404

            }
        }).catch(error => {
            
        });
        
    }

    getYears = () => {
        let labelUrl = Globals.currentHost + "stats/years";

        axios.get(labelUrl, {
            params: {
                
            }
        }).then(response => {
            let responseOK = response && response.status === 200;
            if (responseOK && response.data && response.data.length > 0) {
                return response.data;
            } else {
                return null;
            }
        }).then(parsedJson => { 
            if(parsedJson){
                this.setState({
                    yearLabels: parsedJson
                }, () => {
                    this.getDraftFinalCountByYear();
                    this.getMetadataCountByYear();
                    this.getDownloadableCountByYear();
                });
            } else { // null/404

            }
        }).catch(error => {
            
        });
    }
    
    getMetadataCountByYear = () => {
        let populateUrl = Globals.currentHost + "stats/count_year";
        
        axios.get(populateUrl, {
            params: {

            }
        }).then(response => {
            let responseOK = response && response.status === 200;
            if (responseOK && response.data && response.data.length > 0) {
                return response.data;
            } else {
                return null;
            }
        }).then(parsedJson => { 
            if(parsedJson){
                this.setState({
                    metadataCountByYear: transformYearStack(parsedJson, this.state.yearLabels)
                });
            } else { // null/404

            }
        }).catch(error => {
            
        });
        
    }
    getDownloadableCountByYear = () => {

        let populateUrl = Globals.currentHost + "stats/count_year_downloadable";
        
        axios.get(populateUrl, {
            params: {

            }
        }).then(response => {
            let responseOK = response && response.status === 200;
            if (responseOK && response.data && response.data.length > 0) {
                return response.data;
            } else {
                return null;
            }
        }).then(parsedJson => { 
            if(parsedJson){
                this.setState({
                    downloadableCountByYear: transformYearStack(parsedJson, this.state.yearLabels)
                });
            } else { // null/404

            }
        }).catch(error => {
            
        });
        
    }

    getDraftFinalCountByYear = () => {
        let populateUrl = Globals.currentHost + "stats/draft_final_count_year";
        
        axios.get(populateUrl, {
            params: {

            }
        }).then(response => {
            let responseOK = response && response.status === 200;
            if (responseOK && response.data && response.data.length > 0) {
                return response.data;
            } else {
                return null;
            }
        }).then(parsedJson => { 
            if(parsedJson){
                this.setState({
                    draftFinalCountByYear: transformArraysWithLabels(parsedJson, this.state.yearLabels)
                });
            } else { // null/404

            }
        }).catch(error => {
            
        });
        
    }

    getDraftFinalCountByState = () => {
        let populateUrl = Globals.currentHost + "stats/draft_final_count_state";
        
        axios.get(populateUrl, {
            params: {
                
            }
        }).then(response => {
            let responseOK = response && response.status === 200;
            if (responseOK && response.data && response.data.length > 0) {
                return response.data;
            } else {
                return null;
            }
        }).then(parsedJson => { 
            if(parsedJson){
                this.setState({
                    draftFinalCountByState: transformLongerArrayOfArrays(parsedJson)
                });
            } else { // null/404

            }
        }).catch(error => {
            
        });
        
    }
    
    getDraftFinalCountByAgency = () => {
        let labelUrl = Globals.currentHost + "stats/agencies";
        
        axios.get(labelUrl, {
            params: {
                
            }
        }).then(response => {
            let responseOK = response && response.status === 200;
            if (responseOK && response.data && response.data.length > 0) {
                return response.data;
            } else {
                return null;
            }
        }).then(parsedJson => { 
            if(parsedJson){
                this.setState({
                    agencyLabels: parsedJson
                });
            } else { // null/404

            }
        }).catch(error => {
            
        });

        let populateUrl = Globals.currentHost + "stats/draft_final_count_agency";
        
        axios.get(populateUrl, {
            params: {
                
            }
        }).then(response => {
            let responseOK = response && response.status === 200;
            if (responseOK && response.data && response.data.length > 0) {
                return response.data;
            } else {
                return null;
            }
        }).then(parsedJson => { 
            if(parsedJson){
                this.setState({
                    draftFinalCountByAgency: transformArraysWithLabels(parsedJson, this.state.agencyLabels)
                });
            } else { // null/404

            }
        }).catch(error => {
            
        });
        
    }

    onDropdownChange = (evt) => {
        this.setState({
            chartOption: evt
        });
    }
    
	check = () => { // check if JWT is expired/invalid
		
		let checkURL = new URL('test/check', Globals.currentHost);
		let result = false;
		axios.post(checkURL)
		.then(response => {
			result = response && response.status === 200;
			this.setState({
				verified: result
			})
		})
		.catch((err) => { // This will catch a 403 from the server from a malformed/expired JWT, will also fire if server down
            this.setState({
                networkError: Globals.getErrorMessage(err)
            });
		})
		.finally(() => {
			// console.log("Returning... " + result);
		});
		// console.log("App check");
    }

    render() {
        if(this.state.verified) {
            const chartOptions = [{value: "Record Count by Document Type", label: "Record Count by Document Type"},
                {value: "Downloadable Count by Document Type", label: "Downloadable Count by Document Type"},
                {value: "Draft and Final Count by State", label: "Draft and Final Count by State"},
                {value: "Draft and Final Count by Year", label: "Draft and Final Count by Year"},
                {value: "Downloadable Draft or Final EIS by Year", label: "Downloadable Draft or Final EIS by Year"},
                {value: "Draft and Final Count by Agency", label: "Draft and Final Count by Agency"}
            ]
            return (<div className="charts-holder">
                    <Select id="chart-picker" classNamePrefix="react-select" name="chart" isSearchable 
                            // styles={customStyles}
                            options={chartOptions} 
                            onChange={this.onDropdownChange}
                            value={this.state.chartOption}
                            placeholder="Type or select" 
                    />
                    <ChartBar option={this.state.chartOption.value} data={this.state.typeCount} label={"Record Count by Document Type"} />
                    <ChartBar option={this.state.chartOption.value} data={this.state.downloadableCountByType} label={"Downloadable Count by Document Type"} />
                    {/* <ChartBar data={this.state.draftFinalCountByAgency[0]} label={"Draft count by agency"} />
                    <ChartBar data={this.state.draftFinalCountByAgency[1]} label={"Final count by agency"} />
                    <ChartBar data={this.state.draftFinalCountByYear[0]} label={"Draft count by year"} />
                    <ChartBar data={this.state.draftFinalCountByYear[1]} label={"Final count by year"} />
                    <ChartBar data={this.state.draftFinalCountByState[0]} label={"Draft count by state"} />
                    <ChartBar data={this.state.draftFinalCountByState[1]} label={"Final count by state"} /> */}
                    
                    <ChartBar size="larger" option={this.state.chartOption.value} data={this.state.draftFinalCountByState} label={"Draft and Final Count by State"} />
                    <ChartBar option={this.state.chartOption.value} data={this.state.draftFinalCountByYear} label={"Draft and Final Count by Year"} />
                    <ChartBar stacked={true} option={this.state.chartOption.value} meta={this.state.metadataCountByYear} down={this.state.downloadableCountByYear} label={"Downloadable Draft or Final EIS by Year"} />
                    <ChartBar size="largest" option={this.state.chartOption.value} data={this.state.draftFinalCountByAgency} label={"Draft and Final Count by Agency"} />
                </div>
            );
        } else {
            return <div></div>;
        }
    }

	componentDidMount() {
        this.check();
    }
}

// For array of 2-length arrays
// function transformArrayOfArrays(source) {
//     // console.log("Source",source);
//     let labelArray = [];
//     let valueArray = [];
//     for(let i = 0; i < source.length; i++) {
//         labelArray.push(source[i][0]);
//         valueArray.push(source[i][1]);
//     }
    
//     return {labelArray,valueArray};
// }

// 3-length case: agency categorized by draft or final, with count
function transformLongerArrayOfArrays(source) {
    // console.log("Source",source);
    let labelArrayDraft = [];
    let valueArrayDraft = [];
    let labelArrayFinal = [];
    let valueArrayFinal = [];
    
    // undefined states coming in first?
    if(!source[0][1]){
        source[0][1] = "Undefined";
    }
    if(!source[1][1]){
        source[1][1] = "Undefined";
    }

    for(let i = 0; i < source.length; i++) {
        if(source[i][0]==="Draft"){
            labelArrayDraft.push(source[i][1]);
            valueArrayDraft.push(source[i][2]);
        } else {
            labelArrayFinal.push(source[i][1]);
            valueArrayFinal.push(source[i][2]);
        }
    }

    // console.log("After",[ {labelArrayDraft,valueArrayDraft}, {labelArrayFinal,valueArrayFinal} ])
    
    return [ {labelArrayDraft,valueArrayDraft}, {labelArrayFinal,valueArrayFinal} ];
}

// TODO: Everything should be like this, or else a different SQL query, for robustness: 
// To account for different label counts like we see with agency drafts vs. finals.
function transformArraysWithLabels(source, labels) {
    
    // Prefill with zeroes at same length as array of all possible labels for complete data
    let valueArrayDraft = new Array(labels.length).fill(0);
    let valueArrayFinal = new Array(labels.length).fill(0);

    for(let n = 0; n < labels.length; n++) {
        for(let i = 0; i < source.length; i++) {
            if(source[i][1] === (labels[n])) {
                if(source[i][0]==="Draft"){
                    valueArrayDraft[n] = source[i][2];
                } else {
                    valueArrayFinal[n] = source[i][2];
                }
            }
        }
    }
    
    return {labels,valueArrayDraft,valueArrayFinal};
}

function transformDocTypeArrays(source) {

    const labelArray = typeLabels;

    // console.log(source);
    
    // Prefill with zeroes at same length as array of all possible labels for complete data
    let valueArray = new Array(labelArray.length).fill(0);
    let consumedArray = new Array(source.length).fill(false);

    // for each of our labels excl. Other (final item in array), see if a source matches
    for(let n = 0; n < labelArray.length - 1; n++) {
        for(let i = 0; i < source.length; i++) {
            // if not consumed and labels are equal (source labels are in source[i][0])
            if(!consumedArray[i] && source[i][0] === (labelArray[n])) {
                valueArray[n] = source[i][1];
                consumedArray[i] = true;
            }
        }
    }

    for(let i = 0; i < consumedArray.length; i++) {
        // If didn't find a match: Add to "Other" which should be valueArray[valueArray.length - 1]
        if(!consumedArray[i]){
            // console.log("Other", source[i][0], source[i][1]);
            valueArray[valueArray.length - 1] += source[i][1];
        }
    }
    
    return {labelArray,valueArray};
}

function transformYearStack(source, labelArray) {

    // console.log("Source", source);
    // console.log("Labels", labelArray);
    
    // Prefill with zeroes at same length as array of all possible labels for complete data
    let valueArray = new Array(labelArray.length).fill(0);

    // for each of our labels excl. Other (final item in array), see if a source matches
    for(let n = 0; n < labelArray.length - 1; n++) {
        for(let i = 0; i < source.length; i++) {
            if(source[i][0] === (labelArray[n])) {
                valueArray[n] = source[i][1];
            }
        }
    }

    return {labelArray,valueArray};
}