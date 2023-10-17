import { SortOutlined } from '@mui/icons-material';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import FavoriteIcon from '@mui/icons-material/Favorite';
import {
	Checkbox,
	FormControl,
	FormControlLabel,
	MenuItem,
	Paper,
	Select,
	Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import Grid from '@mui/material/Grid'; // Grid version
import { styled } from '@mui/material/styles';
import theme from '../styles/theme';
import React, { useContext } from 'react';
import SearchContext from './SearchContext';
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
    border:1,
    borderColor: theme.palette.divider,
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
  const {state,setState} = ctx;
  //assign default values to args
  const { showContext=false,sortBy='relevance', sortDirection='ASC', limit=100, snippetsDisabled = false } = state;
	return (
		<>
      <Grid container flex={1} border={1} borderColor={'#ddd'} display={'flex'} style={{
        //marginLeft:'5%',
        marginRight: '5%',
      }}>
        <Grid item xs={5} borderRight={1} borderColor={'#ddd'} id="show-checkbox-grid-item" className={classes.container} display={"flex"}>
          <ShowTextCheckbox showContext={showContext} onCheckboxChecked={(evt) => onCheckboxChecked(evt)}/>
        </Grid>
        <Grid item xs={3} borderRight={1} borderColor={'#ddd'} id="sort-by-grid-item" display="flex" justifyContent={"center"}>
          <SortByControl onSortByChangeHandler={onSortByChangeHandler} orderBy={sortBy}/>
        </Grid>
        <Grid item xs={3} borderRight={1} borderColor={'#ddd'} id="sort-by-grid-item" display="flex" justifyContent={"center"}>
          <SortDirControl onSortDirectionChangeHandler={onSortDirectionChangeHandler} sortDirection={sortDirection}/>
        </Grid>
        <Grid item xs={1} className={classes.container} alignItems={"center"} display={"flex"} justifyContent={"center"} alignContent={"center"}>
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
  const { onCheckboxChecked,showContext,  useSearchOptions } = props
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
          sx={{ marginRight: 2 }}>
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
              sx={{ marginRight: 2 }}>
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
  const {onSortDirectionChangeHandler,sortDirection} = props;
  return(
    <>
    <FormControlLabel
      itemID='sort'
      id='sort-by-select-label'
      labelPlacement='start'
      marginRight={4}
      label={
        <Typography
          variant='formContolLabel'
          sx={{ marginRight: 2 }}>
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
