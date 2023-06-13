import * as ACTION_TYPES from "../actions/action_types";

export const initialState = {
    action: [],
    actionRaw: '',
    agency: [],
    agencyRaw: '',
    agencyRaw: [],
    cooperatingAgency: [],
    cooperatingAgencyRaw: [],
    county: [],
    countyRaw: '',
    countyRaw: [],
    decision: '',
    decisionRaw: '',
    endComment: null,
    endPublish: null,
    fragmentSizeValue: 2,
    hideOrganization: false,
    iconClassName: 'icon icon--effect',
    isDirty: false,
    limit: 100,
    markup: false,
    needsComments: false,
    needsComments: false,
    needsDocument: false,
    needsDocument: false,
    offset: 0,
    optionsChecked: true,
    optionsChecked: true,
    proximityDisabled: true,
    proximityOptions: proximityOptions,
    search: '',
    searchOptions: searchOptions,
    searchOptionsChecked: false,
    searchOptionsChecked: false,
    startComment: null,
    startPublish: null,
    state: [],
    stateRaw: '',
    stateRaw: [],
    surveyChecked: true,
    surveyDone: false,
    // test: Globals.enum.options,
    tooltipOpen: undefined,
    typeAll: true,
    typeDraft: true,
    typeEA: true,
    typeEAFinal: false,
    typeEAFinalFinal: false,
    typeFinal: true,
    typeNOI: false,
    typeNOIFinal: false,
    typeOther: false,
    typeROD: false,
    typeRODFinal: false,
    typeRODFinalFinal: false,
    typeScoping: false,
};

export const SearchReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_TYPES.DOSEARCH:
      return {
        ...state,
        search: terms,
        searchOptionsChecked: false,
        _lastSearchTerms: terms,
        titleRaw: parseTerms(terms),
        _lastSearchedTerm: parseTerms(terms),
        surveyChecked: false,
        surveyDone: false,
        isDirty: true,
      };
    case ACTION_TYPES.LOGOUT:
      return {
        ...state,
        isAuth: false,
        username: "",
        token: "",
      };
    default:
      return state;
  }
};
