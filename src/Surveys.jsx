import React from 'react';
import axios from 'axios';

import Globals from './globals.jsx';

import {Helmet} from 'react-helmet';

import { ReactTabulator } from 'react-tabulator';

const options = Globals.tabulatorOptions;

export default class Surveys extends React.Component {
    state = {
        data: [],
        columns: [],
        rows: [],
        selected: "",

        response: "",

        admin: false,
        busy: false,

        getRoute: "survey/get_all",
        getLabel: "surveys",
    }
    constructor(props) {
        super(props);

        this.ref = null;
    }

    checkAdmin = () => {
        let checkUrl = new URL('user/checkApprover', Globals.currentHost);
        let _admin = false;

        axios({
            url: checkUrl,
            method: 'POST'
        })
        .then(response => {
            let responseOK = response.data && response.status === 200;

            if (responseOK) {
                _admin = true;
            }
        })
        .catch(error => {
            console.error(error);
        })
        .finally(onF => {
            this.setState({
                admin: _admin
            });
        });
    }


    get = () => {
        let getUrl = Globals.currentHost + this.state.getRoute;
        
        axios.get(getUrl, {
            params: {
                
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
                    width: 200, // bunch of stuff breaks without this
                    headerFilter: "input",
                    cellClick: (e, cell) => {
                        // console.log(e,cell.getRow().getData());
                        const _terms = cell.getValue();
                        navigator.clipboard.writeText(_terms);
                    } 
                };
            }

            if(parsedJson && parsedJson.length > 0){
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

    handleData = (results) => {
        if(results && results[0]) {
            let headers = getKeys(results[0]);

            // stringify any incoming objects
            if(headers.includes("user")) {
                results.forEach(function(result) {
                    if(result.user) {
                        result.user = result.user.username;
                    }
                });
            }
        }

        return results;
    }
    
    updateTable = () => {
        try {
            this.ref.table.clearFilter(true);
            // seems necessary when using dynamic columns
            this.ref.table.setColumns(this.state.columns);
        } catch (e) {
            console.error(e);
        }
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

    render() {
        if(this.state.admin) {
            return (
                <div className="content">
                    <Helmet>
                        <meta charSet="utf-8" />
                        <title>Surveys - NEPAccess</title>
                        <link rel="canonical" href="https://nepaccess.org/surveys" />
                        <meta name="robots" content="noindex, nofollow" data-react-helmet="true" />
                    </Helmet>
                    <div className="padding-all">

                        <ReactTabulator
                            ref={ref => (this.ref = ref)}
                            data={this.state.data}
                            columns={[]}
                            options={options}
                        />
                        <label>(Click any cell to copy that value.)</label>

                        <div className="loader-holder">
                            <div className="lds-ellipsis" hidden={!this.state.busy}><div></div><div></div><div></div><div></div></div>
                        </div>
                        <hr />

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


                </div>
            );
        } else {
            return <div className="content">
            <Helmet>
                <meta charSet="utf-8" />
                <title>Surveys - NEPAccess</title>
                <link rel="canonical" href="https://nepaccess.org/surveys" />
                <meta name="robots" content="noindex, nofollow" data-react-helmet="true" />
            </Helmet>401</div>;
        }
        
    }

    componentDidMount = () => {
        this.checkAdmin();
        this.get();
    }
    
    componentDidUpdate() {
        console.log("Component Updated");
    }
}

function getKeys(obj) {
    let keysArr = [];
    for (var key in obj) {
      keysArr.push(key);
    }
    return keysArr;
}