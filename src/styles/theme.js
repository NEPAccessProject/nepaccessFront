import { createTheme } from '@mui/material';
import { orange, red } from '@mui/material/colors';

const theme = 
  createTheme({
  palette: {
    mode: "light",
    primary: {
        main: '#111',
      },
      secondary: {
        main: '#1f77b4',
      },
      error: {
        main: red.A400
      }
    // primary: {
    //   main: "#9eabae",
    // },
    // secondary: {
    //   main: "#80a9ff",
    // },
  },

  typography: {
    fontFamily: "Open Sans",
    fontColor: "red",
    padding: 5,
    margin:5,
    fontSize: '1rem',
    formControlLabel: {
        fontSize: 1.1,
        color: 'red',
      },

    expanderButton: {
      fontSize: "1.1rem",
      fontColor: "#fff",
      textAlign: "center",
    },
    filterLabel: {
      fontSize: "0.9rem",
      fontColor: "red"
    },
    resultsTitle: {
      fontSize: "1.8rem",
      fontColor: "#80a9ff",
    },
    resultsSubtitle: {
        fontSize: "1.1rem",
        fontColor: "#80a9ff",
        paddingLeft:2,
        paddingRight: 2,
    },
    h1: {
      fontSize: "1.8rem",
      color: '#5373BD',
      padding:2,
    },
    h2: {
      fontSize: "1.6rem",
      color: 'red',
    },
    h3: {
      fontSize: "1.4rem",
    },
    h4: {
      fontSize: "1.2rem",
    },
    h5: {
      fontSize: "1rem"
    },
    caption: {
      fontSize: "0.8rem"
    },
    fontFamily: "Open Sans",
  },
  props: {
    MuiAppBar: {
      backgroundColor: "#1976d2",
      color: "secondary",
    },
    MuiTooltip: {
      arrow: true,
    },
    MuiPaper: {
      backgroundColor:'blue',
      marginTop: 100,
      root: {
        backgroundColor:'red',
        marginTop: 100
      }
    },
    MuiFormControlLabel: {
        fontColor: "#000",
        fontSize: 50,
    },
    MUIFormLabel: {
      root: {
        fontColor: "#000"
      },
      fontColor: 'blue'
    }
  },
  shape: {
    borderRadius: 4,
  },
  components: {
    // Name of the component
    MuiButtonBase: {
      defaultProps: {
          border: '4px solid red',
      }
    },
    MuiTypography: {
      defaultProps: {
        variantMapping: {
          h1: "h2",
          h2: "h2",
          h3: "h2",
          h4: "h2",
          h5: "h2",
          h6: "h2",
          subtitle1: "h2",
          subtitle2: "h2",
          body1: "span",
          body2: "span",
          MuiFormControlLabel: "span",
          MUIFormLabel: "span",
        },
      },
    },
  },
  overrides: {
    MuiFormLabel: {
      root: {
        fontSize: 30,
        fontColor:orange
      },
        
    },
    MuiAppBar: {
      root: {
        backgroundColor: "#1976d2",
        fontColor: "#fff",
      },
    },
    MuiButton: {
      margin: 10,
      root: {
        background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
        fontColor: "#fff",
        border: 0,
        padding: 30,
        margin: 5,
        borderRadius: 3,
        boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
        color: "white",
        height: 48,
      },
    },
  },
  spacing: 8,
});
export default theme
