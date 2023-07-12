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
import { InputAdornment, SearchOutlined, Clear } from '@mui/icons-material';
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
import { SearchControl } from 'leaflet-geosearch';


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
const counties = Globals.counties;
export default function SearchSideBarFilters(props) {
  const {
    searchState,
    setSearchState,
    onMarkupChange,
    onAgencyChange,
    onLocationChange,
    onCountyChange,
    onClearFiltersClick,
    onTitleOnlyChecked,
    onProximityChange,
    onCooperatingAgencyChange,
    onTypeChecked,
  } = useContext(SearchContext);
  const { agencyRaw, state, county, stateOptions, countyOptions,
    proximityDisabled, markup, cooperatingAgencyRaw, firstYear, lastYear, EISCount,
    typeEA, typeDraft, typeFinal, typeNOI, draftCount, finalCount, noiCount, rodCount, scopingCount, eaCount

  } = searchState;
  // Tried quite a bit but I can't force the calendar to Dec 31 of a year as it's typed in without editing the library code itself.
  // I can change the value but the popper state won't update to reflect it (even when I force it to update).

  // #region Date Handlers
  const onEndDateChange = (date, evt) => {
    console.log('onEndDateChange', date);
    setSearchState({ ...searchState, endPublish: date.toLocaleString() });
    // }
  };
  const onStartDateChange = (date, evt) => {
    console.log('onStartDateChange date', date);
    setSearchState({ ...searchState, startPublish: date.toLocaleString });
  };

  // #endregion  
  // region Render Return
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
        <Typography pb={1} variant="filterLabel">
          State(s) or location(s):
        </Typography>
        <Autocomplete
          id="state-select"
          fullWidth
          autoComplete={true}
          // autoHighlight={true}
          tabIndex={11}
          className={classes.autocomplete}
          options={searchState.stateOptions}
          disablePortal={true}
          // value={searchState.agencyRaw}
          variant="standard"
          // menuIsOpen={true}
          onChange={onLocationChange}
          getOptionLabel={(stateOptions) => `${stateOptions.label}`}
          renderInput={(params) => (
            <TextField
              {...params}

              variant="outlined"
              sx={{
                width: '100%',
                p: 0,
              }}
              placeholder={`Type or Select a State`}
            />
          )}
        />
      </Item>
      <Item>
        <Typography pb={1} variant="filterLabel">
          County/counties
        </Typography>
        <Autocomplete
          id="county-select"
          fullWidth
          autoComplete={true}
          // autoHighlight={true}
          tabIndex={11}
          className={classes.autocomplete}
          options={countyOptions}
          disablePortal={true}
          // value={searchState.agencyRaw}
          variant="standard"
          // menuIsOpen={true}
          onChange={onCountyChange}
          getOptionLabel={(countyOptions) => `${countyOptions.label}`}

          renderInput={(params) => (
            <TextField
              {...params}
              // value= {countyOptions.filter = (countyObj) => counties.includes(countyObj.value)}          
              variant="outlined"
              sx={{
                width: '100%',
                p: 0,
              }}
              placeholder={`Type or Select a County`}
            />
          )}
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
          alignContent={'center'}
          justifyItems={'center'}
        >
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box item marginBottom={2} components={['DatePicker']} padding={0} width="100%">
              <DatePicker
                name="startDate"
                onChange={(newValue, evt) => onStartDateChange(newValue, evt)}
                id="date-picker-from"
                label="From:"
                value={searchState.startDate}
                sx={{
                  width: '100%',
                }}
              />
            </Box>
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box components={['DatePicker']} padding={0} width="100%">
              <DatePicker
                name="endDate"
                value={searchState.endDate}
                onChange={(newValue, evt) => onEndDateChange(newValue, evt)}
                id="date-picker-to"
                label="To:"

                sx={{
                  width: '100%',


                }}
              />
            </Box>
          </LocalizationProvider>
        </Box>
      </Item>
      <Item>
        <label className="sidebar-label-date">Document Type</label>
        <div className="sidebar-checkboxes">
          <div className="checkbox-container">
            <label className="clickable checkbox-text">
              <Checkbox
                type="checkbox"
                name="typeDraft"
                className="sidebar-checkbox"
                tabIndex="11"
                checked={typeDraft}
                onChange={onTypeChecked}
              />
              <span className="checkbox-text">
                Draft EIS <i>{draftCount}</i>
              </span>
            </label>
          </div>
          <div className="checkbox-container">
            <label className="clickable checkbox-text">
              <Checkbox
                type="checkbox"
                name="typeFinal"
                className="sidebar-checkbox"
                tabIndex="12"
                checked={typeFinal}
                onChange={onTypeChecked}
              />
              <span className="checkbox-text">
                Final EIS <i>{finalCount}</i>
              </span>
            </label>
          </div>
          <div className="checkbox-container">
            <label className="clickable checkbox-text">
              <Checkbox
                type="checkbox"
                name="typeEA"
                className="sidebar-checkbox"
                tabIndex="13"
                checked={typeEA}
                onChange={onTypeChecked}
              />
              <span className="checkbox-text">
                EA <i>{eaCount}</i>
              </span>
            </label>
          </div>
          <div className="checkbox-container">
            <label className="clickable checkbox-text">
              <Checkbox
                name="typeNOI"
                id="typeNOI"
                className="sidebar-checkbox"
                tabIndex="14"
                checked={typeNOI}
                onChange={onTypeChecked}
              />
              <span className="checkbox-text">
                NOI <i>{noiCount}</i>
              </span>
            </label>
          </div>
        </div>

      </Item>

    </>
    //endregion
  );
}
