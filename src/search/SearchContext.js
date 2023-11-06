import { createContext } from "react";
const SearchContext = createContext({
    state: {
    searcherInputs: {
      startPublish: "",
      endPublish: "",
      agency: [],
      state: [],
      needsComments: false,
      needsDocument: true,
      limit: 25,
    },
    searchResults: [],
    outputResults: [],
    displayRows: [],
    geoResults: null,
    geoLoading: true,
    count: 0,
    limit: 25,
    page: 1,
    resultsText: "Results",
    networkError: "",
    parseError: "",
    verified: false,
    searching: false,
    useSearchOptions: false,
    snippetsDisabled: false,
    shouldUpdate: false,
    loaded: false,
    down: false,
    isMapHidden: false,
    filtersHidden: false,
    lookupResult: null,
    lastSearchedTerm: "",
    },
    setState: () => {},
    results: [],
    files:[],
    infoMessage: "",
    errorMessage: "",
    warningMessage: ""
})

export default SearchContext;