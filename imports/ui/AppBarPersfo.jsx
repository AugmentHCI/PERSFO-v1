import { useTracker } from 'meteor/react-meteor-data'
import React, { useState, useEffect } from 'react';

import AppBar from "@material-ui/core/AppBar";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import MenuIcon from "@material-ui/icons/Menu";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import SearchIcon from "@material-ui/icons/Search";
import { getImage, getNutriscoreImage } from "/imports/api/apiPersfo";
import { RecipesCollection, OpenMealDetails } from '/imports/api/methods.js';

import {
  Button,
  IconButton,
  Box,
  Grid,
  Toolbar,
  Tooltip
} from "@material-ui/core/";

import { AdherenceTimeline } from "./AdherenceTimeline";
import { PersfoDrawer } from "./PersfoDrawer";
const logout = () => Meteor.logout();

const useStyles = makeStyles((theme) => ({
  backButton: {
    marginLeft: '8px',
    marginTop:  '8px',
    background: 'rgba(175,83,12,0.6)'
  },
  menuButton: {
    marginLeft: '8px'
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
  const [background, setBackground] = useState('none');

  const { GetOpenMealDetails } = useTracker(() => {
    const GetOpenMealDetails = OpenMealDetails.get();
    return { GetOpenMealDetails };
  });

  const handleDetailsClick = () => {
    OpenMealDetails.set(null);
    setBackground('none');
  }

  useEffect(() => {
    if(GetOpenMealDetails !== null ) {
      let url = "/images/orange2.jpg";
      try { url = RecipesCollection.findOne({id: GetOpenMealDetails}).main_image.full_image_url; } catch (e) { url = "/images/orange2.jpg"; }
      console.log(url); // Debugging
      setBackground('url('+url+')');
    }
  });

  return (
    // <div className={classes.rootLongTest}>
    <AppBar position="static" style={{backgroundImage: background, backgroundSize: 'cover'}}>
        { GetOpenMealDetails == null ?
        <div style={{display: 'flex', flexDirection: 'column', height: '100px'}}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
        <div style={{display: 'flex', alignItems: 'center' }} >
        <IconButton className={classes.menuButton} color="secondary" onClick={toggleDrawer(true)}><MenuIcon /></IconButton>
        <h1 className={classes.title}> Keep up the great work!</h1>
        </div>
        { Meteor.user() ? <IconButton color="inherit" onClick={logout}><ExitToAppIcon color="secondary" /></IconButton> : null }
        </div>
        <div style={{height: '48px' }}>
        <AdherenceTimeline day1="A" day2="C" day3="A" day4="D" day5="A" />
        </div>
        </div>
        :
        <div style={{display: 'flex', height: '100px', alignItems: 'flex-start' }}>
        <IconButton className={classes.backButton} color="secondary" onClick={() => handleDetailsClick()}><ArrowBackIcon /></IconButton>
        </div>
        }
      <PersfoDrawer drawerOpen={drawerOpen} toggleDrawer={toggleDrawer} />
    </AppBar>
    // </div>
  );
};
