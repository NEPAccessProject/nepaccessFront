import React from 'react';
import {Helmet} from 'react-helmet';

import axios from 'axios';
import Select from 'react-select';

import Admin from './Admin.jsx';
import AdminFind from './AdminFind.jsx';
import AdminRestoreTool from './AdminRestoreTool.jsx';
// import Generate from './Generate.jsx';
// import Generate2 from './Generate2.jsx';
import Deduplicator from './Deduplicator.jsx';
import AdminEmailer from './AdminEmailer.jsx';

import Globals from './globals.jsx';

export default class AdminPanel extends React.Component {
    resp = "";

    state = {
        response: "",
        admin: false,
        dropdownOption: { value: '', label: ''}
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

	onDropdownChange = (evt) => {
        this.setState({ dropdownOption: evt });
    }
    
    showDropdown = () => {        
        let admin = this.state.admin;
        
        let viewOptions = [];
        if(admin) {
            viewOptions.push({ value: 'Admin', label: 'Admin' });
            viewOptions.push({ value: 'Find', label: 'Find' });
            viewOptions.push({ value: 'Restore', label: 'Restore' });
            // viewOptions.push({ value: 'Generate', label: 'Generate' });
            // viewOptions.push({ value: 'Generate2', label: 'Generate2' });
            viewOptions.push({ value: 'Deduplicator', label: 'Deduplicator' });
            viewOptions.push({ value: 'Emailer', label: 'Emailer' });
        }

        // Don't show dropdown at all if curator, now that we've hidden the title alignment also
        if(admin) {

            const customStyles = {
                option: (styles, state) => ({
                     ...styles,
                    borderBottom: '1px dotted',
                    backgroundColor: 'white',
                    color: 'black',
                    '&:hover': {
                        backgroundColor: '#b2c5f5'
                    },
                    width: "500px",
                }),
                control: (styles) => ({
                    ...styles,
                    backgroundColor: 'white',
                })
            }

            return (<>
                <h3 className="advanced-label inline" htmlFor="detailsDropdown">Select view: </h3>
                <Select id="detailsDropdown" className="multi inline-block" classNamePrefix="react-select" name="detailsDropdown" isSearchable 
                    styles={customStyles}
                    options={viewOptions} 
                    onChange={this.onDropdownChange} 
                    value={this.state.dropdownOption}
                    // (temporarily) specify menuIsOpen={true} parameter to keep menu open to inspect elements.
                    // menuIsOpen={true}
                />
            </>);
        } else {
            return "";
        }
    }

    showView = () => {
        // One benefit of switching here instead of dynamically hiding elements is that Tabulator doesn't error out when hidden
        if(this.state.dropdownOption.value === 'Admin'){ // Show details panel
            return (
                <Admin />
            );
        } else if(this.state.dropdownOption.value === 'Find') {
            return (
                <AdminFind />
            );
        } else if(this.state.dropdownOption.value === 'Restore') {
            return <AdminRestoreTool />
        // } else if(this.state.dropdownOption.value === 'Generate') {
        //     return <Generate />
        // } else if(this.state.dropdownOption.value === 'Generate2') {
        //     return <Generate2 />
        } else if(this.state.dropdownOption.value === 'Deduplicator') {
            return <Deduplicator />
        } else if(this.state.dropdownOption.value === 'Emailer') {
            return <AdminEmailer />
        } else {
        }
    }
    

    onChange = (evt) => {
        this.setState({ [evt.target.name]: evt.target.value });
    }

    render() {

        if(this.state.admin) {
            return (
                <div className="content">
                    <Helmet>
                        <title>NEPAccess</title>
                        <link rel="canonical" href="https://nepaccess.org/admin" />
                        <meta name="robots" content="noindex, nofollow" data-react-helmet="true" />
                    </Helmet>
                    <label className="errorLabel">{this.state.networkError}</label>
                    <br />
                    {this.showDropdown()}
                    {this.showView()}
                </div>
            );
        } else {
            return <div className="content">
                <Helmet>
                    <title>NEPAccess</title>
                    <link rel="canonical" href="https://nepaccess.org/admin" />
                    <meta name="robots" content="noindex, nofollow" data-react-helmet="true" />
                </Helmet>
                401
            </div>
        }

        
    }

    componentDidMount = () => {
        try {
            this.checkAdmin();
        } catch(e) {
            console.error(e);
        }
    }
}