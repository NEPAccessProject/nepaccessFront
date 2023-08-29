import { createTheme } from '@mui/material';
import { orange,green, red,blueGrey } from '@mui/material/colors';
import { Primary } from '@storybook/blocks';
import {ThemeOptions} from '@mui/material/styles';
const theme = createTheme({
	palette: {
		mode: 'light',
		primary: {
			main: '#1f77b4',
			contrastText: orange[400]
		},
		secondary: {
			main: '#9eabae',
      contrastText: green[400]
		},
		error: {
			main: red.A400,
      contrastText: blueGrey[600]
		},
		// primary: {
		//   main: "#9eabae",
		// },
		// secondary: {
		//   main: "#80a9ff",
		// },
	},

	typography: {
		fontFamily: 'Open Sans',
		fontSize: 12,
		//      padding: 20,
		//      fontColor: 'red',
		//      marginLeft:50,
		//      border:6,
		//      formControlLabel: {
		//        fontSize: 1.1,
		//        color: 'red',

		// expanderButton: {
		//   fontSize: "1.1rem",
		//   fontColor: "#fff",
		//   textAlign: "center",
		// },
		// filterLabel: {
		//   fontSize: "0.9rem",
		//   fontColor: "red"
		// },
		// resultsTitle: {
		//   fontSize: "1.6rem",
		//   fontColor: "#80a9ff",
		//   display: 'block',
		//   paddingLeft: 8,

		// },
		// resultsSubtitle: {
		//   fontSize: "1.1rem",
		//   fontColor: "#80a9ff",
		//   paddingLeft: 4,
		//   margin: 10,
		//   display:'Block',
		//   fontFamily: 'impact',
		// },
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
	},

	shape: {
		borderRadius: 4,
	},
	components: {
		MuiButton: {
			defaultProps: {
				//border: '4px solid red',
			},
		},
		// Name of the component
		MuiButtonBase: {
			defaultProps: {
				//border: '4px solid red',
			},
		},
		MuiTypography: {
			defaultProps: {
				variantMapping: {
					h1: 'h2',
					h2: 'h2',
					h3: 'h2',
					h4: 'h2',
					h5: 'h2',
					h6: 'h2',
					subtitle1: 'h2',
					subtitle2: 'h2',
					body1: 'span',
					body2: 'span',
					//MuiFormControlLabel: "span",
					//MUIFormLabel: "span",
				},
			},
		},
		// MuiPaper: {
		//   root: {
		//     "& .MuiPaper-root": {
		//       borderRadius: "100px",
		//       backgroundColor:"#222",
		//       boxShadow: "10px 10px 5px 0px rgba(0,0,0,0.75);"
		//     }
		//   }
		// }
		// overrides: {
		//       MuiFormLabel: {
		//         root: {
		//           fontSize: 30,
		//           fontColor: orange
		//         },

		//       },
		//       MuiPaper: {
		//         backgroundColor: 'blue',
		//         root: {
		//           backgroundColor: 'red',
		//           border: 6
		//         }
		//       },
		//       MuiAppBar: {
		//         root: {
		//           backgroundColor: "#1976d2",
		//           fontColor: "#fff",
		//         },
		//       },
		//       MuiButton: {
		//         margin: 10,
		//         root: {

		//           background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
		//           fontColor: "#fff",
		//           border: 0,
		//           padding: 30,
		//           margin: 5,
		//           borderRadius: 3,
		//           boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
		//           color: "white",
		//           height: 48,
		//         },
		//       },
	},
	spacing: 8,
});

  export default theme;
