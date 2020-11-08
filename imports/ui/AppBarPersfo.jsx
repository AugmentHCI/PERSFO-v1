import React, { Fragment } from "react";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";

const logout = () => Meteor.logout();

const useStyles = makeStyles((theme) => ({
  menuButton: {
    marginRight: theme.spacing(2),
  },
  toolbar: {
    minHeight: 80,
    alignItems: "flex-start",
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(2),
    background: "primary",
  },
  title: {
    flexGrow: 1,
    paddingTop: theme.spacing(1),
    alignSelf: "flex-start",
    color: "white",
  },
  adherenceTitle: {
    flexGrow: 1,
    alignSelf: "flex-end",
    color: "white",
  },
}));

export const AppBarPersfo = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="secondary"
            aria-label="open drawer"
          >
            <MenuIcon />
          </IconButton>
          <Typography className={classes.title} variant="h5" noWrap>
            Keep up the great work!
          </Typography>
          <Typography className={classes.adherenceTitle} variant="h5" noWrap>
            Adherence figure
          </Typography>
          <IconButton aria-label="search" color="inherit">
            <SearchIcon color="secondary" />
          </IconButton>
          <IconButton aria-label="person" color="inherit" onClick={logout}>
            <AccountCircleIcon color="secondary" />
          </IconButton>
        </Toolbar>
      </AppBar>
    </div>
  );
};
