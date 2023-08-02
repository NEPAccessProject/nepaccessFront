import React from 'react';

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

export default function SearchResults(props) {
  const classes = useStyles(theme);
  const { results } = props;
  const { records } = results;
  // const sortedResults = results && results.length ? results.sort(sortByRelevance) : [];
  //  console.log('🚀 ~ file: SearchResults.jsx:106 ~ SearchResults ~ sortedResults:', sortedResults);

  //  console.log("🚀 ~ file: SearchResults.jsx:129 ~ SearchResults ~ results:", results)
  return (
    <Paper id="search-results-root">
      {/* <Typography variant="searchResultSubTitle" padding={2}>
        {results[0].title}
      </Typography> */}
      {results && results.length && results.length > 0 ? (
        results.map((result, index) => {
          return (
             <>
             <Typography variant="searchResultSubTitle" padding={2}>
              {(result.records && result.records[0].title) &&
                <a href="#">{result.records[0].title}</a>
              }
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

export function SearchResultCards(props) {
  const classes = useStyles(theme);
  const { result } = props;
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
      {/* ) : (
        <></>
      )} */}
    </Grid>
  );
}