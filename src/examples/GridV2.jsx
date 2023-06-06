import React, { useState } from 'react';
import { Input, TextField, Paper, Box, IconButton, Container, List, Autocomplete,ListItem,Divider } from '@mui/material';
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
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const useStyles = (theme) => ({

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
  const classes= useStyles(theme);
  const [search, setSearch] = useState('');
  const [county, setCounty] = useState('');
  const [location, setLocation] = useState('');
  const [proximity, setProximity] = useState('');
  const [selectedCounty, setSelectedCounty] = useState('');
  const [agencyRaw, setAgencyRaw] = useState('');

  return (
    <>
      <Container sx={{ flexGrow: 1 }}>
        <Grid border={1} alignContent={'center'} minWidth={150} container spacing={1}>
          <Grid xs={12} md={2} justifyContent="center">
            <Item>
              xs=2
              <Box elevation={1} height={160}>
                <ListItem>Search Tips</ListItem>
                <ListItem>available files</ListItem>
                <ListItem>Quick-start guide</ListItem>
              </Box>
            </Item>
          </Grid>
          <Grid md={3} xs={12} justifyContent="center" height={160}>
            <Item>
              <Box elevation={1} height={160} flexWrap={'none'}>
                <ProximitySelect />
             </Box>
            </Item>
          </Grid>
          <Grid md={7} xs={12} justifyContent="center" height={160}>
            <Item>
              {' '}
              xs=7
              <Box elevation={1} height={160} flexWrap={'none'}>
                <SearchBar />
              </Box>
            </Item>
          </Grid>

          <Grid xs={3}>
            <Item>
            <div>
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

          </div>
          <div>
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
          </div>
          <Divider />
          <div>
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

          </div>

          <div>
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
          </div>

          <Divider />

            </Item>
          </Grid>
          <Grid xs={9}>
            <Item><h4>Search Results</h4></Item>

          </Grid>
        </Grid>
      </Container>
      {/* <Box
        maxWidth="lg"
        sx={{
          backgroundColor: '#9eabae',
					flexGrow: 1,
        }}
      >
          <Grid container border={1} spacing={1}>
            <Grid border={1} md={3} lg={3}>
                <Box>
                  <List>
                    <ListItem>Search Tips</ListItem>
                    <ListItem>available files</ListItem>
                    <ListItem>Quick-start guide</ListItem>
                  </List>
                </Box>
            </Grid>
							<Box xs={12} md={9} lg={9} bgcolor={'darkgray'}  minWidth={'100%'} border={1} justifyContent={'center'} justifyItems={'center'} alignContent={'center'} >
								<Grid border={3} justifyContent={'center'} alignItems={'center'}  xs={12} md={3} lg={3}>
										<Box><ProximitySelect /></Box>
								</Grid>
								<Grid border={2} lg={6} md={6}>
										<Box elevation={1}  bgcolor={"#ccc"}><RenderSearchBar /></Box>
							</Grid>
							</Box>
				</Grid>
				</Box> */}
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
        width={'100%'}
        id="proximity-select"
        className={proximityDisabled ? ' disabled' : ''}
        classNamePrefix="react-select control"
        placeholder="Find within..."
        options={proximityOptions}
        value={proximityOptionValue}
        // menuIsOpen={true}
        onChange={onProximityChange}
        isMulti={false}
        xs={{
          minHeight: 160,
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
