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
  elevation: 0,
  border: 0,
  borderRadius: 0,
  marginTrim: 1,
  marginBottom: 1,
  paddingLeft: 1,
  paddingRight: 1,
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
  return (
    <>
      <SearchResultOptions />

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
        <Grid container>
          <Box p={1} marginTop={1} marginBottom={1}>
            <Typography variant="searchResultSubTitle">
              Lake Ralph Hall Regional Water Supply Reservoir Project
            </Typography>
          </Box>
          <Divider />
          <Grid container xs={12}>
            <Grid
              padding={2}
              flexWrap={'wrap'}
              container
              xs={12}
              flexDirection={'row'}
              flex={1}
              border={0}
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

            <Grid xs={12} container>
              <Item xs={12}>
                <SearchResultItems
                  title="Environmental Impact Statement"
                  id={17704}
                  publishedYear={2018}
                  status="Pending"
                  content="Probability That Monthly Flow below Lake Ralph Hall Dam at Bakers Creek Exceeds
                      Channel Pool Volume of 175 ac-ft: 62.2% 73.0%Probability That Monthly Flow at North
                      Sulphur River Gage near Cooper Exceeds Channel Pool Volume of 175 ac-ft: 82.1%
                      83.8%PER- EXCEED-CENTILE ENCEPROBA-BILITY From From From From From From From From
                      From From From FromRiverWare WAM RiverWare WAM RiverWare WAM RiverWare WAM RiverWare
                      WAM RiverWare WAM% % ac-ft/mon ac-ft/mon ac-ft/mon ac-ft/mon ac-ft/mon ac-ft/mon
                      ac-ft/mon ac-ft/mon ac-ft/mon ac-ft/mon ac-ft/mon ac-ft/mon1.0% 99.0% 0 0 0 0 0 2 1
                      3 308 208 308 2842.0% 98.0% 0 0 0 0 0 3 5 4 316 310 341 4163.0% 97.0% 0 0 0 0 0 4 11
                      10 343 378 369 4724.0% 96.0% 3 2 1 3 4 9 30 23 350 384 442 5095.0% 95.0% 5 4 1 5 9
                      16 38 34 394 423 527 5907.0% 93.0% 13 8 3 9 22 28 63 57 455 473 720 75110.0% 90.0%
                      27 17 5 19 45 54 114 121 658 587 1,046 1,18015.0% 85.0% 76 48 14 47 115 149 288 364
                      1,051 1,053 1,740 1,91916.2% 83.8% 90 57 18 53 147 175 329 425 1,151 1,201"
                />
              </Item>
            </Grid>
            <Grid className={'search-result-grid-item'} border={0}>
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
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
