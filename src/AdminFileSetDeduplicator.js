import React from 'react';
import {OutTable, ExcelRenderer} from 'react-excel-renderer';

import axios from 'axios';
import Globals from './globals.js';

import './excel.css';

export default class AdminFileSetDeduplicator extends React.Component {

    state = {
        deleteName: "",
        id: "",
        newName: "",

        server_response: "",

        busy: false
    }

    onChange = (evt) => {
        this.setState({ [evt.target.name]: evt.target.value }, () => {
            console.log(this.state);
        });
    }

    get = (getRoute) => {
        this.setState({ busy: true });

        let getUrl = Globals.currentHost + getRoute;
        
        axios.get(getUrl, {
            params: {
                
            }
        }).then(response => {
            let responseOK = response && response.status === 200;
            if (responseOK && response.data) {
                this.setState({
                    busy: false,
                    server_response: response.data
                });
            } else {
                this.setState({
                    busy: false,
                    server_response: response
                });
            }
        }).catch(error => { // 401/404/...
            console.error(error);
            this.setState({ busy: false });
        });
    }
    
    post = (_postUrl, _data) => {
        const postUrl = new URL(_postUrl, Globals.currentHost);
        axios({
            url: postUrl,
            method: 'POST',
            data: _data
        }).then(_response => {
            const rsp = JSON.stringify(_response.data);
            this.setState({
                server_response: rsp 
            }, () => {
                console.log("JSON response", this.state.server_response);
            });
            // let responseOK = response && response.status === 200;
        }).catch(error => { // redirect
            console.error(error);
        })
    }

    render() {
        if(Globals.curatorOrHigher) {return (
            <div id="excel-holder" className="content">
                
                {/* <button onClick={() => this.get("file/get_multi_folder")}>Get folders</button>
                <br /> */}

                <label>Name</label>
                <div><input name="deleteName" onChange={this.onChange} type="text"></input></div>
                <label>Doc id</label>
                <div><input name="id" onChange={this.onChange} type="text"></input></div>
                <label>New name</label>
                <div><input name="newName" onChange={this.onChange} type="text"></input></div>

                <button onClick={() =>  this.post("file/delete_folder", {
                        "deleteName":   this.state.deleteName, 
                        "id":           this.state.id, 
                        "newName":      this.state.newName}) }
                >
                    Delete folder
                </button>

                <br />
                <label>Server response</label>
                <div><textarea value={this.state.server_response} readOnly /></div>

            </div>
        );
        }
    }

    componentDidMount = () => {
    }
    
    componentDidUpdate() {
    }
}