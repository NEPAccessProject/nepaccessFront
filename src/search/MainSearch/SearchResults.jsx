import React, { useState, useReducer, useContext, useEffect } from 'react';

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

const sortByRelevance = (a,b) => {
  return a.score > b.score;
}

export default function SearchResults(props) {
  const classes = useStyles(theme);
  const {results} = props;
  console.log("🚀 ~ file: SearchResults.jsx:104 ~ SearchResults ~ results:", results)
  const sortedResults = (results && results.length) ?  results.sort(sortByRelevance) : [];
  console.log("🚀 ~ file: SearchResults.jsx:106 ~ SearchResults ~ sortedResults:", sortedResults)

  //  console.log("🚀 ~ file: SearchResults.jsx:129 ~ SearchResults ~ results:", results)
  return (
    <div id="search-results-root">
      {/* <Grid container flex={1} border={0}>
        <Grid item xs={12} alignContent={'center'} justifyItems={'center'}><SearchResultOptions /></Grid>
      </Grid> */}
        {JSON.stringify(sortedResults)}
        { sortedResults.map((result,idx)=>{
        return ( 
        <Grid key={idx} container xs={12}>
          <div>
            {idx} - {JSON.stringify(result.doc)}

          </div>
          <SearchResult result={result}/>
          <Grid id="search-result-item-grid-container" container xs={12}>
            <Item>
              <h2>Result?</h2>
              {JSON.stringify(result.doc)}
               {results.map((result,idx)=>{
                 return (
                   <div key={idx}>
                    <b>index:</b> {idx}
                    {JSON.stringify(result.doc)}
                 {
                  <SearchResultItems result={result.doc}/>
                 
                 } 
                 <Divider/>
                </div>
                )
                })
              }
              <Divider/>
            </Item>
          </Grid>
        </Grid>
        )})}
        
    </div>
  );
}

export function SearchResult(props){
  console.log("🚀 ~ file: SearchResult.jsx:152 ~ SearchResult ~ props:", props)
  const classes = useStyles(theme);
  const {result} = props; 
  return(
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
      Status: <b>{(result.decision) ? result.decision : "N/A"}</b>
    </Item>
    <Item
      className={classes.itemHeader}
      sx={{
        margin: 0.5,
        padding: 1,
        elevation: 1,
      }}
    >
      Date: <b>{(result.commentDate) ? result.commentDate : "N/A" }</b>
    </Item>
    <Item
      className={classes.itemHeader}
      sx={{
        margin: 0.5,
        padding: 1,
        elevation: 1,
      }}
    >
      State: <b>{(result.state) ? result.state : "N/A"}</b>
    </Item>
    <Item
      className={classes.itemHeader}
      sx={{
        margin: 0.5,
        padding: 1,
        elevation: 1,
      }}
    >
      County: <b>{(result.county) ? result.county : "N/A"}</b>
    </Item>
    <Item
      className={classes.itemHeader}
      sx={{
        margin: 0.5,
        padding: 1,
        elevation: 1,
      }}
    >
      Action: <b>{(result.action) ? result.action : "N/A"}</b>
    </Item>
    <Item
      className={classes.itemHeader}
      sx={{
        margin: 0.5,
        padding: 1,
        elevation: 1,
      }}
    >
      Decision <b>{(result.decision) ? result.decision : "N/A"}</b>
    </Item>

  </Grid>
  )
}
