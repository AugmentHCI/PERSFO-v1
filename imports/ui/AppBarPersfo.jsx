import AppBar from "@material-ui/core/AppBar";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";

import {
  Button,
  IconButton,
  Box,
  Grid,
  Toolbar,
  Tooltip
} from "@material-ui/core/";

import React, { useState } from "react";
import { AdherenceTimeline } from "./AdherenceTimeline";
import { PersfoDrawer } from "./PersfoDrawer";
const logout = () => Meteor.logout();

const useStyles = makeStyles((theme) => ({
  root: {
    // borderRadius: "30px 0px 0px 30px",
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
    fontSize: '13px',
    fontFamily: 'sans-serif',
    color: "white",
    margin: 0,
    fontWeight: 400,
    opacity: 0.8
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
      <div style={{display: 'flex', flexDirection: 'column'}}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
        <div style={{display: 'flex', alignItems: 'center' }} >
        <Button edge="start" className={classes.menuButton} color="secondary" onClick={toggleDrawer(true)} startIcon={<MenuIcon />}></Button>
        <h1 className={classes.title}> Keep up the great work!</h1>
        </div>
        { Meteor.user() ? <Button color="inherit" onClick={logout} startIcon={<ExitToAppIcon color="secondary" />}></Button> : null }
        </div>
        <div style={{height: '48px', marginTop: '16px'}}>
        <AdherenceTimeline day1="A" day2="C" day3="A" day4="D" day5="A" />
        </div>
      </div>
      <PersfoDrawer drawerOpen={drawerOpen} toggleDrawer={toggleDrawer} />
    </AppBar>
    // </div>
  );
};
