import axios from 'axios';
import {actionOptions,
    agencyOptions,
    locations,
    stateOptions,
    finalTypeLabelsLower} from './options';
// const finalTypeLabels = ["Final",
//     "Second Final",
//     "Revised Final",
//     "Final Revised",
//     "Final Supplement",
//     "Final Supplemental",
//     "Second Final Supplemental",
//     "Third Final Supplemental"];
// const draftTypeLabels = ["Draft",
//     "Second Draft",
//     "Revised Draft",
//     "Draft Revised",
//     "Draft Supplement",
//     "Draft Supplemental",
//     "Second Draft Supplemental",
//     "Third Draft Supplemental"];

const Globals = {
    currentHost: new URL('https://bighorn.sbs.arizona.edu:8443/nepaBackend/'),

    listeners: {},

    registerListener(key, listenerFunction) {
        const entries = [];

        // assign even if not first time (prevents permanently disabling listeners if they unmount)
        this.listeners[key] = entries; 
        entries.push(listenerFunction);
    
    },
    
    emitEvent(key, eventObject) {
        const entries = this.listeners[key] || [];
        entries.forEach(listener => {
            listener(eventObject)
        });
    },

    /** Returns ?q= value, or '' if no value, or null if no ?q param at all */
    getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    },
    
    // Set up globals like axios default headers and base URL
    setUp() {
        if(window.location.hostname === 'localhost' || window.location.protocol  === "https:") {
            this.currentHost = new URL('https://bighorn.sbs.arizona.edu:8443/nepaBackend/');
        } else if(window.location.protocol  === "http:") {
            this.currentHost = new URL('http://localhost:8080/');
        }
        else {
            //defaulting to prod if not found,so prod can't break
            this.currentHost = new URL('https://bighorn.sbs.arizona.edu:8443/nepaBackend/');

        }
     this.currentHost = new URL('http://localhost:8080/');
     this.currentHost = new URL('https://bighorn.sbs.arizona.edu:8443/nepaBackend/');

        // else if(window.location.hostname) { 
        //     this.currentHost = new URL('https://' + window.location.hostname + ':8080/');
        // }
        
        axios.defaults.headers.common['Content-Type'] = 'application/json;charset=utf-8';
        axios.defaults.headers.common['X-Content-Type-Options'] = 'no-sniff';
        axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
                
        let token = localStorage.JWT;
        if(token){
            axios.defaults.headers.common['Authorization'] = token; // Change to defaults works everywhere
        } // No token is fine, they will just be redirected to login on app init
    },

    signIn() {
        let token = localStorage.JWT;
        if(token){
            axios.defaults.headers.common['Authorization'] = token;
        } 
    },
    

    signOut() {
        localStorage.clear();
        axios.defaults.headers.common['Authorization'] = null;
    },

    approverOrHigher() {
        return (localStorage.role && localStorage.role !== 'user')
    },
    curatorOrHigher() {
        return (localStorage.role && (localStorage.role === 'curator' || localStorage.role === 'admin'))
    },
    authorized() {
        return (localStorage.role && localStorage.role !== 'user');
    },

    isEmptyOrSpaces(str){
        return str === undefined || str === null || str.match(/^ *$/) !== null;
    },

    /** Return search options that are all default except use the incoming title.  Options based on what Spring DAL uses. */
    convertToSimpleSearch(searcherState){

        return {
            titleRaw: searcherState.titleRaw,
			startPublish: '',
			endPublish: '',
			startComment: '',
			endComment: '',
			state: [],
            agency: [],
            typeAll: true,
            typeFinal: false,
            typeDraft: false,
            typeOther: false,
			needsComments: false,
			needsDocument: false,
            limit: searcherState.limit,
            offset: searcherState.offset // definitely need to keep these
		};
    },

    // Date parsing with hyphens forces current timezone, whereas alternate separators like / result in using utc/gmt which means a correct year/month/date item
    // whereas hyphens cause you to potentially be off by an entire day
    // everything after the actual 10-character Date e.g. T07:00:00.000Z breaks everything and has to be stripped off
    getCorrectDate(sDate){
        let oddity = sDate.replace(/-/g,'/').substr(0, 10);
        return new Date(oddity);
    },
    
    formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
    
        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;
    
        return [year, month, day].join('-');
    },

    validPassword(pass) {
        let passwordPattern = /[ -~]/;
        return  ( pass && passwordPattern.test(pass) && pass.length >= 4 && pass.length <= 50 );
    },

    colors: ['#4572A7', '#AA4643', '#89A54E', '#80699B', '#3D96AE',
        '#DB843D', '#92A8CD', '#A47D7C', '#B5CA92', 
        "Red","Green","Blue","Yellow","Pink","Purple",
        "Orange","Cyan","Magenta","Teal","DarkGray",
        '#4572A7', '#AA4643', '#89A54E', '#80699B', '#3D96AE',
        '#DB843D', '#92A8CD', '#A47D7C', '#B5CA92', 
        "Red","Green","Blue","Yellow","Pink","Purple",
        "Orange","Cyan","Magenta","Teal","DarkGray",
        '#4572A7', '#AA4643', '#89A54E', '#80699B', '#3D96AE',
        '#DB843D', '#92A8CD', '#A47D7C', '#B5CA92', 
        "Red","Green","Blue","Yellow","Pink","Purple",
        "Orange","Cyan","Magenta","Teal","DarkGray",
        '#4572A7', '#AA4643', '#89A54E', '#80699B', '#3D96AE',
        '#DB843D', '#92A8CD', '#A47D7C', '#B5CA92', 
        "Red","Green","Blue","Yellow","Pink","Purple",
        "Orange","Cyan","Magenta","Teal","DarkGray",
        '#4572A7', '#AA4643', '#89A54E', '#80699B', '#3D96AE',
        '#DB843D', '#92A8CD', '#A47D7C', '#B5CA92', 
        "Red","Green","Blue","Yellow","Pink","Purple",
        "Orange","Cyan","Magenta","Teal","DarkGray"
    ],

    geoType: {
        STATE : 1,
        COUNTY: 2,
        OTHER : 9
    },

    getErrorMessage(error) {
        let message = "Sorry, the server encountered an unexpected error.";

        if(error && error.response && error.response.status){

            const _status = error.response.status;

            if(_status === 400) {
                message = "400 Bad request";
            }
            else if(_status === 401) {
                message = "401 Unauthorized";
            }
            else if(_status === 403) {
                message = "Please log in again (user session may have expired).";
            }
            else if(_status === 404) {
                message = "404 Not Found";
            }
            else if(_status === 408) {
                message = "408 Request Timed Out";
            }
        } else {
            message = "Server appears to be down right now, please try again later."
        }

        return message;
    },

    errorMessage: {
        default: "Server may be updating, please try again in a minute.",
        auth: "Please log in again (auth token expires every 10 days).",
    },

    // note on fixing delimiters for multiple values:
    // regex for fixing space-only delimited: find ([\s][A-Z]{2}) ([A-Z]{2}[\s]) replacing with ($1);($2) 
    // repeatedly until 0 occurrences replaced. 
    // then replace " - " with ";".
    // then we can standardize everything by turning ',' into ';' and turning ';[ ]*' into just ';' to remove every single useless space

    

    /** given a list of ;-delimited states in a string, return those delimited items which are NOT in this.locations.
    /* Presumably this list can then be used to bulk change unwanted items, or add wanted items to this.locations */
    locationTester: (states) => {
        let locationValues = this.locations.map(location => {
            return location.value;
        })
        let theSet = new Set();
        let garbage = new Set();

        states.forEach(state => {
            let innerStates = state.split(";");
            innerStates.forEach(innerState => {
                theSet.add(innerState);
            });
        }, () => {
            theSet.forEach(value => {
                if(!(value in locationValues)) {
                    garbage.add(value);
                }
            })
        });

        return garbage;
    },

    /** format incoming json data as tab-separated values to prep .tsv download, without double quotes.  
     * Undefined behavior if data has tabs in it already. */
    jsonToTSV: (data) => {
        const items = data;
        const header = Object.keys(items[0])
        const tsv = [
        header.join('\t'), // header row first
        ...items.map(row => header.map(fieldName => (row[fieldName])).join('\t'))
        ].join('\r\n')
        
        return tsv;
    },

    /** Returns incoming json data as comma-separated values to prep .csv download, with double quotes to help out
     * since strings may contain commas. May get confused if incoming data has double quotes and/or commas 
     * in bad places */
    jsonToCSV: (data) => {
        const items = data;
        const replacer = (key, value) => value === null ? '' : value // specify how you want to handle null values here
        const header = Object.keys(items[0])
        const csv = [
            header.join(','), // header row first
            // JSON.stringify results in 1. double quotes around all fields and 2. some weird unnecessary escaping
            // (this isn't inherently a problem, but easily confuses Excel)
            ...items.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
            // ...items.map(row => header.map(fieldName => (row[fieldName])).join('\t'))
        ].join('\r\n')
        
        return csv;
    },

    isFinalType: (type) => {
        let result = false;
        if(type && finalTypeLabelsLower.indexOf(type.toLowerCase()) >= 0) {
            result = true;
        }

        return result;
    },

    isDraftType: (type) => {
        let result = false;
        if(type && draftTypeLabelsLower.indexOf(type.toLowerCase()) >= 0) {
            result = true;
        }

        return result;
    },

    doFilter: (searcherState, searchResults, preFilterCount, legacyStyle) => {

        let filtered = {isFiltered: false, textToUse: "", filteredResults: []};
        
        let isFiltered = false;

        // Deep clone results
        let filteredResults = JSON.parse(JSON.stringify(searchResults));
        
        if(searcherState.agency && searcherState.agency.length > 0){
            isFiltered = true;
            filteredResults = filteredResults.filter(matchesArray("agency", searcherState.agency));
        }
        if(searcherState.cooperatingAgency && searcherState.cooperatingAgency.length > 0){
            isFiltered = true;
            if(legacyStyle) {
                filteredResults = filteredResults.filter(arrayMatchesArrayNotSpacedOld("cooperatingAgency", searcherState.cooperatingAgency));
            } else {
                filteredResults = filteredResults.filter(arrayMatchesArrayNotSpaced("cooperatingAgency", searcherState.cooperatingAgency));
            }
        }
        if(searcherState.state && searcherState.state.length > 0){
            isFiltered = true;
            filteredResults = filteredResults.filter(arrayMatchesArray("state", searcherState.state));
        }
        if(searcherState.county && searcherState.county.length > 0){
            isFiltered = true;
            filteredResults = filteredResults.filter(arrayMatchesArray("county", searcherState.county));
        }
        if(searcherState.decision && searcherState.decision.length > 0){
            isFiltered = true;
            filteredResults = filteredResults.filter(arrayMatchesArray("decision", searcherState.decision));
        }
        if(searcherState.action && searcherState.action.length > 0){
            isFiltered = true;
            filteredResults = filteredResults.filter(arrayMatchesArray("action", searcherState.action));
        }
        if(searcherState.startPublish){
            isFiltered = true;
            let formattedDate = Globals.formatDate(searcherState.startPublish);
            if(legacyStyle) {
                filteredResults = filteredResults.filter(matchesStartDateOld(formattedDate));
            } else {
                filteredResults = filteredResults.filter(matchesStartDate(formattedDate));
            }
        }
        if(searcherState.endPublish){
            isFiltered = true;
            let formattedDate = Globals.formatDate(searcherState.endPublish);
            if(legacyStyle) {
                filteredResults = filteredResults.filter(matchesEndDateOld(formattedDate));
            } else {
                filteredResults = filteredResults.filter(matchesEndDate(formattedDate));
            }
        }
        if(searcherState.typeFinal || searcherState.typeDraft || searcherState.typeEA 
            || searcherState.typeNOI || searcherState.typeROD || searcherState.typeScoping){
            isFiltered = true;
            if(legacyStyle) {
                filteredResults = filteredResults.filter(matchesTypeOld(
                    searcherState.typeFinal, 
                    searcherState.typeDraft,
                    searcherState.typeEA,
                    searcherState.typeNOI,
                    searcherState.typeROD,
                    searcherState.typeScoping));
            } else {
                filteredResults = filteredResults.filter(matchesType(
                    searcherState.typeFinal, 
                    searcherState.typeDraft,
                    searcherState.typeEA,
                    searcherState.typeNOI,
                    searcherState.typeROD,
                    searcherState.typeScoping));
            }
        }
        if(searcherState.needsDocument) {
            isFiltered = true;
            if(legacyStyle) {
                filteredResults = filteredResults.filter(hasDocumentOld)
            } else {
                filteredResults = filteredResults.filter(hasDocument)
            }
        }
        
        let textToUse = filteredResults.length + " Results"; // unfiltered: "Results"
        if(filteredResults.length === 1) {
            textToUse = filteredResults.length + " Result";
        }
        if(isFiltered) { // filtered: "Matches"
            textToUse = filteredResults.length + " Matches (narrowed down from " + preFilterCount + " Results)";
            if(filteredResults.length === 1) {
                textToUse = filteredResults.length + " Match (narrowed down from " + preFilterCount + " Results)";
                if(preFilterCount === 1) {
                    textToUse = filteredResults.length + " Match (narrowed down from " + preFilterCount + " Result)";
                }
            }
        }

        filtered.textToUse = textToUse;
        filtered.filteredResults = filteredResults;
        filtered.isFiltered = isFiltered;

        return filtered;
    },
    /** Settings for multiple admin tables */
    tabulatorOptions: { 
        selectable:true,                   // true===multiselect (1 for single select)
        layoutColumnsOnNewData:true,
        tooltips:true,
        // responsiveLayout:"collapse",    // specifying this at all enables responsive layout (deals with horizontal overflow)
        // responsiveLayoutCollapseUseFormatters:false,
        pagination:"local",
        paginationSize:10,
        paginationSizeSelector:[10, 25, 50, 100], 
        movableColumns:true,
        resizableRows:true,
        resizableColumns:true,
        layout:"fitColumns",
        invalidOptionWarnings:false,       // spams pointless warnings without this
        // http://tabulator.info/docs/4.9/callbacks#column 
        columnResized:function(col) {
            // col.updateDefinition({width:col._column.width}); // needed if widths not all explicitly defined
            col._column.table.redraw(); // important for dynamic columns, prevents vertical scrollbar
        },
        // columnVisibilityChanged:function(col,vis){
        //     col.updateDefinition({visible:vis}); // needed if widths not all explicitly defined
        // },
    },
    getKeys: (obj) => {
        let keysArr = [];
        for (var key in obj) {
          keysArr.push(key);
        }
        return keysArr;
    },
    
    /**
     * @param {Object} object
     * @param {string} key
     * @return {any} value
     */
    getParameterCaseInsensitive:(object, key) => {
        return object[Object.keys(object)
            .find(k => k.toLowerCase() === key.toLowerCase())
            ];
    },

    /** Don't know exact date of first EIS/EA, but NEPA was signed Jan 1 1970 */
    beginningYear: 1970,

    anEnum: Object.freeze({"test":1, "test2":2, "test3":3})

    
}

    /** Filters */




    // Process oriented version of the hasDocument filter.
    const hasDocument = (item) => {
        let hasDocument = false;
        item.records.some(function(el) {
            if(el.size && el.size > 200) {
                hasDocument = true;
                return true;
            }
            return false;
        })
        return hasDocument;
    }
    const hasDocumentOld = (item) => {
        return (item.size && item.size > 200);
    }

    const matchesArray = (field, val) => {
        return function (a) {
            let returnValue = false;
            val.forEach(item =>{
                if (a[field] === item) {
                    returnValue = true;
                }
            });
            return returnValue;
        };
    }

    /** Special logic for ;-delimited states from Buomsoo, Alex/Natasha/... */
    const arrayMatchesArray = (field, val) => {
        return function (a) {
            // console.log(a);
            let returnValue = false;
            val.forEach(item =>{
                if(a[field]){
                    let _vals = a[field].split(/[;,]+/); // e.g. AK;AL or AK,AL
                    for(let i = 0; i < _vals.length; i++) {
                        if (_vals[i].trim() === item.trim()) {
                            returnValue = true; // if we hit ANY of them, then true
                            i = _vals.length; // done
                        }
                    }
                }
            });
            return returnValue;
        };
    }
    /** Special logic for ;-delimited counties from Egoitz, ... */
    // const arrayMatchesArrayCounty = (field, val) => {
    //     return function (a) {
    //         let returnValue = false;
    //         val.forEach(item =>{
    //             if(a[field]){
    //                 const _stateCounty = item.split(':'); // 'AK: Anchorage' -> ['AK',' Anchorage']
    //                 if(_stateCounty.length > 1) {
    //                     let itemCounty = _stateCounty[1].trim(); // [' Anchorage'] -> 'Anchorage'
    //                     let _vals = a[field].split(/[;,]+/); // Split up record counties

    //                     // Right now we just need to know if the state makes sense.
    //                     // So if it's multi or any states match this county's state then we can proceed.
    //                     // This is because the counties are just strings in the database.
    //                     //
    //                     // TODO: In order to make the filter functionality truly accurate, the counties ALL need to be
    //                     // prepended with a state abbreviation in the database - this can be done programmatically
    //                     // by wiping counties clean and generating them based on the geojson data links.
    //                     // Then instead of checking state and then checking county names, we would only compare county names
    //                     // because the record's county names would include the state abbreviation already.
    //                     //
    //                     // This of course will not fix any data errors.
    //                     // For example Egoitz's data included a TX;LA record linked to Jefferson County. The algorithm
    //                     // has no idea whether it's Texas's or Louisiana's Jefferson County, or both. So polygons show up
    //                     // for both.

    //                     if(a['state']) {
    //                         let stateMatched = false;
    //                         const validStates = a['state'].split(/[;,]+/);
    //                         if(validStates.length > 0) {
    //                             if(validStates[0].trim() === 'Multi') {
    //                                 stateMatched = true;
    //                             } else {
    //                                 for(let i = 0; i < validStates.length; i++) { // Check item state against all record states
    //                                     if(validStates[i].trim() === _stateCounty[0].trim()) {
    //                                         stateMatched = true; // if we hit ANY of them, then true
    //                                         i = validStates.length;
    //                                     }
    //                                 }
    //                                 if(stateMatched) {
    //                                     for(let i = 0; i < _vals.length; i++) { // Check item against all record counties
    //                                         if (_vals[i].trim() === itemCounty) {
    //                                             returnValue = true; // if we hit ANY of them, then true
    //                                             i = _vals.length;
    //                                         }
    //                                     }
    //                                 }
    //                             }
    //                         }
    //                     }

    //                 }
    //             }
    //         });
    //         return returnValue;
    //     };
    // }


    /** Special logic for ; or , delimited cooperating agencies from Buomsoo */
    const arrayMatchesArrayNotSpaced = (field, val) => {
        return function (a) {
            // console.log(a);
            let returnValue = false;
            val.forEach(item =>{
                for(let i = 0; i < a.records.length; i++) {
                    if(a.records[i][field]){
                        let _vals = a.records[i][field].split(/[;,]+/); // AK;AL or AK, AL
                        for(let j = 0; j < _vals.length; j++) {
                            if (_vals[j].trim() === item.trim()) {
                                returnValue = true; // if we hit ANY of them, then true
                            }
                        }
                    }
                }
            });
            return returnValue;
        };
    }
    const arrayMatchesArrayNotSpacedOld = (field, val) => {
        return function (a) {
            let returnValue = false;
            val.forEach(item =>{
                if(a[field]){
                    let _vals = a[field].split(/[;,]+/); // AK;AL or AK, AL
                    for(let i = 0; i < _vals.length; i++) {
                        if (_vals[i].trim() === item.trim()) {
                            returnValue = true; // if we hit ANY of them, then true
                        }
                    }
                }
            });
            return returnValue;
        };
    }

    const matchesStartDate = (val) => {
        return function (a) {
            let returnValue = false;

            a.records.some(item => {
                // console.log(item.registerDate, val, item["registerDate"] >= val);
                if(item["registerDate"] >= val) {
                    returnValue = true;
                    return true;
                }
                return false;
            });
            
            return returnValue;
        };
    }
    const matchesEndDate = (val) => {
        return function (a) {
            let returnValue = false;

            a.records.some(item => {
                // console.log(item.registerDate, val, item["registerDate"] <= val);
                if(item["registerDate"] <= val) {
                    returnValue = true;
                    return true;
                }
                return false;
            });
            
            return returnValue;
        };
    }

    const matchesStartDateOld = (val) => {
        return function (a) {
            return (a["registerDate"] >= val);
        };
    }
    const matchesEndDateOld = (val) => {
        return function (a) {
            return (a["registerDate"] <= val); // should this be inclusive? <= or <
        };
    }
    /** Removes records that don't match */
    const matchesType = (matchFinal, matchDraft, matchEA, matchNOI, matchROD, matchScoping) => {
        return function (a) {
            // Keep list of indeces to splice afterward, to exclude them from filtered results.
            let recordsToSplice = [];
            let filterResult = false;
            for(let i = 0; i < a.records.length; i++) {
                let standingResult = false;
                const type = a.records[i].documentType.toLowerCase();
                if(matchFinal && Globals.isFinalType(type)) {
                    filterResult = true;
                    standingResult = true;
                }
                if(matchDraft && Globals.isDraftType(type)) {
                    filterResult = true;
                    standingResult = true;
                }
                if( ( (type === "ea") && matchEA ) || 
                    ( (type === "noi") && matchNOI ) || 
                    ( (type === "rod" || type === "final and rod") && matchROD ) || 
                    ( (type === "scoping report") && matchScoping ))
                {
                    filterResult = true;
                    standingResult = true;
                }

                // No match for records[i]; mark it for deletion after loop is done
                // (splicing now would rearrange the array and break this loop logic)
                if(!standingResult) {
                    recordsToSplice.push(i);
                }
            }

            // Remove marked records from filtered results
            for(let i = recordsToSplice.length - 1; i >= 0; i--) {
                if (recordsToSplice[i] > -1) {
                    a.records.splice(recordsToSplice[i], 1);
                }
            }

            return filterResult;
        };
    }
    const matchesTypeOld = (matchFinal, matchDraft, matchEA, matchNOI, matchROD, matchScoping) => {
        return function (a) {
            return (
                (Globals.isFinalType(a["documentType"]) && matchFinal) || 
                (Globals.isDraftType(a["documentType"]) && matchDraft) || 
                ((
                    (a["documentType"] === "EA") 
                ) && matchEA) || 
                ((
                    (a["documentType"] === "NOI") 
                ) && matchNOI) || 
                ((
                    (a["documentType"] === "ROD") 
                ) && matchROD) || 
                ((
                    (a["documentType"] === "Scoping Report") 
                ) && matchScoping)
            );
        };
    }

export default Globals;