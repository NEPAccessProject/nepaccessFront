import React, { useState, useEffect } from 'react';
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
  Chip,
  Checkbox,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import theme from '../../styles/theme';
//import Grid from '@mui/material/Grid'; // Grid version 1
import Grid from '@mui/material/Unstable_Grid2';
import { InputAdornment, Search, SearchOutlined } from '@mui/icons-material';
import {
  proximityOptions,
  actionOptions,
  decisionOptions,
  agencyOptions,
  stateOptions,
  countyOptions,
} from '../options';
import SearchFilter from './SearchFilter';
import SearchResultOptions from './SearchResultOptions';
import SearchResultItems from './SearchResultsItems';
import { makeStyles, withStyles } from '@mui/styles';

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
  s;
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

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  // textAlign: 'center',
  color: theme.palette.text.secondary,
  elevation: 1,
  border: 0,
  borderRadius: 1,
}));

const CardItem = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  // textAlign: 'center',
  color: theme.palette.text.secondary,
  elevation: 1,
  margin: 0.5,
  padding: 1,
  elevation: 1,
}));

const useStyles = makeStyles((theme) => ({
  resultsHeader: {
    fontFamily: 'open sans',
    fontSize: 50,
    fontWeight: 'bolder',
    padding: 4,
    margin: 2,
  },
  resultItemHeader: {
    fontSize: 25,
    fontWeight: 'bold',
    margin: 0.5,
    padding: 1,
    elevation: 1,
  },
  itemHeader: {
    fontFamily: 'open sans',
    fontSize: 40,
    fontWeight: 'bold',
    margin: 0.5,
    padding: 1,
    elevation: 1,
    p: 1,
    '&:hover': {
      //textDecoration: 'underline'
      boxShadow: '0px 4px 8px rgba(0.5, 0.5, 0.5, 0.15)',
    },
    infoCard: {
      padding: 1,
      margin: 1,
    },
  },
}));

export default function SearchResults(props) {
  const classes = useStyles(theme);
  const {results} = props;
  console.log("🚀 ~ file: SearchResults.jsx:130 ~ SearchResults ~ results:", results)
  return (
    <div id="search-results-root">
      <Grid container flex={1} border={0}>
        <Grid item xs={12} alignContent={'center'} justifyItems={'center'}><SearchResultOptions /></Grid>
      </Grid>
      <Box p={2} border={0} justifyContent={'center'} justifyItems={'center'} alignContent={'center'} marginTop={1} marginBottom={1}>
        <Typography variant="searchResultSubTitle">
          <a href="">Lake Ralph Hall Regional Water Supply Reservoir Project</a>
        </Typography>
      </Box>
      <Box
        sx={{
          height: '100%',
        }}
      >
        {/* <Box padding={1} marginTop={0} marginBottom={1}>
          <Typography
            variant="searchResultTitle"
            paddingTop={1}
            paddingBottom={1}
            marginTop={2}
            marginBottom={2}
          >
            Search Results
          </Typography>
        </Box> */}
        <Divider />

        <Divider />
        <Grid container xs={12}>
          <Grid
            padding={2}
            container
            xs={12}
            flexDirection={'row'}
            flex={1}
          >
            <Item
              className={classes.itemHeader}
              sx={{
                margin: 0.5,
                padding: 1,
                elevation: 1,
              }}
            >
              Status: <b>Final</b>
            </Item>
            <Item
              className={classes.itemHeader}
              sx={{
                margin: 0.5,
                padding: 1,
                elevation: 1,
              }}
            >
              Date: <b>2020-01-01</b>
            </Item>
            <Item
              className={classes.itemHeader}
              sx={{
                margin: 0.5,
                padding: 1,
                elevation: 1,
              }}
            >
              State: <b>TX</b>
            </Item>
            <Item
              className={classes.itemHeader}
              sx={{
                margin: 0.5,
                padding: 1,
                elevation: 1,
              }}
            >
              County: <b>TX: Fannin</b>
            </Item>
            <Item
              className={classes.itemHeader}
              sx={{
                margin: 0.5,
                padding: 1,
                elevation: 1,
              }}
            >
              Action: <b>Water Work</b>
            </Item>
            <Item
              className={classes.itemHeader}
              sx={{
                margin: 0.5,
                padding: 1,
                elevation: 1,
              }}
            >
              Decision <b>Project</b>
            </Item>
            <Item
              className={classes.itemHeader}
              sx={{
                margin: 0.5,
                padding: 1,
                elevation: 1,
              }}
            >
              Action: <b>Transportation</b>
            </Item>
            <Item
              className={classes.itemHeader}
              sx={{
                margin: 0.5,
                padding: 1,
                elevation: 1,
              }}
            >
              Decision <b>Project</b>
            </Item>
            <Item
              className={classes.itemHeader}
              sx={{
                margin: 0.5,
                padding: 1,
                elevation: 1,
              }}
            >
              County: <b>AZ: Pima; AZ: Santa Cruz; AZ: Yavapai</b>
            </Item>
          </Grid>
          <Grid id="search-result-item-grid-container" container xs={12}>
            <Item>
             {
              (results) ?
              results.map((result,idx)=>{
                return(
                <div key={idx}>
                  <h2>Search Result Item {idx}</h2>
                  <SearchResultItems
                    result={result.records}                    
                  />
                </div>
                )})
                : null
              }
            </Item>
            
        
          </Grid>
          {/* <Grid className={'search-result-grid-item'} border={0}>
              <Item xs={12}
                 
                >
                <SearchResultItems
                publishedYear={2020}
                  title="Environmental Impact Statement"
                  id={17704}
                  status="Draft"
                  content="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Mi proin sed libero enim. Morbi tincidunt ornare massa eget. Venenatis lectus magna fringilla urna porttitor. Habitasse platea dictumst vestibulum rhoncus. Neque sodales ut etiam sit amet nisl. Tincidunt dui ut ornare lectus sit amet est. Suspendisse in est ante in. Et malesuada fames ac turpis egestas maecenas. Gravida in fermentum et sollicitudin ac orci phasellus. Risus viverra adipiscing at in tellus integer. Sem et tortor consequat id porta nibh venenatis. Porttitor leo a diam sollicitudin tempor id eu nisl."
                />
              </Item>
            </Grid> */}
        </Grid>
      </Box>
    </div>
  );
}
