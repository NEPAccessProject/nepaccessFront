import React, { useState, useEffect,useContext } from 'react';
import {
  Paper,
  Button,
  Input,
  Box,
  Divider,
  FormControl,
  Select,
  Autocomplete,
  InputLabel,
  ListItem,
  IconButton,
  TextField,
  Typography,
  Container,
  FormLabel,
} from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

import { styled } from '@mui/material/styles';
import theme from '../../styles/theme';
//import Grid from '@mui/material/Grid'; // Grid version 1
import Grid from '@mui/material/Unstable_Grid2';
import { InputAdornment, SearchOutlined } from '@mui/icons-material';
import SearchFilter from './SearchFilter';
import { makeStyles } from '@mui/styles';
import Globals from '../../globals';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { proximityOptions,actionOptions,
  decisionOptions,
  agencyOptions,
  countyOptions,
  stateOptions } from '../options';
const _ = require('lodash');
import SearchContext from './SearchContext';

export default function SideBarFilters(props) {
  const {searchState,setSearchState} = useContext(SearchContext);
  console.log('SideBarFilters context values', searchState);

  const {agencyRaw,county,proximityDisabled,markup} = searchState;
  const {
    onTitleOnlyChecked,
    onMarkupChange,
    onProximityChange,
    onAgencyChange,
    onLocationChange,
    onCountyChange,
    onStartDateChange,
    onEndDateChange
  } = props;
  const Item = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    // textAlign: 'center',
    color: theme.palette.text.secondary,
    elevation: 0,
    border: 0,
    borderRadius: 0,
    mt: 2,
    mb: 2,
    pl: 0,
    pr: 0,
    '&:hover': {
      //           backgroundColor: //theme.palette.grey[200],
      boxShadow: '0px 4px 8px rgba(0.5, 0.5, 0.5, 0.15)',
      cursor: 'pointer',
      '& .addIcon': {
        color: 'purple',
      },
    },
  }));
  const useStyles = makeStyles((theme) => ({
    formControl: {},
  }));

  const classes = useStyles(theme);
  
  return (
    <>
      <Box>
        <Item alignItems="center">
          <Box marginBottom={0}>
            <FormControlLabel
              control={<Checkbox 
                // checked={searchOptions} 
                onChange={onTitleOnlyChecked} />}
              label="Has downloadable items"
            />
          </Box>
          <FormControlLabel
            control={<Checkbox checked={markup} onChange={onMarkupChange} />}
            label="Search Only Within Titles"
          />
        </Item>
        <Item>
          <SearchFilter
            filter={{
              className: classes.formControl,
              variant: 'standard',
              id: 'proximity-select',
              className: proximityDisabled ? ' disabled' : '',
              // classNamePrefix="react-select control"
              placeholder: 'Keyword distance',
              options: proximityOptions,
              // menuIsOpen={true}
              onChange: {onProximityChange},
              label: 'Distance Between Search Terms',
              tabIndex: '1',
            }}
          />
        </Item>
      </Box>

      <Item>
        <SearchFilter
          filter={{
            className: classes.formControl,
            placeholder: 'Type or Select Lead Agencies',
            value: agencyRaw ? agencyRaw : '',
            onChange: onAgencyChange,
            id: 'searchAgency',
            type: Autocomplete,
            options: agencyOptions,
            label: 'Lead Agencies',
            tabIndex: '3',
          }}
        />
      </Item>
      <Item>
        <SearchFilter
          filter={{
            className: classes.formControl,
            placeholder: 'Type or select Cooperating agencies',
            value: agencyRaw ? agencyRaw : '',
            onChange: onAgencyChange,
            id: 'searchAgency',
            name: 'cooperatingAgency',
            type: Autocomplete,
            options: agencyOptions,
            label: 'Cooperating Agencies',
            tabIndex: '4',
          }}
        />
      </Item>
      <Divider />
      <Item>
        <SearchFilter
          filter={{
            className: classes.formControl,
            placeholder: 'Type or Select State(s) or Location(s)',
            value: (stateOptions.filter = (stateObj) => state.includes(stateObj.value)),
            onChange: onLocationChange,
            id: 'state',
            name: 'state',
            type: Autocomplete,
            options: stateOptions,
            label: 'State(s) or Location(s)',
            tabIndex: '5',
          }}
        />
      </Item>

      <Item>
        <SearchFilter
          filter={{
            className: classes.formControl,
            placeholder: 'Type or Select a County',
            value: countyOptions.filter((countyObj) => county.includes(countyObj.value)),
            onChange: onCountyChange,
            id: 'searchCounty',
            name: 'county',
            type: Autocomplete,
            options: countyOptions,
            label: 'County / counties',
            tabIndex: '6',
          }}
        />
      </Item>
      <Divider />
      <Item>
        <Typography pb={1} variant="filterLabel">
          Date Range:
        </Typography>
        <Box
          display={'flex'}
          xs={12}
          flexDirection={'column'}
          border={0}
          padding={0}
          margin={0}
          width={'100%'}
        >
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box marginBottom={2} components={['DatePicker']} padding={0} width="100%">
              <DatePicker onChange={onStartDateChange} id="date-picker-from" label="From:" />
            </Box>
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box components={['DatePicker']} padding={0} width="100%">
              <DatePicker on={onEndDateChange} id="date-picker-to" label="To:" />
            </Box>
          </LocalizationProvider>
        </Box>
      </Item>
    </>
  );
}
