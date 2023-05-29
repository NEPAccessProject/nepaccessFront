import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Menu,
  MenuItem,
  List,
  ListItem,
  Nav,
  NavItem,
  NavItems,
} from '@material-ui/core';

import {withMediaQuery} from 'react-responsive';
import MenuIcon from '@material-ui/icons/Menu';
import CollapsibleTopNav from './CollapsibleTopNav';
import { Container } from '@mui/material';
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: 'transparent',
    alignContent: 'flex-end',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    border: '3px solid red',
    flexDirection: 'row',
    display: 'flex',
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  title: {
    flexGrow: 1,
  },
}));

function TopNav(props) {
  const { navItems } = props;
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  return (
    <div className={classes.root}>
      <AppBar position="static" elevation={0} color="transparent">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Container
            sx={{
              alignItems: 'flex-start',
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
          
            {navItems.map((item, index) => (
              <MenuItem>{item.label}</MenuItem>
            ))}
          </Container>
          <Button
            color="inherit"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenuClick}
          >
            Menu
          </Button>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
            <MenuItem onClick={handleMenuClose}>My account</MenuItem>
            <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
            {navItems.map((item, index) => (
              <MenuItem>{item.label}</MenuItem>
            ))}
          </Menu>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default TopNav;
