import React from 'react';
import {Helmet} from 'react-helmet';
import axios from 'axios';

import Globals from './globals.jsx';

import './approve.css';

import 'react-tabulator/lib/styles.css'; // required styles
import 'react-tabulator/lib/css/tabulator_site.min.css'; // theme

import { ReactTabulator } from 'react-tabulator';

const options = {
    // maxHeight: "100%",           // for limiting table height
    selectable:true,
    layoutColumnsOnNewData: true,
    tooltips:false,
    responsiveLayout:"collapse",    //collapse columns that dont fit on the table
    // responsiveLayoutCollapseUseFormatters:false,
    pagination:"local",             //paginate the data
    paginationSize:10,              //allow 10 rows per page of data
    paginationSizeSelector:[10, 25, 50, 100], // with all the text, even 50 is a lot.
    movableColumns:false,            //don't allow column order to be changed
    resizableRows:false,             
    resizableColumns:true,
    layout:"fitColumns",
    invalidOptionWarnings:false, // spams warnings without this
    footerElement:("<span class=\"tabulator-paginator-replacer\"><label>Results Per Page:</label></span>")
};

const columns = [
    { title: "Username", field: "username", headerFilter:"input"},
    { title: "Active", field: "active", width: 100, headerFilter:"input"  },
    { title: "Email", field: "email", width: 250, headerFilter:"input"  },
    { title: "Email verified", field: "verified", width: 140, headerFilter:"input"  },
    { title: "First name", field: "first", width: 150, headerFilter:"input" },
    { title: "Last name", field: "last", width: 140, headerFilter:"input"  },
];

export default class Approve extends React.Component {
    resp = "";

    state = {
        users: [],
        approver: false,
        response: ""
    }

    constructor(props) {
        super(props);

        this.my_table = React.createRef();
    }
    
    checkApprover = () => {
        try{
        let checkUrl = new URL('user/checkApprover', Globals.currentHost);
        axios({
            url: checkUrl,
            method: 'POST'
        }).then(response => {
            let responseOK = response.data && response.status === 200;
            if (responseOK) {
                this.setState({
                    approver: true
                });
            }
        }).catch(error => {
            //
            console.error('Error Checking appr', error);
        })
    } catch (error) {
        console.error('Un expected ERROR checking approver',error);
    }
    }

    getUsers = () => {
        let getUrl = Globals.currentHost + "user/getAll";
        try{
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
        catch(e){
            console.error('FAILED TO GET USERS',e);
        }
    }

    setupData = (results) => {
        if(results && results[0]) { // NEPAFiles should have Folders, necessarily
            return results.map((result, idx) =>{
                let doc = result;
                let newObject = {
                    // username: doc.username, 
                    // first: doc.firstName, 
                    // last: doc.lastName, 
                    // email: doc.email, 
                    // active: doc.active, 
                    // verified: doc.verified, 
                    // id: doc.id
                    id: doc[0],
                    username: doc[1], 
                    active: doc[2], 
                    email: doc[3], 
                    verified: doc[4], 
                    first: doc[5], 
                    last: doc[6], 
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
        .finally(() => {
            this.updateTable();
        })
        
        // this.updateTable();
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

    setVerifyEmail = (_userId) => {
        const approveUrl = new URL('user/setUserVerified', Globals.currentHost);
        const dataForm = new FormData();
        dataForm.append('userId', _userId);
        dataForm.append('approved',true);

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
        
        // this.updateTable();
    }

    verifyEmail = () => {
        document.body.style.cursor = 'wait';
        const selectedData = this.my_table.current.table.getSelectedData();
        
        for(let i = 0; i < selectedData.length; i++) {
            this.setVerifyEmail(selectedData[i].id);
        }
        setTimeout(() => {
            this.getUsers();
            document.body.style.cursor = 'default';
            this.resp = "";
        }, 1000);
    }
    
    render() {

        if(this.state.approver) {
            return (
                <div id="approve">
                    <Helmet>
                        <title>NEPAccess</title>
                        <link rel="canonical" href="https://nepaccess.org/approve" />
                        <meta name="robots" content="noindex, nofollow" data-react-helmet="true" />
                    </Helmet>
                    <div className="instructions"><span className="bold">
                        Instructions: 
                        Hold shift and drag rows to select/deselect multiple users, or click row to select/deselect.
                        Table will update after clicking approve or deactivate button.
                    </span></div>

                    <ReactTabulator
                        ref={this.my_table}
                        // data={this.state.users}
                        data={this.state.users}
                        columns={columns}
                        options={options}
                        pageLoaded={this.onPageLoaded}
                    />
                    <br />
                    <hr />

                    <div>
                        <button type="button" className="button" onClick={() => this.verifyEmail()}>
                            Verify email for user(s)
                        </button>

                        <br />

                        <button type="button" className="button" onClick={() => this.approve(true)}>
                            Approve (activate) user(s)
                        </button>

                        <button type="button" className="button"onClick={() => this.approve(false)}>
                            Deactivate user(s)
                        </button>

                        <br />
                    </div>

                    <br />
                    <div><span>
                        Server response
                    </span></div>
                    <textarea className="server-response" readOnly value={this.state.response}></textarea>
                </div>
            );
        } else {
            return <div id="approve">
                <Helmet>
                    <title>NEPAccess</title>
                    <link rel="canonical" href="https://nepaccess.org/approve" />
                    <meta name="robots" content="noindex, nofollow" data-react-helmet="true" />
                </Helmet>
                401
            </div>
        }
    }

    componentDidMount = () => {
        try {
            this.checkApprover();
            this.getUsers();
        } catch(e) {
            console.error(e);
        }
    }
}