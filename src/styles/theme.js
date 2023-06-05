import { createTheme } from '@mui/material/styles';
//import configs from '../project.config.json';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#9CAEB3', //configs.PRIMARY_COLOR,
    },
    secondary: {
      main: "#e1e7e8",
    },
  },
  FormLabel: {
    color: '#000',
    fontWeight: 600,
    mt: 1,
  },
  typography: {
    fontFamily: 'Open Sans',
    subtitle1: {
      fontSize: '1.1rem',
      fontWeight: 'bold'
    },
    subtitle2: { 
      fontSize: '0.8rem',
      fontFamily: 'Open Sans',
      fontWeight: 'bold'
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        variant: 'contained',
        disableRipple: false,
      },
    },

    MuiInputLabel: {
      defaultProps: {
        shrink: true,
      },
      styleOverrides: {
        root: {
          position: 'relative',
          transform: 'translate(0px, 0px) scale(0.75)',
        },
      },
    },
    MuiAutocomplete:{
      defaultProps: {
        p:0,
        m:0,
      }
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          position: 'static',
          my: 1,
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          marginLeft: 0,
        },
      },
    },
    MuiOutlinedInput: {
      defaultProps: {
        size: 'small',
      },
      styleOverrides: {
        root: {
          'legend > span': {
            display: 'none',
          },
          backgroundColor: '#fff',
          pr: 0.5,
        },
      },
    },
  },
});

export default theme;
