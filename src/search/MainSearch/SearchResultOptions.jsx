import {
  Download,
  Favorite,
  SortOutlined
} from '@mui/icons-material';
import {
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useContext } from 'react';
import SearchContext from '../MainSearch/SearchContext';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  padding: theme.spacing(1),
  color: theme.palette.text.secondary,
  elevation: 1,
  borderRadius: 1,
  mt: 1,
  mb: 1,
  pl: 0,
  pr: 0,
  '&:hover': {
    // //           backgroundColor: //theme.palette.grey[200],
    // boxShadow: '0px 4px 8px rgba(0.5, 0.5, 0.5, 0.25)',
    // backgroundColor: '#eee',
    // cursor: 'pointer',
    // '& .addIcon': {
    //   color: 'darkgrey',
    // },
  },
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
  const { sortBy, sortDirection, limit, showContext } = searchState;
  console.log("🚀 ~ file: SearchResultOptions.jsx:54 ~ SearchResultOptions ~ searchState:", searchState)
  return (
    <>
      <Grid flexGrow={1} container spacing={2} alignItems="flex-end" justifyContent="flex-end ">
        <Grid item md={3} justifyContent={'center'}>
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
            <InputLabel id="number-of-results-select-label" itemID="number-of-results-select">
              Display:
            </InputLabel>
            <Select value={limit} id="number-of-results-select" onChange={onLimitChangeHandler}>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={20}>20</MenuItem>
              <MenuItem value={25}>25</MenuItem>
              <MenuItem value={50}>50</MenuItem>
              <MenuItem value={100}>100</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        {/* <Grid item md={2} justifyContent={'flex-end'}>
          <Item alignItems="center">
            <Box marginBottom={0}>
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

            </Box>
          </Item>
        </Grid> */}
        <Grid md={2} justifyContent={'flex-end'} item>
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
      <Divider />
    </>
  );
}
