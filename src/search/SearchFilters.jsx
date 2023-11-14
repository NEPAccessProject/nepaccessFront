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
  FormControlLabel,
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
    padding: 0,
    margin: 0
  }
}));

const SearchFilters = (props) => {
  const { state, setState } = useContext(SearchContext);
  const classes = useStyles(theme);
  const {
    eaCount,
    finalCount,
    filtersHidden,
    noiCount,
    rodCount,
    typeScopingCount,
    scopingCount,
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
    EISCount,
    draftCount,

  } = props;

  //Common Settings used by all autocomplete filters
  const filterProps = {
    //fullWidth: true,
    multiple: true,
    autoComplete: true,
    autoFocus: false,
    //autoHighlight: true,
    limitTags: 3,
    disablePortal: true,
    variant: 'standard',
    closeText: '...Close',
    forcePopupIcon: true,
    selectOnFocus: true,

    //render selected values from the dropdown
    renderTags: (props, option, state, ownerState) => {
      return (
        props.map((prop, idx) => (
          <Chip size="small" color="primary" fontSize="small" key={props.label} label={abbreviate(prop.label, 30)} />
        ))
      )
    },
    //render selected values for the dropdown options
    getOptionLabel: (option) => abbreviate(option.label, 50),
    getLimitTagsText: (options) =>
      options.label.length > 10
        ? options.label.slice(0, 10) + '...'
        : options.label,

    // ),
  };
  const abbreviate = (text = "", length = 20) => {
    if (!text.length) {
      console.warn(`The text specified is empty this is most likely an upstream issue`)
      return "TEXT NOT FOUND!!!!"
    }
    else {
      return text.length > length ? text.slice(0, length) + '...' : text
    }
  }

  return (
    <>
        <Paper elevation={1} sx={{
          boxShadow: '0px 4px 8px rgba(0.5, 0.5, 0.5, 0.15)'
        }}>
          <Grid container flex={1} hidden={state.filtersHidden}>
            <Grid item xs={12}>
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
              <Grid item
                xs={12}
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
              </Grid>
              <Divider />
              {/* #region search agencies */}
              <Grid item xs={12}>
                <FormControl
                  fullWidth
                  xs={{
                    p: 1,
                    mb: 1,
                    mt: 1,
                  }}>
                  <FormLabel htmlFor='searchAgency'>
                    Lead Agencies:
                  </FormLabel>
                  <Autocomplete
                    fullWidth
                    id='agency'
                    name='agency'
                    {...filterProps}
                    tabIndex={4}
                    options={agencies}
                    value={agencies.filter((v) => state.agency.includes(v.value))}
                    onChange={(evt, value, tag) => onAgencyChange(evt, value, tag)}
                    renderInput={(params) => {
                      return (
                        <TextField
                          {...params}
                          placeholder='Type or Select Lead Agencies'
                          variant='outlined'
                          sx={{
                            wordWrap: 'break-word',
                            overflow: 'hidden',
                            p: 0,
                          }}
                        />
                      );
                    }}
                  />
                </FormControl>

                {/* #endregion */}
              </Grid>
              {/* #region search */}
              {/* #regionSearch Agency */}
              <Grid item xs={12}>
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
                    fullWidth
                    id='searchAgency'
                    name='cooperatingAgency'
                    {...filterProps}
                    tabIndex={4}
                    options={agencies}
                    value={agencies.filter((v) =>
                      state.cooperatingAgency.includes(v.value),
                    )}
                    onChange={(evt, value, tag) => onCooperatingAgencyChange(evt, value, tag)}
                    renderInput={(params) => {
                      return (
                        <TextField
                          {...params}
                          placeholder='Type or Select Cooperating Agencies'
                          variant='outlined'
                          sx={{
                            wordWrap: 'break-word',
                            overflow: 'hidden',
                            p: 0,
                          }}
                        />
                      );
                    }}
                  />
                </FormControl>
              </Grid>
              {/* #endregion */}
              <Divider />
              {/* #region search states */}
              <Grid item xs={12}>
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
              </Grid>
              {/* #endregion */}
              {/* #region search counties */}
              <Grid item xs={12} >
                <FormLabel
                  label
                  htmlFor='county'>
                  County/counties:
                </FormLabel>
                <Autocomplete
                  id='county'
                  {...filterProps}
                  name='county'
                  tabIndex={5}
                  options={state.countyOptions}
                  value={state.countyOptions.filter((v) => state.county.includes(v.value))}
                  onChange={(evt, value, reason) =>
                    onCountyChange(evt, value, reason)
                  }
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
              </Grid>
              {/* #endregion */}
              {/* #region dates */}
              {/* Authorized Only Filters */}
              {/* <div hidden={!Globals.authorized()}> */}
              {/* <div hidden={!Globals.curatorOrHigher()}></div> */}
              <Divider />
              {/* #region search action type */}
              {/* <div hidden={!Globals.authorized()}> */}
              <div>
                <Grid item xs={12} flex={1} id="action-type-box">

                  <FormLabel htmlFor='searchAction'>Action Type:</FormLabel>
                  <Autocomplete
                    {...filterProps}
                    id='searchAction'
                    name='searchAction'
                    tabIndex={10}
                    className={'classes.autocomplete'}
                    options={actions}
                    value={(actions.filter((v) => state.action.includes(v.value)))}
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
                </Grid>
                {/* #endregion */}
              </div>
              {/* </div> */}
              {/* #endregion */}
              <Grid flexDirection={'column'} container flex={1} hidden={!Globals.authorized()}>
                {/* #region search decision */}
                <Grid item xs={12}>
                  <FormLabel htmlFor='searchDecision'></FormLabel>
                  <Typography variant='filterLabel'>Decision Type</Typography>
                  <Autocomplete
                    id='searchDecision'
                    name='decision'
                    {...filterProps}
                    tabIndex='11'
                    options={decisions}
                    placeholder='Type or select decision type(s)'
                    onChange={(evt, value, reason) =>
                      onDecisionChange(evt, value, reason)
                    }
                    value={decisions.filter((v) => state.decision.includes(v))}
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
                </Grid>
                {/* #endregion */}
              </Grid>
              <Divider />

                <Grid item xs={12}>
                    <SearchDatePickers
                      onStartDateChange={(evt) => onStartDateChange(evt)}
                      onEndDateChange={(evt) => onEndDateChange(evt)}
                      startDate={state.startDate}
                      endDate={Date.now - 1}
                    />
                </Grid>
              {/* #endregion */}

              <Divider />
              {/* #region document type filters */}
              <Grid container flex={1}>
              <Grid item xs={12}>
                  <FormControlLabel
                    label={<Typography variant='filterLabel'>Final EIS {EISCount ? EISCount : ''}</Typography>}
                    control={
                      <Checkbox
                        name='typeDraft'
                        id='typeDraft'
                        tabIndex='12'
                        checked={state.typeFinal}
                        onClick={onTypeChecked}
                        className={classes.checkbox}
                      />
                    }
                  />
                  </Grid>

                <Grid item xs={12}>
                  <FormControlLabel
                    label={<Typography variant='filterLabel'>Draft EIS {draftCount ? draftCount : ''}</Typography>}
                    control={
                      <Checkbox
                        name='typeDraft'
                        id='typeDraft'
                        tabIndex='12'
                        checked={state.typeDraft}
                        onClick={onTypeChecked}
                        className={classes.checkbox}
                      />
                    }
                  />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      label={<Typography variant='filterLabel'>EA {eaCount ? eaCount : ''}</Typography>}
                      control={
                        <Checkbox
                          name='typeEA'
                          id='typeEA'
                          className={classes.checkbox}
                          tabIndex='13'
                          checked={state.eaCount}
                          onChange={onTypeChecked}
                        />
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      label={<Typography variant='filterLabel'>NOI {noiCount ? noiCount : ''}</Typography>}
                      control={
                        <Checkbox
                          name='typeNOI'
                          tabIndex='14'
                          checked={state.typeNOI}
                          onChange={onTypeChecked}
                          className={classes.checkbox}
                        />
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      label={<Typography variant='filterLabel'>ROD {rodCount ? rodCount : ''}</Typography>}
                      control={
                        <Checkbox
                          name='typeROD'
                          id='typeROD'
                          tabIndex='15'
                          checked={state.typeROD}
                          onChange={(evt) => onTypeChecked(evt)}
                          className={classes.checkbox}
                        />
                      }
                    />
                  </Grid>
                  <Box>
                    <FormControlLabel
                    label={<Typography variant='filterLabel'>Scoping Report {scopingCount ? scopingCount : ''}</Typography>}
                    control={
                      <Checkbox
                        name='typeScoping'
                        id='typeScoping'
                        //className="sidebar-checkbox"
                        tabIndex='16'
                        checked={state.typeScoping}
                        onChange={(evt) => onTypeChecked(evt)}
                      />
                    }
                    />
                  </Box>
              </Grid>
              {/* #endregion */}
              {/* #region advanced */}
              <div
                className='filter'
                hidden={!Globals.curatorOrHigher()}>
                <Divider />

                <Typography variant='h6'>Advanced</Typography>
                <div className='sidebar-checkboxes'>
                  <FormControlLabel
                    label={<Typography variant='filterLabel'>Final {finalCount ? finalCount : ''}</Typography>}
                    control={
                      <Checkbox
                        type='checkbox'
                        name='typeFinal'
                        checked={props.useOptions}
                        onClick={(evt) => onTypeChecked(evt)}
                        onChange={(evt) => {
                          console.log(`file: SideBarFilters.jsx:492 ~ SideBarFilters ~ evt:`, evt);
                          onTypeChecked(evt)
                        }}
                      />
                    }
                  />
                </div>
              </div>
              {/* #endregion */}
            </Grid>
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

function dumpObject(obj) {
  const _obj = {
    ...obj,
    ...Object.keys(obj).reduce((acc, key) => {
       acc[key] = dumpObject(obj[key]);
       return acc;
     }, {}),
  }
  console.log(`file: SearchFilters.jsx:573 ~ dumpObject ~ _obj:`, _obj);

  return (
    Object.keys(obj).map((key) =>
      `${key}: ${obj[key] - typeof(obj[key])}`).join
  )
}
