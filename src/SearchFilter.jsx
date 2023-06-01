import React from 'react'

import { Paper, Button, Box,  Divider, FormControl, Autocomplete,InputLabel,TextField, Typography,Grid } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { InputAdornment } from '@mui/icons-material';
import { makeStyles,withStyles } from '@mui/styles';
import theme from './styles/theme';
import dayjs from 'dayjs';

const useStyles = (theme) => ({
  root: {
    display: 'flex',
    m: 2,
  },

  drawer: {
    width: drawerWidth,
    flexShrink: 1,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerContainer: {
    overflow: 'auto',
    // padding: theme.spacing(2),
  },
  datapicker: {
    p: 0,
    m: 0,
    minWidth: 220,
    width: '100%',
  },
  formControl: {
    // marginBottom: theme.spacing(2),
    minWidth: 120,
    width: '100%',
  },
  submitButton: {
    //margin: theme.spacing(3, 0, 2),},
  },
  formLabel: {
    // fontSize: '1.2em',
    // fontWeight: 'bold',
    padding: 0,
    margin: 0,
    display: 'block',
  },
  box: {
    margin: 5,
    padding: 5,
  },
  autocomplete: {
    p: 0,
    m: 0,
    width: '100%',
    minWidth: 300,
    maxHeight: 50,
  },
  select: {
    border: 'none',
    //backgroundColor: theme.palette.grey[150],
    '&:hover': {
      p: 0,
      //   backgroundColor: theme.palette.grey[100],
      '&:hover': {
        // backgroundColor: theme.palette.grey[150],
        // boxShadow: theme.palette.grey[300],
        cursor: 'pointer',
      },
    },
  },
});

const drawerWidth = 200;

//[TODO] validate required key / values
// const filter = {
  // className: '',
  // placeholder: '',
  // value: this.state.proximityDisabled,
  // onChange: () => {},
  // onClear: () => {},
  // type: Autocomplete,
  // id: 'searchAgency'
  //   options: [],
  //   label: '',
  //   options: []
// };

export default function SearchFilter(props) {
    if(!props.filter){
      console.error('Unable ')
    }
    const { className,label ,placeholder, options, onChange, value,id } = props.filter;
    console.log('Received Class Name',className)
    const classes =  useStyles(theme);
    console.log('CLASSES',classes)
//    console.log('SearchFilter props',props);

    console.log(`${id} options length`,options.length, options[0])
    if(options.length === 0){
      console.log('The options of the filter are either undefined or have no values ',id);
    }
    return (
      <div className="search-filter">
        <Box>
          <FormControl variant="filled">
            
            {/* <InputLabel
                htmlFor="proximity-select"
                className={classes.formLabel}
            >{label}</InputLabel> */}
            <Autocomplete
             id={id}
              sx={{
                width: '100%',
                minWidth: 250,
                height: 50,
                p: 0,
                m: 0,
              }}
              // className={className.toString() ? ' disabled' : ''}
              placeholder={placeholder}
              options={options}
              value={value}
              // menuIsOpen={true}
              onChange={onChange}
              getOptionLabel={(option) => option.label || label }
              renderInput={(params) => <TextField {...params} />}
            />
          </FormControl>
          <Divider />
        </Box>
      </div>
    );
}