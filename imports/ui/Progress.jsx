import { IconButton, LinearProgress, Tab, Tabs } from "@material-ui/core/";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import { useTracker } from "meteor/react-meteor-data";
import React, { useState } from "react";
import { CardRecommendedMeal } from "./CardRecommededMeal";
import { MealScreen } from "./MealScreen";
import { OpenMealDetails, RecipesCollection } from "/imports/api/methods.js";

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
    height: "200px",
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

// recipeURL come from menu --> courses
const componentName = "Progress";
export const Progress = ({ recipeURLs }) => {
  const classes = useStyles();
  const [tabValue, setTabValue] = useState(0);

  const { userName, isLoggedIn, GetOpenMealDetails, daysActive } = useTracker(
    () => {
      const noDataAvailable = {
        userName: "",
        GetOpenMealDetails: undefined,
        daysActive: 0,
      };

      if (!Meteor.user()) {
        return noDataAvailable;
      }
      const userHandler = Meteor.subscribe("userData");
      if (!userHandler.ready()) {
        return { ...noDataAvailable, isLoading: true };
      }

      const daysActive = Math.floor(( new Date() - Meteor.user().createdAt ) / 86400000);
      const userName = Meteor.user().username;

      const GetOpenMealDetails = OpenMealDetails.get();
      return {
        userName,
        GetOpenMealDetails,
        isLoggedIn: !!Meteor.userId(),
        daysActive,
      };
    }
  );

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
              justifyContent: "start",
            }}
          >
            <div className={classes.stat}>
              Hello,{" "}
              <span className={classes.statNum}>{userName}</span>
            </div>
            <div className={classes.stat}>
              You are now using this pilot app for{" "}
              <span className={classes.statNum}>{"" + daysActive}</span> days. Please
              keep using the app before we can create an weekly overview.
            </div>
            {/* <div className={classes.stat}>
              Last week you ordered <span className={classes.statNum}>3</span>{" "}
              Nutriscore <span className={classes.statNum}>A</span> meals
            </div>
            <div className={classes.statTitle}>Doing so you:</div>
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
              justifyContent: "space-around",
            }}
          >
            <GoalsBar
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
            />
          </div>
        )}

        <div>
          <div className={classes.titleContent}>
            <h1 className={classes.menuTitle}>TODAY'S RECOMMENDATION</h1>
          </div>
          <div style={{ padding: "4px" }}>
            <CardRecommendedMeal />
          </div>
        </div>
      </div>
    );
  }
};
