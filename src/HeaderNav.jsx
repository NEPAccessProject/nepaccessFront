import {
  AppBar,
  Box,
  Button,
  Container,
  Divider,
  Drawer,
  Grid,
  IconButton,
  Link,
  makeStyles,
  MenuItem,
  MenuList,
  Paper,
  Toolbar,
  Typography,
  useMediaQuery,
} from '@material-ui/core';
import theme from './styles/theme';
//import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2

import MenuIcon from '@material-ui/icons/Menu';
import { withMediaQuery } from 'react-responsive';
import React, { useState, useEffect } from 'react';
import { Link as RouterLink, NavLink } from 'react-router-dom';
import './index.css';
import { Helmet } from 'react-helmet';
import Landing from './Landing';
import CalloutContainer from './CalloutContainer';
import SearcherLanding from './SearcherLanding';
import { withStyles } from '@mui/styles';
const _MAX_WIDTH = '768px'
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
  {
    label: 'login'
  },
  {
    label: 'logout'
  },
];

const useStyles = makeStyles((theme) => ({
  abRoot: {
    borderRadius: 0,
    backgroundColor: "#abbdc4",
    zIndex: 0,
    flexDirection: 'row'
  },
  abStatic: {
    zIndex: 0,
  },
  adminGrid: {
    display: "flex",
    height: '100%',
    alignItems: 'flex-start',
    alignContent: 'flex-start',
    justifyContent: 'flex-start',
  },
  header: {
    backgroundColor: '#abbdc4',
    height: '100%',
    //height: '105px',
    // paddingRight: '79px',
    // paddingLeft: '118px',
    // '@media (max-width: 768px)': {
    //   paddingLeft: 0,
    //   height: '50px',
    //   backgroundColor: "#eeeddd"
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
    height: '105px',
    justifyItems: 'center',
    backgroundColor: '#abbdc4',

    // backgroundImage: 'url("logo2022.png")',
  },
  mobileToolbar: {
    // display: 'flex',
    // height: '65px',
    backgroundColor: '#abbdc4',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
  },
  drawerContainer: {
    padding: '20px 30px',
  },

  muiAppBar: {
    backgroundColor: '#abbdc4',
    height: '72px',
  },
  logoImage: {
    backgroundRepeat: 'no-repeat',
    justifyContent: 'left',
    backgroundSize: 'contain',
  },
  logoBox: {
    //width: '200px',
    backgroundImage: 'url("logo2022.png")',
  },
  menuContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  mobileNavLink: {
    fontWeight: 'bold',
    fontSize: '1.1em',
    // lineHeight: '25px',
    // textDecoration: 'none',
    //    marginLeft:0,
    textAlign: 'center',
    display: 'flex',
    alignContent: 'center',
    color: '#000000',
    width: '100%',
    minWidth: 300,
    textAlign: 'right',
    textShadow: '0px 3px 2px rgba(0, 0, 0, 0.25)',
    "&:hover": {
      textDecoration: 'underline'
    }
  },
  accountNavLink: {
    paddingLeft: 3,
    //paddingRight: 3,
    // dropShadow: '3px',
    // position: 'relative',
    fontFamily: 'Open Sans',
    // fontStyle: 'normal',
    fontSize: '0.7em',
    // lineHeight: '25px',
    // textDecoration: 'none',
    //    marginLeft:0,
    // paddingLeft: 1,
    // paddingRight: 1,
    // margin: 0,
    // textAlign: 'center',
    // display: 'flex',
    // alignContent: 'center',
    // justifyContent: 'flex-start',
    // alignItems:'flex-end',
    color: '#000000',
    borderRight: '2px solid black',
    paddingRight: 4,
    "&:hover": {
      textDecoration: 'underline',
      cursor: 'pointer'
    }
  },
  accountNavGrid: {
    padding: 0,
  },

  navLink: {
    // dropShadow: '3px',
    // position: 'relative',
    fontFamily: 'Open Sans',
    // fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: '1.0em',
    lineHeight: '25px',
    // textDecoration: 'none',
    paddingLeft: 2,
    paddingRight: 2,
    padding: 2,
    margin: 0,
    justifyContent: 'center',
    flex: 1,
    minWidth: '120px',
    color: '#000000',
    textWrap: 'nowrap',
    textShadow: '0px 3p2 2px rgba(0, 0, 0, 0.25)',
    "&:hover": {
      textDecoration: 'underline'
    }
  },
  mainMenuLink: {
    color: 'black',
    fontSize: 1.1
  },
  menuIcon: {
    color: 'white',
  }
}));

function HeaderNav(props) {
  const classes = useStyles(theme)
  const [state, setState] = useState({
    mobileView: false,
    drawerOpen: false,
  });

  const { mobileView, drawerOpen } = state;
  const { loggedInDisplay, loggedOutDisplay, role } = props;
  //for Menu anchor
  const [anchorEl, setAnchorEl] = React.useState(null);

  //  const isBigScreen = useMediaQuery({ query: '(min-width: 1824px)' })
  //  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 768px)' })
  //  const isPortrait = useMediaQuery({ query: '(orientation: portrait)' })
  //  const isRetina = useMediaQuery({ query: '(min-resolution: 2dppx)' })
  useEffect(() => {
    const setResponsiveness = () => {
      console.log('set responsive', window.innerHeight);
      return window.innerWidth < 1024
        ? setState((prevState) => ({ ...prevState, mobileView: true }))
        : setState((prevState) => ({ ...prevState, mobileView: false }));
    };

    setResponsiveness();

    window.addEventListener('resize', () => setResponsiveness());

    return () => {
      window.removeEventListener('resize', () => setResponsiveness());
    };
  }, []);

  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    // if (anchorRef.current && prevOpen.current === true && drawerOpen === false) {
    //   anchorRef.current.focus();
    // }

    prevOpen.current = open;
  }, [open]);
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };


  const showMenuItems = () => {
    console.log(`showMenuItems role: ${role} logged In Displayed: ${loggedInDisplay}`);
    return (
      <span
        id="admin-span"
        //hidden={(!role || role === 'user')} 
        className={loggedInDisplay + " right-nav-item logged-in"}>

        <div id="admin-dropdown" className="main-menu-link dropdown">
          <Link id="admin-button" className="main-menu-link drop-button" to="/importer">
            Admin
          </Link>
          <i className="fa fa-caret-down"></i>
          <div className="dropdown-content">
            <Link to="/admin" hidden={!(role === 'admin')}>Admin Panel</Link>
            <Link to="/importer" hidden={!(role === 'curator' || role === 'admin')}>Import New Documents</Link>
            <Link to="/adminFiles" hidden={!(role === 'curator' || role === 'admin')}>Find Missing Files</Link>
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
    );
  }
  const displayMobile = () => {
    const handleDrawerOpen = () => setState((prevState) => ({ ...prevState, drawerOpen: true }));
    const handleDrawerClose = (evt) => {
      if (anchorEl && anchorRef.current && anchorRef.current.contains(event.target)) {
        return;
      }
      setState((prevState) => ({ ...prevState, drawerOpen: false }))
    };

  return (
    <>
        <AppBar elevation={1}
          id="header-mobile-appbar"
          position="static"

          style={{
          }}
          color="primary"

          classes={{ root: classes.abRoot, positionStatic: classes.abStatic }}
        >

          <Grid container flex={1} id="toolbar-grid-container">
            <Grid item xs={2} justifyContent='flex-end'>
              <img src="/logo2022_mobile.png" alt="NEPAccess Mobile Logo" />
            </Grid>
            <Grid item xs={9} marginRight={6} justifyContent='flex-start'>
              <Toolbar
                id="nav-mobile-toolbar"
                color='primary'
                style={{

                  justifyContent: 'flex-end',
                  width: '100%'
                }}
              >  
              <IconButton
                id="mobile-icon-button"
                size="large"
                edge="end"
                color="inherit"
                aria-label="menu"
                onClick={handleDrawerOpen}
              >
                  <MenuIcon color="#fff" className={classes.menuIcon} />
                </IconButton>
                <Drawer
                  id="drawer"
                  {...{
                    anchor: 'right',
                    open: drawerOpen,
                    onClose: handleDrawerClose,
                  }}
                  paperProps={{
                      backgroundColor: "#DDD",
                      border:2,
                      elevation:1,
                  }}
                >
                  <div id="drawer-container" className={classes.drawerContainer}>
                    {getDrawerChoices()}
                    <SearcherLanding />
                  </div>
                </Drawer>

              </Toolbar>
            </Grid>
          </Grid>
        </AppBar>
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
          key={label + idx}
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

  //[TODO] make ToolBar full width
  const DesktopNav = (props) => {
    const role = 'user';
    const loggedInDisplay = 'none';
    const loggedOutDisplay = '';
    const loggedIn = false;
    const headerLandingCss = ''; //props.headerLandingCss || '';
    const currentPage = ''; //props.currentPage || '';
    return (
      <>
        {!mobileView &&
          <Toolbar
            id="nav-toolbar"
            color="primary"

            disableGutters={true}
            style={{ width: '100%' }}
            sx={{
              flexGrow: 1,
              backgroundColor: '#abbdc4',
              display: "flex",
              justifyContent: 'flex-end',
            }}
          >
            <Grid id="top-nav-grid-container" xs={12} container flex={1} >
              {/* Start Logo and Main Menu */}
              <Grid container xs={12} flex={1}
                style={{

                }}
              >
                {/* Start Logo */}
                {/* Start Main Menu */}
                <Grid container xs={2}>
                  <DesktopLogo {...props} />
                </Grid>
                {/* End Logo */}
                <Grid id="main-nav-grid-container" container xs={10} justifyContent='flex-end'
                  style={{
                  }}>
                  <Grid
                    item
                    id="main-menu-grid-container"
                    xs={12}
                    display='flex'
                    alignItems='center'
                    justifyContent='flex-end'
                    marginTop={25}
                  >
                    {/* Start Top Menu */}
                    <DesktopNavLinks {...props} />
                    {/* End Top Menu */}
                  </Grid>
                </Grid>
                {/* End Main Menu */}
              </Grid>
              {/* END Logo and Main Menu */}
            </Grid>
          </Toolbar>
        }
      </>
    );
  };

  const DesktopLogo = (props) => {
    const classes = useStyles(theme);
    const { loggedInDisplay, loggedOutDisplay, role } = props;
    return (
      <>
        <Grid item
          display="flex"
          flexDirection="row"
          wrap='nowrap'
          id="nav-toolbar-logo-grid-item"
          xs={2}
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignContent: 'flex-end',
          }}
        >
          <img

            id="desktop-logo-image"
            src="logo2022.png"
            className={classes.logoImage}
            height={102}
            width={304}
            alt="NEPAccess Logo"
            style={{
              display: "block",
            }}
          />
        </Grid>
      </>
    )
  }
  const DesktopNavLinks = (props) => {
    const classes = useStyles(theme);
    const { loggedInDisplay, loggedOutDisplay, role } = props;
    return (
      <>
        <Grid container id="nav-toolbar-grid-container"
          flexDirection="row"
          flex={1}
          display="flex"
          xs={12}
          style={{
          }}
        >
          <Grid
            item
            id="nav-toolbar-top-nav-links-grid-item"
            xs={12}
            display='flex'
            justifyContent='flex-end'
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <TopNavLinks />
          </Grid>
          <Grid item id="nav-toolbar-main-nav-links-grid-item"
            display="flex"
            xs={12}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              height: '100%',
              marginTop: 20,

            }}
          >
            <NavLinks />
            <Grid container
              id="nav-toolbar-admin-grid"
              hidden={!role || role === 'user'}
              xs={2}
              flex={1}
              className={classes.adminGrid}
              marginLeft={10}
              justifyContent='flex-end'
              style={{
              }}
            >
              <span
                id="admin-span"
                style={{

                }}
              //hidden={!role || role === 'user'} 
              //className={loggedIn ? 'right-nav-item logged-in' : ''}
              >
                <div id="admin-dropdown"
                  className="main-menu-link dropdown"
                >
                  <Link id="admin-button"
                    className="main-menu-link drop-button"
                    to="/importer"
                  >
                    Admin
                  </Link>
                  <i className="fa fa-caret-down"></i>
                  <div
                    className="dropdown-content"
                  >
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
            </Grid>
          </Grid>
        </Grid>
      </>
    )
  }

  const getMenuButtons = () => {
    return headersData.map(({ label, href }) => {
      return (
        <Button
          className={classes.menuButton}
          {...{
            key: label,
            color: 'inherit',
            to: href,
            component: RouterLink,

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
    <Paper id="header-root-paper-container" color='#A8B9C0' elevation={1} sx={{
      backgroundColor: '#abbdc4'
      // width: '100%',
      // height: 50
    }}>
      <AppBar elevation={1}
        id="header-desktop-appbar"
        position="static"
        style={{}}
        color="primary"

        classes={{ root: classes.abRoot, positionStatic: classes.abStatic }}
      >
        {mobileView ? displayMobile() : DesktopNav()}
      </AppBar>
    </Paper>
  );
}
export default HeaderNav;

export function TopNavLinks(props) {
  const { loggedInDisplay, loggedOutDisplay, role } = props;
  const classes = useStyles(theme);
  return (
    <>
      <Grid
        container
        xs={3}
        display="flex"
        flex={1}
        id="top-menu-grid-container"
        style={{
        }}
        className="no-select">
        {/*                     
                    {this.showMenuItems()} */}


        <Grid
          item
          flex={1}
          xs={3}
          id="profile-grid-item"
          className={loggedInDisplay + " right-nav-item logged-in"}
          textAlign={'center'}
        >
          <Link id="profile-link"
            className={classes.accountNavLink}
            to="/profile">
            Profile
          </Link>
        </Grid>
        <Grid
          item
          flex={1}
          xs={3}
          className={loggedInDisplay + " right-nav-item logged-in"}
          textAlign={'center'} id="login-grid-item">
          <Link
            className={classes.accountNavLink}

            to="/login">Log In</Link>
        </Grid>
        <Grid item xs={3} flex={1} id="register-grid-item"
          className={loggedOutDisplay + " right-nav-item logged-out"}
          textAlign={'center'}>
          <Link
            id='register-link'
            className={classes.accountNavLink}
            to="/register">
            Register
          </Link>
        </Grid>
        <Grid item
          flex={1}
          xs={3}
          style={{ paddingLeft: 2 }}
          className={loggedInDisplay + " right-nav-item logged-in"}
          classes={{...classes}}
          textAlign={'center'}>
          <Link
            id="logout-link"
            className={classes.accountNavLink}
            style={{ paddingRight: 3, borderRight:0, }}
            to="/logout">
            Log out
          </Link>
        </Grid>
      </Grid>
    </>
  )
}

export function DesktopNavLinks() {
  const [currentPage, setCurrentPage] = useState();
  const [loggedInDisplay, setLoggedInDisplay] = useState('display-none');
  const [loggedOutDisplay, setLoggedOutDisplay] = useState(true);
  //const {mainMenuLink} = useStyles();
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

const
  AdminMenuItems = (props) => {
    const { role } = props;
    console.log(`showMenuItems role: ${role} logged In Displayed: ${loggedInDisplay}`);
    return (
      <span id="admin-span" hidden={(!role || role === 'user')} className={loggedInDisplay + " right-nav-item logged-in"}>

        <div id="admin-dropdown" className="main-menu-link dropdown">
          <Link id="admin-button" className="main-menu-link drop-button" to="/importer">
            Admin
          </Link>
          <i className="fa fa-caret-down"></i>
          <div className="dropdown-content">
            <Link to="/admin" hidden={!(role === 'admin')}>Admin Panel</Link>
            <Link to="/importer" hidden={!(role === 'curator' || role === 'admin')}>Import New Documents</Link>
            <Link to="/adminFiles" hidden={!(role === 'curator' || role === 'admin')}>Find Missing Files</Link>
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
    );
  }
export function NavLinks() {
  const [headerLandingCss, setHeaderLandingCss] = useState();
  const [currentPage, setCurrentPage] = useState();
  const [loggedInDisplay, setLoggedInDisplay] = useState('display-none');
  const getHeaderCss = () => {
    let headerCss = 'no-select';
    if (!currentPage || currentPage === '/') {
      headerCss += ' landing-header';
    }
    return headerCss;
  };

  return (
    <div id="nav-links-root">
      <Helmet>
        <meta charSet="utf-8" />
        <title>NEPAccess</title>
        <meta
          name="description"
          content="Bringing NEPA into the 21st Century through the power of data science. Find and engage with data from thousands of environmental review documents."
        />
        <link rel="canonical" href="https://www.localhost:8808/" />
      </Helmet>

      <div
        //id="header" 
        className={getHeaderCss() + headerLandingCss}
      >
        <div id="">
          <NavLink
            currentpage={(currentPage === '/contact').toString()}
            className="main-menu-link"
            to="/search"
          >
            Search
          </NavLink>
          <div id="about-dropdown-2" className="main-menu-link dropdown">
            <NavLink
              currentpage={(
                currentPage === '/search-tips' || currentPage === '/available-documents'
              ).toString()}
              id="about-button-2"
              className="main-menu-link drop-button"
              to="/search-tips"
            >
              Search Tips
            </NavLink>
            <i className="fa fa-caret-down"></i>
            <div className="dropdown-content">
              <Link to="/search-tips">Search Tips</Link>
              <Link to="/available-documents">Available Files</Link>
            </div>
          </div>
          <NavLink
            currentpage={(currentPage === '/about-nepa').toString()}
            className="main-menu-link"
            to="/about-nepa"
          >
            About NEPA
          </NavLink>
          <div id="about-dropdown" className="main-menu-link dropdown">
            <NavLink
              currentpage={(
                currentPage === '/about-nepaccess' ||
                currentPage === '/people' ||
                currentPage === '/media'
              ).toString()}
              id="about-button"
              className="main-menu-link drop-button"
              to="/about-nepaccess"
            >
              About NEPAccess
            </NavLink>
            <i className="fa fa-caret-down"></i>
            <div className="dropdown-content">
              <Link to="/about-nepaccess">About NEPAccess</Link>
              <Link to="/media">Media</Link>
              <Link to="/people">People</Link>
            </div>
          </div>

          <NavLink
            currentpage={(currentPage === '/contact').toString()}
            className="main-menu-link"
            to="/contact"
          >
            Contact
          </NavLink>
        </div>
      </div>
    </div>
  );
}