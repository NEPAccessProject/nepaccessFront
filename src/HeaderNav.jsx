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
import { Link as RouterLink } from 'react-router-dom';
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
    label:'logout'
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
  adminGrid:{
    display:"flex",
    height:'100%',
    border:1,
    borderColor:'blue',
    alignItems:'flex-start',
    alignContent:'flex-start',
    justifyContent:'flex-start',
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

function HeaderNav(props) {
  const classes = useStyles(theme)
  const [state, setState] = useState({
    mobileView: false,
    drawerOpen: false,
  });

  const { mobileView, drawerOpen } = state;
  const { showMenuItems, loggedInDisplay, loggedOutDisplay } = props;
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
    if (prevOpen.current === true && drawerOpen === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const displayMobile = () => {
    const handleDrawerOpen = () => setState((prevState) => ({ ...prevState, drawerOpen: true }));
    const handleDrawerClose = (evt) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
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
            <IconButton
              id="mobile-icon-button"
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
            //sx={{ mr: 2 }}
            >
              <MenuIcon color="#fff" className={classes.menuIcon} />
            </IconButton>
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
        {/* [TODO] Revist this should not be needed since the parent
 function should take care of it */}
        {!state.mobileView &&
            <Toolbar
              id="nav-toolbar"
              //className={classes.toolbar}
              color='primary'
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
              <Grid container id="nav-toolbar-grid-container" display="flex" xs={12} border={2} height={100}>

                <Grid item  display="flex" flexDirection="row" justifyContent='flex-end' wrap='nowrap'  xs={2} flex={1} 
                sx={{
                  width: '100%',
                  border: 2,
                }}
                border={2} id="nav-toolbar-logo-grid-item">
                  <img
                    
                    id="desktop-logo-image"
                    src="logo2022.png"
                    className={classes.logoImage}
                    height={100}
                    width={302}
                    alt="NEPAccess Logo"
                    style={{display: "inline"}}
                  />
                </Grid>

                {/* <Grid container justifyContent='flex-end' item xs={9} flex={1} border={2} id="nav-toolbar-menuitems-grid-item"> */}
                  <Grid item id="nav-toolbar-menuitems-grid-item" 
                    display="flex"
                     xs={12} 
                     border={2} 
                     justifyContent='flex-end'
                     alignItems='center'
                     style={{display:'flex', justifyContent:'flex-end'}}
                    sx={{
                      width:'100%',
                      height:'100%'
                    }}
                     
                     >
                    {/* <Box display={'flex'} justifyContent={'flex-end'} flex={1} id="nav-toolbar-menuitems-box"> */}
                      <MenuItem className={classes.navLink}>Search</MenuItem>
                      <MenuItem className={classes.navLink}>Search Tips</MenuItem>
                      <MenuItem className={classes.navLink}>Available Files</MenuItem>
                      <MenuItem className={classes.navLink}>About NEPA</MenuItem>
                      <MenuItem className={classes.navLink}>About NEPAccess</MenuItem>
                      <MenuItem className={classes.navLink}>Contact</MenuItem>
                    {/* </Box> */}
                  {/* </Grid> */}

                  <Grid item id="nav-toolbar-admin-grid" 
                    flex={1} 
                    className={classes.adminGrid}
>
                    <Box id="nav-toolbar-admin-span-box" display={'flex'}  flex={1} justifyContent={'flex-end'}>
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
                    </Box>
                    <Box
                      // style={{ zIndex: 9999 }}
                      display="flex"
                      justifyContent="flex-end"
                      id="top-menu-admin-links"
                    //width={100}
                    //className="no-select"
                    >

                      {/* {showMenuItems()} */}

                      <span
                        id="profile-span"
                        className={loggedInDisplay + " right-nav-item logged-in"}>
                        <Link
                          className="top-menu-link"
                          to="/profile">
                          Profile
                        </Link>
                      </span>
                      <span id="login-span" className={loggedOutDisplay + " logged-out"}>
                        <Link className="top-menu-link" to="/login">Log in</Link>
                      </span>
                      <span id="register-span" className={loggedOutDisplay + " right-nav-item logged-out"}>
                        <Link className="top-menu-link" to="/register">Register</Link>
                      </span>
                      <span className={loggedInDisplay + " right-nav-item logged-in"}>
                        <Link className="top-menu-link" to="/logout">Log out</Link>
                      </span>
                    </Box>
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
      <AppBar elevation={0}
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
  const [loggedOutDisplay, setLoggedOutDisplay] = useState();
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