import React from 'react';
import axios from 'axios';

import Globals from './globals.jsx';

import DeduplicatorTab from './DeduplicatorTab.jsx';

export default class Deduplicator extends React.Component {
    
    state = {
        response: "",
        admin: false,
        id1: "",
        id2: ""
    }


    checkCurator = () => {
        let checkUrl = new URL('user/checkCurator', Globals.currentHost);
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


    onChange = (evt) => {
        this.setState({ [evt.target.name]: evt.target.value.trim() });
    }
    
    
    render() {

        if(this.state.admin) {
            return (
                <div id="approve">
                    <div className="instructions"><span className="bold">
                        Instructions: Enter two record IDs to compare, then edit, save changes, or delete records, as needed.
                    </span></div>
                    
                    <div className="left-right-holder">
                        <div className="deduplicator-tab">
                            <b>Left: </b><input type="text" onInput={this.onChange} onChange={this.onChange} name="id1" value={this.state.id1}/>
                        </div>
                        <div className="deduplicator-tab">
                            <b>Right: </b><input type="text" onInput={this.onChange} onChange={this.onChange} name="id2" value={this.state.id2}/>
                        </div>
                    </div>

                    <div className="deduplicator">
                        <DeduplicatorTab id={this.state.id1}></DeduplicatorTab>
                        <DeduplicatorTab id={this.state.id2}></DeduplicatorTab>
                    </div>
                </div>
            );
        } else {
            return <div className="content">401</div>
        }

        
    }

    componentDidMount = () => {
        try {
            this.checkCurator();
        } catch(e) {
            console.error(e);
        }
    }
}