import React, { useState } from 'react';
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
import { ThemeProvider, styled } from '@mui/material/styles';
import theme from '../../styles/theme';
//import Grid from '@mui/material/Grid'; // Grid version 1
import Grid from '@mui/material/Unstable_Grid2';
import { InputAdornment, SearchOutlined } from '@mui/icons-material';
import {
  proximityOptions,
  actionOptions,
  decisionOptions,
  agencyOptions,
  stateOptions,
  countyOptions,
} from '../options';
import { withStyles } from '@mui/styles';
import SideBarFilters from './SideBarFilters';
import ResponsiveSearchResults from './ResponsivSearchResults';
import { lightBlue } from '@mui/material/colors';

const Item = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  // ...theme.typography.body2,
  padding: theme.spacing(1),
  // textAlign: 'center',
  color: theme.palette.text.secondary,
  elevation: 0,
  borderRadius: 0,
  mt: 1,
  mb: 1,
  pl: 0,
  pr: 0,
  '&:hover': {
    //           backgroundColor: //theme.palette.grey[200],
    boxShadow: '0px 4px 8px rgba(0.5, 0.5, 0.5, 0.15)',
    cursor: 'pointer',
    '& .addIcon': {
      color: 'darkgrey',
    },
  },
}));

const useStyles = (theme) => ({
  formControl: {},
  autocomplete: {},
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
};
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

const styles = {
  fontFamily: 'sans-serif',
  textAlign: 'center',
};
const section = {
  height: '100%',
  paddingTop: 5,
  backgroundColor: '#fff',
};
const summary = {
  marginTop: 15,
  marginBottom: 15,
  padding: 10,
  backgroundColor: '#d4d4d4',
};

export default function Search(props) {
  console.log('searchState Options:', stateOptions);
  return (
    <ThemeProvider theme={theme}>
      <Container disableGutters={true} sx={{}}>
        <div style={styles}>
          <Grid container layout={'row'} spacing={1}>
            <Grid item xs={3}>
              <div style={section}>
                {' '}
                <ListItem>Search Tips</ListItem>
                <ListItem>Search Tips</ListItem>
                <ListItem>Search Tips</ListItem>
              </div>
            </Grid>

            <Grid item xs={9}>
              <div style={section}>
                {' '}
                <Box
                  display={'flex'}
                  justifyContent={'center'}
                  justifyItems={'center'}
                  alignItems={'center'}
                  alignContent={'center'}
                  height={125}
                  paddingLeft={2}
                  paddingRight={2}
                >
                  {' '}
                  <TextField
                    fullWidth
                    backgroundColor={'white'}
                    id="main-search-text-field"
                    variant="standard"
                    onInput={onInput}
                    onKeyUp={onKeyUp}
                    placeholder="Search for NEPA documents"
                    value={'titleRaw'}
                    autoFocus
                    InputProps={{
                      endAdornment: (
                        <IconButton onClick={(evt) => onChangeHandler(evt)}>
                          <SearchOutlined />
                        </IconButton>
                      ),
                    }}
                  />
                </Box>
              </div>
            </Grid>
          </Grid>
        </div>

        <Grid
          mt={2}
          textAlign={'left'}
          alignContent={'flex-start'}
          spacing={1}
          rowSpacing={1}
          justifyContent={'flex-start'}
          container
        >
          <Grid xs={3} p={0}>
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
              <ResponsiveSearchResults />
            </Item>
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
          border: 0,
          p: 0,
          ml: 0,
          mr: 0,
          mt: 1,
          mb: 1,
        }}
      />
    </>
  );
}
export function SearchBar(props) {
  const [titleRaw, setTitleRaw] = React.useState(props.titleRaw);
  return (
    <>
      <FormControl id={'search-form-control'} fullWidth>
        <TextField
          fullWidth
          backgroundColor={'white'}
          id="main-search-bar"
          variant="outlined"
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
      </FormControl>
    </>
  );
}
