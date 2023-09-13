import { createContext } from "react";
const SearchContext = createContext({
    state: {},
    setState: () => {},
    results: [],
    files:[],
    infoMessage: "",
    errorMessage: "",
    warningMessage: ""
})

export default SearchContext;