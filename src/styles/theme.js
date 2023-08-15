import { createTheme } from '@mui/material/styles';
//import configs from '../project.config.json';

const theme = createTheme({
	palette: {
		mode: 'light',
		primary: {
			main: '#9CAEB3',
			//main: '#000', //configs.PRIMARY_COLOR,
		},
		secondary: {
			main: '#e1e7e8',
		},
	},
	FormLabel: {
		color: '#000',
		fontWeight: 600,
		mt: 1,
		fontFamily: 'open sans',
	},
	typography: {
		fontFamily: 'open sans',
		fontColor: '#000',
		body1: {},
		poster: {
			fontSize: 20,
			color: 'red',
			fontFamily: 'open sans',
		},
		h1: {
			paddingLeft: 2,
			paddingRight: 2,
			fontSize: 34,
			fontColor: '#000',
			fontFamily: 'open sans',
		},
		h2: {
			paddingLeft: 2,
			paddingRight: 2,
			fontSize: 30,
			fontColor: '#000',
			fontFamily: 'open sans',
		},
		h3: {
			paddingLeft: 2,
			paddingRight: 2,
			fontColor: '#000',
			fontSize: 28,
			fontColor: 'green',
			fontFamily: 'open sans',
		},
		h4: {
			paddingLeft: 2,
			paddingRight: 2,
			fontColor: '#000',
			fontSize: 26,
			fontColor: 'blue',
			fontFamily: 'open sans',
		},
		h5: {
			paddingLeft: 2,
			paddingRight: 2,
			fontColor: '#000',
			fontSize: 16,
			fontColor: 'blue',
			fontFamily: 'open sans',
		},
		title: {
			fontSize: 18,
			fontColor: '#000',
			fontFamily: 'open sans',
		},
		subtitle1: {
			fontSize: '1.5rem',
			fontColor: '#000',
			fontFamily: 'open sans',
		},
		subtitle2: {
			fontSize: 16,
			fontFamily: 'open sans',
			fontColor: '#000',
		},
		searchResultsTitle: {
			fontSize: '1.6rem',
			lineHeight: '2rem',
			padding: 2,
			fontFamily: 'open sans',
			fontColor: '#000',
		},
		searchResultSubTitle: {
			fontColor: '#000',
			fontFamily: 'open sans',
			fontSize: '1.10rem',
			border: 1,
			//      color: 'rgb(64,7,162)',
			p: 2,
			'&:hover': {
				textDecoration: 'underline',
				cursor: 'pointer',
			},
		},
		expanderButton: {
			fontSize: '1.0rem',
			fontFamily: 'open sans',
			p: 4,
			color: '#fff',
			'&:hover': {
				textDecoration: 'underline',
				cursor: 'pointer',
			},
		},
		filterLabel: {
			fontSize: '0.9rem',
			color: '#000',
			fontFamily: 'open sans',
			display: 'block',
			fontWeight: 600,
			marginTop: 1,
			marginBottom: 1,
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
