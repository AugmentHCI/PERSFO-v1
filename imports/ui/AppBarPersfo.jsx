import { AppBar, IconButton } from "@material-ui/core/";
import { makeStyles } from "@material-ui/core/styles";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import MenuIcon from "@material-ui/icons/Menu";
import { useTracker } from "meteor/react-meteor-data";
import React, { useEffect, useState } from "react";
import { AdherenceTimeline } from "./AdherenceTimeline";
import { PersfoDrawer } from "./PersfoDrawer";
import { getImage } from "/imports/api/apiPersfo";
import {
  OpenMealDetails,
  OpenProgress,
  OpenSettings,
  RecipesCollection,
} from "/imports/api/methods.js";

const logout = () => Meteor.logout();

const useStyles = makeStyles((theme) => ({
  backButton: {
    marginLeft: "8px",
    marginTop: "8px",
    background: "rgba(148,148,148,0.6)",
  },
  menuButton: {
    marginLeft: "8px",
  },
  title: {
    fontSize: "13px",
    fontFamily: "sans-serif",
    color: "white",
    margin: 0,
    fontWeight: 400,
    opacity: 0.8,
  },
  adherenceTitle: {
    flexGrow: 1,
    alignSelf: "flex-end",
    color: "white",
  },
}));

const componentName = "AppBarPersfo";
export const AppBarPersfo = ({ drawerOpen, toggleDrawer }) => {
  const classes = useStyles();

  const [background, setBackground] = useState("none");

  const { GetOpenMealDetails, GetOpenProgress, GetOpenSettings } = useTracker(
    () => {
      const GetOpenMealDetails = OpenMealDetails.get();
      const GetOpenProgress = OpenProgress.get();
      const GetOpenSettings = OpenSettings.get();
      return { GetOpenMealDetails, GetOpenProgress, GetOpenSettings };
    }
  );

  const handleDetailsClick = () => {
    OpenMealDetails.set(null);
    setBackground("none");
    Meteor.call("log",componentName, "handleDetailsClick");
  };

  useEffect(() => {
    if (GetOpenMealDetails !== null) {
      let url = getImage(RecipesCollection.findOne({ id: GetOpenMealDetails }));
      if(url === "/images/Image-not-found.png") {
        url = undefined;
      }
      setBackground("url('" + url + "')");
    }
  });

  const switchHeader = () => {
    let title = "Your meals from the last five days";
    if (GetOpenMealDetails !== null) title = "";
    if (GetOpenProgress) title = "Progress";
    if (GetOpenSettings) title = "Settings";
    return title;
  };

  return (
    <AppBar
      position="static"
      style={{ backgroundImage: background, backgroundSize: "120% 150%" }}
    >
      {GetOpenMealDetails == null ? (
        <div
          style={{ display: "flex", flexDirection: "column", height: "100px" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "8px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <IconButton
                className={classes.menuButton}
                color="secondary"
                onClick={toggleDrawer(true)}
              >
                <MenuIcon />
              </IconButton>
              <h1 className={classes.title}>{switchHeader()}</h1>
            </div>
            {Meteor.user() ? (
              <IconButton color="inherit" onClick={logout}>
                <ExitToAppIcon color="secondary" />
              </IconButton>
            ) : null}
          </div>
          <div style={{ height: "48px" }}>
            <AdherenceTimeline />
          </div>
        </div>
      ) : (
        <div
          style={{ display: "flex", height: "100px", alignItems: "flex-start" }}
        >
          <IconButton
            className={classes.backButton}
            color="secondary"
            onClick={() => handleDetailsClick()}
          >
            <ArrowBackIcon />
          </IconButton>
        </div>
      )}
      <PersfoDrawer drawerOpen={drawerOpen} toggleDrawer={toggleDrawer} />
    </AppBar>
  );
};
