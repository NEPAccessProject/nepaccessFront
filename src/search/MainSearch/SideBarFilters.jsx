import React, { useState, useEffect, useContext } from 'react';
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
import {
  proximityOptions,
  actionOptions,
  decisionOptions,
  agencyOptions,
} from '../options';
const _ = require('lodash');
import SearchContext from './SearchContext';


const stateOptions = Globals.stateOptions;

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

export default function SideBarFilters(props) {
  const {
    searchState,
    setSearchState,
    onMarkupChange,
    onAgencyChange,
    onLocationChange,
    onCountyChange,
    onStartDateChange,
    onEndDateChange,
    onClearFiltersClick,
    onTitleOnlyChecked,
    onProximityChange,
    onCooperatingAgencyChange,
  } = useContext(SearchContext);
  const { agencyRaw,state, county,stateOptions,countyOptions, proximityDisabled, markup, cooperatingAgencyRaw } = searchState;

  const classes = useStyles(theme);
  return (
    <>
      <Box>
        <Item alignItems="center">
          <Box marginBottom={0}>
            <FormControlLabel
              control={
                <Checkbox
                  // checked={searchOptions}
                  onChange={onTitleOnlyChecked}
                />
              }
              label="Has downloadable items"
            />
          </Box>
          <FormControlLabel
            control={<Checkbox checked={markup} onChange={onMarkupChange} />}
            label="Search Only Within Titles"
          />
        </Item>
{/* #region Proximity Filter */}
        <Item>
        <FormControl
          fullWidth
          xs={{
            p: 1,
            border: 0,
            borderColor: 'grey.500',
            borderRadius: 1,
            mb: 1,
            mt: 1,
          }}
        >
          <Typography pb={1} variant="filterLabel">
          Distance Between Search Terms:
          </Typography>
          <Autocomplete
            id="proximity-select"
            fullWidth
            autoComplete={true}
            // autoHighlight={true}
            tabIndex={11}
            className={classes.autocomplete}
            options={proximityOptions}
            disablePortal={true}
            // value={searchState.agencyRaw}
            variant="standard"
            // menuIsOpen={true}
            onChange={onProximityChange}
            getOptionLabel={(proximityOptions) => proximityOptions.label}
            renderInput={(params) => (
              <TextField
                {...params}
                value={searchState.proximity}
                variant="outlined"
                sx={{
                  width: '100%',
                  p: 0,
                }}
                placeholder="Type or Select a Word Distance"
              />
            )}
          />
        </FormControl>

        </Item>
{/* #endregion */}
      </Box>

      <Item>
{/* #region Lead Agencies Filter */}
        <FormControl
          fullWidth
          xs={{
            p: 1,
            border: 0,
            borderColor: 'grey.500',
            borderRadius: 1,
            mb: 1,
            mt: 1,
          }}
        >
          <Typography pb={1} variant="filterLabel">
            Lead Agencies:
          </Typography>
          <Autocomplete
            id="searchAgency"
            fullWidth
            autoComplete={true}
            // autoHighlight={true}
            tabIndex={11}
            className={classes.autocomplete}
            options={agencyOptions}
            disablePortal={true}
            // value={searchState.agencyRaw}
            variant="standard"
            // menuIsOpen={true}
            onChange={onAgencyChange}
            getOptionLabel={(agencyOptions) => agencyOptions.label}
            renderInput={(params) => (
              <TextField
                {...params}
                value={searchState.agencyRaw}
                variant="outlined"
                sx={{
                  width: '100%',
                  p: 0,
                }}
                placeholder="Type or Select Lead Agencies"
              />
            )}
          />
        </FormControl>
{/* #endregion */}
      </Item>
      <Item>
        <FormControl
          fullWidth
          xs={{
            p: 1,
            border: 0,
            borderColor: 'grey.500',
            borderRadius: 1,
            mb: 1,
            mt: 1,
          }}
        >
          <Typography pb={1} variant="filterLabel">
            Cooperating Agencies:
          </Typography>
          <Autocomplete
            id="searchAgency"
            fullWidth
            autoComplete={true}
            // autoHighlight={true}
            tabIndex={11}
            className={classes.autocomplete}
            options={agencyOptions}
            disablePortal={true}
            // value={searchState.agencyRaw}
            variant="standard"
            // menuIsOpen={true}
            onChange={onCooperatingAgencyChange}
            getOptionLabel={(agencyOptions) => agencyOptions.label}
            renderInput={(params) => (
              <TextField
                {...params}
                value={searchState.agencyRaw}
                variant="outlined"
                sx={{
                  width: '100%',
                  p: 0,
                }}
                placeholder="Type or Select Cooperating Agencies"
              />
            )}
          />
        </FormControl>
      </Item>
      <Divider />
      <Item>
      <FormControl
          fullWidth
          xs={{
            p: 1,
            border: 0,
            borderColor: 'grey.500',
            borderRadius: 1,
            mb: 1,
            mt: 1,
          }}
        >
          <Typography pb={1} variant="filterLabel">
            State(s) or Location(s):
          </Typography>
          <Autocomplete
            id="state"
            fullWidth
            autoComplete={true}
            // autoHighlight={true}
            tabIndex={11}
            className={classes.autocomplete}
            options={stateOptions}
            disablePortal={true}
            // value={searchState.agencyRaw}
            variant="standard"
            // menuIsOpen={true}
            onChange={onLocationChange}
            getOptionLabel={(stateOptions) => stateOptions.label}
            renderInput={(params) => (
              <TextField
                {...params}
                value={(stateOptions.filter = (stateObj) => searchState.state.includes(stateObj.value))}
                variant="outlined"
                sx={{
                  width: '100%',
                  p: 0,
                }}
                placeholder="Type or Select States(s) and Agencies"
              />
            )}
          />
        </FormControl>
      </Item>

      <Item>
        <FormControl
          fullWidth
          xs={{
            p: 1,
            border: 0,
            borderColor: 'grey.500',
            borderRadius: 1,
            mb: 1,
            mt: 1,
          }}
        >
          <Typography pb={1} variant="filterLabel">
            County or Counties Value:
          </Typography>
          <Autocomplete
            id="searchCounty"
            fullWidth
            autoComplete={true}
            // autoHighlight={true}
            tabIndex={11}
            className={classes.autocomplete}
            options={searchState.countyOptions}
            disablePortal={true}
            // value={searchState.agencyRaw}
            variant="standard"
            // menuIsOpen={true}
            onChange={onCountyChange}
            getOptionLabel={(countyOptions) => countyOptions.label}
            renderInput={(params) => (
              <TextField
                {...params}
                value={(countyOptions.filter = (countyObj) => searchState.county.includes(countyObj.value))}
                variant="outlined"
                sx={{
                  width: '100%',
                  p: 0,
                }}
                placeholder="Type or Select a Counties"
              />
            )}
          />
        </FormControl>
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
              <DatePicker
                onChange={onStartDateChange}
                id="date-picker-from"
                label="From:"
                value={searchState.startDate}
              />
            </Box>
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box components={['DatePicker']} padding={0} width="100%">
              <DatePicker
                value={searchState.endDate}
                on={(evt) => onEndDateChange(evt)}
                id="date-picker-to"
                label="To:"
              />
            </Box>
          </LocalizationProvider>
        </Box>
      </Item>
    </>
  );
}
