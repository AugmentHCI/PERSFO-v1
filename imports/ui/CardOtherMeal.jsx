import { red } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/core/styles";
import FavoriteIcon from "@material-ui/icons/Favorite";
import { useTracker } from "meteor/react-meteor-data";
import React, { useState } from "react";
import { RecipesCollection } from "../db/RecipesCollection";
import { getImage, getNutriscoreImage } from "/imports/api/apiPersfo";
import {
  Card,
  CardActions,
  CardActionArea,
  CardMedia,
  CardContent,
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Paper,
  Typography
} from "@material-ui/core/";

const useStyles = makeStyles((persfoTheme) => ({
  root: {
    minWidth: '240px',
    maxWidth: '240px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  cardTop: {
    width: '100%',
    display: 'flex',
    textAlign: 'inherit',
    flexDirection: 'column',
    alignItems: 'center',
  },
  menuDescription: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  menuImage: {
    width: '100%',
    height: '100px'
  },
  menuTitle: {
    fontSize: '13px',
    fontWeight: 500,
    textAlign: 'center',
    width: '100%',
    height: '60px',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    textTransform: 'uppercase',
    letterSpacing: '0px'
  },
  nutriscoreImage: {
    height: "32px",
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
  cardActions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    background: '#fafafa'
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
  }
}));

export const CardOtherMeal = ({ recipeId }) => {
  const classes = useStyles();
  const [nbLikesDummy, increaseLike] = useState(Math.round(15 * Math.random()));
  const { recipe } = useTracker(() => {
    const noDataAvailable = { recipe: {},};
    const handler = Meteor.subscribe("recipes");
    const recipe = RecipesCollection.findOne({ id: recipeId });
    if (!Meteor.user()) { return noDataAvailable; }
    if (!handler.ready()) { return { ...noDataAvailable}; }
    return { recipe };
  });

  return (
    <React.Fragment>
      {recipeId ?
        <Card className={classes.root}>
          <CardActionArea className={classes.cardTop}>
            <CardMedia className={classes.menuImage} image={getImage(recipe)} />
            <CardContent className={classes.cardContent}>
            <Typography  className={classes.menuTitle} gutterBottom>{String(recipe.name).length > 60 ? recipe.name.slice(0, 60) + '...' : recipe.name }</Typography>
            <img className={classes.nutriscoreImage} src={getNutriscoreImage(recipe)} />
            </CardContent>
          </CardActionArea>

          <CardActions className={classes.cardActions}>
          <Button size="large" onClick={() => increaseLike(nbLikesDummy + 1)} color="primary">
            <FavoriteIcon style={{ color: red[300] }} /> &nbsp; <span>{nbLikesDummy}</span>
          </Button>
          <Button size="large" color="primary">Order</Button>
          </CardActions>
        </Card>
      : null }
    </React.Fragment>
  );
};
