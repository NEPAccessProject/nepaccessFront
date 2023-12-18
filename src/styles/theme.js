import { createTheme, Theme } from '@mui/material';
import { common, grey, orange, red } from '@mui/material/colors';
import { ThemeOptions } from '@mui/material/styles';

const theme = createTheme({
  zIndex: {
    appBar: 99,
    button: 109,
    map: 999,
  },
  palette: {
    divider: grey[200],
    mode: 'light',
    primary: {
      main: '#053B50',
      contrastText: '#EEEEEE',
    },
    secondary: {
      main: '#abbdc4',
      contrastText: common.white,
    },
    tertiary: {
      main: '#64CCC5'
    },
    error: {
      main: red.A400,
      contrastText: common.white,
    },
    warning: {
      main: orange.A400,
      contrastText: common.white,
    },
    text: {
      primary: "#000",
      secondary: "#222",
    },
    // primary: {
    //   main: "#9eabae",
    // },
    // secondary: {
    //   main: "#80a9ff",
    // },
  },
  spacing: 8,
  typography: {
    fontFamily: 'Open Sans',
    fontSize: 14,

    filterLabel: {
      fontSize: '0.8rem',
      color: 'black',
      lineHeigth: '0.9rem'
    },
    // resultsTitle: {
    //   fontSize: "1.6rem",
    //   fontColor: "#80a9ff",
    //   display: 'block',
    //   paddingLeft: 8,

    // },
    h1: {
      fontSize: '1.6rem',
      padding: 4,
      border: 1,
      display: 'block',
    },
    h2: {
      fontSize: '1.4rem',
      marginLeft: 40,
      padding: 2,
      border: 1,
      display: 'block',
      fontFamily: 'open sans',
    },
    h3: {
      fontSize: '1.3rem',
      display: 'block',
      padding: 2,
    },
    h4: {
      display: 'block',
      fontSize: '1.2rem',
      padding: 2,
    },
    h5: {
      display: 'block',
      fontSize: '1rem',
      padding: 2,
    },
    h6: {
      display: 'block',
      fontSize: '1rem',
      padding: 2,
    },
    caption: {
      fontSize: '0.9rem',
    },
    subtitle1: {
      fontSize: '0.8rem',
    },
    textSnippet: {
      fontSize: '1rem',
      fontFamily: 'Open Sans',
      padding: 1,
      wordWrap: 'break-word',
      noWrap: false,
    }
  },

  shape: {
  },
  components: {
    // MuiPaper: {
    //   defaultProps: {
    //     elevation:1
    //   }
    // },
    // MuiGrid: {
    //   defaultProps: {
    //     fontFamily: 'open sans',
    //     fontSize: '1rem',
    //     borderColor:'blue',
    //     display:'flex'
    //   }
    // },
    // MuiGrid2: {
    //   defaultProps: {
    //     border: 1,
    //     borderColor: 'red',
    //     disableEqualOverflow: true,
    //     justifyContent: 'center',
    //     alignContent: 'center',
    //     alignItems: 'center',
    //     display:'flex'
    //   },
    // },
    // Name of the component
    MuiFormLabel: {
      styleOverrides: {
        root: {
          fontSize: 14,
          color: 'black',
          lineHeight: '24px'
        }
      }
    },
    //example theme override
    MuiButton: {
      styleOverrides: {
        // Name of the slot
        root: {
          // Overwrite defaults

        },
      },
    },
    MuiAppBar: {
      colorPrimary: {
        //			backgroundColor:'red'
      },
      colorDefault: {
        //			backgroundColor: 'green'
      }
    },
    MuiFormControlLabel: {
      styleOverrides: {
        root: {
          fontSize: 12,
          color: grey[700],
          padding: 0,
          margin: 0,


        }
      }
    },
    MuiAppBar: {
      colorPrimary: {
        backgroundColor: '#80a9ff',
      },
      root: {
        backgroundColor: "#80a9ff",
        fontColor: "#fff",
      },
    },
  },
});

export default theme;
