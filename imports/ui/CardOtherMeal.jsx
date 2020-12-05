import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from "@material-ui/core/";
import { red } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/core/styles";
import FavoriteIcon from "@material-ui/icons/Favorite";
import { useTracker } from "meteor/react-meteor-data";
import React, { useState } from "react";
import { getImage, getNutriscoreImage } from "/imports/api/apiPersfo";
import {
  OpenMealDetails,
  OrdersCollection,
  RecipesCollection,
  UserPreferences,
} from "/imports/api/methods.js";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

const useStyles = makeStyles((persfoTheme) => ({
  root: {
    minWidth: "140px",
    maxWidth: "140px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    borderRadius: "20px",
  },
  cardTop: {
    width: "100%",
    display: "flex",
    textAlign: "inherit",
    flexDirection: "column",
    alignItems: "center",
  },
  menuDescription: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  menuImage: {
    width: "80px",
    height: "80px",
    borderRadius: "100px",
    marginTop: "8px",
    backgroundColor: "#fafafa",
  },
  menuTitle: {
    fontSize: "11px",
    fontWeight: 500,
    width: "100%",
    height: "40px",
    display: "flex",
    alignItems: "center",
    textTransform: "uppercase",
    letterSpacing: "0px",
    lineHeight: 1,
    textAlign: "center",
    color: "#717171",
  },
  nutriscoreImage: {
    height: "24px",
    marginBottom: "8px",
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
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
    background: "#fafafa",
  },
  cardContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-around",
    padding: "4px",
  },
}));

export const CardOtherMeal = ({ recipeId }) => {
  const classes = useStyles();

  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }
  const [toastShown, setToast] = useState(false);

  const handleIncreaseLike = () => {
    if (recipe) Meteor.call("recipes.handleLike", recipe.id);
  };
  const handleOrder = () => {
    if (recipe) {
      if (!ordered) setToast(true);
      Meteor.call("orders.handleOrder", recipe.id);
    }
  };
  const { recipe, nbLikesDummy } = useTracker(() => {
    const noDataAvailable = { recipe: {} };
    if (!Meteor.user()) {
      return noDataAvailable;
    }
    const handler = Meteor.subscribe("recipes");
    if (!handler.ready()) {
      return { ...noDataAvailable };
    }
    const recipe = RecipesCollection.find({ id: recipeId }).fetch()[0];
    const nbLikesDummy = recipe.nbLikes;
    return { recipe, nbLikesDummy };
  });

  const { liked } = useTracker(() => {
    const noDataAvailable = { liked: false };
    if (!recipe) return noDataAvailable;
    const handler = Meteor.subscribe("userpreferences");
    if (!handler.ready()) {
      return { ...noDataAvailable };
    }
    const liked =
      UserPreferences.find({
        userid: Meteor.userId(),
        likedRecipes: { $in: [recipe.id] },
      }).fetch().length > 0;
    return { liked };
  });

  const { ordered } = useTracker(() => {
    const noDataAvailable = { ordered: false };
    if (!recipe) return noDataAvailable;
    const handler = Meteor.subscribe("orders");
    if (!handler.ready()) {
      return { ...noDataAvailable };
    }

    // find only order made today
    let start = new Date();
    start.setHours(0, 0, 0, 0);
    console.log(start);
    let end = new Date();
    end.setHours(23, 59, 59, 999);
    const orders = OrdersCollection.find({
      userid: Meteor.userId(),
      recipeId: recipe.id,
      timestamp: { $gte: start, $lt: end },
    }).fetch();
    const ordered = orders.length > 0;
    console.log(orders);
    return { ordered };
  });

  const handleDetailsClick = () => {
    OpenMealDetails.set(recipeId);
  };

  return (
    <React.Fragment>
      {recipeId ? (
        <Card className={classes.root}>
          <CardActionArea
            className={classes.cardTop}
            onClick={() => handleDetailsClick()}
          >
            <CardMedia className={classes.menuImage} image={getImage(recipe)} />
            <CardContent className={classes.cardContent}>
              <Typography className={classes.menuTitle}>
                {String(recipe.name).length > 36
                  ? recipe.name.slice(0, 36) + "..."
                  : recipe.name}
              </Typography>
              <img
                className={classes.nutriscoreImage}
                src={getNutriscoreImage(recipe)}
              />
            </CardContent>
          </CardActionArea>

          <CardActions className={classes.cardActions}>
            <Button
              size="large"
              onClick={() => handleIncreaseLike()}
              color="primary"
              style={
                liked
                  ? { backgroundColor: red[100], borderRadius: "14px" }
                  : undefined
              }
            >
              <FavoriteIcon style={{ color: red[300] }} /> &nbsp;{" "}
              <span>{nbLikesDummy}</span>
            </Button>
            <Button
              size="large"
              onClick={() => handleOrder()}
              color="primary"
              style={
                ordered
                  ? { backgroundColor: red[100], borderRadius: "14px" }
                  : undefined
              }
            >
              {ordered ? "Ordered" : "Order"}
            </Button>
          </CardActions>
        </Card>
      ) : null}
      <Snackbar
        open={toastShown}
        autoHideDuration={6000}
        onClose={() => setToast(false)}
      >
        <Alert onClose={() => setToast(false)} severity="success">
          Thank you for participating today!
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
};
