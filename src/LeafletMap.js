import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import axios from "axios";
import Globals from './globals.js';

import './leaflet.css';

// TODO: Use more than a single geojson

const MyData = (props) => {
    // create state variable to hold data when it is fetched
    const [data, setData] = React.useState();

    // useEffect to fetch data on mount
    useEffect(() => {
        // console.log("useEffect()",props);

        // async function
        const getDataAll = async () => {
            // 'await' the data
            let url = new URL('geojson/get_all', Globals.currentHost);
            const response = await axios.get(url);
            // save data to state
            setData(JSON.parse(response.data[0].geojson.geojson));
        };
        const getDataProcess = async (processId) => {
            let url = Globals.currentHost + "geojson/get_all_for_process";
            const response = await axios.get(url, { params: { id: processId } });
            setData(response.data);
        };
        const getDataDoc = async (docId) => {
            let url = Globals.currentHost + "geojson/get_all_for_eisdoc";
            const response = await axios.get(url, { params: { id: docId } });
            setData(response.data);
        };

        if(props && props.processId) {
            getDataProcess(props.processId);
        } else if(props && props.docId) {
            getDataDoc(props.docId);
        } else {
            getDataAll();
        }

    }, []);

    // render react-leaflet GeoJSON when the data is ready
    if (data && data[0]) { // Render many
        return data.map( ((datum, i) => {
            return <GeoJSON key={"leaflet"+i} data={JSON.parse(datum.geojson.geojson)} />;
        }));
    } else if(data) { // Render single geojson
        return <GeoJSON data={data} />;
    } else {
        return null;
    }
};

const LeafletMap = (props) => {
    return (
        <div>
            <h4>Put map back here</h4>
        </div>
    );
};

export default LeafletMap;