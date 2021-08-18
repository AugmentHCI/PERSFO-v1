import { AppBar, IconButton } from "@material-ui/core/";
import { makeStyles } from "@material-ui/core/styles";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import MenuIcon from "@material-ui/icons/Menu";
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import { useTracker } from "meteor/react-meteor-data";
import React, { useEffect, useState } from "react";
import { AdherenceTimeline } from "./AdherenceTimeline";
import { PersfoDrawer } from "./PersfoDrawer";
import { getImage } from "/imports/api/apiPersfo";
import Badge from '@material-ui/core/Badge';
import {
  OpenFeedback, OpenMealDetails,
  OpenProgress,
  OpenSettings,
  OpenSurvey
} from "/imports/api/methods.js";
import { RecipesCollection } from '/imports/db/recipes/RecipesCollection';
import { OrdersCollection } from '/imports/db/orders/OrdersCollection';
import { OpenShoppingBasket } from "../api/methods";

// const logout = () => Meteor.logout();

const useStyles = makeStyles((theme) => ({
  backButton: {
    marginLeft: "8px",
    marginTop: "8px",
    background: "rgba(148,148,148,0.6)",
  },
  menuButton: {
    marginLeft: "8px",
  },
  shoppingButton: {
    marginLeft: "auto",
    marginRight: "12px"
  },
  title: {
    fontSize: "13px",
    fontFamily: "sans-serif",
    color: "white",
    margin: 0,
    fontWeight: 400,
    opacity: 0.8,
    alignSelf: "left",
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

  const { GetOpenMealDetails, GetOpenProgress, GetOpenSettings, GetOpenFeedback, GetOpenSurvey } = useTracker(
    () => {
      const GetOpenMealDetails = OpenMealDetails.get();
      const GetOpenProgress = OpenProgress.get();
      const GetOpenSettings = OpenSettings.get();
      const GetOpenFeedback = OpenFeedback.get();
      const GetOpenSurvey = OpenSurvey.get();
      return { GetOpenMealDetails, GetOpenProgress, GetOpenSettings, GetOpenFeedback };
    }
  );

  const { nbOrders } = useTracker(() => {
    const noDataAvailable = 0;
    const handler = Meteor.subscribe("orders");
    if (!handler.ready()) {
      return { ...noDataAvailable };
    }

    const nbOrders = OrdersCollection.find({
      userid: Meteor.userId()
    }).fetch().length;
    return { nbOrders };
  });

  document.addEventListener("backbutton", onBackKeyDown, false);

  function onBackKeyDown() {
    handleDetailsClick();
  }

  const handleDetailsClick = () => {
    OpenMealDetails.set(null);
    setBackground("none");
    Meteor.call("log", componentName, "handleDetailsClick");
  };

  const handleShoppingBasket = () => {
    OpenShoppingBasket.set(true);
    Meteor.call("log", componentName, "handleShoppingBasket");
  }

  useEffect(() => {
    if (GetOpenMealDetails !== null) {
      let url = getImage(RecipesCollection.findOne({ id: GetOpenMealDetails }));
      if (url === "/images/Image-not-found.png") {
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
    if (GetOpenFeedback) title = "Feedback";
    if (GetOpenSurvey) title = "Survey";

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
              // justifyContent: "space-between",
              marginTop: "8px",
            }}
          >
            <IconButton
              className={classes.menuButton}
              color="secondary"
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
            <h1 className={classes.title}>{switchHeader()}</h1>
            <div className={classes.shoppingButton}>
              <Badge badgeContent={nbOrders} color="secondary" onClick={handleShoppingBasket}>
                <ShoppingCartIcon color="secondary" />
              </Badge>
            </div>
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
