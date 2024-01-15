import React from 'react';
import axios from 'axios';

import Globals from './globals.jsx';

import DeleteAll from './DeleteAll.jsx';

import { ReactTabulator } from 'react-tabulator';

const options = Globals.tabulatorOptions;

const columns = [
    { title: "Role", field: "role", width: 140, headerFilter:"input"  },
    { title: "Username", field: "username", headerFilter:"input"},
    { title: "Active", field: "active", width: 150, headerFilter:"input"  },
    { title: "Email", field: "email", width: 140, headerFilter:"input"  },
    { title: "Email verified", field: "verified", width: 200, headerFilter:"input"  },
    { title: "First name", field: "first", width: 150, headerFilter:"input" },
    { title: "Last name", field: "last", width: 140, headerFilter:"input"  },
];

export default class Admin extends React.Component {
    resp = "";

    state = {
        users: [],
        response: "",
        admin: false,
        role: "",
        password: ""
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
        }).then(response => {
            console.log("Response", response);
            console.log("Status", response.status);
            let responseOK = response.data && response.status === 200;
            if (responseOK) {
                this.setState({
                    admin: true
                });
            } else {
                console.log("Else");
            }
        }).catch(error => {
            //
        })
    }

    getUsers = () => {
        console.log("Fetching user list");
        let getUrl = Globals.currentHost + "user/getAll";
        
        axios.get(getUrl, {
            params: {
                
            }
        }).then(response => {
            let responseOK = response && response.status === 200;
            if (responseOK && response.data) {
                console.log(response.data);
                return response.data;
            } else {
                return null;
            }
        }).then(parsedJson => { 
            if(parsedJson){
                this.setState({
                    users: this.setupData(parsedJson)
                });
            } else { // null/404

            }
        }).catch(error => {
            console.error(error);
        });
    }

    setupData = (results) => {
        console.log("Results",results);
        if(results && results[0]) { 
            return results.map((result, idx) =>{
                let doc = result;
                let newObject = {
                    id: doc[0],
                    username: doc[1], 
                    active: doc[2], 
                    email: doc[3], 
                    verified: doc[4], 
                    first: doc[5], 
                    last: doc[6], 
                    role: doc[7]
                };
                return newObject;
            });
        } else { // ??
            return [];
        }
    }

    setApprove = (_userId, status) => {
        const approveUrl = new URL('user/setUserApproved', Globals.currentHost);
        const dataForm = new FormData();
        dataForm.append('userId', _userId);
        dataForm.append('approved',status);

        axios({
            url: approveUrl,
            method: 'POST',
            data: dataForm
        }).then(_response => {
            const rsp = this.resp += (JSON.stringify({data: _response.data, status: _response.status}));
            this.setState({
                response: rsp 
            });
            // let responseOK = response && response.status === 200;
        }).catch(error => { // redirect
            console.error(error);
        })
    }

    approve = (status) => {
        document.body.style.cursor = 'wait';
        const selectedData = this.my_table.current.table.getSelectedData();
        
        for(let i = 0; i < selectedData.length; i++) {
            this.setApprove(selectedData[i].id, status);
        }
        setTimeout(() => {
            this.getUsers();
            document.body.style.cursor = 'default';
            this.resp = "";
        }, 1000);
    }

    setVerify = (_userId, status) => {
        const approveUrl = new URL('user/setUserVerified', Globals.currentHost);
        const dataForm = new FormData();
        dataForm.append('userId', _userId);
        dataForm.append('approved',status);

        axios({
            url: approveUrl,
            method: 'POST',
            data: dataForm
        }).then(_response => {
            const rsp = this.resp += (JSON.stringify({data: _response.data, status: _response.status}));
            this.setState({
                response: rsp 
            });
            // let responseOK = response && response.status === 200;
        }).catch(error => { // redirect
            console.error(error);
        })
    }

    verify = (status) => {
        document.body.style.cursor = 'wait';
        const selectedData = this.my_table.current.table.getSelectedData();
        
        for(let i = 0; i < selectedData.length; i++) {
            this.setVerify(selectedData[i].id, status);
        }
        setTimeout(() => {
            this.getUsers();
            document.body.style.cursor = 'default';
            this.resp = "";
        }, 1000);
    }
    
    setRole = (_userId) => {
        console.log("Firing for ID",_userId);
        const approveUrl = new URL('user/setUserRole', Globals.currentHost);
        const dataForm = new FormData();
        dataForm.append('userId', _userId);
        dataForm.append('role',this.state.role);

        axios({
            url: approveUrl,
            method: 'POST',
            data: dataForm
        }).then(_response => {
            const rsp = this.resp += (JSON.stringify({data: _response.data, status: _response.status}));
            this.setState({
                response: rsp 
            });
            // let responseOK = response && response.status === 200;
        }).catch(error => { 
            const rsp = this.resp += (JSON.stringify({data: error.data, status: error.response.status}));
            this.setState({
                response: rsp 
            });
        })
    }

    role = () => {
        document.body.style.cursor = 'wait';
        const selectedData = this.my_table.current.table.getSelectedData();
        
        for(let i = 0; i < selectedData.length; i++) {
            this.setRole(selectedData[i].id);
        }
        setTimeout(() => {
            this.getUsers();
            document.body.style.cursor = 'default';
            this.resp = "";
        }, 1000);
    }

    onChange = (evt) => {
        if(this.my_table && this.my_table.current) {
            this.setState({ 
                [evt.target.name]: evt.target.value,
                rows: this.my_table.current.table.getSelectedRows()
            }, () => {
                // keep selection
                this.state.rows.forEach(row => {
                    this.my_table.current.table.selectRow(row._row.data.id);
                });
            });
        } else {
            this.setState({[evt.target.name]: evt.target.value});
        }
    }

    validPassword = () => {
        return (Globals.validPassword(this.state.password));
    }

    
    password = () => {
        document.body.style.cursor = 'wait';
        const selectedData = this.my_table.current.table.getSelectedData();
        
        for(let i = 0; i < selectedData.length; i++) {
            this.setPassword(selectedData[i].id);
        }
        setTimeout(() => {
            this.getUsers();
            document.body.style.cursor = 'default';
            this.resp = "";
        }, 1000);
    }

    setPassword = (_userId) => {
        console.log("Firing setPassword for ID",_userId);
        const _url = new URL('admin/set_password', Globals.currentHost);
        const _data = new FormData();
        _data.append('userId', _userId);
        _data.append('password',this.state.password);

        axios({
            url: _url,
            method: 'POST',
            data: _data
        }).then(_response => {
            const rsp = this.resp += (JSON.stringify({data: _response.data, status: _response.status}));
            this.setState({
                response: rsp,
                password: ""
            });
            // let responseOK = response && response.status === 200;
        }).catch(error => { 
            this.setState({
                response: error.message, 
                password: ""
            });
        })
    }
    
    doPost = (url) => {
        const _url = new URL(url, Globals.currentHost);

        axios({
            url: _url,
            method: 'POST',
            data: {

            }
        }).then(_response => {
            const rsp = this.resp += (JSON.stringify({data: _response.data, status: _response.status}));
            this.setState({
                response: rsp
            });
        }).catch(error => { 
            this.setState({
                response:error.response.status + ": " + error.message
            });
        })
    }
    doGet = (url) => {
        const _url = new URL(url, Globals.currentHost);

        axios({
            url: _url,
            method: 'GET',
            data: {

            }
        }).then(_response => {
            const rsp = this.resp += (JSON.stringify({data: _response.data, status: _response.status}));
            this.setState({
                response: rsp
            });
        }).catch(error => { 
            this.setState({
                response:error.response.status + ": " + error.message
            });
        })
    }
    

    reindex() {

        console.log("Activating full reindex for " + Globals.currentHost);

        axios.get((Globals.currentHost + 'text/sync'),{
            responseType: 'blob'
        })
        .then((response) => {
            console.log("Response", response);
            // verified = response && response.status === 200;
        })
        .catch((err) => { 
            console.log(err);
        });

    }
    
    render() {

        if(this.state.admin) {
            return (
                <div id="approve">
                    <div className="instructions"><span className="bold">
                        Instructions: 
                        Hold shift and drag rows to select/deselect multiple users, or click row to select/deselect.
                        Table will update after clicking approve or deactivate button.
                    </span></div>
                    
                    <ReactTabulator
                        ref={this.my_table}
                        data={this.state.users}
                        columns={columns}
                        options={options}
                        pageLoaded={this.onPageLoaded}
                    />
                    <br />

                    <div>
                        <button type="button" className="button" onClick={() => this.reindex()}>
                            Reindex database (expect this to take a while)
                        </button>
                    </div>
                    
                    <div>
                        <button type="button" className="button" onClick={() => this.role()}>
                            Set role to:
                        </button>
    
                        <input type="text" onInput={this.onChange} name="role" />
                    </div>
                    
                    <div>
                        <button type="button" className="button" onClick={() => this.verify(true)}>
                            Verify user(s)
                        </button>
    
                        <button type="button" className="button" onClick={() => this.verify(false)}>
                            Unverify user(s)
                        </button>
                    </div>
    
                    <div>
                        <button type="button" className="button" onClick={() => this.approve(true)}>
                            Approve (activate) user(s)
                        </button>
    
                        <button type="button" className="button" onClick={() => this.approve(false)}>
                            Deactivate user(s)
                        </button>
                    </div>

                    <hr></hr>
                    <div>
                        <button disabled={!this.validPassword()}
                                type="button" onClick={() => this.password()}>
                            Set password to: 
                        </button>
                        
                        <input type="text" 
                                onInput={this.onChange} 
                                onChange={this.onChange} 
                                name="password" 
                                value={this.state.password} />
                    </div>
                    <hr></hr>
    
                    <br />
                    
                    {/* <button type="button" onClick={() => this.doPost("test/add_rods")}>
                        Generate RODs
                    </button> */}

                    <button type="button" onClick={() => this.doPost("admin/exec_delete_requests")}>
                        Execute all delete requests
                    </button>

                    <button type="button" onClick={() => this.doPost("admin/fix_garbage")}>
                        Delete garbage and get report
                    </button>
                    
                    <button type="button" onClick={() => this.doPost("geojson/replace_county_names")}>
                        Replace county names
                    </button>

                    <div>
                        <button type="button" onClick={() => this.doGet("text/milli_test")}>
                            Test speeds (scored; unscored)
                        </button>
                    </div>
                    
                    <div>
                        <button type="button" onClick={() => this.doGet("text/normalize_titles")}>
                            Normalize titles (tab to space, double space to single space, remove all newline chars)
                        </button>
                    </div>

                    <div><span>
                        Server response
                    </span></div>

                    <textarea className="server-response" readOnly value={this.state.response}></textarea>

                    <hr />
                    <DeleteAll admin={this.state.admin} />
                </div>
            );
        } else {
            return <div id="approve">401</div>
        }

        
    }

    componentDidMount = () => {
        try {
            this.checkAdmin();
            this.getUsers();
        } catch(e) {
            console.error(e);
        }
    }
}