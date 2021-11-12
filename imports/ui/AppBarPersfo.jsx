import { AppBar, IconButton } from "@material-ui/core/";
import Badge from '@material-ui/core/Badge';
import { makeStyles } from "@material-ui/core/styles";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import MenuIcon from "@material-ui/icons/Menu";
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import { useTracker } from "meteor/react-meteor-data";
import React, { useEffect, useState } from "react";
import { AdherenceTimeline } from "./AdherenceTimeline";
import { PersfoDrawer } from "./PersfoDrawer";
import { ShoppingBasket } from "./ShoppingBasket";
import { getImage } from "/imports/api/apiPersfo";
import {
  OpenFeedback, OpenMealDetails,
  OpenProgress,
  OpenSettings
} from "/imports/api/methods.js";
import { OrdersCollection } from '/imports/db/orders/OrdersCollection';
import { RecipesCollection } from '/imports/db/recipes/RecipesCollection';
import { UserPreferences } from '/imports/db/userPreferences/UserPreferences';
import i18n from 'meteor/universe:i18n';

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
    marginRight: "30px"
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
  initTitle: {
    fontSize: "15px",
    fontFamily: "sans-serif",
    color: "white",
    margin: 10,
    fontWeight: 400,
    opacity: 0.8,
    // alignSelf: "left",
  },
}));

const componentName = "AppBarPersfo";
export const AppBarPersfo = ({ drawerOpen, toggleDrawer, shoppingBasketdrawerOpen, toggleShoppingBasketDrawer }) => {
  const classes = useStyles();

  const user = useTracker(() => Meteor.user());

  const [background, setBackground] = useState("none");

  const { GetOpenMealDetails, GetOpenProgress, GetOpenSettings, GetOpenFeedback } = useTracker(
    () => {
      const GetOpenMealDetails = OpenMealDetails.get();
      const GetOpenProgress = OpenProgress.get();
      const GetOpenSettings = OpenSettings.get();
      const GetOpenFeedback = OpenFeedback.get();
      return { GetOpenMealDetails, GetOpenProgress, GetOpenSettings, GetOpenFeedback };
    }
  );

  const { nbOrders, doneForToday, icfFinished, surveyFinished } = useTracker(() => {
    const noDataAvailable = { nbOrders: 0, doneForToday: false, onboardingFinished: true, surveyFinished: true };
    const handler = Meteor.subscribe("orders");
    const preferencesHandler = Meteor.subscribe("userpreferences");
    const orderHandler = Meteor.subscribe("orders");

    if (!handler.ready()) {
      return { ...noDataAvailable };
    }

    if (!preferencesHandler.ready()) {
      return { ...noDataAvailable, isLoading: true };
    }

    if (!orderHandler.ready()) {
      return { ...noDataAvailable, isLoading: true };
    }

    // find only orders made today
    const now = new Date();
    const nowString = now.toISOString().substring(0, 10);

    const nbOrders = OrdersCollection.find({
      userid: Meteor.userId(),
      orderday: nowString,
    }).fetch().length;

    let randomConfirmedOrder = OrdersCollection.findOne({ orderday: nowString, confirmed: true });
    const doneForToday = randomConfirmedOrder !== undefined;

    const userPreferences = UserPreferences.findOne({ userid: Meteor.userId() });
    const icfFinished = userPreferences?.icfFinished;
    const surveyFinished = userPreferences?.survey;

    return { nbOrders, doneForToday, icfFinished, surveyFinished };
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
    if (!user) return i18n.__("AppBarPersfo.welcome");
    if (GetOpenMealDetails !== null) return ""; // no title, meal image is displayed

    if (!icfFinished) return i18n.__("AppBarPersfo.icf");
    if (!surveyFinished) return i18n.__("AppBarPersfo.survey");

    // menu item header titles
    if (GetOpenProgress) return i18n.__("AppBarPersfo.progress");
    if (GetOpenSettings) return i18n.__("AppBarPersfo.settings");
    if (GetOpenFeedback) return i18n.__("AppBarPersfo.feedback");

    // last step, user could be finished
    if (doneForToday) return i18n.__("AppBarPersfo.thanks");

    return i18n.__("AppBarPersfo.title");
  };

  return (
    <AppBar
      position="static"
      style={{
        backgroundImage: background, backgroundSize: "cover", backgroundPosition: 'center center',
        '&:before': {
          position: 'absolute',
          width: '100%',
          height: '100%',
          content: '""',
          display: 'block',
          background: '#000',
          opacity: '0.6'
        }
      }}
    >
      {
        (() => {
          if (user && GetOpenMealDetails == null && icfFinished && surveyFinished) {
            return (
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
                    {!doneForToday ?
                      <Badge badgeContent={nbOrders} color="secondary" onClick={toggleShoppingBasketDrawer(true)}>
                        <ShoppingCartIcon color="secondary" />
                      </Badge>
                      :
                      <></>}
                  </div>
                </div>
                <div style={{ height: "48px" }}>
                  <AdherenceTimeline />
                </div>
              </div>
            )
          } else if (user && icfFinished && surveyFinished) {
            return (
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
            )
          } else {
            return (
              <div
                style={{ display: "flex", height: "50px", alignItems: "flex-start" }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    // justifyContent: "space-between",
                    marginTop: "8px",
                  }}
                >
                  <h1 className={classes.initTitle}>{switchHeader()}</h1>
                </div>
              </div>
            )
          }
        })()
      }
      < PersfoDrawer drawerOpen={drawerOpen} toggleDrawer={toggleDrawer} />
      <ShoppingBasket drawerOpen={shoppingBasketdrawerOpen} toggleDrawer={toggleShoppingBasketDrawer} />
    </AppBar>
  );
};
