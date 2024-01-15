import React from 'react';
import axios from 'axios';

import Globals from './globals.jsx';


import 'react-tabulator/lib/styles.css'; // required styles
import 'react-tabulator/lib/css/tabulator_site.min.css'; // theme

import { ReactTabulator } from 'react-tabulator';

const options = {
    // maxHeight: "100%",           // for limiting table height
    // IMPORTANT: downloadDataFormatter and downloadReady assignments are necessary for download:
    downloadDataFormatter: (data) => data, 
    downloadReady: (fileContents, blob) => blob,
    selectable:true,
    layoutColumnsOnNewData: true,
    tooltips:false,
    responsiveLayout:"collapse",    //collapse columns that dont fit on the table
    // responsiveLayoutCollapseUseFormatters:false,
    pagination:"local",             //paginate the data
    paginationSize:10,              //allow 10 rows per page of data
    paginationSizeSelector:[10, 50, 100, 250], 
    movableColumns:false,            //don't allow column order to be changed
    resizableRows:false,             
    resizableColumns:true,
    autoColumns:true,
    layout:"fitColumns",
    invalidOptionWarnings:false, // spams warnings without this
    footerElement:("<span class=\"tabulator-paginator-replacer\"><label>Results Per Page:</label></span>")
};

export default class Pair extends React.Component {
    ref = null;

    state = {
        datums: [],
        busy: false,
        locationCheck: true,
        approver: false
    }
    
    checkApprover = () => {
        let checkUrl = new URL('user/checkApprover', Globals.currentHost);
        axios({
            url: checkUrl,
            method: 'POST'
        }).then(response => {
            console.log("Response", response);
            console.log("Status", response.status);
            let responseOK = response.data && response.status === 200;
            if (responseOK) {
                this.setState({
                    approver: true
                });
            } else {
                console.log("Else");
            }
        }).catch(error => {
            //
        })
    }

    getData = () => {
        this.setState({
            busy: true
        });
        // console.log("Fetching data");
        let getUrl = Globals.currentHost + this.props.url;
        
        axios.get(getUrl, {
            // params: {
                
            // }
        }).then(response => {
            let responseOK = response && response.status === 200;
            if (responseOK && response.data) {
                // console.log("Data",response.data);
                return response.data;
            } else {
                return null;
            }
        }).then(parsedJson => { 
            if(parsedJson){
                this.setState({
                    datums: this.setupData(parsedJson),
                    busy: false
                });
            } else { // null/404
                this.setState({ busy: false });
            }
        }).catch(error => {
            this.setState({ busy: false });
            console.error(error);
        });
    }

    // Wishlist: More efficient to use reduce and not filter here, whoops
    setupData = (results) => {
        let locCheck = this.state.locationCheck;
        if(results && results[0]) {
            return results.filter(function(result) {
                let doc = result;
                let newObject = {
                    id1: doc[0],
                    title1: doc[1], 
                    filename1: doc[2], 
                    agency1: doc[3], 
                    type1: doc[4], 
                    date1: doc[5], 
                    state1: doc[6], 
                    id2: doc[7],
                    title2: doc[8], 
                    filename2: doc[9], 
                    agency2: doc[10], 
                    type2: doc[11], 
                    date2: doc[12],
                    state2: doc[13],
                    match_percent: doc[14],
                };
                return sanityCheck(newObject, locCheck)
            }).map((result, idx) =>{
                let doc = result;
                let newObject = {
                    id1: doc[0],
                    title1: doc[1], 
                    filename1: doc[2], 
                    agency1: doc[3], 
                    type1: doc[4], 
                    date1: doc[5], 
                    state1: doc[6], 
                    id2: doc[7],
                    title2: doc[8], 
                    filename2: doc[9], 
                    agency2: doc[10], 
                    type2: doc[11], 
                    date2: doc[12],
                    state2: doc[13],
                    match_percent: doc[14],
                };
                return newObject;
            });
        } else { // ??
            return [];
        }
    }


    downloadData = () => {
        // console.log("Will download this data: ",this.ref.state.data)
        this.ref.table.download("csv", "data.tsv", {delimiter:'\t'}); // tab delimiter
    }; 

    checkChanged = (evt) => {
        // console.log("Target",evt.target);
        this.setState({ 
            locationCheck: evt.target.checked 
        }, () => {
            this.getData();
        });
    }
    onChangeDummy = () => {

    }

    render() {

        if(this.state.approver) {
            return (
                <div id="data-pairs" className="content">
                    <div className="loader-holder">
                        <div className="lds-ellipsis" hidden={!this.state.busy}><div></div><div></div><div></div><div></div></div>
                    </div>
                    <div className="instructions">
                        <span className="bold">
                            {this.props.message}
                        </span>
                    </div>

                    <ReactTabulator
                        ref={ref => (this.ref = ref)}
                        data={this.state.datums}
                        columns={[]}
                        options={options}
                        pageLoaded={this.onPageLoaded}
                    />
                    <br />
                    <br />
                    <input type="checkbox" 
                        name="locationCheck" 
                        checked={this.state.locationCheck}
                        onClick={this.checkChanged}
                        onChange={this.onChangeDummy}>
                    </input>
                    <span>State/location must be identical
                    </span>
                    <br />
                    <br />
                    
                    <button onClick={this.downloadData}>
                        Download data as tab separated values (should open fine in excel)
                    </button>

                </div>
            );
        } else {
            return <div id="data-pairs">401</div>
        }
    }

    componentDidMount = () => {
        try {
            this.checkApprover();
            this.getData();
        } catch(e) {
            console.error(e);
        }
    }
}


    
function sanityCheck (doc, locationCheck) {
    if(doc.agency1 !== doc.agency2) {
        return false;
    }

    let draftOne = isDraft(doc.type1);
    let draftTwo = isDraft(doc.type2);
    let finalOne = isFinal(doc.type1);
    let finalTwo = isFinal(doc.type2);

    if(
        (draftOne && finalTwo)
        || (finalOne && draftTwo)
    ) {
        // Good
        if(draftOne) {
            // Make sure date1 < date2
            // console.log("date1,date2",doc.date1,doc.date2);
            if(doc.date1.localeCompare(doc.date2) === -1) {
                // console.log("Correct dates");
            } else {
                return false;
            }
        } else if(draftTwo) {
            // Make sure date2 < date1
            // console.log("date2,date1",doc.date2,doc.date1);
            if(doc.date2.localeCompare(doc.date1) === -1) {
                // console.log("Correct dates");
            } else {
                return false;
            }
        }
    } else {
        return false; // "bad" document types
    }
    if((doc.state1 !== doc.state2) && locationCheck) {
        return false;
    }

    return true;
}

function isDraft(type) {
    return (
        (type === "Draft") 
        || (type === "Second Draft")
        || (type === "Revised Draft")
        || (type === "Draft Supplement")
        || (type === "Second Draft Supplemental")
        || (type === "Third Draft Supplemental")
    );
}

function isFinal(type) {
    return (
        (type === "Final") 
        || (type === "Second Final")
        || (type === "Revised Final")
        || (type === "Final Supplement")
        || (type === "Second Final Supplemental")
        || (type === "Third Final Supplemental")
    );
}