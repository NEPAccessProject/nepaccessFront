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
import { Link as RouterLink,NavLink } from 'react-router-dom';
import './index.css';
import { Helmet } from 'react-helmet';
import Landing from './Landing';
import CalloutContainer from './CalloutContainer';
import SearcherLanding from './SearcherLanding';
import { withStyles } from '@mui/styles';
const maxWidth = '1224px'
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
    border: 1,
    borderColor: 'blue',
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
    // dropShadow: '3px',
    // position: 'relative',
    fontFamily: 'Open Sans',
    // fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: '1.1em',
    // lineHeight: '25px',
    // textDecoration: 'none',
    //    marginLeft:0,
    textAlign: 'center',
    display: 'flex',
    alignContent: 'center',
    color: '#000000',
    textShadow: '0px 3px 2px rgba(0, 0, 0, 0.25)',
    "&:hover": {
      textDecoration: 'underline'
    }
  },
  accountNavLink: {
    // dropShadow: '3px',
    // position: 'relative',
    fontFamily: 'Open Sans',
    // fontStyle: 'normal',
    fontSize: '0.7em',
    // lineHeight: '25px',
    // textDecoration: 'none',
    //    marginLeft:0,
    padding: 0,
    margin: 0,
    textAlign: 'center',
    display: 'flex',
    alignContent: 'center',
    justifyContent: 'flex-start',
    alignItems:'flex-end',
    color: '#000000',
    borderLeft: 1
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
    padding:2,
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
    fontSize:1.1
  },
  menuIcon: {
    color: 'white',
    border: '1px solid white'
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
  //  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })
  //  const isPortrait = useMediaQuery({ query: '(orientation: portrait)' })
  //  const isRetina = useMediaQuery({ query: '(min-resolution: 2dppx)' })
  useEffect(() => {
    const setResponsiveness = () => {
      console.log('set responsive', window.innerHeight);
      return window.innerWidth < 1224
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
        <AppBar elevation={0}

          id="header-mobile-appbar"
          position="static"
          style={{}}
          color="primary"
          classes={{ root: classes.abRoot, positionStatic: classes.abStatic }}
        // sx={{
        //   zIndex: 0,
        //   backgroundColor: '#abbdc4 !important',
        //   border: 3,
        //   boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
        // }}
        >

          <Toolbar
            id="nav-mobile-toolbar"
            //          className={toolbar}
            color='primary'
          >
<Grid container alignItems='flex-end' justifyContent='flex-end'>
              <IconButton
                
                id="mobile-icon-button"
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={handleDrawerOpen}
              //sx={{ mr: 2 }}
              >
                <MenuIcon color="#fff" className={classes.menuIcon}  />
              </IconButton>
</Grid>
            <Grid container
              id="mobile-logo-container"
              justifyContent='flex-start'
              sx={{
                // alignItems: 'center',
                // height: '50px',
                // display: 'flex',
                // alignItems: 'center',
                // justifyContent: 'center',
              }}>

              <img src="/logo2022_mobile.png" alt="NEPAccess Mobile Logo" />
            </Grid>

            <Drawer
              id="drawer"
              {...{
                anchor: 'left',
                open: drawerOpen,
                onClose: handleDrawerClose,
              }}
            >
              <div id="drawer-container" className={classes.drawerContainer}>
                {getDrawerChoices()}
                <SearcherLanding />
              </div>
            </Drawer>

            {/* <div>{getMenuButtons()}</div> */}

          </Toolbar>
        </AppBar>
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
  const displayDesktop = (props) => {
    const role = 'user';
    const loggedInDisplay = 'none';
    const loggedOutDisplay = '';
    const loggedIn = false;
    const headerLandingCss = ''; //props.headerLandingCss || '';
    const currentPage = ''; //props.currentPage || '';
    return (
      <>
        {/* [TODO] Revist this should not be needed since the parent
 function should take care of it */}
        {!mobileView &&
          <Toolbar
            id="nav-toolbar"
            color="primary"
          
            disableGutters={true}
            style={{width: '100%' }}
            sx={{
              flexGrow: 1,
              backgroundColor: '#abbdc4',
              display: "flex",
              justifyContent: 'flex-end',
            }}
          >
            {/* <MenuList id="menu-container"
              anchorEl={anchorEl}
//            variant='menu'
            open={true}
            autoFocusItem={drawerOpen}
//                position="fixed"
            PaperProps={{
              id:"menu-container-paper",
              top:0,
              left:0
            }}
            > */}

            <Grid container id="nav-toolbar-grid-container"
              flexDirection="row"
              flex={1}
              display="flex"
              xs={12}
              //style={{ border: '1px solid black' }}
            >

              <Grid item 
                display="flex" 
                flexDirection="row" 
                wrap='nowrap'
                id="nav-toolbar-logo-grid-item"
                xs={2}
                style={{ display: 'flex', justifyContent: 'flex-start'}}
                >
                <img

                  id="desktop-logo-image"
                  src="logo2022.png"
                  className={classes.logoImage}
                  height={102}
                  width={304}
                  alt="NEPAccess Logo"
                  style={{ display: "inline", border: 0 }}
                />
              </Grid>

              {/* <Grid container justifyContent='flex-end' item xs={9} flex={1} border={2} id="nav-toolbar-menuitems-grid-item"> */}
              <Grid item id="nav-toolbar-menuitems-grid-item"
                display="flex"
                xs={10}
                border={0}
                justifyContent='flex-end'
                alignItems='center'
                style={{ display: 'flex', justifyContent: 'flex-end' }}
                sx={{
                  width: '100%',
                  height: '100%'
                }}

              >
                {/* <Box display={'flex'} justifyContent={'flex-end'} flex={1} id="nav-toolbar-menuitems-box"> */}
                {/* <MenuItem className={classes.navLink}>Search</MenuItem>
                <MenuItem className={classes.navLink}>Search Tips</MenuItem>
                <MenuItem className={classes.navLink}>Available Files</MenuItem>
                <MenuItem className={classes.navLink}>About NEPA</MenuItem>
                <MenuItem className={classes.navLink}>About NEPAccess</MenuItem>
                <MenuItem className={classes.navLink}>Contact</MenuItem> */}
                <NavLinks />
                {/* </Box> */}
                {/* </Grid> */}

                <Grid container
                  id="nav-toolbar-admin-grid"
                  hidden={!role || role === 'user'}
                  xs={3}
                  border={2}
                  borderColor="black"
                  flex={1}
                  className={classes.adminGrid}
                  style={{ border: '2px solid red' }}
                >
                  <span
                    id="admin-span"
                    style={{ border: '3px solid red' }}
                  //hidden={!role || role === 'user'} 
                  //className={loggedIn ? 'right-nav-item logged-in' : ''}
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



                </Grid>

                <Grid
                  container
                  xs={2}
                  id="top-menu-grid-container"
                  justifyContent='center'
                  alignContent='center'
                  style={{ 
                    display:'flex',
                    flexDirection:'column',
                    zIndex: 9999, 
                  }}
                  className="no-select">
                  {/*                     
                    {this.showMenuItems()} */}

                  <Grid
                    item
                    flex={1}
                    xs={2}
                    id="profile-grid-item"
                    //className={loggedInDisplay + " right-nav-item logged-in"} 
                    textAlign={'center'}
                  >
                    <Link id="profile-link"
                      className={classes.accountNavLink}
                      to="/profile">
                      Profile
                    </Link>
                  </Grid>
                  <Grid flex={1} xs={3}
                    //className={loggedInDisplay + " right-nav-item logged-in"} 
                    textAlign={'center'} id="login-grid-item">
                    <Link
                      className={classes.accountNavLink}

                      to="/login">Log In</Link>
                  </Grid>
                  <Grid item xs={3} flex={1} id="register-grid-item"
                    //className={loggedOutDisplay + " right-nav-item logged-out"} 
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
                    //className={loggedInDisplay + " right-nav-item logged-in"} 
                    textAlign={'center'}>
                    <Link
                      id="logout-link"
                      className={classes.accountNavLink}
                      style={{ paddingLeft: 2 }}
                      to="/logout">
                      Log out
                    </Link>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            {/* </MenuList> */}
          </Toolbar>
        }
        {/* <Landing /> */}
        {/* <Container id='mobile-content-container'>
          <Container id="mobile-search-container">
            <SearcherLanding />
          </Container>

          <Container id="mobile-call-out-container">
            <CalloutContainer />
          </Container>
        </Container> */}
      </>
    );
  };


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
      // border: 1,
      // height: 50
    }}>
      <AppBar elevation={1}
        id="header-desktop-appbar"
        position="static"
        style={{}}
        color="primary"

        classes={{ root: classes.abRoot, positionStatic: classes.abStatic }}
      >
        {mobileView ? displayMobile() : displayDesktop()}
      </AppBar>
    </Paper>
  );
}
export default HeaderNav;

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
  showMenuItems = () => {
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
    <div id="">
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