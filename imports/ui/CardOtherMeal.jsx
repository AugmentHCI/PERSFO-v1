import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Paper,
  Typography
} from "@material-ui/core/";
import { red } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/core/styles";
import FavoriteIcon from "@material-ui/icons/Favorite";
import { useTracker } from "meteor/react-meteor-data";
import React, { useState } from "react";
import { RecipesCollection } from "../db/RecipesCollection";
import { getImage, getNutriscoreImage } from "/imports/api/apiPersfo";

const useStyles = makeStyles((persfoTheme) => ({
  root: {
    height: "100%",
  },
  main: {
    display: "flex",
    position: "relative",
    borderRadius: "30px 30px 20px 20px",
    minWidth: "140px",
    width: "140px",
    height: "80%",
    textAlign: "center",
    zIndex: 1100,
    marginRight: persfoTheme.spacing(1),
  },
  menuImage: {
    marginTop: persfoTheme.spacing(2),
    width: persfoTheme.spacing(8),
    height: persfoTheme.spacing(8),
    margin: "auto",
  },
  menuTitle: {
    margin: persfoTheme.spacing(1),
  },
  nutriscoreImage: {
    width: "54px",
    height: "20px",
  },
  nutriscoreLabel: {
    position: "absolute",
    bottom: "5px",
    left: "50%",
    marginLeft: "-27px",
  },
  heartButton: {
    marginRight: persfoTheme.spacing(0.5),
  },
  otherLowerButtons: {
    textAlign: "center",
    marginTop: "-1px",
  },
  otherLowerButton: {
    background: "#F6EBE4",
  },
}));

export const CardOtherMeal = ({ recipeId }) => {
  const classes = useStyles();

  const [nbLikesDummy, increaseLike] = useState(Math.round(15 * Math.random()));

  const { recipe } = useTracker(() => {
    const noDataAvailable = {
      recipe: {},
    };
    if (!Meteor.user()) {
      return noDataAvailable;
    }
    const handler = Meteor.subscribe("recipes");

    if (!handler.ready()) {
      return { ...noDataAvailable};
    }

    const recipe = RecipesCollection.find({ id: recipeId }).fetch()[0];

    return { recipe };
  });

  return (
    <div className="main">
      {recipeId ? (
        <Box className={classes.root}>
          <Paper className={classes.main}>
            <Box>
              <Avatar
                aria-label="recipe"
                className={classes.menuImage}
                src={getImage(recipe)}
              />
              <Typography className={classes.menuTitle} variant="h5">
                {recipe.name}
              </Typography>
              <Box className={classes.nutriscoreLabel}>
                <img
                  className={classes.nutriscoreImage}
                  src={getNutriscoreImage(recipe)}
                ></img>
              </Box>
            </Box>
          </Paper>
          <Box className={classes.otherLowerButtons}>
            <ButtonGroup
              size="small"
              color="primary"
              aria-label="large outlined primary button group"
              className={classes.otherLowerButtons}
              style={{ Index: 1 }}
            >
              <Button onClick={() => increaseLike(nbLikesDummy + 1)}>
                <FavoriteIcon
                  className={classes.heartButton}
                  style={{ color: red[300] }}
                ></FavoriteIcon>{" "}
                {nbLikesDummy}
              </Button>
              <Button>Order</Button>
            </ButtonGroup>
          </Box>
        </Box>
      ) : (
        <div></div>
      )}
    </div>
  );
};
