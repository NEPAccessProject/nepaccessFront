import { createContext } from "react";
const SearchContext = createContext({
    state: {},
    setState: () => {},
    results: [],
})

export default SearchContext;