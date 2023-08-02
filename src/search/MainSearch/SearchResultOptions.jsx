import { SortOutlined } from '@mui/icons-material';
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  MenuItem,
  Paper,
  Select,
  Typography,
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
  border: 1,
  borderRight: 1,
  borderColor: theme.palette.divider,
}));
// height: 75,

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
  const { sortBy, sortDirection, limit, showContext, snippetsDisabled } = searchState;

  const onCheckboxChange = (evt) => {
    console.log('Checkbox changed, setting content to  ', !searchState.hidden);
    setSearchState({
      ...searchState,
      hidden: !searchState.hidden,
      showContext: evt.target.checked,
    });
  };
  return (
    <>
      <Grid container flex={1} spacing={0} border={0} justifyContent={'flex-start'}>
        <Grid xs={4}>
          <Item
            elevation={0}
            justifyContent="center"
            sx={{
              justifyContent: 'center',
              alignItems: 'center',
              display: 'flex',
              borderRight: 1,
              borderColor: 'lightgray',
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
            elevation={0}
            sx={{
              justifyContent: 'center',
              alignItems: 'center',
              display: 'flex',
              borderRight: 1,
              borderColor: 'lightgray',
            }}
          >
            <FormControlLabel
              itemID="sort"
              id="sort-by-select-label"
              labelPlacement="start"
              label={<Typography variant="formContolLabel" sx={{ marginRight: 2 }}>Sort by:</Typography>}
              control={
                <Select
                  id="search-result-options-sort-by-select"
                  value={sortBy}
                  label={
                    <Typography variant="formContolLabel" sx={{ marginRight: 2 }}>
                      Sort By:
                    </Typography>
                  }
                  defaultValue={25}
                  onChange={onSortDirectionChangeHandler}
                >
                  <MenuItem value="relevance">Relevance</MenuItem>
                  <MenuItem value="title">Title</MenuItem>
                  <MenuItem value="date">Date</MenuItem>
                  <MenuItem value="distance">Distance</MenuItem>
                </Select>
              }
            ></FormControlLabel>
          </Item>
        </Grid>
        <Grid xs={3}>
          <Item
            justifyContent="center"
            elevation={0}
            sx={{
              justifyContent: 'center',
              alignItems: 'center',
              display: 'flex',
              borderRight: 1,
              borderColor: 'lightgray',
            }}
          >
            <FormControl>
              <FormControlLabel
                itemID="search-result-options-pagesize-select"
                id="sort-by-select-label"
                labelPlacement="start"
                label={
                  <Typography variant="formContolLabel" sx={{ marginRight: 2 }}>
                    Page Size:
                  </Typography>
                }
                control={
                  <Select
                    id="search-result-options-sort-by-select"
                    value={searchState.limit}
                    defaultValue={25}
                    onChange={onSortDirectionChangeHandler}
                    label="Page Size"
                  >
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={25}>25</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                    <MenuItem value={100}>100</MenuItem>
                  </Select>
                }
              ></FormControlLabel>
            </FormControl>
          </Item>
        </Grid>
        <Grid
          xs={2}
          container
          flex={1}
          spacing={0}
          elevation={0}
          id="search-result-options-icon-container"
          alignItems={'center'}
          alignContent={'Center'}
          justifyContent={'center'}
        >
          <Grid xs={3} flex={1} id="search-result-options-icon-items">
            <Item
              id="search-result-options-icon-item"
              justifyContent="center"
              elevation={0}
              height="auto"
              sx={{
                justifyContent: 'center',
                alignItems: 'center',
                display: 'flex',
                borderRight: 1,
                borderColor: 'lightgray',
              }}
            >
              <SortOutlined value={sortDirection} onChange={onSortDirectionChangeHandler} />
            </Item>
          </Grid>
          <Grid xs={3} flex={1} id="search-result-options-grid-container">
            <Item
              id="search-result-sort-item"
              justifyContent="center"
              elevation={0}
              sx={{
                justifyContent: 'center',
                alignItems: 'center',
                display: 'flex',
                borderRight: 0,
                borderColor: 'lightgray',
              }}
            >
              <SortOutlined value={sortDirection} onChange={onSortDirectionChangeHandler} />
            </Item>
          </Grid>

          <Grid xs={3}>
            <Item
              elevation={0}
              sx={{
                justifyContent: 'center',
                alignItems: 'center',
                display: 'flex',
                borderLeft: 1,
                borderColor: 'lightgray',
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
