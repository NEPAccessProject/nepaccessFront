import {
  AppBar,
  Toolbar,
  Typography,
  makeStyles,
  Button,
  IconButton,
  Drawer,
  Link,
  MenuItem,
  Paper,
  Box,
  Container,
  Divider,
  Grid,
  useMediaQuery,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { withMediaQuery } from 'react-responsive';
import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import './index.css';
import { Helmet } from 'react-helmet';
import Landing from './Landing';
import CalloutContainer from './CalloutContainer';
import SearcherLanding from './SearcherLanding';
const headersData = [
  {
    label: 'Search',
    href: '/search?q=""',
  },
  {
    label: 'Search Tips',
    href: '/search-tip',
  },
  {
    label: 'Available Files',
    href: '/available-documents',
  },
  {
    label: 'Available Documents',
    href: '/available-documents',
  },
  {
    label: 'About NEPA',
    href: '/about-nepaccess',
  },
  {
    label: 'About NEPAaccess',
    href: '/about-nepaccess',
  },
  {
    label: 'Media',
    href: '/media',
  },
  {
    label: 'People',
    href: '/people',
  },
  {
    label: 'Contact',
    href: '/contact',
  },
];

const useStyles = makeStyles(() => ({
  header: {
    backgroundColor: '#abbdc4',
    height: '100%',
    //height: '105px',
    // paddingRight: '79px',
    // paddingLeft: '118px',
    // '@media (max-width: 768px)': {
    //   paddingLeft: 0,
    //   height: '50px',
    // },
  },
  menuButton: {
    fontFamily: 'Open Sans, sans-serif',
    fontWeight: 500,
    size: '12px',
    marginLeft: '38px',
    color: 'black',
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: '',
    height: '105px',
    justifyItems: 'center',
    background: '#abbdc4',

    // backgroundImage: 'url("logo2022.png")',
  },
  mobileToolbar: {
    display: 'flex',
    height: '65px',
    backgroundColor: '#abbdc4',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
  },
  drawerContainer: {
    padding: '20px 30px',
  },

  muiAppBar: {
    backgroundColor: '#abbdc4',
    background: '#abbdc4',
    height: '50px',
    display: 'block',
    width: '100%',
    /* background: #C4C4C4; */
    zIndex: 99999 /* Geojson map introduces some very high z-index items */,
  },
  logoImage: {
    // backgroundImage: 'url("logo2022.png")',
    // backgroundImage: 'url("logo2022.png")',
    backgroundRepeat: 'no-repeat',
    // border: '3px solid red',
    justifyContent: 'left',
    backgroundSize: 'contain',
    marginTop: -50,
    marginLeft: -20,
  },
  logoBox: {
    // marginLeft: '200px',
    // height:'102px',
    width: '200px',
    // backgroundPosition:'top',

    backgroundImage: 'url("logo2022.png")',
    // backgroundRepeat: 'no-repeat',
    // backgroundSize: 'contain',
  },
  menuContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  navLink: {
    dropShadow: '3px',
    position: 'relative',
    fontFamily: 'Open Sans',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: '1.1em',
    lineHeight: '25px',
    textDecoration: 'none',
    color: '#000000',
    textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
  },
  mainMenuLink: {
    color: 'black',
  },
  menuIcon: {
    color: 'white',
    border: '1px solid white'
  }
}));

export default function HeaderNav(props) {
  const {
    Nav,
    header,
    logo,
    menuButton,
    toolbar,
    drawerContainer,
    logoBox,
    muiAppBar,
    logoImage,
    mainMenuLink,
    menuContainer,
    navLink,
    menuIcon,
    mobileToolbar,
  } = useStyles();

  const [state, setState] = useState({
    mobileView: false,
    drawerOpen: false,
  });
  const {titleRaw,onInput,onKeyUp,onIconClick,onClearClick,onChangeHandler} = props;
  
// onInput = (evt) => {
//     this.setState({ [evt.target.name]: evt.target.value });
//     const val = evt.target.value;
//     this.props.onChange(this.props.id, val);
// }

// onKeyUp = (evt) => {
//     if(evt.keyCode ===13){
//         this.props.onClick("render", "app");
//     }
// }
// onIconClick = (evt) => {
//     this.props.onClick("render", "app");
// }
// onClearClick = (evt) => {
//     // Custom clear icon not captured by onInput(), so update the relevant props and state here
//     this.setState({ titleRaw: '' });
//     this.props.onChange(this.props.id, ''); 
// }
// onChangeHandler = (evt) => {
//     // do nothing
// }
  // const isMobile = withMediaQuery({ maxWidth: 768 })
  const { mobileView, drawerOpen } = state;

  useEffect(() => {
    const setResponsiveness = () => {
      console.log('set responsive', window.innerHeight);
      return window.innerWidth < 768
        ? setState((prevState) => ({ ...prevState, mobileView: true }))
        : setState((prevState) => ({ ...prevState, mobileView: false }));
    };

    setResponsiveness();

    window.addEventListener('resize', () => setResponsiveness());

    return () => {
      window.removeEventListener('resize', () => setResponsiveness());
    };
  }, []);

  const displayMobile = () => {
    const handleDrawerOpen = () => setState((prevState) => ({ ...prevState, drawerOpen: true }));
    const handleDrawerClose = () => setState((prevState) => ({ ...prevState, drawerOpen: false }));

    return (
      <>
        <Toolbar id="mobile-tool-bar"
          className={mobileToolbar}  
          elevation={2}
        >
          <IconButton
            id="mobile-icon-button"
            {...{
              color: 'black',
              edge: 'start',
              color: 'inherit',
              'aria-label': 'menu',
              'aria-haspopup': 'true',
              onClick: handleDrawerOpen,
            }}
          >
            <MenuIcon color="#000" className={menuIcon} />
          </IconButton>
          <Grid container
            id="mobile-logo-container"
            sx={{
              alignItems: 'center',
              border: '2px solid black',
              height: '70px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>

            <img src="/logo2022.png" height={61} width={150} alt="NEPAccess Mobile Logo" />
          </Grid>

          <Drawer
            id="drawer"
            {...{
              anchor: 'left',
              open: drawerOpen,
              onClose: handleDrawerClose,
            }}
          >
            <div id="drawer-container" className={drawerContainer}>
              {getDrawerChoices()}
              <SearcherLanding />
            </div>
          </Drawer>

          {/* <div>{getMenuButtons()}</div> */}

        </Toolbar>
        {/* [TODO] Work in cards since the WP layout is well... dated */}
        {/* <div id="callout-card-container">
          <>
            <CalloutContainer />
          </>
        </div> */}
      </>
    );
  };

  const getDrawerChoices = () => {
    return headersData.map(({ label, href }, idx) => {
      return (
        <Link
          {...{
            component: RouterLink,
            to: href,
            color: 'inherit',
            style: { textDecoration: 'none' },
            key: label,
          }}
          sx={{
            color: 'black',
            fontWeight: 600,
          }}
          key={label+idx}
        >
          <MenuItem
            sx={{
              color: 'black',
            }}
            className="menu-item"
            key={label}
          >
            {label}

          </MenuItem>
          <Divider />
        </Link>
      );
    });
  };

  // const logoBackDrop = (
  //   <img src="url('logo2022.png')" alt="NEPAccess Logo" />
  // );
  const displayDesktop = (props) => {
    const role = 'user';
    const loggedInDisplay = 'none';
    const loggedOutDisplay = '';
    const loggedIn = false;
    const headerLandingCss = ''; //props.headerLandingCss || '';
    const currentPage = ''; //props.currentPage || '';
    return (
      <>
        <Toolbar
          id="nav-toolbar"
          className={toolbar}
          xs={{
            backgroundColor: 'gray',
          }}
        >
          <Box
            id="desktop-logo-box"
            sx={{
              height: '50px',
              width: '200px',
              // border: '3px solid red',
              // backgroundColor: 'red',
              // backgroundRepeat: 'no-repeat',
              // backgroundSize: 'contain',
              // height: '102px',
              // width: '100%',
              // alignItems: 'left',
              // marginLeft: '-200px',
            }}
          >
            <img
              id="logo-image"
              src="logo2022.png"
              className={logoImage}
              height={102}
              width={302}
              alt="NEPAccess Logo"
              style={{}}
            />
          </Box>
          <Grid container
            id="link-container"
            sx={{
              justifyContent: 'flex-start',
              border:1,
              alignItems: 'left',
            }}
          >
            <Container id="menu-container" className={menuContainer}>
              <MenuItem className={navLink}>Search</MenuItem>
              <MenuItem className={navLink}>Search Tips</MenuItem>
              <MenuItem className={navLink}>Available Files</MenuItem>
              <MenuItem className={navLink}>About NEPA</MenuItem>
              <MenuItem className={navLink}>About NEPAccess</MenuItem>
              <MenuItem className={navLink}>Contact</MenuItem>
              <span
                id="admin-span"
                hidden={!role || role === 'user'}
                className={loggedInDisplay + ' right-nav-item logged-in'}
              >
                <div id="admin-dropdown" className="main-menu-link dropdown">
                  <Link id="admin-button" className="main-menu-link drop-button" to="/importer">
                    Admin
                  </Link>
                  <i className="fa fa-caret-down"></i>
                  <div className="dropdown-content">
                    <Link to="/admin" hidden={!(role === 'admin')}>
                      Admin Panel
                    </Link>
                    <Link to="/importer" hidden={!(role === 'curator' || role === 'admin')}>
                      Import New Documents
                    </Link>
                    <Link to="/adminFiles" hidden={!(role === 'curator' || role === 'admin')}>
                      Find Missing Files
                    </Link>
                    <Link to="/approve">Approve Users</Link>
                    <Link to="/pre_register">Pre-Register Users</Link>
                    <Link to="/interaction_logs">Interaction Logs</Link>
                    <Link to="/search_logs">Search Logs</Link>
                    <Link to="/abouthelpcontents">Database Contents</Link>
                    <Link to="/stats">Content Statistics</Link>
                    <Link to="/stat_counts">Stat Counts</Link>
                    <Link to="/surveys">Surveys</Link>
                  </div>
                </div>
              </span>
            </Container>

          </Grid>
        </Toolbar>
        {/* <Landing /> */}
        <Container id='mobile-content-container'>
          <Container id="mobile-search-container">
            {/* <SearcherLanding /> */}
          </Container>

          {/* <Container id="mobile-call-out-container">
            <CalloutContainer />
          </Container> */}
        </Container>
      </>
    );
  };
  const getMenuButtons = () => {
    return headersData.map(({ label, href }) => {
      return (
        <Button
          {...{
            key: label,
            color: 'inherit',
            to: href,
            component: RouterLink,
            className: menuButton,
          }}
          key={label}
        >
          {label}
        </Button>
      );
    });
  };
  /* RETURN of the main function */
  return (
    <Paper id="header-root-paper-container" color='#A8B9C0' elevation={2}>
      <AppBar elevation={1} className={muiAppBar}  id="header-root-appbar">
        {mobileView ? displayMobile() : displayDesktop()}
      </AppBar>
    </Paper>
  );
}

export function DesktopNavLinks() {
  const [currentPage, setCurrentPage] = useState();
  const [loggedInDisplay, setLoggedInDisplay] = useState('display-none');
  const [loggedOutDisplay, setLoggedOutDisplay] = useState();
  const { mainMenuLink } = useStyles();
  const [loggedIn, setLoggedIn] = useState(false);
  const [role, setRole] = useState('user');
  return (
    <>
      <div id="desktop-landing-container">
      {/* <h1>Landing</h1>
        <Landing /> */}
      </div>
    </>
  );
}