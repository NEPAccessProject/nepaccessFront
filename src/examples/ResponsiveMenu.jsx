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
    TextField,
    MenuItem,
    MenuList,
    Paper,
    Toolbar,
    Typography,
    useMediaQuery,
  } from '@material-ui/core';
  import theme from '../styles/theme';
  //import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
  
  import MenuIcon from '@material-ui/icons/Menu';
  import { withMediaQuery } from 'react-responsive';
  import React, { useState, useEffect } from 'react';
  import { Link as RouterLink } from 'react-router-dom';
  import { Helmet } from 'react-helmet';
  import Landing from '../Landing';
  import CalloutContainer from '../CalloutContainer';
  import SearcherLanding from '../SearcherLanding';
  import { withStyles } from '@mui/styles';
  const maxWidth = '1224px'
//import { AppBar, Toolbar, IconButton, Grid, MenuItem, Box, Link, Drawer, TextField } from '@mui/material';
//import MenuIcon from '@mui/icons-material/Menu';
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
  navLink: {
    // dropShadow: '3px',
    // position: 'relative',
    fontFamily: 'Open Sans',
    // fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: '1.1em',
    // lineHeight: '25px',
    // textDecoration: 'none',
    paddingLeft: 6,
    paddingRight: 6,
//    marginLeft:0,
    color: '#000000',
     textShadow: '0px 3p2 2px rgba(0, 0, 0, 0.25)',
     "&:hover": {
      textDecoration: 'underline'
     }
  },
  navLink: {
    // dropShadow: '3px',
    // position: 'relative',
    fontFamily: 'Open Sans',
    // fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: '0.9em',
    // lineHeight: '25px',
    // textDecoration: 'none',
    paddingLeft: 2,
    paddingRight: 2,
    margin:0,
    width:'100%',
    color: '#000000',
    textWrap: 'nowrap',
     textShadow: '0px 3p2 2px rgba(0, 0, 0, 0.25)',
     "&:hover": {
      textDecoration: 'underline'
     }
  },
  mainMenuLink: {
    color: 'black',
  },
  menuIcon: {
    color: 'white',
    border: '1px solid white'
  }
}));

export default function ResponsiveMenu() {
  const [state, setState] = useState({
    mobileView: false,
    drawerOpen: false,
  });

  const { mobileView, drawerOpen } = state;

  useEffect(() => {
    const setResponsiveness = () => {
      return window.innerWidth < 768
        ? setState((prevState) => ({ ...prevState, mobileView: true }))
        : setState((prevState) => ({ ...prevState, mobileView: false }));
    };

    setResponsiveness();

    window.addEventListener('resize', setResponsiveness);

    return () => {
      window.removeEventListener('resize', setResponsiveness);
    };
  }, []);

  const handleDrawerOpen = () => {
    setState((prevState) => ({ ...prevState, drawerOpen: true }));
  };

  const handleDrawerClose = () => {
    setState((prevState) => ({ ...prevState, drawerOpen: false }));
  };

  const displayMobile = () => {
    return (
      <>
        <Toolbar id="mobile-tool-bar" className={mobileToolbar} elevation={2}>
          <IconButton
            id="mobile-icon-button"
            color="inherit"
            edge="start"
            aria-label="menu"
            aria-haspopup="true"
            onClick={(evt)=>handleDrawerOpen(evt)}
          >
            <MenuIcon color="#000" className={menuIcon} />
          </IconButton>
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
            }}
          >
            <img src="logo2022.png" height={61} width={150} alt="NEPAccess Mobile Logo" />
          </Grid>

          <Drawer
            id="drawer"
            anchor="left"
            open={drawerOpen}
            onClose={(evt)=>handleDrawerClose(evt)}
          >
            <div id="drawer-container" className={drawerContainer}>
              {/* [TODO] abstract to Component since both desktop and mobile use it */}
              <TextField fullWidth id="main-search-text-field" />
            </div>
          </Drawer>
        </Toolbar>
      </>
    );
  };
  const AccountMenu = () => {
    console.log('ACCOUNT MENU')
    return (
      <>
        <div
                     style={{zIndex: 9999}} 
                    id="top-menu" 
                    className="no-select">
                    
                    {this.showMenuItems()}

                    <span id="profile-span" className={this.state.loggedInDisplay + " right-nav-item logged-in"}>
                        <Link className="top-menu-link" to="/profile">Profile</Link>
                    </span>
                    <span id="login-span" className={this.state.loggedOutDisplay + " logged-out"}>
                        <Link className="top-menu-link" to="/login">Log in</Link>
                    </span>
                    <span id="register-span" className={this.state.loggedOutDisplay + " right-nav-item logged-out"}>
                        <Link className="top-menu-link" to="/register">Register</Link>
                    </span>
                    <span className={this.state.loggedInDisplay + " right-nav-item logged-in"}>
                        <Link className="top-menu-link" to="/logout">Log out</Link>
                    </span>
                </div>
      </>
    )
  } 
  const displayDesktop = () => {
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
            xs={{
              height: '50px',
              width: '200px',
            }}
          >
            <img
              id="logo-image"
              src="logo2022.png"
              className={logoImage}
              height={102}
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
            }}
          >
            <Link href="#" className={navLink}>Link 1</Link>
            <Link href="#" className={navLink}>Link 2</Link>
            <Link href="#" className={navLink}>Link 3</Link>
          </Container>
        </Toolbar>
      </>
    );
  };

  return (
    <AppBar
      elevation={0}
      id="header-mobile-appbar"
      position="static"
      color="primary"
      style={{ border: '2px solid red' }}
      classes={{ root: classes.abRoot, positionStatic: classes.abStatic }}
    >
      {mobileView ? displayMobile() : displayDesktop()}
    </AppBar>
  )
  }