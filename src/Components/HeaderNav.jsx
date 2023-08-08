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
    MenuItem,
    Toolbar,
    makeStyles
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import MediaQuery from 'react-responsive';
import { Link as RouterLink } from 'react-router-dom';
import { NavLink } from 'react-router-dom/cjs/react-router-dom.min';
import '../index.css';
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
    backgroundColor: '#B6C4C8',
    height: '105px',
    justifyItems: 'center',

    // backgroundImage: 'url("logo2022.png")',
  },
  mobileToolbar: {
    display: 'flex',
    height: '65px',
    backgroundColor: '#b6c4c8',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
  },
  drawerContainer: {
    padding: '20px 30px',
  },

  muiAppBar: {
    backgroundColor: '#b6c4c8',
    height: '50px',
    display: 'block',
    width: '100%',
    /* background: #abbdc4; */
    zIndex: 99999 /* Geojson map introduces some very high z-index items */,
  },
  logoImage: {
    // backgroundImage: 'url("logo2022.png")',
    // backgroundImage: 'url("logo2022.png")',
    backgroundRepeat: 'no-repeat',
    // border: '3px solid red',
    justifyContent: 'left',
    backgroundSize: 'contain',
  },
  logoBox: {
    // marginLeft: '200px',
    // height:'102px',
    width: '200px',
    // backgroundPosition:'top',

    // backgroundImage: 'url("logo2022.png")',
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
    color: 'black',
    border: '1px solid black',
  },
}));

export default function HeaderNav() {
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
  // const isMobile = withMediaQuery({ maxWidth: 768 })
  const { mobileView, drawerOpen } = state;

  useEffect(() => {
    const setResponsiveness = () => {
      //console.log('set responsive', window.innerHeight);
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
        <Toolbar id="mobile-tool-bar" className={mobileToolbar} elevation={1}>
          
          <Grid
            container
            id="mobile-logo-container"
            sx={{
              alignItems: 'center',
              border: '2px solid black',
              height: '70px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgb(151,171,178)',
            }}
          >
            <img src="logo2022.png" height={61} width={150} alt="NEPAccess Mobile Logo" />
            
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
            </div>
          </Drawer>

          {/* <div>{getMenuButtons()}</div> */}
          <IconButton
            id="mobile-icon-button"
            {...{
              color: 'black',
              edge: 'end',
              color: 'inherit',
              'aria-label': 'menu',
              'aria-haspopup': 'true',
              onClick: handleDrawerOpen,
            }}
          >
            <MenuIcon color="#000" className={menuIcon} />
          </IconButton>
        </Toolbar>
      </>
    );
  };

  const getDrawerChoices = () => {
    return headersData.map(({ label, href }, idx) => {
      return (
        <Link
          key={`${label}-${idx}`}
          {...{
            component: RouterLink,
            to: href,
            color: 'inherit',
            style: { textDecoration: 'none' },
            key: label,
          }}
          xs={{
            color: 'black',
            fontWeight: 600,
          }}
        >
          <MenuItem
            xs={{
              color: 'black',
            }}
            className="menu-item"
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
    return (
      <>
        <Toolbar
          id="nav-toolbar"
          className={toolbar}
          xs={{
            background: 'transparent',
            backgroundImage: 'url("logo2022.png")',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'contain',
            border: '3px solid red',
            height: '105px',
          }}
        >
          <Box
            id="desktop-logo-box"
            xs={{
              height: '102px',
              width: '200px',
              border: '3px solid red',
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
              width={302}
              alt="NEPAccess Logo"
            />
          </Box>
          <Container
            id="link-container"
            xs={{
              justifyContent: 'flex-start',
              alignItems: 'left',
              marginLeft: '350px',
              backgroundImage: 'url("logo2022.png")',
              // backgroundColor: 'rgb(151,171,178)',
            }}
          >
            <NavLinks />

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
        </Toolbar>
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
          key={label}
          {...{
            color: 'inherit',
            to: href,
            component: RouterLink,
            className: menuButton,
          }}
        >
          {label}
        </Button>
      );
    });
  };
  /* RETURN of the main function */
  return (
      <AppBar
        elevation={1}
        id="header-root-app-bar"
        sx={
          {
            // backgroundColor: 'rgb(151,171,178)',
          }
        }
      >
        <MediaQuery maxWidth={768}>{displayMobile()}</MediaQuery>
        <MediaQuery minWidth={768}>{displayDesktop()}</MediaQuery>
      </AppBar>

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

      <div id="header" className={getHeaderCss() + headerLandingCss}>
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
