import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Grid,
  List,
  ListItem,
  FormControl,
  MenuItem,
  Select,
  Divider,
  InputLabel,
  Typography,
} from '@mui/material';
import {
  SortOutlined,
  SortByAlphaIcon,
  StarIcon,
  FavoriteBorderIcon,
  Download,
  Favorite,
  FilterListIcon,
  Filter,
} from '@mui/icons-material';
import SearchContext from '../MainSearch/SearchContext';
import { on } from 'events';

export default function SearchResultOptions() {
  const {
    searchState,
    setSearchState,
    onSortByChangeHandler,
    onLimitChangeHandler,
    onSortDirectionChangeHandler,
    onDownloadClick,
    onSaveSearchResultsClick,
  } = useContext(SearchContext);
  const { sortBy, sortDirection, limit } = searchState;
  console.log(
    '🚀 ~ file: SearchResultOptions.jsx:26 ~ SearchResultOptions ~ sortBy, sortDirection, limit:',
    sortBy,
    sortDirection,
    limit,
  );

  return (
    <>
      <Grid flexGrow={1}  container spacing={2} alignItems="flex-end" justifyContent="flex-end ">
        <Grid item md={4} justifyContent={'center'} >
        <Typography
            variant="searchResultTitle"
            paddingTop={1}
            paddingBottom={1}
            marginTop={2}
            marginBottom={2}
          >
            Search Results
          </Typography>
        </Grid>
        <Grid item md={2} justifyContent={'flex-end'}>
          <FormControl>
            <InputLabel id="limit-select-lalbel">Display:</InputLabel>
            <Select
              value={limit}
              id="demo-simple-select"
              onChange={onLimitChangeHandler}
            >
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={20}>20</MenuItem>
              <MenuItem value={25}>25</MenuItem>
              <MenuItem value={50}>50</MenuItem>
              <MenuItem value={100}>100</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid md={3} justifyContent={'flex-end'} item>
          <FormControl>
            <InputLabel id="sort-by-select-label">Sort By</InputLabel>
            <Select value={sortBy} onChange={onSortDirectionChangeHandler}>
              <MenuItem value="relevance">Relevance</MenuItem>
              <MenuItem value="title">Title</MenuItem>
              <MenuItem value="date">Date</MenuItem>
              <MenuItem value="distance">Distance</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item md={1}>
          <FormControl>
            {/* <InputLabel id="sort-direction-select-label">Sort Direction</InputLabel> */}
            <SortOutlined value={sortDirection} onChange={onSortDirectionChangeHandler} />
            {/* <Select
                value={sortDirection}
                onChange={onSortDirectionChangeHandler}
              >
                <MenuItem value="asc">ASC</MenuItem>
                <MenuItem value="desc">DESC</MenuItem>
              </Select> */}
          </FormControl>
        </Grid>

        <Grid item md={1}>
          <Download onClick={onDownloadClick} />
        </Grid>
        <Grid item md={1}>
          <Favorite onClick={onSaveSearchResultsClick} />
        </Grid>
      </Grid>
      <Divider/>
    </>
  );
}
