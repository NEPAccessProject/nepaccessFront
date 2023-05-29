import React from "react";
import {
  AppBar,
  Toolbar,
  CssBaseline,
  Typography,
  makeStyles,
  useTheme,
  useMediaQuery,
  Container,
  Grid,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import DrawerComponent from "./Drawer";
import { useState } from "react";
import './index.css';

const useStyles = makeStyles((theme) => ({
  navlinks: {
    marginLeft: theme.spacing(5),
    display: "flex",
    justifyContent: "space-between",
  },
  logo: {
    flexGrow: "1",
    cursor: "pointer",
  },
  appBar: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    width: '100%',
  },
  link: {
    textDecoration: "none",
    color: "white",
    fontSize: "20px",
    marginLeft: theme.spacing(20),
    borderBottom: "1px solid transparent",
    "&:hover": {
      color: "yellow",
      borderBottom: "1px solid white",
    },
  },
}));

export default function Navbar(props) {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [currentPage, setCurrentPage] = useState('');
  const [loggedOutDisplay, setLoggedOutDisplay] = useState('display-block');
  const [headerLandingCss, setheaderLandingCss] = useState('');
  const [loggedInDisplay, setLoggedInDisplay] = useState('');

  return (
    <Container className="no-select">
      <AppBar elevation={0} className={classes.appBar} position="static">
        <CssBaseline />
        <Toolbar
          elevation={0}
          xs={{
            backgroundColor: 'transparent',
            alignSelf: 'center',

          }}
        >
          {isMobile ? (
            <DrawerComponent />
          ) : (
            <div id="header" className={this.getHeaderCss() + headerLandingCss}>

              <div id="logo" className="no-select">
                <Link id="logo-link" to="/">
                </Link>
                <div id="logo-box">

                </div>
              </div>

              <div id="" className="no-select">
                <Grid container
                  xs={{
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    justify: 'flex-end',
                    alignItems: 'center',
                    spacing: 0,
                  }}
                >

                  <Grid item>
                    <Navbar />
                    {/* {(matches)
        ? (this.showMenuItems())
        : (this.renderMobileNav())
      } */}
                  </Grid>

                  <Grid>
                    <span id="profile-span" className={loggedInDisplay + " right-nav-item logged-in"}>
                      <Link className="top-menu-link" to="/profile">Profile</Link>
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

                  </Grid>					</Grid>
              </div>

              <div id="main-menu">
                <Link currentpage={(currentPage === "/search").toString()} className="main-menu-link" to="/search">
                  Search
                </Link>
                  <Link currentpage={(currentPage === "/search-tips" || currentPage === "/available-documents").toString()} id="about-button-2" className="main-menu-link drop-button" to="/search-tips">
                    Search Tips
                  </Link>
                  <Link currentpage={(currentPage === "/search-tips" || currentPage === "/available-documents").toString()} id="about-button-2" className="main-menu-link drop-button" to="/search-tips">
                    Availble Files
                  </Link>

                <Link currentpage={(currentPage === "/about-nepa").toString()} className="main-menu-link" to="/about-nepa">
                  About NEPA
                </Link>
                <div id="about-dropdown" className="main-menu-link dropdown">
                  <Link currentpage={(currentPage === "/about-nepaccess" || currentPage === "/people" || currentPage === "/media").toString()} id="about-button" className="main-menu-link drop-button" to="/about-nepaccess">
                    About NEPAccess
                  </Link>
                  <i className="fa fa-caret-down"></i>
                  <div className="dropdown-content">
                    <Link to="/about-nepaccess">About NEPAccess</Link>
                    <Link to="/media">
                      Media
                    </Link>
                    <Link to="/people">People</Link>
                  </div>
                </div>

                {/* <Link currentpage={(currentPage==="/future").toString()} className="main-menu-link" to="/future">
      Future
    </Link> */}
                <Link currentpage={(currentPage === "/contact").toString()} className="main-menu-link" to="/contact">
                  Contact
                </Link>

              </div>

            </div>
          )}
        </Toolbar>
      </AppBar>
    </Container>
  );
}

