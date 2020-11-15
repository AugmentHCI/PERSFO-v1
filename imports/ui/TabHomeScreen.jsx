import Box from "@material-ui/core/Box";
import { grey } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import React from "react";
import { CardOtherMeal } from "./CardOtherMeal";
import { CardRecommendedMeal } from "./CardRecommededMeal";

const useStyles = makeStyles((persfoTheme) => ({
  headerTitle: {
    margin: persfoTheme.spacing(1),
  },
  info: {
    position: "relative",
    top: persfoTheme.spacing(0.5),
    left: persfoTheme.spacing(1),
  },
  otherMeals: {
    display: "flex",
    overflowX: "auto",
    height: Math.min(400, window.innerHeight - 360) + "px",
    margin: persfoTheme.spacing(1),
  },
}));

function getRecipeID(recipeURL) {
  if (recipeURL) {
    let splittedURL = recipeURL.split("/");
    return splittedURL[splittedURL.length - 2];
  }
}

// recipeURL come from menu --> courses
export const TabHomeScreen = ({ recipeURLs }) => {
  const classes = useStyles();

  return (
    <>
      <Typography variant="h6" className={classes.headerTitle}>
        RECOMMENDED
        <HelpOutlineIcon
          className={classes.info}
          style={{ color: grey[500] }}
        />
      </Typography>

      <CardRecommendedMeal
        recipeId={getRecipeID(recipeURLs[0])}
      ></CardRecommendedMeal>

      <Box m={4}></Box>

      <Typography className={classes.headerTitle} variant="h6">
        OTHER
      </Typography>

      <Box className={classes.otherMeals}>
        <CardOtherMeal></CardOtherMeal>
        <CardOtherMeal></CardOtherMeal>
        <CardOtherMeal></CardOtherMeal>
        <CardOtherMeal></CardOtherMeal>
        <CardOtherMeal></CardOtherMeal>
      </Box>
    </>
  );
};
