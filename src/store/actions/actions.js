
export const login = (data) => {
    return {
      type: ACTION_TYPES.LOGIN,
      username: data.username,
      token: data.token,
    };
  };
  
  export const logout = () => {
    return {
      type: ACTION_TYPES.LOGOUT,
    };
  }
    export const doSearch = (terms) => {
        return {
            type: ACTION_TYPES.DOSEARCH,
            search: terms,
            searchOptionsChecked: false,
            _lastSearchTerms: terms,
            titleRaw: parseTerms(terms),
            _lastSearchedTerm: parseTerms(terms),
            surveyChecked: false,
            surveyDone: false,
            isDirty: true,
        }

    };
