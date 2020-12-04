import Box from "@material-ui/core/Box";
import { grey } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/core/styles";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import React from "react";
import { CardOtherMeal } from "./CardOtherMeal";
import { CardRecommendedMeal } from "./CardRecommededMeal";
import IconButton from "@material-ui/core/IconButton"

const useStyles = makeStyles((persfoTheme) => ({
  titleContent: {
    display: 'flex',
    alignItems: 'center',
    height: '40px'
  },
  title: {
    fontSize: '13px',
    fontWeight: 600,
    fontFamily: 'Roboto',
    margin: '4px',
    color: '#726f6c'
  },
  info: {
    position: "relative",
    top: persfoTheme.spacing(0.5),
    left: persfoTheme.spacing(1),
  },
  otherMeals: {
    display: "flex",
    overflowX: "scroll",
    columnGap: '16px',
    padding: '4px'
  },
}));

const getRecipeID = (recipeURL) => {
  if (recipeURL) {
    let splittedURL = recipeURL.split("/");
    return splittedURL[splittedURL.length - 2];
  }
}

// recipeURL come from menu --> courses
export const TabHomeScreen = ({ recipeURLs }) => {
  const classes = useStyles();

  return (
    <React.Fragment>
      <div className={classes.titleContent}>
      <h1  className={classes.title}>RECOMMENDED</h1><IconButton><HelpOutlineIcon fontSize="small" /></IconButton>
      </div>

      <div style={{ padding: '4px'}}>
      <CardRecommendedMeal recipeId={getRecipeID(recipeURLs[0])} />
      </div>
      <div className={classes.titleContent}>
      <h1  className={classes.title}>OTHER</h1><IconButton></IconButton>
      </div>

      <div className={classes.otherMeals}>
      {
        _.map(recipeURLs, function(recipe,i){
           return <CardOtherMeal recipeId={getRecipeID(recipeURLs[i])} key={getRecipeID(recipeURLs[i])}></CardOtherMeal>
        })
      }
      </div>
    </React.Fragment>
  );
};
