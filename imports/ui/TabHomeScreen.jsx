import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import React from "react";
import { CardOtherMeal } from "./CardOtherMeal";
import { CardRecommendedMeal } from "./CardRecommededMeal";
import { getRecipeID } from "/imports/api/apiPersfo";

const useStyles = makeStyles((persfoTheme) => ({
  titleContent: {
    display: "flex",
    alignItems: "center",
    height: "40px",
  },
  title: {
    fontSize: "13px",
    fontWeight: 600,
    fontFamily: "Roboto",
    margin: "4px",
    color: "#726f6c",
  },
  info: {
    position: "relative",
    top: persfoTheme.spacing(0.5),
    left: persfoTheme.spacing(1),
  },
  otherMeals: {
    display: "flex",
    overflowX: "scroll",
    columnGap: "16px",
    padding: "4px",
  },
}));

// recipeURL come from menu --> courses
const componentName = "TabHomeScreen";
export const TabHomeScreen = ({ recipeURLs }) => {
  const classes = useStyles();

  return (
    <>
      <div className={classes.titleContent}>
        <h1 className={classes.title}>RECOMMENDED</h1>
        <IconButton>
          <HelpOutlineIcon fontSize="small" />
        </IconButton>
      </div>

      <div style={{ padding: "4px" }}>
        <CardRecommendedMeal backupRecipeId={getRecipeID(recipeURLs[0])} />
      </div>
      <div className={classes.titleContent}>
        <h1 className={classes.title}>OTHER</h1>
        <IconButton></IconButton>
      </div>

      <div className={classes.otherMeals}>
        {_.map(recipeURLs, function (recipe, i) {
          return (
            <CardOtherMeal
              recipeId={getRecipeID(recipeURLs[i])}
              key={getRecipeID(recipeURLs[i])}
            ></CardOtherMeal>
          );
        })}
      </div>
    </>
  );
};
