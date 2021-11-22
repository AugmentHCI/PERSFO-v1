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
  root: {
    height: 4,
    borderRadius: 4,
  },
  colorPrimary: {
    backgroundColor:
      theme.palette.grey[theme.palette.type === "light" ? 200 : 700],
  },
  bar: {
    borderRadius: 5,
    backgroundColor: "#F57D20",
  },
}))(LinearProgress);

// recipeURL come from menu --> courses
const componentName = "Progress";
export const Progress = ({ recommendedRecipe }) => {
  const [componentHeight, setComponentHeight] = useState(window.innerHeight);

  window.addEventListener("resize", () => {
    setComponentHeight(window.innerHeight);
  });

  const useStyles = makeStyles((persfoTheme) => ({
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
    isLoggedIn,
    GetOpenMealDetails,
    daysActive,
    orders,
    nbLikes,
    nbDislikes,
  } = useTracker(() => {
    const noDataAvailable = {
      userName: "",
      GetOpenMealDetails: undefined,
      daysActive: 0,
      orders: [],
      nbLikes: 0,
      nbDislikes: 0,
    };

    if (!Meteor.user()) {
      return noDataAvailable;
    }
    const userHandler = Meteor.subscribe("userData");
    if (!userHandler.ready()) {
      return { ...noDataAvailable, isLoading: true };
    }
    const orderHandler = Meteor.subscribe("orders");
    if (!orderHandler.ready()) {
      return { ...noDataAvailable, isLoading: true };
    }

    const recipeHandler = Meteor.subscribe("recipes");
    if (!recipeHandler.ready()) {
      return { ...noDataAvailable, isLoading: true };
    }

    const userPreferencesHandler = Meteor.subscribe("userpreferences");
    if (!userPreferencesHandler.ready()) {
      return { ...noDataAvailable, isLoading: true };
    }

    const userPreferences = UserPreferences.findOne({ userid: Meteor.userId() });
    let nbLikes = 0;
    try {
      nbLikes = userPreferences.likedRecipes.length;
    } catch (error) { }

    let nbDislikes = 0;
    try {
      nbDislikes = userPreferences.dislikedIngredients.length;
    } catch (error) { }

    let orders = OrdersCollection.find({ userid: Meteor.userId() }).fetch();
    orders = _.map(orders, (order) => {
      return RecipesCollection.findOne({ id: order.recipeId });
    });

    const daysActive =
      Math.floor((new Date() - Meteor.user().createdAt) / 86400000);
    const userName = capitalizeFirstLetter(Meteor.user().username);

    const GetOpenMealDetails = OpenMealDetails.get();
    return {
      userName,
      GetOpenMealDetails,
      isLoggedIn: !!Meteor.userId(),
      daysActive,
      orders,
      nbLikes,
      nbDislikes,
    };
  });

  if (!isLoggedIn) {
    return null;
  }

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

  if (GetOpenMealDetails !== null) {
    return (
      <MealScreen
        recipe={RecipesCollection.findOne({ id: GetOpenMealDetails })}
      />
    );
  } else {
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
          <Tab key={0} label="Weekly overview" />
          <Tab key={1} label="Goals" />
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
              Hello, <span className={classes.statNum}>{userName}</span>
            </div>
            <div className={classes.stat}>
              You created your account{" "}
              <span className={classes.statNum}>{"" + daysActive}</span> days
              ago.
            </div>
            <div className={classes.stat}>
              Since you started using this app, you ordered{" "}
              <span className={classes.statNum}>{orders.length}</span> meals. Which add up to{" "}
              <span className={classes.statNum}>
                {_.sumBy(orders, (o) => calculateNutrientforRecipe(o, "kcal"))
                  ? _.sumBy(orders, (o) =>
                    calculateNutrientforRecipe(o, "kcal")
                  )
                  : 0}
              </span>{" "}
              kcal in total.
            </div>
            <div className={classes.stat}>
              You liked <span className={classes.statNum}>{nbLikes}</span>{" "}meals
              and disliked <span className={classes.statNum}>{nbDislikes}</span>{" "}
              ingredients.
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
              Feature expected in the larger user study. Please continue logging
              to help us optimize this feature.
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
  }
};
