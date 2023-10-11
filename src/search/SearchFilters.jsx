import {
  Autocomplete,
  Box,
  Button,
  Container,
  Checkbox,
  Paper,
  Divider,
  FormControl,
  FormLabel,
  Link,
  TextField,
  Typography,
  Stack,
  Chip,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { styled, makeStyles } from '@mui/styles';
import React, { useContext } from 'react';
//import { ThemeProvider, createUseStyles } from "react-jss";
import SearchContext from './SearchContext';
//import Grid from '@mui/material/Grid'; // Grid version 1
import { ThemeProvider } from '@material-ui/core';
import Globals from '../globals';
import theme from '../styles/theme';
import SearchDatePickers from './SearchDatePickers';
import {
  actionOptions,
  agencyOptions,
  decisionOptions,
  countyOptions,
} from './options';
//filter out duplicates
const actions = Array.from(new Set(actionOptions));
const agencies = Array.from(new Set(agencyOptions));
const counties = Array.from(new Set(countyOptions));
const decisions = Array.from(new Set(decisionOptions));
const states = Array.from(new Set(Globals.locations));

const Item = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  // textAlign: 'center',
  color: theme.palette.text.secondary,
  elevation: 1,
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
  checkbox: {
    padding: 0,
    margin: 0,
  },
  autoComplete: {
    fontSize: 20,
    padding:0,
    margin:0
  }
}));

const SearchFilters = (props) => {
  const { state, setState } = useContext(SearchContext);
  console.log(`file: SearchFilters.jsx:75 ~ SearchFilters ~ state:`, state);
  const classes = useStyles(theme);
  const {
    filtersHidden,
    onActionChange,
    onAgencyChange,
    onCooperatingAgencyChange,
    onCountyChange,
    onDateChange,
    onDecisionChange,
    onEndDateChange,
    onLocationChange,
    onMarkupChange,
    onNeedsDocumentChecked,
    onProximityChange,
    onStartDateChange,
    onTitleOnlyChecked,
    onTypeChecked,
    onUseOptionsChecked,
    orgClick,
    renderClearFiltersButton,
    toggleFiltersHidden,
    onClearFilter,
  } = props;

  //Common Settings used by all autocomplete filters
  const filterProps = {
    fullWidth: true,
    multiple: true,
    autoComplete: true,
    autoHighlight: true,
    limitTags: 3,
    disablePortal: true,
    variant: 'standard',
    getLimitTagsText: (options) =>
      options.label.length > 10
        ? options.label.slice(0, 10) + '...'
        : options.label,

    // ),
  };

  return (
    <>
      <Paper elevation={1} sx={{
        boxShadow: '0px 4px 8px rgba(0.5, 0.5, 0.5, 0.15)'
      }}>
        <Grid container>
          <Item hidden={state.filtersHidden}>
            {/* #region search title */}
            <Box alignItems={'center'}>
              <Checkbox
                tabIndex='3'
                checked={state.searchOption === 'C'}
                onChange={onTitleOnlyChecked}>
                Search Only Within titles
              </Checkbox>
              <FormLabel>
                <Typography
                  className={classes.FormLabel}
                  variant='filterLabel'>
                  {' '}
                  Search Only Within titles
                </Typography>
              </FormLabel>
            </Box>
            {/* #endregion */}
            <Box
              padding={0}
              margin={0}
              justifyContent={'center'}
              alignItems={'center'}>
              <Button
                height='20px'
                padding={0}
                margin={0}
                fullWidth
                variant='outlined'
                color='primary'
                border={0}
                borderRadius={0}>
                Clear Filters
              </Button>
              {/* {renderClearFiltersButton()} */}
            </Box>
            <Divider />
            {/* #region search agencies */}
            <Box>
              <FormControl fullWidth>
                <FormLabel htmlFor='searchAgency'>Lead Agencies:</FormLabel>
                <Autocomplete
                  id='searchAgency'
                  name='agency'
                  {...filterProps}
                  tabIndex={3}
                  options={agencies}
                  value={agencies.filter((v) =>
                    state.agency.includes(v.value),
                  )}
                  margin={0}
                  padding={0}
                  size="small"
                  disableListWrap={false}
                  //renderOption={(option) => `${option.label} ?`}
                  onChange={(evt, value, tag) => {
                    onAgencyChange(evt, value, tag)
                  }}
                  className={classes.autoComplete}
                  renderInput={(params) => {
                    params.inputProps.className = classes.autoComplete;
                    return (
                      <TextField
                        {...params}
                        placeholder='Type or Select Lead Agencies'
                        variant='outlined'
                        sx={{
                          width: '100%',
                          p: 0,
                        }}
                      />
                    );
                  }}
                />
              </FormControl>
              {/* #endregion */}
            </Box>
            {/* #region search */}
            {/* #regionSearch Agency */}
            <Box>
              <FormControl
                fullWidth
                xs={{
                  p: 1,
                  mb: 1,
                  mt: 1,
                }}>
                <FormLabel htmlFor='searchAgency'>
                  Cooperating Agencies:
                </FormLabel>
                <Autocomplete
                  id='searchAgency'
                  name='cooperatingAgency'
                  {...filterProps}
                  tabIndex={4}
                  options={agencies}
                  value={agencies.filter((v) =>
                    state.cooperatingAgency.includes(v.value),
                  )}
                  onChange={(evt, value, tag) =>
                    onCooperatingAgencyChange(evt, value, tag)
                  }
                  getOptionLabel={(v) => (
                    v.label.length > 25 ? `${v.label.slice(0, 25)}...` : `${v.label}`
                  )}
                  renderInput={(params) => {
                    return (
                      <TextField
                        {...params}
                        placeholder='Type or Select Lead Agencies'
                        variant='outlined'
                        sx={{
                          width: '100%',
                          p: 0,
                        }}
                      />
                    );
                  }}
                />
              </FormControl>
            </Box>
            {/* #endregion */}
            <Divider />
            {/* #region search states */}
            <Box>
              <Typography variant='h6'>Selected States: {JSON.stringify(state.state)}</Typography>
              <Typography variant='h6'>Selected Counties: {JSON.stringify(state.county)}</Typography>
              <FormLabel htmlFor='state'>State(s) and Location(s):</FormLabel>
              <Autocomplete
                id='state'
                name='state'
                {...filterProps}
                options={states}
                value={states.filter((v) => {
                  	return state.state.includes(v.value);
                })}
                onChange={(evt, value, reason) =>
                  onLocationChange(evt, value, reason)
                }

                renderInput={(params) => {
                  return (
                    <TextField
                      {...params}
                      placeholder='Type or Select a State'
                      variant='outlined'
                      sx={{
                        width: '100%',
                        p: 0,
                      }}
                    />
                  );
                }}
              />
            </Box>
            {/* #endregion */}
            {/* #region search counties */}
            <Box>
              <FormLabel
                label
                htmlFor='county'>
                County/counties:
              </FormLabel>
              <Autocomplete
                id='county'
                name='county'
                tabIndex={5}a
                options={counties}
                value={ counties && counties.filter((v) => {
                  if(state.county.includes(v.value))
                  {
                    console.log(`Match on ${v.value} for ${state.county}`);
                    return v.value;
                  }
                  else{
                    //console.log(`No match on ${v.value} for ${state.county}`)
                    return `not found`
                  }
                  })}
                onChange={(evt, value, reason) =>
                  onCountyChange(evt, value, reason)
                }
                getOptionLabel={(v) => (
                  v.label.length > 25 ? `${v.label.slice(0, 25)}...` : `${v.label}`
                )}
                //getOptionLabel={(agencyOptions) => agencyOptions.label}
                renderInput={(params) => {
                  return (
                    <TextField
                      placeholder='Type or Select a Counties'
                      {...params}
                      variant='outlined'
                      sx={{
                        width: '100%',
                        p: 0,
                      }}
                    />
                  );
                }}
              />
            </Box>
            {/* #endregion */}
            {/* #region dates */}
            {/* Authorized Only Filters */}
            <div hidden={!Globals.authorized()}>
              <div hidden={!Globals.curatorOrHigher()}></div>
              <Divider />
              {/* #region search action type */}
              <div hidden={!Globals.authorized()}>
                {/* <Box id="action-type-box">
                  <FormLabel htmlFor='searchAction'>Action Type:</FormLabel>
                  <Autocomplete
                    {...filterProps}
                    id='searchAction'
                    name='searchAction'
                    tabIndex={10}
                    className={'classes.autocomplete'}
                    options={actions}
                    value={state.actionRaw}  
                    onChange={(evt, value, reason) => onActionChange(evt, value, reason)}
                    renderInput={(params) => {
                      return (
                        <TextField
                          {...params}
                          placeholder='Type or Select a Action Type(s)'
                          variant='outlined'
                          sx={{
                            width: '100%',
                            p: 0,
                          }}
                        />
                      );
                    }}
                  />
                </Box> */}
                {/* #endregion */}
              </div>
            </div>
            {/* #endregion */}
            <div hidden={!Globals.authorized()}>
              {/* #region search decision */}
              {/* <Item>
                <FormLabel htmlFor='searchDecision'></FormLabel>
                <Typography variant='filterLabel'>Decision Type</Typography>
                <Autocomplete
                  id='searchDecision'
                  name='decision'
                  tabIndex='11'
                  options={decisions}
                  placeholder='Type or select decision type(s)'
                  onChange={(evt, value, reason) =>
                    onDecisionChange(evt, value, reason)
                  }
                  value={decisions.filter((v)=> decisions.filter(v))}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant='outlined'
                      placeholder='Type or select decision type(s)'
                      sx={{
                        width: '100%',
                        p: 0,
                      }}
                    />
                  )}
                />
              </Item> */}
              {/* #endregion */}
            </div>
            <Divider />

            <Item>
              <Box
                display={'flex'}
                xs={12}
                flexDirection={'column'}
                padding={0}
                margin={0}
                width={'100%'}
                alignContent={'center'}
                justifyItems={'center'}>
                <SearchDatePickers
                  onStartDateChange={(evt) => onStartDateChange(evt)}
                  onEndDateChange={(evt) => onEndDateChange(evt)}
                  startDate={state.startDate}
                  endDate={Date.now - 1}
                />
              </Box>
            </Item>
            {/* #endregion */}

            <Divider />
              {/* #region document type filters */}
            <Item>
              <Box>
                <Checkbox
                  name='typeFinal'
                  id='typeFinal'
                  tabIndex='12'
                  checked={state.typeFinal}
                  onChange={(evt) => onTypeChecked(evt)}
                  className={classes.checkbox}
                />
                <FormLabel>
                  <Typography variant='filterLabel'>
                    Draft EIS {props.draftCount ? props.draftCount : ''}
                  </Typography>
                </FormLabel>
                <Box>
                  <Checkbox
                    name='typeEA'
                    id='typeEA'
                    className={classes.checkbox}
                    tabIndex='13'
                    checked={state.typeEA}
                    onChange={(evt) => onTypeChecked(evt)}
                  />
                  <label htmlFor='typeEa'>
                    <Typography variant='filterLabel'>
                      EA {props.eaCount ? props.eaCount : ''}
                    </Typography>
                  </label>
                </Box>
                <Box>
                  <Checkbox
                    name='typeNOI'
                    tabIndex='14'
                    checked={state.typeNOI}
                    onChange={(evt) => onTypeChecked(evt)}
                    className={classes.checkbox}
                  />
                  <label htmlFor='typeNOI'>
                    <Typography variant='filterLabel'>
                      NOI {props.noiCount ? props.noiCount : ''}{' '}
                    </Typography>
                  </label>
                </Box>
                <Box>
                  <Checkbox
                    name='typeROD'
                    id='typeROD'
                    tabIndex='15'
                    checked={state.typeROD}
                    onChange={(evt) => onTypeChecked(evt)}
                    className={classes.checkbox}
                  />
                  <label htmlFor='typeROD'>
                    <Typography variant='filterLabel'>
                      ROD {props.rodCount ? props.rodCount : ''}
                    </Typography>
                  </label>
                </Box>
                <Box>
                  <Checkbox
                    name='typeScoping'
                    id='typeScoping'
                    //className="sidebar-checkbox"
                    tabIndex='16'
                    checked={state.typeScoping}
                    onChange={(evt) => onTypeChecked(evt)}
                  />

                  <Typography
                    variant='filterLabel'
                    color='black'>
                    Scoping Report {props.typeScopingCount}
                  </Typography>
                </Box>
              </Box>
            </Item>
            {/* #endregion */}
            {/* #region advanced */}
            <div
              className='filter'
              hidden={!Globals.curatorOrHigher()}>
              <Divider />

              <Typography variant='h6'>Advanced</Typography>
              <div className='sidebar-checkboxes'>
                <Checkbox
                  type='checkbox'
                  name='typeFinal'
                  checked={props.useOptions}
                  onChange={(evt) => {
                    console.log(`file: SideBarFilters.jsx:492 ~ SideBarFilters ~ evt:`, evt);
                    onUseOptionsChecked(evt)
                  }}
                />
                <label
                  className='checkbox-text'
                  htmlFor='typeFinal'>
                  Apply filters to search query
                </label>
              </div>
            </div>
            {/* #endregion */}
          </Item>
          {/* #region organization */}
          <Item
            hidden={state.hideOrganization}
            id='agency-svg-holder'>
            <button onClick={(evt) => orgClick(evt)}>x</button>
          </Item>
          {/* #endregion */}
        </Grid>
      </Paper>
    </>
  );
};
//export default withStyles(useStyles)(SideBarFilters);
export default SearchFilters;
