import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";

const CustomSearchControl = (props) => {
    console.log(`🚀 ~ file: CustomSearchControl.js:6 ~ CustomSearchControl ~ props:`, props);

    const map = useMap();

    useEffect(() => {
        const searchControl = new GeoSearchControl({
            provider: new OpenStreetMapProvider(),
            ...props
        });

        map.addControl(searchControl);
        return () => map.removeControl(searchControl);
    }, [props]);

    return null;
};

export default CustomSearchControl;