import React, { useEffect, useRef } from "react";
import { Helmet } from "react-helmet";
//https://react-leaflet.js.org/docs/example-react-control/
import { GeoJSON, MapContainer, TileLayer, Tooltip, ZoomControl } from "react-leaflet";

// import 'node_modules/leaflet-geosearch/dist/geosearch.css';
import CustomSearchControl from "./search/CustomSearchControl.js";

import axios from "axios";
import Globals from './globals.js';

import { LatLngBounds } from "leaflet";
import './leaflet.css';

// basic colorblind palette
// #000000
// #252525
// #676767
// #ffffff

// #171723
// #004949
// #009999
// #22cf22
// #490092
// #006ddb
// #b66dff
// #ff6db6
// #920000
// #8f4e00
// #db6d00
// #ffdf4d

let _id = -1;
let _data;
let _bounds;

const GeojsonMap = (props) => {
    const mounted = useRef(false);
    // create state variable to hold data when it is fetched
    const [data, setData] = React.useState(); 
    const [isLoading, setLoading] = React.useState(false); 
    const [getBounds, setBounds] = React.useState(null);
    const [getCenter, setCenter] = React.useState([39.82,-98.58]);
    const [map, setMap] = React.useState(null)
    
    // TODO: Get count if available, append or prepend to name, or make it the popup text (on-click)
    /** Helper returns <GeoJSON> from data.map */
    const showData = () => {

        if (data && data[0]) { // Render many
            return data.map( ((datum, i) => {
                let jsonData = datum;
                let jsonName = Globals.getParameterCaseInsensitive(jsonData.properties,"name");
                if(jsonData.count) {
                    jsonName += "; " + jsonData.count + " Results"
                }

                return (
                    <GeoJSON key={"leaflet"+i} 
                        data={jsonData} 
                        color={jsonData.style.color} 
                        fillColor={jsonData.style.fillColor} 

                    >
                        {/* <Popup>{jsonData.properties.NAME}</Popup> */}
                        <Tooltip>{jsonName}</Tooltip>
                    </GeoJSON>
                );
                
            }));
        } else if(data) { // Render single geojson
            return <GeoJSON data={data} />;
        } else {
            return null;
        }
    }


            
    // we need to get the bounds before we can attempt to zoom in appropriately
    // geoItem.geometry.coordinates will be an array of arrays of arrays of long/lats (in that order), e. g.
        // coordinates: Array(47)
            // 0: Array(1)
                // 0: Array(9)    
                    // 0: (2) [179.481318, 51.975301]
                    // 1: (2) [179.582857, 52.016841]
                    // ...
    // this would be a lot of calculation, so it makes sense for an individual details page.
    /** Returns [[minLat,minLong],[maxLat,maxLong]] */
    const getMaxBounds = (data) => {
        let leafBounds = new LatLngBounds();

        for(let i = 0; i < data.length; i++) {
            let json = JSON.parse(data[i]);

            for(let j = 0; j < json.geometry.coordinates.length; j++) {
                for(let k = 0; k < json.geometry.coordinates[j].length; k++) {
                    if(Array.isArray(json.geometry.coordinates[j][k][0])) { 
                        for(let ii = 0; ii < json.geometry.coordinates[j][k].length; ii++) {
                            let thisLong = json.geometry.coordinates[j][k][ii][0];
                            let thisLat = json.geometry.coordinates[j][k][ii][1];

                            leafBounds.extend([thisLat,thisLong]);
                        }
                    } else {
                        let thisLong = json.geometry.coordinates[j][k][0];
                        let thisLat = json.geometry.coordinates[j][k][1];
                        
                        leafBounds.extend([thisLat,thisLong]);
                    }
                }
            }

            if(i === (data.length - 1)) {
                setLoading(false);
            }
        }

        return leafBounds;
    }

    const doFitBounds = () => {
        if(map && getBounds) {
            map.fitBounds(getBounds);
        }
    }

    // useEffect to fetch data on mount
    useEffect(() => {
        mounted.current = true;
        let sortedData = [];

        const getDataProcessOrDoc = async (id, urlAppend) => {
            
            if(_id !== id) { // simple logic to only hit backend if data changed
                _id = id;

                setData(null);
                setLoading(true);
                let url = Globals.currentHost + urlAppend;

                const response = await axios.get(url, { params: { id: id } });

                // console.log(response);

                if(response.data && response.data[0]) {
                    const bounds = getMaxBounds(response.data);
                    setBounds(bounds);
                    _bounds = bounds;
                    if(map) {
                        try {
                            setCenter(bounds.getCenter());
                        } catch(e) {
                            console.error(e);
                        }
                    }
                    
                    for(let i = 0; i < response.data.length; i++) {
                        let json = JSON.parse(response.data[i]);
                        json.style = {};
                        json.sortPriority = 0;

                        // Add specific color to states and counties
                        // Internal polygons (counties, other) must be added LAST in order to show up, 
                        // otherwise the overlapping labels don't work. We'll use a new property, sortPriority.
                        if(json.properties.COUNTYFP) {
                            json.style.color = "#3388ff"; // county: default (blue)
                            json.style.fillColor = "#3388ff";
                            json.sortPriority = 5;
                        } else if(json.properties.STATENS) {
                            json.style.color = "#000"; // state: black
                            json.style.fillColor = "#000";
                            json.sortPriority = 4;
                        } else {
                            json.style.color = "#D54E21"; // other: orange, colorblind friendly and contrasts well
                            json.style.fillColor = "#D54E21";
                            json.sortPriority = 6;
                        }

                        response.data[i] = json;
                    }

                    // Sort by our sort priority such that the largest .sortPriority numbers are at the top (counties, other regions)
                    sortedData = response.data.sort((a, b) => parseInt(a.sortPriority) - parseInt(b.sortPriority));

                    setData(sortedData);
                    _data = sortedData;
                }
            } else { // we should have the data sitting around already (rerender, or maybe user hit "back" on browser)
                if(map) {
                    try {
                        setBounds(_bounds);
                        setData(_data);
                        setCenter(_bounds.getCenter());
                    } catch(e) {
                        console.error(e);
                    }
                }
            }
            
        };

        if(props && props.processId) {
            getDataProcessOrDoc(props.processId, "geojson/get_all_geojson_for_process");
        } else if(props && props.docId) {
            getDataProcessOrDoc(props.docId, "geojson/get_all_geojson_for_eisdoc");
        } else {
            // console.log("Nothing here?",props);
        }

        return () => { // unmount or rerender
            // _id = -1;
            mounted.current = false;
        };
    }, [props]);
    
    return (
    <>
        <div className="leafmap_container">
            <Helmet>
                <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
                    integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
                    crossorigin=""/>
                <link rel="stylesheet" href="https://unpkg.com/leaflet-geosearch@3.0.0/dist/geosearch.css" />
                <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"
                    integrity="sha512-XQoYMqMTK8LvdxXYG3nZ448hOEQiglfqkJs1NOQV44cWnUrBc8PkAOcXy20w0vlaXaVUearIOBhiXZ5V3ynxwA=="
                    crossorigin=""></script>
            </Helmet>
            
            Note: Counties and the polygons below are machine-assisted and may not reflect the state(s) listed above.
            
            {getBounds && !isLoading ?(
            <MapContainer className="leafmap"
                // display map based on EITHER center coordinates and zoom level OR bounds=latLngBounds
                center={getCenter} 
                zoom={3} 
                scrollWheelZoom={true}
                // bounds={getBounds}
                whenCreated={setMap}
                onLoad={doFitBounds()}
                autocomplete="new"
            >
                {showData()}
                
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <CustomSearchControl
                    // provider={prov} // required but defined in CustomSearchControl.js
                    // position={"topleft"}
                    // style={"button"} // css/style problems out of the box
                    style={"bar"}
                    showMarker={true}
                    showPopup={false}
                    maxMarkers={3}
                    retainZoomLevel={false}
                    animateZoom={true}
                    autoClose={false}
                    searchLabel={"Search for any location"}
                    keepResult={false}
                    popupFormat={({ query, result }) => result.label}

                    autocomplete={"new-password"} // try to stop browser from ruining UX... Edge and Chrome get pretty aggressive
                />
                <ZoomControl position="topright" />
            </MapContainer>) : ( <></> )}
        </div>
    </>);
    

};

export default GeojsonMap;