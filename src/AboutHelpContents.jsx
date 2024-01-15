import React from 'react';
import axios from 'axios';

import Globals from './globals.jsx';


import './aboutNepa.css';
import './aboutHelp.css';

export default class AboutHelpContents extends React.Component {

    constructor() {
        super();
        this.state = {
            finalCount: null,
            draftCount: null,
            finalCountDownloadable: null,
            draftCountDownloadable: null,
            textCount: null,
            earliestYear: null,
            latestYear: '2021'
        }
        
        this.get("stats/draft_count","draftCount");
        this.get("stats/final_count","finalCount");
        this.get("stats/draft_count_downloadable","draftCountDownloadable");
        this.get("stats/final_count_downloadable","finalCountDownloadable");
        this.get("stats/text_count","textCount");
        this.get("stats/earliest_year","earliestYear");
        this.get("stats/latest_year","latestYear");
    }
    

    get = (endPath,stateField) => {
        let getUrl = Globals.currentHost + endPath;
        
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
            console.log(parsedJson);
            if(parsedJson){
                this.setState({
                    [stateField]: parsedJson
                });
            } else { 
                console.log("Null/404: " + endPath);
            }
        }).catch(error => {
            console.error(error);
        });
    }
    

    render () {
        return (
            <div className="content">
                <div id="about-nepa-content">

                    <h1 className="about-nepa-title">
                        What the database contains
                    </h1>
                    
                    <h2>
                        Environmental Impact Statements
                    </h2>

                    <div><p>
                        <span className="dynamic-stat">Blue</span> items are dynamic (retrieved on demand from database).
                    </p></div>
                    
                    <div>
                        NEPAccess contains all (or almost all) records from environmental impact statements (EIS) created between 1987-{this.state.latestYear}. There are downloadable PDF files from <span className="dynamic-stat">{this.state.earliestYear}</span>-<span className="dynamic-stat">{this.state.latestYear}</span>. 
                    </div>
                    
                    <div><p>
                        This includes <span className="dynamic-stat">{this.state.draftCount}</span> draft and <span className="dynamic-stat">{this.state.finalCount}</span> final EIS documents (supplemental/revised not counted here).
                        Of these, <span className="dynamic-stat">{this.state.draftCountDownloadable}</span> drafts and <span className="dynamic-stat">{this.state.finalCountDownloadable}</span> finals are in a format that supports full-text searching and downloading.
                        </p><p>NEPAccess is a work in progress—as time goes on, other documents related to the National Environmental Policy Act of 1969 (NEPA) will be added.  Total searchable texts (each one representing a .pdf): <span className="dynamic-stat">{this.state.textCount}</span>.
                    </p></div>

                    <div>
                        Efforts to compile a complete set of documents are ongoing.
                    </div>

                </div>
            </div>
        );
    }

    componentDidMount() {
    }
}