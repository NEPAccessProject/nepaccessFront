import React from 'react';
import {Helmet} from 'react-helmet';
import axios from 'axios';

import Globals from './globals.jsx';


import { ReactTabulator } from 'react-tabulator';

let options = JSON.parse(JSON.stringify(Globals.tabulatorOptions));
options.paginationSize = 100;

export default class InteractionLogs extends React.Component {


    state = {
        data: [],
        columns: [],
        rows: [],
        selected: "",

        response: "",

        busy: false,

        getRoute: "interaction/get_all_combined",
        selectedName: ""
    }
    constructor(props) {
        super(props);

        this.ref = null;
    }


    get = () => {
        let getUrl = Globals.currentHost + this.state.getRoute;
        
        axios.get(getUrl, {
            params: {
                exclude: true
            }
        }).then(response => {
            let responseOK = response && response.status === 200;
            if (responseOK && response.data) {
                return response.data;
            } else {
                return null;
            }
        }).then(parsedJson => { 
            let newColumns = [];
            let headers = getKeys(parsedJson[0]);

            console.log("Keys",headers);

            for(let i = 0; i < headers.length; i++) {
                newColumns[i] = {title: headers[i], field: headers[i], 
                    width: 200,
                    headerFilter: "input",
                    cellClick: (e, cell) => {
                        // console.log(e,cell.getRow().getData());
                        const _terms = cell.getValue();
                        navigator.clipboard.writeText(_terms);
                    } 
                };
            }

            if(parsedJson && parsedJson.length > 0){
                console.log("Got results");
                this.setState({
                    columns: newColumns,
                    data: this.handleData(parsedJson),
                    response: Globals.jsonToTSV(parsedJson),
                    busy: false,
                    toggles: headers
                }, () => {
                    if(this.ref && this.ref.table){
                        this.updateTable();
                    }
                });
            } else {
                console.log("Null results");
                this.setState({
                    columns: [],
                    data: [],
                    response: parsedJson,
                    busy: false
                });
            }
        }).catch(error => { // 401/404/...
            console.error(error);
            this.setState({ busy: false });
        });
    }

    // stringify expected objects rather than just displaying [object Object]
    handleData = (results) => {
        if(results && results[0]) {
            let headers = getKeys(results[0]);

            // stringify any incoming objects
            if(headers.includes("doc")) {
                results.forEach(function(result) {
                    if(result.doc) {
                        result.doc = JSON.stringify(result.doc);
                    }
                });
            }
            
        }

        return results;
    }
    
    updateTable = () => {
        console.log("Table updated");
        try {
            this.ref.table.clearFilter(true);
            this.ref.table.setColumns(this.state.columns);
        } catch (e) {
            console.error(e);
        }
    }
    
    onSelectHandler = (val, act) => {
        console.log("Select");
        if(!val || !act){
            return;
        }

        this.setState(
        { 
            getRoute: val.value,
            getLabel: val.label,
            busy: true
        }, () => {
            this.get();
        });

    }

    
    // best performance is to Blob it on demand
    downloadResults = () => {
        if(this.state.response) {
            const csvBlob = new Blob([this.state.response]);
            const today = new Date().toISOString().split('T')[0];
            const csvFilename = `${this.state.getLabel}_${today}.tsv`;

    
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

    copy = () => {
        if(this.ref.table) {
            console.log(this.ref.table.getSelectedData());
            this.setState({ 
                selected: JSON.stringify(this.ref.table.getSelectedData()),
                rows: this.ref.table.getSelectedRows()
            }, () => {
                const el = this.textArea;
                el.select();
                document.execCommand("copy");

                this.state.rows.forEach(row => {
                    this.ref.table.selectRow(row._row.data.id);
                });
            });
        }
    }

    toggle = (key) => {
        this.ref.table.toggleColumn(key);
    }

    showColumnToggles = () => {
        if(this.state.toggles) {
            return this.state.toggles.map( ((key, i) => {
                return <button key={key} onClick={() => this.toggle(key)}>{key}</button>
            }));
        }
    }

    render() {
        if(Globals.approverOrHigher()) {
            return (
                <div id="admin-files" className="padding-all content">
                    <Helmet>
                        <title>NEPAccess</title>
                        <link rel="canonical" href="https://nepaccess.org/interaction_logs" />
                        <meta name="robots" content="noindex, nofollow" data-react-helmet="true" />
                    </Helmet>

                    {/* <Select
                        className="block"
                        options={getRoutes}
                        name="getRoute" 
                        onChange={this.onSelectHandler}
                    /> */}
                    <div>
                        Note: All log times are recorded in Coordinated Universal Time ‎(UTC)‎. Because neither Arizona (Mountain Standard Time (MST)) nor UTC observe daylight saving time, UTC is always 7 hours ahead of MST.
                    </div>
                    <div className="loader-holder">
                        <div className="lds-ellipsis" hidden={!this.state.busy}><div></div><div></div><div></div><div></div></div>
                    </div>


                    <div>Click to toggle columns: {this.showColumnToggles()}</div>
                    
                    <ReactTabulator
                        ref={ref => (this.ref = ref)}
                        data={this.state.data}
                        columns={[]}
                        options={options}
                    />
                    <label>(Click any cell to copy that value.)</label>
                    <br />
                    
                    <button 
                        className="button"
                        onClick={this.copy}
                    >
                        Stringify and copy selection to clipboard
                    </button>
                    <textarea ref={(textarea) => this.textArea = textarea} 
                                name="resultJSONString" value={this.state.selected} readOnly />
                    
                    <button 
                        className="button"
                        onClick={this.downloadResults}
                    >
                        Download results as .tsv
                    </button>


                </div>
            );
        } else {
            return <div className="content">
                <Helmet>
                    <title>NEPAccess</title>
                    <link rel="canonical" href="https://nepaccess.org/interaction_logs" />
                    <meta name="robots" content="noindex, nofollow" data-react-helmet="true" />
                </Helmet>
                401
            </div>;
        }
        
    }

    componentDidMount() {
        console.log("Get");
        this.get();
    }

}

function getKeys(obj) {
    let keysArr = [];
    for (var key in obj) {
      keysArr.push(key);
    }
    return keysArr;
}