import React, { useState, useEffect } from 'react';
import { Paper, Button, Input, Box, Divider, FormControl,Select, Autocomplete, InputLabel,ListItem,IconButton, TextField, Typography, Container, FormLabel } from '@mui/material';
import { styled } from '@mui/material/styles';
import theme from '../styles/theme';
//import Grid from '@mui/material/Grid'; // Grid version 1
import Grid from '@mui/material/Unstable_Grid2';
import { InputAdornment, SearchOutlined } from '@mui/icons-material';
import { proximityOptions, actionOptions, decisionOptions,agencyOptions,stateOptions,countyOptions} from '../search/options';
import SearchFilter from './SearchFilter';
import { makeStyles } from '@mui/styles';

const countyChange = (evt) => {
    console.log('countyChange', evt.target.value);
    evt.preventDefault();
  };
  const onLocationChange = (evt) => {
    console.log('onLocationChange', evt.target.value);
    evt.preventDefault();
  };
  const onAgencyChange = (evt) => {
    console.log('onAgencyChange', evt.target.value);
  }
  const onInput = (evt) => {
    console.log('onInput', evt.target.value);
    evt.preventDefault();
  };
  const onKeyUp = (evt) => {
    console.log('onKeyUp', evt.target.value);
    evt.preventDefault();
  };
  
  const onChangeHandler = (evt) => {
    console.log('onChangeHandler', evt.target.value);
    evt.preventDefault();
  };
  const onProximityChange = (evt) => {
    console.log('onProximityChange', evt.target.value);
    evt.preventDefault();
  };

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    // textAlign: 'center',
    color: theme.palette.text.secondary,
    elevation:0,
    border: 0, 
    borderRadius: 0,
    mt: 1,
    mb: 1,
    pl: 0,
    pr:0,
    "&:hover": {
      //           backgroundColor: //theme.palette.grey[200],
        boxShadow: '0px 4px 8px rgba(0.5, 0.5, 0.5, 0.15)',
        cursor: "pointer",
        "& .addIcon": {
          color: "purple"
        }
      }}));
const useStyles = makeStyles((theme) => ({
    formControl: {
    },
}));

export default function SideBarFilters(){
    const [search, setSearch] = useState('');
    const [county, setCounty] = useState('');
    const [location, setLocation] = useState('');
    const [proximity, setProximity] = useState('');
    const [selectedCounty, setSelectedCounty] = useState('');
    const [agencyRaw, setAgencyRaw] = useState('');
    const [proximityDisabled, setProximityDisabled] = useState(true);
    const [proximityOptionValue , setProximityOptionValue] = useState('');
    const [actionRaw, setActionRaw] = useState('');
    const classes = useStyles(theme);
    return(
        <>
            <Item>
                <SearchFilter filter={{
                  className: classes.formControl,
                  placeholder: 'Find within',
                  variant:"standard",
                  id:"proximity-select",
                  className: ((proximityDisabled) ? ' disabled' : ''),
                  // classNamePrefix="react-select control"
                  placeholder:"Keyword distance",
                  options:{proximityOptions},
                  value:{proximityOptionValue},
                  // menuIsOpen={true}
                  onChange:{onProximityChange},
                  label: 'Distance between search terms',
                  tabIndex: '1',
                }} />
                
            </Item>

            <Item>
                <SearchFilter filter={{
                  className: classes.formControl,
                  placeholder: 'Type or Select Lead Agencies',
                  value: (agencyRaw ? agencyRaw : ''),
                  onChange: onAgencyChange,
                  id: 'searchAgency',
                  type: Autocomplete,
                  options: agencyOptions,
                  label: 'Lead Agencies',
                  tabIndex: '3',
                }} />
            </Item>
           <Item>
               <SearchFilter filter={{
                  className: classes.formControl,
                  placeholder: 'Type or select Cooperating agencies',
                  value: (agencyRaw ? agencyRaw : ''),
                  onChange: onAgencyChange,
                  id: 'searchAgency',
                  name: 'cooperatingAgency',
                  type: Autocomplete,
                  options: agencyOptions,
                  label: 'Cooperating Agencies',
                  tabIndex: '4',
                }} />
           </Item>
          <Divider />
          <Item>
            <SearchFilter filter={{
              className: classes.formControl,
              placeholder: 'Type or Select State(s) or Location(s)',
              value: (stateOptions.filter = (stateObj) => state.includes(stateObj.value)),
              onChange: onLocationChange,
              id: 'searchState',
              name: 'state',
              type: Autocomplete,
              options: stateOptions,
              label: 'State(s) or Location(s)',
              tabIndex: '5',
            }} />

          </Item>

          <Item>
            <SearchFilter filter={{
              className: classes.formControl,
              placeholder: 'Type or Select a County',
              value: (countyOptions.filter(countyObj => county.includes(countyObj.value))),
              onChange: countyChange,
              id: 'searchCounty',
              name: 'county',
              type: Autocomplete,
              options: countyOptions,
              label: 'County / counties',
              tabIndex: '6',
            }} />
          </Item>
        </>
    )
}