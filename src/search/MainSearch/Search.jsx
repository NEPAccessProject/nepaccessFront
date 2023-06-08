import React, { useState } from 'react';
import { Paper, Button, Input, Box, Divider, FormControl,Select, Autocomplete, InputLabel,ListItem,IconButton, TextField, Typography, Container, FormLabel } from '@mui/material';
import { ThemeProvider, styled } from '@mui/material/styles';
import theme from '../../styles/theme';
//import Grid from '@mui/material/Grid'; // Grid version 1
import Grid from '@mui/material/Unstable_Grid2';
import { InputAdornment, SearchOutlined } from '@mui/icons-material';
import { proximityOptions, actionOptions, decisionOptions,agencyOptions,stateOptions,countyOptions} from '../options';
import {withStyles} from '@mui/styles'
import SideBarFilters from './SideBarFilters';
import ResponsiveSearchResults from './ResponsivSearchResults';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  // ...theme.typography.body2,
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
        color: "darkgrey"
      }
    }}));

const useStyles = (theme) => ({
  formControl:{

  },
  autocomplete: {

  }
});
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

export default function Search(props) {
  console.log('searchState Options:', stateOptions);
  return (

      <ThemeProvider theme={theme}>
        <Container disableGutters={true} sx={{ flexGrow: 1 }}>
          <Grid alignContent={'center'} minWidth={150} container spacing={1}>
            <Grid xs={12} md={3}>
              <Item>
                <Box elevation={0}>
                  <ListItem>Search Tips</ListItem>
                  <ListItem>available files</ListItem>
                  <ListItem>Quick-start guide</ListItem>
                </Box>
              </Item>
            </Grid>
            <Grid md={9} xs={12} flexGrow={1} flexShrink={1} flexWrap={'nowrap'} justifyContent="center">
              <Item>
              <Box mt={1} mb={1} elevation={0}>
                  <SearchBar />
                </Box>
              </Item>
            </Grid>
          </Grid>
          <Grid mt={2} textAlign={'left'} alignContent={'flex-start'} spacing={1} rowSpacing={1} justifyContent={'flex-start'} container >
            <Grid xs={3} p={0} >
              <Paper>
              <SideBarFilters 
                countyOptions={countyOptions}
                stateOptions={stateOptions}
                agencyOptions={agencyOptions}
                actionOptions={actionOptions}
                decisionOptions={decisionOptions}
              />
              </Paper>
            <Divider />
            </Grid>
            <Grid xs={9}>
              <Item>
                <ResponsiveSearchResults/>
              </Item>
            </Grid>
            <Grid>
  
            </Grid>
          </Grid>
        </Container>
      </ThemeProvider>
  );
}
export function ProximitySelect(props) {
  const [proximityDisabled, setProximityDisabled] = React.useState(false);
  const [proximityOption, setProximityOption] = React.useState(null);
  const [proximityOptionValue, setProximityOptionValue] = React.useState(null);
  return (
    <>
      <Select
        // width={'100%'}
        variant="standard"
        id="proximity-select"
        className={proximityDisabled ? ' disabled' : ''}
        // classNamePrefix="react-select control"
        placeholder="Find within..."
        options={proximityOptions}
        value={proximityOptionValue}
        // menuIsOpen={true}
        onChange={onProximityChange}
        isMulti={false}
        xs={{
          border:0,
          p:0,
          ml:0,
          mr:0,
          mt:1,
          mb:1,
        }}
      />
    </>
  );
}
export function SearchBar(props) {
  const [titleRaw, setTitleRaw] = React.useState(props.titleRaw);
  return (
    <>
      <TextField
        fullWidth
        id="standard-bare"
        variant="standard"
        onInput={onInput}
        onKeyUp={onKeyUp}
        placeholder="Search for NEPA documents"
        value={titleRaw}
        autoFocus
        InputProps={{
          endAdornment: (
            <IconButton onClick={(evt) => onChangeHandler(evt)}>
              <SearchOutlined />
            </IconButton>
          ),
        }}
      />
    </>
  );
}
