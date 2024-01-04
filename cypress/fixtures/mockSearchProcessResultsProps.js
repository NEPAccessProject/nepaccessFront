
import results from './results.json';
const mockSearchProcessResultsProps = {
    results: results,
    resultsText: "Mock ResultsText",
    download: ()=>{
        console.log('Mock download');
    },
    exportToSpreadsheet: ()=>{
        console.log('Mock exportToSpreadsheet');
    },
    filterHidden: false,
    gatherSpecificHighlights: false,
    geoLoading: false,
    geoResults: [],
    informAppPage: ()=>{
        console.log('Mock informAppPage');
    },
    isMapHidden: false,
    scrollToTop: ()=>{
        console.log('Mock scrollToTop');
    },
    scrollToBottom: ()=>{
        console.log('Mock scrollToBottom');        
    },
    searching: false,
    shouldUpdate: false,
    snippetsDisabled: false,
    sort: ()=>{
        console.log('Mock sort');
    },
    toggleMapHide: ()=>{
        console.log('Mock toggleMapHide');
    }
}
export default mockSearchProcessResultsProps;