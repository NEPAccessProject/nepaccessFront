import axios from 'axios';

// const finalTypeLabels = ["Final",
//     "Second Final",
//     "Revised Final",
//     "Final Revised",
//     "Final Supplement",
//     "Final Supplemental",
//     "Second Final Supplemental",
//     "Third Final Supplemental"];
const finalTypeLabelsLower = ["final",
    "final and rod",
    "second final",
    "revised final",
    "final revised",
    "final supplement",
    "final supplemental",
    "second final supplemental",
    "third final supplemental"];
// const draftTypeLabels = ["Draft",
//     "Second Draft",
//     "Revised Draft",
//     "Draft Revised",
//     "Draft Supplement",
//     "Draft Supplemental",
//     "Second Draft Supplemental",
//     "Third Draft Supplemental"];
const draftTypeLabelsLower = ["draft",
    "second draft",
    "revised draft",
    "draft revised",
    "draft supplement",
    "draft supplemental",
    "second draft supplemental",
    "third draft supplemental"];
const Globals = {
    currentHost: new URL('http://localhost:8080/'),
    mobileBreakPointWidth : 992,
    listeners: {},

    registerListener(key, listenerFunction) {
        const entries = [];

        // assign even if not first time (prevents permanently disabling listeners if they unmount)
        this.listeners[key] = entries;
        entries.push(listenerFunction);

    },

    emitEvent(key, eventObject) {
        const entries = this.listeners[key] || [];
        entries && entries.length && entries.forEach(listener => {
            if(listener){
              listener(eventObject)
            }
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
        if(window.location.hostname === 'localhost' || window.location.hostname === 'www.nepaccess.org') {
            this.currentHost = new URL(window.location.protocol + 'localhost:8080/');
        } else {
            this.currentHost = new URL(window.location.protocol + window.location.hostname + ':8080/nepaBackend/');
        }
        this.currentHost = 'https://bighorn.sbs.arizona.edu:8443/nepaBackend';
        // else if(window.location.hostname) {
        //     this.currentHost = new URL('https://' + window.location.hostname + ':8080/');
        // }

        axios.defaults.headers.common['Content-Type'] = 'application/json;charset=utf-8';
        axios.defaults.headers.common['X-Content-Type-Options'] = 'no-sniff';
        axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

        let token = localStorage.JWT;
        console.log(`file: globals.js:87 ~ setUp ~ token:`, token);
        if(token){
            axios.defaults.headers.common['Authorization'] = token; // Change to defaults works everywhere
        } // No token is fine, they will just be redirected to login on app init
    },

    signIn() {
        let token = localStorage.JWT;
        console.log(`file: globals.js:94 ~ signIn ~ token:`, token);
        if(token){
            axios.defaults.headers.common['Authorization'] = token;
        }
    },


    signOut() {
      console.log(`file: globals.js:103 ~ signOut ~ localStorage:`, localStorage);
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

    agencies: [	{ value: 'ACHP', label: 'Advisory Council on Historic Preservation (ACHP)' },{ value: 'USAID', label: 'Agency for International Development (USAID)' },{ value: 'ARS', label: 'Agriculture Research Service (ARS)' },{ value: 'APHIS', label: 'Animal and Plant Health Inspection Service (APHIS)' },{ value: 'AFRH', label: 'Armed Forces Retirement Home (AFRH)' },{ value: 'BPA', label: 'Bonneville Power Administration (BPA)' },{ value: 'BIA', label: 'Bureau of Indian Affairs (BIA)' },{ value: 'BLM', label: 'Bureau of Land Management (BLM)' },{ value: 'USBM', label: 'Bureau of Mines (USBM)' },{ value: 'BOEM', label: 'Bureau of Ocean Energy Management (BOEM)' },{ value: 'BOP', label: 'Bureau of Prisons (BOP)' },{ value: 'BR', label: 'Bureau of Reclamation (BR)' },{ value: 'Caltrans', label: 'California Department of Transportation (Caltrans)' },{ value: 'CHSRA', label: 'California High-Speed Rail Authority (CHSRA)' },{ value: 'CIA', label: 'Central Intelligence Agency (CIA)' },{ value: 'NYCOMB', label: 'City of New York, Office of Management and Budget (NYCOMB)' },{ value: 'CDBG', label: 'Community Development Block Grant (CDBG)' },{ value: 'CTDOH', label: 'Connecticut Department of Housing (CTDOH)' },{ value: 'BRAC', label: 'Defense Base Closure and Realignment Commission (BRAC)' },{ value: 'DLA', label: 'Defense Logistics Agency (DLA)' },{ value: 'DNA', label: 'Defense Nuclear Agency (DNA)' },{ value: 'DNFSB', label: 'Defense Nuclear Fac. Safety Board (DNFSB)' },{ value: 'DSA', label: 'Defense Supply Agency (DSA)' },{ value: 'DRB', label: 'Delaware River Basin Commission (DRB)' },{ value: 'DC', label: 'Denali Commission (DC)' },{ value: 'USDA', label: 'Department of Agriculture (USDA)' },{ value: 'DOC', label: 'Department of Commerce (DOC)' },{ value: 'DOD', label: 'Department of Defense (DOD)' },{ value: 'DOE', label: 'Department of Energy (DOE)' },{ value: 'HHS', label: 'Department of Health and Human Services (HHS)' },{ value: 'DHS', label: 'Department of Homeland Security (DHS)' },{ value: 'HUD', label: 'Department of Housing and Urban Development (HUD)' },{ value: 'DOJ', label: 'Department of Justice (DOJ)' },{ value: 'DOL', label: 'Department of Labor (DOL)' },{ value: 'DOS', label: 'Department of State (DOS)' },{ value: 'DOT', label: 'Department of Transportation (DOT)' },{ value: 'TREAS', label: 'Department of Treasury (TREAS)' },{ value: 'VA', label: 'Department of Veteran Affairs (VA)' },{ value: 'DOI', label: 'Department of the Interior (DOI)' },{ value: 'DEA', label: 'Drug Enforcement Administration (DEA)' },{ value: 'EDA', label: 'Economic Development Administration (EDA)' },{ value: 'ERA', label: 'Energy Regulatory Administration (ERA)' },{ value: 'ERDA', label: 'Energy Research and Development Administration (ERDA)' },{ value: 'EPA', label: 'Environmental Protection Agency (EPA)' },{ value: 'FSA', label: 'Farm Service Agency (FSA)' },{ value: 'FHA', label: 'Farmers Home Administration (FHA)' },{ value: 'FAA', label: 'Federal Aviation Administration (FAA)' },{ value: 'FCC', label: 'Federal Communications Commission (FCC)' },{ value: 'FEMA', label: 'Federal Emergency Management Agency (FEMA)' },{ value: 'FEA', label: 'Federal Energy Administration (FEA)' },{ value: 'FERC', label: 'Federal Energy Regulatory Commission (FERC)' },{ value: 'FHWA', label: 'Federal Highway Administration (FHWA)' },{ value: 'FMC', label: 'Federal Maritime Commission (FMC)' },{ value: 'FMSHRC', label: 'Federal Mine Safety and Health Review Commission (FMSHRC)' },{ value: 'FMCSA', label: 'Federal Motor Carrier Safety Administration (FMCSA)' },{ value: 'FPC', label: 'Federal Power Commission (FPC)' },{ value: 'FRA', label: 'Federal Railroad Administration (FRA)' },{ value: 'FRBSF', label: 'Federal Reserve Bank of San Francisco (FRBSF)' },{ value: 'FTA', label: 'Federal Transit Administration (FTA)' },{ value: 'USFWS', label: 'Fish and Wildlife Service (USFWS)' },{ value: 'FDOT', label: 'Florida Department of Transportation (FDOT)' },{ value: 'FDA', label: 'Food and Drug Administration (FDA)' },{ value: 'USFS', label: 'Forest Service (USFS)' },{ value: 'GSA', label: 'General Services Administration (GSA)' },{ value: 'USGS', label: 'Geological Survey (USGS)' },{ value: 'GLB', label: 'Great Lakes Basin Commission (GLB)' },{ value: 'IHS', label: 'Indian Health Service (IHS)' },{ value: 'IRS', label: 'Internal Revenue Service (IRS)' },{ value: 'IBWC', label: 'International Boundary and Water Commission (IBWC)' },{ value: 'ICC', label: 'Interstate Commerce Commission (ICC)' },{ value: 'JCS', label: 'Joint Chiefs of Staff (JCS)' },{ value: 'MARAD', label: 'Maritime Administration (MARAD)' },{ value: 'MTB', label: 'Materials Transportation Bureau (MTB)' },{ value: 'MSHA', label: 'Mine Safety and Health Administration (MSHA)' },{ value: 'MMS', label: 'Minerals Management Service (MMS)' },{ value: 'MESA', label: 'Mining Enforcement and Safety (MESA)' },{ value: 'MRB', label: 'Missouri River Basin Commission (MRB)' },{ value: 'NASA', label: 'National Aeronautics and Space Administration (NASA)' },{ value: 'NCPC', label: 'National Capital Planning Commission (NCPC)' },{ value: 'NGA', label: 'National Geospatial-Intelligence Agency (NGA)' },{ value: 'NHTSA', label: 'National Highway Traffic Safety Administration (NHTSA)' },{ value: 'NIGC', label: 'National Indian Gaming Commission (NIGC)' },{ value: 'NIH', label: 'National Institute of Health (NIH)' },{ value: 'NMFS', label: 'National Marine Fisheries Service (NMFS)' },{ value: 'NNSA', label: 'National Nuclear Security Administration (NNSA)' },{ value: 'NOAA', label: 'National Oceanic and Atmospheric Administration (NOAA)' },{ value: 'NPS', label: 'National Park Service (NPS)' },{ value: 'NSF', label: 'National Science Foundation (NSF)' },{ value: 'NSA', label: 'National Security Agency (NSA)' },{ value: 'NTSB', label: 'National Transportation Safety Board (NTSB)' },{ value: 'NRCS', label: 'Natural Resource Conservation Service (NRCS)' },{ value: 'NER', label: 'New England River Basin Commission (NER)' },{ value: 'NJDEP', label: 'New Jersey Department of Environmental Protection (NJDEP)' },{ value: 'NRC', label: 'Nuclear Regulatory Commission (NRC)' },{ value: 'OCR', label: 'Office of Coal Research (OCR)' },{ value: 'OSM', label: 'Office of Surface Mining (OSM)' },{ value: 'OBR', label: 'Ohio River Basin Commission (OBR)' },{ value: 'RSPA', label: 'Research and Special Programs (RSPA)' },{ value: 'REA', label: 'Rural Electrification Administration (REA)' },{ value: 'RUS', label: 'Rural Utilities Service (RUS)' },{ value: 'SEC', label: 'Security and Exchange Commission (SEC)' },{ value: 'SBA', label: 'Small Business Administration (SBA)' },{ value: 'SCS', label: 'Soil Conservation Service (SCS)' },{ value: 'SRB', label: 'Souris-Red-Rainy River Basin Commission (SRB)' },{ value: 'STB', label: 'Surface Transportation Board (STB)' },{ value: 'SRC', label: 'Susquehanna River Basin Commission (SRC)' },{ value: 'TVA', label: 'Tennessee Valley Authority (TVA)' },{ value: 'TxDOT', label: 'Texas Department of Transportation (TxDOT)' },{ value: 'TPT', label: 'The Presidio Trust (TPT)' },{ value: 'TDA', label: 'Trade and Development Agency (TDA)' },{ value: 'USACE', label: 'U.S. Army Corps of Engineers (USACE)' },{ value: 'USCG', label: 'U.S. Coast Guard (USCG)' },{ value: 'CBP', label: 'U.S. Customs and Border Protection (CBP)' },{ value: 'RRB', label: 'U.S. Railroad Retirement Board (RRB)' },{ value: 'USAF', label: 'United States Air Force (USAF)' },{ value: 'USA', label: 'United States Army (USA)' },{ value: 'USMC', label: 'United States Marine Corps (USMC)' },{ value: 'USN', label: 'United States Navy (USN)' },{ value: 'USPS', label: 'United States Postal Service (USPS)' },{ value: 'USTR', label: 'United States Trade Representative (USTR)' },{ value: 'UMR', label: 'Upper Mississippi Basin Commission (UMR)' },{ value: 'UMTA', label: 'Urban Mass Transportation Administration (UMTA)' },{ value: 'UDOT', label: 'Utah Department of Transportation (UDOT)' },{ value: 'WAPA', label: 'Western Area Power Administration (WAPA)' }
    ],

    /** New water bodies:
        // Great Lakes
        // Gulf of Mexico
        // Caribbean Sea
        // Pacific Ocean
        // Atlantic Ocean
        // Indian Ocean
        // Mediterranean Sea
        // Philippine Sea


        // New land bodies:
        // Commonwealth of the Northern Mariana Islands (CNMI)
        // U.S. Pacific Remote Island Areas (PRIA)
        // Canada
        // Mexico
        // Caribbean States */
    locations: [ { value: 'AK', label: 'Alaska' },{ value: 'AL', label: 'Alabama' },{ value: 'AQ', label: 'Antarctica' },{ value: 'AR', label: 'Arkansas' },{ value: 'AS', label: 'American Samoa' },{ value: 'AZ', label: 'Arizona' },{ value: 'CA', label: 'California' },{ value: 'CO', label: 'Colorado' },{ value: 'CT', label: 'Connecticut' },{ value: 'DC', label: 'District of Columbia' },{ value: 'DE', label: 'Delaware' },{ value: 'FL', label: 'Florida' },{ value: 'GA', label: 'Georgia' },{ value: 'GU', label: 'Guam' },{ value: 'HI', label: 'Hawaii' },{ value: 'IA', label: 'Iowa' },{ value: 'ID', label: 'Idaho' },{ value: 'IL', label: 'Illinois' },{ value: 'IN', label: 'Indiana' },{ value: 'KS', label: 'Kansas' },{ value: 'KY', label: 'Kentucky' },{ value: 'LA', label: 'Louisiana' },{ value: 'MA', label: 'Massachusetts' },{ value: 'MD', label: 'Maryland' },{ value: 'ME', label: 'Maine' },{ value: 'MI', label: 'Michigan' },{ value: 'MN', label: 'Minnesota' },{ value: 'MO', label: 'Missouri' },{ value: 'MS', label: 'Mississippi' },{ value: 'MT', label: 'Montana' },{ value: 'Multi', label: 'Multiple' },{ value: 'National', label: 'National' },{ value: 'NC', label: 'North Carolina' },{ value: 'ND', label: 'North Dakota' },{ value: 'NE', label: 'Nebraska' },{ value: 'NH', label: 'New Hampshire' },{ value: 'NJ', label: 'New Jersey' },{ value: 'NM', label: 'New Mexico' },{ value: 'NV', label: 'Nevada' },{ value: 'NY', label: 'New York' },{ value: 'OH', label: 'Ohio' },{ value: 'OK', label: 'Oklahoma' },{ value: 'OR', label: 'Oregon' },{ value: 'PA', label: 'Pennsylvania' },{ value: 'PRO', label: 'Programmatic' },{ value: 'PR', label: 'Puerto Rico' },{ value: 'RI', label: 'Rhode Island' },{ value: 'SC', label: 'South Carolina' },{ value: 'SD', label: 'South Dakota' },{ value: 'TN', label: 'Tennessee' },{ value: 'TT', label: 'Trust Territory of the Pacific Islands' },{ value: 'TX', label: 'Texas' },{ value: 'UT', label: 'Utah' },{ value: 'VA', label: 'Virginia' },{ value: 'VI', label: 'Virgin Islands' },{ value: 'VT', label: 'Vermont' },{ value: 'WA', label: 'Washington' },{ value: 'WI', label: 'Wisconsin' },{ value: 'WV', label: 'West Virginia' },
        { value: 'WY', label: 'Wyoming' }
        ,{ value: 'Great Lakes', label: 'Great Lakes' }
        ,{ value: 'Gulf of Mexico', label: 'Gulf of Mexico' }
        ,{ value: 'Caribbean Sea', label: 'Caribbean Sea' }
        ,{ value: 'Pacific Ocean', label: 'Pacific Ocean' }
        ,{ value: 'Atlantic Ocean', label: 'Atlantic Ocean' }
        ,{ value: 'Indian Ocean', label: 'Indian Ocean' }
        ,{ value: 'Mediterranean Sea', label: 'Mediterranean Sea' }
        ,{ value: 'Philippine Sea', label: 'Philippine Sea' }
        ,{ value: 'Commonwealth of the Northern Mariana Islands', label: 'Commonwealth of the Northern Mariana Islands' }
        ,{ value: 'U.S. Pacific Remote Island Areas', label: 'U.S. Pacific Remote Island Areas' }
        ,{ value: 'Canada', label: 'Canada' }
        ,{ value: 'Mexico', label: 'Mexico' }
        ,{ value: 'Caribbean States', label: 'Caribbean States' }
    ],

    /** array of 3220 distinct counties where value is string= [county name]
     * and label is string= [state abbreviation]: [county name] */
    counties: [
        {
            "value": "AK: Aleutians East",
            "label": "AK: Aleutians East"
        },
        {
            "value": "AK: Aleutians West",
            "label": "AK: Aleutians West"
        },
        {
            "value": "AK: Anchorage",
            "label": "AK: Anchorage"
        },
        {
            "value": "AK: Bethel",
            "label": "AK: Bethel"
        },
        {
            "value": "AK: Bristol Bay",
            "label": "AK: Bristol Bay"
        },
        {
            "value": "AK: Denali",
            "label": "AK: Denali"
        },
        {
            "value": "AK: Dillingham",
            "label": "AK: Dillingham"
        },
        {
            "value": "AK: Fairbanks North Star",
            "label": "AK: Fairbanks North Star"
        },
        {
            "value": "AK: Haines",
            "label": "AK: Haines"
        },
        {
            "value": "AK: Hoonah-Angoon",
            "label": "AK: Hoonah-Angoon"
        },
        {
            "value": "AK: Juneau",
            "label": "AK: Juneau"
        },
        {
            "value": "AK: Kenai Peninsula",
            "label": "AK: Kenai Peninsula"
        },
        {
            "value": "AK: Ketchikan Gateway",
            "label": "AK: Ketchikan Gateway"
        },
        {
            "value": "AK: Kodiak Island",
            "label": "AK: Kodiak Island"
        },
        {
            "value": "AK: Kusilvak",
            "label": "AK: Kusilvak"
        },
        {
            "value": "AK: Lake and Peninsula",
            "label": "AK: Lake and Peninsula"
        },
        {
            "value": "AK: Matanuska-Susitna",
            "label": "AK: Matanuska-Susitna"
        },
        {
            "value": "AK: Nome",
            "label": "AK: Nome"
        },
        {
            "value": "AK: North Slope",
            "label": "AK: North Slope"
        },
        {
            "value": "AK: Northwest Arctic",
            "label": "AK: Northwest Arctic"
        },
        {
            "value": "AK: Petersburg",
            "label": "AK: Petersburg"
        },
        {
            "value": "AK: Prince of Wales-Hyder",
            "label": "AK: Prince of Wales-Hyder"
        },
        {
            "value": "AK: Sitka",
            "label": "AK: Sitka"
        },
        {
            "value": "AK: Skagway",
            "label": "AK: Skagway"
        },
        {
            "value": "AK: Southeast Fairbanks",
            "label": "AK: Southeast Fairbanks"
        },
        {
            "value": "AK: Valdez-Cordova",
            "label": "AK: Valdez-Cordova"
        },
        {
            "value": "AK: Wrangell",
            "label": "AK: Wrangell"
        },
        {
            "value": "AK: Yakutat",
            "label": "AK: Yakutat"
        },
        {
            "value": "AK: Yukon-Koyukuk",
            "label": "AK: Yukon-Koyukuk"
        },
        {
            "value": "AL: Autauga",
            "label": "AL: Autauga"
        },
        {
            "value": "AL: Baldwin",
            "label": "AL: Baldwin"
        },
        {
            "value": "AL: Barbour",
            "label": "AL: Barbour"
        },
        {
            "value": "AL: Bibb",
            "label": "AL: Bibb"
        },
        {
            "value": "AL: Blount",
            "label": "AL: Blount"
        },
        {
            "value": "AL: Bullock",
            "label": "AL: Bullock"
        },
        {
            "value": "AL: Butler",
            "label": "AL: Butler"
        },
        {
            "value": "AL: Calhoun",
            "label": "AL: Calhoun"
        },
        {
            "value": "AL: Chambers",
            "label": "AL: Chambers"
        },
        {
            "value": "AL: Cherokee",
            "label": "AL: Cherokee"
        },
        {
            "value": "AL: Chilton",
            "label": "AL: Chilton"
        },
        {
            "value": "AL: Choctaw",
            "label": "AL: Choctaw"
        },
        {
            "value": "AL: Clarke",
            "label": "AL: Clarke"
        },
        {
            "value": "AL: Clay",
            "label": "AL: Clay"
        },
        {
            "value": "AL: Cleburne",
            "label": "AL: Cleburne"
        },
        {
            "value": "AL: Coffee",
            "label": "AL: Coffee"
        },
        {
            "value": "AL: Colbert",
            "label": "AL: Colbert"
        },
        {
            "value": "AL: Conecuh",
            "label": "AL: Conecuh"
        },
        {
            "value": "AL: Coosa",
            "label": "AL: Coosa"
        },
        {
            "value": "AL: Covington",
            "label": "AL: Covington"
        },
        {
            "value": "AL: Crenshaw",
            "label": "AL: Crenshaw"
        },
        {
            "value": "AL: Cullman",
            "label": "AL: Cullman"
        },
        {
            "value": "AL: Dale",
            "label": "AL: Dale"
        },
        {
            "value": "AL: Dallas",
            "label": "AL: Dallas"
        },
        {
            "value": "AL: DeKalb",
            "label": "AL: DeKalb"
        },
        {
            "value": "AL: Elmore",
            "label": "AL: Elmore"
        },
        {
            "value": "AL: Escambia",
            "label": "AL: Escambia"
        },
        {
            "value": "AL: Etowah",
            "label": "AL: Etowah"
        },
        {
            "value": "AL: Fayette",
            "label": "AL: Fayette"
        },
        {
            "value": "AL: Franklin",
            "label": "AL: Franklin"
        },
        {
            "value": "AL: Geneva",
            "label": "AL: Geneva"
        },
        {
            "value": "AL: Greene",
            "label": "AL: Greene"
        },
        {
            "value": "AL: Hale",
            "label": "AL: Hale"
        },
        {
            "value": "AL: Henry",
            "label": "AL: Henry"
        },
        {
            "value": "AL: Houston",
            "label": "AL: Houston"
        },
        {
            "value": "AL: Jackson",
            "label": "AL: Jackson"
        },
        {
            "value": "AL: Jefferson",
            "label": "AL: Jefferson"
        },
        {
            "value": "AL: Lamar",
            "label": "AL: Lamar"
        },
        {
            "value": "AL: Lauderdale",
            "label": "AL: Lauderdale"
        },
        {
            "value": "AL: Lawrence",
            "label": "AL: Lawrence"
        },
        {
            "value": "AL: Lee",
            "label": "AL: Lee"
        },
        {
            "value": "AL: Limestone",
            "label": "AL: Limestone"
        },
        {
            "value": "AL: Lowndes",
            "label": "AL: Lowndes"
        },
        {
            "value": "AL: Macon",
            "label": "AL: Macon"
        },
        {
            "value": "AL: Madison",
            "label": "AL: Madison"
        },
        {
            "value": "AL: Marengo",
            "label": "AL: Marengo"
        },
        {
            "value": "AL: Marion",
            "label": "AL: Marion"
        },
        {
            "value": "AL: Marshall",
            "label": "AL: Marshall"
        },
        {
            "value": "AL: Mobile",
            "label": "AL: Mobile"
        },
        {
            "value": "AL: Monroe",
            "label": "AL: Monroe"
        },
        {
            "value": "AL: Montgomery",
            "label": "AL: Montgomery"
        },
        {
            "value": "AL: Morgan",
            "label": "AL: Morgan"
        },
        {
            "value": "AL: Perry",
            "label": "AL: Perry"
        },
        {
            "value": "AL: Pickens",
            "label": "AL: Pickens"
        },
        {
            "value": "AL: Pike",
            "label": "AL: Pike"
        },
        {
            "value": "AL: Randolph",
            "label": "AL: Randolph"
        },
        {
            "value": "AL: Russell",
            "label": "AL: Russell"
        },
        {
            "value": "AL: Shelby",
            "label": "AL: Shelby"
        },
        {
            "value": "AL: St. Clair",
            "label": "AL: St. Clair"
        },
        {
            "value": "AL: Sumter",
            "label": "AL: Sumter"
        },
        {
            "value": "AL: Talladega",
            "label": "AL: Talladega"
        },
        {
            "value": "AL: Tallapoosa",
            "label": "AL: Tallapoosa"
        },
        {
            "value": "AL: Tuscaloosa",
            "label": "AL: Tuscaloosa"
        },
        {
            "value": "AL: Walker",
            "label": "AL: Walker"
        },
        {
            "value": "AL: Washington",
            "label": "AL: Washington"
        },
        {
            "value": "AL: Wilcox",
            "label": "AL: Wilcox"
        },
        {
            "value": "AL: Winston",
            "label": "AL: Winston"
        },
        {
            "value": "AR: Arkansas",
            "label": "AR: Arkansas"
        },
        {
            "value": "AR: Ashley",
            "label": "AR: Ashley"
        },
        {
            "value": "AR: Baxter",
            "label": "AR: Baxter"
        },
        {
            "value": "AR: Benton",
            "label": "AR: Benton"
        },
        {
            "value": "AR: Boone",
            "label": "AR: Boone"
        },
        {
            "value": "AR: Bradley",
            "label": "AR: Bradley"
        },
        {
            "value": "AR: Calhoun",
            "label": "AR: Calhoun"
        },
        {
            "value": "AR: Carroll",
            "label": "AR: Carroll"
        },
        {
            "value": "AR: Chicot",
            "label": "AR: Chicot"
        },
        {
            "value": "AR: Clark",
            "label": "AR: Clark"
        },
        {
            "value": "AR: Clay",
            "label": "AR: Clay"
        },
        {
            "value": "AR: Cleburne",
            "label": "AR: Cleburne"
        },
        {
            "value": "AR: Cleveland",
            "label": "AR: Cleveland"
        },
        {
            "value": "AR: Columbia",
            "label": "AR: Columbia"
        },
        {
            "value": "AR: Conway",
            "label": "AR: Conway"
        },
        {
            "value": "AR: Craighead",
            "label": "AR: Craighead"
        },
        {
            "value": "AR: Crawford",
            "label": "AR: Crawford"
        },
        {
            "value": "AR: Crittenden",
            "label": "AR: Crittenden"
        },
        {
            "value": "AR: Cross",
            "label": "AR: Cross"
        },
        {
            "value": "AR: Dallas",
            "label": "AR: Dallas"
        },
        {
            "value": "AR: Desha",
            "label": "AR: Desha"
        },
        {
            "value": "AR: Drew",
            "label": "AR: Drew"
        },
        {
            "value": "AR: Faulkner",
            "label": "AR: Faulkner"
        },
        {
            "value": "AR: Franklin",
            "label": "AR: Franklin"
        },
        {
            "value": "AR: Fulton",
            "label": "AR: Fulton"
        },
        {
            "value": "AR: Garland",
            "label": "AR: Garland"
        },
        {
            "value": "AR: Grant",
            "label": "AR: Grant"
        },
        {
            "value": "AR: Greene",
            "label": "AR: Greene"
        },
        {
            "value": "AR: Hempstead",
            "label": "AR: Hempstead"
        },
        {
            "value": "AR: Hot Spring",
            "label": "AR: Hot Spring"
        },
        {
            "value": "AR: Howard",
            "label": "AR: Howard"
        },
        {
            "value": "AR: Independence",
            "label": "AR: Independence"
        },
        {
            "value": "AR: Izard",
            "label": "AR: Izard"
        },
        {
            "value": "AR: Jackson",
            "label": "AR: Jackson"
        },
        {
            "value": "AR: Jefferson",
            "label": "AR: Jefferson"
        },
        {
            "value": "AR: Johnson",
            "label": "AR: Johnson"
        },
        {
            "value": "AR: Lafayette",
            "label": "AR: Lafayette"
        },
        {
            "value": "AR: Lawrence",
            "label": "AR: Lawrence"
        },
        {
            "value": "AR: Lee",
            "label": "AR: Lee"
        },
        {
            "value": "AR: Lincoln",
            "label": "AR: Lincoln"
        },
        {
            "value": "AR: Little River",
            "label": "AR: Little River"
        },
        {
            "value": "AR: Logan",
            "label": "AR: Logan"
        },
        {
            "value": "AR: Lonoke",
            "label": "AR: Lonoke"
        },
        {
            "value": "AR: Madison",
            "label": "AR: Madison"
        },
        {
            "value": "AR: Marion",
            "label": "AR: Marion"
        },
        {
            "value": "AR: Miller",
            "label": "AR: Miller"
        },
        {
            "value": "AR: Mississippi",
            "label": "AR: Mississippi"
        },
        {
            "value": "AR: Monroe",
            "label": "AR: Monroe"
        },
        {
            "value": "AR: Montgomery",
            "label": "AR: Montgomery"
        },
        {
            "value": "AR: Nevada",
            "label": "AR: Nevada"
        },
        {
            "value": "AR: Newton",
            "label": "AR: Newton"
        },
        {
            "value": "AR: Ouachita",
            "label": "AR: Ouachita"
        },
        {
            "value": "AR: Perry",
            "label": "AR: Perry"
        },
        {
            "value": "AR: Phillips",
            "label": "AR: Phillips"
        },
        {
            "value": "AR: Pike",
            "label": "AR: Pike"
        },
        {
            "value": "AR: Poinsett",
            "label": "AR: Poinsett"
        },
        {
            "value": "AR: Polk",
            "label": "AR: Polk"
        },
        {
            "value": "AR: Pope",
            "label": "AR: Pope"
        },
        {
            "value": "AR: Prairie",
            "label": "AR: Prairie"
        },
        {
            "value": "AR: Pulaski",
            "label": "AR: Pulaski"
        },
        {
            "value": "AR: Randolph",
            "label": "AR: Randolph"
        },
        {
            "value": "AR: Saline",
            "label": "AR: Saline"
        },
        {
            "value": "AR: Scott",
            "label": "AR: Scott"
        },
        {
            "value": "AR: Searcy",
            "label": "AR: Searcy"
        },
        {
            "value": "AR: Sebastian",
            "label": "AR: Sebastian"
        },
        {
            "value": "AR: Sevier",
            "label": "AR: Sevier"
        },
        {
            "value": "AR: Sharp",
            "label": "AR: Sharp"
        },
        {
            "value": "AR: St. Francis",
            "label": "AR: St. Francis"
        },
        {
            "value": "AR: Stone",
            "label": "AR: Stone"
        },
        {
            "value": "AR: Union",
            "label": "AR: Union"
        },
        {
            "value": "AR: Van Buren",
            "label": "AR: Van Buren"
        },
        {
            "value": "AR: Washington",
            "label": "AR: Washington"
        },
        {
            "value": "AR: White",
            "label": "AR: White"
        },
        {
            "value": "AR: Woodruff",
            "label": "AR: Woodruff"
        },
        {
            "value": "AR: Yell",
            "label": "AR: Yell"
        },
        {
            "value": "AZ: Apache",
            "label": "AZ: Apache"
        },
        {
            "value": "AZ: Cochise",
            "label": "AZ: Cochise"
        },
        {
            "value": "AZ: Coconino",
            "label": "AZ: Coconino"
        },
        {
            "value": "AZ: Gila",
            "label": "AZ: Gila"
        },
        {
            "value": "AZ: Graham",
            "label": "AZ: Graham"
        },
        {
            "value": "AZ: Greenlee",
            "label": "AZ: Greenlee"
        },
        {
            "value": "AZ: La Paz",
            "label": "AZ: La Paz"
        },
        {
            "value": "AZ: Maricopa",
            "label": "AZ: Maricopa"
        },
        {
            "value": "AZ: Mohave",
            "label": "AZ: Mohave"
        },
        {
            "value": "AZ: Navajo",
            "label": "AZ: Navajo"
        },
        {
            "value": "AZ: Pima",
            "label": "AZ: Pima"
        },
        {
            "value": "AZ: Pinal",
            "label": "AZ: Pinal"
        },
        {
            "value": "AZ: Santa Cruz",
            "label": "AZ: Santa Cruz"
        },
        {
            "value": "AZ: Yavapai",
            "label": "AZ: Yavapai"
        },
        {
            "value": "AZ: Yuma",
            "label": "AZ: Yuma"
        },
        {
            "value": "CA: Alameda",
            "label": "CA: Alameda"
        },
        {
            "value": "CA: Alpine",
            "label": "CA: Alpine"
        },
        {
            "value": "CA: Amador",
            "label": "CA: Amador"
        },
        {
            "value": "CA: Butte",
            "label": "CA: Butte"
        },
        {
            "value": "CA: Calaveras",
            "label": "CA: Calaveras"
        },
        {
            "value": "CA: Colusa",
            "label": "CA: Colusa"
        },
        {
            "value": "CA: Contra Costa",
            "label": "CA: Contra Costa"
        },
        {
            "value": "CA: Del Norte",
            "label": "CA: Del Norte"
        },
        {
            "value": "CA: El Dorado",
            "label": "CA: El Dorado"
        },
        {
            "value": "CA: Fresno",
            "label": "CA: Fresno"
        },
        {
            "value": "CA: Glenn",
            "label": "CA: Glenn"
        },
        {
            "value": "CA: Humboldt",
            "label": "CA: Humboldt"
        },
        {
            "value": "CA: Imperial",
            "label": "CA: Imperial"
        },
        {
            "value": "CA: Inyo",
            "label": "CA: Inyo"
        },
        {
            "value": "CA: Kern",
            "label": "CA: Kern"
        },
        {
            "value": "CA: Kings",
            "label": "CA: Kings"
        },
        {
            "value": "CA: Lake",
            "label": "CA: Lake"
        },
        {
            "value": "CA: Lassen",
            "label": "CA: Lassen"
        },
        {
            "value": "CA: Los Angeles",
            "label": "CA: Los Angeles"
        },
        {
            "value": "CA: Madera",
            "label": "CA: Madera"
        },
        {
            "value": "CA: Marin",
            "label": "CA: Marin"
        },
        {
            "value": "CA: Mariposa",
            "label": "CA: Mariposa"
        },
        {
            "value": "CA: Mendocino",
            "label": "CA: Mendocino"
        },
        {
            "value": "CA: Merced",
            "label": "CA: Merced"
        },
        {
            "value": "CA: Modoc",
            "label": "CA: Modoc"
        },
        {
            "value": "CA: Mono",
            "label": "CA: Mono"
        },
        {
            "value": "CA: Monterey",
            "label": "CA: Monterey"
        },
        {
            "value": "CA: Napa",
            "label": "CA: Napa"
        },
        {
            "value": "CA: Nevada",
            "label": "CA: Nevada"
        },
        {
            "value": "CA: Orange",
            "label": "CA: Orange"
        },
        {
            "value": "CA: Placer",
            "label": "CA: Placer"
        },
        {
            "value": "CA: Plumas",
            "label": "CA: Plumas"
        },
        {
            "value": "CA: Riverside",
            "label": "CA: Riverside"
        },
        {
            "value": "CA: Sacramento",
            "label": "CA: Sacramento"
        },
        {
            "value": "CA: San Benito",
            "label": "CA: San Benito"
        },
        {
            "value": "CA: San Bernardino",
            "label": "CA: San Bernardino"
        },
        {
            "value": "CA: San Diego",
            "label": "CA: San Diego"
        },
        {
            "value": "CA: San Francisco",
            "label": "CA: San Francisco"
        },
        {
            "value": "CA: San Joaquin",
            "label": "CA: San Joaquin"
        },
        {
            "value": "CA: San Luis Obispo",
            "label": "CA: San Luis Obispo"
        },
        {
            "value": "CA: San Mateo",
            "label": "CA: San Mateo"
        },
        {
            "value": "CA: Santa Barbara",
            "label": "CA: Santa Barbara"
        },
        {
            "value": "CA: Santa Clara",
            "label": "CA: Santa Clara"
        },
        {
            "value": "CA: Santa Cruz",
            "label": "CA: Santa Cruz"
        },
        {
            "value": "CA: Shasta",
            "label": "CA: Shasta"
        },
        {
            "value": "CA: Sierra",
            "label": "CA: Sierra"
        },
        {
            "value": "CA: Siskiyou",
            "label": "CA: Siskiyou"
        },
        {
            "value": "CA: Solano",
            "label": "CA: Solano"
        },
        {
            "value": "CA: Sonoma",
            "label": "CA: Sonoma"
        },
        {
            "value": "CA: Stanislaus",
            "label": "CA: Stanislaus"
        },
        {
            "value": "CA: Sutter",
            "label": "CA: Sutter"
        },
        {
            "value": "CA: Tehama",
            "label": "CA: Tehama"
        },
        {
            "value": "CA: Trinity",
            "label": "CA: Trinity"
        },
        {
            "value": "CA: Tulare",
            "label": "CA: Tulare"
        },
        {
            "value": "CA: Tuolumne",
            "label": "CA: Tuolumne"
        },
        {
            "value": "CA: Ventura",
            "label": "CA: Ventura"
        },
        {
            "value": "CA: Yolo",
            "label": "CA: Yolo"
        },
        {
            "value": "CA: Yuba",
            "label": "CA: Yuba"
        },
        {
            "value": "CO: Adams",
            "label": "CO: Adams"
        },
        {
            "value": "CO: Alamosa",
            "label": "CO: Alamosa"
        },
        {
            "value": "CO: Arapahoe",
            "label": "CO: Arapahoe"
        },
        {
            "value": "CO: Archuleta",
            "label": "CO: Archuleta"
        },
        {
            "value": "CO: Baca",
            "label": "CO: Baca"
        },
        {
            "value": "CO: Bent",
            "label": "CO: Bent"
        },
        {
            "value": "CO: Boulder",
            "label": "CO: Boulder"
        },
        {
            "value": "CO: Broomfield",
            "label": "CO: Broomfield"
        },
        {
            "value": "CO: Chaffee",
            "label": "CO: Chaffee"
        },
        {
            "value": "CO: Cheyenne",
            "label": "CO: Cheyenne"
        },
        {
            "value": "CO: Clear Creek",
            "label": "CO: Clear Creek"
        },
        {
            "value": "CO: Conejos",
            "label": "CO: Conejos"
        },
        {
            "value": "CO: Costilla",
            "label": "CO: Costilla"
        },
        {
            "value": "CO: Crowley",
            "label": "CO: Crowley"
        },
        {
            "value": "CO: Custer",
            "label": "CO: Custer"
        },
        {
            "value": "CO: Delta",
            "label": "CO: Delta"
        },
        {
            "value": "CO: Denver",
            "label": "CO: Denver"
        },
        {
            "value": "CO: Dolores",
            "label": "CO: Dolores"
        },
        {
            "value": "CO: Douglas",
            "label": "CO: Douglas"
        },
        {
            "value": "CO: Eagle",
            "label": "CO: Eagle"
        },
        {
            "value": "CO: El Paso",
            "label": "CO: El Paso"
        },
        {
            "value": "CO: Elbert",
            "label": "CO: Elbert"
        },
        {
            "value": "CO: Fremont",
            "label": "CO: Fremont"
        },
        {
            "value": "CO: Garfield",
            "label": "CO: Garfield"
        },
        {
            "value": "CO: Gilpin",
            "label": "CO: Gilpin"
        },
        {
            "value": "CO: Grand",
            "label": "CO: Grand"
        },
        {
            "value": "CO: Gunnison",
            "label": "CO: Gunnison"
        },
        {
            "value": "CO: Hinsdale",
            "label": "CO: Hinsdale"
        },
        {
            "value": "CO: Huerfano",
            "label": "CO: Huerfano"
        },
        {
            "value": "CO: Jackson",
            "label": "CO: Jackson"
        },
        {
            "value": "CO: Jefferson",
            "label": "CO: Jefferson"
        },
        {
            "value": "CO: Kiowa",
            "label": "CO: Kiowa"
        },
        {
            "value": "CO: Kit Carson",
            "label": "CO: Kit Carson"
        },
        {
            "value": "CO: La Plata",
            "label": "CO: La Plata"
        },
        {
            "value": "CO: Lake",
            "label": "CO: Lake"
        },
        {
            "value": "CO: Larimer",
            "label": "CO: Larimer"
        },
        {
            "value": "CO: Las Animas",
            "label": "CO: Las Animas"
        },
        {
            "value": "CO: Lincoln",
            "label": "CO: Lincoln"
        },
        {
            "value": "CO: Logan",
            "label": "CO: Logan"
        },
        {
            "value": "CO: Mesa",
            "label": "CO: Mesa"
        },
        {
            "value": "CO: Mineral",
            "label": "CO: Mineral"
        },
        {
            "value": "CO: Moffat",
            "label": "CO: Moffat"
        },
        {
            "value": "CO: Montezuma",
            "label": "CO: Montezuma"
        },
        {
            "value": "CO: Montrose",
            "label": "CO: Montrose"
        },
        {
            "value": "CO: Morgan",
            "label": "CO: Morgan"
        },
        {
            "value": "CO: Otero",
            "label": "CO: Otero"
        },
        {
            "value": "CO: Ouray",
            "label": "CO: Ouray"
        },
        {
            "value": "CO: Park",
            "label": "CO: Park"
        },
        {
            "value": "CO: Phillips",
            "label": "CO: Phillips"
        },
        {
            "value": "CO: Pitkin",
            "label": "CO: Pitkin"
        },
        {
            "value": "CO: Prowers",
            "label": "CO: Prowers"
        },
        {
            "value": "CO: Pueblo",
            "label": "CO: Pueblo"
        },
        {
            "value": "CO: Rio Blanco",
            "label": "CO: Rio Blanco"
        },
        {
            "value": "CO: Rio Grande",
            "label": "CO: Rio Grande"
        },
        {
            "value": "CO: Routt",
            "label": "CO: Routt"
        },
        {
            "value": "CO: Saguache",
            "label": "CO: Saguache"
        },
        {
            "value": "CO: San Juan",
            "label": "CO: San Juan"
        },
        {
            "value": "CO: San Miguel",
            "label": "CO: San Miguel"
        },
        {
            "value": "CO: Sedgwick",
            "label": "CO: Sedgwick"
        },
        {
            "value": "CO: Summit",
            "label": "CO: Summit"
        },
        {
            "value": "CO: Teller",
            "label": "CO: Teller"
        },
        {
            "value": "CO: Washington",
            "label": "CO: Washington"
        },
        {
            "value": "CO: Weld",
            "label": "CO: Weld"
        },
        {
            "value": "CO: Yuma",
            "label": "CO: Yuma"
        },
        {
            "value": "CT: Fairfield",
            "label": "CT: Fairfield"
        },
        {
            "value": "CT: Hartford",
            "label": "CT: Hartford"
        },
        {
            "value": "CT: Litchfield",
            "label": "CT: Litchfield"
        },
        {
            "value": "CT: Middlesex",
            "label": "CT: Middlesex"
        },
        {
            "value": "CT: New Haven",
            "label": "CT: New Haven"
        },
        {
            "value": "CT: New London",
            "label": "CT: New London"
        },
        {
            "value": "CT: Tolland",
            "label": "CT: Tolland"
        },
        {
            "value": "CT: Windham",
            "label": "CT: Windham"
        },
        {
            "value": "DC: District of Columbia",
            "label": "DC: District of Columbia"
        },
        {
            "value": "DE: Kent",
            "label": "DE: Kent"
        },
        {
            "value": "DE: New Castle",
            "label": "DE: New Castle"
        },
        {
            "value": "DE: Sussex",
            "label": "DE: Sussex"
        },
        {
            "value": "FL: Alachua",
            "label": "FL: Alachua"
        },
        {
            "value": "FL: Baker",
            "label": "FL: Baker"
        },
        {
            "value": "FL: Bay",
            "label": "FL: Bay"
        },
        {
            "value": "FL: Bradford",
            "label": "FL: Bradford"
        },
        {
            "value": "FL: Brevard",
            "label": "FL: Brevard"
        },
        {
            "value": "FL: Broward",
            "label": "FL: Broward"
        },
        {
            "value": "FL: Calhoun",
            "label": "FL: Calhoun"
        },
        {
            "value": "FL: Charlotte",
            "label": "FL: Charlotte"
        },
        {
            "value": "FL: Citrus",
            "label": "FL: Citrus"
        },
        {
            "value": "FL: Clay",
            "label": "FL: Clay"
        },
        {
            "value": "FL: Collier",
            "label": "FL: Collier"
        },
        {
            "value": "FL: Columbia",
            "label": "FL: Columbia"
        },
        {
            "value": "FL: DeSoto",
            "label": "FL: DeSoto"
        },
        {
            "value": "FL: Dixie",
            "label": "FL: Dixie"
        },
        {
            "value": "FL: Duval",
            "label": "FL: Duval"
        },
        {
            "value": "FL: Escambia",
            "label": "FL: Escambia"
        },
        {
            "value": "FL: Flagler",
            "label": "FL: Flagler"
        },
        {
            "value": "FL: Franklin",
            "label": "FL: Franklin"
        },
        {
            "value": "FL: Gadsden",
            "label": "FL: Gadsden"
        },
        {
            "value": "FL: Gilchrist",
            "label": "FL: Gilchrist"
        },
        {
            "value": "FL: Glades",
            "label": "FL: Glades"
        },
        {
            "value": "FL: Gulf",
            "label": "FL: Gulf"
        },
        {
            "value": "FL: Hamilton",
            "label": "FL: Hamilton"
        },
        {
            "value": "FL: Hardee",
            "label": "FL: Hardee"
        },
        {
            "value": "FL: Hendry",
            "label": "FL: Hendry"
        },
        {
            "value": "FL: Hernando",
            "label": "FL: Hernando"
        },
        {
            "value": "FL: Highlands",
            "label": "FL: Highlands"
        },
        {
            "value": "FL: Hillsborough",
            "label": "FL: Hillsborough"
        },
        {
            "value": "FL: Holmes",
            "label": "FL: Holmes"
        },
        {
            "value": "FL: Indian River",
            "label": "FL: Indian River"
        },
        {
            "value": "FL: Jackson",
            "label": "FL: Jackson"
        },
        {
            "value": "FL: Jefferson",
            "label": "FL: Jefferson"
        },
        {
            "value": "FL: Lafayette",
            "label": "FL: Lafayette"
        },
        {
            "value": "FL: Lake",
            "label": "FL: Lake"
        },
        {
            "value": "FL: Lee",
            "label": "FL: Lee"
        },
        {
            "value": "FL: Leon",
            "label": "FL: Leon"
        },
        {
            "value": "FL: Levy",
            "label": "FL: Levy"
        },
        {
            "value": "FL: Liberty",
            "label": "FL: Liberty"
        },
        {
            "value": "FL: Madison",
            "label": "FL: Madison"
        },
        {
            "value": "FL: Manatee",
            "label": "FL: Manatee"
        },
        {
            "value": "FL: Marion",
            "label": "FL: Marion"
        },
        {
            "value": "FL: Martin",
            "label": "FL: Martin"
        },
        {
            "value": "FL: Miami-Dade",
            "label": "FL: Miami-Dade"
        },
        {
            "value": "FL: Monroe",
            "label": "FL: Monroe"
        },
        {
            "value": "FL: Nassau",
            "label": "FL: Nassau"
        },
        {
            "value": "FL: Okaloosa",
            "label": "FL: Okaloosa"
        },
        {
            "value": "FL: Okeechobee",
            "label": "FL: Okeechobee"
        },
        {
            "value": "FL: Orange",
            "label": "FL: Orange"
        },
        {
            "value": "FL: Osceola",
            "label": "FL: Osceola"
        },
        {
            "value": "FL: Palm Beach",
            "label": "FL: Palm Beach"
        },
        {
            "value": "FL: Pasco",
            "label": "FL: Pasco"
        },
        {
            "value": "FL: Pinellas",
            "label": "FL: Pinellas"
        },
        {
            "value": "FL: Polk",
            "label": "FL: Polk"
        },
        {
            "value": "FL: Putnam",
            "label": "FL: Putnam"
        },
        {
            "value": "FL: Santa Rosa",
            "label": "FL: Santa Rosa"
        },
        {
            "value": "FL: Sarasota",
            "label": "FL: Sarasota"
        },
        {
            "value": "FL: Seminole",
            "label": "FL: Seminole"
        },
        {
            "value": "FL: St. Johns",
            "label": "FL: St. Johns"
        },
        {
            "value": "FL: St. Lucie",
            "label": "FL: St. Lucie"
        },
        {
            "value": "FL: Sumter",
            "label": "FL: Sumter"
        },
        {
            "value": "FL: Suwannee",
            "label": "FL: Suwannee"
        },
        {
            "value": "FL: Taylor",
            "label": "FL: Taylor"
        },
        {
            "value": "FL: Union",
            "label": "FL: Union"
        },
        {
            "value": "FL: Volusia",
            "label": "FL: Volusia"
        },
        {
            "value": "FL: Wakulla",
            "label": "FL: Wakulla"
        },
        {
            "value": "FL: Walton",
            "label": "FL: Walton"
        },
        {
            "value": "FL: Washington",
            "label": "FL: Washington"
        },
        {
            "value": "GA: Appling",
            "label": "GA: Appling"
        },
        {
            "value": "GA: Atkinson",
            "label": "GA: Atkinson"
        },
        {
            "value": "GA: Bacon",
            "label": "GA: Bacon"
        },
        {
            "value": "GA: Baker",
            "label": "GA: Baker"
        },
        {
            "value": "GA: Baldwin",
            "label": "GA: Baldwin"
        },
        {
            "value": "GA: Banks",
            "label": "GA: Banks"
        },
        {
            "value": "GA: Barrow",
            "label": "GA: Barrow"
        },
        {
            "value": "GA: Bartow",
            "label": "GA: Bartow"
        },
        {
            "value": "GA: Ben Hill",
            "label": "GA: Ben Hill"
        },
        {
            "value": "GA: Berrien",
            "label": "GA: Berrien"
        },
        {
            "value": "GA: Bibb",
            "label": "GA: Bibb"
        },
        {
            "value": "GA: Bleckley",
            "label": "GA: Bleckley"
        },
        {
            "value": "GA: Brantley",
            "label": "GA: Brantley"
        },
        {
            "value": "GA: Brooks",
            "label": "GA: Brooks"
        },
        {
            "value": "GA: Bryan",
            "label": "GA: Bryan"
        },
        {
            "value": "GA: Bulloch",
            "label": "GA: Bulloch"
        },
        {
            "value": "GA: Burke",
            "label": "GA: Burke"
        },
        {
            "value": "GA: Butts",
            "label": "GA: Butts"
        },
        {
            "value": "GA: Calhoun",
            "label": "GA: Calhoun"
        },
        {
            "value": "GA: Camden",
            "label": "GA: Camden"
        },
        {
            "value": "GA: Candler",
            "label": "GA: Candler"
        },
        {
            "value": "GA: Carroll",
            "label": "GA: Carroll"
        },
        {
            "value": "GA: Catoosa",
            "label": "GA: Catoosa"
        },
        {
            "value": "GA: Charlton",
            "label": "GA: Charlton"
        },
        {
            "value": "GA: Chatham",
            "label": "GA: Chatham"
        },
        {
            "value": "GA: Chattahoochee",
            "label": "GA: Chattahoochee"
        },
        {
            "value": "GA: Chattooga",
            "label": "GA: Chattooga"
        },
        {
            "value": "GA: Cherokee",
            "label": "GA: Cherokee"
        },
        {
            "value": "GA: Clarke",
            "label": "GA: Clarke"
        },
        {
            "value": "GA: Clay",
            "label": "GA: Clay"
        },
        {
            "value": "GA: Clayton",
            "label": "GA: Clayton"
        },
        {
            "value": "GA: Clinch",
            "label": "GA: Clinch"
        },
        {
            "value": "GA: Cobb",
            "label": "GA: Cobb"
        },
        {
            "value": "GA: Coffee",
            "label": "GA: Coffee"
        },
        {
            "value": "GA: Colquitt",
            "label": "GA: Colquitt"
        },
        {
            "value": "GA: Columbia",
            "label": "GA: Columbia"
        },
        {
            "value": "GA: Cook",
            "label": "GA: Cook"
        },
        {
            "value": "GA: Coweta",
            "label": "GA: Coweta"
        },
        {
            "value": "GA: Crawford",
            "label": "GA: Crawford"
        },
        {
            "value": "GA: Crisp",
            "label": "GA: Crisp"
        },
        {
            "value": "GA: Dade",
            "label": "GA: Dade"
        },
        {
            "value": "GA: Dawson",
            "label": "GA: Dawson"
        },
        {
            "value": "GA: Decatur",
            "label": "GA: Decatur"
        },
        {
            "value": "GA: DeKalb",
            "label": "GA: DeKalb"
        },
        {
            "value": "GA: Dodge",
            "label": "GA: Dodge"
        },
        {
            "value": "GA: Dooly",
            "label": "GA: Dooly"
        },
        {
            "value": "GA: Dougherty",
            "label": "GA: Dougherty"
        },
        {
            "value": "GA: Douglas",
            "label": "GA: Douglas"
        },
        {
            "value": "GA: Early",
            "label": "GA: Early"
        },
        {
            "value": "GA: Echols",
            "label": "GA: Echols"
        },
        {
            "value": "GA: Effingham",
            "label": "GA: Effingham"
        },
        {
            "value": "GA: Elbert",
            "label": "GA: Elbert"
        },
        {
            "value": "GA: Emanuel",
            "label": "GA: Emanuel"
        },
        {
            "value": "GA: Evans",
            "label": "GA: Evans"
        },
        {
            "value": "GA: Fannin",
            "label": "GA: Fannin"
        },
        {
            "value": "GA: Fayette",
            "label": "GA: Fayette"
        },
        {
            "value": "GA: Floyd",
            "label": "GA: Floyd"
        },
        {
            "value": "GA: Forsyth",
            "label": "GA: Forsyth"
        },
        {
            "value": "GA: Franklin",
            "label": "GA: Franklin"
        },
        {
            "value": "GA: Fulton",
            "label": "GA: Fulton"
        },
        {
            "value": "GA: Gilmer",
            "label": "GA: Gilmer"
        },
        {
            "value": "GA: Glascock",
            "label": "GA: Glascock"
        },
        {
            "value": "GA: Glynn",
            "label": "GA: Glynn"
        },
        {
            "value": "GA: Gordon",
            "label": "GA: Gordon"
        },
        {
            "value": "GA: Grady",
            "label": "GA: Grady"
        },
        {
            "value": "GA: Greene",
            "label": "GA: Greene"
        },
        {
            "value": "GA: Gwinnett",
            "label": "GA: Gwinnett"
        },
        {
            "value": "GA: Habersham",
            "label": "GA: Habersham"
        },
        {
            "value": "GA: Hall",
            "label": "GA: Hall"
        },
        {
            "value": "GA: Hancock",
            "label": "GA: Hancock"
        },
        {
            "value": "GA: Haralson",
            "label": "GA: Haralson"
        },
        {
            "value": "GA: Harris",
            "label": "GA: Harris"
        },
        {
            "value": "GA: Hart",
            "label": "GA: Hart"
        },
        {
            "value": "GA: Heard",
            "label": "GA: Heard"
        },
        {
            "value": "GA: Henry",
            "label": "GA: Henry"
        },
        {
            "value": "GA: Houston",
            "label": "GA: Houston"
        },
        {
            "value": "GA: Irwin",
            "label": "GA: Irwin"
        },
        {
            "value": "GA: Jackson",
            "label": "GA: Jackson"
        },
        {
            "value": "GA: Jasper",
            "label": "GA: Jasper"
        },
        {
            "value": "GA: Jeff Davis",
            "label": "GA: Jeff Davis"
        },
        {
            "value": "GA: Jefferson",
            "label": "GA: Jefferson"
        },
        {
            "value": "GA: Jenkins",
            "label": "GA: Jenkins"
        },
        {
            "value": "GA: Johnson",
            "label": "GA: Johnson"
        },
        {
            "value": "GA: Jones",
            "label": "GA: Jones"
        },
        {
            "value": "GA: Lamar",
            "label": "GA: Lamar"
        },
        {
            "value": "GA: Lanier",
            "label": "GA: Lanier"
        },
        {
            "value": "GA: Laurens",
            "label": "GA: Laurens"
        },
        {
            "value": "GA: Lee",
            "label": "GA: Lee"
        },
        {
            "value": "GA: Liberty",
            "label": "GA: Liberty"
        },
        {
            "value": "GA: Lincoln",
            "label": "GA: Lincoln"
        },
        {
            "value": "GA: Long",
            "label": "GA: Long"
        },
        {
            "value": "GA: Lowndes",
            "label": "GA: Lowndes"
        },
        {
            "value": "GA: Lumpkin",
            "label": "GA: Lumpkin"
        },
        {
            "value": "GA: Macon",
            "label": "GA: Macon"
        },
        {
            "value": "GA: Madison",
            "label": "GA: Madison"
        },
        {
            "value": "GA: Marion",
            "label": "GA: Marion"
        },
        {
            "value": "GA: McDuffie",
            "label": "GA: McDuffie"
        },
        {
            "value": "GA: McIntosh",
            "label": "GA: McIntosh"
        },
        {
            "value": "GA: Meriwether",
            "label": "GA: Meriwether"
        },
        {
            "value": "GA: Miller",
            "label": "GA: Miller"
        },
        {
            "value": "GA: Mitchell",
            "label": "GA: Mitchell"
        },
        {
            "value": "GA: Monroe",
            "label": "GA: Monroe"
        },
        {
            "value": "GA: Montgomery",
            "label": "GA: Montgomery"
        },
        {
            "value": "GA: Morgan",
            "label": "GA: Morgan"
        },
        {
            "value": "GA: Murray",
            "label": "GA: Murray"
        },
        {
            "value": "GA: Muscogee",
            "label": "GA: Muscogee"
        },
        {
            "value": "GA: Newton",
            "label": "GA: Newton"
        },
        {
            "value": "GA: Oconee",
            "label": "GA: Oconee"
        },
        {
            "value": "GA: Oglethorpe",
            "label": "GA: Oglethorpe"
        },
        {
            "value": "GA: Paulding",
            "label": "GA: Paulding"
        },
        {
            "value": "GA: Peach",
            "label": "GA: Peach"
        },
        {
            "value": "GA: Pickens",
            "label": "GA: Pickens"
        },
        {
            "value": "GA: Pierce",
            "label": "GA: Pierce"
        },
        {
            "value": "GA: Pike",
            "label": "GA: Pike"
        },
        {
            "value": "GA: Polk",
            "label": "GA: Polk"
        },
        {
            "value": "GA: Pulaski",
            "label": "GA: Pulaski"
        },
        {
            "value": "GA: Putnam",
            "label": "GA: Putnam"
        },
        {
            "value": "GA: Quitman",
            "label": "GA: Quitman"
        },
        {
            "value": "GA: Rabun",
            "label": "GA: Rabun"
        },
        {
            "value": "GA: Randolph",
            "label": "GA: Randolph"
        },
        {
            "value": "GA: Richmond",
            "label": "GA: Richmond"
        },
        {
            "value": "GA: Rockdale",
            "label": "GA: Rockdale"
        },
        {
            "value": "GA: Schley",
            "label": "GA: Schley"
        },
        {
            "value": "GA: Screven",
            "label": "GA: Screven"
        },
        {
            "value": "GA: Seminole",
            "label": "GA: Seminole"
        },
        {
            "value": "GA: Spalding",
            "label": "GA: Spalding"
        },
        {
            "value": "GA: Stephens",
            "label": "GA: Stephens"
        },
        {
            "value": "GA: Stewart",
            "label": "GA: Stewart"
        },
        {
            "value": "GA: Sumter",
            "label": "GA: Sumter"
        },
        {
            "value": "GA: Talbot",
            "label": "GA: Talbot"
        },
        {
            "value": "GA: Taliaferro",
            "label": "GA: Taliaferro"
        },
        {
            "value": "GA: Tattnall",
            "label": "GA: Tattnall"
        },
        {
            "value": "GA: Taylor",
            "label": "GA: Taylor"
        },
        {
            "value": "GA: Telfair",
            "label": "GA: Telfair"
        },
        {
            "value": "GA: Terrell",
            "label": "GA: Terrell"
        },
        {
            "value": "GA: Thomas",
            "label": "GA: Thomas"
        },
        {
            "value": "GA: Tift",
            "label": "GA: Tift"
        },
        {
            "value": "GA: Toombs",
            "label": "GA: Toombs"
        },
        {
            "value": "GA: Towns",
            "label": "GA: Towns"
        },
        {
            "value": "GA: Treutlen",
            "label": "GA: Treutlen"
        },
        {
            "value": "GA: Troup",
            "label": "GA: Troup"
        },
        {
            "value": "GA: Turner",
            "label": "GA: Turner"
        },
        {
            "value": "GA: Twiggs",
            "label": "GA: Twiggs"
        },
        {
            "value": "GA: Union",
            "label": "GA: Union"
        },
        {
            "value": "GA: Upson",
            "label": "GA: Upson"
        },
        {
            "value": "GA: Walker",
            "label": "GA: Walker"
        },
        {
            "value": "GA: Walton",
            "label": "GA: Walton"
        },
        {
            "value": "GA: Ware",
            "label": "GA: Ware"
        },
        {
            "value": "GA: Warren",
            "label": "GA: Warren"
        },
        {
            "value": "GA: Washington",
            "label": "GA: Washington"
        },
        {
            "value": "GA: Wayne",
            "label": "GA: Wayne"
        },
        {
            "value": "GA: Webster",
            "label": "GA: Webster"
        },
        {
            "value": "GA: Wheeler",
            "label": "GA: Wheeler"
        },
        {
            "value": "GA: White",
            "label": "GA: White"
        },
        {
            "value": "GA: Whitfield",
            "label": "GA: Whitfield"
        },
        {
            "value": "GA: Wilcox",
            "label": "GA: Wilcox"
        },
        {
            "value": "GA: Wilkes",
            "label": "GA: Wilkes"
        },
        {
            "value": "GA: Wilkinson",
            "label": "GA: Wilkinson"
        },
        {
            "value": "GA: Worth",
            "label": "GA: Worth"
        },
        {
            "value": "HI: Hawaii",
            "label": "HI: Hawaii"
        },
        {
            "value": "HI: Honolulu",
            "label": "HI: Honolulu"
        },
        {
            "value": "HI: Kalawao",
            "label": "HI: Kalawao"
        },
        {
            "value": "HI: Kauai",
            "label": "HI: Kauai"
        },
        {
            "value": "HI: Maui",
            "label": "HI: Maui"
        },
        {
            "value": "IA: Adair",
            "label": "IA: Adair"
        },
        {
            "value": "IA: Adams",
            "label": "IA: Adams"
        },
        {
            "value": "IA: Allamakee",
            "label": "IA: Allamakee"
        },
        {
            "value": "IA: Appanoose",
            "label": "IA: Appanoose"
        },
        {
            "value": "IA: Audubon",
            "label": "IA: Audubon"
        },
        {
            "value": "IA: Benton",
            "label": "IA: Benton"
        },
        {
            "value": "IA: Black Hawk",
            "label": "IA: Black Hawk"
        },
        {
            "value": "IA: Boone",
            "label": "IA: Boone"
        },
        {
            "value": "IA: Bremer",
            "label": "IA: Bremer"
        },
        {
            "value": "IA: Buchanan",
            "label": "IA: Buchanan"
        },
        {
            "value": "IA: Buena Vista",
            "label": "IA: Buena Vista"
        },
        {
            "value": "IA: Butler",
            "label": "IA: Butler"
        },
        {
            "value": "IA: Calhoun",
            "label": "IA: Calhoun"
        },
        {
            "value": "IA: Carroll",
            "label": "IA: Carroll"
        },
        {
            "value": "IA: Cass",
            "label": "IA: Cass"
        },
        {
            "value": "IA: Cedar",
            "label": "IA: Cedar"
        },
        {
            "value": "IA: Cerro Gordo",
            "label": "IA: Cerro Gordo"
        },
        {
            "value": "IA: Cherokee",
            "label": "IA: Cherokee"
        },
        {
            "value": "IA: Chickasaw",
            "label": "IA: Chickasaw"
        },
        {
            "value": "IA: Clarke",
            "label": "IA: Clarke"
        },
        {
            "value": "IA: Clay",
            "label": "IA: Clay"
        },
        {
            "value": "IA: Clayton",
            "label": "IA: Clayton"
        },
        {
            "value": "IA: Clinton",
            "label": "IA: Clinton"
        },
        {
            "value": "IA: Crawford",
            "label": "IA: Crawford"
        },
        {
            "value": "IA: Dallas",
            "label": "IA: Dallas"
        },
        {
            "value": "IA: Davis",
            "label": "IA: Davis"
        },
        {
            "value": "IA: Decatur",
            "label": "IA: Decatur"
        },
        {
            "value": "IA: Delaware",
            "label": "IA: Delaware"
        },
        {
            "value": "IA: Des Moines",
            "label": "IA: Des Moines"
        },
        {
            "value": "IA: Dickinson",
            "label": "IA: Dickinson"
        },
        {
            "value": "IA: Dubuque",
            "label": "IA: Dubuque"
        },
        {
            "value": "IA: Emmet",
            "label": "IA: Emmet"
        },
        {
            "value": "IA: Fayette",
            "label": "IA: Fayette"
        },
        {
            "value": "IA: Floyd",
            "label": "IA: Floyd"
        },
        {
            "value": "IA: Franklin",
            "label": "IA: Franklin"
        },
        {
            "value": "IA: Fremont",
            "label": "IA: Fremont"
        },
        {
            "value": "IA: Greene",
            "label": "IA: Greene"
        },
        {
            "value": "IA: Grundy",
            "label": "IA: Grundy"
        },
        {
            "value": "IA: Guthrie",
            "label": "IA: Guthrie"
        },
        {
            "value": "IA: Hamilton",
            "label": "IA: Hamilton"
        },
        {
            "value": "IA: Hancock",
            "label": "IA: Hancock"
        },
        {
            "value": "IA: Hardin",
            "label": "IA: Hardin"
        },
        {
            "value": "IA: Harrison",
            "label": "IA: Harrison"
        },
        {
            "value": "IA: Henry",
            "label": "IA: Henry"
        },
        {
            "value": "IA: Howard",
            "label": "IA: Howard"
        },
        {
            "value": "IA: Humboldt",
            "label": "IA: Humboldt"
        },
        {
            "value": "IA: Ida",
            "label": "IA: Ida"
        },
        {
            "value": "IA: Iowa",
            "label": "IA: Iowa"
        },
        {
            "value": "IA: Jackson",
            "label": "IA: Jackson"
        },
        {
            "value": "IA: Jasper",
            "label": "IA: Jasper"
        },
        {
            "value": "IA: Jefferson",
            "label": "IA: Jefferson"
        },
        {
            "value": "IA: Johnson",
            "label": "IA: Johnson"
        },
        {
            "value": "IA: Jones",
            "label": "IA: Jones"
        },
        {
            "value": "IA: Keokuk",
            "label": "IA: Keokuk"
        },
        {
            "value": "IA: Kossuth",
            "label": "IA: Kossuth"
        },
        {
            "value": "IA: Lee",
            "label": "IA: Lee"
        },
        {
            "value": "IA: Linn",
            "label": "IA: Linn"
        },
        {
            "value": "IA: Louisa",
            "label": "IA: Louisa"
        },
        {
            "value": "IA: Lucas",
            "label": "IA: Lucas"
        },
        {
            "value": "IA: Lyon",
            "label": "IA: Lyon"
        },
        {
            "value": "IA: Madison",
            "label": "IA: Madison"
        },
        {
            "value": "IA: Mahaska",
            "label": "IA: Mahaska"
        },
        {
            "value": "IA: Marion",
            "label": "IA: Marion"
        },
        {
            "value": "IA: Marshall",
            "label": "IA: Marshall"
        },
        {
            "value": "IA: Mills",
            "label": "IA: Mills"
        },
        {
            "value": "IA: Mitchell",
            "label": "IA: Mitchell"
        },
        {
            "value": "IA: Monona",
            "label": "IA: Monona"
        },
        {
            "value": "IA: Monroe",
            "label": "IA: Monroe"
        },
        {
            "value": "IA: Montgomery",
            "label": "IA: Montgomery"
        },
        {
            "value": "IA: Muscatine",
            "label": "IA: Muscatine"
        },
        {
            "value": "IA: O'Brien",
            "label": "IA: O'Brien"
        },
        {
            "value": "IA: Osceola",
            "label": "IA: Osceola"
        },
        {
            "value": "IA: Page",
            "label": "IA: Page"
        },
        {
            "value": "IA: Palo Alto",
            "label": "IA: Palo Alto"
        },
        {
            "value": "IA: Plymouth",
            "label": "IA: Plymouth"
        },
        {
            "value": "IA: Pocahontas",
            "label": "IA: Pocahontas"
        },
        {
            "value": "IA: Polk",
            "label": "IA: Polk"
        },
        {
            "value": "IA: Pottawattamie",
            "label": "IA: Pottawattamie"
        },
        {
            "value": "IA: Poweshiek",
            "label": "IA: Poweshiek"
        },
        {
            "value": "IA: Ringgold",
            "label": "IA: Ringgold"
        },
        {
            "value": "IA: Sac",
            "label": "IA: Sac"
        },
        {
            "value": "IA: Scott",
            "label": "IA: Scott"
        },
        {
            "value": "IA: Shelby",
            "label": "IA: Shelby"
        },
        {
            "value": "IA: Sioux",
            "label": "IA: Sioux"
        },
        {
            "value": "IA: Story",
            "label": "IA: Story"
        },
        {
            "value": "IA: Tama",
            "label": "IA: Tama"
        },
        {
            "value": "IA: Taylor",
            "label": "IA: Taylor"
        },
        {
            "value": "IA: Union",
            "label": "IA: Union"
        },
        {
            "value": "IA: Van Buren",
            "label": "IA: Van Buren"
        },
        {
            "value": "IA: Wapello",
            "label": "IA: Wapello"
        },
        {
            "value": "IA: Warren",
            "label": "IA: Warren"
        },
        {
            "value": "IA: Washington",
            "label": "IA: Washington"
        },
        {
            "value": "IA: Wayne",
            "label": "IA: Wayne"
        },
        {
            "value": "IA: Webster",
            "label": "IA: Webster"
        },
        {
            "value": "IA: Winnebago",
            "label": "IA: Winnebago"
        },
        {
            "value": "IA: Winneshiek",
            "label": "IA: Winneshiek"
        },
        {
            "value": "IA: Woodbury",
            "label": "IA: Woodbury"
        },
        {
            "value": "IA: Worth",
            "label": "IA: Worth"
        },
        {
            "value": "IA: Wright",
            "label": "IA: Wright"
        },
        {
            "value": "ID: Ada",
            "label": "ID: Ada"
        },
        {
            "value": "ID: Adams",
            "label": "ID: Adams"
        },
        {
            "value": "ID: Bannock",
            "label": "ID: Bannock"
        },
        {
            "value": "ID: Bear Lake",
            "label": "ID: Bear Lake"
        },
        {
            "value": "ID: Benewah",
            "label": "ID: Benewah"
        },
        {
            "value": "ID: Bingham",
            "label": "ID: Bingham"
        },
        {
            "value": "ID: Blaine",
            "label": "ID: Blaine"
        },
        {
            "value": "ID: Boise",
            "label": "ID: Boise"
        },
        {
            "value": "ID: Bonner",
            "label": "ID: Bonner"
        },
        {
            "value": "ID: Bonneville",
            "label": "ID: Bonneville"
        },
        {
            "value": "ID: Boundary",
            "label": "ID: Boundary"
        },
        {
            "value": "ID: Butte",
            "label": "ID: Butte"
        },
        {
            "value": "ID: Camas",
            "label": "ID: Camas"
        },
        {
            "value": "ID: Canyon",
            "label": "ID: Canyon"
        },
        {
            "value": "ID: Caribou",
            "label": "ID: Caribou"
        },
        {
            "value": "ID: Cassia",
            "label": "ID: Cassia"
        },
        {
            "value": "ID: Clark",
            "label": "ID: Clark"
        },
        {
            "value": "ID: Clearwater",
            "label": "ID: Clearwater"
        },
        {
            "value": "ID: Custer",
            "label": "ID: Custer"
        },
        {
            "value": "ID: Elmore",
            "label": "ID: Elmore"
        },
        {
            "value": "ID: Franklin",
            "label": "ID: Franklin"
        },
        {
            "value": "ID: Fremont",
            "label": "ID: Fremont"
        },
        {
            "value": "ID: Gem",
            "label": "ID: Gem"
        },
        {
            "value": "ID: Gooding",
            "label": "ID: Gooding"
        },
        {
            "value": "ID: Idaho",
            "label": "ID: Idaho"
        },
        {
            "value": "ID: Jefferson",
            "label": "ID: Jefferson"
        },
        {
            "value": "ID: Jerome",
            "label": "ID: Jerome"
        },
        {
            "value": "ID: Kootenai",
            "label": "ID: Kootenai"
        },
        {
            "value": "ID: Latah",
            "label": "ID: Latah"
        },
        {
            "value": "ID: Lemhi",
            "label": "ID: Lemhi"
        },
        {
            "value": "ID: Lewis",
            "label": "ID: Lewis"
        },
        {
            "value": "ID: Lincoln",
            "label": "ID: Lincoln"
        },
        {
            "value": "ID: Madison",
            "label": "ID: Madison"
        },
        {
            "value": "ID: Minidoka",
            "label": "ID: Minidoka"
        },
        {
            "value": "ID: Nez Perce",
            "label": "ID: Nez Perce"
        },
        {
            "value": "ID: Oneida",
            "label": "ID: Oneida"
        },
        {
            "value": "ID: Owyhee",
            "label": "ID: Owyhee"
        },
        {
            "value": "ID: Payette",
            "label": "ID: Payette"
        },
        {
            "value": "ID: Power",
            "label": "ID: Power"
        },
        {
            "value": "ID: Shoshone",
            "label": "ID: Shoshone"
        },
        {
            "value": "ID: Teton",
            "label": "ID: Teton"
        },
        {
            "value": "ID: Twin Falls",
            "label": "ID: Twin Falls"
        },
        {
            "value": "ID: Valley",
            "label": "ID: Valley"
        },
        {
            "value": "ID: Washington",
            "label": "ID: Washington"
        },
        {
            "value": "IL: Adams",
            "label": "IL: Adams"
        },
        {
            "value": "IL: Alexander",
            "label": "IL: Alexander"
        },
        {
            "value": "IL: Bond",
            "label": "IL: Bond"
        },
        {
            "value": "IL: Boone",
            "label": "IL: Boone"
        },
        {
            "value": "IL: Brown",
            "label": "IL: Brown"
        },
        {
            "value": "IL: Bureau",
            "label": "IL: Bureau"
        },
        {
            "value": "IL: Calhoun",
            "label": "IL: Calhoun"
        },
        {
            "value": "IL: Carroll",
            "label": "IL: Carroll"
        },
        {
            "value": "IL: Cass",
            "label": "IL: Cass"
        },
        {
            "value": "IL: Champaign",
            "label": "IL: Champaign"
        },
        {
            "value": "IL: Christian",
            "label": "IL: Christian"
        },
        {
            "value": "IL: Clark",
            "label": "IL: Clark"
        },
        {
            "value": "IL: Clay",
            "label": "IL: Clay"
        },
        {
            "value": "IL: Clinton",
            "label": "IL: Clinton"
        },
        {
            "value": "IL: Coles",
            "label": "IL: Coles"
        },
        {
            "value": "IL: Cook",
            "label": "IL: Cook"
        },
        {
            "value": "IL: Crawford",
            "label": "IL: Crawford"
        },
        {
            "value": "IL: Cumberland",
            "label": "IL: Cumberland"
        },
        {
            "value": "IL: De Witt",
            "label": "IL: De Witt"
        },
        {
            "value": "IL: DeKalb",
            "label": "IL: DeKalb"
        },
        {
            "value": "IL: Douglas",
            "label": "IL: Douglas"
        },
        {
            "value": "IL: DuPage",
            "label": "IL: DuPage"
        },
        {
            "value": "IL: Edgar",
            "label": "IL: Edgar"
        },
        {
            "value": "IL: Edwards",
            "label": "IL: Edwards"
        },
        {
            "value": "IL: Effingham",
            "label": "IL: Effingham"
        },
        {
            "value": "IL: Fayette",
            "label": "IL: Fayette"
        },
        {
            "value": "IL: Ford",
            "label": "IL: Ford"
        },
        {
            "value": "IL: Franklin",
            "label": "IL: Franklin"
        },
        {
            "value": "IL: Fulton",
            "label": "IL: Fulton"
        },
        {
            "value": "IL: Gallatin",
            "label": "IL: Gallatin"
        },
        {
            "value": "IL: Greene",
            "label": "IL: Greene"
        },
        {
            "value": "IL: Grundy",
            "label": "IL: Grundy"
        },
        {
            "value": "IL: Hamilton",
            "label": "IL: Hamilton"
        },
        {
            "value": "IL: Hancock",
            "label": "IL: Hancock"
        },
        {
            "value": "IL: Hardin",
            "label": "IL: Hardin"
        },
        {
            "value": "IL: Henderson",
            "label": "IL: Henderson"
        },
        {
            "value": "IL: Henry",
            "label": "IL: Henry"
        },
        {
            "value": "IL: Iroquois",
            "label": "IL: Iroquois"
        },
        {
            "value": "IL: Jackson",
            "label": "IL: Jackson"
        },
        {
            "value": "IL: Jasper",
            "label": "IL: Jasper"
        },
        {
            "value": "IL: Jefferson",
            "label": "IL: Jefferson"
        },
        {
            "value": "IL: Jersey",
            "label": "IL: Jersey"
        },
        {
            "value": "IL: Jo Daviess",
            "label": "IL: Jo Daviess"
        },
        {
            "value": "IL: Johnson",
            "label": "IL: Johnson"
        },
        {
            "value": "IL: Kane",
            "label": "IL: Kane"
        },
        {
            "value": "IL: Kankakee",
            "label": "IL: Kankakee"
        },
        {
            "value": "IL: Kendall",
            "label": "IL: Kendall"
        },
        {
            "value": "IL: Knox",
            "label": "IL: Knox"
        },
        {
            "value": "IL: Lake",
            "label": "IL: Lake"
        },
        {
            "value": "IL: LaSalle",
            "label": "IL: LaSalle"
        },
        {
            "value": "IL: Lawrence",
            "label": "IL: Lawrence"
        },
        {
            "value": "IL: Lee",
            "label": "IL: Lee"
        },
        {
            "value": "IL: Livingston",
            "label": "IL: Livingston"
        },
        {
            "value": "IL: Logan",
            "label": "IL: Logan"
        },
        {
            "value": "IL: Macon",
            "label": "IL: Macon"
        },
        {
            "value": "IL: Macoupin",
            "label": "IL: Macoupin"
        },
        {
            "value": "IL: Madison",
            "label": "IL: Madison"
        },
        {
            "value": "IL: Marion",
            "label": "IL: Marion"
        },
        {
            "value": "IL: Marshall",
            "label": "IL: Marshall"
        },
        {
            "value": "IL: Mason",
            "label": "IL: Mason"
        },
        {
            "value": "IL: Massac",
            "label": "IL: Massac"
        },
        {
            "value": "IL: McDonough",
            "label": "IL: McDonough"
        },
        {
            "value": "IL: McHenry",
            "label": "IL: McHenry"
        },
        {
            "value": "IL: McLean",
            "label": "IL: McLean"
        },
        {
            "value": "IL: Menard",
            "label": "IL: Menard"
        },
        {
            "value": "IL: Mercer",
            "label": "IL: Mercer"
        },
        {
            "value": "IL: Monroe",
            "label": "IL: Monroe"
        },
        {
            "value": "IL: Montgomery",
            "label": "IL: Montgomery"
        },
        {
            "value": "IL: Morgan",
            "label": "IL: Morgan"
        },
        {
            "value": "IL: Moultrie",
            "label": "IL: Moultrie"
        },
        {
            "value": "IL: Ogle",
            "label": "IL: Ogle"
        },
        {
            "value": "IL: Peoria",
            "label": "IL: Peoria"
        },
        {
            "value": "IL: Perry",
            "label": "IL: Perry"
        },
        {
            "value": "IL: Piatt",
            "label": "IL: Piatt"
        },
        {
            "value": "IL: Pike",
            "label": "IL: Pike"
        },
        {
            "value": "IL: Pope",
            "label": "IL: Pope"
        },
        {
            "value": "IL: Pulaski",
            "label": "IL: Pulaski"
        },
        {
            "value": "IL: Putnam",
            "label": "IL: Putnam"
        },
        {
            "value": "IL: Randolph",
            "label": "IL: Randolph"
        },
        {
            "value": "IL: Richland",
            "label": "IL: Richland"
        },
        {
            "value": "IL: Rock Island",
            "label": "IL: Rock Island"
        },
        {
            "value": "IL: Saline",
            "label": "IL: Saline"
        },
        {
            "value": "IL: Sangamon",
            "label": "IL: Sangamon"
        },
        {
            "value": "IL: Schuyler",
            "label": "IL: Schuyler"
        },
        {
            "value": "IL: Scott",
            "label": "IL: Scott"
        },
        {
            "value": "IL: Shelby",
            "label": "IL: Shelby"
        },
        {
            "value": "IL: St. Clair",
            "label": "IL: St. Clair"
        },
        {
            "value": "IL: Stark",
            "label": "IL: Stark"
        },
        {
            "value": "IL: Stephenson",
            "label": "IL: Stephenson"
        },
        {
            "value": "IL: Tazewell",
            "label": "IL: Tazewell"
        },
        {
            "value": "IL: Union",
            "label": "IL: Union"
        },
        {
            "value": "IL: Vermilion",
            "label": "IL: Vermilion"
        },
        {
            "value": "IL: Wabash",
            "label": "IL: Wabash"
        },
        {
            "value": "IL: Warren",
            "label": "IL: Warren"
        },
        {
            "value": "IL: Washington",
            "label": "IL: Washington"
        },
        {
            "value": "IL: Wayne",
            "label": "IL: Wayne"
        },
        {
            "value": "IL: White",
            "label": "IL: White"
        },
        {
            "value": "IL: Whiteside",
            "label": "IL: Whiteside"
        },
        {
            "value": "IL: Will",
            "label": "IL: Will"
        },
        {
            "value": "IL: Williamson",
            "label": "IL: Williamson"
        },
        {
            "value": "IL: Winnebago",
            "label": "IL: Winnebago"
        },
        {
            "value": "IL: Woodford",
            "label": "IL: Woodford"
        },
        {
            "value": "IN: Adams",
            "label": "IN: Adams"
        },
        {
            "value": "IN: Allen",
            "label": "IN: Allen"
        },
        {
            "value": "IN: Bartholomew",
            "label": "IN: Bartholomew"
        },
        {
            "value": "IN: Benton",
            "label": "IN: Benton"
        },
        {
            "value": "IN: Blackford",
            "label": "IN: Blackford"
        },
        {
            "value": "IN: Boone",
            "label": "IN: Boone"
        },
        {
            "value": "IN: Brown",
            "label": "IN: Brown"
        },
        {
            "value": "IN: Carroll",
            "label": "IN: Carroll"
        },
        {
            "value": "IN: Cass",
            "label": "IN: Cass"
        },
        {
            "value": "IN: Clark",
            "label": "IN: Clark"
        },
        {
            "value": "IN: Clay",
            "label": "IN: Clay"
        },
        {
            "value": "IN: Clinton",
            "label": "IN: Clinton"
        },
        {
            "value": "IN: Crawford",
            "label": "IN: Crawford"
        },
        {
            "value": "IN: Daviess",
            "label": "IN: Daviess"
        },
        {
            "value": "IN: Dearborn",
            "label": "IN: Dearborn"
        },
        {
            "value": "IN: Decatur",
            "label": "IN: Decatur"
        },
        {
            "value": "IN: DeKalb",
            "label": "IN: DeKalb"
        },
        {
            "value": "IN: Delaware",
            "label": "IN: Delaware"
        },
        {
            "value": "IN: Dubois",
            "label": "IN: Dubois"
        },
        {
            "value": "IN: Elkhart",
            "label": "IN: Elkhart"
        },
        {
            "value": "IN: Fayette",
            "label": "IN: Fayette"
        },
        {
            "value": "IN: Floyd",
            "label": "IN: Floyd"
        },
        {
            "value": "IN: Fountain",
            "label": "IN: Fountain"
        },
        {
            "value": "IN: Franklin",
            "label": "IN: Franklin"
        },
        {
            "value": "IN: Fulton",
            "label": "IN: Fulton"
        },
        {
            "value": "IN: Gibson",
            "label": "IN: Gibson"
        },
        {
            "value": "IN: Grant",
            "label": "IN: Grant"
        },
        {
            "value": "IN: Greene",
            "label": "IN: Greene"
        },
        {
            "value": "IN: Hamilton",
            "label": "IN: Hamilton"
        },
        {
            "value": "IN: Hancock",
            "label": "IN: Hancock"
        },
        {
            "value": "IN: Harrison",
            "label": "IN: Harrison"
        },
        {
            "value": "IN: Hendricks",
            "label": "IN: Hendricks"
        },
        {
            "value": "IN: Henry",
            "label": "IN: Henry"
        },
        {
            "value": "IN: Howard",
            "label": "IN: Howard"
        },
        {
            "value": "IN: Huntington",
            "label": "IN: Huntington"
        },
        {
            "value": "IN: Jackson",
            "label": "IN: Jackson"
        },
        {
            "value": "IN: Jasper",
            "label": "IN: Jasper"
        },
        {
            "value": "IN: Jay",
            "label": "IN: Jay"
        },
        {
            "value": "IN: Jefferson",
            "label": "IN: Jefferson"
        },
        {
            "value": "IN: Jennings",
            "label": "IN: Jennings"
        },
        {
            "value": "IN: Johnson",
            "label": "IN: Johnson"
        },
        {
            "value": "IN: Knox",
            "label": "IN: Knox"
        },
        {
            "value": "IN: Kosciusko",
            "label": "IN: Kosciusko"
        },
        {
            "value": "IN: LaGrange",
            "label": "IN: LaGrange"
        },
        {
            "value": "IN: Lake",
            "label": "IN: Lake"
        },
        {
            "value": "IN: LaPorte",
            "label": "IN: LaPorte"
        },
        {
            "value": "IN: Lawrence",
            "label": "IN: Lawrence"
        },
        {
            "value": "IN: Madison",
            "label": "IN: Madison"
        },
        {
            "value": "IN: Marion",
            "label": "IN: Marion"
        },
        {
            "value": "IN: Marshall",
            "label": "IN: Marshall"
        },
        {
            "value": "IN: Martin",
            "label": "IN: Martin"
        },
        {
            "value": "IN: Miami",
            "label": "IN: Miami"
        },
        {
            "value": "IN: Monroe",
            "label": "IN: Monroe"
        },
        {
            "value": "IN: Montgomery",
            "label": "IN: Montgomery"
        },
        {
            "value": "IN: Morgan",
            "label": "IN: Morgan"
        },
        {
            "value": "IN: Newton",
            "label": "IN: Newton"
        },
        {
            "value": "IN: Noble",
            "label": "IN: Noble"
        },
        {
            "value": "IN: Ohio",
            "label": "IN: Ohio"
        },
        {
            "value": "IN: Orange",
            "label": "IN: Orange"
        },
        {
            "value": "IN: Owen",
            "label": "IN: Owen"
        },
        {
            "value": "IN: Parke",
            "label": "IN: Parke"
        },
        {
            "value": "IN: Perry",
            "label": "IN: Perry"
        },
        {
            "value": "IN: Pike",
            "label": "IN: Pike"
        },
        {
            "value": "IN: Porter",
            "label": "IN: Porter"
        },
        {
            "value": "IN: Posey",
            "label": "IN: Posey"
        },
        {
            "value": "IN: Pulaski",
            "label": "IN: Pulaski"
        },
        {
            "value": "IN: Putnam",
            "label": "IN: Putnam"
        },
        {
            "value": "IN: Randolph",
            "label": "IN: Randolph"
        },
        {
            "value": "IN: Ripley",
            "label": "IN: Ripley"
        },
        {
            "value": "IN: Rush",
            "label": "IN: Rush"
        },
        {
            "value": "IN: Scott",
            "label": "IN: Scott"
        },
        {
            "value": "IN: Shelby",
            "label": "IN: Shelby"
        },
        {
            "value": "IN: Spencer",
            "label": "IN: Spencer"
        },
        {
            "value": "IN: St. Joseph",
            "label": "IN: St. Joseph"
        },
        {
            "value": "IN: Starke",
            "label": "IN: Starke"
        },
        {
            "value": "IN: Steuben",
            "label": "IN: Steuben"
        },
        {
            "value": "IN: Sullivan",
            "label": "IN: Sullivan"
        },
        {
            "value": "IN: Switzerland",
            "label": "IN: Switzerland"
        },
        {
            "value": "IN: Tippecanoe",
            "label": "IN: Tippecanoe"
        },
        {
            "value": "IN: Tipton",
            "label": "IN: Tipton"
        },
        {
            "value": "IN: Union",
            "label": "IN: Union"
        },
        {
            "value": "IN: Vanderburgh",
            "label": "IN: Vanderburgh"
        },
        {
            "value": "IN: Vermillion",
            "label": "IN: Vermillion"
        },
        {
            "value": "IN: Vigo",
            "label": "IN: Vigo"
        },
        {
            "value": "IN: Wabash",
            "label": "IN: Wabash"
        },
        {
            "value": "IN: Warren",
            "label": "IN: Warren"
        },
        {
            "value": "IN: Warrick",
            "label": "IN: Warrick"
        },
        {
            "value": "IN: Washington",
            "label": "IN: Washington"
        },
        {
            "value": "IN: Wayne",
            "label": "IN: Wayne"
        },
        {
            "value": "IN: Wells",
            "label": "IN: Wells"
        },
        {
            "value": "IN: White",
            "label": "IN: White"
        },
        {
            "value": "IN: Whitley",
            "label": "IN: Whitley"
        },
        {
            "value": "KS: Allen",
            "label": "KS: Allen"
        },
        {
            "value": "KS: Anderson",
            "label": "KS: Anderson"
        },
        {
            "value": "KS: Atchison",
            "label": "KS: Atchison"
        },
        {
            "value": "KS: Barber",
            "label": "KS: Barber"
        },
        {
            "value": "KS: Barton",
            "label": "KS: Barton"
        },
        {
            "value": "KS: Bourbon",
            "label": "KS: Bourbon"
        },
        {
            "value": "KS: Brown",
            "label": "KS: Brown"
        },
        {
            "value": "KS: Butler",
            "label": "KS: Butler"
        },
        {
            "value": "KS: Chase",
            "label": "KS: Chase"
        },
        {
            "value": "KS: Chautauqua",
            "label": "KS: Chautauqua"
        },
        {
            "value": "KS: Cherokee",
            "label": "KS: Cherokee"
        },
        {
            "value": "KS: Cheyenne",
            "label": "KS: Cheyenne"
        },
        {
            "value": "KS: Clark",
            "label": "KS: Clark"
        },
        {
            "value": "KS: Clay",
            "label": "KS: Clay"
        },
        {
            "value": "KS: Cloud",
            "label": "KS: Cloud"
        },
        {
            "value": "KS: Coffey",
            "label": "KS: Coffey"
        },
        {
            "value": "KS: Comanche",
            "label": "KS: Comanche"
        },
        {
            "value": "KS: Cowley",
            "label": "KS: Cowley"
        },
        {
            "value": "KS: Crawford",
            "label": "KS: Crawford"
        },
        {
            "value": "KS: Decatur",
            "label": "KS: Decatur"
        },
        {
            "value": "KS: Dickinson",
            "label": "KS: Dickinson"
        },
        {
            "value": "KS: Doniphan",
            "label": "KS: Doniphan"
        },
        {
            "value": "KS: Douglas",
            "label": "KS: Douglas"
        },
        {
            "value": "KS: Edwards",
            "label": "KS: Edwards"
        },
        {
            "value": "KS: Elk",
            "label": "KS: Elk"
        },
        {
            "value": "KS: Ellis",
            "label": "KS: Ellis"
        },
        {
            "value": "KS: Ellsworth",
            "label": "KS: Ellsworth"
        },
        {
            "value": "KS: Finney",
            "label": "KS: Finney"
        },
        {
            "value": "KS: Ford",
            "label": "KS: Ford"
        },
        {
            "value": "KS: Franklin",
            "label": "KS: Franklin"
        },
        {
            "value": "KS: Geary",
            "label": "KS: Geary"
        },
        {
            "value": "KS: Gove",
            "label": "KS: Gove"
        },
        {
            "value": "KS: Graham",
            "label": "KS: Graham"
        },
        {
            "value": "KS: Grant",
            "label": "KS: Grant"
        },
        {
            "value": "KS: Gray",
            "label": "KS: Gray"
        },
        {
            "value": "KS: Greeley",
            "label": "KS: Greeley"
        },
        {
            "value": "KS: Greenwood",
            "label": "KS: Greenwood"
        },
        {
            "value": "KS: Hamilton",
            "label": "KS: Hamilton"
        },
        {
            "value": "KS: Harper",
            "label": "KS: Harper"
        },
        {
            "value": "KS: Harvey",
            "label": "KS: Harvey"
        },
        {
            "value": "KS: Haskell",
            "label": "KS: Haskell"
        },
        {
            "value": "KS: Hodgeman",
            "label": "KS: Hodgeman"
        },
        {
            "value": "KS: Jackson",
            "label": "KS: Jackson"
        },
        {
            "value": "KS: Jefferson",
            "label": "KS: Jefferson"
        },
        {
            "value": "KS: Jewell",
            "label": "KS: Jewell"
        },
        {
            "value": "KS: Johnson",
            "label": "KS: Johnson"
        },
        {
            "value": "KS: Kearny",
            "label": "KS: Kearny"
        },
        {
            "value": "KS: Kingman",
            "label": "KS: Kingman"
        },
        {
            "value": "KS: Kiowa",
            "label": "KS: Kiowa"
        },
        {
            "value": "KS: Labette",
            "label": "KS: Labette"
        },
        {
            "value": "KS: Lane",
            "label": "KS: Lane"
        },
        {
            "value": "KS: Leavenworth",
            "label": "KS: Leavenworth"
        },
        {
            "value": "KS: Lincoln",
            "label": "KS: Lincoln"
        },
        {
            "value": "KS: Linn",
            "label": "KS: Linn"
        },
        {
            "value": "KS: Logan",
            "label": "KS: Logan"
        },
        {
            "value": "KS: Lyon",
            "label": "KS: Lyon"
        },
        {
            "value": "KS: Marion",
            "label": "KS: Marion"
        },
        {
            "value": "KS: Marshall",
            "label": "KS: Marshall"
        },
        {
            "value": "KS: McPherson",
            "label": "KS: McPherson"
        },
        {
            "value": "KS: Meade",
            "label": "KS: Meade"
        },
        {
            "value": "KS: Miami",
            "label": "KS: Miami"
        },
        {
            "value": "KS: Mitchell",
            "label": "KS: Mitchell"
        },
        {
            "value": "KS: Montgomery",
            "label": "KS: Montgomery"
        },
        {
            "value": "KS: Morris",
            "label": "KS: Morris"
        },
        {
            "value": "KS: Morton",
            "label": "KS: Morton"
        },
        {
            "value": "KS: Nemaha",
            "label": "KS: Nemaha"
        },
        {
            "value": "KS: Neosho",
            "label": "KS: Neosho"
        },
        {
            "value": "KS: Ness",
            "label": "KS: Ness"
        },
        {
            "value": "KS: Norton",
            "label": "KS: Norton"
        },
        {
            "value": "KS: Osage",
            "label": "KS: Osage"
        },
        {
            "value": "KS: Osborne",
            "label": "KS: Osborne"
        },
        {
            "value": "KS: Ottawa",
            "label": "KS: Ottawa"
        },
        {
            "value": "KS: Pawnee",
            "label": "KS: Pawnee"
        },
        {
            "value": "KS: Phillips",
            "label": "KS: Phillips"
        },
        {
            "value": "KS: Pottawatomie",
            "label": "KS: Pottawatomie"
        },
        {
            "value": "KS: Pratt",
            "label": "KS: Pratt"
        },
        {
            "value": "KS: Rawlins",
            "label": "KS: Rawlins"
        },
        {
            "value": "KS: Reno",
            "label": "KS: Reno"
        },
        {
            "value": "KS: Republic",
            "label": "KS: Republic"
        },
        {
            "value": "KS: Rice",
            "label": "KS: Rice"
        },
        {
            "value": "KS: Riley",
            "label": "KS: Riley"
        },
        {
            "value": "KS: Rooks",
            "label": "KS: Rooks"
        },
        {
            "value": "KS: Rush",
            "label": "KS: Rush"
        },
        {
            "value": "KS: Russell",
            "label": "KS: Russell"
        },
        {
            "value": "KS: Saline",
            "label": "KS: Saline"
        },
        {
            "value": "KS: Scott",
            "label": "KS: Scott"
        },
        {
            "value": "KS: Sedgwick",
            "label": "KS: Sedgwick"
        },
        {
            "value": "KS: Seward",
            "label": "KS: Seward"
        },
        {
            "value": "KS: Shawnee",
            "label": "KS: Shawnee"
        },
        {
            "value": "KS: Sheridan",
            "label": "KS: Sheridan"
        },
        {
            "value": "KS: Sherman",
            "label": "KS: Sherman"
        },
        {
            "value": "KS: Smith",
            "label": "KS: Smith"
        },
        {
            "value": "KS: Stafford",
            "label": "KS: Stafford"
        },
        {
            "value": "KS: Stanton",
            "label": "KS: Stanton"
        },
        {
            "value": "KS: Stevens",
            "label": "KS: Stevens"
        },
        {
            "value": "KS: Sumner",
            "label": "KS: Sumner"
        },
        {
            "value": "KS: Thomas",
            "label": "KS: Thomas"
        },
        {
            "value": "KS: Trego",
            "label": "KS: Trego"
        },
        {
            "value": "KS: Wabaunsee",
            "label": "KS: Wabaunsee"
        },
        {
            "value": "KS: Wallace",
            "label": "KS: Wallace"
        },
        {
            "value": "KS: Washington",
            "label": "KS: Washington"
        },
        {
            "value": "KS: Wichita",
            "label": "KS: Wichita"
        },
        {
            "value": "KS: Wilson",
            "label": "KS: Wilson"
        },
        {
            "value": "KS: Woodson",
            "label": "KS: Woodson"
        },
        {
            "value": "KS: Wyandotte",
            "label": "KS: Wyandotte"
        },
        {
            "value": "KY: Adair",
            "label": "KY: Adair"
        },
        {
            "value": "KY: Allen",
            "label": "KY: Allen"
        },
        {
            "value": "KY: Anderson",
            "label": "KY: Anderson"
        },
        {
            "value": "KY: Ballard",
            "label": "KY: Ballard"
        },
        {
            "value": "KY: Barren",
            "label": "KY: Barren"
        },
        {
            "value": "KY: Bath",
            "label": "KY: Bath"
        },
        {
            "value": "KY: Bell",
            "label": "KY: Bell"
        },
        {
            "value": "KY: Boone",
            "label": "KY: Boone"
        },
        {
            "value": "KY: Bourbon",
            "label": "KY: Bourbon"
        },
        {
            "value": "KY: Boyd",
            "label": "KY: Boyd"
        },
        {
            "value": "KY: Boyle",
            "label": "KY: Boyle"
        },
        {
            "value": "KY: Bracken",
            "label": "KY: Bracken"
        },
        {
            "value": "KY: Breathitt",
            "label": "KY: Breathitt"
        },
        {
            "value": "KY: Breckinridge",
            "label": "KY: Breckinridge"
        },
        {
            "value": "KY: Bullitt",
            "label": "KY: Bullitt"
        },
        {
            "value": "KY: Butler",
            "label": "KY: Butler"
        },
        {
            "value": "KY: Caldwell",
            "label": "KY: Caldwell"
        },
        {
            "value": "KY: Calloway",
            "label": "KY: Calloway"
        },
        {
            "value": "KY: Campbell",
            "label": "KY: Campbell"
        },
        {
            "value": "KY: Carlisle",
            "label": "KY: Carlisle"
        },
        {
            "value": "KY: Carroll",
            "label": "KY: Carroll"
        },
        {
            "value": "KY: Carter",
            "label": "KY: Carter"
        },
        {
            "value": "KY: Casey",
            "label": "KY: Casey"
        },
        {
            "value": "KY: Christian",
            "label": "KY: Christian"
        },
        {
            "value": "KY: Clark",
            "label": "KY: Clark"
        },
        {
            "value": "KY: Clay",
            "label": "KY: Clay"
        },
        {
            "value": "KY: Clinton",
            "label": "KY: Clinton"
        },
        {
            "value": "KY: Crittenden",
            "label": "KY: Crittenden"
        },
        {
            "value": "KY: Cumberland",
            "label": "KY: Cumberland"
        },
        {
            "value": "KY: Daviess",
            "label": "KY: Daviess"
        },
        {
            "value": "KY: Edmonson",
            "label": "KY: Edmonson"
        },
        {
            "value": "KY: Elliott",
            "label": "KY: Elliott"
        },
        {
            "value": "KY: Estill",
            "label": "KY: Estill"
        },
        {
            "value": "KY: Fayette",
            "label": "KY: Fayette"
        },
        {
            "value": "KY: Fleming",
            "label": "KY: Fleming"
        },
        {
            "value": "KY: Floyd",
            "label": "KY: Floyd"
        },
        {
            "value": "KY: Franklin",
            "label": "KY: Franklin"
        },
        {
            "value": "KY: Fulton",
            "label": "KY: Fulton"
        },
        {
            "value": "KY: Gallatin",
            "label": "KY: Gallatin"
        },
        {
            "value": "KY: Garrard",
            "label": "KY: Garrard"
        },
        {
            "value": "KY: Grant",
            "label": "KY: Grant"
        },
        {
            "value": "KY: Graves",
            "label": "KY: Graves"
        },
        {
            "value": "KY: Grayson",
            "label": "KY: Grayson"
        },
        {
            "value": "KY: Green",
            "label": "KY: Green"
        },
        {
            "value": "KY: Greenup",
            "label": "KY: Greenup"
        },
        {
            "value": "KY: Hancock",
            "label": "KY: Hancock"
        },
        {
            "value": "KY: Hardin",
            "label": "KY: Hardin"
        },
        {
            "value": "KY: Harlan",
            "label": "KY: Harlan"
        },
        {
            "value": "KY: Harrison",
            "label": "KY: Harrison"
        },
        {
            "value": "KY: Hart",
            "label": "KY: Hart"
        },
        {
            "value": "KY: Henderson",
            "label": "KY: Henderson"
        },
        {
            "value": "KY: Henry",
            "label": "KY: Henry"
        },
        {
            "value": "KY: Hickman",
            "label": "KY: Hickman"
        },
        {
            "value": "KY: Hopkins",
            "label": "KY: Hopkins"
        },
        {
            "value": "KY: Jackson",
            "label": "KY: Jackson"
        },
        {
            "value": "KY: Jefferson",
            "label": "KY: Jefferson"
        },
        {
            "value": "KY: Jessamine",
            "label": "KY: Jessamine"
        },
        {
            "value": "KY: Johnson",
            "label": "KY: Johnson"
        },
        {
            "value": "KY: Kenton",
            "label": "KY: Kenton"
        },
        {
            "value": "KY: Knott",
            "label": "KY: Knott"
        },
        {
            "value": "KY: Knox",
            "label": "KY: Knox"
        },
        {
            "value": "KY: Larue",
            "label": "KY: Larue"
        },
        {
            "value": "KY: Laurel",
            "label": "KY: Laurel"
        },
        {
            "value": "KY: Lawrence",
            "label": "KY: Lawrence"
        },
        {
            "value": "KY: Lee",
            "label": "KY: Lee"
        },
        {
            "value": "KY: Leslie",
            "label": "KY: Leslie"
        },
        {
            "value": "KY: Letcher",
            "label": "KY: Letcher"
        },
        {
            "value": "KY: Lewis",
            "label": "KY: Lewis"
        },
        {
            "value": "KY: Lincoln",
            "label": "KY: Lincoln"
        },
        {
            "value": "KY: Livingston",
            "label": "KY: Livingston"
        },
        {
            "value": "KY: Logan",
            "label": "KY: Logan"
        },
        {
            "value": "KY: Lyon",
            "label": "KY: Lyon"
        },
        {
            "value": "KY: Madison",
            "label": "KY: Madison"
        },
        {
            "value": "KY: Magoffin",
            "label": "KY: Magoffin"
        },
        {
            "value": "KY: Marion",
            "label": "KY: Marion"
        },
        {
            "value": "KY: Marshall",
            "label": "KY: Marshall"
        },
        {
            "value": "KY: Martin",
            "label": "KY: Martin"
        },
        {
            "value": "KY: Mason",
            "label": "KY: Mason"
        },
        {
            "value": "KY: McCracken",
            "label": "KY: McCracken"
        },
        {
            "value": "KY: McCreary",
            "label": "KY: McCreary"
        },
        {
            "value": "KY: McLean",
            "label": "KY: McLean"
        },
        {
            "value": "KY: Meade",
            "label": "KY: Meade"
        },
        {
            "value": "KY: Menifee",
            "label": "KY: Menifee"
        },
        {
            "value": "KY: Mercer",
            "label": "KY: Mercer"
        },
        {
            "value": "KY: Metcalfe",
            "label": "KY: Metcalfe"
        },
        {
            "value": "KY: Monroe",
            "label": "KY: Monroe"
        },
        {
            "value": "KY: Montgomery",
            "label": "KY: Montgomery"
        },
        {
            "value": "KY: Morgan",
            "label": "KY: Morgan"
        },
        {
            "value": "KY: Muhlenberg",
            "label": "KY: Muhlenberg"
        },
        {
            "value": "KY: Nelson",
            "label": "KY: Nelson"
        },
        {
            "value": "KY: Nicholas",
            "label": "KY: Nicholas"
        },
        {
            "value": "KY: Ohio",
            "label": "KY: Ohio"
        },
        {
            "value": "KY: Oldham",
            "label": "KY: Oldham"
        },
        {
            "value": "KY: Owen",
            "label": "KY: Owen"
        },
        {
            "value": "KY: Owsley",
            "label": "KY: Owsley"
        },
        {
            "value": "KY: Pendleton",
            "label": "KY: Pendleton"
        },
        {
            "value": "KY: Perry",
            "label": "KY: Perry"
        },
        {
            "value": "KY: Pike",
            "label": "KY: Pike"
        },
        {
            "value": "KY: Powell",
            "label": "KY: Powell"
        },
        {
            "value": "KY: Pulaski",
            "label": "KY: Pulaski"
        },
        {
            "value": "KY: Robertson",
            "label": "KY: Robertson"
        },
        {
            "value": "KY: Rockcastle",
            "label": "KY: Rockcastle"
        },
        {
            "value": "KY: Rowan",
            "label": "KY: Rowan"
        },
        {
            "value": "KY: Russell",
            "label": "KY: Russell"
        },
        {
            "value": "KY: Scott",
            "label": "KY: Scott"
        },
        {
            "value": "KY: Shelby",
            "label": "KY: Shelby"
        },
        {
            "value": "KY: Simpson",
            "label": "KY: Simpson"
        },
        {
            "value": "KY: Spencer",
            "label": "KY: Spencer"
        },
        {
            "value": "KY: Taylor",
            "label": "KY: Taylor"
        },
        {
            "value": "KY: Todd",
            "label": "KY: Todd"
        },
        {
            "value": "KY: Trigg",
            "label": "KY: Trigg"
        },
        {
            "value": "KY: Trimble",
            "label": "KY: Trimble"
        },
        {
            "value": "KY: Union",
            "label": "KY: Union"
        },
        {
            "value": "KY: Warren",
            "label": "KY: Warren"
        },
        {
            "value": "KY: Washington",
            "label": "KY: Washington"
        },
        {
            "value": "KY: Wayne",
            "label": "KY: Wayne"
        },
        {
            "value": "KY: Webster",
            "label": "KY: Webster"
        },
        {
            "value": "KY: Whitley",
            "label": "KY: Whitley"
        },
        {
            "value": "KY: Wolfe",
            "label": "KY: Wolfe"
        },
        {
            "value": "KY: Woodford",
            "label": "KY: Woodford"
        },
        {
            "value": "LA: Acadia",
            "label": "LA: Acadia"
        },
        {
            "value": "LA: Allen",
            "label": "LA: Allen"
        },
        {
            "value": "LA: Ascension",
            "label": "LA: Ascension"
        },
        {
            "value": "LA: Assumption",
            "label": "LA: Assumption"
        },
        {
            "value": "LA: Avoyelles",
            "label": "LA: Avoyelles"
        },
        {
            "value": "LA: Beauregard",
            "label": "LA: Beauregard"
        },
        {
            "value": "LA: Bienville",
            "label": "LA: Bienville"
        },
        {
            "value": "LA: Bossier",
            "label": "LA: Bossier"
        },
        {
            "value": "LA: Caddo",
            "label": "LA: Caddo"
        },
        {
            "value": "LA: Calcasieu",
            "label": "LA: Calcasieu"
        },
        {
            "value": "LA: Caldwell",
            "label": "LA: Caldwell"
        },
        {
            "value": "LA: Cameron",
            "label": "LA: Cameron"
        },
        {
            "value": "LA: Catahoula",
            "label": "LA: Catahoula"
        },
        {
            "value": "LA: Claiborne",
            "label": "LA: Claiborne"
        },
        {
            "value": "LA: Concordia",
            "label": "LA: Concordia"
        },
        {
            "value": "LA: De Soto",
            "label": "LA: De Soto"
        },
        {
            "value": "LA: East Baton Rouge",
            "label": "LA: East Baton Rouge"
        },
        {
            "value": "LA: East Carroll",
            "label": "LA: East Carroll"
        },
        {
            "value": "LA: East Feliciana",
            "label": "LA: East Feliciana"
        },
        {
            "value": "LA: Evangeline",
            "label": "LA: Evangeline"
        },
        {
            "value": "LA: Franklin",
            "label": "LA: Franklin"
        },
        {
            "value": "LA: Grant",
            "label": "LA: Grant"
        },
        {
            "value": "LA: Iberia",
            "label": "LA: Iberia"
        },
        {
            "value": "LA: Iberville",
            "label": "LA: Iberville"
        },
        {
            "value": "LA: Jackson",
            "label": "LA: Jackson"
        },
        {
            "value": "LA: Jefferson",
            "label": "LA: Jefferson"
        },
        {
            "value": "LA: Jefferson Davis",
            "label": "LA: Jefferson Davis"
        },
        {
            "value": "LA: Lafayette",
            "label": "LA: Lafayette"
        },
        {
            "value": "LA: Lafourche",
            "label": "LA: Lafourche"
        },
        {
            "value": "LA: LaSalle",
            "label": "LA: LaSalle"
        },
        {
            "value": "LA: Lincoln",
            "label": "LA: Lincoln"
        },
        {
            "value": "LA: Livingston",
            "label": "LA: Livingston"
        },
        {
            "value": "LA: Madison",
            "label": "LA: Madison"
        },
        {
            "value": "LA: Morehouse",
            "label": "LA: Morehouse"
        },
        {
            "value": "LA: Natchitoches",
            "label": "LA: Natchitoches"
        },
        {
            "value": "LA: Orleans",
            "label": "LA: Orleans"
        },
        {
            "value": "LA: Ouachita",
            "label": "LA: Ouachita"
        },
        {
            "value": "LA: Plaquemines",
            "label": "LA: Plaquemines"
        },
        {
            "value": "LA: Pointe Coupee",
            "label": "LA: Pointe Coupee"
        },
        {
            "value": "LA: Rapides",
            "label": "LA: Rapides"
        },
        {
            "value": "LA: Red River",
            "label": "LA: Red River"
        },
        {
            "value": "LA: Richland",
            "label": "LA: Richland"
        },
        {
            "value": "LA: Sabine",
            "label": "LA: Sabine"
        },
        {
            "value": "LA: St. Bernard",
            "label": "LA: St. Bernard"
        },
        {
            "value": "LA: St. Charles",
            "label": "LA: St. Charles"
        },
        {
            "value": "LA: St. Helena",
            "label": "LA: St. Helena"
        },
        {
            "value": "LA: St. James",
            "label": "LA: St. James"
        },
        {
            "value": "LA: St. John the Baptist",
            "label": "LA: St. John the Baptist"
        },
        {
            "value": "LA: St. Landry",
            "label": "LA: St. Landry"
        },
        {
            "value": "LA: St. Martin",
            "label": "LA: St. Martin"
        },
        {
            "value": "LA: St. Mary",
            "label": "LA: St. Mary"
        },
        {
            "value": "LA: St. Tammany",
            "label": "LA: St. Tammany"
        },
        {
            "value": "LA: Tangipahoa",
            "label": "LA: Tangipahoa"
        },
        {
            "value": "LA: Tensas",
            "label": "LA: Tensas"
        },
        {
            "value": "LA: Terrebonne",
            "label": "LA: Terrebonne"
        },
        {
            "value": "LA: Union",
            "label": "LA: Union"
        },
        {
            "value": "LA: Vermilion",
            "label": "LA: Vermilion"
        },
        {
            "value": "LA: Vernon",
            "label": "LA: Vernon"
        },
        {
            "value": "LA: Washington",
            "label": "LA: Washington"
        },
        {
            "value": "LA: Webster",
            "label": "LA: Webster"
        },
        {
            "value": "LA: West Baton Rouge",
            "label": "LA: West Baton Rouge"
        },
        {
            "value": "LA: West Carroll",
            "label": "LA: West Carroll"
        },
        {
            "value": "LA: West Feliciana",
            "label": "LA: West Feliciana"
        },
        {
            "value": "LA: Winn",
            "label": "LA: Winn"
        },
        {
            "value": "MA: Barnstable",
            "label": "MA: Barnstable"
        },
        {
            "value": "MA: Berkshire",
            "label": "MA: Berkshire"
        },
        {
            "value": "MA: Bristol",
            "label": "MA: Bristol"
        },
        {
            "value": "MA: Dukes",
            "label": "MA: Dukes"
        },
        {
            "value": "MA: Essex",
            "label": "MA: Essex"
        },
        {
            "value": "MA: Franklin",
            "label": "MA: Franklin"
        },
        {
            "value": "MA: Hampden",
            "label": "MA: Hampden"
        },
        {
            "value": "MA: Hampshire",
            "label": "MA: Hampshire"
        },
        {
            "value": "MA: Middlesex",
            "label": "MA: Middlesex"
        },
        {
            "value": "MA: Nantucket",
            "label": "MA: Nantucket"
        },
        {
            "value": "MA: Norfolk",
            "label": "MA: Norfolk"
        },
        {
            "value": "MA: Plymouth",
            "label": "MA: Plymouth"
        },
        {
            "value": "MA: Suffolk",
            "label": "MA: Suffolk"
        },
        {
            "value": "MA: Worcester",
            "label": "MA: Worcester"
        },
        {
            "value": "MD: Allegany",
            "label": "MD: Allegany"
        },
        {
            "value": "MD: Anne Arundel",
            "label": "MD: Anne Arundel"
        },
        {
            "value": "MD: Baltimore",
            "label": "MD: Baltimore"
        },
        {
            "value": "MD: Baltimore",
            "label": "MD: Baltimore"
        },
        {
            "value": "MD: Calvert",
            "label": "MD: Calvert"
        },
        {
            "value": "MD: Caroline",
            "label": "MD: Caroline"
        },
        {
            "value": "MD: Carroll",
            "label": "MD: Carroll"
        },
        {
            "value": "MD: Cecil",
            "label": "MD: Cecil"
        },
        {
            "value": "MD: Charles",
            "label": "MD: Charles"
        },
        {
            "value": "MD: Dorchester",
            "label": "MD: Dorchester"
        },
        {
            "value": "MD: Frederick",
            "label": "MD: Frederick"
        },
        {
            "value": "MD: Garrett",
            "label": "MD: Garrett"
        },
        {
            "value": "MD: Harford",
            "label": "MD: Harford"
        },
        {
            "value": "MD: Howard",
            "label": "MD: Howard"
        },
        {
            "value": "MD: Kent",
            "label": "MD: Kent"
        },
        {
            "value": "MD: Montgomery",
            "label": "MD: Montgomery"
        },
        {
            "value": "MD: Prince George's",
            "label": "MD: Prince George's"
        },
        {
            "value": "MD: Queen Anne's",
            "label": "MD: Queen Anne's"
        },
        {
            "value": "MD: Somerset",
            "label": "MD: Somerset"
        },
        {
            "value": "MD: St. Mary's",
            "label": "MD: St. Mary's"
        },
        {
            "value": "MD: Talbot",
            "label": "MD: Talbot"
        },
        {
            "value": "MD: Washington",
            "label": "MD: Washington"
        },
        {
            "value": "MD: Wicomico",
            "label": "MD: Wicomico"
        },
        {
            "value": "MD: Worcester",
            "label": "MD: Worcester"
        },
        {
            "value": "ME: Androscoggin",
            "label": "ME: Androscoggin"
        },
        {
            "value": "ME: Aroostook",
            "label": "ME: Aroostook"
        },
        {
            "value": "ME: Cumberland",
            "label": "ME: Cumberland"
        },
        {
            "value": "ME: Franklin",
            "label": "ME: Franklin"
        },
        {
            "value": "ME: Hancock",
            "label": "ME: Hancock"
        },
        {
            "value": "ME: Kennebec",
            "label": "ME: Kennebec"
        },
        {
            "value": "ME: Knox",
            "label": "ME: Knox"
        },
        {
            "value": "ME: Lincoln",
            "label": "ME: Lincoln"
        },
        {
            "value": "ME: Oxford",
            "label": "ME: Oxford"
        },
        {
            "value": "ME: Penobscot",
            "label": "ME: Penobscot"
        },
        {
            "value": "ME: Piscataquis",
            "label": "ME: Piscataquis"
        },
        {
            "value": "ME: Sagadahoc",
            "label": "ME: Sagadahoc"
        },
        {
            "value": "ME: Somerset",
            "label": "ME: Somerset"
        },
        {
            "value": "ME: Waldo",
            "label": "ME: Waldo"
        },
        {
            "value": "ME: Washington",
            "label": "ME: Washington"
        },
        {
            "value": "ME: York",
            "label": "ME: York"
        },
        {
            "value": "MI: Alcona",
            "label": "MI: Alcona"
        },
        {
            "value": "MI: Alger",
            "label": "MI: Alger"
        },
        {
            "value": "MI: Allegan",
            "label": "MI: Allegan"
        },
        {
            "value": "MI: Alpena",
            "label": "MI: Alpena"
        },
        {
            "value": "MI: Antrim",
            "label": "MI: Antrim"
        },
        {
            "value": "MI: Arenac",
            "label": "MI: Arenac"
        },
        {
            "value": "MI: Baraga",
            "label": "MI: Baraga"
        },
        {
            "value": "MI: Barry",
            "label": "MI: Barry"
        },
        {
            "value": "MI: Bay",
            "label": "MI: Bay"
        },
        {
            "value": "MI: Benzie",
            "label": "MI: Benzie"
        },
        {
            "value": "MI: Berrien",
            "label": "MI: Berrien"
        },
        {
            "value": "MI: Branch",
            "label": "MI: Branch"
        },
        {
            "value": "MI: Calhoun",
            "label": "MI: Calhoun"
        },
        {
            "value": "MI: Cass",
            "label": "MI: Cass"
        },
        {
            "value": "MI: Charlevoix",
            "label": "MI: Charlevoix"
        },
        {
            "value": "MI: Cheboygan",
            "label": "MI: Cheboygan"
        },
        {
            "value": "MI: Chippewa",
            "label": "MI: Chippewa"
        },
        {
            "value": "MI: Clare",
            "label": "MI: Clare"
        },
        {
            "value": "MI: Clinton",
            "label": "MI: Clinton"
        },
        {
            "value": "MI: Crawford",
            "label": "MI: Crawford"
        },
        {
            "value": "MI: Delta",
            "label": "MI: Delta"
        },
        {
            "value": "MI: Dickinson",
            "label": "MI: Dickinson"
        },
        {
            "value": "MI: Eaton",
            "label": "MI: Eaton"
        },
        {
            "value": "MI: Emmet",
            "label": "MI: Emmet"
        },
        {
            "value": "MI: Genesee",
            "label": "MI: Genesee"
        },
        {
            "value": "MI: Gladwin",
            "label": "MI: Gladwin"
        },
        {
            "value": "MI: Gogebic",
            "label": "MI: Gogebic"
        },
        {
            "value": "MI: Grand Traverse",
            "label": "MI: Grand Traverse"
        },
        {
            "value": "MI: Gratiot",
            "label": "MI: Gratiot"
        },
        {
            "value": "MI: Hillsdale",
            "label": "MI: Hillsdale"
        },
        {
            "value": "MI: Houghton",
            "label": "MI: Houghton"
        },
        {
            "value": "MI: Huron",
            "label": "MI: Huron"
        },
        {
            "value": "MI: Ingham",
            "label": "MI: Ingham"
        },
        {
            "value": "MI: Ionia",
            "label": "MI: Ionia"
        },
        {
            "value": "MI: Iosco",
            "label": "MI: Iosco"
        },
        {
            "value": "MI: Iron",
            "label": "MI: Iron"
        },
        {
            "value": "MI: Isabella",
            "label": "MI: Isabella"
        },
        {
            "value": "MI: Jackson",
            "label": "MI: Jackson"
        },
        {
            "value": "MI: Kalamazoo",
            "label": "MI: Kalamazoo"
        },
        {
            "value": "MI: Kalkaska",
            "label": "MI: Kalkaska"
        },
        {
            "value": "MI: Kent",
            "label": "MI: Kent"
        },
        {
            "value": "MI: Keweenaw",
            "label": "MI: Keweenaw"
        },
        {
            "value": "MI: Lake",
            "label": "MI: Lake"
        },
        {
            "value": "MI: Lapeer",
            "label": "MI: Lapeer"
        },
        {
            "value": "MI: Leelanau",
            "label": "MI: Leelanau"
        },
        {
            "value": "MI: Lenawee",
            "label": "MI: Lenawee"
        },
        {
            "value": "MI: Livingston",
            "label": "MI: Livingston"
        },
        {
            "value": "MI: Luce",
            "label": "MI: Luce"
        },
        {
            "value": "MI: Mackinac",
            "label": "MI: Mackinac"
        },
        {
            "value": "MI: Macomb",
            "label": "MI: Macomb"
        },
        {
            "value": "MI: Manistee",
            "label": "MI: Manistee"
        },
        {
            "value": "MI: Marquette",
            "label": "MI: Marquette"
        },
        {
            "value": "MI: Mason",
            "label": "MI: Mason"
        },
        {
            "value": "MI: Mecosta",
            "label": "MI: Mecosta"
        },
        {
            "value": "MI: Menominee",
            "label": "MI: Menominee"
        },
        {
            "value": "MI: Midland",
            "label": "MI: Midland"
        },
        {
            "value": "MI: Missaukee",
            "label": "MI: Missaukee"
        },
        {
            "value": "MI: Monroe",
            "label": "MI: Monroe"
        },
        {
            "value": "MI: Montcalm",
            "label": "MI: Montcalm"
        },
        {
            "value": "MI: Montmorency",
            "label": "MI: Montmorency"
        },
        {
            "value": "MI: Muskegon",
            "label": "MI: Muskegon"
        },
        {
            "value": "MI: Newaygo",
            "label": "MI: Newaygo"
        },
        {
            "value": "MI: Oakland",
            "label": "MI: Oakland"
        },
        {
            "value": "MI: Oceana",
            "label": "MI: Oceana"
        },
        {
            "value": "MI: Ogemaw",
            "label": "MI: Ogemaw"
        },
        {
            "value": "MI: Ontonagon",
            "label": "MI: Ontonagon"
        },
        {
            "value": "MI: Osceola",
            "label": "MI: Osceola"
        },
        {
            "value": "MI: Oscoda",
            "label": "MI: Oscoda"
        },
        {
            "value": "MI: Otsego",
            "label": "MI: Otsego"
        },
        {
            "value": "MI: Ottawa",
            "label": "MI: Ottawa"
        },
        {
            "value": "MI: Presque Isle",
            "label": "MI: Presque Isle"
        },
        {
            "value": "MI: Roscommon",
            "label": "MI: Roscommon"
        },
        {
            "value": "MI: Saginaw",
            "label": "MI: Saginaw"
        },
        {
            "value": "MI: Sanilac",
            "label": "MI: Sanilac"
        },
        {
            "value": "MI: Schoolcraft",
            "label": "MI: Schoolcraft"
        },
        {
            "value": "MI: Shiawassee",
            "label": "MI: Shiawassee"
        },
        {
            "value": "MI: St. Clair",
            "label": "MI: St. Clair"
        },
        {
            "value": "MI: St. Joseph",
            "label": "MI: St. Joseph"
        },
        {
            "value": "MI: Tuscola",
            "label": "MI: Tuscola"
        },
        {
            "value": "MI: Van Buren",
            "label": "MI: Van Buren"
        },
        {
            "value": "MI: Washtenaw",
            "label": "MI: Washtenaw"
        },
        {
            "value": "MI: Wayne",
            "label": "MI: Wayne"
        },
        {
            "value": "MI: Wexford",
            "label": "MI: Wexford"
        },
        {
            "value": "MN: Aitkin",
            "label": "MN: Aitkin"
        },
        {
            "value": "MN: Anoka",
            "label": "MN: Anoka"
        },
        {
            "value": "MN: Becker",
            "label": "MN: Becker"
        },
        {
            "value": "MN: Beltrami",
            "label": "MN: Beltrami"
        },
        {
            "value": "MN: Benton",
            "label": "MN: Benton"
        },
        {
            "value": "MN: Big Stone",
            "label": "MN: Big Stone"
        },
        {
            "value": "MN: Blue Earth",
            "label": "MN: Blue Earth"
        },
        {
            "value": "MN: Brown",
            "label": "MN: Brown"
        },
        {
            "value": "MN: Carlton",
            "label": "MN: Carlton"
        },
        {
            "value": "MN: Carver",
            "label": "MN: Carver"
        },
        {
            "value": "MN: Cass",
            "label": "MN: Cass"
        },
        {
            "value": "MN: Chippewa",
            "label": "MN: Chippewa"
        },
        {
            "value": "MN: Chisago",
            "label": "MN: Chisago"
        },
        {
            "value": "MN: Clay",
            "label": "MN: Clay"
        },
        {
            "value": "MN: Clearwater",
            "label": "MN: Clearwater"
        },
        {
            "value": "MN: Cook",
            "label": "MN: Cook"
        },
        {
            "value": "MN: Cottonwood",
            "label": "MN: Cottonwood"
        },
        {
            "value": "MN: Crow Wing",
            "label": "MN: Crow Wing"
        },
        {
            "value": "MN: Dakota",
            "label": "MN: Dakota"
        },
        {
            "value": "MN: Dodge",
            "label": "MN: Dodge"
        },
        {
            "value": "MN: Douglas",
            "label": "MN: Douglas"
        },
        {
            "value": "MN: Faribault",
            "label": "MN: Faribault"
        },
        {
            "value": "MN: Fillmore",
            "label": "MN: Fillmore"
        },
        {
            "value": "MN: Freeborn",
            "label": "MN: Freeborn"
        },
        {
            "value": "MN: Goodhue",
            "label": "MN: Goodhue"
        },
        {
            "value": "MN: Grant",
            "label": "MN: Grant"
        },
        {
            "value": "MN: Hennepin",
            "label": "MN: Hennepin"
        },
        {
            "value": "MN: Houston",
            "label": "MN: Houston"
        },
        {
            "value": "MN: Hubbard",
            "label": "MN: Hubbard"
        },
        {
            "value": "MN: Isanti",
            "label": "MN: Isanti"
        },
        {
            "value": "MN: Itasca",
            "label": "MN: Itasca"
        },
        {
            "value": "MN: Jackson",
            "label": "MN: Jackson"
        },
        {
            "value": "MN: Kanabec",
            "label": "MN: Kanabec"
        },
        {
            "value": "MN: Kandiyohi",
            "label": "MN: Kandiyohi"
        },
        {
            "value": "MN: Kittson",
            "label": "MN: Kittson"
        },
        {
            "value": "MN: Koochiching",
            "label": "MN: Koochiching"
        },
        {
            "value": "MN: Lac qui Parle",
            "label": "MN: Lac qui Parle"
        },
        {
            "value": "MN: Lake",
            "label": "MN: Lake"
        },
        {
            "value": "MN: Lake of the Woods",
            "label": "MN: Lake of the Woods"
        },
        {
            "value": "MN: Le Sueur",
            "label": "MN: Le Sueur"
        },
        {
            "value": "MN: Lincoln",
            "label": "MN: Lincoln"
        },
        {
            "value": "MN: Lyon",
            "label": "MN: Lyon"
        },
        {
            "value": "MN: Mahnomen",
            "label": "MN: Mahnomen"
        },
        {
            "value": "MN: Marshall",
            "label": "MN: Marshall"
        },
        {
            "value": "MN: Martin",
            "label": "MN: Martin"
        },
        {
            "value": "MN: McLeod",
            "label": "MN: McLeod"
        },
        {
            "value": "MN: Meeker",
            "label": "MN: Meeker"
        },
        {
            "value": "MN: Mille Lacs",
            "label": "MN: Mille Lacs"
        },
        {
            "value": "MN: Morrison",
            "label": "MN: Morrison"
        },
        {
            "value": "MN: Mower",
            "label": "MN: Mower"
        },
        {
            "value": "MN: Murray",
            "label": "MN: Murray"
        },
        {
            "value": "MN: Nicollet",
            "label": "MN: Nicollet"
        },
        {
            "value": "MN: Nobles",
            "label": "MN: Nobles"
        },
        {
            "value": "MN: Norman",
            "label": "MN: Norman"
        },
        {
            "value": "MN: Olmsted",
            "label": "MN: Olmsted"
        },
        {
            "value": "MN: Otter Tail",
            "label": "MN: Otter Tail"
        },
        {
            "value": "MN: Pennington",
            "label": "MN: Pennington"
        },
        {
            "value": "MN: Pine",
            "label": "MN: Pine"
        },
        {
            "value": "MN: Pipestone",
            "label": "MN: Pipestone"
        },
        {
            "value": "MN: Polk",
            "label": "MN: Polk"
        },
        {
            "value": "MN: Pope",
            "label": "MN: Pope"
        },
        {
            "value": "MN: Ramsey",
            "label": "MN: Ramsey"
        },
        {
            "value": "MN: Red Lake",
            "label": "MN: Red Lake"
        },
        {
            "value": "MN: Redwood",
            "label": "MN: Redwood"
        },
        {
            "value": "MN: Renville",
            "label": "MN: Renville"
        },
        {
            "value": "MN: Rice",
            "label": "MN: Rice"
        },
        {
            "value": "MN: Rock",
            "label": "MN: Rock"
        },
        {
            "value": "MN: Roseau",
            "label": "MN: Roseau"
        },
        {
            "value": "MN: Scott",
            "label": "MN: Scott"
        },
        {
            "value": "MN: Sherburne",
            "label": "MN: Sherburne"
        },
        {
            "value": "MN: Sibley",
            "label": "MN: Sibley"
        },
        {
            "value": "MN: St. Louis",
            "label": "MN: St. Louis"
        },
        {
            "value": "MN: Stearns",
            "label": "MN: Stearns"
        },
        {
            "value": "MN: Steele",
            "label": "MN: Steele"
        },
        {
            "value": "MN: Stevens",
            "label": "MN: Stevens"
        },
        {
            "value": "MN: Swift",
            "label": "MN: Swift"
        },
        {
            "value": "MN: Todd",
            "label": "MN: Todd"
        },
        {
            "value": "MN: Traverse",
            "label": "MN: Traverse"
        },
        {
            "value": "MN: Wabasha",
            "label": "MN: Wabasha"
        },
        {
            "value": "MN: Wadena",
            "label": "MN: Wadena"
        },
        {
            "value": "MN: Waseca",
            "label": "MN: Waseca"
        },
        {
            "value": "MN: Washington",
            "label": "MN: Washington"
        },
        {
            "value": "MN: Watonwan",
            "label": "MN: Watonwan"
        },
        {
            "value": "MN: Wilkin",
            "label": "MN: Wilkin"
        },
        {
            "value": "MN: Winona",
            "label": "MN: Winona"
        },
        {
            "value": "MN: Wright",
            "label": "MN: Wright"
        },
        {
            "value": "MN: Yellow Medicine",
            "label": "MN: Yellow Medicine"
        },
        {
            "value": "MO: Adair",
            "label": "MO: Adair"
        },
        {
            "value": "MO: Andrew",
            "label": "MO: Andrew"
        },
        {
            "value": "MO: Atchison",
            "label": "MO: Atchison"
        },
        {
            "value": "MO: Audrain",
            "label": "MO: Audrain"
        },
        {
            "value": "MO: Barry",
            "label": "MO: Barry"
        },
        {
            "value": "MO: Barton",
            "label": "MO: Barton"
        },
        {
            "value": "MO: Bates",
            "label": "MO: Bates"
        },
        {
            "value": "MO: Benton",
            "label": "MO: Benton"
        },
        {
            "value": "MO: Bollinger",
            "label": "MO: Bollinger"
        },
        {
            "value": "MO: Boone",
            "label": "MO: Boone"
        },
        {
            "value": "MO: Buchanan",
            "label": "MO: Buchanan"
        },
        {
            "value": "MO: Butler",
            "label": "MO: Butler"
        },
        {
            "value": "MO: Caldwell",
            "label": "MO: Caldwell"
        },
        {
            "value": "MO: Callaway",
            "label": "MO: Callaway"
        },
        {
            "value": "MO: Camden",
            "label": "MO: Camden"
        },
        {
            "value": "MO: Cape Girardeau",
            "label": "MO: Cape Girardeau"
        },
        {
            "value": "MO: Carroll",
            "label": "MO: Carroll"
        },
        {
            "value": "MO: Carter",
            "label": "MO: Carter"
        },
        {
            "value": "MO: Cass",
            "label": "MO: Cass"
        },
        {
            "value": "MO: Cedar",
            "label": "MO: Cedar"
        },
        {
            "value": "MO: Chariton",
            "label": "MO: Chariton"
        },
        {
            "value": "MO: Christian",
            "label": "MO: Christian"
        },
        {
            "value": "MO: Clark",
            "label": "MO: Clark"
        },
        {
            "value": "MO: Clay",
            "label": "MO: Clay"
        },
        {
            "value": "MO: Clinton",
            "label": "MO: Clinton"
        },
        {
            "value": "MO: Cole",
            "label": "MO: Cole"
        },
        {
            "value": "MO: Cooper",
            "label": "MO: Cooper"
        },
        {
            "value": "MO: Crawford",
            "label": "MO: Crawford"
        },
        {
            "value": "MO: Dade",
            "label": "MO: Dade"
        },
        {
            "value": "MO: Dallas",
            "label": "MO: Dallas"
        },
        {
            "value": "MO: Daviess",
            "label": "MO: Daviess"
        },
        {
            "value": "MO: DeKalb",
            "label": "MO: DeKalb"
        },
        {
            "value": "MO: Dent",
            "label": "MO: Dent"
        },
        {
            "value": "MO: Douglas",
            "label": "MO: Douglas"
        },
        {
            "value": "MO: Dunklin",
            "label": "MO: Dunklin"
        },
        {
            "value": "MO: Franklin",
            "label": "MO: Franklin"
        },
        {
            "value": "MO: Gasconade",
            "label": "MO: Gasconade"
        },
        {
            "value": "MO: Gentry",
            "label": "MO: Gentry"
        },
        {
            "value": "MO: Greene",
            "label": "MO: Greene"
        },
        {
            "value": "MO: Grundy",
            "label": "MO: Grundy"
        },
        {
            "value": "MO: Harrison",
            "label": "MO: Harrison"
        },
        {
            "value": "MO: Henry",
            "label": "MO: Henry"
        },
        {
            "value": "MO: Hickory",
            "label": "MO: Hickory"
        },
        {
            "value": "MO: Holt",
            "label": "MO: Holt"
        },
        {
            "value": "MO: Howard",
            "label": "MO: Howard"
        },
        {
            "value": "MO: Howell",
            "label": "MO: Howell"
        },
        {
            "value": "MO: Iron",
            "label": "MO: Iron"
        },
        {
            "value": "MO: Jackson",
            "label": "MO: Jackson"
        },
        {
            "value": "MO: Jasper",
            "label": "MO: Jasper"
        },
        {
            "value": "MO: Jefferson",
            "label": "MO: Jefferson"
        },
        {
            "value": "MO: Johnson",
            "label": "MO: Johnson"
        },
        {
            "value": "MO: Knox",
            "label": "MO: Knox"
        },
        {
            "value": "MO: Laclede",
            "label": "MO: Laclede"
        },
        {
            "value": "MO: Lafayette",
            "label": "MO: Lafayette"
        },
        {
            "value": "MO: Lawrence",
            "label": "MO: Lawrence"
        },
        {
            "value": "MO: Lewis",
            "label": "MO: Lewis"
        },
        {
            "value": "MO: Lincoln",
            "label": "MO: Lincoln"
        },
        {
            "value": "MO: Linn",
            "label": "MO: Linn"
        },
        {
            "value": "MO: Livingston",
            "label": "MO: Livingston"
        },
        {
            "value": "MO: Macon",
            "label": "MO: Macon"
        },
        {
            "value": "MO: Madison",
            "label": "MO: Madison"
        },
        {
            "value": "MO: Maries",
            "label": "MO: Maries"
        },
        {
            "value": "MO: Marion",
            "label": "MO: Marion"
        },
        {
            "value": "MO: McDonald",
            "label": "MO: McDonald"
        },
        {
            "value": "MO: Mercer",
            "label": "MO: Mercer"
        },
        {
            "value": "MO: Miller",
            "label": "MO: Miller"
        },
        {
            "value": "MO: Mississippi",
            "label": "MO: Mississippi"
        },
        {
            "value": "MO: Moniteau",
            "label": "MO: Moniteau"
        },
        {
            "value": "MO: Monroe",
            "label": "MO: Monroe"
        },
        {
            "value": "MO: Montgomery",
            "label": "MO: Montgomery"
        },
        {
            "value": "MO: Morgan",
            "label": "MO: Morgan"
        },
        {
            "value": "MO: New Madrid",
            "label": "MO: New Madrid"
        },
        {
            "value": "MO: Newton",
            "label": "MO: Newton"
        },
        {
            "value": "MO: Nodaway",
            "label": "MO: Nodaway"
        },
        {
            "value": "MO: Oregon",
            "label": "MO: Oregon"
        },
        {
            "value": "MO: Osage",
            "label": "MO: Osage"
        },
        {
            "value": "MO: Ozark",
            "label": "MO: Ozark"
        },
        {
            "value": "MO: Pemiscot",
            "label": "MO: Pemiscot"
        },
        {
            "value": "MO: Perry",
            "label": "MO: Perry"
        },
        {
            "value": "MO: Pettis",
            "label": "MO: Pettis"
        },
        {
            "value": "MO: Phelps",
            "label": "MO: Phelps"
        },
        {
            "value": "MO: Pike",
            "label": "MO: Pike"
        },
        {
            "value": "MO: Platte",
            "label": "MO: Platte"
        },
        {
            "value": "MO: Polk",
            "label": "MO: Polk"
        },
        {
            "value": "MO: Pulaski",
            "label": "MO: Pulaski"
        },
        {
            "value": "MO: Putnam",
            "label": "MO: Putnam"
        },
        {
            "value": "MO: Ralls",
            "label": "MO: Ralls"
        },
        {
            "value": "MO: Randolph",
            "label": "MO: Randolph"
        },
        {
            "value": "MO: Ray",
            "label": "MO: Ray"
        },
        {
            "value": "MO: Reynolds",
            "label": "MO: Reynolds"
        },
        {
            "value": "MO: Ripley",
            "label": "MO: Ripley"
        },
        {
            "value": "MO: Saline",
            "label": "MO: Saline"
        },
        {
            "value": "MO: Schuyler",
            "label": "MO: Schuyler"
        },
        {
            "value": "MO: Scotland",
            "label": "MO: Scotland"
        },
        {
            "value": "MO: Scott",
            "label": "MO: Scott"
        },
        {
            "value": "MO: Shannon",
            "label": "MO: Shannon"
        },
        {
            "value": "MO: Shelby",
            "label": "MO: Shelby"
        },
        {
            "value": "MO: St. Charles",
            "label": "MO: St. Charles"
        },
        {
            "value": "MO: St. Clair",
            "label": "MO: St. Clair"
        },
        {
            "value": "MO: St. Francois",
            "label": "MO: St. Francois"
        },
        {
            "value": "MO: St. Louis",
            "label": "MO: St. Louis"
        },
        {
            "value": "MO: St. Louis",
            "label": "MO: St. Louis"
        },
        {
            "value": "MO: Ste. Genevieve",
            "label": "MO: Ste. Genevieve"
        },
        {
            "value": "MO: Stoddard",
            "label": "MO: Stoddard"
        },
        {
            "value": "MO: Stone",
            "label": "MO: Stone"
        },
        {
            "value": "MO: Sullivan",
            "label": "MO: Sullivan"
        },
        {
            "value": "MO: Taney",
            "label": "MO: Taney"
        },
        {
            "value": "MO: Texas",
            "label": "MO: Texas"
        },
        {
            "value": "MO: Vernon",
            "label": "MO: Vernon"
        },
        {
            "value": "MO: Warren",
            "label": "MO: Warren"
        },
        {
            "value": "MO: Washington",
            "label": "MO: Washington"
        },
        {
            "value": "MO: Wayne",
            "label": "MO: Wayne"
        },
        {
            "value": "MO: Webster",
            "label": "MO: Webster"
        },
        {
            "value": "MO: Worth",
            "label": "MO: Worth"
        },
        {
            "value": "MO: Wright",
            "label": "MO: Wright"
        },
        {
            "value": "MS: Adams",
            "label": "MS: Adams"
        },
        {
            "value": "MS: Alcorn",
            "label": "MS: Alcorn"
        },
        {
            "value": "MS: Amite",
            "label": "MS: Amite"
        },
        {
            "value": "MS: Attala",
            "label": "MS: Attala"
        },
        {
            "value": "MS: Benton",
            "label": "MS: Benton"
        },
        {
            "value": "MS: Bolivar",
            "label": "MS: Bolivar"
        },
        {
            "value": "MS: Calhoun",
            "label": "MS: Calhoun"
        },
        {
            "value": "MS: Carroll",
            "label": "MS: Carroll"
        },
        {
            "value": "MS: Chickasaw",
            "label": "MS: Chickasaw"
        },
        {
            "value": "MS: Choctaw",
            "label": "MS: Choctaw"
        },
        {
            "value": "MS: Claiborne",
            "label": "MS: Claiborne"
        },
        {
            "value": "MS: Clarke",
            "label": "MS: Clarke"
        },
        {
            "value": "MS: Clay",
            "label": "MS: Clay"
        },
        {
            "value": "MS: Coahoma",
            "label": "MS: Coahoma"
        },
        {
            "value": "MS: Copiah",
            "label": "MS: Copiah"
        },
        {
            "value": "MS: Covington",
            "label": "MS: Covington"
        },
        {
            "value": "MS: DeSoto",
            "label": "MS: DeSoto"
        },
        {
            "value": "MS: Forrest",
            "label": "MS: Forrest"
        },
        {
            "value": "MS: Franklin",
            "label": "MS: Franklin"
        },
        {
            "value": "MS: George",
            "label": "MS: George"
        },
        {
            "value": "MS: Greene",
            "label": "MS: Greene"
        },
        {
            "value": "MS: Grenada",
            "label": "MS: Grenada"
        },
        {
            "value": "MS: Hancock",
            "label": "MS: Hancock"
        },
        {
            "value": "MS: Harrison",
            "label": "MS: Harrison"
        },
        {
            "value": "MS: Hinds",
            "label": "MS: Hinds"
        },
        {
            "value": "MS: Holmes",
            "label": "MS: Holmes"
        },
        {
            "value": "MS: Humphreys",
            "label": "MS: Humphreys"
        },
        {
            "value": "MS: Issaquena",
            "label": "MS: Issaquena"
        },
        {
            "value": "MS: Itawamba",
            "label": "MS: Itawamba"
        },
        {
            "value": "MS: Jackson",
            "label": "MS: Jackson"
        },
        {
            "value": "MS: Jasper",
            "label": "MS: Jasper"
        },
        {
            "value": "MS: Jefferson",
            "label": "MS: Jefferson"
        },
        {
            "value": "MS: Jefferson Davis",
            "label": "MS: Jefferson Davis"
        },
        {
            "value": "MS: Jones",
            "label": "MS: Jones"
        },
        {
            "value": "MS: Kemper",
            "label": "MS: Kemper"
        },
        {
            "value": "MS: Lafayette",
            "label": "MS: Lafayette"
        },
        {
            "value": "MS: Lamar",
            "label": "MS: Lamar"
        },
        {
            "value": "MS: Lauderdale",
            "label": "MS: Lauderdale"
        },
        {
            "value": "MS: Lawrence",
            "label": "MS: Lawrence"
        },
        {
            "value": "MS: Leake",
            "label": "MS: Leake"
        },
        {
            "value": "MS: Lee",
            "label": "MS: Lee"
        },
        {
            "value": "MS: Leflore",
            "label": "MS: Leflore"
        },
        {
            "value": "MS: Lincoln",
            "label": "MS: Lincoln"
        },
        {
            "value": "MS: Lowndes",
            "label": "MS: Lowndes"
        },
        {
            "value": "MS: Madison",
            "label": "MS: Madison"
        },
        {
            "value": "MS: Marion",
            "label": "MS: Marion"
        },
        {
            "value": "MS: Marshall",
            "label": "MS: Marshall"
        },
        {
            "value": "MS: Monroe",
            "label": "MS: Monroe"
        },
        {
            "value": "MS: Montgomery",
            "label": "MS: Montgomery"
        },
        {
            "value": "MS: Neshoba",
            "label": "MS: Neshoba"
        },
        {
            "value": "MS: Newton",
            "label": "MS: Newton"
        },
        {
            "value": "MS: Noxubee",
            "label": "MS: Noxubee"
        },
        {
            "value": "MS: Oktibbeha",
            "label": "MS: Oktibbeha"
        },
        {
            "value": "MS: Panola",
            "label": "MS: Panola"
        },
        {
            "value": "MS: Pearl River",
            "label": "MS: Pearl River"
        },
        {
            "value": "MS: Perry",
            "label": "MS: Perry"
        },
        {
            "value": "MS: Pike",
            "label": "MS: Pike"
        },
        {
            "value": "MS: Pontotoc",
            "label": "MS: Pontotoc"
        },
        {
            "value": "MS: Prentiss",
            "label": "MS: Prentiss"
        },
        {
            "value": "MS: Quitman",
            "label": "MS: Quitman"
        },
        {
            "value": "MS: Rankin",
            "label": "MS: Rankin"
        },
        {
            "value": "MS: Scott",
            "label": "MS: Scott"
        },
        {
            "value": "MS: Sharkey",
            "label": "MS: Sharkey"
        },
        {
            "value": "MS: Simpson",
            "label": "MS: Simpson"
        },
        {
            "value": "MS: Smith",
            "label": "MS: Smith"
        },
        {
            "value": "MS: Stone",
            "label": "MS: Stone"
        },
        {
            "value": "MS: Sunflower",
            "label": "MS: Sunflower"
        },
        {
            "value": "MS: Tallahatchie",
            "label": "MS: Tallahatchie"
        },
        {
            "value": "MS: Tate",
            "label": "MS: Tate"
        },
        {
            "value": "MS: Tippah",
            "label": "MS: Tippah"
        },
        {
            "value": "MS: Tishomingo",
            "label": "MS: Tishomingo"
        },
        {
            "value": "MS: Tunica",
            "label": "MS: Tunica"
        },
        {
            "value": "MS: Union",
            "label": "MS: Union"
        },
        {
            "value": "MS: Walthall",
            "label": "MS: Walthall"
        },
        {
            "value": "MS: Warren",
            "label": "MS: Warren"
        },
        {
            "value": "MS: Washington",
            "label": "MS: Washington"
        },
        {
            "value": "MS: Wayne",
            "label": "MS: Wayne"
        },
        {
            "value": "MS: Webster",
            "label": "MS: Webster"
        },
        {
            "value": "MS: Wilkinson",
            "label": "MS: Wilkinson"
        },
        {
            "value": "MS: Winston",
            "label": "MS: Winston"
        },
        {
            "value": "MS: Yalobusha",
            "label": "MS: Yalobusha"
        },
        {
            "value": "MS: Yazoo",
            "label": "MS: Yazoo"
        },
        {
            "value": "MT: Beaverhead",
            "label": "MT: Beaverhead"
        },
        {
            "value": "MT: Big Horn",
            "label": "MT: Big Horn"
        },
        {
            "value": "MT: Blaine",
            "label": "MT: Blaine"
        },
        {
            "value": "MT: Broadwater",
            "label": "MT: Broadwater"
        },
        {
            "value": "MT: Carbon",
            "label": "MT: Carbon"
        },
        {
            "value": "MT: Carter",
            "label": "MT: Carter"
        },
        {
            "value": "MT: Cascade",
            "label": "MT: Cascade"
        },
        {
            "value": "MT: Chouteau",
            "label": "MT: Chouteau"
        },
        {
            "value": "MT: Custer",
            "label": "MT: Custer"
        },
        {
            "value": "MT: Daniels",
            "label": "MT: Daniels"
        },
        {
            "value": "MT: Dawson",
            "label": "MT: Dawson"
        },
        {
            "value": "MT: Deer Lodge",
            "label": "MT: Deer Lodge"
        },
        {
            "value": "MT: Fallon",
            "label": "MT: Fallon"
        },
        {
            "value": "MT: Fergus",
            "label": "MT: Fergus"
        },
        {
            "value": "MT: Flathead",
            "label": "MT: Flathead"
        },
        {
            "value": "MT: Gallatin",
            "label": "MT: Gallatin"
        },
        {
            "value": "MT: Garfield",
            "label": "MT: Garfield"
        },
        {
            "value": "MT: Glacier",
            "label": "MT: Glacier"
        },
        {
            "value": "MT: Golden Valley",
            "label": "MT: Golden Valley"
        },
        {
            "value": "MT: Granite",
            "label": "MT: Granite"
        },
        {
            "value": "MT: Hill",
            "label": "MT: Hill"
        },
        {
            "value": "MT: Jefferson",
            "label": "MT: Jefferson"
        },
        {
            "value": "MT: Judith Basin",
            "label": "MT: Judith Basin"
        },
        {
            "value": "MT: Lake",
            "label": "MT: Lake"
        },
        {
            "value": "MT: Lewis and Clark",
            "label": "MT: Lewis and Clark"
        },
        {
            "value": "MT: Liberty",
            "label": "MT: Liberty"
        },
        {
            "value": "MT: Lincoln",
            "label": "MT: Lincoln"
        },
        {
            "value": "MT: Madison",
            "label": "MT: Madison"
        },
        {
            "value": "MT: McCone",
            "label": "MT: McCone"
        },
        {
            "value": "MT: Meagher",
            "label": "MT: Meagher"
        },
        {
            "value": "MT: Mineral",
            "label": "MT: Mineral"
        },
        {
            "value": "MT: Missoula",
            "label": "MT: Missoula"
        },
        {
            "value": "MT: Musselshell",
            "label": "MT: Musselshell"
        },
        {
            "value": "MT: Park",
            "label": "MT: Park"
        },
        {
            "value": "MT: Petroleum",
            "label": "MT: Petroleum"
        },
        {
            "value": "MT: Phillips",
            "label": "MT: Phillips"
        },
        {
            "value": "MT: Pondera",
            "label": "MT: Pondera"
        },
        {
            "value": "MT: Powder River",
            "label": "MT: Powder River"
        },
        {
            "value": "MT: Powell",
            "label": "MT: Powell"
        },
        {
            "value": "MT: Prairie",
            "label": "MT: Prairie"
        },
        {
            "value": "MT: Ravalli",
            "label": "MT: Ravalli"
        },
        {
            "value": "MT: Richland",
            "label": "MT: Richland"
        },
        {
            "value": "MT: Roosevelt",
            "label": "MT: Roosevelt"
        },
        {
            "value": "MT: Rosebud",
            "label": "MT: Rosebud"
        },
        {
            "value": "MT: Sanders",
            "label": "MT: Sanders"
        },
        {
            "value": "MT: Sheridan",
            "label": "MT: Sheridan"
        },
        {
            "value": "MT: Silver Bow",
            "label": "MT: Silver Bow"
        },
        {
            "value": "MT: Stillwater",
            "label": "MT: Stillwater"
        },
        {
            "value": "MT: Sweet Grass",
            "label": "MT: Sweet Grass"
        },
        {
            "value": "MT: Teton",
            "label": "MT: Teton"
        },
        {
            "value": "MT: Toole",
            "label": "MT: Toole"
        },
        {
            "value": "MT: Treasure",
            "label": "MT: Treasure"
        },
        {
            "value": "MT: Valley",
            "label": "MT: Valley"
        },
        {
            "value": "MT: Wheatland",
            "label": "MT: Wheatland"
        },
        {
            "value": "MT: Wibaux",
            "label": "MT: Wibaux"
        },
        {
            "value": "MT: Yellowstone",
            "label": "MT: Yellowstone"
        },
        {
            "value": "NC: Alamance",
            "label": "NC: Alamance"
        },
        {
            "value": "NC: Alexander",
            "label": "NC: Alexander"
        },
        {
            "value": "NC: Alleghany",
            "label": "NC: Alleghany"
        },
        {
            "value": "NC: Anson",
            "label": "NC: Anson"
        },
        {
            "value": "NC: Ashe",
            "label": "NC: Ashe"
        },
        {
            "value": "NC: Avery",
            "label": "NC: Avery"
        },
        {
            "value": "NC: Beaufort",
            "label": "NC: Beaufort"
        },
        {
            "value": "NC: Bertie",
            "label": "NC: Bertie"
        },
        {
            "value": "NC: Bladen",
            "label": "NC: Bladen"
        },
        {
            "value": "NC: Brunswick",
            "label": "NC: Brunswick"
        },
        {
            "value": "NC: Buncombe",
            "label": "NC: Buncombe"
        },
        {
            "value": "NC: Burke",
            "label": "NC: Burke"
        },
        {
            "value": "NC: Cabarrus",
            "label": "NC: Cabarrus"
        },
        {
            "value": "NC: Caldwell",
            "label": "NC: Caldwell"
        },
        {
            "value": "NC: Camden",
            "label": "NC: Camden"
        },
        {
            "value": "NC: Carteret",
            "label": "NC: Carteret"
        },
        {
            "value": "NC: Caswell",
            "label": "NC: Caswell"
        },
        {
            "value": "NC: Catawba",
            "label": "NC: Catawba"
        },
        {
            "value": "NC: Chatham",
            "label": "NC: Chatham"
        },
        {
            "value": "NC: Cherokee",
            "label": "NC: Cherokee"
        },
        {
            "value": "NC: Chowan",
            "label": "NC: Chowan"
        },
        {
            "value": "NC: Clay",
            "label": "NC: Clay"
        },
        {
            "value": "NC: Cleveland",
            "label": "NC: Cleveland"
        },
        {
            "value": "NC: Columbus",
            "label": "NC: Columbus"
        },
        {
            "value": "NC: Craven",
            "label": "NC: Craven"
        },
        {
            "value": "NC: Cumberland",
            "label": "NC: Cumberland"
        },
        {
            "value": "NC: Currituck",
            "label": "NC: Currituck"
        },
        {
            "value": "NC: Dare",
            "label": "NC: Dare"
        },
        {
            "value": "NC: Davidson",
            "label": "NC: Davidson"
        },
        {
            "value": "NC: Davie",
            "label": "NC: Davie"
        },
        {
            "value": "NC: Duplin",
            "label": "NC: Duplin"
        },
        {
            "value": "NC: Durham",
            "label": "NC: Durham"
        },
        {
            "value": "NC: Edgecombe",
            "label": "NC: Edgecombe"
        },
        {
            "value": "NC: Forsyth",
            "label": "NC: Forsyth"
        },
        {
            "value": "NC: Franklin",
            "label": "NC: Franklin"
        },
        {
            "value": "NC: Gaston",
            "label": "NC: Gaston"
        },
        {
            "value": "NC: Gates",
            "label": "NC: Gates"
        },
        {
            "value": "NC: Graham",
            "label": "NC: Graham"
        },
        {
            "value": "NC: Granville",
            "label": "NC: Granville"
        },
        {
            "value": "NC: Greene",
            "label": "NC: Greene"
        },
        {
            "value": "NC: Guilford",
            "label": "NC: Guilford"
        },
        {
            "value": "NC: Halifax",
            "label": "NC: Halifax"
        },
        {
            "value": "NC: Harnett",
            "label": "NC: Harnett"
        },
        {
            "value": "NC: Haywood",
            "label": "NC: Haywood"
        },
        {
            "value": "NC: Henderson",
            "label": "NC: Henderson"
        },
        {
            "value": "NC: Hertford",
            "label": "NC: Hertford"
        },
        {
            "value": "NC: Hoke",
            "label": "NC: Hoke"
        },
        {
            "value": "NC: Hyde",
            "label": "NC: Hyde"
        },
        {
            "value": "NC: Iredell",
            "label": "NC: Iredell"
        },
        {
            "value": "NC: Jackson",
            "label": "NC: Jackson"
        },
        {
            "value": "NC: Johnston",
            "label": "NC: Johnston"
        },
        {
            "value": "NC: Jones",
            "label": "NC: Jones"
        },
        {
            "value": "NC: Lee",
            "label": "NC: Lee"
        },
        {
            "value": "NC: Lenoir",
            "label": "NC: Lenoir"
        },
        {
            "value": "NC: Lincoln",
            "label": "NC: Lincoln"
        },
        {
            "value": "NC: Macon",
            "label": "NC: Macon"
        },
        {
            "value": "NC: Madison",
            "label": "NC: Madison"
        },
        {
            "value": "NC: Martin",
            "label": "NC: Martin"
        },
        {
            "value": "NC: McDowell",
            "label": "NC: McDowell"
        },
        {
            "value": "NC: Mecklenburg",
            "label": "NC: Mecklenburg"
        },
        {
            "value": "NC: Mitchell",
            "label": "NC: Mitchell"
        },
        {
            "value": "NC: Montgomery",
            "label": "NC: Montgomery"
        },
        {
            "value": "NC: Moore",
            "label": "NC: Moore"
        },
        {
            "value": "NC: Nash",
            "label": "NC: Nash"
        },
        {
            "value": "NC: New Hanover",
            "label": "NC: New Hanover"
        },
        {
            "value": "NC: Northampton",
            "label": "NC: Northampton"
        },
        {
            "value": "NC: Onslow",
            "label": "NC: Onslow"
        },
        {
            "value": "NC: Orange",
            "label": "NC: Orange"
        },
        {
            "value": "NC: Pamlico",
            "label": "NC: Pamlico"
        },
        {
            "value": "NC: Pasquotank",
            "label": "NC: Pasquotank"
        },
        {
            "value": "NC: Pender",
            "label": "NC: Pender"
        },
        {
            "value": "NC: Perquimans",
            "label": "NC: Perquimans"
        },
        {
            "value": "NC: Person",
            "label": "NC: Person"
        },
        {
            "value": "NC: Pitt",
            "label": "NC: Pitt"
        },
        {
            "value": "NC: Polk",
            "label": "NC: Polk"
        },
        {
            "value": "NC: Randolph",
            "label": "NC: Randolph"
        },
        {
            "value": "NC: Richmond",
            "label": "NC: Richmond"
        },
        {
            "value": "NC: Robeson",
            "label": "NC: Robeson"
        },
        {
            "value": "NC: Rockingham",
            "label": "NC: Rockingham"
        },
        {
            "value": "NC: Rowan",
            "label": "NC: Rowan"
        },
        {
            "value": "NC: Rutherford",
            "label": "NC: Rutherford"
        },
        {
            "value": "NC: Sampson",
            "label": "NC: Sampson"
        },
        {
            "value": "NC: Scotland",
            "label": "NC: Scotland"
        },
        {
            "value": "NC: Stanly",
            "label": "NC: Stanly"
        },
        {
            "value": "NC: Stokes",
            "label": "NC: Stokes"
        },
        {
            "value": "NC: Surry",
            "label": "NC: Surry"
        },
        {
            "value": "NC: Swain",
            "label": "NC: Swain"
        },
        {
            "value": "NC: Transylvania",
            "label": "NC: Transylvania"
        },
        {
            "value": "NC: Tyrrell",
            "label": "NC: Tyrrell"
        },
        {
            "value": "NC: Union",
            "label": "NC: Union"
        },
        {
            "value": "NC: Vance",
            "label": "NC: Vance"
        },
        {
            "value": "NC: Wake",
            "label": "NC: Wake"
        },
        {
            "value": "NC: Warren",
            "label": "NC: Warren"
        },
        {
            "value": "NC: Washington",
            "label": "NC: Washington"
        },
        {
            "value": "NC: Watauga",
            "label": "NC: Watauga"
        },
        {
            "value": "NC: Wayne",
            "label": "NC: Wayne"
        },
        {
            "value": "NC: Wilkes",
            "label": "NC: Wilkes"
        },
        {
            "value": "NC: Wilson",
            "label": "NC: Wilson"
        },
        {
            "value": "NC: Yadkin",
            "label": "NC: Yadkin"
        },
        {
            "value": "NC: Yancey",
            "label": "NC: Yancey"
        },
        {
            "value": "ND: Adams",
            "label": "ND: Adams"
        },
        {
            "value": "ND: Barnes",
            "label": "ND: Barnes"
        },
        {
            "value": "ND: Benson",
            "label": "ND: Benson"
        },
        {
            "value": "ND: Billings",
            "label": "ND: Billings"
        },
        {
            "value": "ND: Bottineau",
            "label": "ND: Bottineau"
        },
        {
            "value": "ND: Bowman",
            "label": "ND: Bowman"
        },
        {
            "value": "ND: Burke",
            "label": "ND: Burke"
        },
        {
            "value": "ND: Burleigh",
            "label": "ND: Burleigh"
        },
        {
            "value": "ND: Cass",
            "label": "ND: Cass"
        },
        {
            "value": "ND: Cavalier",
            "label": "ND: Cavalier"
        },
        {
            "value": "ND: Dickey",
            "label": "ND: Dickey"
        },
        {
            "value": "ND: Divide",
            "label": "ND: Divide"
        },
        {
            "value": "ND: Dunn",
            "label": "ND: Dunn"
        },
        {
            "value": "ND: Eddy",
            "label": "ND: Eddy"
        },
        {
            "value": "ND: Emmons",
            "label": "ND: Emmons"
        },
        {
            "value": "ND: Foster",
            "label": "ND: Foster"
        },
        {
            "value": "ND: Golden Valley",
            "label": "ND: Golden Valley"
        },
        {
            "value": "ND: Grand Forks",
            "label": "ND: Grand Forks"
        },
        {
            "value": "ND: Grant",
            "label": "ND: Grant"
        },
        {
            "value": "ND: Griggs",
            "label": "ND: Griggs"
        },
        {
            "value": "ND: Hettinger",
            "label": "ND: Hettinger"
        },
        {
            "value": "ND: Kidder",
            "label": "ND: Kidder"
        },
        {
            "value": "ND: LaMoure",
            "label": "ND: LaMoure"
        },
        {
            "value": "ND: Logan",
            "label": "ND: Logan"
        },
        {
            "value": "ND: McHenry",
            "label": "ND: McHenry"
        },
        {
            "value": "ND: McIntosh",
            "label": "ND: McIntosh"
        },
        {
            "value": "ND: McKenzie",
            "label": "ND: McKenzie"
        },
        {
            "value": "ND: McLean",
            "label": "ND: McLean"
        },
        {
            "value": "ND: Mercer",
            "label": "ND: Mercer"
        },
        {
            "value": "ND: Morton",
            "label": "ND: Morton"
        },
        {
            "value": "ND: Mountrail",
            "label": "ND: Mountrail"
        },
        {
            "value": "ND: Nelson",
            "label": "ND: Nelson"
        },
        {
            "value": "ND: Oliver",
            "label": "ND: Oliver"
        },
        {
            "value": "ND: Pembina",
            "label": "ND: Pembina"
        },
        {
            "value": "ND: Pierce",
            "label": "ND: Pierce"
        },
        {
            "value": "ND: Ramsey",
            "label": "ND: Ramsey"
        },
        {
            "value": "ND: Ransom",
            "label": "ND: Ransom"
        },
        {
            "value": "ND: Renville",
            "label": "ND: Renville"
        },
        {
            "value": "ND: Richland",
            "label": "ND: Richland"
        },
        {
            "value": "ND: Rolette",
            "label": "ND: Rolette"
        },
        {
            "value": "ND: Sargent",
            "label": "ND: Sargent"
        },
        {
            "value": "ND: Sheridan",
            "label": "ND: Sheridan"
        },
        {
            "value": "ND: Sioux",
            "label": "ND: Sioux"
        },
        {
            "value": "ND: Slope",
            "label": "ND: Slope"
        },
        {
            "value": "ND: Stark",
            "label": "ND: Stark"
        },
        {
            "value": "ND: Steele",
            "label": "ND: Steele"
        },
        {
            "value": "ND: Stutsman",
            "label": "ND: Stutsman"
        },
        {
            "value": "ND: Towner",
            "label": "ND: Towner"
        },
        {
            "value": "ND: Traill",
            "label": "ND: Traill"
        },
        {
            "value": "ND: Walsh",
            "label": "ND: Walsh"
        },
        {
            "value": "ND: Ward",
            "label": "ND: Ward"
        },
        {
            "value": "ND: Wells",
            "label": "ND: Wells"
        },
        {
            "value": "ND: Williams",
            "label": "ND: Williams"
        },
        {
            "value": "NE: Adams",
            "label": "NE: Adams"
        },
        {
            "value": "NE: Antelope",
            "label": "NE: Antelope"
        },
        {
            "value": "NE: Arthur",
            "label": "NE: Arthur"
        },
        {
            "value": "NE: Banner",
            "label": "NE: Banner"
        },
        {
            "value": "NE: Blaine",
            "label": "NE: Blaine"
        },
        {
            "value": "NE: Boone",
            "label": "NE: Boone"
        },
        {
            "value": "NE: Box Butte",
            "label": "NE: Box Butte"
        },
        {
            "value": "NE: Boyd",
            "label": "NE: Boyd"
        },
        {
            "value": "NE: Brown",
            "label": "NE: Brown"
        },
        {
            "value": "NE: Buffalo",
            "label": "NE: Buffalo"
        },
        {
            "value": "NE: Burt",
            "label": "NE: Burt"
        },
        {
            "value": "NE: Butler",
            "label": "NE: Butler"
        },
        {
            "value": "NE: Cass",
            "label": "NE: Cass"
        },
        {
            "value": "NE: Cedar",
            "label": "NE: Cedar"
        },
        {
            "value": "NE: Chase",
            "label": "NE: Chase"
        },
        {
            "value": "NE: Cherry",
            "label": "NE: Cherry"
        },
        {
            "value": "NE: Cheyenne",
            "label": "NE: Cheyenne"
        },
        {
            "value": "NE: Clay",
            "label": "NE: Clay"
        },
        {
            "value": "NE: Colfax",
            "label": "NE: Colfax"
        },
        {
            "value": "NE: Cuming",
            "label": "NE: Cuming"
        },
        {
            "value": "NE: Custer",
            "label": "NE: Custer"
        },
        {
            "value": "NE: Dakota",
            "label": "NE: Dakota"
        },
        {
            "value": "NE: Dawes",
            "label": "NE: Dawes"
        },
        {
            "value": "NE: Dawson",
            "label": "NE: Dawson"
        },
        {
            "value": "NE: Deuel",
            "label": "NE: Deuel"
        },
        {
            "value": "NE: Dixon",
            "label": "NE: Dixon"
        },
        {
            "value": "NE: Dodge",
            "label": "NE: Dodge"
        },
        {
            "value": "NE: Douglas",
            "label": "NE: Douglas"
        },
        {
            "value": "NE: Dundy",
            "label": "NE: Dundy"
        },
        {
            "value": "NE: Fillmore",
            "label": "NE: Fillmore"
        },
        {
            "value": "NE: Franklin",
            "label": "NE: Franklin"
        },
        {
            "value": "NE: Frontier",
            "label": "NE: Frontier"
        },
        {
            "value": "NE: Furnas",
            "label": "NE: Furnas"
        },
        {
            "value": "NE: Gage",
            "label": "NE: Gage"
        },
        {
            "value": "NE: Garden",
            "label": "NE: Garden"
        },
        {
            "value": "NE: Garfield",
            "label": "NE: Garfield"
        },
        {
            "value": "NE: Gosper",
            "label": "NE: Gosper"
        },
        {
            "value": "NE: Grant",
            "label": "NE: Grant"
        },
        {
            "value": "NE: Greeley",
            "label": "NE: Greeley"
        },
        {
            "value": "NE: Hall",
            "label": "NE: Hall"
        },
        {
            "value": "NE: Hamilton",
            "label": "NE: Hamilton"
        },
        {
            "value": "NE: Harlan",
            "label": "NE: Harlan"
        },
        {
            "value": "NE: Hayes",
            "label": "NE: Hayes"
        },
        {
            "value": "NE: Hitchcock",
            "label": "NE: Hitchcock"
        },
        {
            "value": "NE: Holt",
            "label": "NE: Holt"
        },
        {
            "value": "NE: Hooker",
            "label": "NE: Hooker"
        },
        {
            "value": "NE: Howard",
            "label": "NE: Howard"
        },
        {
            "value": "NE: Jefferson",
            "label": "NE: Jefferson"
        },
        {
            "value": "NE: Johnson",
            "label": "NE: Johnson"
        },
        {
            "value": "NE: Kearney",
            "label": "NE: Kearney"
        },
        {
            "value": "NE: Keith",
            "label": "NE: Keith"
        },
        {
            "value": "NE: Keya Paha",
            "label": "NE: Keya Paha"
        },
        {
            "value": "NE: Kimball",
            "label": "NE: Kimball"
        },
        {
            "value": "NE: Knox",
            "label": "NE: Knox"
        },
        {
            "value": "NE: Lancaster",
            "label": "NE: Lancaster"
        },
        {
            "value": "NE: Lincoln",
            "label": "NE: Lincoln"
        },
        {
            "value": "NE: Logan",
            "label": "NE: Logan"
        },
        {
            "value": "NE: Loup",
            "label": "NE: Loup"
        },
        {
            "value": "NE: Madison",
            "label": "NE: Madison"
        },
        {
            "value": "NE: McPherson",
            "label": "NE: McPherson"
        },
        {
            "value": "NE: Merrick",
            "label": "NE: Merrick"
        },
        {
            "value": "NE: Morrill",
            "label": "NE: Morrill"
        },
        {
            "value": "NE: Nance",
            "label": "NE: Nance"
        },
        {
            "value": "NE: Nemaha",
            "label": "NE: Nemaha"
        },
        {
            "value": "NE: Nuckolls",
            "label": "NE: Nuckolls"
        },
        {
            "value": "NE: Otoe",
            "label": "NE: Otoe"
        },
        {
            "value": "NE: Pawnee",
            "label": "NE: Pawnee"
        },
        {
            "value": "NE: Perkins",
            "label": "NE: Perkins"
        },
        {
            "value": "NE: Phelps",
            "label": "NE: Phelps"
        },
        {
            "value": "NE: Pierce",
            "label": "NE: Pierce"
        },
        {
            "value": "NE: Platte",
            "label": "NE: Platte"
        },
        {
            "value": "NE: Polk",
            "label": "NE: Polk"
        },
        {
            "value": "NE: Red Willow",
            "label": "NE: Red Willow"
        },
        {
            "value": "NE: Richardson",
            "label": "NE: Richardson"
        },
        {
            "value": "NE: Rock",
            "label": "NE: Rock"
        },
        {
            "value": "NE: Saline",
            "label": "NE: Saline"
        },
        {
            "value": "NE: Sarpy",
            "label": "NE: Sarpy"
        },
        {
            "value": "NE: Saunders",
            "label": "NE: Saunders"
        },
        {
            "value": "NE: Scotts Bluff",
            "label": "NE: Scotts Bluff"
        },
        {
            "value": "NE: Seward",
            "label": "NE: Seward"
        },
        {
            "value": "NE: Sheridan",
            "label": "NE: Sheridan"
        },
        {
            "value": "NE: Sherman",
            "label": "NE: Sherman"
        },
        {
            "value": "NE: Sioux",
            "label": "NE: Sioux"
        },
        {
            "value": "NE: Stanton",
            "label": "NE: Stanton"
        },
        {
            "value": "NE: Thayer",
            "label": "NE: Thayer"
        },
        {
            "value": "NE: Thomas",
            "label": "NE: Thomas"
        },
        {
            "value": "NE: Thurston",
            "label": "NE: Thurston"
        },
        {
            "value": "NE: Valley",
            "label": "NE: Valley"
        },
        {
            "value": "NE: Washington",
            "label": "NE: Washington"
        },
        {
            "value": "NE: Wayne",
            "label": "NE: Wayne"
        },
        {
            "value": "NE: Webster",
            "label": "NE: Webster"
        },
        {
            "value": "NE: Wheeler",
            "label": "NE: Wheeler"
        },
        {
            "value": "NE: York",
            "label": "NE: York"
        },
        {
            "value": "NH: Belknap",
            "label": "NH: Belknap"
        },
        {
            "value": "NH: Carroll",
            "label": "NH: Carroll"
        },
        {
            "value": "NH: Cheshire",
            "label": "NH: Cheshire"
        },
        {
            "value": "NH: Coos",
            "label": "NH: Coos"
        },
        {
            "value": "NH: Grafton",
            "label": "NH: Grafton"
        },
        {
            "value": "NH: Hillsborough",
            "label": "NH: Hillsborough"
        },
        {
            "value": "NH: Merrimack",
            "label": "NH: Merrimack"
        },
        {
            "value": "NH: Rockingham",
            "label": "NH: Rockingham"
        },
        {
            "value": "NH: Strafford",
            "label": "NH: Strafford"
        },
        {
            "value": "NH: Sullivan",
            "label": "NH: Sullivan"
        },
        {
            "value": "NJ: Atlantic",
            "label": "NJ: Atlantic"
        },
        {
            "value": "NJ: Bergen",
            "label": "NJ: Bergen"
        },
        {
            "value": "NJ: Burlington",
            "label": "NJ: Burlington"
        },
        {
            "value": "NJ: Camden",
            "label": "NJ: Camden"
        },
        {
            "value": "NJ: Cape May",
            "label": "NJ: Cape May"
        },
        {
            "value": "NJ: Cumberland",
            "label": "NJ: Cumberland"
        },
        {
            "value": "NJ: Essex",
            "label": "NJ: Essex"
        },
        {
            "value": "NJ: Gloucester",
            "label": "NJ: Gloucester"
        },
        {
            "value": "NJ: Hudson",
            "label": "NJ: Hudson"
        },
        {
            "value": "NJ: Hunterdon",
            "label": "NJ: Hunterdon"
        },
        {
            "value": "NJ: Mercer",
            "label": "NJ: Mercer"
        },
        {
            "value": "NJ: Middlesex",
            "label": "NJ: Middlesex"
        },
        {
            "value": "NJ: Monmouth",
            "label": "NJ: Monmouth"
        },
        {
            "value": "NJ: Morris",
            "label": "NJ: Morris"
        },
        {
            "value": "NJ: Ocean",
            "label": "NJ: Ocean"
        },
        {
            "value": "NJ: Passaic",
            "label": "NJ: Passaic"
        },
        {
            "value": "NJ: Salem",
            "label": "NJ: Salem"
        },
        {
            "value": "NJ: Somerset",
            "label": "NJ: Somerset"
        },
        {
            "value": "NJ: Sussex",
            "label": "NJ: Sussex"
        },
        {
            "value": "NJ: Union",
            "label": "NJ: Union"
        },
        {
            "value": "NJ: Warren",
            "label": "NJ: Warren"
        },
        {
            "value": "NM: Bernalillo",
            "label": "NM: Bernalillo"
        },
        {
            "value": "NM: Catron",
            "label": "NM: Catron"
        },
        {
            "value": "NM: Chaves",
            "label": "NM: Chaves"
        },
        {
            "value": "NM: Cibola",
            "label": "NM: Cibola"
        },
        {
            "value": "NM: Colfax",
            "label": "NM: Colfax"
        },
        {
            "value": "NM: Curry",
            "label": "NM: Curry"
        },
        {
            "value": "NM: De Baca",
            "label": "NM: De Baca"
        },
        {
            "value": "NM: Doña Ana",
            "label": "NM: Doña Ana"
        },
        {
            "value": "NM: Eddy",
            "label": "NM: Eddy"
        },
        {
            "value": "NM: Grant",
            "label": "NM: Grant"
        },
        {
            "value": "NM: Guadalupe",
            "label": "NM: Guadalupe"
        },
        {
            "value": "NM: Harding",
            "label": "NM: Harding"
        },
        {
            "value": "NM: Hidalgo",
            "label": "NM: Hidalgo"
        },
        {
            "value": "NM: Lea",
            "label": "NM: Lea"
        },
        {
            "value": "NM: Lincoln",
            "label": "NM: Lincoln"
        },
        {
            "value": "NM: Los Alamos",
            "label": "NM: Los Alamos"
        },
        {
            "value": "NM: Luna",
            "label": "NM: Luna"
        },
        {
            "value": "NM: McKinley",
            "label": "NM: McKinley"
        },
        {
            "value": "NM: Mora",
            "label": "NM: Mora"
        },
        {
            "value": "NM: Otero",
            "label": "NM: Otero"
        },
        {
            "value": "NM: Quay",
            "label": "NM: Quay"
        },
        {
            "value": "NM: Rio Arriba",
            "label": "NM: Rio Arriba"
        },
        {
            "value": "NM: Roosevelt",
            "label": "NM: Roosevelt"
        },
        {
            "value": "NM: San Juan",
            "label": "NM: San Juan"
        },
        {
            "value": "NM: San Miguel",
            "label": "NM: San Miguel"
        },
        {
            "value": "NM: Sandoval",
            "label": "NM: Sandoval"
        },
        {
            "value": "NM: Santa Fe",
            "label": "NM: Santa Fe"
        },
        {
            "value": "NM: Sierra",
            "label": "NM: Sierra"
        },
        {
            "value": "NM: Socorro",
            "label": "NM: Socorro"
        },
        {
            "value": "NM: Taos",
            "label": "NM: Taos"
        },
        {
            "value": "NM: Torrance",
            "label": "NM: Torrance"
        },
        {
            "value": "NM: Union",
            "label": "NM: Union"
        },
        {
            "value": "NM: Valencia",
            "label": "NM: Valencia"
        },
        {
            "value": "NV: Carson City",
            "label": "NV: Carson City"
        },
        {
            "value": "NV: Churchill",
            "label": "NV: Churchill"
        },
        {
            "value": "NV: Clark",
            "label": "NV: Clark"
        },
        {
            "value": "NV: Douglas",
            "label": "NV: Douglas"
        },
        {
            "value": "NV: Elko",
            "label": "NV: Elko"
        },
        {
            "value": "NV: Esmeralda",
            "label": "NV: Esmeralda"
        },
        {
            "value": "NV: Eureka",
            "label": "NV: Eureka"
        },
        {
            "value": "NV: Humboldt",
            "label": "NV: Humboldt"
        },
        {
            "value": "NV: Lander",
            "label": "NV: Lander"
        },
        {
            "value": "NV: Lincoln",
            "label": "NV: Lincoln"
        },
        {
            "value": "NV: Lyon",
            "label": "NV: Lyon"
        },
        {
            "value": "NV: Mineral",
            "label": "NV: Mineral"
        },
        {
            "value": "NV: Nye",
            "label": "NV: Nye"
        },
        {
            "value": "NV: Pershing",
            "label": "NV: Pershing"
        },
        {
            "value": "NV: Storey",
            "label": "NV: Storey"
        },
        {
            "value": "NV: Washoe",
            "label": "NV: Washoe"
        },
        {
            "value": "NV: White Pine",
            "label": "NV: White Pine"
        },
        {
            "value": "NY: Albany",
            "label": "NY: Albany"
        },
        {
            "value": "NY: Allegany",
            "label": "NY: Allegany"
        },
        {
            "value": "NY: Bronx",
            "label": "NY: Bronx"
        },
        {
            "value": "NY: Broome",
            "label": "NY: Broome"
        },
        {
            "value": "NY: Cattaraugus",
            "label": "NY: Cattaraugus"
        },
        {
            "value": "NY: Cayuga",
            "label": "NY: Cayuga"
        },
        {
            "value": "NY: Chautauqua",
            "label": "NY: Chautauqua"
        },
        {
            "value": "NY: Chemung",
            "label": "NY: Chemung"
        },
        {
            "value": "NY: Chenango",
            "label": "NY: Chenango"
        },
        {
            "value": "NY: Clinton",
            "label": "NY: Clinton"
        },
        {
            "value": "NY: Columbia",
            "label": "NY: Columbia"
        },
        {
            "value": "NY: Cortland",
            "label": "NY: Cortland"
        },
        {
            "value": "NY: Delaware",
            "label": "NY: Delaware"
        },
        {
            "value": "NY: Dutchess",
            "label": "NY: Dutchess"
        },
        {
            "value": "NY: Erie",
            "label": "NY: Erie"
        },
        {
            "value": "NY: Essex",
            "label": "NY: Essex"
        },
        {
            "value": "NY: Franklin",
            "label": "NY: Franklin"
        },
        {
            "value": "NY: Fulton",
            "label": "NY: Fulton"
        },
        {
            "value": "NY: Genesee",
            "label": "NY: Genesee"
        },
        {
            "value": "NY: Greene",
            "label": "NY: Greene"
        },
        {
            "value": "NY: Hamilton",
            "label": "NY: Hamilton"
        },
        {
            "value": "NY: Herkimer",
            "label": "NY: Herkimer"
        },
        {
            "value": "NY: Jefferson",
            "label": "NY: Jefferson"
        },
        {
            "value": "NY: Kings",
            "label": "NY: Kings"
        },
        {
            "value": "NY: Lewis",
            "label": "NY: Lewis"
        },
        {
            "value": "NY: Livingston",
            "label": "NY: Livingston"
        },
        {
            "value": "NY: Madison",
            "label": "NY: Madison"
        },
        {
            "value": "NY: Monroe",
            "label": "NY: Monroe"
        },
        {
            "value": "NY: Montgomery",
            "label": "NY: Montgomery"
        },
        {
            "value": "NY: Nassau",
            "label": "NY: Nassau"
        },
        {
            "value": "NY: New York",
            "label": "NY: New York"
        },
        {
            "value": "NY: Niagara",
            "label": "NY: Niagara"
        },
        {
            "value": "NY: Oneida",
            "label": "NY: Oneida"
        },
        {
            "value": "NY: Onondaga",
            "label": "NY: Onondaga"
        },
        {
            "value": "NY: Ontario",
            "label": "NY: Ontario"
        },
        {
            "value": "NY: Orange",
            "label": "NY: Orange"
        },
        {
            "value": "NY: Orleans",
            "label": "NY: Orleans"
        },
        {
            "value": "NY: Oswego",
            "label": "NY: Oswego"
        },
        {
            "value": "NY: Otsego",
            "label": "NY: Otsego"
        },
        {
            "value": "NY: Putnam",
            "label": "NY: Putnam"
        },
        {
            "value": "NY: Queens",
            "label": "NY: Queens"
        },
        {
            "value": "NY: Rensselaer",
            "label": "NY: Rensselaer"
        },
        {
            "value": "NY: Richmond",
            "label": "NY: Richmond"
        },
        {
            "value": "NY: Rockland",
            "label": "NY: Rockland"
        },
        {
            "value": "NY: Saratoga",
            "label": "NY: Saratoga"
        },
        {
            "value": "NY: Schenectady",
            "label": "NY: Schenectady"
        },
        {
            "value": "NY: Schoharie",
            "label": "NY: Schoharie"
        },
        {
            "value": "NY: Schuyler",
            "label": "NY: Schuyler"
        },
        {
            "value": "NY: Seneca",
            "label": "NY: Seneca"
        },
        {
            "value": "NY: St. Lawrence",
            "label": "NY: St. Lawrence"
        },
        {
            "value": "NY: Steuben",
            "label": "NY: Steuben"
        },
        {
            "value": "NY: Suffolk",
            "label": "NY: Suffolk"
        },
        {
            "value": "NY: Sullivan",
            "label": "NY: Sullivan"
        },
        {
            "value": "NY: Tioga",
            "label": "NY: Tioga"
        },
        {
            "value": "NY: Tompkins",
            "label": "NY: Tompkins"
        },
        {
            "value": "NY: Ulster",
            "label": "NY: Ulster"
        },
        {
            "value": "NY: Warren",
            "label": "NY: Warren"
        },
        {
            "value": "NY: Washington",
            "label": "NY: Washington"
        },
        {
            "value": "NY: Wayne",
            "label": "NY: Wayne"
        },
        {
            "value": "NY: Westchester",
            "label": "NY: Westchester"
        },
        {
            "value": "NY: Wyoming",
            "label": "NY: Wyoming"
        },
        {
            "value": "NY: Yates",
            "label": "NY: Yates"
        },
        {
            "value": "OH: Adams",
            "label": "OH: Adams"
        },
        {
            "value": "OH: Allen",
            "label": "OH: Allen"
        },
        {
            "value": "OH: Ashland",
            "label": "OH: Ashland"
        },
        {
            "value": "OH: Ashtabula",
            "label": "OH: Ashtabula"
        },
        {
            "value": "OH: Athens",
            "label": "OH: Athens"
        },
        {
            "value": "OH: Auglaize",
            "label": "OH: Auglaize"
        },
        {
            "value": "OH: Belmont",
            "label": "OH: Belmont"
        },
        {
            "value": "OH: Brown",
            "label": "OH: Brown"
        },
        {
            "value": "OH: Butler",
            "label": "OH: Butler"
        },
        {
            "value": "OH: Carroll",
            "label": "OH: Carroll"
        },
        {
            "value": "OH: Champaign",
            "label": "OH: Champaign"
        },
        {
            "value": "OH: Clark",
            "label": "OH: Clark"
        },
        {
            "value": "OH: Clermont",
            "label": "OH: Clermont"
        },
        {
            "value": "OH: Clinton",
            "label": "OH: Clinton"
        },
        {
            "value": "OH: Columbiana",
            "label": "OH: Columbiana"
        },
        {
            "value": "OH: Coshocton",
            "label": "OH: Coshocton"
        },
        {
            "value": "OH: Crawford",
            "label": "OH: Crawford"
        },
        {
            "value": "OH: Cuyahoga",
            "label": "OH: Cuyahoga"
        },
        {
            "value": "OH: Darke",
            "label": "OH: Darke"
        },
        {
            "value": "OH: Defiance",
            "label": "OH: Defiance"
        },
        {
            "value": "OH: Delaware",
            "label": "OH: Delaware"
        },
        {
            "value": "OH: Erie",
            "label": "OH: Erie"
        },
        {
            "value": "OH: Fairfield",
            "label": "OH: Fairfield"
        },
        {
            "value": "OH: Fayette",
            "label": "OH: Fayette"
        },
        {
            "value": "OH: Franklin",
            "label": "OH: Franklin"
        },
        {
            "value": "OH: Fulton",
            "label": "OH: Fulton"
        },
        {
            "value": "OH: Gallia",
            "label": "OH: Gallia"
        },
        {
            "value": "OH: Geauga",
            "label": "OH: Geauga"
        },
        {
            "value": "OH: Greene",
            "label": "OH: Greene"
        },
        {
            "value": "OH: Guernsey",
            "label": "OH: Guernsey"
        },
        {
            "value": "OH: Hamilton",
            "label": "OH: Hamilton"
        },
        {
            "value": "OH: Hancock",
            "label": "OH: Hancock"
        },
        {
            "value": "OH: Hardin",
            "label": "OH: Hardin"
        },
        {
            "value": "OH: Harrison",
            "label": "OH: Harrison"
        },
        {
            "value": "OH: Henry",
            "label": "OH: Henry"
        },
        {
            "value": "OH: Highland",
            "label": "OH: Highland"
        },
        {
            "value": "OH: Hocking",
            "label": "OH: Hocking"
        },
        {
            "value": "OH: Holmes",
            "label": "OH: Holmes"
        },
        {
            "value": "OH: Huron",
            "label": "OH: Huron"
        },
        {
            "value": "OH: Jackson",
            "label": "OH: Jackson"
        },
        {
            "value": "OH: Jefferson",
            "label": "OH: Jefferson"
        },
        {
            "value": "OH: Knox",
            "label": "OH: Knox"
        },
        {
            "value": "OH: Lake",
            "label": "OH: Lake"
        },
        {
            "value": "OH: Lawrence",
            "label": "OH: Lawrence"
        },
        {
            "value": "OH: Licking",
            "label": "OH: Licking"
        },
        {
            "value": "OH: Logan",
            "label": "OH: Logan"
        },
        {
            "value": "OH: Lorain",
            "label": "OH: Lorain"
        },
        {
            "value": "OH: Lucas",
            "label": "OH: Lucas"
        },
        {
            "value": "OH: Madison",
            "label": "OH: Madison"
        },
        {
            "value": "OH: Mahoning",
            "label": "OH: Mahoning"
        },
        {
            "value": "OH: Marion",
            "label": "OH: Marion"
        },
        {
            "value": "OH: Medina",
            "label": "OH: Medina"
        },
        {
            "value": "OH: Meigs",
            "label": "OH: Meigs"
        },
        {
            "value": "OH: Mercer",
            "label": "OH: Mercer"
        },
        {
            "value": "OH: Miami",
            "label": "OH: Miami"
        },
        {
            "value": "OH: Monroe",
            "label": "OH: Monroe"
        },
        {
            "value": "OH: Montgomery",
            "label": "OH: Montgomery"
        },
        {
            "value": "OH: Morgan",
            "label": "OH: Morgan"
        },
        {
            "value": "OH: Morrow",
            "label": "OH: Morrow"
        },
        {
            "value": "OH: Muskingum",
            "label": "OH: Muskingum"
        },
        {
            "value": "OH: Noble",
            "label": "OH: Noble"
        },
        {
            "value": "OH: Ottawa",
            "label": "OH: Ottawa"
        },
        {
            "value": "OH: Paulding",
            "label": "OH: Paulding"
        },
        {
            "value": "OH: Perry",
            "label": "OH: Perry"
        },
        {
            "value": "OH: Pickaway",
            "label": "OH: Pickaway"
        },
        {
            "value": "OH: Pike",
            "label": "OH: Pike"
        },
        {
            "value": "OH: Portage",
            "label": "OH: Portage"
        },
        {
            "value": "OH: Preble",
            "label": "OH: Preble"
        },
        {
            "value": "OH: Putnam",
            "label": "OH: Putnam"
        },
        {
            "value": "OH: Richland",
            "label": "OH: Richland"
        },
        {
            "value": "OH: Ross",
            "label": "OH: Ross"
        },
        {
            "value": "OH: Sandusky",
            "label": "OH: Sandusky"
        },
        {
            "value": "OH: Scioto",
            "label": "OH: Scioto"
        },
        {
            "value": "OH: Seneca",
            "label": "OH: Seneca"
        },
        {
            "value": "OH: Shelby",
            "label": "OH: Shelby"
        },
        {
            "value": "OH: Stark",
            "label": "OH: Stark"
        },
        {
            "value": "OH: Summit",
            "label": "OH: Summit"
        },
        {
            "value": "OH: Trumbull",
            "label": "OH: Trumbull"
        },
        {
            "value": "OH: Tuscarawas",
            "label": "OH: Tuscarawas"
        },
        {
            "value": "OH: Union",
            "label": "OH: Union"
        },
        {
            "value": "OH: Van Wert",
            "label": "OH: Van Wert"
        },
        {
            "value": "OH: Vinton",
            "label": "OH: Vinton"
        },
        {
            "value": "OH: Warren",
            "label": "OH: Warren"
        },
        {
            "value": "OH: Washington",
            "label": "OH: Washington"
        },
        {
            "value": "OH: Wayne",
            "label": "OH: Wayne"
        },
        {
            "value": "OH: Williams",
            "label": "OH: Williams"
        },
        {
            "value": "OH: Wood",
            "label": "OH: Wood"
        },
        {
            "value": "OH: Wyandot",
            "label": "OH: Wyandot"
        },
        {
            "value": "OK: Adair",
            "label": "OK: Adair"
        },
        {
            "value": "OK: Alfalfa",
            "label": "OK: Alfalfa"
        },
        {
            "value": "OK: Atoka",
            "label": "OK: Atoka"
        },
        {
            "value": "OK: Beaver",
            "label": "OK: Beaver"
        },
        {
            "value": "OK: Beckham",
            "label": "OK: Beckham"
        },
        {
            "value": "OK: Blaine",
            "label": "OK: Blaine"
        },
        {
            "value": "OK: Bryan",
            "label": "OK: Bryan"
        },
        {
            "value": "OK: Caddo",
            "label": "OK: Caddo"
        },
        {
            "value": "OK: Canadian",
            "label": "OK: Canadian"
        },
        {
            "value": "OK: Carter",
            "label": "OK: Carter"
        },
        {
            "value": "OK: Cherokee",
            "label": "OK: Cherokee"
        },
        {
            "value": "OK: Choctaw",
            "label": "OK: Choctaw"
        },
        {
            "value": "OK: Cimarron",
            "label": "OK: Cimarron"
        },
        {
            "value": "OK: Cleveland",
            "label": "OK: Cleveland"
        },
        {
            "value": "OK: Coal",
            "label": "OK: Coal"
        },
        {
            "value": "OK: Comanche",
            "label": "OK: Comanche"
        },
        {
            "value": "OK: Cotton",
            "label": "OK: Cotton"
        },
        {
            "value": "OK: Craig",
            "label": "OK: Craig"
        },
        {
            "value": "OK: Creek",
            "label": "OK: Creek"
        },
        {
            "value": "OK: Custer",
            "label": "OK: Custer"
        },
        {
            "value": "OK: Delaware",
            "label": "OK: Delaware"
        },
        {
            "value": "OK: Dewey",
            "label": "OK: Dewey"
        },
        {
            "value": "OK: Ellis",
            "label": "OK: Ellis"
        },
        {
            "value": "OK: Garfield",
            "label": "OK: Garfield"
        },
        {
            "value": "OK: Garvin",
            "label": "OK: Garvin"
        },
        {
            "value": "OK: Grady",
            "label": "OK: Grady"
        },
        {
            "value": "OK: Grant",
            "label": "OK: Grant"
        },
        {
            "value": "OK: Greer",
            "label": "OK: Greer"
        },
        {
            "value": "OK: Harmon",
            "label": "OK: Harmon"
        },
        {
            "value": "OK: Harper",
            "label": "OK: Harper"
        },
        {
            "value": "OK: Haskell",
            "label": "OK: Haskell"
        },
        {
            "value": "OK: Hughes",
            "label": "OK: Hughes"
        },
        {
            "value": "OK: Jackson",
            "label": "OK: Jackson"
        },
        {
            "value": "OK: Jefferson",
            "label": "OK: Jefferson"
        },
        {
            "value": "OK: Johnston",
            "label": "OK: Johnston"
        },
        {
            "value": "OK: Kay",
            "label": "OK: Kay"
        },
        {
            "value": "OK: Kingfisher",
            "label": "OK: Kingfisher"
        },
        {
            "value": "OK: Kiowa",
            "label": "OK: Kiowa"
        },
        {
            "value": "OK: Latimer",
            "label": "OK: Latimer"
        },
        {
            "value": "OK: Le Flore",
            "label": "OK: Le Flore"
        },
        {
            "value": "OK: Lincoln",
            "label": "OK: Lincoln"
        },
        {
            "value": "OK: Logan",
            "label": "OK: Logan"
        },
        {
            "value": "OK: Love",
            "label": "OK: Love"
        },
        {
            "value": "OK: Major",
            "label": "OK: Major"
        },
        {
            "value": "OK: Marshall",
            "label": "OK: Marshall"
        },
        {
            "value": "OK: Mayes",
            "label": "OK: Mayes"
        },
        {
            "value": "OK: McClain",
            "label": "OK: McClain"
        },
        {
            "value": "OK: McCurtain",
            "label": "OK: McCurtain"
        },
        {
            "value": "OK: McIntosh",
            "label": "OK: McIntosh"
        },
        {
            "value": "OK: Murray",
            "label": "OK: Murray"
        },
        {
            "value": "OK: Muskogee",
            "label": "OK: Muskogee"
        },
        {
            "value": "OK: Noble",
            "label": "OK: Noble"
        },
        {
            "value": "OK: Nowata",
            "label": "OK: Nowata"
        },
        {
            "value": "OK: Okfuskee",
            "label": "OK: Okfuskee"
        },
        {
            "value": "OK: Oklahoma",
            "label": "OK: Oklahoma"
        },
        {
            "value": "OK: Okmulgee",
            "label": "OK: Okmulgee"
        },
        {
            "value": "OK: Osage",
            "label": "OK: Osage"
        },
        {
            "value": "OK: Ottawa",
            "label": "OK: Ottawa"
        },
        {
            "value": "OK: Pawnee",
            "label": "OK: Pawnee"
        },
        {
            "value": "OK: Payne",
            "label": "OK: Payne"
        },
        {
            "value": "OK: Pittsburg",
            "label": "OK: Pittsburg"
        },
        {
            "value": "OK: Pontotoc",
            "label": "OK: Pontotoc"
        },
        {
            "value": "OK: Pottawatomie",
            "label": "OK: Pottawatomie"
        },
        {
            "value": "OK: Pushmataha",
            "label": "OK: Pushmataha"
        },
        {
            "value": "OK: Roger Mills",
            "label": "OK: Roger Mills"
        },
        {
            "value": "OK: Rogers",
            "label": "OK: Rogers"
        },
        {
            "value": "OK: Seminole",
            "label": "OK: Seminole"
        },
        {
            "value": "OK: Sequoyah",
            "label": "OK: Sequoyah"
        },
        {
            "value": "OK: Stephens",
            "label": "OK: Stephens"
        },
        {
            "value": "OK: Texas",
            "label": "OK: Texas"
        },
        {
            "value": "OK: Tillman",
            "label": "OK: Tillman"
        },
        {
            "value": "OK: Tulsa",
            "label": "OK: Tulsa"
        },
        {
            "value": "OK: Wagoner",
            "label": "OK: Wagoner"
        },
        {
            "value": "OK: Washington",
            "label": "OK: Washington"
        },
        {
            "value": "OK: Washita",
            "label": "OK: Washita"
        },
        {
            "value": "OK: Woods",
            "label": "OK: Woods"
        },
        {
            "value": "OK: Woodward",
            "label": "OK: Woodward"
        },
        {
            "value": "OR: Baker",
            "label": "OR: Baker"
        },
        {
            "value": "OR: Benton",
            "label": "OR: Benton"
        },
        {
            "value": "OR: Clackamas",
            "label": "OR: Clackamas"
        },
        {
            "value": "OR: Clatsop",
            "label": "OR: Clatsop"
        },
        {
            "value": "OR: Columbia",
            "label": "OR: Columbia"
        },
        {
            "value": "OR: Coos",
            "label": "OR: Coos"
        },
        {
            "value": "OR: Crook",
            "label": "OR: Crook"
        },
        {
            "value": "OR: Curry",
            "label": "OR: Curry"
        },
        {
            "value": "OR: Deschutes",
            "label": "OR: Deschutes"
        },
        {
            "value": "OR: Douglas",
            "label": "OR: Douglas"
        },
        {
            "value": "OR: Gilliam",
            "label": "OR: Gilliam"
        },
        {
            "value": "OR: Grant",
            "label": "OR: Grant"
        },
        {
            "value": "OR: Harney",
            "label": "OR: Harney"
        },
        {
            "value": "OR: Hood River",
            "label": "OR: Hood River"
        },
        {
            "value": "OR: Jackson",
            "label": "OR: Jackson"
        },
        {
            "value": "OR: Jefferson",
            "label": "OR: Jefferson"
        },
        {
            "value": "OR: Josephine",
            "label": "OR: Josephine"
        },
        {
            "value": "OR: Klamath",
            "label": "OR: Klamath"
        },
        {
            "value": "OR: Lake",
            "label": "OR: Lake"
        },
        {
            "value": "OR: Lane",
            "label": "OR: Lane"
        },
        {
            "value": "OR: Lincoln",
            "label": "OR: Lincoln"
        },
        {
            "value": "OR: Linn",
            "label": "OR: Linn"
        },
        {
            "value": "OR: Malheur",
            "label": "OR: Malheur"
        },
        {
            "value": "OR: Marion",
            "label": "OR: Marion"
        },
        {
            "value": "OR: Morrow",
            "label": "OR: Morrow"
        },
        {
            "value": "OR: Multnomah",
            "label": "OR: Multnomah"
        },
        {
            "value": "OR: Polk",
            "label": "OR: Polk"
        },
        {
            "value": "OR: Sherman",
            "label": "OR: Sherman"
        },
        {
            "value": "OR: Tillamook",
            "label": "OR: Tillamook"
        },
        {
            "value": "OR: Umatilla",
            "label": "OR: Umatilla"
        },
        {
            "value": "OR: Union",
            "label": "OR: Union"
        },
        {
            "value": "OR: Wallowa",
            "label": "OR: Wallowa"
        },
        {
            "value": "OR: Wasco",
            "label": "OR: Wasco"
        },
        {
            "value": "OR: Washington",
            "label": "OR: Washington"
        },
        {
            "value": "OR: Wheeler",
            "label": "OR: Wheeler"
        },
        {
            "value": "OR: Yamhill",
            "label": "OR: Yamhill"
        },
        {
            "value": "PA: Adams",
            "label": "PA: Adams"
        },
        {
            "value": "PA: Allegheny",
            "label": "PA: Allegheny"
        },
        {
            "value": "PA: Armstrong",
            "label": "PA: Armstrong"
        },
        {
            "value": "PA: Beaver",
            "label": "PA: Beaver"
        },
        {
            "value": "PA: Bedford",
            "label": "PA: Bedford"
        },
        {
            "value": "PA: Berks",
            "label": "PA: Berks"
        },
        {
            "value": "PA: Blair",
            "label": "PA: Blair"
        },
        {
            "value": "PA: Bradford",
            "label": "PA: Bradford"
        },
        {
            "value": "PA: Bucks",
            "label": "PA: Bucks"
        },
        {
            "value": "PA: Butler",
            "label": "PA: Butler"
        },
        {
            "value": "PA: Cambria",
            "label": "PA: Cambria"
        },
        {
            "value": "PA: Cameron",
            "label": "PA: Cameron"
        },
        {
            "value": "PA: Carbon",
            "label": "PA: Carbon"
        },
        {
            "value": "PA: Centre",
            "label": "PA: Centre"
        },
        {
            "value": "PA: Chester",
            "label": "PA: Chester"
        },
        {
            "value": "PA: Clarion",
            "label": "PA: Clarion"
        },
        {
            "value": "PA: Clearfield",
            "label": "PA: Clearfield"
        },
        {
            "value": "PA: Clinton",
            "label": "PA: Clinton"
        },
        {
            "value": "PA: Columbia",
            "label": "PA: Columbia"
        },
        {
            "value": "PA: Crawford",
            "label": "PA: Crawford"
        },
        {
            "value": "PA: Cumberland",
            "label": "PA: Cumberland"
        },
        {
            "value": "PA: Dauphin",
            "label": "PA: Dauphin"
        },
        {
            "value": "PA: Delaware",
            "label": "PA: Delaware"
        },
        {
            "value": "PA: Elk",
            "label": "PA: Elk"
        },
        {
            "value": "PA: Erie",
            "label": "PA: Erie"
        },
        {
            "value": "PA: Fayette",
            "label": "PA: Fayette"
        },
        {
            "value": "PA: Forest",
            "label": "PA: Forest"
        },
        {
            "value": "PA: Franklin",
            "label": "PA: Franklin"
        },
        {
            "value": "PA: Fulton",
            "label": "PA: Fulton"
        },
        {
            "value": "PA: Greene",
            "label": "PA: Greene"
        },
        {
            "value": "PA: Huntingdon",
            "label": "PA: Huntingdon"
        },
        {
            "value": "PA: Indiana",
            "label": "PA: Indiana"
        },
        {
            "value": "PA: Jefferson",
            "label": "PA: Jefferson"
        },
        {
            "value": "PA: Juniata",
            "label": "PA: Juniata"
        },
        {
            "value": "PA: Lackawanna",
            "label": "PA: Lackawanna"
        },
        {
            "value": "PA: Lancaster",
            "label": "PA: Lancaster"
        },
        {
            "value": "PA: Lawrence",
            "label": "PA: Lawrence"
        },
        {
            "value": "PA: Lebanon",
            "label": "PA: Lebanon"
        },
        {
            "value": "PA: Lehigh",
            "label": "PA: Lehigh"
        },
        {
            "value": "PA: Luzerne",
            "label": "PA: Luzerne"
        },
        {
            "value": "PA: Lycoming",
            "label": "PA: Lycoming"
        },
        {
            "value": "PA: McKean",
            "label": "PA: McKean"
        },
        {
            "value": "PA: Mercer",
            "label": "PA: Mercer"
        },
        {
            "value": "PA: Mifflin",
            "label": "PA: Mifflin"
        },
        {
            "value": "PA: Monroe",
            "label": "PA: Monroe"
        },
        {
            "value": "PA: Montgomery",
            "label": "PA: Montgomery"
        },
        {
            "value": "PA: Montour",
            "label": "PA: Montour"
        },
        {
            "value": "PA: Northampton",
            "label": "PA: Northampton"
        },
        {
            "value": "PA: Northumberland",
            "label": "PA: Northumberland"
        },
        {
            "value": "PA: Perry",
            "label": "PA: Perry"
        },
        {
            "value": "PA: Philadelphia",
            "label": "PA: Philadelphia"
        },
        {
            "value": "PA: Pike",
            "label": "PA: Pike"
        },
        {
            "value": "PA: Potter",
            "label": "PA: Potter"
        },
        {
            "value": "PA: Schuylkill",
            "label": "PA: Schuylkill"
        },
        {
            "value": "PA: Snyder",
            "label": "PA: Snyder"
        },
        {
            "value": "PA: Somerset",
            "label": "PA: Somerset"
        },
        {
            "value": "PA: Sullivan",
            "label": "PA: Sullivan"
        },
        {
            "value": "PA: Susquehanna",
            "label": "PA: Susquehanna"
        },
        {
            "value": "PA: Tioga",
            "label": "PA: Tioga"
        },
        {
            "value": "PA: Union",
            "label": "PA: Union"
        },
        {
            "value": "PA: Venango",
            "label": "PA: Venango"
        },
        {
            "value": "PA: Warren",
            "label": "PA: Warren"
        },
        {
            "value": "PA: Washington",
            "label": "PA: Washington"
        },
        {
            "value": "PA: Wayne",
            "label": "PA: Wayne"
        },
        {
            "value": "PA: Westmoreland",
            "label": "PA: Westmoreland"
        },
        {
            "value": "PA: Wyoming",
            "label": "PA: Wyoming"
        },
        {
            "value": "PA: York",
            "label": "PA: York"
        },
        {
            "value": "PR: Adjuntas",
            "label": "PR: Adjuntas"
        },
        {
            "value": "PR: Aguada",
            "label": "PR: Aguada"
        },
        {
            "value": "PR: Aguadilla",
            "label": "PR: Aguadilla"
        },
        {
            "value": "PR: Aguas Buenas",
            "label": "PR: Aguas Buenas"
        },
        {
            "value": "PR: Aibonito",
            "label": "PR: Aibonito"
        },
        {
            "value": "PR: Añasco",
            "label": "PR: Añasco"
        },
        {
            "value": "PR: Arecibo",
            "label": "PR: Arecibo"
        },
        {
            "value": "PR: Arroyo",
            "label": "PR: Arroyo"
        },
        {
            "value": "PR: Barceloneta",
            "label": "PR: Barceloneta"
        },
        {
            "value": "PR: Barranquitas",
            "label": "PR: Barranquitas"
        },
        {
            "value": "PR: Bayamón",
            "label": "PR: Bayamón"
        },
        {
            "value": "PR: Cabo Rojo",
            "label": "PR: Cabo Rojo"
        },
        {
            "value": "PR: Caguas",
            "label": "PR: Caguas"
        },
        {
            "value": "PR: Camuy",
            "label": "PR: Camuy"
        },
        {
            "value": "PR: Canóvanas",
            "label": "PR: Canóvanas"
        },
        {
            "value": "PR: Carolina",
            "label": "PR: Carolina"
        },
        {
            "value": "PR: Cataño",
            "label": "PR: Cataño"
        },
        {
            "value": "PR: Cayey",
            "label": "PR: Cayey"
        },
        {
            "value": "PR: Ceiba",
            "label": "PR: Ceiba"
        },
        {
            "value": "PR: Ciales",
            "label": "PR: Ciales"
        },
        {
            "value": "PR: Cidra",
            "label": "PR: Cidra"
        },
        {
            "value": "PR: Coamo",
            "label": "PR: Coamo"
        },
        {
            "value": "PR: Comerío",
            "label": "PR: Comerío"
        },
        {
            "value": "PR: Corozal",
            "label": "PR: Corozal"
        },
        {
            "value": "PR: Culebra",
            "label": "PR: Culebra"
        },
        {
            "value": "PR: Dorado",
            "label": "PR: Dorado"
        },
        {
            "value": "PR: Fajardo",
            "label": "PR: Fajardo"
        },
        {
            "value": "PR: Florida",
            "label": "PR: Florida"
        },
        {
            "value": "PR: Guánica",
            "label": "PR: Guánica"
        },
        {
            "value": "PR: Guayama",
            "label": "PR: Guayama"
        },
        {
            "value": "PR: Guayanilla",
            "label": "PR: Guayanilla"
        },
        {
            "value": "PR: Guaynabo",
            "label": "PR: Guaynabo"
        },
        {
            "value": "PR: Gurabo",
            "label": "PR: Gurabo"
        },
        {
            "value": "PR: Hatillo",
            "label": "PR: Hatillo"
        },
        {
            "value": "PR: Hormigueros",
            "label": "PR: Hormigueros"
        },
        {
            "value": "PR: Humacao",
            "label": "PR: Humacao"
        },
        {
            "value": "PR: Isabela",
            "label": "PR: Isabela"
        },
        {
            "value": "PR: Jayuya",
            "label": "PR: Jayuya"
        },
        {
            "value": "PR: Juana Díaz",
            "label": "PR: Juana Díaz"
        },
        {
            "value": "PR: Juncos",
            "label": "PR: Juncos"
        },
        {
            "value": "PR: Lajas",
            "label": "PR: Lajas"
        },
        {
            "value": "PR: Lares",
            "label": "PR: Lares"
        },
        {
            "value": "PR: Las Marías",
            "label": "PR: Las Marías"
        },
        {
            "value": "PR: Las Piedras",
            "label": "PR: Las Piedras"
        },
        {
            "value": "PR: Loíza",
            "label": "PR: Loíza"
        },
        {
            "value": "PR: Luquillo",
            "label": "PR: Luquillo"
        },
        {
            "value": "PR: Manatí",
            "label": "PR: Manatí"
        },
        {
            "value": "PR: Maricao",
            "label": "PR: Maricao"
        },
        {
            "value": "PR: Maunabo",
            "label": "PR: Maunabo"
        },
        {
            "value": "PR: Mayagüez",
            "label": "PR: Mayagüez"
        },
        {
            "value": "PR: Moca",
            "label": "PR: Moca"
        },
        {
            "value": "PR: Morovis",
            "label": "PR: Morovis"
        },
        {
            "value": "PR: Naguabo",
            "label": "PR: Naguabo"
        },
        {
            "value": "PR: Naranjito",
            "label": "PR: Naranjito"
        },
        {
            "value": "PR: Orocovis",
            "label": "PR: Orocovis"
        },
        {
            "value": "PR: Patillas",
            "label": "PR: Patillas"
        },
        {
            "value": "PR: Peñuelas",
            "label": "PR: Peñuelas"
        },
        {
            "value": "PR: Ponce",
            "label": "PR: Ponce"
        },
        {
            "value": "PR: Quebradillas",
            "label": "PR: Quebradillas"
        },
        {
            "value": "PR: Rincón",
            "label": "PR: Rincón"
        },
        {
            "value": "PR: Río Grande",
            "label": "PR: Río Grande"
        },
        {
            "value": "PR: Sabana Grande",
            "label": "PR: Sabana Grande"
        },
        {
            "value": "PR: Salinas",
            "label": "PR: Salinas"
        },
        {
            "value": "PR: San Germán",
            "label": "PR: San Germán"
        },
        {
            "value": "PR: San Juan",
            "label": "PR: San Juan"
        },
        {
            "value": "PR: San Lorenzo",
            "label": "PR: San Lorenzo"
        },
        {
            "value": "PR: San Sebastián",
            "label": "PR: San Sebastián"
        },
        {
            "value": "PR: Santa Isabel",
            "label": "PR: Santa Isabel"
        },
        {
            "value": "PR: Toa Alta",
            "label": "PR: Toa Alta"
        },
        {
            "value": "PR: Toa Baja",
            "label": "PR: Toa Baja"
        },
        {
            "value": "PR: Trujillo Alto",
            "label": "PR: Trujillo Alto"
        },
        {
            "value": "PR: Utuado",
            "label": "PR: Utuado"
        },
        {
            "value": "PR: Vega Alta",
            "label": "PR: Vega Alta"
        },
        {
            "value": "PR: Vega Baja",
            "label": "PR: Vega Baja"
        },
        {
            "value": "PR: Vieques",
            "label": "PR: Vieques"
        },
        {
            "value": "PR: Villalba",
            "label": "PR: Villalba"
        },
        {
            "value": "PR: Yabucoa",
            "label": "PR: Yabucoa"
        },
        {
            "value": "PR: Yauco",
            "label": "PR: Yauco"
        },
        {
            "value": "RI: Bristol",
            "label": "RI: Bristol"
        },
        {
            "value": "RI: Kent",
            "label": "RI: Kent"
        },
        {
            "value": "RI: Newport",
            "label": "RI: Newport"
        },
        {
            "value": "RI: Providence",
            "label": "RI: Providence"
        },
        {
            "value": "RI: Washington",
            "label": "RI: Washington"
        },
        {
            "value": "SC: Abbeville",
            "label": "SC: Abbeville"
        },
        {
            "value": "SC: Aiken",
            "label": "SC: Aiken"
        },
        {
            "value": "SC: Allendale",
            "label": "SC: Allendale"
        },
        {
            "value": "SC: Anderson",
            "label": "SC: Anderson"
        },
        {
            "value": "SC: Bamberg",
            "label": "SC: Bamberg"
        },
        {
            "value": "SC: Barnwell",
            "label": "SC: Barnwell"
        },
        {
            "value": "SC: Beaufort",
            "label": "SC: Beaufort"
        },
        {
            "value": "SC: Berkeley",
            "label": "SC: Berkeley"
        },
        {
            "value": "SC: Calhoun",
            "label": "SC: Calhoun"
        },
        {
            "value": "SC: Charleston",
            "label": "SC: Charleston"
        },
        {
            "value": "SC: Cherokee",
            "label": "SC: Cherokee"
        },
        {
            "value": "SC: Chester",
            "label": "SC: Chester"
        },
        {
            "value": "SC: Chesterfield",
            "label": "SC: Chesterfield"
        },
        {
            "value": "SC: Clarendon",
            "label": "SC: Clarendon"
        },
        {
            "value": "SC: Colleton",
            "label": "SC: Colleton"
        },
        {
            "value": "SC: Darlington",
            "label": "SC: Darlington"
        },
        {
            "value": "SC: Dillon",
            "label": "SC: Dillon"
        },
        {
            "value": "SC: Dorchester",
            "label": "SC: Dorchester"
        },
        {
            "value": "SC: Edgefield",
            "label": "SC: Edgefield"
        },
        {
            "value": "SC: Fairfield",
            "label": "SC: Fairfield"
        },
        {
            "value": "SC: Florence",
            "label": "SC: Florence"
        },
        {
            "value": "SC: Georgetown",
            "label": "SC: Georgetown"
        },
        {
            "value": "SC: Greenville",
            "label": "SC: Greenville"
        },
        {
            "value": "SC: Greenwood",
            "label": "SC: Greenwood"
        },
        {
            "value": "SC: Hampton",
            "label": "SC: Hampton"
        },
        {
            "value": "SC: Horry",
            "label": "SC: Horry"
        },
        {
            "value": "SC: Jasper",
            "label": "SC: Jasper"
        },
        {
            "value": "SC: Kershaw",
            "label": "SC: Kershaw"
        },
        {
            "value": "SC: Lancaster",
            "label": "SC: Lancaster"
        },
        {
            "value": "SC: Laurens",
            "label": "SC: Laurens"
        },
        {
            "value": "SC: Lee",
            "label": "SC: Lee"
        },
        {
            "value": "SC: Lexington",
            "label": "SC: Lexington"
        },
        {
            "value": "SC: Marion",
            "label": "SC: Marion"
        },
        {
            "value": "SC: Marlboro",
            "label": "SC: Marlboro"
        },
        {
            "value": "SC: McCormick",
            "label": "SC: McCormick"
        },
        {
            "value": "SC: Newberry",
            "label": "SC: Newberry"
        },
        {
            "value": "SC: Oconee",
            "label": "SC: Oconee"
        },
        {
            "value": "SC: Orangeburg",
            "label": "SC: Orangeburg"
        },
        {
            "value": "SC: Pickens",
            "label": "SC: Pickens"
        },
        {
            "value": "SC: Richland",
            "label": "SC: Richland"
        },
        {
            "value": "SC: Saluda",
            "label": "SC: Saluda"
        },
        {
            "value": "SC: Spartanburg",
            "label": "SC: Spartanburg"
        },
        {
            "value": "SC: Sumter",
            "label": "SC: Sumter"
        },
        {
            "value": "SC: Union",
            "label": "SC: Union"
        },
        {
            "value": "SC: Williamsburg",
            "label": "SC: Williamsburg"
        },
        {
            "value": "SC: York",
            "label": "SC: York"
        },
        {
            "value": "SD: Aurora",
            "label": "SD: Aurora"
        },
        {
            "value": "SD: Beadle",
            "label": "SD: Beadle"
        },
        {
            "value": "SD: Bennett",
            "label": "SD: Bennett"
        },
        {
            "value": "SD: Bon Homme",
            "label": "SD: Bon Homme"
        },
        {
            "value": "SD: Brookings",
            "label": "SD: Brookings"
        },
        {
            "value": "SD: Brown",
            "label": "SD: Brown"
        },
        {
            "value": "SD: Brule",
            "label": "SD: Brule"
        },
        {
            "value": "SD: Buffalo",
            "label": "SD: Buffalo"
        },
        {
            "value": "SD: Butte",
            "label": "SD: Butte"
        },
        {
            "value": "SD: Campbell",
            "label": "SD: Campbell"
        },
        {
            "value": "SD: Charles Mix",
            "label": "SD: Charles Mix"
        },
        {
            "value": "SD: Clark",
            "label": "SD: Clark"
        },
        {
            "value": "SD: Clay",
            "label": "SD: Clay"
        },
        {
            "value": "SD: Codington",
            "label": "SD: Codington"
        },
        {
            "value": "SD: Corson",
            "label": "SD: Corson"
        },
        {
            "value": "SD: Custer",
            "label": "SD: Custer"
        },
        {
            "value": "SD: Davison",
            "label": "SD: Davison"
        },
        {
            "value": "SD: Day",
            "label": "SD: Day"
        },
        {
            "value": "SD: Deuel",
            "label": "SD: Deuel"
        },
        {
            "value": "SD: Dewey",
            "label": "SD: Dewey"
        },
        {
            "value": "SD: Douglas",
            "label": "SD: Douglas"
        },
        {
            "value": "SD: Edmunds",
            "label": "SD: Edmunds"
        },
        {
            "value": "SD: Fall River",
            "label": "SD: Fall River"
        },
        {
            "value": "SD: Faulk",
            "label": "SD: Faulk"
        },
        {
            "value": "SD: Grant",
            "label": "SD: Grant"
        },
        {
            "value": "SD: Gregory",
            "label": "SD: Gregory"
        },
        {
            "value": "SD: Haakon",
            "label": "SD: Haakon"
        },
        {
            "value": "SD: Hamlin",
            "label": "SD: Hamlin"
        },
        {
            "value": "SD: Hand",
            "label": "SD: Hand"
        },
        {
            "value": "SD: Hanson",
            "label": "SD: Hanson"
        },
        {
            "value": "SD: Harding",
            "label": "SD: Harding"
        },
        {
            "value": "SD: Hughes",
            "label": "SD: Hughes"
        },
        {
            "value": "SD: Hutchinson",
            "label": "SD: Hutchinson"
        },
        {
            "value": "SD: Hyde",
            "label": "SD: Hyde"
        },
        {
            "value": "SD: Jackson",
            "label": "SD: Jackson"
        },
        {
            "value": "SD: Jerauld",
            "label": "SD: Jerauld"
        },
        {
            "value": "SD: Jones",
            "label": "SD: Jones"
        },
        {
            "value": "SD: Kingsbury",
            "label": "SD: Kingsbury"
        },
        {
            "value": "SD: Lake",
            "label": "SD: Lake"
        },
        {
            "value": "SD: Lawrence",
            "label": "SD: Lawrence"
        },
        {
            "value": "SD: Lincoln",
            "label": "SD: Lincoln"
        },
        {
            "value": "SD: Lyman",
            "label": "SD: Lyman"
        },
        {
            "value": "SD: Marshall",
            "label": "SD: Marshall"
        },
        {
            "value": "SD: McCook",
            "label": "SD: McCook"
        },
        {
            "value": "SD: McPherson",
            "label": "SD: McPherson"
        },
        {
            "value": "SD: Meade",
            "label": "SD: Meade"
        },
        {
            "value": "SD: Mellette",
            "label": "SD: Mellette"
        },
        {
            "value": "SD: Miner",
            "label": "SD: Miner"
        },
        {
            "value": "SD: Minnehaha",
            "label": "SD: Minnehaha"
        },
        {
            "value": "SD: Moody",
            "label": "SD: Moody"
        },
        {
            "value": "SD: Oglala Lakota",
            "label": "SD: Oglala Lakota"
        },
        {
            "value": "SD: Pennington",
            "label": "SD: Pennington"
        },
        {
            "value": "SD: Perkins",
            "label": "SD: Perkins"
        },
        {
            "value": "SD: Potter",
            "label": "SD: Potter"
        },
        {
            "value": "SD: Roberts",
            "label": "SD: Roberts"
        },
        {
            "value": "SD: Sanborn",
            "label": "SD: Sanborn"
        },
        {
            "value": "SD: Spink",
            "label": "SD: Spink"
        },
        {
            "value": "SD: Stanley",
            "label": "SD: Stanley"
        },
        {
            "value": "SD: Sully",
            "label": "SD: Sully"
        },
        {
            "value": "SD: Todd",
            "label": "SD: Todd"
        },
        {
            "value": "SD: Tripp",
            "label": "SD: Tripp"
        },
        {
            "value": "SD: Turner",
            "label": "SD: Turner"
        },
        {
            "value": "SD: Union",
            "label": "SD: Union"
        },
        {
            "value": "SD: Walworth",
            "label": "SD: Walworth"
        },
        {
            "value": "SD: Yankton",
            "label": "SD: Yankton"
        },
        {
            "value": "SD: Ziebach",
            "label": "SD: Ziebach"
        },
        {
            "value": "TN: Anderson",
            "label": "TN: Anderson"
        },
        {
            "value": "TN: Bedford",
            "label": "TN: Bedford"
        },
        {
            "value": "TN: Benton",
            "label": "TN: Benton"
        },
        {
            "value": "TN: Bledsoe",
            "label": "TN: Bledsoe"
        },
        {
            "value": "TN: Blount",
            "label": "TN: Blount"
        },
        {
            "value": "TN: Bradley",
            "label": "TN: Bradley"
        },
        {
            "value": "TN: Campbell",
            "label": "TN: Campbell"
        },
        {
            "value": "TN: Cannon",
            "label": "TN: Cannon"
        },
        {
            "value": "TN: Carroll",
            "label": "TN: Carroll"
        },
        {
            "value": "TN: Carter",
            "label": "TN: Carter"
        },
        {
            "value": "TN: Cheatham",
            "label": "TN: Cheatham"
        },
        {
            "value": "TN: Chester",
            "label": "TN: Chester"
        },
        {
            "value": "TN: Claiborne",
            "label": "TN: Claiborne"
        },
        {
            "value": "TN: Clay",
            "label": "TN: Clay"
        },
        {
            "value": "TN: Cocke",
            "label": "TN: Cocke"
        },
        {
            "value": "TN: Coffee",
            "label": "TN: Coffee"
        },
        {
            "value": "TN: Crockett",
            "label": "TN: Crockett"
        },
        {
            "value": "TN: Cumberland",
            "label": "TN: Cumberland"
        },
        {
            "value": "TN: Davidson",
            "label": "TN: Davidson"
        },
        {
            "value": "TN: Decatur",
            "label": "TN: Decatur"
        },
        {
            "value": "TN: DeKalb",
            "label": "TN: DeKalb"
        },
        {
            "value": "TN: Dickson",
            "label": "TN: Dickson"
        },
        {
            "value": "TN: Dyer",
            "label": "TN: Dyer"
        },
        {
            "value": "TN: Fayette",
            "label": "TN: Fayette"
        },
        {
            "value": "TN: Fentress",
            "label": "TN: Fentress"
        },
        {
            "value": "TN: Franklin",
            "label": "TN: Franklin"
        },
        {
            "value": "TN: Gibson",
            "label": "TN: Gibson"
        },
        {
            "value": "TN: Giles",
            "label": "TN: Giles"
        },
        {
            "value": "TN: Grainger",
            "label": "TN: Grainger"
        },
        {
            "value": "TN: Greene",
            "label": "TN: Greene"
        },
        {
            "value": "TN: Grundy",
            "label": "TN: Grundy"
        },
        {
            "value": "TN: Hamblen",
            "label": "TN: Hamblen"
        },
        {
            "value": "TN: Hamilton",
            "label": "TN: Hamilton"
        },
        {
            "value": "TN: Hancock",
            "label": "TN: Hancock"
        },
        {
            "value": "TN: Hardeman",
            "label": "TN: Hardeman"
        },
        {
            "value": "TN: Hardin",
            "label": "TN: Hardin"
        },
        {
            "value": "TN: Hawkins",
            "label": "TN: Hawkins"
        },
        {
            "value": "TN: Haywood",
            "label": "TN: Haywood"
        },
        {
            "value": "TN: Henderson",
            "label": "TN: Henderson"
        },
        {
            "value": "TN: Henry",
            "label": "TN: Henry"
        },
        {
            "value": "TN: Hickman",
            "label": "TN: Hickman"
        },
        {
            "value": "TN: Houston",
            "label": "TN: Houston"
        },
        {
            "value": "TN: Humphreys",
            "label": "TN: Humphreys"
        },
        {
            "value": "TN: Jackson",
            "label": "TN: Jackson"
        },
        {
            "value": "TN: Jefferson",
            "label": "TN: Jefferson"
        },
        {
            "value": "TN: Johnson",
            "label": "TN: Johnson"
        },
        {
            "value": "TN: Knox",
            "label": "TN: Knox"
        },
        {
            "value": "TN: Lake",
            "label": "TN: Lake"
        },
        {
            "value": "TN: Lauderdale",
            "label": "TN: Lauderdale"
        },
        {
            "value": "TN: Lawrence",
            "label": "TN: Lawrence"
        },
        {
            "value": "TN: Lewis",
            "label": "TN: Lewis"
        },
        {
            "value": "TN: Lincoln",
            "label": "TN: Lincoln"
        },
        {
            "value": "TN: Loudon",
            "label": "TN: Loudon"
        },
        {
            "value": "TN: Macon",
            "label": "TN: Macon"
        },
        {
            "value": "TN: Madison",
            "label": "TN: Madison"
        },
        {
            "value": "TN: Marion",
            "label": "TN: Marion"
        },
        {
            "value": "TN: Marshall",
            "label": "TN: Marshall"
        },
        {
            "value": "TN: Maury",
            "label": "TN: Maury"
        },
        {
            "value": "TN: McMinn",
            "label": "TN: McMinn"
        },
        {
            "value": "TN: McNairy",
            "label": "TN: McNairy"
        },
        {
            "value": "TN: Meigs",
            "label": "TN: Meigs"
        },
        {
            "value": "TN: Monroe",
            "label": "TN: Monroe"
        },
        {
            "value": "TN: Montgomery",
            "label": "TN: Montgomery"
        },
        {
            "value": "TN: Moore",
            "label": "TN: Moore"
        },
        {
            "value": "TN: Morgan",
            "label": "TN: Morgan"
        },
        {
            "value": "TN: Obion",
            "label": "TN: Obion"
        },
        {
            "value": "TN: Overton",
            "label": "TN: Overton"
        },
        {
            "value": "TN: Perry",
            "label": "TN: Perry"
        },
        {
            "value": "TN: Pickett",
            "label": "TN: Pickett"
        },
        {
            "value": "TN: Polk",
            "label": "TN: Polk"
        },
        {
            "value": "TN: Putnam",
            "label": "TN: Putnam"
        },
        {
            "value": "TN: Rhea",
            "label": "TN: Rhea"
        },
        {
            "value": "TN: Roane",
            "label": "TN: Roane"
        },
        {
            "value": "TN: Robertson",
            "label": "TN: Robertson"
        },
        {
            "value": "TN: Rutherford",
            "label": "TN: Rutherford"
        },
        {
            "value": "TN: Scott",
            "label": "TN: Scott"
        },
        {
            "value": "TN: Sequatchie",
            "label": "TN: Sequatchie"
        },
        {
            "value": "TN: Sevier",
            "label": "TN: Sevier"
        },
        {
            "value": "TN: Shelby",
            "label": "TN: Shelby"
        },
        {
            "value": "TN: Smith",
            "label": "TN: Smith"
        },
        {
            "value": "TN: Stewart",
            "label": "TN: Stewart"
        },
        {
            "value": "TN: Sullivan",
            "label": "TN: Sullivan"
        },
        {
            "value": "TN: Sumner",
            "label": "TN: Sumner"
        },
        {
            "value": "TN: Tipton",
            "label": "TN: Tipton"
        },
        {
            "value": "TN: Trousdale",
            "label": "TN: Trousdale"
        },
        {
            "value": "TN: Unicoi",
            "label": "TN: Unicoi"
        },
        {
            "value": "TN: Union",
            "label": "TN: Union"
        },
        {
            "value": "TN: Van Buren",
            "label": "TN: Van Buren"
        },
        {
            "value": "TN: Warren",
            "label": "TN: Warren"
        },
        {
            "value": "TN: Washington",
            "label": "TN: Washington"
        },
        {
            "value": "TN: Wayne",
            "label": "TN: Wayne"
        },
        {
            "value": "TN: Weakley",
            "label": "TN: Weakley"
        },
        {
            "value": "TN: White",
            "label": "TN: White"
        },
        {
            "value": "TN: Williamson",
            "label": "TN: Williamson"
        },
        {
            "value": "TN: Wilson",
            "label": "TN: Wilson"
        },
        {
            "value": "TX: Anderson",
            "label": "TX: Anderson"
        },
        {
            "value": "TX: Andrews",
            "label": "TX: Andrews"
        },
        {
            "value": "TX: Angelina",
            "label": "TX: Angelina"
        },
        {
            "value": "TX: Aransas",
            "label": "TX: Aransas"
        },
        {
            "value": "TX: Archer",
            "label": "TX: Archer"
        },
        {
            "value": "TX: Armstrong",
            "label": "TX: Armstrong"
        },
        {
            "value": "TX: Atascosa",
            "label": "TX: Atascosa"
        },
        {
            "value": "TX: Austin",
            "label": "TX: Austin"
        },
        {
            "value": "TX: Bailey",
            "label": "TX: Bailey"
        },
        {
            "value": "TX: Bandera",
            "label": "TX: Bandera"
        },
        {
            "value": "TX: Bastrop",
            "label": "TX: Bastrop"
        },
        {
            "value": "TX: Baylor",
            "label": "TX: Baylor"
        },
        {
            "value": "TX: Bee",
            "label": "TX: Bee"
        },
        {
            "value": "TX: Bell",
            "label": "TX: Bell"
        },
        {
            "value": "TX: Bexar",
            "label": "TX: Bexar"
        },
        {
            "value": "TX: Blanco",
            "label": "TX: Blanco"
        },
        {
            "value": "TX: Borden",
            "label": "TX: Borden"
        },
        {
            "value": "TX: Bosque",
            "label": "TX: Bosque"
        },
        {
            "value": "TX: Bowie",
            "label": "TX: Bowie"
        },
        {
            "value": "TX: Brazoria",
            "label": "TX: Brazoria"
        },
        {
            "value": "TX: Brazos",
            "label": "TX: Brazos"
        },
        {
            "value": "TX: Brewster",
            "label": "TX: Brewster"
        },
        {
            "value": "TX: Briscoe",
            "label": "TX: Briscoe"
        },
        {
            "value": "TX: Brooks",
            "label": "TX: Brooks"
        },
        {
            "value": "TX: Brown",
            "label": "TX: Brown"
        },
        {
            "value": "TX: Burleson",
            "label": "TX: Burleson"
        },
        {
            "value": "TX: Burnet",
            "label": "TX: Burnet"
        },
        {
            "value": "TX: Caldwell",
            "label": "TX: Caldwell"
        },
        {
            "value": "TX: Calhoun",
            "label": "TX: Calhoun"
        },
        {
            "value": "TX: Callahan",
            "label": "TX: Callahan"
        },
        {
            "value": "TX: Cameron",
            "label": "TX: Cameron"
        },
        {
            "value": "TX: Camp",
            "label": "TX: Camp"
        },
        {
            "value": "TX: Carson",
            "label": "TX: Carson"
        },
        {
            "value": "TX: Cass",
            "label": "TX: Cass"
        },
        {
            "value": "TX: Castro",
            "label": "TX: Castro"
        },
        {
            "value": "TX: Chambers",
            "label": "TX: Chambers"
        },
        {
            "value": "TX: Cherokee",
            "label": "TX: Cherokee"
        },
        {
            "value": "TX: Childress",
            "label": "TX: Childress"
        },
        {
            "value": "TX: Clay",
            "label": "TX: Clay"
        },
        {
            "value": "TX: Cochran",
            "label": "TX: Cochran"
        },
        {
            "value": "TX: Coke",
            "label": "TX: Coke"
        },
        {
            "value": "TX: Coleman",
            "label": "TX: Coleman"
        },
        {
            "value": "TX: Collin",
            "label": "TX: Collin"
        },
        {
            "value": "TX: Collingsworth",
            "label": "TX: Collingsworth"
        },
        {
            "value": "TX: Colorado",
            "label": "TX: Colorado"
        },
        {
            "value": "TX: Comal",
            "label": "TX: Comal"
        },
        {
            "value": "TX: Comanche",
            "label": "TX: Comanche"
        },
        {
            "value": "TX: Concho",
            "label": "TX: Concho"
        },
        {
            "value": "TX: Cooke",
            "label": "TX: Cooke"
        },
        {
            "value": "TX: Coryell",
            "label": "TX: Coryell"
        },
        {
            "value": "TX: Cottle",
            "label": "TX: Cottle"
        },
        {
            "value": "TX: Crane",
            "label": "TX: Crane"
        },
        {
            "value": "TX: Crockett",
            "label": "TX: Crockett"
        },
        {
            "value": "TX: Crosby",
            "label": "TX: Crosby"
        },
        {
            "value": "TX: Culberson",
            "label": "TX: Culberson"
        },
        {
            "value": "TX: Dallam",
            "label": "TX: Dallam"
        },
        {
            "value": "TX: Dallas",
            "label": "TX: Dallas"
        },
        {
            "value": "TX: Dawson",
            "label": "TX: Dawson"
        },
        {
            "value": "TX: Deaf Smith",
            "label": "TX: Deaf Smith"
        },
        {
            "value": "TX: Delta",
            "label": "TX: Delta"
        },
        {
            "value": "TX: Denton",
            "label": "TX: Denton"
        },
        {
            "value": "TX: DeWitt",
            "label": "TX: DeWitt"
        },
        {
            "value": "TX: Dickens",
            "label": "TX: Dickens"
        },
        {
            "value": "TX: Dimmit",
            "label": "TX: Dimmit"
        },
        {
            "value": "TX: Donley",
            "label": "TX: Donley"
        },
        {
            "value": "TX: Duval",
            "label": "TX: Duval"
        },
        {
            "value": "TX: Eastland",
            "label": "TX: Eastland"
        },
        {
            "value": "TX: Ector",
            "label": "TX: Ector"
        },
        {
            "value": "TX: Edwards",
            "label": "TX: Edwards"
        },
        {
            "value": "TX: El Paso",
            "label": "TX: El Paso"
        },
        {
            "value": "TX: Ellis",
            "label": "TX: Ellis"
        },
        {
            "value": "TX: Erath",
            "label": "TX: Erath"
        },
        {
            "value": "TX: Falls",
            "label": "TX: Falls"
        },
        {
            "value": "TX: Fannin",
            "label": "TX: Fannin"
        },
        {
            "value": "TX: Fayette",
            "label": "TX: Fayette"
        },
        {
            "value": "TX: Fisher",
            "label": "TX: Fisher"
        },
        {
            "value": "TX: Floyd",
            "label": "TX: Floyd"
        },
        {
            "value": "TX: Foard",
            "label": "TX: Foard"
        },
        {
            "value": "TX: Fort Bend",
            "label": "TX: Fort Bend"
        },
        {
            "value": "TX: Franklin",
            "label": "TX: Franklin"
        },
        {
            "value": "TX: Freestone",
            "label": "TX: Freestone"
        },
        {
            "value": "TX: Frio",
            "label": "TX: Frio"
        },
        {
            "value": "TX: Gaines",
            "label": "TX: Gaines"
        },
        {
            "value": "TX: Galveston",
            "label": "TX: Galveston"
        },
        {
            "value": "TX: Garza",
            "label": "TX: Garza"
        },
        {
            "value": "TX: Gillespie",
            "label": "TX: Gillespie"
        },
        {
            "value": "TX: Glasscock",
            "label": "TX: Glasscock"
        },
        {
            "value": "TX: Goliad",
            "label": "TX: Goliad"
        },
        {
            "value": "TX: Gonzales",
            "label": "TX: Gonzales"
        },
        {
            "value": "TX: Gray",
            "label": "TX: Gray"
        },
        {
            "value": "TX: Grayson",
            "label": "TX: Grayson"
        },
        {
            "value": "TX: Gregg",
            "label": "TX: Gregg"
        },
        {
            "value": "TX: Grimes",
            "label": "TX: Grimes"
        },
        {
            "value": "TX: Guadalupe",
            "label": "TX: Guadalupe"
        },
        {
            "value": "TX: Hale",
            "label": "TX: Hale"
        },
        {
            "value": "TX: Hall",
            "label": "TX: Hall"
        },
        {
            "value": "TX: Hamilton",
            "label": "TX: Hamilton"
        },
        {
            "value": "TX: Hansford",
            "label": "TX: Hansford"
        },
        {
            "value": "TX: Hardeman",
            "label": "TX: Hardeman"
        },
        {
            "value": "TX: Hardin",
            "label": "TX: Hardin"
        },
        {
            "value": "TX: Harris",
            "label": "TX: Harris"
        },
        {
            "value": "TX: Harrison",
            "label": "TX: Harrison"
        },
        {
            "value": "TX: Hartley",
            "label": "TX: Hartley"
        },
        {
            "value": "TX: Haskell",
            "label": "TX: Haskell"
        },
        {
            "value": "TX: Hays",
            "label": "TX: Hays"
        },
        {
            "value": "TX: Hemphill",
            "label": "TX: Hemphill"
        },
        {
            "value": "TX: Henderson",
            "label": "TX: Henderson"
        },
        {
            "value": "TX: Hidalgo",
            "label": "TX: Hidalgo"
        },
        {
            "value": "TX: Hill",
            "label": "TX: Hill"
        },
        {
            "value": "TX: Hockley",
            "label": "TX: Hockley"
        },
        {
            "value": "TX: Hood",
            "label": "TX: Hood"
        },
        {
            "value": "TX: Hopkins",
            "label": "TX: Hopkins"
        },
        {
            "value": "TX: Houston",
            "label": "TX: Houston"
        },
        {
            "value": "TX: Howard",
            "label": "TX: Howard"
        },
        {
            "value": "TX: Hudspeth",
            "label": "TX: Hudspeth"
        },
        {
            "value": "TX: Hunt",
            "label": "TX: Hunt"
        },
        {
            "value": "TX: Hutchinson",
            "label": "TX: Hutchinson"
        },
        {
            "value": "TX: Irion",
            "label": "TX: Irion"
        },
        {
            "value": "TX: Jack",
            "label": "TX: Jack"
        },
        {
            "value": "TX: Jackson",
            "label": "TX: Jackson"
        },
        {
            "value": "TX: Jasper",
            "label": "TX: Jasper"
        },
        {
            "value": "TX: Jeff Davis",
            "label": "TX: Jeff Davis"
        },
        {
            "value": "TX: Jefferson",
            "label": "TX: Jefferson"
        },
        {
            "value": "TX: Jim Hogg",
            "label": "TX: Jim Hogg"
        },
        {
            "value": "TX: Jim Wells",
            "label": "TX: Jim Wells"
        },
        {
            "value": "TX: Johnson",
            "label": "TX: Johnson"
        },
        {
            "value": "TX: Jones",
            "label": "TX: Jones"
        },
        {
            "value": "TX: Karnes",
            "label": "TX: Karnes"
        },
        {
            "value": "TX: Kaufman",
            "label": "TX: Kaufman"
        },
        {
            "value": "TX: Kendall",
            "label": "TX: Kendall"
        },
        {
            "value": "TX: Kenedy",
            "label": "TX: Kenedy"
        },
        {
            "value": "TX: Kent",
            "label": "TX: Kent"
        },
        {
            "value": "TX: Kerr",
            "label": "TX: Kerr"
        },
        {
            "value": "TX: Kimble",
            "label": "TX: Kimble"
        },
        {
            "value": "TX: King",
            "label": "TX: King"
        },
        {
            "value": "TX: Kinney",
            "label": "TX: Kinney"
        },
        {
            "value": "TX: Kleberg",
            "label": "TX: Kleberg"
        },
        {
            "value": "TX: Knox",
            "label": "TX: Knox"
        },
        {
            "value": "TX: La Salle",
            "label": "TX: La Salle"
        },
        {
            "value": "TX: Lamar",
            "label": "TX: Lamar"
        },
        {
            "value": "TX: Lamb",
            "label": "TX: Lamb"
        },
        {
            "value": "TX: Lampasas",
            "label": "TX: Lampasas"
        },
        {
            "value": "TX: Lavaca",
            "label": "TX: Lavaca"
        },
        {
            "value": "TX: Lee",
            "label": "TX: Lee"
        },
        {
            "value": "TX: Leon",
            "label": "TX: Leon"
        },
        {
            "value": "TX: Liberty",
            "label": "TX: Liberty"
        },
        {
            "value": "TX: Limestone",
            "label": "TX: Limestone"
        },
        {
            "value": "TX: Lipscomb",
            "label": "TX: Lipscomb"
        },
        {
            "value": "TX: Live Oak",
            "label": "TX: Live Oak"
        },
        {
            "value": "TX: Llano",
            "label": "TX: Llano"
        },
        {
            "value": "TX: Loving",
            "label": "TX: Loving"
        },
        {
            "value": "TX: Lubbock",
            "label": "TX: Lubbock"
        },
        {
            "value": "TX: Lynn",
            "label": "TX: Lynn"
        },
        {
            "value": "TX: Madison",
            "label": "TX: Madison"
        },
        {
            "value": "TX: Marion",
            "label": "TX: Marion"
        },
        {
            "value": "TX: Martin",
            "label": "TX: Martin"
        },
        {
            "value": "TX: Mason",
            "label": "TX: Mason"
        },
        {
            "value": "TX: Matagorda",
            "label": "TX: Matagorda"
        },
        {
            "value": "TX: Maverick",
            "label": "TX: Maverick"
        },
        {
            "value": "TX: McCulloch",
            "label": "TX: McCulloch"
        },
        {
            "value": "TX: McLennan",
            "label": "TX: McLennan"
        },
        {
            "value": "TX: McMullen",
            "label": "TX: McMullen"
        },
        {
            "value": "TX: Medina",
            "label": "TX: Medina"
        },
        {
            "value": "TX: Menard",
            "label": "TX: Menard"
        },
        {
            "value": "TX: Midland",
            "label": "TX: Midland"
        },
        {
            "value": "TX: Milam",
            "label": "TX: Milam"
        },
        {
            "value": "TX: Mills",
            "label": "TX: Mills"
        },
        {
            "value": "TX: Mitchell",
            "label": "TX: Mitchell"
        },
        {
            "value": "TX: Montague",
            "label": "TX: Montague"
        },
        {
            "value": "TX: Montgomery",
            "label": "TX: Montgomery"
        },
        {
            "value": "TX: Moore",
            "label": "TX: Moore"
        },
        {
            "value": "TX: Morris",
            "label": "TX: Morris"
        },
        {
            "value": "TX: Motley",
            "label": "TX: Motley"
        },
        {
            "value": "TX: Nacogdoches",
            "label": "TX: Nacogdoches"
        },
        {
            "value": "TX: Navarro",
            "label": "TX: Navarro"
        },
        {
            "value": "TX: Newton",
            "label": "TX: Newton"
        },
        {
            "value": "TX: Nolan",
            "label": "TX: Nolan"
        },
        {
            "value": "TX: Nueces",
            "label": "TX: Nueces"
        },
        {
            "value": "TX: Ochiltree",
            "label": "TX: Ochiltree"
        },
        {
            "value": "TX: Oldham",
            "label": "TX: Oldham"
        },
        {
            "value": "TX: Orange",
            "label": "TX: Orange"
        },
        {
            "value": "TX: Palo Pinto",
            "label": "TX: Palo Pinto"
        },
        {
            "value": "TX: Panola",
            "label": "TX: Panola"
        },
        {
            "value": "TX: Parker",
            "label": "TX: Parker"
        },
        {
            "value": "TX: Parmer",
            "label": "TX: Parmer"
        },
        {
            "value": "TX: Pecos",
            "label": "TX: Pecos"
        },
        {
            "value": "TX: Polk",
            "label": "TX: Polk"
        },
        {
            "value": "TX: Potter",
            "label": "TX: Potter"
        },
        {
            "value": "TX: Presidio",
            "label": "TX: Presidio"
        },
        {
            "value": "TX: Rains",
            "label": "TX: Rains"
        },
        {
            "value": "TX: Randall",
            "label": "TX: Randall"
        },
        {
            "value": "TX: Reagan",
            "label": "TX: Reagan"
        },
        {
            "value": "TX: Real",
            "label": "TX: Real"
        },
        {
            "value": "TX: Red River",
            "label": "TX: Red River"
        },
        {
            "value": "TX: Reeves",
            "label": "TX: Reeves"
        },
        {
            "value": "TX: Refugio",
            "label": "TX: Refugio"
        },
        {
            "value": "TX: Roberts",
            "label": "TX: Roberts"
        },
        {
            "value": "TX: Robertson",
            "label": "TX: Robertson"
        },
        {
            "value": "TX: Rockwall",
            "label": "TX: Rockwall"
        },
        {
            "value": "TX: Runnels",
            "label": "TX: Runnels"
        },
        {
            "value": "TX: Rusk",
            "label": "TX: Rusk"
        },
        {
            "value": "TX: Sabine",
            "label": "TX: Sabine"
        },
        {
            "value": "TX: San Augustine",
            "label": "TX: San Augustine"
        },
        {
            "value": "TX: San Jacinto",
            "label": "TX: San Jacinto"
        },
        {
            "value": "TX: San Patricio",
            "label": "TX: San Patricio"
        },
        {
            "value": "TX: San Saba",
            "label": "TX: San Saba"
        },
        {
            "value": "TX: Schleicher",
            "label": "TX: Schleicher"
        },
        {
            "value": "TX: Scurry",
            "label": "TX: Scurry"
        },
        {
            "value": "TX: Shackelford",
            "label": "TX: Shackelford"
        },
        {
            "value": "TX: Shelby",
            "label": "TX: Shelby"
        },
        {
            "value": "TX: Sherman",
            "label": "TX: Sherman"
        },
        {
            "value": "TX: Smith",
            "label": "TX: Smith"
        },
        {
            "value": "TX: Somervell",
            "label": "TX: Somervell"
        },
        {
            "value": "TX: Starr",
            "label": "TX: Starr"
        },
        {
            "value": "TX: Stephens",
            "label": "TX: Stephens"
        },
        {
            "value": "TX: Sterling",
            "label": "TX: Sterling"
        },
        {
            "value": "TX: Stonewall",
            "label": "TX: Stonewall"
        },
        {
            "value": "TX: Sutton",
            "label": "TX: Sutton"
        },
        {
            "value": "TX: Swisher",
            "label": "TX: Swisher"
        },
        {
            "value": "TX: Tarrant",
            "label": "TX: Tarrant"
        },
        {
            "value": "TX: Taylor",
            "label": "TX: Taylor"
        },
        {
            "value": "TX: Terrell",
            "label": "TX: Terrell"
        },
        {
            "value": "TX: Terry",
            "label": "TX: Terry"
        },
        {
            "value": "TX: Throckmorton",
            "label": "TX: Throckmorton"
        },
        {
            "value": "TX: Titus",
            "label": "TX: Titus"
        },
        {
            "value": "TX: Tom Green",
            "label": "TX: Tom Green"
        },
        {
            "value": "TX: Travis",
            "label": "TX: Travis"
        },
        {
            "value": "TX: Trinity",
            "label": "TX: Trinity"
        },
        {
            "value": "TX: Tyler",
            "label": "TX: Tyler"
        },
        {
            "value": "TX: Upshur",
            "label": "TX: Upshur"
        },
        {
            "value": "TX: Upton",
            "label": "TX: Upton"
        },
        {
            "value": "TX: Uvalde",
            "label": "TX: Uvalde"
        },
        {
            "value": "TX: Val Verde",
            "label": "TX: Val Verde"
        },
        {
            "value": "TX: Van Zandt",
            "label": "TX: Van Zandt"
        },
        {
            "value": "TX: Victoria",
            "label": "TX: Victoria"
        },
        {
            "value": "TX: Walker",
            "label": "TX: Walker"
        },
        {
            "value": "TX: Waller",
            "label": "TX: Waller"
        },
        {
            "value": "TX: Ward",
            "label": "TX: Ward"
        },
        {
            "value": "TX: Washington",
            "label": "TX: Washington"
        },
        {
            "value": "TX: Webb",
            "label": "TX: Webb"
        },
        {
            "value": "TX: Wharton",
            "label": "TX: Wharton"
        },
        {
            "value": "TX: Wheeler",
            "label": "TX: Wheeler"
        },
        {
            "value": "TX: Wichita",
            "label": "TX: Wichita"
        },
        {
            "value": "TX: Wilbarger",
            "label": "TX: Wilbarger"
        },
        {
            "value": "TX: Willacy",
            "label": "TX: Willacy"
        },
        {
            "value": "TX: Williamson",
            "label": "TX: Williamson"
        },
        {
            "value": "TX: Wilson",
            "label": "TX: Wilson"
        },
        {
            "value": "TX: Winkler",
            "label": "TX: Winkler"
        },
        {
            "value": "TX: Wise",
            "label": "TX: Wise"
        },
        {
            "value": "TX: Wood",
            "label": "TX: Wood"
        },
        {
            "value": "TX: Yoakum",
            "label": "TX: Yoakum"
        },
        {
            "value": "TX: Young",
            "label": "TX: Young"
        },
        {
            "value": "TX: Zapata",
            "label": "TX: Zapata"
        },
        {
            "value": "TX: Zavala",
            "label": "TX: Zavala"
        },
        {
            "value": "UT: Beaver",
            "label": "UT: Beaver"
        },
        {
            "value": "UT: Box Elder",
            "label": "UT: Box Elder"
        },
        {
            "value": "UT: Cache",
            "label": "UT: Cache"
        },
        {
            "value": "UT: Carbon",
            "label": "UT: Carbon"
        },
        {
            "value": "UT: Daggett",
            "label": "UT: Daggett"
        },
        {
            "value": "UT: Davis",
            "label": "UT: Davis"
        },
        {
            "value": "UT: Duchesne",
            "label": "UT: Duchesne"
        },
        {
            "value": "UT: Emery",
            "label": "UT: Emery"
        },
        {
            "value": "UT: Garfield",
            "label": "UT: Garfield"
        },
        {
            "value": "UT: Grand",
            "label": "UT: Grand"
        },
        {
            "value": "UT: Iron",
            "label": "UT: Iron"
        },
        {
            "value": "UT: Juab",
            "label": "UT: Juab"
        },
        {
            "value": "UT: Kane",
            "label": "UT: Kane"
        },
        {
            "value": "UT: Millard",
            "label": "UT: Millard"
        },
        {
            "value": "UT: Morgan",
            "label": "UT: Morgan"
        },
        {
            "value": "UT: Piute",
            "label": "UT: Piute"
        },
        {
            "value": "UT: Rich",
            "label": "UT: Rich"
        },
        {
            "value": "UT: Salt Lake",
            "label": "UT: Salt Lake"
        },
        {
            "value": "UT: San Juan",
            "label": "UT: San Juan"
        },
        {
            "value": "UT: Sanpete",
            "label": "UT: Sanpete"
        },
        {
            "value": "UT: Sevier",
            "label": "UT: Sevier"
        },
        {
            "value": "UT: Summit",
            "label": "UT: Summit"
        },
        {
            "value": "UT: Tooele",
            "label": "UT: Tooele"
        },
        {
            "value": "UT: Uintah",
            "label": "UT: Uintah"
        },
        {
            "value": "UT: Utah",
            "label": "UT: Utah"
        },
        {
            "value": "UT: Wasatch",
            "label": "UT: Wasatch"
        },
        {
            "value": "UT: Washington",
            "label": "UT: Washington"
        },
        {
            "value": "UT: Wayne",
            "label": "UT: Wayne"
        },
        {
            "value": "UT: Weber",
            "label": "UT: Weber"
        },
        {
            "value": "VA: Accomack",
            "label": "VA: Accomack"
        },
        {
            "value": "VA: Albemarle",
            "label": "VA: Albemarle"
        },
        {
            "value": "VA: Alexandria",
            "label": "VA: Alexandria"
        },
        {
            "value": "VA: Alleghany",
            "label": "VA: Alleghany"
        },
        {
            "value": "VA: Amelia",
            "label": "VA: Amelia"
        },
        {
            "value": "VA: Amherst",
            "label": "VA: Amherst"
        },
        {
            "value": "VA: Appomattox",
            "label": "VA: Appomattox"
        },
        {
            "value": "VA: Arlington",
            "label": "VA: Arlington"
        },
        {
            "value": "VA: Augusta",
            "label": "VA: Augusta"
        },
        {
            "value": "VA: Bath",
            "label": "VA: Bath"
        },
        {
            "value": "VA: Bedford",
            "label": "VA: Bedford"
        },
        {
            "value": "VA: Bland",
            "label": "VA: Bland"
        },
        {
            "value": "VA: Botetourt",
            "label": "VA: Botetourt"
        },
        {
            "value": "VA: Bristol",
            "label": "VA: Bristol"
        },
        {
            "value": "VA: Brunswick",
            "label": "VA: Brunswick"
        },
        {
            "value": "VA: Buchanan",
            "label": "VA: Buchanan"
        },
        {
            "value": "VA: Buckingham",
            "label": "VA: Buckingham"
        },
        {
            "value": "VA: Buena Vista",
            "label": "VA: Buena Vista"
        },
        {
            "value": "VA: Campbell",
            "label": "VA: Campbell"
        },
        {
            "value": "VA: Caroline",
            "label": "VA: Caroline"
        },
        {
            "value": "VA: Carroll",
            "label": "VA: Carroll"
        },
        {
            "value": "VA: Charles City",
            "label": "VA: Charles City"
        },
        {
            "value": "VA: Charlotte",
            "label": "VA: Charlotte"
        },
        {
            "value": "VA: Charlottesville",
            "label": "VA: Charlottesville"
        },
        {
            "value": "VA: Chesapeake",
            "label": "VA: Chesapeake"
        },
        {
            "value": "VA: Chesterfield",
            "label": "VA: Chesterfield"
        },
        {
            "value": "VA: Clarke",
            "label": "VA: Clarke"
        },
        {
            "value": "VA: Colonial Heights",
            "label": "VA: Colonial Heights"
        },
        {
            "value": "VA: Covington",
            "label": "VA: Covington"
        },
        {
            "value": "VA: Craig",
            "label": "VA: Craig"
        },
        {
            "value": "VA: Culpeper",
            "label": "VA: Culpeper"
        },
        {
            "value": "VA: Cumberland",
            "label": "VA: Cumberland"
        },
        {
            "value": "VA: Danville",
            "label": "VA: Danville"
        },
        {
            "value": "VA: Dickenson",
            "label": "VA: Dickenson"
        },
        {
            "value": "VA: Dinwiddie",
            "label": "VA: Dinwiddie"
        },
        {
            "value": "VA: Emporia",
            "label": "VA: Emporia"
        },
        {
            "value": "VA: Essex",
            "label": "VA: Essex"
        },
        {
            "value": "VA: Fairfax",
            "label": "VA: Fairfax"
        },
        {
            "value": "VA: Fairfax",
            "label": "VA: Fairfax"
        },
        {
            "value": "VA: Falls Church",
            "label": "VA: Falls Church"
        },
        {
            "value": "VA: Fauquier",
            "label": "VA: Fauquier"
        },
        {
            "value": "VA: Floyd",
            "label": "VA: Floyd"
        },
        {
            "value": "VA: Fluvanna",
            "label": "VA: Fluvanna"
        },
        {
            "value": "VA: Franklin",
            "label": "VA: Franklin"
        },
        {
            "value": "VA: Franklin",
            "label": "VA: Franklin"
        },
        {
            "value": "VA: Frederick",
            "label": "VA: Frederick"
        },
        {
            "value": "VA: Fredericksburg",
            "label": "VA: Fredericksburg"
        },
        {
            "value": "VA: Galax",
            "label": "VA: Galax"
        },
        {
            "value": "VA: Giles",
            "label": "VA: Giles"
        },
        {
            "value": "VA: Gloucester",
            "label": "VA: Gloucester"
        },
        {
            "value": "VA: Goochland",
            "label": "VA: Goochland"
        },
        {
            "value": "VA: Grayson",
            "label": "VA: Grayson"
        },
        {
            "value": "VA: Greene",
            "label": "VA: Greene"
        },
        {
            "value": "VA: Greensville",
            "label": "VA: Greensville"
        },
        {
            "value": "VA: Halifax",
            "label": "VA: Halifax"
        },
        {
            "value": "VA: Hampton",
            "label": "VA: Hampton"
        },
        {
            "value": "VA: Hanover",
            "label": "VA: Hanover"
        },
        {
            "value": "VA: Harrisonburg",
            "label": "VA: Harrisonburg"
        },
        {
            "value": "VA: Henrico",
            "label": "VA: Henrico"
        },
        {
            "value": "VA: Henry",
            "label": "VA: Henry"
        },
        {
            "value": "VA: Highland",
            "label": "VA: Highland"
        },
        {
            "value": "VA: Hopewell",
            "label": "VA: Hopewell"
        },
        {
            "value": "VA: Isle of Wight",
            "label": "VA: Isle of Wight"
        },
        {
            "value": "VA: James City",
            "label": "VA: James City"
        },
        {
            "value": "VA: King and Queen",
            "label": "VA: King and Queen"
        },
        {
            "value": "VA: King George",
            "label": "VA: King George"
        },
        {
            "value": "VA: King William",
            "label": "VA: King William"
        },
        {
            "value": "VA: Lancaster",
            "label": "VA: Lancaster"
        },
        {
            "value": "VA: Lee",
            "label": "VA: Lee"
        },
        {
            "value": "VA: Lexington",
            "label": "VA: Lexington"
        },
        {
            "value": "VA: Loudoun",
            "label": "VA: Loudoun"
        },
        {
            "value": "VA: Louisa",
            "label": "VA: Louisa"
        },
        {
            "value": "VA: Lunenburg",
            "label": "VA: Lunenburg"
        },
        {
            "value": "VA: Lynchburg",
            "label": "VA: Lynchburg"
        },
        {
            "value": "VA: Madison",
            "label": "VA: Madison"
        },
        {
            "value": "VA: Manassas",
            "label": "VA: Manassas"
        },
        {
            "value": "VA: Manassas Park",
            "label": "VA: Manassas Park"
        },
        {
            "value": "VA: Martinsville",
            "label": "VA: Martinsville"
        },
        {
            "value": "VA: Mathews",
            "label": "VA: Mathews"
        },
        {
            "value": "VA: Mecklenburg",
            "label": "VA: Mecklenburg"
        },
        {
            "value": "VA: Middlesex",
            "label": "VA: Middlesex"
        },
        {
            "value": "VA: Montgomery",
            "label": "VA: Montgomery"
        },
        {
            "value": "VA: Nelson",
            "label": "VA: Nelson"
        },
        {
            "value": "VA: New Kent",
            "label": "VA: New Kent"
        },
        {
            "value": "VA: Newport News",
            "label": "VA: Newport News"
        },
        {
            "value": "VA: Norfolk",
            "label": "VA: Norfolk"
        },
        {
            "value": "VA: Northampton",
            "label": "VA: Northampton"
        },
        {
            "value": "VA: Northumberland",
            "label": "VA: Northumberland"
        },
        {
            "value": "VA: Norton",
            "label": "VA: Norton"
        },
        {
            "value": "VA: Nottoway",
            "label": "VA: Nottoway"
        },
        {
            "value": "VA: Orange",
            "label": "VA: Orange"
        },
        {
            "value": "VA: Page",
            "label": "VA: Page"
        },
        {
            "value": "VA: Patrick",
            "label": "VA: Patrick"
        },
        {
            "value": "VA: Petersburg",
            "label": "VA: Petersburg"
        },
        {
            "value": "VA: Pittsylvania",
            "label": "VA: Pittsylvania"
        },
        {
            "value": "VA: Poquoson",
            "label": "VA: Poquoson"
        },
        {
            "value": "VA: Portsmouth",
            "label": "VA: Portsmouth"
        },
        {
            "value": "VA: Powhatan",
            "label": "VA: Powhatan"
        },
        {
            "value": "VA: Prince Edward",
            "label": "VA: Prince Edward"
        },
        {
            "value": "VA: Prince George",
            "label": "VA: Prince George"
        },
        {
            "value": "VA: Prince William",
            "label": "VA: Prince William"
        },
        {
            "value": "VA: Pulaski",
            "label": "VA: Pulaski"
        },
        {
            "value": "VA: Radford",
            "label": "VA: Radford"
        },
        {
            "value": "VA: Rappahannock",
            "label": "VA: Rappahannock"
        },
        {
            "value": "VA: Richmond",
            "label": "VA: Richmond"
        },
        {
            "value": "VA: Richmond",
            "label": "VA: Richmond"
        },
        {
            "value": "VA: Roanoke",
            "label": "VA: Roanoke"
        },
        {
            "value": "VA: Roanoke",
            "label": "VA: Roanoke"
        },
        {
            "value": "VA: Rockbridge",
            "label": "VA: Rockbridge"
        },
        {
            "value": "VA: Rockingham",
            "label": "VA: Rockingham"
        },
        {
            "value": "VA: Russell",
            "label": "VA: Russell"
        },
        {
            "value": "VA: Salem",
            "label": "VA: Salem"
        },
        {
            "value": "VA: Scott",
            "label": "VA: Scott"
        },
        {
            "value": "VA: Shenandoah",
            "label": "VA: Shenandoah"
        },
        {
            "value": "VA: Smyth",
            "label": "VA: Smyth"
        },
        {
            "value": "VA: Southampton",
            "label": "VA: Southampton"
        },
        {
            "value": "VA: Spotsylvania",
            "label": "VA: Spotsylvania"
        },
        {
            "value": "VA: Stafford",
            "label": "VA: Stafford"
        },
        {
            "value": "VA: Staunton",
            "label": "VA: Staunton"
        },
        {
            "value": "VA: Suffolk",
            "label": "VA: Suffolk"
        },
        {
            "value": "VA: Surry",
            "label": "VA: Surry"
        },
        {
            "value": "VA: Sussex",
            "label": "VA: Sussex"
        },
        {
            "value": "VA: Tazewell",
            "label": "VA: Tazewell"
        },
        {
            "value": "VA: Virginia Beach",
            "label": "VA: Virginia Beach"
        },
        {
            "value": "VA: Warren",
            "label": "VA: Warren"
        },
        {
            "value": "VA: Washington",
            "label": "VA: Washington"
        },
        {
            "value": "VA: Waynesboro",
            "label": "VA: Waynesboro"
        },
        {
            "value": "VA: Westmoreland",
            "label": "VA: Westmoreland"
        },
        {
            "value": "VA: Williamsburg",
            "label": "VA: Williamsburg"
        },
        {
            "value": "VA: Winchester",
            "label": "VA: Winchester"
        },
        {
            "value": "VA: Wise",
            "label": "VA: Wise"
        },
        {
            "value": "VA: Wythe",
            "label": "VA: Wythe"
        },
        {
            "value": "VA: York",
            "label": "VA: York"
        },
        {
            "value": "VT: Addison",
            "label": "VT: Addison"
        },
        {
            "value": "VT: Bennington",
            "label": "VT: Bennington"
        },
        {
            "value": "VT: Caledonia",
            "label": "VT: Caledonia"
        },
        {
            "value": "VT: Chittenden",
            "label": "VT: Chittenden"
        },
        {
            "value": "VT: Essex",
            "label": "VT: Essex"
        },
        {
            "value": "VT: Franklin",
            "label": "VT: Franklin"
        },
        {
            "value": "VT: Grand Isle",
            "label": "VT: Grand Isle"
        },
        {
            "value": "VT: Lamoille",
            "label": "VT: Lamoille"
        },
        {
            "value": "VT: Orange",
            "label": "VT: Orange"
        },
        {
            "value": "VT: Orleans",
            "label": "VT: Orleans"
        },
        {
            "value": "VT: Rutland",
            "label": "VT: Rutland"
        },
        {
            "value": "VT: Washington",
            "label": "VT: Washington"
        },
        {
            "value": "VT: Windham",
            "label": "VT: Windham"
        },
        {
            "value": "VT: Windsor",
            "label": "VT: Windsor"
        },
        {
            "value": "WA: Adams",
            "label": "WA: Adams"
        },
        {
            "value": "WA: Asotin",
            "label": "WA: Asotin"
        },
        {
            "value": "WA: Benton",
            "label": "WA: Benton"
        },
        {
            "value": "WA: Chelan",
            "label": "WA: Chelan"
        },
        {
            "value": "WA: Clallam",
            "label": "WA: Clallam"
        },
        {
            "value": "WA: Clark",
            "label": "WA: Clark"
        },
        {
            "value": "WA: Columbia",
            "label": "WA: Columbia"
        },
        {
            "value": "WA: Cowlitz",
            "label": "WA: Cowlitz"
        },
        {
            "value": "WA: Douglas",
            "label": "WA: Douglas"
        },
        {
            "value": "WA: Ferry",
            "label": "WA: Ferry"
        },
        {
            "value": "WA: Franklin",
            "label": "WA: Franklin"
        },
        {
            "value": "WA: Garfield",
            "label": "WA: Garfield"
        },
        {
            "value": "WA: Grant",
            "label": "WA: Grant"
        },
        {
            "value": "WA: Grays Harbor",
            "label": "WA: Grays Harbor"
        },
        {
            "value": "WA: Island",
            "label": "WA: Island"
        },
        {
            "value": "WA: Jefferson",
            "label": "WA: Jefferson"
        },
        {
            "value": "WA: King",
            "label": "WA: King"
        },
        {
            "value": "WA: Kitsap",
            "label": "WA: Kitsap"
        },
        {
            "value": "WA: Kittitas",
            "label": "WA: Kittitas"
        },
        {
            "value": "WA: Klickitat",
            "label": "WA: Klickitat"
        },
        {
            "value": "WA: Lewis",
            "label": "WA: Lewis"
        },
        {
            "value": "WA: Lincoln",
            "label": "WA: Lincoln"
        },
        {
            "value": "WA: Mason",
            "label": "WA: Mason"
        },
        {
            "value": "WA: Okanogan",
            "label": "WA: Okanogan"
        },
        {
            "value": "WA: Pacific",
            "label": "WA: Pacific"
        },
        {
            "value": "WA: Pend Oreille",
            "label": "WA: Pend Oreille"
        },
        {
            "value": "WA: Pierce",
            "label": "WA: Pierce"
        },
        {
            "value": "WA: San Juan",
            "label": "WA: San Juan"
        },
        {
            "value": "WA: Skagit",
            "label": "WA: Skagit"
        },
        {
            "value": "WA: Skamania",
            "label": "WA: Skamania"
        },
        {
            "value": "WA: Snohomish",
            "label": "WA: Snohomish"
        },
        {
            "value": "WA: Spokane",
            "label": "WA: Spokane"
        },
        {
            "value": "WA: Stevens",
            "label": "WA: Stevens"
        },
        {
            "value": "WA: Thurston",
            "label": "WA: Thurston"
        },
        {
            "value": "WA: Wahkiakum",
            "label": "WA: Wahkiakum"
        },
        {
            "value": "WA: Walla Walla",
            "label": "WA: Walla Walla"
        },
        {
            "value": "WA: Whatcom",
            "label": "WA: Whatcom"
        },
        {
            "value": "WA: Whitman",
            "label": "WA: Whitman"
        },
        {
            "value": "WA: Yakima",
            "label": "WA: Yakima"
        },
        {
            "value": "WI: Adams",
            "label": "WI: Adams"
        },
        {
            "value": "WI: Ashland",
            "label": "WI: Ashland"
        },
        {
            "value": "WI: Barron",
            "label": "WI: Barron"
        },
        {
            "value": "WI: Bayfield",
            "label": "WI: Bayfield"
        },
        {
            "value": "WI: Brown",
            "label": "WI: Brown"
        },
        {
            "value": "WI: Buffalo",
            "label": "WI: Buffalo"
        },
        {
            "value": "WI: Burnett",
            "label": "WI: Burnett"
        },
        {
            "value": "WI: Calumet",
            "label": "WI: Calumet"
        },
        {
            "value": "WI: Chippewa",
            "label": "WI: Chippewa"
        },
        {
            "value": "WI: Clark",
            "label": "WI: Clark"
        },
        {
            "value": "WI: Columbia",
            "label": "WI: Columbia"
        },
        {
            "value": "WI: Crawford",
            "label": "WI: Crawford"
        },
        {
            "value": "WI: Dane",
            "label": "WI: Dane"
        },
        {
            "value": "WI: Dodge",
            "label": "WI: Dodge"
        },
        {
            "value": "WI: Door",
            "label": "WI: Door"
        },
        {
            "value": "WI: Douglas",
            "label": "WI: Douglas"
        },
        {
            "value": "WI: Dunn",
            "label": "WI: Dunn"
        },
        {
            "value": "WI: Eau Claire",
            "label": "WI: Eau Claire"
        },
        {
            "value": "WI: Florence",
            "label": "WI: Florence"
        },
        {
            "value": "WI: Fond du Lac",
            "label": "WI: Fond du Lac"
        },
        {
            "value": "WI: Forest",
            "label": "WI: Forest"
        },
        {
            "value": "WI: Grant",
            "label": "WI: Grant"
        },
        {
            "value": "WI: Green",
            "label": "WI: Green"
        },
        {
            "value": "WI: Green Lake",
            "label": "WI: Green Lake"
        },
        {
            "value": "WI: Iowa",
            "label": "WI: Iowa"
        },
        {
            "value": "WI: Iron",
            "label": "WI: Iron"
        },
        {
            "value": "WI: Jackson",
            "label": "WI: Jackson"
        },
        {
            "value": "WI: Jefferson",
            "label": "WI: Jefferson"
        },
        {
            "value": "WI: Juneau",
            "label": "WI: Juneau"
        },
        {
            "value": "WI: Kenosha",
            "label": "WI: Kenosha"
        },
        {
            "value": "WI: Kewaunee",
            "label": "WI: Kewaunee"
        },
        {
            "value": "WI: La Crosse",
            "label": "WI: La Crosse"
        },
        {
            "value": "WI: Lafayette",
            "label": "WI: Lafayette"
        },
        {
            "value": "WI: Langlade",
            "label": "WI: Langlade"
        },
        {
            "value": "WI: Lincoln",
            "label": "WI: Lincoln"
        },
        {
            "value": "WI: Manitowoc",
            "label": "WI: Manitowoc"
        },
        {
            "value": "WI: Marathon",
            "label": "WI: Marathon"
        },
        {
            "value": "WI: Marinette",
            "label": "WI: Marinette"
        },
        {
            "value": "WI: Marquette",
            "label": "WI: Marquette"
        },
        {
            "value": "WI: Menominee",
            "label": "WI: Menominee"
        },
        {
            "value": "WI: Milwaukee",
            "label": "WI: Milwaukee"
        },
        {
            "value": "WI: Monroe",
            "label": "WI: Monroe"
        },
        {
            "value": "WI: Oconto",
            "label": "WI: Oconto"
        },
        {
            "value": "WI: Oneida",
            "label": "WI: Oneida"
        },
        {
            "value": "WI: Outagamie",
            "label": "WI: Outagamie"
        },
        {
            "value": "WI: Ozaukee",
            "label": "WI: Ozaukee"
        },
        {
            "value": "WI: Pepin",
            "label": "WI: Pepin"
        },
        {
            "value": "WI: Pierce",
            "label": "WI: Pierce"
        },
        {
            "value": "WI: Polk",
            "label": "WI: Polk"
        },
        {
            "value": "WI: Portage",
            "label": "WI: Portage"
        },
        {
            "value": "WI: Price",
            "label": "WI: Price"
        },
        {
            "value": "WI: Racine",
            "label": "WI: Racine"
        },
        {
            "value": "WI: Richland",
            "label": "WI: Richland"
        },
        {
            "value": "WI: Rock",
            "label": "WI: Rock"
        },
        {
            "value": "WI: Rusk",
            "label": "WI: Rusk"
        },
        {
            "value": "WI: Sauk",
            "label": "WI: Sauk"
        },
        {
            "value": "WI: Sawyer",
            "label": "WI: Sawyer"
        },
        {
            "value": "WI: Shawano",
            "label": "WI: Shawano"
        },
        {
            "value": "WI: Sheboygan",
            "label": "WI: Sheboygan"
        },
        {
            "value": "WI: St. Croix",
            "label": "WI: St. Croix"
        },
        {
            "value": "WI: Taylor",
            "label": "WI: Taylor"
        },
        {
            "value": "WI: Trempealeau",
            "label": "WI: Trempealeau"
        },
        {
            "value": "WI: Vernon",
            "label": "WI: Vernon"
        },
        {
            "value": "WI: Vilas",
            "label": "WI: Vilas"
        },
        {
            "value": "WI: Walworth",
            "label": "WI: Walworth"
        },
        {
            "value": "WI: Washburn",
            "label": "WI: Washburn"
        },
        {
            "value": "WI: Washington",
            "label": "WI: Washington"
        },
        {
            "value": "WI: Waukesha",
            "label": "WI: Waukesha"
        },
        {
            "value": "WI: Waupaca",
            "label": "WI: Waupaca"
        },
        {
            "value": "WI: Waushara",
            "label": "WI: Waushara"
        },
        {
            "value": "WI: Winnebago",
            "label": "WI: Winnebago"
        },
        {
            "value": "WI: Wood",
            "label": "WI: Wood"
        },
        {
            "value": "WV: Barbour",
            "label": "WV: Barbour"
        },
        {
            "value": "WV: Berkeley",
            "label": "WV: Berkeley"
        },
        {
            "value": "WV: Boone",
            "label": "WV: Boone"
        },
        {
            "value": "WV: Braxton",
            "label": "WV: Braxton"
        },
        {
            "value": "WV: Brooke",
            "label": "WV: Brooke"
        },
        {
            "value": "WV: Cabell",
            "label": "WV: Cabell"
        },
        {
            "value": "WV: Calhoun",
            "label": "WV: Calhoun"
        },
        {
            "value": "WV: Clay",
            "label": "WV: Clay"
        },
        {
            "value": "WV: Doddridge",
            "label": "WV: Doddridge"
        },
        {
            "value": "WV: Fayette",
            "label": "WV: Fayette"
        },
        {
            "value": "WV: Gilmer",
            "label": "WV: Gilmer"
        },
        {
            "value": "WV: Grant",
            "label": "WV: Grant"
        },
        {
            "value": "WV: Greenbrier",
            "label": "WV: Greenbrier"
        },
        {
            "value": "WV: Hampshire",
            "label": "WV: Hampshire"
        },
        {
            "value": "WV: Hancock",
            "label": "WV: Hancock"
        },
        {
            "value": "WV: Hardy",
            "label": "WV: Hardy"
        },
        {
            "value": "WV: Harrison",
            "label": "WV: Harrison"
        },
        {
            "value": "WV: Jackson",
            "label": "WV: Jackson"
        },
        {
            "value": "WV: Jefferson",
            "label": "WV: Jefferson"
        },
        {
            "value": "WV: Kanawha",
            "label": "WV: Kanawha"
        },
        {
            "value": "WV: Lewis",
            "label": "WV: Lewis"
        },
        {
            "value": "WV: Lincoln",
            "label": "WV: Lincoln"
        },
        {
            "value": "WV: Logan",
            "label": "WV: Logan"
        },
        {
            "value": "WV: Marion",
            "label": "WV: Marion"
        },
        {
            "value": "WV: Marshall",
            "label": "WV: Marshall"
        },
        {
            "value": "WV: Mason",
            "label": "WV: Mason"
        },
        {
            "value": "WV: McDowell",
            "label": "WV: McDowell"
        },
        {
            "value": "WV: Mercer",
            "label": "WV: Mercer"
        },
        {
            "value": "WV: Mineral",
            "label": "WV: Mineral"
        },
        {
            "value": "WV: Mingo",
            "label": "WV: Mingo"
        },
        {
            "value": "WV: Monongalia",
            "label": "WV: Monongalia"
        },
        {
            "value": "WV: Monroe",
            "label": "WV: Monroe"
        },
        {
            "value": "WV: Morgan",
            "label": "WV: Morgan"
        },
        {
            "value": "WV: Nicholas",
            "label": "WV: Nicholas"
        },
        {
            "value": "WV: Ohio",
            "label": "WV: Ohio"
        },
        {
            "value": "WV: Pendleton",
            "label": "WV: Pendleton"
        },
        {
            "value": "WV: Pleasants",
            "label": "WV: Pleasants"
        },
        {
            "value": "WV: Pocahontas",
            "label": "WV: Pocahontas"
        },
        {
            "value": "WV: Preston",
            "label": "WV: Preston"
        },
        {
            "value": "WV: Putnam",
            "label": "WV: Putnam"
        },
        {
            "value": "WV: Raleigh",
            "label": "WV: Raleigh"
        },
        {
            "value": "WV: Randolph",
            "label": "WV: Randolph"
        },
        {
            "value": "WV: Ritchie",
            "label": "WV: Ritchie"
        },
        {
            "value": "WV: Roane",
            "label": "WV: Roane"
        },
        {
            "value": "WV: Summers",
            "label": "WV: Summers"
        },
        {
            "value": "WV: Taylor",
            "label": "WV: Taylor"
        },
        {
            "value": "WV: Tucker",
            "label": "WV: Tucker"
        },
        {
            "value": "WV: Tyler",
            "label": "WV: Tyler"
        },
        {
            "value": "WV: Upshur",
            "label": "WV: Upshur"
        },
        {
            "value": "WV: Wayne",
            "label": "WV: Wayne"
        },
        {
            "value": "WV: Webster",
            "label": "WV: Webster"
        },
        {
            "value": "WV: Wetzel",
            "label": "WV: Wetzel"
        },
        {
            "value": "WV: Wirt",
            "label": "WV: Wirt"
        },
        {
            "value": "WV: Wood",
            "label": "WV: Wood"
        },
        {
            "value": "WV: Wyoming",
            "label": "WV: Wyoming"
        },
        {
            "value": "WY: Albany",
            "label": "WY: Albany"
        },
        {
            "value": "WY: Big Horn",
            "label": "WY: Big Horn"
        },
        {
            "value": "WY: Campbell",
            "label": "WY: Campbell"
        },
        {
            "value": "WY: Carbon",
            "label": "WY: Carbon"
        },
        {
            "value": "WY: Converse",
            "label": "WY: Converse"
        },
        {
            "value": "WY: Crook",
            "label": "WY: Crook"
        },
        {
            "value": "WY: Fremont",
            "label": "WY: Fremont"
        },
        {
            "value": "WY: Goshen",
            "label": "WY: Goshen"
        },
        {
            "value": "WY: Hot Springs",
            "label": "WY: Hot Springs"
        },
        {
            "value": "WY: Johnson",
            "label": "WY: Johnson"
        },
        {
            "value": "WY: Laramie",
            "label": "WY: Laramie"
        },
        {
            "value": "WY: Lincoln",
            "label": "WY: Lincoln"
        },
        {
            "value": "WY: Natrona",
            "label": "WY: Natrona"
        },
        {
            "value": "WY: Niobrara",
            "label": "WY: Niobrara"
        },
        {
            "value": "WY: Park",
            "label": "WY: Park"
        },
        {
            "value": "WY: Platte",
            "label": "WY: Platte"
        },
        {
            "value": "WY: Sheridan",
            "label": "WY: Sheridan"
        },
        {
            "value": "WY: Sublette",
            "label": "WY: Sublette"
        },
        {
            "value": "WY: Sweetwater",
            "label": "WY: Sweetwater"
        },
        {
            "value": "WY: Teton",
            "label": "WY: Teton"
        },
        {
            "value": "WY: Uinta",
            "label": "WY: Uinta"
        },
        {
            "value": "WY: Washakie",
            "label": "WY: Washakie"
        },
        {
            "value": "WY: Weston",
            "label": "WY: Weston"
        }
    ],

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
        console.log(`file: globals.js:13420 ~ arrayMatchesArray ~ field, val:`, field, val);
        return function (a) {
            // console.log(a);
            let returnValue = false;
            val.forEach(item =>{
                if(item && a[field]){
                    let _vals = a[field].split(/[;,]+/); // e.g. AK;AL or AK,AL
                    console.log(`file: globals.js:13427 ~ _vals:`, _vals);
                    for(let i = 0; i < _vals.length; i++) {
                        if (_vals[i].trim() === item.trim()) {
                            returnValue = true; // if we hit ANY of them, then true
                            i = _vals.length; // done
                        }
                    }
                }
                else{
                    console.warn('Item does not have a state or county field to match array - field:',field, "VAL:",val, "ITEM:",item);
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