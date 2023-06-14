import React from 'react'

import { Paper, Button, Box,  Divider, FormControl, Autocomplete,InputLabel,TextField, Typography,Grid,Container } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { InputAdornment } from '@mui/icons-material';
import theme from '../../styles/theme';
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
  // formControl: {
  //   // marginBottom: theme.spacing(2),
  //   minWidth: 120,
  //   width: '100%',
  // },
  submitButton: {
    //margin: theme.spacing(3, 0, 2),},
  },
  formLabel: {
    // fontSize: '1.2em',
    // fontWeight: 'bold',
    // padding: 0,
    // margin: 0,
    // display: 'block',
  },
  box: {
    margin: 5,
    padding: 5,
  },
  // autocomplete: {
  //   p: 0,
  //   m: 0,
  //   width: '100%',
  //   minWidth: 300,
  //   maxHeight: 50,
  // },
  autoComplete: {
    border: 0,
    //backgroundColor: theme.palette.grey[150],
    '&:hover': {
      p: 0,
      //   backgroundColor: theme.palette.grey[100],
        backgroundColor: theme.palette.grey[150],
        boxShadow: theme.palette.grey[300],
        cursor: 'pointer',
        borderColor: theme.palette.grey[100],
    },
  },
});

const drawerWidth = 200;

export default function SearchFilter(props) {

    let { className,label ,placeholder, options, onChange, value,id,tabIndex } = props.filter;

    (options) ? options : [];
    // console.log(`label: ${label} - value: ${value}`);
    // console.log('value:',value);
    const classes =  useStyles(theme);
    //hack so we can use the placeholder initialy otherwise the placeholder is overwritten by the value text,
    if(value === label){
      value = placeholder
    }
    console.log(`Label: ${label} - length ${(options) ? options.length : 0}`);
    if(!options || !options.length){
      console.warn('The options of the filter are either undefined or have no values ',id);
    }
    return (
      <>
          <FormControl fullWidth
            xs={{
              p:1,
              border: 0,
              borderColor: 'grey.500',
              borderRadius: 1,
              mb: 1,
              mt: 1,
            }}>
   
            <Typography pb={1} variant='filterLabel'> 
              {label}:
            </Typography>   
            <Autocomplete
             id={id}
              fullWidth
              
              autoComplete={true}
              // autoHighlight={true}
              tabIndex={tabIndex}
              className={className.autocomplete}
              options={(options) ? options : []}
              disablePortal={true}
              // value={value}
              variant='standard'
              // menuIsOpen={true}
              onChange={onChange}
              getOptionLabel={(option) => option.label || label }
              renderInput={(params) => <TextField {...params} 
              variant='outlined'
                sx={{
                  width: '100%',
                  p:0,
                }}
                placeholder={placeholder}
              />}
            />
          </FormControl>
          <Divider />
      </>
    );
}