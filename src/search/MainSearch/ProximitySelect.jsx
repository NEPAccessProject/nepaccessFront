import React,{useContext} from 'react';
import SearchContext from './SearchContext';
import { Autocomplete,TextField } from '@mui/material';
import { proximityOptions } from '../options';
export default function ProximitySelect(props) {
    const {searchState,setSearchState} = useContext(SearchContext);
    const {proximityOptionValue,setProximityOptionValue,proximityDisabled,onProximityChange} = searchState;
    const isDisabled = proximityDisabled ? false : true;
 
    // (props.proximityOptionValue) ? setProximityOptionValue(props.proximityOptionValue) : setProximityOptionValue(proximityOptions[0]);
    return (
      <>
        <Autocomplete
          id={'proximity-select-autocomplete'}
          fullWidth={true}
          autoComplete={true}
          cc
          autoHighlight={true}
          tabIndex={3}
          options={proximityOptions ? proximityOptions : []}
          disablePortal={true}
          // value={value}
          // menuIsOpen={true}
          onChange={(evt)=>onProximityChange(evt)}
          getOptionLabel={(option) => option.label || label}
          renderInput={(params) => <TextField placeholder="Distance Between Keywords" {...params} />}
          sx={{
            p: 0,
          }}
        />
      </>
    );
  }
