import { createTheme } from '@mui/material/styles';
//import configs from '../project.config.json';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#9CAEB3', //configs.PRIMARY_COLOR,
    },
    secondary: {
      main: '#e1e7e8',
    },
  },
  FormLabel: {
    color: '#000',
    fontWeight: 600,
    mt: 1,
  },
  typography: {
    fontFamily: 'open sans',
    poster: {
      fontSize: 64,
      color: 'red',
    },
    h2: {
      fontSize: 32,
    },
    h3: {
      fontSize: 28,
    },
    h4: {
      fontSize: 28,
    },
    title: {
      fontSize: 34,
      fontFamily: 'open sans',
    },
    subtitle1: {
      fontSize: '1.5rem',
      fontFamily: 'open sans',
    },
    subtitle2: {
      fontSize: 48,
    },
    searchResultTitle: {
      fontSize: '1.5rem',
      color: '#000',
      fontFamily: 'open sans',
      fontSize: 25,

      p: 2,
    },
    searchResultSubTitle: {
      fontSize: '1.5rem',
      color: '#000',
      fontFamily: 'open sans',
      fontSize: 20,
      p: 2,
    },
    filterLabel: {
      fontSize: '1rem',
      color: '#000',
      fontFamily: 'open sans',
      display: 'block',
      p: 10,
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
    MuiTypography: {
      defaultProps: {
        variantMapping: {
          // Map the new variant to render a <h1> by default
          poster: 'h1',
          h2: 'h2',
          h3: 'h3',
          subtitle1: 'h4',
          subtitle2: 'h5',
        },
      },
    },
    MuiAutocomplete: {
      defaultProps: {
        p: 0,
        m: 0,
      },
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
