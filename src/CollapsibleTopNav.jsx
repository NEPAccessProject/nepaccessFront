import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  SwipeableDrawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Nav,
  NavItem,
} from '@material-ui/core';
import { MenuOutlined, InboxOutlined, MailOutlineOutlined } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
}));

function CollapsibleTopNav(props) {
  const classes = useStyles();
  const { navItems } = props;
  const [state, setState] = React.useState({
    left: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <div
      className={classes.list}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {navItems.map((item, index) => (
          <ListItem button key={item.value}>
            <ListItemIcon key={`icon-${item.id}`}>{item.icon}</ListItemIcon>
            <ListItemText key={`text-${item.id}`} primary={item.label} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <div className={classes.root}>
      <AppBar
        elevation={0}
        color="transparent"
        position="static"
        sx={{
          color: 'white',
          backgroundColor: 'transparent',
        }}
      >
        <Toolbar
          sx={{
            backgroundColor: 'transparent',
          }}
        >
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer('left', true)}
          >
            <MenuOutlined />
          </IconButton>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
      <SwipeableDrawer
        anchor="left"
        open={state['left']}
        onClose={toggleDrawer('left', false)}
        onOpen={toggleDrawer('left', true)}
      >
        {list('left')}
      </SwipeableDrawer>
    </div>
  );
}

export default CollapsibleTopNav;
