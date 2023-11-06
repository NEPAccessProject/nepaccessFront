import {
  AppBar,
  Box,
  Button,
  Container,
  Divider,
  Drawer,
  //Grid,
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
import Grid from '@mui/material/Unstable_Grid2';
import MenuIcon from '@material-ui/icons/Menu';
import { withMediaQuery } from 'react-responsive';
import React, { useState, useEffect, useContext } from 'react';
import { Link as RouterLink, NavLink } from 'react-router-dom';
import './index.css';
import { Helmet } from 'react-helmet';
import Landing from './Landing';
import CalloutContainer from './CalloutContainer';
import { withStyles } from '@mui/styles';
import globals from './globals';
import SearchContext from './search/SearchContext';
import { withRouter } from 'react-router-dom'
const _MAX_WIDTH = '768px'
const anchorRef = React.createRef();
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
    label: 'News',
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
/* #region Styles  */

const useStyles = makeStyles((theme) => ({
  abRoot: {
    backgroundColor: "#abbdc4",
    zIndex: 0,
    flexDirection: 'row',
    elevation: 1,
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
  },
  mobileToolbar: {
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
    height: 102,
    width: 304,
    display: "block",
  },
  logoBox: {
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
    textAlign: 'center',
    display: 'flex',
    alignContent: 'center',
    color: '#000000',
    width: '100%',
    textAlign: 'right',
    textShadow: '0px 3px 2px rgba(0, 0, 0, 0.25)',
    maxWidth: 'fit-content',
    "&:hover": {
      textDecoration: 'underline'
    }
  },
  accountNavLink: {
    fontFamily: 'Open Sans',
    fontSize: '0.7em',
    paddingLeft: 2,
    "&:hover": {
      textDecoration: 'underline',
      cursor: 'pointer'
    }
  },
  accountNavLinkGridItem: {
    display: 'flex',
    paddingRight: 4,
    maxWidth: '55px',
    justifyContent: 'center', //horizontal aligmnent
    alignItems: 'center', //verical aligment
    alignContent: '',

  },
  accountNavLinksContainer: {
    padding: 0,
  },

  navLink: {
    fontFamily: 'Open Sans',
    fontWeight: 'bold',
    fontSize: '1.0em',
    lineHeight: '25px',
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
/* #endregion */

const linkStyle = {
  color: 'black',
  fontSize: 11,
  fontWeight: 600,
  textDecoration: 'underline',
  padding: 0,
};
const accountLinkGridItemStyle = {
  paddingLeft: 1,
  paddingRight: 1,
  paddingTop: 2,
  paddingBottom: 2,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};


const HeaderNav = (props) => {

  const classes = useStyles(theme)
  const [state, setState] = useState({
    mobileView: false,
    drawerOpen: false,
  });

  const { mobileView, drawerOpen } = state;
  const { loggedInDisplay, loggedOutDisplay, role } = props;
  //for Menu anchor
  const [anchorEl, setAnchorEl] = React.useState(null);
  const anchorRef = React.useRef(null);

  const isBigScreen = useMediaQuery('(min-width: 1824px)')
  const isTabletOrMobile = useMediaQuery('(max-width: 768px)')
  const isPortrait = useMediaQuery("(orientation: portrait)")
  const isRetina = useMediaQuery('(min-resolution: 2dppx)')


  useEffect(() => {

    const setResponsiveness = () => {
      return window.innerWidth < globals.mobileBreakPointWidth
        ? setState((prevState) => ({ ...prevState, mobileView: true }))
        : setState((prevState) => ({ ...prevState, mobileView: false }));
    };
    setResponsiveness();
    window.addEventListener('resize', (evt) => {
      setResponsiveness();
    });

    return () => {
      window.removeEventListener('resize', () => setResponsiveness());
    };
  }, []);

  const prevOpen = React.useRef(drawerOpen);

  React.useEffect(() => {
    if (anchorRef.current && prevOpen.current === true && drawerOpen === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = drawerOpen;
  },);

  const MobileNav = () => {
    const handleDrawerOpen = () => setState((prevState) => ({ ...prevState, drawerOpen: true }));
    const handleDrawerClose = (evt) => {
      if (anchorRef.current && anchorRef.current.contains(evt.target)) {
        return;
      }
      setState((prevState) => ({ ...prevState, drawerOpen: false }))
    };

    return (
      <>
        <AppBar
          id="header-mobile-appbar"
          position="sticky"
          elevation={1}
          style={{
            paddingLeft: 5,
            paddingRight: 5,
          }}
          color="primary"

          classes={{ root: classes.abRoot, positionStatic: classes.abStatic }}
        >
          <Toolbar
            id="nav-mobile-toolbar"
            color='primary'
            elevation={1}
            disableGutters={true}
            paperProps={{
              elevation: 1,
            }}
            paper
            style={{
              justifyContent: 'flex-start',
              width: '100%'
            }}
          >
            <Grid
              container
              xs={12}
              id="toolbar-grid-container"
              flex={1}>

              <Grid
                item xs={2}
                id="mobile-nav-logo-grid-item"
                justifyContent='flex-end'
                paddingLeft={1}
                style={{
                  justifyContent: 'flex-start',
                  display: 'flex',
                  paddingTop: 2,
                  paddingBottom: 2
                }}
              >
                <img src="/logo2022.png" width={250} alt="NEPAccess Mobile Logo" />
              </Grid>
              <Grid
                item
                flex={1}
                xs={9}
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignContent: 'center',
                  alignItems: 'center',
                }}
              >

                <IconButton
                  id="mobile-icon-button"
                  size="large"
                  edge="end"
                  aria-label="menu"
                  style={{
                    borderRadius: 1,
                    marginRight: 10,
                    marginTop: 10,
                    marginBottom: 10,
                    border: '1px solid white'
                  }}
                  onClick={handleDrawerOpen}
                >
                  <MenuIcon border='1px solid white' color="#fff" className={classes.menuIcon} />
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
                    elevation: 1,
                  }}
                >
                  <div id="drawer-container" className={classes.drawerContainer}>
                    {getDrawerChoices()}
                  </div>
                </Drawer>

              </Grid>
            </Grid>
          </Toolbar>
        </AppBar >
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
            {/* #region Start Logo and Main Menu Container */}
            <Grid id="top-nav-grid-container" xs={12} container flex={1} >
              <Grid container xs={12} flex={1}>
                {/* #region Start Main Menu */}
                {/* #region*/}
                <Grid container xs={2}>
                  <DesktopLogo {...props} />
                </Grid>
                {/* #endregion Logo Container */}
                {/* #region Main Menu Nav Container */}
                <Grid
                  container
                  xs={10}
                  justifyContent='flex-end'
                  id="main-nav-grid-container"
                  style={{
                  }}>
                  <Grid
                    container
                    id="main-menu-grid-container"
                    xs={12}
                    display='flex'
                    alignItems='center'
                    justifyContent='flex-end'
                  >
                    {/* #region Desktop Nav Links */}
                    <DesktopNavLinks {...props} />
                    {/* #endregion */}
                  </Grid>
                </Grid>
                {/* #endregion*/}
              </Grid>
            </Grid>
            {/* #endregion*/}
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
            paddingLeft: 5,
          }}
        >
          <img

            id="desktop-logo-image"
            src="logo2022.png"
            className={classes.logoImage}
            alt="NEPAccess Logo"
          />
        </Grid>
      </>
    )
  }
  const DesktopNavLinks = (props) => {
    const classes = useStyles(theme);
    const { loggedInDisplay, loggedOutDisplay, role, loggedIn } = props;
    return (
      <>
        <Grid container id="nav-toolbar-grid-container"
          display="flex"
          xs={12}
          style={{
          }}
        >
          {/* <Grid
            container
            id="nav-toolbar-top-nav-links-grid-item"
            xs={12}
            display='flex'
            justifyContent='flex-end'
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              border: '1px solid black',
            }}
          > */}
          <Grid item display={'flex'}
            xs={12}
            style={{
              justifyContent: 'flex-end'
            }}
          >
            <Grid xs={10} item style={{ ...accountLinkGridItemStyle, justifyContent: 'center', display: 'flex' }}><NavLinks {...props} /></Grid>
            <Grid xs={2} item style={{ ...accountLinkGridItemStyle, justifyContent: 'center', display: 'flex', alignItems:'center ', alignContent: 'flex-start' }}><TopNavLinks {...props} /></Grid>
          </Grid>
          {/* #endregion */}
          {/* END TOP NAV  */}

        </Grid>
      </>
    )
  }
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
        {mobileView ? MobileNav(props) : DesktopNav(props)}
      </AppBar>
    </Paper>
  );
}

export function TopNavLinks(props) {
  const { loggedInDisplay, loggedOutDisplay, role, loggedIn, showMenuItems, currentPage } = props;

  const classes = useStyles(theme);
  return (
    <>
      <Grid id="admin-menu-dropdown-grid"
        item
        xs={3}
        style={{...accountLinkGridItemStyle}}
      >
        <div id="admin-dropdown" className="main-menu-link dropdown">
          <NavLink
            currentpage={(
              currentPage === '/search-tips' || currentPage === '/available-documents'
            ).toString()}
//            id="admin-button"
            to="/admin"
            style={linkStyle}
          >
            Admin
          </NavLink>
          {/* <i className="fa fa-caret-down"></i> */}
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
      </Grid>
      <Grid
        item
        flex={1}
        xs={3}
        //          id="profile-grid-item"
        style={{...accountLinkGridItemStyle,justifyContent:'center'}}
      >
        <a id="profile-link"
          style={linkStyle}
          href="/profile">
          Profile
        </a>
      </Grid>
      {!loggedIn && (
        <>
          <Grid
            item
            flex={1}
            xs={3}
            style={accountLinkGridItemStyle}
            id="login-grid-item">
            <a
              style={linkStyle}
              href="/login">Log In</a>
          </Grid>
          {/* It didn't seem to have a register link once you are logged in */}
          <Grid
            item
            style={{...accountLinkGridItemStyle,justifyContent:'center'}}
            id="register-grid-item"
            xs={3}
            flex={1}
          >
            <a href
              id='register-link'
              style={linkStyle}
              href="/register">
              Register
            </a>
          </Grid>
        </>
      )}
      {loggedIn && (
        <Grid
          item
          style={accountLinkGridItemStyle}
          flex={1}
          xs={3}
        >
          <a
            id="logout-link"
            //className={classes.accountNavLink}
            style={linkStyle}
            href="/logout">
            Log out
          </a>
        </Grid>
      )}
    </>
  )
}

const
  AdminMenuItems = (props) => {
    const { role, loggedInDisplay, loggedIn } = props;
    console.log(`showMenuItems role: ${role} logged In Displayed: ${loggedInDisplay}`);
    return (
      <span id="admin-span" hidden={(!loggedIn || !role || role !== 'admin')}>
        <div id="admin-dropdown"
          className="main-menu-link">
          <a id="admin-button" className="main-menu-link drop-button" href="/importer">
            Admin
          </a>
          <i className="fa fa-caret-down"></i>
          <div>
            <a href="/admin" hidden={!(role === 'admin')}>Admin Panel</a>
            <a href="/importer" hidden={!(role === 'curator' || role === 'admin')}>Import New Documents</a>
            <a href="/adminFiles" hidden={!(role === 'curator' || role === 'admin')}>Find Missing Files</a>
            <a href="/approve">Approve Users</a>
            <a href="/pre_register">Pre-Register Users</a>
            <a href="/interaction_logs">Interaction Logs</a>
            <a href="/search_logs">Search Logs</a>
            <a href="/abouthelpcontents">Database Contents</a>
            <a href="/stats">Content Statistics</a>
            <a href="/stat_counts">Stat Counts</a>
            <a href="/surveys">Surveys</a>
          </div>
        </div>

      </span>
    );
  }
export function NavLinks(props) {
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
    <div id="header-nav-root">
      <div
        id="header-nav"
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
              <Link to="/media">News</Link>
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
export default withRouter(HeaderNav);
