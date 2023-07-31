import {
  SortOutlined
} from '@mui/icons-material';
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  MenuItem,
  Paper,
  Select
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 
import { styled } from '@mui/material/styles';
import React, { useContext } from 'react';
import SearchContext from '../MainSearch/SearchContext';
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  elevation: 0,
  border:0,
 height: 75,
 borderRadius:0,

}));
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
  const { sortBy, sortDirection, limit, showContext,snippetsDisabled } = searchState;

  const onCheckboxChange = (evt) => {
    console.log('Checkbox changed, setting showContext to ', evt.target.checked);
    setSearchState({
      ...searchState,
      showContext: evt.target.checked
    });
  };
  console.log("🚀 ~ file: SearchResultOptions.jsx:54 ~ SearchResultOptions ~ searchState:", searchState)
  return (
    <>
      <Grid
        container
        flex={1}
        spacing={0}
        justifyContent={'flex-start'}
        backgroundColor="#ccc"
      >
        <Grid xs={4}>
          <Item
            justifyContent="center"
            sx={{
              justifyContent: 'center',
              alignItems: 'center',
              display: 'flex',
            }}
          >
            <FormControl>
              <FormControlLabel
                control={
                  <Checkbox
                    // checked={searchOptions}
                    checked={showContext}
                    onChange={onCheckboxChange}
                    disabled={snippetsDisabled}
                  />
                }
                label="Show Text Snippets"
              />
            </FormControl>
          </Item>
        </Grid>
        <Grid xs={3}>
          <Item
            justifyContent="center"
            sx={{
              justifyContent: 'center',
              alignItems: 'center',
              display: 'flex',
            }}
          >
            <Select
              id="search-result-options-sort-by-select"
              value={sortBy}
              onChange={onSortDirectionChangeHandler}
            >
              <MenuItem value="relevance">Relevance</MenuItem>
              <MenuItem value="title">Title</MenuItem>
              <MenuItem value="date">Date</MenuItem>
              <MenuItem value="distance">Distance</MenuItem>
            </Select>
          </Item>
        </Grid>
        <Grid xs={3}>
          <Item
            justifyContent="center"
            sx={{
              justifyContent: 'center',
              alignItems: 'center',
              display: 'flex',
            }}
          >
            <FormControl>
              {/* <FormControlLabel itemID="search-result-options-sort-by-select" id="sort-by-select-label">
                Sort By
              </FormControlLabel> */}
              <Select
                id="search-result-options-sort-by-select"
                value={sortBy}
                onChange={onSortDirectionChangeHandler}
              >
                <MenuItem value="relevance">Relevance</MenuItem>
                <MenuItem value="title">Title</MenuItem>
                <MenuItem value="date">Date</MenuItem>
                <MenuItem value="distance">Distance</MenuItem>
              </Select>
            </FormControl>
          </Item>
        </Grid>
        <Grid xs={2} container spacing={0}>
          <Grid xs={3} flex={1}>
            <Item
              justifyContent="center"
              sx={{
                justifyContent: 'center',
                alignItems: 'center',
                display: 'flex',
              }}
            >
              <SortOutlined value={sortDirection} onChange={onSortDirectionChangeHandler} />
            </Item>
          </Grid>
          <Grid xs={3} flex={1}>
            <Item
              justifyContent="center"
              sx={{
                justifyContent: 'center',
                alignItems: 'center',
                display: 'flex',
              }}
            >
              <SortOutlined value={sortDirection} onChange={onSortDirectionChangeHandler} />
            </Item>
          </Grid>

          <Grid xs={3}>
            <Item
              sx={{
                justifyContent: 'center',
                justifyContent: 'center',
                alignItems: 'center',
                display: 'flex',
              }}
            >
              <SortOutlined value={sortDirection} onChange={onSortDirectionChangeHandler} />
            </Item>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
