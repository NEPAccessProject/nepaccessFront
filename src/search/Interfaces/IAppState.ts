export default interface IAppState {
  searcherInputs: {
    startPublish: string;
    endPublish: string; 
    agency: string[];
    state: string[];
    needsComments: boolean;
    needsDocument: boolean;
    limit: number;
  };

  searchResults: any[];
  outputResults: any[];
  displayRows: any[];

  geoResults: null; 
  geoLoading: boolean;

  count: number;
  resultsText: string;

  networkError: string;
  parseError: string;

  verified: boolean;
  searching: boolean;
  useSearchOptions: boolean;
  snippetsDisabled: boolean;
  shouldUpdate: boolean;
  loaded: boolean;
  down: boolean;

  isMapHidden: boolean;
  filtersHidden: boolean;

  lookupResult: null;

  lastSearchedTerm: string;
}
