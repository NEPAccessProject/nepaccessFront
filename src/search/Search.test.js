// Search.test.js

import { startNewSearch } from '../App.js';
import { doSearch, onInput } from './Search';
const _ = require("lodash");

const debouncedSearch = _.debounce(startNewSearch, 300);
const setStateMock = jest.fn();


describe('doSearch', () => {

  it('sets state with search terms', () => {
    const searchTerms = 'test terms';
    
    doSearch(searchTerms);
    
    expect(setStateMock).toHaveBeenCalledWith(
      expect.objectContaining({
        titleRaw: searchTerms 
      })
    );
  });

  it('calls debouncedSearch', () => {
    const searchTerms = 'test terms';
    
    doSearch(searchTerms);
    
    expect(debouncedSearch).toHaveBeenCalled(); 
  });

});

describe('onInput', () => {

  it('sets state with input value', () => {
    const inputEvent = { 
      target: {
        name: 'titleRaw',
        value: 'test input'  
      }
    };
    
    onInput(inputEvent);
    
    expect(setStateMock).toHaveBeenCalledWith(
      expect.objectContaining({
        titleRaw: 'test input'
      })
    );
  });

});
