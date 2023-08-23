import React, { useEffect, useRef, useState } from 'react';

import { Box, Grid, Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import theme from '../../styles/theme';
//import Grid from '@mui/material/Grid'; // Grid version 1
import { makeStyles } from '@mui/styles';
import SearchResultItems from './SearchResultsItems';
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

const sortByRelevance = (a, b) => {
  return a.score > b.score;
};

//not having a dependency should... only run once per result set
const SearchResults = (props) => {
  console.log("🚀 ~ file: SearchResults.jsx:71 ~ SearchResults ~ props:", props)
  const classes = useStyles(theme);
  const { results } = props;
  const { records,docs } = results;
  console.log("🚀 ~ file: SearchResults.jsx:75 ~ SearchResults ~ docs:", docs)
  console.log("🚀 ~ file: SearchResults.jsx:75 ~ SearchResults ~ records:", records)
  const [sortedResults, setSortedResults] = useState([]);
  const _mounted = useRef(false);
  useEffect(()=>{
    _mounted.current = true;
  },()=>{
    console.log('unmounted searchResults')
    _mounted.current = false;
  })

  const sortResults = (results)=> {
    results.map((result,idx)=>{
      console.log('sorting results',results);
      if(result.records && result.records.length){
        console.log('pre stored records',result.records);
        result.records.sort((a,b) => {
          const sortedRecords =  Date.parse(a.commentDate) > Date.parse(b.commentDate);
          result.records = sortedRecords;

          console.log('Sorted is result records are now',result.records);
          setSortedResults(result);
//          sortedResults.push(result)
      })
      } 
      else{
        console.log('Result has no records?',result)
        result.records = [];
      }
    })

  };
  return (
    <Paper id="search-results-root">
      {/* <Typography variant="searchResultSubTitle" padding={2}>
        {results[0].title}
      </Typography> */}
      {results && results.length ? (
        results.map((result, index) => {
          return (
             <>
             <Typography variant="h2" padding={2}>
              {/* {(result.records && result.records[0].title) &&
                <a href="#">{result.records[0].title} - {result.records[0].id}</a>
              } */}
              </Typography>
                <Box sx={{marginTop:2}}><SearchResultCards result={result}/>              <SearchResultItems result={result} /></Box>
              </>
          );
        })
      ) : (
        <>{/* <SearchTips/> */}</>
      )}
    </Paper>
  );
}
export default React.memo(SearchResults);
 
//useMemo(()=>SearchResults,[results]);

export function SearchResultCards(props) {
  const classes = useStyles(theme);
  const { result } = props;
  console.log('Search Result Card Props',props);
  return (
    <Grid padding={2} container xs={12} flexDirection={'row'} flex={1}>
      <Item
        className={classes.itemHeader}
        sx={{
          margin: 0.5,
          padding: 1,
          elevation: 1,
        }}
      >
        
        Status: <b>{result.decision ? result.decision : 'N/A'}</b>
      </Item>
      <Item
        className={classes.itemHeader}
        sx={{
          margin: 0.5,
          padding: 1,
          elevation: 1,
        }}
      >
        Date: <b>{result.commentDate ? result.commentDate : 'N/A'}</b>
      </Item>
      <Item
        className={classes.itemHeader}
        sx={{
          margin: 0.5,
          padding: 1,
          elevation: 1,
        }}
      >
        State: <b>{result.state ? result.state : 'N/A'}</b>
      </Item>
      <Item
        className={classes.itemHeader}
        sx={{
          margin: 0.5,
          padding: 1,
          elevation: 1,
        }}
      >
        County: <b>{result.county ? result.county : 'N/A'}</b>
      </Item>
      <Item
        className={classes.itemHeader}
        sx={{
          margin: 0.5,
          padding: 1,
          elevation: 1,
        }}
      >
        Action: <b>{result.action ? result.action : 'N/A'}</b>
      </Item>
      <Item
        className={classes.itemHeader}
        sx={{
          margin: 0.5,
          padding: 1,
          elevation: 1,
        }}
      >
        Decision <b>{result.decision ? result.decision : 'N/A'}</b>
      </Item>
      {/* {(result.commentDate) 
            ? ( */}
      <Item
        className={classes.itemHeader}
        sx={{
          margin: 0.5,
          padding: 1,
          elevation: 1,
        }}
      >
        Project Start Date: <b>{result.registerDate ? result.registerDate : 'N/A'}</b>
      </Item>
      <Item
        className={classes.itemHeader}
        sx={{
          margin: 0.5,
          padding: 1,
          elevation: 1,
        }}
      >
        Project Endate Date: <b>{result.commentDate ? result.commentDate : 'N/A'}</b>
      </Item>
      <Item
        className={classes.itemHeader}
        sx={{
          margin: 0.5,
          padding: 1,
          elevation: 1,
        }}
      >
        Final NOA: <b>{result.finalNoa ? result.finalNoa : 'N/A'}</b>
      </Item>
      <Item
        className={classes.itemHeader}
        sx={{
          margin: 0.5,
          padding: 1,
          elevation: 1,
        }}
      >
        Draft NOA: <b>{result.draftNoa ? result.draftNoa : 'N/A'}</b>
      </Item>
      <Item
        className={classes.itemHeader}
        sx={{
          margin: 0.5,
          padding: 1,
          elevation: 1,
        }}
      >
        Process ID: <b>{result.processId ? result.processId : 'N/A'}</b>
      </Item>
          
      
      {/* ) : (
        <></>
      )} */}
    </Grid>
  );
}