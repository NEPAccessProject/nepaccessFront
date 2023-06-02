import React, { useEffect, useRef } from "react";
import { Helmet } from "react-helmet";

import { MapContainer, TileLayer, GeoJSON, Popup, Tooltip, useMap, ZoomControl } from "react-leaflet";
import CustomSearchControl from '../CustomSearchControl';
// import { LatLngBounds } from "leaflet";
import Globals from '../globals.js';
import '../leaflet.css';

/** geoStatePair[geo_id] = "state abbreviation" */
let geoStatePair = {};
    geoStatePair[1] = "AL";
    geoStatePair[2] = "AK";
    geoStatePair[4] = "AZ";
    geoStatePair[5] = "AR";
    geoStatePair[6] = "CA";
    geoStatePair[8] = "CO";
    geoStatePair[9] = "CT";
    geoStatePair[10] = "DE";
    geoStatePair[11] = "DC";
    geoStatePair[12] = "FL";
    geoStatePair[13] = "GA";
    geoStatePair[15] = "HI";
    geoStatePair[16] = "ID";
    geoStatePair[17] = "IL";
    geoStatePair[18] = "IN";
    geoStatePair[19] = "IA";
    geoStatePair[20] = "KS";
    geoStatePair[21] = "KY";
    geoStatePair[22] = "LA";
    geoStatePair[23] = "ME";
    geoStatePair[24] = "MD";
    geoStatePair[25] = "MA";
    geoStatePair[26] = "MI";
    geoStatePair[27] = "MN";
    geoStatePair[28] = "MS";
    geoStatePair[29] = "MO";
    geoStatePair[30] = "MT";
    geoStatePair[31] = "NE";
    geoStatePair[32] = "NV";
    geoStatePair[33] = "NH";
    geoStatePair[34] = "NJ";
    geoStatePair[35] = "NM";
    geoStatePair[36] = "NY";
    geoStatePair[37] = "NC";
    geoStatePair[38] = "ND";
    geoStatePair[39] = "OH";
    geoStatePair[40] = "OK";
    geoStatePair[41] = "OR";
    geoStatePair[42] = "PA";
    geoStatePair[44] = "RI";
    geoStatePair[45] = "SC";
    geoStatePair[46] = "SD";
    geoStatePair[47] = "TN";
    geoStatePair[48] = "TX";
    geoStatePair[49] = "UT";
    geoStatePair[50] = "VT";
    geoStatePair[51] = "VA";
    geoStatePair[53] = "WA";
    geoStatePair[54] = "WV";
    geoStatePair[55] = "WI";
    geoStatePair[56] = "WY";
    geoStatePair[72] = "PR";

const MyData = (props) => {
    const mounted = useRef(false);

    const [data, setData] = React.useState(); 
    // const [isHidden, setHidden] = React.useState(props.isHidden)
    const [geoLoading, setLoading] = React.useState(true);
    const [showStates, setShowStates] = React.useState(true);
    const [showCounties, setShowCounties] = React.useState(true);
    const [highlighted, setHighlighted] = React.useState({});
    const [map, setMap] = React.useState(null)
    const [getBounds, setBounds] = React.useState();
    const [shouldFit, setShouldFit] = React.useState(false);
    const [locations, setLocations] = React.useState([]);

    const hide = () => {
        // setHidden(!isHidden);
        props.toggleMapHide();
    }

    const toggleGeodata = (val) => {
        if(val === 1) {
            setShowStates(!showStates);
        } else {
            setShowCounties(!showCounties);
        }
    }
    
    const onPolyClick = (feature,layer) => {
        // console.log(feature);
        // console.log("poly click", feature.properties);
        // console.log(layer);

        // When we call parent to filter we need to know if it's a state or county first
        if(feature.properties.STATENS) {

            Globals.emitEvent('geoFilter', {
                name: feature.properties.NAME,
                geoType: Globals.geoType.STATE,
                abbrev: feature.properties.STUSPS,
                stateAbbrev: feature.properties.STUSPS
            });

        } else if(feature.properties.COUNTYNS) {
            // need parseInt() to get rid of leading zeroes from string geoid in feature.properties.STATEFP
            const stateAbbrev = geoStatePair[parseInt(feature.properties.STATEFP)]; // state abbreviation from geoid
            const countyNameForFilter = stateAbbrev + ": " + feature.properties.NAME;

            Globals.emitEvent('geoFilter', {
                name: feature.properties.NAME,
                geoType: Globals.geoType.COUNTY,
                abbrev: countyNameForFilter,
                stateAbbrev: stateAbbrev
            });
            
        } // else not a county/state

        // Turn border red or if border already red then reset to the color saved in feature.originalColor
        // layer.setStyle({ 
        //     color: (layer.options.color === "red" ? feature.originalColor : "red"),
        //     fillColor: (layer.options.color === "red" ? feature.originalColor : "red") 
        // });

        // Toggle highlighting flag in component's state, by geoid, hashmap style
        // if(feature.properties.GEOID) {
        //     let _highlighted = highlighted;
        //     _highlighted[feature.properties.GEOID] = !_highlighted[feature.properties.GEOID];
        //     setHighlighted(_highlighted);
        // }

    }

    const buildLocationHashMaps = (docs,geos) => {
        // console.time("t1");
        let hashmap = {}; // location/count hashmap by abbrev or abbrev: county
        // build hashmap of locations with counts
        docs.forEach(docItem => {
            if(docItem.state) {
                let statesList = docItem.state.split(";");
                statesList.forEach(state => {
                    if(hashmap[state]) {
                        hashmap[state]++;
                    } else {
                        hashmap[state] = 1;
                    }
                });
            }
            if(docItem.county) {
                let counties = docItem.county.split(";");
                counties.forEach(county => {
                    if(hashmap[county]) {
                        hashmap[county]++;
                    } else {
                        hashmap[county] = 1;
                    }
                })
            }
        });
        // console.timeEnd("t1");

        // assign each geodata's count
        // console.time("t2");
        let validItemCount = 0;
        // let leafBounds = new LatLngBounds(); // for dynamic zoom option
        let i = 0;
        geos.forEach(geoItem => { 
            i++;
            
            if(geoItem.properties.STATENS) { // state
                geoItem.count = hashmap[geoItem.properties.STUSPS];

                if(geoItem.count) {
                    validItemCount++;
                    // leafBounds = getMaxBound(geoItem, leafBounds);
                }

            } else if(geoItem.properties.COUNTYNS) { // county
                const stateAbbrev = geoStatePair[parseInt(geoItem.properties.STATEFP)];
                const keynameForHashmap = stateAbbrev + ": " + geoItem.properties.NAME;
                geoItem.count = hashmap[keynameForHashmap];

                if(geoItem.count) {
                    validItemCount++;
                    // leafBounds = getMaxBound(geoItem, leafBounds);
                }

                // if(keynameForHashmap === "MI: St. Joseph") {
                //     console.log("Key example, count: ", keynameForHashmap, hashmap[keynameForHashmap]);
                // }
            } else {
                // for now do nothing with non state/county items
            }

            // for dynamic zoom option
            // if(i >= geos.length) {

            //     let _shouldFit = false;
            //     if(validItemCount < 25) { // define some amount of polygons as "not too big" to bother fitting
            //         _shouldFit = true;
            //     }

            //     setShouldFit(_shouldFit);
            //     setBounds(leafBounds);
            // }
            
        });
        // console.timeEnd("t2");

        return geos;
    }

    /** Determines which counties/states to display, and the counts for them. Sets this component's data.
     * Has to run any time props.docList changes
     * TODO: Can likely make this more efficient if we have logic that can replace the .some()s.
     * Perhaps the counts could be added to hashmap values by geoid (unique to each polygon), 
     * and then those counts could be assigned at the end.
     */
    const setAndFilterData = () => {

        let filteredGeoWithCounts = JSON.parse(JSON.stringify(props.docList)); // deep clone
        filteredGeoWithCounts = buildLocationHashMaps(props.results,filteredGeoWithCounts); // build results

        setData(filteredGeoWithCounts);
    }
    
    const showData = () => {
        if (data && data[0]) { // Render many
            return data.map( ((datum, i) => {
                let jsonData = datum;

                const originalName = Globals.getParameterCaseInsensitive(jsonData.properties,"name");
                let jsonName = originalName;
                let alaskaFlag = false;

                if(jsonName === "Alaska") {
                    alaskaFlag = true;
                }


                /** Note: Can't change anything about the <GeoJSON> here after first render. If something external changes,
                * nothing will change on the map: Changes are only done through built-in event handlers.
                * So it's pointless to include any such logic here. */
                // let shouldHighlight = false;
                // if(jsonData.properties.STATENS) {
                //     if(locations.indexOf(jsonData.properties.STUSPS) !== -1) {
                //         shouldHighlight = true;
                //     } 
                // } else if(jsonData.properties.COUNTYNS) {
                //     const stateAbbrev = geoStatePair[parseInt(jsonData.properties.STATEFP)];
                //     const countyNameForFilter = stateAbbrev + ": " + jsonData.properties.NAME;
                //     if(locations.indexOf(countyNameForFilter) !== -1) {
                //         shouldHighlight = true;
                //     }
                // } // else not a county/state
                
                // if(shouldHighlight) {
                //     jsonData.style.color = "red";
                //     jsonData.style.fillColor = "red";
                // }


                if( jsonData.count // falsy: no results for this polygon, therefore don't render
                    && 
                    ((jsonData.properties.STATENS && showStates) || (jsonData.properties.COUNTYNS && showCounties))
                ) {
                    jsonName += `; ${jsonData.count} ${(jsonData.count === 1) ? "Result" : "Results"}`;

                    return (
                        <GeoJSON key = {"leaflet"+i}
                            data={jsonData} 
                            color={jsonData.style.color} 
                            fillColor={jsonData.style.fillColor} 
                            onEachFeature={(feature, layer) => {
                                layer.on({
                                    click: () => onPolyClick(feature,layer)
                                })
                            }}
                        >
                            {/* <Popup>{jsonData.properties.NAME}</Popup> */}
                            {alaskaFlag ?(
                                <Tooltip sticky>{jsonName}</Tooltip>
                            ) : (
                                <Tooltip>{jsonName}</Tooltip>
                            )}
                            <Popup>Filter toggled for: {originalName}</Popup>
                        </GeoJSON>
                    );
                }
                
            }));
        } else {
            return null;
        }
    }

    /** Extends leafBounds by all coordinates in json */
    const getMaxBound = (json, leafBounds) => {
        let _bounds = leafBounds;
        for(let j = 0; j < json.geometry.coordinates.length; j++) {
            for(let k = 0; k < json.geometry.coordinates[j].length; k++) {
                if(Array.isArray(json.geometry.coordinates[j][k][0])) { 
                    for(let ii = 0; ii < json.geometry.coordinates[j][k].length; ii++) {
                        let thisLong = json.geometry.coordinates[j][k][ii][0];
                        let thisLat = json.geometry.coordinates[j][k][ii][1];

                        _bounds.extend([thisLat,thisLong]);
                    }
                } else {
                    let thisLong = json.geometry.coordinates[j][k][0];
                    let thisLat = json.geometry.coordinates[j][k][1];
                    
                    _bounds.extend([thisLat,thisLong]);
                }
            }
        }

        return _bounds;
    }

    // const getMaxBounds = (data) => {
    //     let leafBounds = new LatLngBounds();
    //     let runLength = data.length;

    //     for(let i = 0; i < data.length; i++) {
    //         let json = data[i];
    //         runLength += json.geometry.coordinates.length;

    //         for(let j = 0; j < json.geometry.coordinates.length; j++) {
    //             runLength += json.geometry.coordinates[j].length;
    //             for(let k = 0; k < json.geometry.coordinates[j].length; k++) {
    //                 if(Array.isArray(json.geometry.coordinates[j][k][0])) { 
    //                     runLength += json.geometry.coordinates[j][k].length;
    //                     for(let ii = 0; ii < json.geometry.coordinates[j][k].length; ii++) {
    //                         let thisLong = json.geometry.coordinates[j][k][ii][0];
    //                         let thisLat = json.geometry.coordinates[j][k][ii][1];

    //                         leafBounds.extend([thisLat,thisLong]);
    //                     }
    //                 } else {
    //                     let thisLong = json.geometry.coordinates[j][k][0];
    //                     let thisLat = json.geometry.coordinates[j][k][1];
                        
    //                     leafBounds.extend([thisLat,thisLong]);
    //                 }
    //             }
    //         }

    //         if(i === (data.length - 1)) {
    //             console.log("run size", runLength);
    //             setLoading(false);
    //         }
    //     }

    //     return leafBounds;
    // }

    const mapLoadedHandler = () => {
        if(data && geoLoading) {
            // console.log("Have data, done loading");
            setLoading(false);
        }
    }

    const doFitBounds = () => {
        if(shouldFit && map && getBounds && getBounds._southWest && getBounds._northEast) {
            try {
                map.fitBounds(getBounds);
            } catch(e) {
                console.error(e);
            }
        }
    }

    // useEffect to fetch data on mount
    useEffect(() => {
        mounted.current = true;

        if(props && props.docList && props.docList.length > 0) {

            // let bounds = getMaxBounds(props.docList);
            // setBounds(bounds);

            setAndFilterData();

            // total state/county geodata is only ~3MB

            // getByList(_ids, "geojson/get_geodata_other_for_eisdocs"); // presumably up to about ~180MB
            // getByList(_ids,"geojson/get_all_geodata_for_eisdocs"); // up to ~180MB
        } else {
            // console.log("Nothing here");
            // getByList(null, "geojson/get_all_state_county_for_eisdocs");
        }


        return () => { // unmount or rerender
            mounted.current = false;
        };
    }, [props]);

    let toggleText = props.isHidden ? "+" : "-";

    return (<>
        <div className="toggle-container-row">
            <div className="toggle-container">
                <span>
                    <label className="map-toggle-title no-select" onClick={hide}>Toggle map view</label>
                    <span className="map-filters-toggle" onClick={hide}>{toggleText}</span>
                </span>
            </div>
        </div>

        
        {(!props.isHidden || geoLoading) ?(
            <div className="map-top-container">
                <div className="map-layers-toggle">
                    <div className="checkbox-container">
                        <input type="checkbox" name="showStates" id="showStates" className="sidebar-checkbox"
                                // tabIndex="1"
                                checked={showStates} onChange={() => toggleGeodata(1)} />
                        <label className="checkbox-text no-select" htmlFor="showStates">Show states and territories</label>
                    </div>
                    <div className="checkbox-container">
                        <input type="checkbox" name="showCounties" id="showCounties" className="sidebar-checkbox"
                                // tabIndex="2"
                                checked={showCounties} onChange={() => toggleGeodata(2)} />
                        <label className="checkbox-text no-select" htmlFor="showCounties">Show counties</label>
                    </div>
                </div>
                <div className="leafmap_container">
                    <Helmet>
                        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
                            integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
                            crossOrgin=""/>
                        <link rel="stylesheet" href="https://unpkg.com/leaflet-geosearch@3.0.0/dist/geosearch.css" />
                        <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"
                            integrity="sha512-XQoYMqMTK8LvdxXYG3nZ448hOEQiglfqkJs1NOQV44cWnUrBc8PkAOcXy20w0vlaXaVUearIOBhiXZ5V3ynxwA=="
                            crossOrgin=""></script>
                    </Helmet>
                    <MapContainer className="leafmap"
                        center={[39.82, -98.58]} 
                        zoom={3} 
                        scrollWheelZoom={false}
                        // bounds={getBounds}
                        whenCreated={setMap}
                        onLoad={mapLoadedHandler()}
                        // onLoad={doFitBounds()} // for dynamic zoom to bounds
                    >
                        {showData()}
                        
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <ZoomControl position="topright" />
                        <CustomSearchControl
                            // provider={prov} // required but defined in CustomSearchControl.js
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
                    </MapContainer>
                </div>
            </div>
            
        ) : (
            <></>
        )}
        
    </>);
};

export default MyData;