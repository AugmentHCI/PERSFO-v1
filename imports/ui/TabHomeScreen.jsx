import IconButton from "@material-ui/core/IconButton";
import Snackbar from "@material-ui/core/Snackbar";
import { makeStyles } from "@material-ui/core/styles";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import MuiAlert from "@material-ui/lab/Alert";
import React, { useState } from "react";
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
export const TabHomeScreen = ({ recipeURLs, courseName }) => {
  const classes = useStyles();

  const handleInfo = () => {
    setToast(true);
  };

  const [componentHeight, setComponentHeight] = useState(window.innerHeight);

  window.addEventListener("resize", () => {
    setComponentHeight(window.innerHeight);
  });

  // Info message
  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }
  const [toastShown, setToast] = useState(false);

  return (
    <>
      {componentHeight >= 640 ? (
        <div className={classes.titleContent}>
          <h1 className={classes.title}>Today's options in {courseName}</h1>
          <IconButton></IconButton>
        </div>
      ) : null}
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

      <div className={classes.titleContent}>
        <h1 className={classes.title}>TODAY'S RECOMMENDATION</h1>
        <IconButton onClick={handleInfo}>
          <HelpOutlineIcon fontSize="small" />
        </IconButton>
      </div>
      <div style={{ padding: "4px" }}>
        <CardRecommendedMeal backupRecipeId={getRecipeID(recipeURLs[0])} />
      </div>

      <Snackbar
        open={toastShown}
        autoHideDuration={6000}
        onClose={() => setToast(false)}
      >
        <Alert onClose={() => setToast(false)} severity="info">
          In this pilot study, recommendations are based on the most popular
          meals, while also considering your allergies and disliked ingredients.
        </Alert>
      </Snackbar>
    </>
  );
};
