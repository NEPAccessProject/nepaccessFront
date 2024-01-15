import React, {Component} from 'react';

import Dropzone from 'react-dropzone';

import axios from 'axios';
import Globals from './globals';

let reader;

/** Handle .geojson and prepare it in a way that Java will appreciate, then send it to backend and show the results to user */
export default class ImporterGeo extends Component {


    constructor(props) {
        super(props);

        this.state = { 
            totalSize: 0,
            geojson: [],

            networkError: '',
            successLabel: "Not ready",
            failLabel: '',
            results: "",

            dragClass: '',
            files: [],
            
            disabled: false,
            busy: false,
        };
    }


    onDrop = (dropped) => {
        
        // TODO: If we want to support multiple geojson files, we need to save a collection of feature collections instead
        // of exactly one feature collection.  This would probably return the geojson instead of setting state and the parent
        // calling this would run it in a loop and then save the whole collection of collections to state instead.

        // TODO: Let's just send each feature individually, and then file size isn't really a problem.  
        // Server messages will then be added on demand.
        const setText = (text) => {
            let _geojson = [];
            let json = JSON.parse(text);
            // console.log("JSON first feature in feature collection",json.features[0]);

            // Here's where we actually set up the data for import

            // Temporary logic to build a list of counties with prepended state abbreviations
            // let stateAbbrevs = {};
            // Globals.locations.forEach(location => {
            //     stateAbbrevs[location.label] = location.value;
            // });
            
            // Temporary logic to build a list of counties with prepended state abbreviations
            // let stateIDs = {};
            // json.features.forEach(feature => {
            //     if(feature.properties.STATENS) {
            //         const geoName = Globals.getParameterCaseInsensitive(feature.properties, "name");
            //         // TODO: Advanced logic could get the states, match those abbreviations and prepend to counties.
            //         // Then the frontend could split these and filter on state plus county, giving the most accurate county filter
            //         // possible with our data.
            //         stateIDs[feature.properties.GEOID] = geoName;
            //     }
            // });

            // let counties = [];
            json.features.forEach(feature => {
                const stringFeature = JSON.stringify(feature);
                const geoName = Globals.getParameterCaseInsensitive(feature.properties, "name");
                // Temporary logic to build a master list of 3220 counties with prepended state abbreviations
                // if(!feature.properties.STATENS) {
                //     let abbrevPrepend = stateAbbrevs[stateIDs[feature.properties.STATEFP]];
                //     counties.push({
                //         'value': geoName,
                //         'label': abbrevPrepend + ": " + geoName
                //     });
                // }
                _geojson.push({
                    'feature' : stringFeature, 
                    'geo_id'  : feature.properties.GEOID, 
                    'name'    : geoName,
                    // 'state_id': feature.properties.STATEFP // haven't used this so far
                });
            });

            // counties = counties.sort((a, b) => a.label.localeCompare(b.label));

            // console.log("Counties",counties);

            this.setState({
                geojson: _geojson,
                successLabel: "Ready"
            }, () => {
                this.dedupe();
            });
        }

        reader.onload = function(e) {
            let text = e.target.result;
            // console.log("Contents", text);

            setText(text);
        };

        this.setState({
            files: dropped,
            dragClass: '',
            totalSize: 0
        }, ()=> {
            console.log(this.state.files);

            this.state.files.forEach((file)=> {
                console.log("File", file);

                reader.readAsText(file);
            });
        }, () => {

            let _totalSize = 0;
            for(let i = 0; i < this.state.files.length; i++) {
                _totalSize += this.state.files[i].size;
            }

            this.setState({
                totalSize: _totalSize,
            });
        });

    };

    onDragEnter = (e) => {
        this.setState({
            dragClass: 'over'
        });
    }

    onDragLeave = (e) => {
        this.setState({
            dragClass: ''
        });
    }

    onChangeDummy = () => {}

    /** Validation */

    validated = () => {
        let valid = true;
        let labelValue = "";

        if(!this.state.geojson || this.state.geojson.length===0){ // No file(s)
            valid = false;
            labelValue = "File is required";
        }

        this.setState({failLabel: labelValue});
        return valid;
    }

    // Entry point for recursive operation of geoUploadOne()
    geoUpload = () => {
        if(!this.validated()) {
            return;
        }
        
        document.body.style.cursor = 'wait';
        this.setState({ 
            successLabel: 'In progress...',
            failLabel: '',
            results: "",
            disabled: true,
            busy: true
        });

        const importUrl = new URL('geojson/import_geo_one', Globals.currentHost);

        this.geoUploadOne(importUrl,0);

    }

    geoUploadOne = (importUrl, i) => {
        if(i < this.state.geojson.length && this.state.bads[this.state.geojson[i].geo_id]) {
            let resultString = "Item " + i + ": " + "Skipping bad id " + this.state.geojson[i].geo_id + "\n";
            this.setState({
                results : this.state.results + resultString
            }, () => {
                this.geoUploadOne(importUrl,i+1);
            });
        }
        else if(i < this.state.geojson.length) {
            let resultString = "Item " + i + ": ";

            let uploadFile = new FormData();
            uploadFile.append("geo", JSON.stringify(this.state.geojson[i]));

            axios({ 
                method: 'POST',
                url: importUrl,
                headers: {
                    'Content-Type': "multipart/form-data"
                },
                data: uploadFile
            }).then(response => {
                let responseOK = response && response.status === 200;

                if(response.data) {
                    let responseArray = response.data;
                    responseArray.forEach(element => {
                        resultString += element + "\n";
                    });
                } else {
                    resultString += "No response data\n";
                    responseOK = false;
                }
                
                if (responseOK) {
                    return true;
                } else { 
                    return false;
                }
            }).catch(error => {
                if(error.response) {
                    if (error.response.status === 500) {
                        resultString += "\n::Internal server error.::";
                    } else if (error.response.status === 404) {
                        resultString += "\n::Not found.::";
                    } 
                } else {
                    resultString += "\n::Server may be down (no response), please try again later.::";
                }
                console.error('error message ', error);

                return false;
            }).finally(e => { // Run again with i + 1, update results text so user can see progress
                this.setState({
                    results : this.state.results.concat(resultString)
                });
                this.geoUploadOne(importUrl,i+1);
            });
        } else { // Finish
            this.setState({
                successLabel: 'Done',
                disabled: false,
                busy: false
            });
    
            document.body.style.cursor = 'default'; 
        }
    }

    checkFileAPI = () => {
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            reader = new FileReader();

            return true; 
        } else {
            alert('The File APIs are not fully supported by your browser. Fallback required.');
            
            return false;
        }
    }
    

    // We can figure out a list of good+bad geoid combos to give to the backend/db
    // TODO: For now, we're just using it here on demand
    dedupe = () => {
        let unduped = this.state.geojson;
        // let good_bad = [];
        let bad = {};
        let sortedData = unduped.sort((a, b) => a.name.localeCompare(b.name));

        console.log("Sorted by name", sortedData);

        for(let i = 0; i < sortedData.length - 1; i++) {
            if(sortedData[i].name === sortedData[i+1].name) {
                // console.log(i,sortedData[i].name);
                // console.log("Same size?",sortedData[i].feature.length === sortedData[i+1].feature.length);
                let j = i + 1;

                while(sortedData[j] 
                        && !bad[sortedData[i].geo_id] // Process unless the id at i is bad already
                        && sortedData[i].name == sortedData[j].name) 
                {
                    if(!bad[sortedData[j].geo_id]) { // Process unless id at j is bad already
                        let geometryA = JSON.stringify(JSON.parse(sortedData[i].feature).geometry);
                        let geometryB = JSON.stringify(JSON.parse(sortedData[j].feature).geometry);
                        let identicalIfZero = geometryA.localeCompare(geometryB);
    
                        // console.log("Same geometry?",identicalIfZero,i,j,sortedData[j].geo_id,sortedData[j].geo_id);
                        
                        if(identicalIfZero === 0) {
                            // good_bad.push({'good': sortedData[i].geo_id, 'bad': sortedData[j].geo_id});
                            bad[sortedData[j].geo_id] = sortedData[i].geo_id;
                        }
                    }

                    j = j + 1;
                }
            }
        }

        // could check logic here: a good id can replace multiple bad ids and show up multiple times, 
        // but a bad id should only show up once.
        // let sortedGoodBad = good_bad.sort((a, b) => a.bad - b.bad);

        this.setState({bads: bad}, () => {
            console.log("Deduplication results",this.state.bads);
        });


    }


    render() {

        if(!Globals.curatorOrHigher()) {
            return <div className="content">
                401 Unauthorized (not admin or try logging in again?)
            </div>;
        }

        const files = this.state.files.map(file => (
            <li key={file.name}>
              {file.name} - {file.size} bytes
            </li>
        ));

        return (
            <div className="form content">
                
                <div className="note">
                    Import New GeoJSON
                </div>
                
                <label className="networkErrorLabel">
                    {this.state.networkError}
                </label>

                <div className="import-meta">
                    
                    <div className="importFile">
                        <div>
                            <h2>Instructions:</h2>
                            <h3>Drop .geojson in box and click import if it looks valid.</h3>
                            <hr />
                        </div>

                        <Dropzone 
                            multiple={false} // TODO: If we want to support multiple geojson files, this should be true
                            onDrop={this.onDrop} 
                            onDragEnter={this.onDragEnter} 
                            onDragLeave={this.onDragLeave} >
                            {({getRootProps, getInputProps}) => (
                                <section>
                                    <div className={this.state.dragClass} {...getRootProps({id: 'dropzone'})}>
                                        <input {...getInputProps()} />
                                        <span className="drag-inner-text">
                                            Drag and drop ONE file here, or click this box to use file explorer
                                        </span>
                                    </div>
                                    <aside className="dropzone-aside">
                                        <h4>File list:</h4>
                                        <ul>{files}</ul>
                                        {/* <h4>Total size (rounded to MB):</h4>
                                        <ul>{Math.round(this.state.totalSize / 1024 / 1024)} MB</ul> */}
                                    </aside>
                                </section>
                            )}
                        </Dropzone>

                        
                        <button type="button" className="button" id="submitBulk" 
                                disabled={this.state.disabled} onClick={this.geoUpload}>
                            Import
                        </button>
                        <label className="errorLabel">{this.state.failLabel}</label>
                        
                        <div className="loader-holder">
                            <div className="lds-ellipsis" hidden={!this.state.busy}><div></div><div></div><div></div><div></div></div>
                        </div>

                        <h3 className="infoLabel green">
                            {"Import status: " + this.state.successLabel}
                        </h3>
                        
                        <label>
                            <b>Server response:</b>
                        </label>
                        <textarea onChange={this.onChangeDummy}
                            value={this.state.results}>
                        </textarea>

                    </div>
                </div>
                <hr />
            </div>
        );
    }

    componentDidMount() {
        this.checkFileAPI();
    }
}