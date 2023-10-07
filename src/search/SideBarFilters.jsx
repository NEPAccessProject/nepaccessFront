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
  actionOptions as actions,
  agencyOptions as agencies,
  decisionOptions as decisions,
  countyOptions as counties,
} from './options';
//filter out duplicates
const actionOptions = Array.from(new Set(actions));
const agencyOptions = Array.from(new Set(agencies));
const countyOptions = Array.from(new Set(counties));
const decisionOptions = Array.from(new Set(decisions));
const stateOptions = Array.from(new Set(Globals.locations));

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
    fontSize: 10,
    padding:0,
    margin:0
  }
}));

const SideBarFilters = (props) => {
  const { state, setState } = useContext(SearchContext);
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
                Border={0}
                borderRadius={0}>
                Clear Filters
              </Button>
              {/* {renderClearFiltersButton()} */}
            </Box>
            <Divider />
            <Box>
              <FormControl fullWidth>
                <FormLabel htmlFor='searchAgency'>Lead Agencies:</FormLabel>
                <Autocomplete
                  id='searchAgency'
                  name='agency'
                  {...filterProps}
                  tabIndex={3}
                  options={agencyOptions}
                  value={agencyOptions.filter((v) =>
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
                  getOptionLabel={(v) => (v.label.length > 25 ? `${v.label.slice(0, 25)}...` : `${v.label}`)}
                  renderInput={(params) => {
                    params.inputProps.className = classes.autoComplete;
                    return (
                      <TextField
                        {...params}
                        placeholder='Type or Select Lead Agencies'
                        variant='outlined'
                        sx={{
                          fontSize: 6,
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
                  options={agencyOptions}
                  value={agencyOptions.filter((v) =>
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
            <Divider />
            <Box>
              <FormLabel htmlFor='state'>State(s) and Location(s):</FormLabel>
              <Autocomplete
                id='state'
                name='state'
                {...filterProps}
                options={stateOptions}
                value={stateOptions.filter((v) =>
                  state.state.includes(v.value),
                )}
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
            <Box>
              <FormLabel
                Label
                htmlFor='county'>
                County/counties:
              </FormLabel>
              <Autocomplete
                id='county'
                name='county'
                tabIndex={5}
                options={state.countyOptions}
                value={
                  state.countyOptions &&
                  state.countyOptions.filter((v) =>
                    state.county.includes(v.value),
                  )
                }
                onChange={(evt, value, reason) =>
                  onCountyChange(evt, value, reason)
                }
                getOptionLabel={(v) => (
                  <Typography variant='filterLabel'>
                    {v.label.length > 25 ? `${v.label.slice(0, 25)}...` : `${v.label}`}
                  </Typography>
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
            <div hidden={!Globals.authorized()}>
              <div hidden={!Globals.curatorOrHigher()}></div>
              <Divider />

              <div hidden={!Globals.authorized()}>
                <Box>
                  <FormLabel htmlFor='searchAction'>Action Type:</FormLabel>
                  <Autocomplete
                    id='searchAction'
                    name='searchAction'
                    tabIndex={10}
                    className={'classes.autocomplete'}
                    options={actionOptions}
                    //                      value={getValue(actionOptions, state.action)}
                    onChange={(evt, value, reason) =>
                      onActionChange(evt, value, reason)
                    }
                    getOptionLabel={(v) => (
                      v.label.length > 25 ? `${v.label.slice(0, 25)}...` : `${v.label}`
                    )}
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
                </Box>
              </div>
            </div>
            <div hidden={!Globals.authorized()}>
              <Item>
                <FormLabel htmlFor='searchDecision'></FormLabel>
                <Typography variant='filterLabel'>Decision Type</Typography>
                <Autocomplete
                  id='searchDecision'
                  name='decision'
                  tabIndex='11'
                  options={decisionOptions}
                  placeholder='Type or select decision type(s)'
                  multiple={true}
                  onChange={(evt, value, reason) =>
                    onDecisionChange(evt, value, reason)
                  }
                  value={decisionOptions.filter((v) =>
                    state.decision.includes(v.value),
                  )}
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
              </Item>
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

            <Divider />
            <Item>
              {/* <Typography var="filterLabel">Document Type</Typography>              */}
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
                    //                      className="sidebar-checkbox"
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
                  onChange={(evt) => onUseOptionsChecked(evt)}
                />
                <label
                  className='checkbox-text'
                  htmlFor='typeFinal'>
                  Apply filters to search query
                </label>
              </div>
            </div>
          </Item>
          <Item
            hidden={state.hideOrganization}
            id='agency-svg-holder'>
            <button onClick={(evt) => orgClick(evt)}>x</button>
          </Item>
        </Grid>
      </Paper>
    </>
  );
};
//export default withStyles(useStyles)(SideBarFilters);
export default SideBarFilters;
