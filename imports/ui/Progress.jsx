import { LinearProgress, Tab, Tabs } from "@material-ui/core/";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { useTracker } from "meteor/react-meteor-data";
import React, { useState } from "react";
import { RecipeComponent } from "./RecipeComponent";
import { MealScreen } from "./MealScreen";
import { calculateNutrientforRecipe } from "/imports/api/apiPersfo";
import { capitalizeFirstLetter } from "/imports/api/auxMethods";
import { OpenMealDetails } from "/imports/api/methods.js";
import { OrdersCollection } from '/imports/db/orders/OrdersCollection';
import { RecipesCollection } from '/imports/db/recipes/RecipesCollection';
import { UserPreferences } from '/imports/db/userPreferences/UserPreferences';

const BorderLinearProgress = withStyles((theme) => ({
  colorPrimary: {
    backgroundColor:
      theme.palette.grey[theme.palette.type === "light" ? 200 : 700],
  }
}))(LinearProgress);

// recipeURL come from menu --> courses
const componentName = "Progress";
export const Progress = ({ recommendedRecipe }) => {
  const [componentHeight, setComponentHeight] = useState(window.innerHeight);

  const useStyles = makeStyles(() => ({
    menuTitle: {
      color: "#726f6c",
      margin: "4px",
      fontSize: "13px",
      fontFamily: "Roboto",
      fontWeight: 600,
    },
    titleContent: {
      height: "40px",
      display: "flex",
      alignItems: "center",
    },
    mainContent: {
      background: "white",
      borderRadius: "25px",
      padding: "16px",
      borderRadius: "30px 0px 0px 30px",
      height: componentHeight >= 640 ? "200px" : "120px",
      marginLeft: "16px",
      color: "#717171",
      fontFamily: "sans-serif",
    },
    stat: {
      fontSize: "13px",
    },
    statTitle: {
      color: "#726f6c",
      fontSize: "13px",
      fontFamily: "Roboto",
      fontWeight: 600,
    },
    statNum: {
      color: "#F57D20",
      fontWeight: 600,
      fontSize: "14px",
    },
  }));

  const classes = useStyles();
  const [tabValue, setTabValue] = useState(0);

  const {
    userName,
    daysActive,
    orders,
    nbLikes,
    nbDislikes,
  } = useTracker(() => {
    const noDataAvailable = {
      userName: "",
      daysActive: 0,
      orders: [],
      nbLikes: 0,
      nbDislikes: 0,
    };

    const userHandler = Meteor.subscribe("userData");
    const orderHandler = Meteor.subscribe("orders");
    const recipeHandler = Meteor.subscribe("recipes");
    const userPreferencesHandler = Meteor.subscribe("userpreferences");


    if (!Meteor.user() || !userHandler.ready() || !orderHandler.ready() || !recipeHandler.ready() || !userPreferencesHandler.ready()) {
      return { ...noDataAvailable, isLoading: true };
    }

    const userPreferences = UserPreferences.findOne({ userid: Meteor.userId() });
    let nbLikes = 0;
    try {
      nbLikes = userPreferences.likedRecipes.length;
    } catch (error) {
      console.log("Progress: unexpected error at nblikes")
    }

    let nbDislikes = 0;
    try {
      nbDislikes = userPreferences.dislikedIngredients.length;
    } catch (error) {
      console.log("Progress: unexpected error at nbDislikes")
      console.log(error);
    }

    let orders = OrdersCollection.find({ userid: Meteor.userId() }).fetch();
    orders = _.map(orders, (order) => {
      return RecipesCollection.findOne({ id: order.recipeId });
    });

    const daysActive = Math.floor((new Date() - Meteor.user().createdAt) / 86400000);
    const userName = capitalizeFirstLetter(Meteor.user().username);

    return {
      userName,
      daysActive,
      orders,
      nbLikes,
      nbDislikes,
    };
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    Meteor.call("log", componentName, "handleTabChange");
  };

  const GoalsBar = (props) => {
    let maxValue = props.maxValue;
    if (props.value >= props.maxValue) {
      maxValue = props.value;
    }
    const normalise = ((props.value - 0) * 100) / (maxValue - 0);
    return (
      <div style={{ padding: "4px", marginBottom: "8px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "2px",
          }}
        >
          <div style={{ color: "#717171", fontSize: "12px" }}>
            {props.title}
          </div>
          <div style={{ color: "#717171", fontSize: "12px" }}>
            {props.value.toLocaleString()}/
            <span style={{ color: "#F57D20" }}>
              {maxValue.toLocaleString()}
            </span>
            &nbsp;{String(props.unit)}
          </div>
        </div>
        <BorderLinearProgress variant="determinate" value={normalise} />
      </div>
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", rowGap: "16px" }}>
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
        scrollButtons="auto"
        centered={true}
      >
        <Tab key={0} label={i18n.__("progress.weekly_overview")} />
        <Tab key={1} label={i18n.__("progress.goals")} />
      </Tabs>

      {tabValue == 0 ? (
        <div
          className={classes.mainContent}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div className={classes.stat}>
            {i18n.__("progress.hello")}, <span className={classes.statNum}>{userName}</span>
          </div>
          <div className={classes.stat}>
            {i18n.__("progress.creation1")}
            <span className={classes.statNum}>{" " + daysActive}</span> {i18n.__("progress.creation2")}
          </div>
          <div className={classes.stat}>
            {i18n.__("progress.using1")}{" "}
            <span className={classes.statNum}>{orders.length}</span> {i18n.__("progress.using2")}{" "}
            <span className={classes.statNum}>
              {_.sumBy(orders, (o) => calculateNutrientforRecipe(o, "kcal"))
                ? _.sumBy(orders, (o) =>
                  calculateNutrientforRecipe(o, "kcal")
                )
                : 0}
            </span>{" "}
            kcal.
          </div>
          <div className={classes.stat}>
            {i18n.__("progress.liked1")}{" "}<span className={classes.statNum}>{nbLikes}</span>
            {" "}{i18n.__("progress.liked2")}{" "}<span className={classes.statNum}>{nbDislikes}</span>{" "}
            {i18n.__("progress.liked3")}
          </div>
          {/*<div className={classes.statTitle}>Doing so you:</div>
            <div className={classes.stat}>
              ate <span className={classes.statNum}>25%</span> less fat
            </div>
            <div className={classes.stat}>had more varied meals</div>
            <div className={classes.stat}>
              ate <span className={classes.statNum}>10%</span> more vegetables
            </div>
            <div className={classes.stat}>
              reduced the chance of high blood preassure
            </div>
            <div className={classes.stat}>
              reduced your carbon footprint with{" "}
              <span className={classes.statNum}>7%</span>
            </div> */}
        </div>
      ) : (
        <div
          className={classes.mainContent}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "start",
          }}
        >
          <div className={classes.stat}>
            {i18n.__("progress.wip")}
          </div>
          {/* <GoalsBar
              title="Eat less calories"
              value={1200}
              maxValue={2500}
              unit={"kcal"}
            />
            <GoalsBar
              title="Eat more fruit"
              value={10}
              maxValue={15}
              unit={"pieces"}
            />
            <GoalsBar
              title="Track my meals everyday"
              value={6}
              maxValue={7}
              unit={"days"}
            /> */}
        </div>
      )}

      <div>
        <div className={classes.titleContent}>
          <h1 className={classes.menuTitle}>TODAY'S RECOMMENDATION</h1>
        </div>
        <div style={{ padding: "4px" }}>
          <RecipeComponent
            recipeId={recommendedRecipe.id}
            type="recommended"
          ></RecipeComponent>
        </div>
      </div>
    </div>
  );
};
