import AppBar from "@material-ui/core/AppBar";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import Tooltip from '@material-ui/core/Tooltip';

import { AdherenceTimeline } from "./AdherenceTimeline";

import React, { useState } from "react";

import { PersfoDrawer } from "./PersfoDrawer";

const logout = () => Meteor.logout();

const useStyles = makeStyles((theme) => ({
  root: {
    // borderRadius: "30px 0px 0px 30px",
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  toolbar: {
    minHeight: 50,
    alignItems: "flex-start",
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(2),
    background: "primary",
    borderRadius: "50px",
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

export const AppBarPersfo = ({drawerOpen, toggleDrawer}) => {
  const classes = useStyles();

  return (
    // <div className={classes.rootLongTest}>
    <AppBar position="static">
      <Toolbar className={classes.toolbar2}>
        <Grid container spacing={3}>
          <Grid item xs={1}>
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="secondary"
              aria-label="open drawer"
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
          </Grid>

          <Grid item xs={8}>
            <Box>
              <Typography className={classes.title} variant="h6" noWrap>
                Keep up the great work!
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={1}>
            <IconButton aria-label="search" color="inherit">
              <SearchIcon color="secondary" />
            </IconButton>
          </Grid>

          <Grid item xs={1}>

          { Meteor.user() ?
            <Tooltip title="Logout" aria-label="Logout">
              <IconButton aria-label="person" color="inherit" onClick={logout}>
                <ExitToAppIcon color="secondary" />
              </IconButton>
            </Tooltip>
          : null }

          </Grid>
          <Grid item xs={12}>
            <AdherenceTimeline
              day1="A"
              day2="C"
              day3="A"
              day4="D"
              day5="A"
            ></AdherenceTimeline>
          </Grid>
        </Grid>
      </Toolbar>
      <PersfoDrawer drawerOpen={drawerOpen} toggleDrawer={toggleDrawer} />
    </AppBar>
    // </div>
  );
};
