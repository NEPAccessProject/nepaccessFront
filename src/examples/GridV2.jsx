import React, { useState } from 'react';
import { Paper, Button, Input, Box, Divider, FormControl, Autocomplete, InputLabel,ListItem,IconButton, TextField, Typography, Container, FormLabel } from '@mui/material';
import { styled } from '@mui/material/styles';
import Select from 'react-select';
import theme from '../styles/theme';
//import Grid from '@mui/material/Grid'; // Grid version 1
import Grid from '@mui/material/Unstable_Grid2';
import { InputAdornment, SearchOutlined } from '@mui/icons-material';
import { proximityOptions, actionOptions, decisionOptions,agencyOptions,stateOptions,countyOptions} from '../search/options';
import SearchFilter from '../search/SearchFilter';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  // textAlign: 'center',
  color: theme.palette.text.secondary,
  elevation:0
}));

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

export default function GridV2(props) {
  const [search, setSearch] = useState('');
  const [county, setCounty] = useState('');
  const [location, setLocation] = useState('');
  const [proximity, setProximity] = useState('');
  const [selectedCounty, setSelectedCounty] = useState('');
  const [agencyRaw, setAgencyRaw] = useState('');
const classes = useStyles(theme);
  return (
    <>
      <Container disableGutters={true} sx={{ flexGrow: 1 }}>
        <Grid alignContent={'center'} minWidth={150} container spacing={1}>
          <Grid xs={12} md={3}>
            <Item>
              <Box elevation={0} height={'100%'}>
                <ListItem>Search Tips</ListItem>
                <ListItem>available files</ListItem>
                <ListItem>Quick-start guide</ListItem>
              </Box>
            </Item>
          </Grid>
          <Grid md={9} xs={12} flexGrow={1} flexShrink={1} flexWrap={'nowrap'} justifyContent="center">
            <Item>
            <Box pt={1} elevation={0}>
                <SearchBar />
              </Box>
            </Item>
          </Grid>
        </Grid>
        <Grid mt={2} textAlign={'left'} alignContent={'flex-start'} spacing={1} rowSpacing={1} justifyContent={'flex-start'} container >
          <Grid xs={3} p={0} >
            <Item>
            <ProximitySelect />
          <Divider />
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

          <Divider />

            </Item>
          </Grid>
          <Grid xs={8}>
            <Item><h4>Search Results</h4></Item>

          </Grid>
        </Grid>
      </Container>
    </>
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
