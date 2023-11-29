import { SortOutlined } from '@mui/icons-material';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useMediaQuery } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2';
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  MenuItem,
  Paper,
  Select,
  Hidden,
  Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

//import Grid from '@mui/material/Grid'; // Grid version
import { styled } from '@mui/material/styles';
import theme from '../styles/theme';
import React, { useContext } from 'react';
import SearchContext from './SearchContext';
// height: 75,
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: '#000',
  },
  paper: {
    padding: 1, //theme.spacing(2),
    textAlign: 'center',
    color: 'black', //theme.palette.text.secondary,
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    verticalAlign: 'middle',
    border: 1,
    borderColor: theme.palette.divider,
    paddingTop: 2,
    paddingBottom: 2,
  }
}));

function SearchResultOptions(props) {
  const {
    setPageInfo,
    onCheckboxChange,
    onLimitChangeHandler,
    onSortDirectionChangeHandler,
    onDownloadClick,
    onSaveSearchResultsClick,
    onCheckBoxChange,
    onSortByChangeHandler,
    onUseOptionsChecked,
    onCheckboxChecked,
    sort,
  } = props;

  // console.log(`file: SearchResultOptions.jsx:58 ~ SearchResultOptions ~ props:`, props);
  const ctx = useContext(SearchContext)
  const classes = useStyles(theme);
  const { state, setState } = ctx;
  //assign default values to args
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const gridItemStyle = {
//    justifyContent: isDesktop ? 'center' : 'flex-start',
//    alignItems: isDesktop ? 'center' : 'flex-start',
    justifyContent: 'flex-start',
//    margin:2,
//    padding: isDesktop ? 2 : 10,
    flexGrow: 1,
//    alignContent: 'center',
    border:1,
//    borderColor: isDesktop ? 'center' : 'flex-start',
    //borderColor: '#ddd'
    flex: 1,
  }

  const { showContext = false, sortBy = 'relevance', sortDirection = 'ASC', limit = 100, snippetsDisabled = false } = state;
  return (
    <>
      <Grid container
        flex={1}
        border={2}
        borderColor={'green'}
        style={{
          // marginLeft:'5%',
          // marginRight: '5%',
          borderColor: '#ddd'
        }}
      // justifyContent={isDesktop ? 'center' : 'flex-start'}
      >

          <Grid xs={12} border={1} md={6} border={0} id="result-options-grid-top-container">
            <Grid xs={12}
              borderRight={1} style={gridItemStyle} id="show-checkbox-grid-item" className={classes.container}
            >
              <ShowTextCheckbox showContext={showContext} onCheckboxChecked={(evt) => onCheckboxChecked(evt)} />
            </Grid>
            <Grid xs={12} borderRight={1} style={gridItemStyle} id="sort-by-grid-item"
            >
              <SortByControl onSortByChangeHandler={onSortByChangeHandler} orderBy={sortBy} />
            </Grid>
          </Grid>

          <Grid xs={12} md={6} borderRight={1} style={gridItemStyle} id="sort-by-grid-item">
            <SortDirControl onSortDirectionChangeHandler={onSortDirectionChangeHandler} sortDirection={sortDirection} />
          </Grid>
          <Grid xs={12} md={1} style={gridItemStyle}>
            <CloudDownloadIcon
              value={sortDirection}
              onChange={onDownloadClick}
            />
          </Grid>
        </Grid>
    </>
  );
}

const ShowTextCheckbox = (props) => {

  const classes = useStyles(theme);
  const { onCheckboxChecked, showContext, useSearchOptions } = props
  return (
    <FormControl className={classes.centered}>
      <FormControlLabel
        control={
          <Checkbox
            name="showContext"
            //checked={showContext}
            checked={showContext}
            onChange={(evt) => onCheckboxChecked(evt)}

          // disabled={snippetsDisabled}
          />
        }
        label='Show Text Snippets'
      />
    </FormControl>
  )
}

const SortByControl = (props) => {
  const { onSortByChangeHandler, orderBy } = props
  const classes = useStyles(theme);
  return (
    <FormControlLabel
      itemID='sort'
      id='sort-by-select-label'
      labelPlacement='start'
      label={
        <Typography
          variant='formContolLabel'
          sx={{ marginRight: 2 }}
          >
          Sort by:
        </Typography>
      }
      control={
        <Select
          id='search-result-options-sort-by-select'
          value={orderBy}
          label={
            <Typography
              variant='formContolLabel'
              >
              Sort By:
            </Typography>
          }
          name='sort'
          defaultValue={'relevance'}
          placeholder='Select...'
          onChange={(evt) => onSortByChangeHandler(evt)}>
          <MenuItem value='relevance'>Relevance</MenuItem>
          <MenuItem value='title'>Title</MenuItem>
          <MenuItem value='date'>Date</MenuItem>
          <MenuItem value='distance'>Distance</MenuItem>
        </Select>
      }></FormControlLabel>
  )
}
const SortDirControl = (props) => {
  const { onSortDirectionChangeHandler, sortDirection } = props;
  return (
    <>
      <FormControlLabel
        itemID='sort'
        id='sort-by-select-label'
        labelPlacement='start'
        marginRight={4}
        label={
          <Typography
            variant='formContolLabel'>
            Sort by:
          </Typography>
        }
        control={
          <Select
            id='search-result-options-sort-by-select'
            value={sortDirection}
            label={
              <Typography variant='formContolLabel'>
                Sort By:
              </Typography>
            }
            name='sort'
            defaultValue={'relevance'}
            placeholder='Select...'
            onChange={(evt) => onSortDirectionChangeHandler(evt)}>
            <MenuItem value='ASC'>ASC</MenuItem>
            <MenuItem value='DESC'>DESC</MenuItem>
          </Select>
        }></FormControlLabel>
    </>
  )
}
export default SearchResultOptions;
