import { useTracker } from 'meteor/react-meteor-data'
import React, { useState, useEffect } from 'react';

import { makeStyles } from "@material-ui/core/styles";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import MenuIcon from "@material-ui/icons/Menu";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import SearchIcon from "@material-ui/icons/Search";

import { getImage, getNutriscoreImage } from "/imports/api/apiPersfo";
import { RecipesCollection, OpenMealDetails, OpenProgress, OpenSettings } from '/imports/api/methods.js';

import { IconButton, AppBar } from "@material-ui/core/";
import { AdherenceTimeline } from "./AdherenceTimeline";
import { PersfoDrawer }      from "./PersfoDrawer";
const logout = () => Meteor.logout();

const useStyles = makeStyles((theme) => ({
  backButton: {
    marginLeft: '8px',
    marginTop:  '8px',
    background: 'rgba(148,148,148,0.6)'
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

  const { GetOpenMealDetails, GetOpenProgress, GetOpenSettings } = useTracker(() => {
    const GetOpenMealDetails = OpenMealDetails.get();
    const GetOpenProgress = OpenProgress.get();
    const GetOpenSettings = OpenSettings.get();
    return { GetOpenMealDetails, GetOpenProgress, GetOpenSettings};
  });

  const handleDetailsClick = () => {
    OpenMealDetails.set(null);
    setBackground('none');
  }

  useEffect(() => {
    if(GetOpenMealDetails !== null ) {
      let url = getImage(RecipesCollection.findOne({id: GetOpenMealDetails}));
      console.log(url);
      setBackground('url('+url+')');
    }
  });

  const switchHeader = () => {
    let title = 'Keep up the great work!';
    if(GetOpenMealDetails !== null) title = '';
    if(GetOpenProgress) title = 'Progress';
    if(GetOpenSettings) title = 'Settings';
    return title;
  }

  return (
    // <div className={classes.rootLongTest}>
    <AppBar position="static" style={{backgroundImage: background, backgroundSize: '120% 150%'}}>
        { GetOpenMealDetails == null ?
        <div style={{display: 'flex', flexDirection: 'column', height: '100px'}}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
        <div style={{display: 'flex', alignItems: 'center' }} >
        <IconButton className={classes.menuButton} color="secondary" onClick={toggleDrawer(true)}><MenuIcon /></IconButton>
        <h1 className={classes.title}>{switchHeader()}</h1>
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
