import React from 'react';
import axios from 'axios';

import Select from 'react-select';

import Globals from './globals.jsx';

import { ReactTabulator } from 'react-tabulator';

const options = Globals.tabulatorOptions;

const getRoutes = [
    { label: "admin/findAllUpdateLogs", value: "admin/findAllUpdateLogs" },
];

export default class AdminRestoreTool extends React.Component {

    state = {
        data: [],
        columns: [],

        response: "",
        server_response: "",

        userID: "",

        admin: false,
        busy: false,

        getRoute: ""
    }

    constructor(props) {
        super(props);

        this.my_table = React.createRef();
    }


    checkAdmin = () => {
        let checkUrl = new URL('user/checkAdmin', Globals.currentHost);

        axios({
            url: checkUrl,
            method: 'POST'
        })
        .then(response => {
            let responseOK = response.data && response.status === 200;

            if (responseOK) {
                this.setState({
                    admin: true
                });
            } else {
                this.setState({
                    admin: false
                });
            }
        })
        .catch(error => {
            console.error(error);

            this.setState({
                admin: false
            });
        });
    }


    get = () => {
        this.setState({ busy: true });

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
                newColumns[i] = {title: headers[i], field: headers[i], width: 100, headerFilter: "input"};
            }

            if(parsedJson){
                this.setState({
                    columns: newColumns,
                    data: this.handleData(parsedJson),
                    response: Globals.jsonToTSV(parsedJson),
                    busy: false
                });
            } else {
                console.log("Null");
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
            if(headers.includes("eisdoc") || headers.includes("user")) {
                results.forEach(function(result) {
                    if(result.eisdoc) {
                        result.eisdoc = JSON.stringify(result.eisdoc);
                    }
                    else if(result.user) {
                        result.user = JSON.stringify(result.user);
                    }
                });
            }
            
        }

        return results;
    }
    
    updateTable = () => {
        try {
            // seems necessary when using dynamic columns
            this.my_table.current.table.setColumns(this.state.columns);

            // this.my_table.current.table.replaceData(this.state.data);
        } catch (e) {
            console.error(e);
        }
    }

    onChange = (evt) => {
        this.setState({ [evt.target.name]: evt.target.value });
    }
    
    onSelectHandler = (val, act) => {
        if(!val || !act){
            return;
        }

        this.setState(
        { 
            getRoute: val.value
        }, () => {
            this.get();
        });

    }

    
    // best performance is to Blob it on demand
    downloadResults = () => {
        if(this.state.response) {
            const csvBlob = new Blob([this.state.response]);
            const today = new Date().toISOString().split('T')[0];
            const csvFilename = `results_${today}.tsv`;

    
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

    // Simply restore all changes in given selection of UpdateLogs (from latest change to earliest).
    // Note: This means redundant updates will be done if duplicate documents are in the selection.
    restoreSelection = () => {
        document.body.style.cursor = 'wait';
        const selectedData = this.my_table.current.table.getSelectedData();
        
        for(let i = selectedData.length - 1; i >= 0; i--) {
            console.log(i);
            console.log(selectedData[i]);
            if(selectedData[i] && typeof(selectedData[i] !== 'undefined')) {
                this.restoreOneByID(selectedData[i].id);
            }
        }
        document.body.style.cursor = 'default';
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

    restoreOneByID = (updateLogId) => {
        const postUrl = new URL('update_log/restore', Globals.currentHost);
        const dataForm = new FormData();
        dataForm.append('id', updateLogId);

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

    // This would restore the earliest version of given doc id
    // that comes after or equal to given datetime
    // and matches on user id strictly
    restoreOne = (_docID,_datetime,_userID) => {
        const postUrl = new URL('update_log/restore_doc_date_user', Globals.currentHost);
        const dataForm = new FormData();
        dataForm.append('id', _docID);
        dataForm.append('datetime',_datetime);
        dataForm.append('userid', _userID);

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

    /** Get distinct IDs, reduce array of selected table rows to min/max dates/values. 
     *  Set state appropriately. */
    setAll = () => {        
        console.log(this.my_table.current.table.getSelectedData());
        if(this.my_table.current.table.getSelectedData().length === 0) {
            console.log("Whoops");
            return;
        }

        const selectedData = this.my_table.current.table.getSelectedData();

        const earliest = selectedData.reduce(function (pre, cur) {
            return Date.parse(pre.savedTime) > Date.parse(cur.savedTime) ? cur : pre;
        }).savedTime;
        
        const latest = selectedData.reduce(function (pre, cur) {
            return Date.parse(pre.savedTime) < Date.parse(cur.savedTime) ? cur : pre;
        }).savedTime;

        const first = selectedData.reduce(function (pre, cur) {
            return pre.id > cur.id ? cur : pre;
        }).id;

        const last = selectedData.reduce(function (pre, cur) {
            return pre.id < cur.id ? cur : pre;
        }).id;

        const distinctIDs = [...new Set(selectedData.map(x => x.id))];
        const distinctUserIDs = [...new Set(selectedData.map(x => x.userId))];
        const distinctDocuments = [...new Set(selectedData.map(x => x.documentId))];

        console.log(earliest,latest,first,last);
        console.log("Distinct IDs",distinctIDs);
        console.log("Distinct User Ids",distinctUserIDs);

        this.setState({
            dateStart: earliest,
            dateEnd: latest,
            logStart: first,
            logEnd: last,
            userID: distinctUserIDs,
            updateLogs: distinctIDs,
            documents: distinctDocuments,
            rows: this.my_table.current.table.getSelectedRows()
        }, () => {
            if(this.my_table.current) {
                this.state.rows.forEach(row => {
                    this.my_table.current.table.selectRow(row._row.data.id);
                });
            }
        });

        // for(let i = selectedData.length; i > 0; i--) {
        //     console.log(i);
        //     console.log(selectedData[i]);
        //     this.restoreOne(selectedData[i].documentId,this.state.earliestDateTime,selectedData[i].userId);
        // }
    }

    /** Update all documents inside date range to the earliest version of each document starting from dateStart */
    restoreByDateRange = () => {
        // If we can programmatically select from the table:
        // Use restoreOne(doc,date,userID) with every distinct doc and the earliest
        // date in the range of dates.
        // Else do all the work on the backend
        if(this.state.dateStart && this.state.dateEnd) {
            const postUrl = new URL('update_log/restore_date_range', Globals.currentHost);

            const dataForm = new FormData();
            dataForm.append('datetimeStart',this.state.dateStart);
            dataForm.append('datetimeEnd',this.state.dateEnd);
            dataForm.append('userid', this.state.userID);

            this.post(postUrl,dataForm);
        } else {
            console.log("Missing dates");
        }


    }

    /** Update all documents inside id range to the earliest version of each document starting from idStart */
    // Theoretically there's no great distinction here - IDs are created sequentially, so they are in the same
    // exact order as dates.  But the user is more likely to have an exact ID range handy than an exact date range.
    restoreByIDRange = () => {
        // console.log(this.my_table.current.table.getSelectedData());
        // if(this.my_table.current.table.getSelectedData().length === 0) {
        //     return;
        // }
        // const selectedData = this.my_table.current.table.getSelectedData();

        // const distinctDocuments = [...new Set(selectedData.map(x => x.documentId))];
        
        if(this.state.logStart && this.state.logEnd) {
            const postUrl = new URL('update_log/restore_id_range', Globals.currentHost);

            const dataForm = new FormData();
            dataForm.append('idStart',this.state.logStart);
            dataForm.append('idEnd',this.state.logEnd);
            dataForm.append('userid', this.state.userID);

            this.post(postUrl,dataForm);
        } else {
            console.log("Missing ids");
        }
    }



    render() {

        if(this.state.admin) {
            return (
                <div className="content padding-all">

                    <div className="loader-holder">
                        <div className="lds-ellipsis" hidden={!this.state.busy}><div></div><div></div><div></div><div></div></div>
                    </div>
                    
                    <ReactTabulator
                        ref={this.my_table}
                        data={this.state.data}
                        columns={this.state.columns}
                        options={options}
                    />
                    <br />
                    
                    <Select
                        className="block"
                        options={getRoutes}
                        name="getRoute" 
                        onChange={this.onSelectHandler}
                    />
                    <br />

                    <span>Warning: The "Restore" buttons will in fact change the database contents.</span>

                    <br />
                    
                    <div className="padding-all">
                        <p><b>
                            Fill first/last timestamp found and first/last update log ID found, also all user IDs found:
                        </b></p>
                        <button className="button" onClick={this.setAll}>
                            Set inputs from selection
                        </button>
                        <p> Note: Can set multiple user IDs, but that's invalid.  Must use one or none.</p>

                        <label>Bonus information:</label>
                        <div>
                            <input type="text" value={this.state.updateLogs} readOnly /> List of UpdateLogs
                        </div>
                        <div>
                            <input type="text" value={this.state.documents} readOnly /> List of unique document IDs
                        </div>
                    </div>

                    <br />

                    <div className="padding-all">
                        <button 
                            className="button"
                            onClick={this.downloadResults}
                        >
                            Download results as .tsv
                        </button>
                    </div>

                    <br />



                    <label>
                        Redundant updates will be done if duplicate documents are in the selection.
                        Updates are restored oldest to earliest, so the earliest updates will be applied last.
                        This means the earliest restore point should take precedence, but there could be timing
                        issues, so it's best to not use this when your selection could have duplicate documents. 
                        In those cases, preferably use a date or ID range restore, or else weed out duplicates.
                    </label>
                    <div className="padding-all border-red">
                        <button type="button" onClick={() => this.restoreSelection()}>
                            Restore exact selection
                        </button>
                    </div>
                    <br />
                    <br />

                    <div className="padding-all border-red">
                        <div>
                            <button type="button" onClick={this.restoreByDateRange}>
                                Restore within this date range:
                            </button>
                        </div>

                        <br />

                        <div>
                            <input type="text" name="dateStart" value={this.state.dateStart} 
                                    onChange={this.onChange} onInput={this.onChange}>
                            </input> Datetime start
                        </div>

                        <div>
                            <input type="text" name="dateEnd" value={this.state.dateEnd} 
                                    onChange={this.onChange} onInput={this.onChange}>
                            </input> Datetime end
                        </div>
                        <div>
                            <input type="text" name="userID" value={this.state.userID} 
                                    onChange={this.onChange} onInput={this.onChange}>
                            </input> (Optional, can leave blank) user ID to enforce match on
                        </div>
                    </div>
                    <br />
                    <br />

                    <div className="padding-all border-red">
                        <div>
                            <button type="button" onClick={this.restoreByIDRange}>
                                Restore within this UpdateLogID range:
                            </button>
                        </div>

                        <br />

                        <div>
                            <input type="text" name="logStart" value={this.state.logStart} 
                                    onChange={this.onChange} onInput={this.onChange}>
                            </input> First ID
                        </div>

                        <div>
                            <input type="text" name="logEnd" value={this.state.logEnd} 
                                    onChange={this.onChange} onInput={this.onChange}>
                            </input> Last ID
                        </div>
                        <div>
                            <input type="text" name="userID" value={this.state.userID} 
                                    onChange={this.onChange} onInput={this.onChange}>
                            </input> (Optional, can leave blank) user ID to enforce match on.  
                        </div>
                    </div>

                    <br />
                    <label>Server response</label>
                    <div>
                        <textarea className="server-response" readOnly value={this.state.server_response} />
                    </div>
                    
                </div>
            );
        } else {
            return <div className="content">401</div>;
        }
        
    }

    componentDidMount = () => {
        this.checkAdmin();
    }
    
    componentDidUpdate() {
        if(this.my_table && this.my_table.current){
            this.updateTable();
        }
    }
}

function getKeys(obj) {
    let keysArr = [];
    for (var key in obj) {
      keysArr.push(key);
    }
    return keysArr;
}