import React from 'react';

import { Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import theme from '../../styles/theme';
//import Grid from '@mui/material/Grid'; // Grid version 1
import Grid from '@mui/material/Unstable_Grid2';
import { makeStyles } from '@mui/styles';
import SearchResultOptions from './SearchResultOptions';
import SearchResultItems from './SearchResultsItems';
import SearchTips from './SearchTips';
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
  console.log('🚀 ~ file: SearchResults.jsx:69 ~ sortByRelevance ~ a, b:', a, b);
  return a.score > b.score;
};

export default function SearchResults(props) {
  console.log('🚀 ~ file: SearchResults.jsx:74 ~ SearchResults ~ props:', props);
  const classes = useStyles(theme);
  const { results } = props;
  console.log('🚀 ~ file: SearchResults.jsx:104 ~ SearchResults ~ results:', results);
  const { records } = results;
  console.log('🚀 ~ file: SearchResults.jsx:78 ~ SearchResults ~ records:', records);
  // const sortedResults = results && results.length ? results.sort(sortByRelevance) : [];
  //  console.log('🚀 ~ file: SearchResults.jsx:106 ~ SearchResults ~ sortedResults:', sortedResults);

  //  console.log("🚀 ~ file: SearchResults.jsx:129 ~ SearchResults ~ results:", results)
  return (
    <div id="search-results-root">
      <Grid container display={'flex'} flex={1} border={0} width={'100%'}>
        <Grid xs={12} border={1} justifyContent={'flex-start'} alignContent={'center'} justifyItems={'flex-start'}>
          <SearchResultOptions />
        </Grid>
      </Grid>
      {results && results.length && results.length > 0 ? (
        results.map((result, index) => {
          return (
            <>
              <SearchResultItems result={result} />
            </>
          );
        })
      ) : (
        <>
        <SearchTips/>
        </>
      )}
    </div>
  );
}

export function SearchResult(props) {
  console.log('🚀 ~ file: SearchResult.jsx:152 ~ SearchResult ~ props:', props);
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