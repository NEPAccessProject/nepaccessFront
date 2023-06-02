import React from 'react';
import {Helmet} from 'react-helmet';
import axios from 'axios';
import Select from 'react-select';
import Globals from '../globals.js';

import ChartBar from '../ChartBar.js';

import { ReactTabulator } from 'react-tabulator';

// const typeLabels = ["Draft",
//     "Final",
//     "Second Draft",
//     "Second Final",
//     "Revised Draft",
//     "Revised Final",
//     "Draft Supplement",
//     "Final Supplement",
//     "Second Draft Supplemental",
//     "Second Final Supplemental",
//     "Third Draft Supplemental",
//     "Third Final Supplemental",
//     "Other"];

const options = {
    // maxHeight: "100%",           // for limiting table height
    selectable:1,
    layoutColumnsOnNewData: true,
    tooltips:true,
    responsiveLayout:"collapse",    //collapse columns that dont fit on the table
    // responsiveLayoutCollapseUseFormatters:false,
    pagination:"local",             //paginate the data
    paginationSize:10,              //allow 10 rows per page of data
    paginationSizeSelector:[10, 25, 50, 100], 
    movableColumns:true,
    resizableRows:true,
    resizableColumns:true,
    layout:"fitColumns",
    invalidOptionWarnings:false,    // spams warnings without this
    footerElement:("<span class=\"tabulator-paginator-replacer\"><label>Results Per Page:</label></span>")
};

const chartOptions = [
    {value: "Search Count by Terms", label: "Search Count by Terms"},
    {value: "Table of all searches", label: "Table of all searches"}
];

export default class SearchLogs extends React.Component {
    
    
	constructor(props) {
		super(props);
		this.state = { 
            typeCount: [],
            chartOption: {value: "Table of all searches", label: "Table of all searches"},
            authorized: false,
            searches: [],
            response: []
        };

        this.my_table = React.createRef();
        
        
        let checkUrl = new URL('user/checkApprover', Globals.currentHost);
        axios({
            url: checkUrl,
            method: 'POST'
        }).then(response => {
            let responseOK = response && response.status === 200;
            if (!responseOK) { // impossible? (either 200 or error?)
                this.props.history.push('/');
            } else {
                this.setState({authorized: true});
            }
        }).catch(error => {
            this.props.history.push('/');
            // this.setState({
            //     networkError: error.message
            // });
        })

        // time to get the stats
        this.getStats();
    }

    getStats = () => {
        this.getTitleCount();
        this.findAllSearches();
    }

    /** Top 50 searches by terms */
    getTitleCount = () => {
        let populateUrl = Globals.currentHost + "test/search_logs";
        
        axios.get(populateUrl, {
            // params: {
                
            // }
        }).then(response => {
            let responseOK = response && response.status === 200;
            if (responseOK && response.data && response.data.length > 0) {
                return response.data;
            } else {
                return null;
            }
        }).then(parsedJson => {
            if(parsedJson){
                console.log("typeCount Results",parsedJson);
                this.setState({
                    typeCount: transformArrayOfArrays(parsedJson)
                    // typeCount: (parsedJson)
                }, () => {
                    console.log("typeCount Results after",this.state.typeCount);
                });
            } else { // null/404

            }
        }).catch(error => {
            this.setState({
                networkError: error.message
            });
        });
        
    }

    mapSearches = (data) => {
        return data.map((datum) => {
            let newObject = { username: datum[0],
                terms: datum[1],
                time: datum[2],
                mode: datum[3]
            };
            return newObject;
        });
    }

    findAllSearches = () => {

        // TODO: This and the logic to get it and populate with it like with adminFind

        
        let populateUrl = Globals.currentHost + "stats/find_all_searches";
        
        axios.get(populateUrl, {
            // params: {
                
            // }
        }).then(response => {
            let responseOK = response && response.status === 200;
            if (responseOK && response.data && response.data.length > 0) {
                return response.data;
            } else {
                return null;
            }
        }).then(parsedJson => {
            if(parsedJson){
                console.log("Results",parsedJson);
                this.setState({
                    searches: this.mapSearches(parsedJson),
                    response: this.jsonToCSV(this.mapSearches(parsedJson))
                }, () => {
                    console.log("Results after",this.state.searches);
                });
            } else { // null/404

            }
        }).catch(error => {
            this.setState({
                networkError: error.message
            });
        });
        
    }
    
    // format json as tab separated values to prep .tsv download
    jsonToCSV = (data) => {
        const items = data;
        const replacer = (key, value) => value === null ? '' : value // specify how you want to handle null values here
        const header = Object.keys(items[0])
        const csv = [
        header.join(','), // header row first
        ...items.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
        ].join('\r\n')
        
        return csv;
    }
    // best performance is to Blob it on demand
    downloadResults = () => {
        if(this.state.response) {
            const csvBlob = new Blob([this.state.response]);
            const today = new Date().toISOString().split('T')[0];
            const csvFilename = `search_logs_${today}.csv`;

    
            if (window.navigator.msSaveOrOpenBlob) {  // IE hack; see http://msdn.microsoft.com/en-us/library/ie/hh779016.aspx
                window.navigator.msSaveBlob(csvBlob, csvFilename);
            }
            else {
                const temporaryDownloadLink = window.document.createElement("a");
                temporaryDownloadLink.href = window.URL.createObjectURL(csvBlob);
                temporaryDownloadLink.download = csvFilename;
                document.body.appendChild(temporaryDownloadLink);
                temporaryDownloadLink.click();  // IE: "Access is denied"; see: https://connect.microsoft.com/IE/feedback/details/797361/ie-10-treats-blob-url-as-cross-origin-and-denies-access
                document.body.removeChild(temporaryDownloadLink);
            }

        }
    }
    
    onDropdownChange = (evt) => {
        console.log(evt.value);
        this.setState({
            chartOption: evt
        });
    }

    render() {
        const columns = [
            { title: "username", field: "username", width: 200, headerFilter:"input"},
            { 
                title: "terms", 
                field: "terms", 
                headerFilter:"input", 
                // cellClick: (e, cell) => {
                //     const _terms = cell.getRow().getData().terms;
                //     this.setState({
                //         clipboard: _terms
                //     }, () => {
                //         navigator.clipboard.writeText(this.state.clipboard);
                //     });
                // } 
            },
            { title: "time", field: "time", width: 250, headerFilter:"input"  },
            { title: "mode", field: "mode", width: 100, headerFilter:"input"  },
        ];

        if(!this.state.authorized) {
            return <div className="content">
                <Helmet>
                    <title>NEPAccess</title>
                    <link rel="canonical" href="https://nepaccess.org/search_logs" />
                    <meta name="robots" content="noindex, nofollow" data-react-helmet="true" />
                </Helmet>
                <label className="errorLabel">{this.state.networkError}</label>
            </div>
        } else if(this.state.chartOption.value === "Search Count by Terms") {
            return (
                <div className="charts-holder">
                    <Helmet>
                        <title>NEPAccess</title>
                        <link rel="canonical" href="https://nepaccess.org/search_logs" />
                        <meta name="robots" content="noindex, nofollow" data-react-helmet="true" />
                    </Helmet>
                    <div><label className="errorLabel">{this.state.networkError}</label></div>

                    <Select id="chart-picker" classNamePrefix="react-select" name="chart" isSearchable 
                            // styles={customStyles}
                            options={chartOptions} 
                            onChange={this.onDropdownChange}
                            value={this.state.chartOption}
                            placeholder="Type or select" 
                    />
                
                    <hr />

                    <ChartBar option={this.state.chartOption.value} data={this.state.typeCount} label={this.state.chartOption.label} />

                </div>
            );
        } else {
            return (
                <div className="charts-holder padding-all">
                    <Helmet>
                        <title>NEPAccess</title>
                        <link rel="canonical" href="https://nepaccess.org/search_logs" />
                        <meta name="robots" content="noindex, nofollow" data-react-helmet="true" />
                    </Helmet>

                    <div><label className="errorLabel">{this.state.networkError}</label></div>

                    <Select id="chart-picker" classNamePrefix="react-select" name="chart" isSearchable 
                            // styles={customStyles}
                            options={chartOptions} 
                            onChange={this.onDropdownChange}
                            value={this.state.chartOption}
                            placeholder="Type or select" 
                    />
                    
                    <hr />

                    <ReactTabulator
                        ref={this.my_table}
                        data={this.state.searches}
                        columns={columns}
                        options={options}
                        rowClick={(e, row) => {
                            const _terms = row.getData().terms;
                            navigator.clipboard.writeText(_terms);
                        }}
                    />

                    <label>Click on a row to copy terms to clipboard.</label>

                    <button 
                        className="button"
                        onClick={this.downloadResults}
                    >
                        Download all searches as .csv
                    </button>

                </div>
            );
        }
    }
}

// For array of 2-length arrays
function transformArrayOfArrays(source) {
    // console.log("Source",source);
    let labelArray = [];
    let valueArray = [];
    for(let i = 0; i < source.length; i++) {
        labelArray.push(source[i][0]);
        valueArray.push(source[i][1]);
    }
    
    return {labelArray,valueArray};
}

// 3-length case: agency categorized by draft or final, with count
// function transformLongerArrayOfArrays(source) {
//     // console.log("Source",source);
//     let labelArrayDraft = [];
//     let valueArrayDraft = [];
//     let labelArrayFinal = [];
//     let valueArrayFinal = [];
    
//     // undefined states coming in first?
//     if(!source[0][1]){
//         source[0][1] = "Undefined";
//     }
//     if(!source[1][1]){
//         source[1][1] = "Undefined";
//     }

//     for(let i = 0; i < source.length; i++) {
//         if(source[i][0]==="Draft"){
//             labelArrayDraft.push(source[i][1]);
//             valueArrayDraft.push(source[i][2]);
//         } else {
//             labelArrayFinal.push(source[i][1]);
//             valueArrayFinal.push(source[i][2]);
//         }
//     }

//     // console.log("After",[ {labelArrayDraft,valueArrayDraft}, {labelArrayFinal,valueArrayFinal} ])
    
//     return [ {labelArrayDraft,valueArrayDraft}, {labelArrayFinal,valueArrayFinal} ];
// }

// TODO: Everything should be like this, or else a different SQL query, for robustness: 
// To account for different label counts like we see with agency drafts vs. finals.
// function transformArraysWithLabels(source, labels) {
    
//     // Prefill with zeroes at same length as array of all possible labels for complete data
//     let valueArrayDraft = new Array(labels.length).fill(0);
//     let valueArrayFinal = new Array(labels.length).fill(0);

//     for(let n = 0; n < labels.length; n++) {
//         for(let i = 0; i < source.length; i++) {
//             if(source[i][1] === (labels[n])) {
//                 if(source[i][0]==="Draft"){
//                     valueArrayDraft[n] = source[i][2];
//                 } else {
//                     valueArrayFinal[n] = source[i][2];
//                 }
//             }
//         }
//     }
    
//     return {labels,valueArrayDraft,valueArrayFinal};
// }

// function transformDocTypeArrays(source) {

//     const labelArray = typeLabels;

//     // console.log(source);
    
//     // Prefill with zeroes at same length as array of all possible labels for complete data
//     let valueArray = new Array(labelArray.length).fill(0);
//     let consumedArray = new Array(source.length).fill(false);

//     // for each of our labels excl. Other (final item in array), see if a source matches
//     for(let n = 0; n < labelArray.length - 1; n++) {
//         for(let i = 0; i < source.length; i++) {
//             // if not consumed and labels are equal (source labels are in source[i][0])
//             if(!consumedArray[i] && source[i][0] === (labelArray[n])) {
//                 valueArray[n] = source[i][1];
//                 consumedArray[i] = true;
//             }
//         }
//     }

//     for(let i = 0; i < consumedArray.length; i++) {
//         // If didn't find a match: Add to "Other" which should be valueArray[valueArray.length - 1]
//         if(!consumedArray[i]){
//             // console.log("Other", source[i][0], source[i][1]);
//             valueArray[valueArray.length - 1] += source[i][1];
//         }
//     }
    
//     return {labelArray,valueArray};
// }

// function transformYearStack(source, labelArray) {

//     // console.log("Source", source);
//     // console.log("Labels", labelArray);
    
//     // Prefill with zeroes at same length as array of all possible labels for complete data
//     let valueArray = new Array(labelArray.length).fill(0);

//     // for each of our labels excl. Other (final item in array), see if a source matches
//     for(let n = 0; n < labelArray.length - 1; n++) {
//         for(let i = 0; i < source.length; i++) {
//             if(source[i][0] === (labelArray[n])) {
//                 valueArray[n] = source[i][1];
//             }
//         }
//     }

//     return {labelArray,valueArray};
// }