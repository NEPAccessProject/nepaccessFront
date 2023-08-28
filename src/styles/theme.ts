import { ThemeOptions,createTheme } from '@mui/material/styles';
//import {red,blue,yellow} from "@mui/material/colors";
const theme: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: '#80a9ff',
      contrastText: "#fff"
    },
    secondary: {
      main: '#9eabae',
      contrastText: '#6a0dad',
    },
  },
  typography: {
    fontFamily: 'Open Sans',
    fontSize: 14,
    h1: {
      fontSize: '1.6rem',
      fontColor: '#000',
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
      fontSize: '0.8rem',
    },
    subtitle1: {
      fontSize: '1.1rem'
    },
    subtitle2: {
      fontSize: '0.9rem'
    }
  },
  shape: {
    borderRadius: 2,
  },
  spacing: 2,
  components: {
    MuiAppBar: {
      defaultProps: {
        color: 'primary'
      }
    },d
    MuiToolbar: {
      defaultProps: {
        color: "#fff"
      }
    }
  }
  // overrides: {
  //   MuiAppBar: {
  //     fontColor: '#fff',
  //     colorInherit: {
  //       backgroundColor: '#80a9ff',
  //       color: '#fff',
  //       fontColor: '#fff',
  //     },
  //   },
  // },
  // props: {
  //   MuiAppBar: {
  //     color: '#FFF',
  //   },
  //   MuiButton: {
  //     size: 'small',
  //   },
  //   MuiButtonGroup: {
  //     size: 'small',
  //   },
  //   MuiCheckbox: {
  //     size: 'small',
  //   },
  //   MuiFab: {
  //     size: 'small',
  //   },
  //   MuiFormControl: {
  //     margin: 'dense',
  //     size: 'small',
  //   },
  //   MuiFormHelperText: {
  //     margin: 'dense',
  //   },
  //   MuiIconButton: {
  //     size: 'small',
  //   },
  //   MuiInputBase: {
  //     margin: 'dense',
  //   },
  //   MuiInputLabel: {
  //     margin: 'dense',
  //   },
  //   MuiRadio: {
  //     size: 'small',
  //   },
  //   MuiSwitch: {
  //     size: 'small',
  //   },
  //   MuiTextField: {
  //     margin: 'dense',
  //     size: 'small',
  //   },
  //   MuiList: {
  //     dense: true,
  //   },
  //   MuiMenuItem: {
  //     dense: true,
  //   },
  //   MuiTable: {
  //     size: 'small',
  //   },
  // },
};
export default theme