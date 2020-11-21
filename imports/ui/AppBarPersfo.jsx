import AppBar from "@material-ui/core/AppBar";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import { AdherenceTimeline } from "./AdherenceTimeline";

import React, { useState } from "react";

import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import HomeIcon from "@material-ui/icons/Home";
import clsx from "clsx";
import AssessmentIcon from "@material-ui/icons/Assessment";
import SettingsIcon from "@material-ui/icons/Settings";
import { Divider } from "@material-ui/core";

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
  list: {
    width: 250,
  },
  fullList: {
    width: "auto",
  },
}));

export const AppBarPersfo = () => {
  const classes = useStyles();

  const [drawerOpen, setState] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState(open);
  };

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
              <Typography className={classes.title} variant="h5" noWrap>
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
            <IconButton aria-label="person" color="inherit" onClick={logout}>
              <AccountCircleIcon color="secondary" />
            </IconButton>
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
      <SwipeableDrawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
      >
        <Box>
          <img className={classes.list} src="/images/logo.png" />
        </Box>
        <Divider />
        <div
          className={classes.list}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List>
            <ListItem button key={"home"} onClick={() => console.log("home")}>
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary={"Home"} />
            </ListItem>
            <ListItem
              button
              key={"progress"}
              onClick={() => console.log("progress")}
            >
              <ListItemIcon>
                <AssessmentIcon />
              </ListItemIcon>
              <ListItemText primary={"Progress"} />
            </ListItem>
            <ListItem
              button
              key={"settings"}
              onClick={() => console.log("settings")}
            >
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary={"Settings"} />
            </ListItem>
          </List>
        </div>
        {/* {list("left")} */}
      </SwipeableDrawer>
    </AppBar>
    // </div>
  );
};
