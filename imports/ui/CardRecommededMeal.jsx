import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  FormControlLabel,
  IconButton,
  Typography,
} from "@material-ui/core/";
import Checkbox from "@material-ui/core/Checkbox";
import { red } from "@material-ui/core/colors";
import Modal from "@material-ui/core/Modal";
import Snackbar from "@material-ui/core/Snackbar";
import { makeStyles } from "@material-ui/core/styles";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import MuiAlert from "@material-ui/lab/Alert";
import { useTracker } from "meteor/react-meteor-data";
import React, { useState } from "react";
import { getImage, getNutriscoreImage } from "/imports/api/apiPersfo";
import {
  OpenMealDetails,
  OrdersCollection,
  RecipesCollection,
  RecommendedRecipes,
  UserPreferences,
} from "/imports/api/methods.js";

const useStyles = makeStyles(() => ({
  menuImage: {
    minWidth: "80px",
    minHeight: "80px",
    borderRadius: "100px",
    marginLeft: "8px",
    backgroundColor: "#fafafa",
  },
  menuTitle: {
    fontSize: "12px",
    fontWeight: 500,
    width: "100%",
    height: "40px",
    display: "flex",
    alignItems: "center",
    textTransform: "uppercase",
    letterSpacing: "0px",
    lineHeight: 1,
    color: "#717171",
  },
  nutriscoreImage: {
    height: "24px",
    marginTop: "8px",
  },
  reasonLabel: {
    alignSelf: "center",
    padding: "10px",
    height: "100%",
  },
  cardActions: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
    background: "#fafafa",
  },
  cardTop: {
    display: "flex",
    justifyContent: "flex-start",
  },
  cardContent: {
    alignSelf: "flex-start",
    padding: "8px",
  },
  sideCardActions: {
    display: "flex",
    flexDirection: "column",
    padding: "4px",
  },
  likeButton: {
    margin: "0 !important",
  },
  paper: {
    position: "absolute",
    width: "80%",
    backgroundColor: "white",
    borderRadius: "8px",
    padding: "16px",
    boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.75)",
  },
  modalTitle: {
    fontFamily: "sans-serif",
    lineHeight: 1.5,
    fontWeight: 400,
  },
  checkbox: {
    justifyContent: "space-between",
    fontSize: "16px",
    fontWeight: 400,
  },
}));

export const CardRecommendedMeal = () => {
  const classes = useStyles();

  const { recipe, ingredients } = useTracker(() => {
    const noDataAvailable = { recipe: {}, ingredients: [] };
    const recipeHandler = Meteor.subscribe("recipes");
    const recommendationHandler = Meteor.subscribe("recommendedrecipes");
    if (!Meteor.user()) {
      return noDataAvailable;
    }
    if (!recipeHandler.ready() || !recommendationHandler.ready()) {
      return { ...noDataAvailable, isLoading: true };
    }
    const recommendedRecipes = RecommendedRecipes.findOne({
      userid: Meteor.userId(),
    }).recommendations;
    const recommendedRecipeId = _.filter(
      recommendedRecipes,
      (r) => r.ranking === 2
    )[0].id;
    const recipe = RecipesCollection.findOne({
      id: recommendedRecipeId,
    });

    // update modal reasons with ingredients
    const ingredients = _.map(recipe.ingredients, (ingredient) => {
      return {
        ingredient: ingredient,
        label:
          "I don't like " +
          ingredient.description
            .replace("[I] ", "")
            .split("|")[0]
            .toLowerCase(),
      };
    });

    return { recipe, ingredients };
  });

  // Like logic
  const { liked, nbLikes } = useTracker(() => {
    const noDataAvailable = { liked: false };
    if (!recipe) return noDataAvailable;
    const handler = Meteor.subscribe("userpreferences");
    if (!handler.ready()) {
      return { ...noDataAvailable };
    }
    const nbLikes = recipe.nbLikes;
    const liked =
      UserPreferences.find({
        userid: Meteor.userId(),
        likedRecipes: { $in: [recipe.id] },
      }).fetch().length > 0;
    return { liked, nbLikes };
  });

  const handleIncreaseLike = () => {
    if (recipe) {
      Meteor.call("recipes.handleLike", recipe.id);
    }
  };

  // order logic
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
    let end = new Date();
    end.setHours(23, 59, 59, 999);
    const orders = OrdersCollection.find({
      userid: Meteor.userId(),
      recipeId: recipe.id,
      timestamp: { $gte: start, $lt: end },
    }).fetch();
    const ordered = orders.length > 0;
    return { ordered };
  });

  const handleOrder = () => {
    if (recipe) {
      if (!ordered) setToast(true);
      Meteor.call("orders.handleOrder", recipe.id);
    }
  };

  // modal logic
  const [modalStyle] = useState(getModalStyle);
  const [open, setOpen] = useState(false);
  function getModalStyle() {
    const top = 50; // percentages
    const left = 50;
    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    };
  }

  const [checkboxes, updateCheckboxes] = useState([false, false, false, false]);

  const handleModalCheckboxChange = (event, i) => {
    let newArr = [...checkboxes];
    newArr[i] = event.target.checked;
    updateCheckboxes(newArr);
  };

  const handleModalOpen = () => {
    setOpen(true);
  };
  const handleModalClose = () => {
    setOpen(false);
  };

  const cancelModal = () => {
    setOpen(false);
  };
  const sendModal = () => {
    let listOfDislikes = [];
    for(let i = 0; i < checkboxes.length; i++) {
      let check = checkboxes[i];
      if(check) {
        listOfDislikes.push(ingredients[i].ingredient);
      }
    }
    console.log(listOfDislikes);
    Meteor.call("users.addDislikes", listOfDislikes);
    setOpen(false);
  }; // TO. DO... SEND MODAL DATA...

  // Detail logic
  const handleDetailsClick = () => {
    OpenMealDetails.set(recipe.id);
  };

  // Thank you message
  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }
  const [toastShown, setToast] = useState(false);

  return (
    <>
      {recipe ? (
        <Card>
          <div style={{ display: "flex" }}>
            <CardActionArea
              className={classes.cardTop}
              onClick={() => handleDetailsClick()}
            >
              <CardMedia
                className={classes.menuImage}
                image={getImage(recipe)}
              />
              <CardContent className={classes.cardContent}>
                <Typography className={classes.menuTitle}>
                  {String(recipe.name).length > 40
                    ? recipe.name.slice(0, 40) + "..."
                    : recipe.name}
                </Typography>
                <img
                  className={classes.nutriscoreImage}
                  src={getNutriscoreImage(recipe)}
                />
              </CardContent>
            </CardActionArea>

            <CardActions className={classes.sideCardActions}>
              <IconButton className={classes.likeButton}>
                <ThumbUpIcon style={{ color: "#f7ba8b" }} />
              </IconButton>
              <IconButton
                className={classes.likeButton}
                onClick={handleModalOpen}
              >
                <ThumbDownIcon style={{ color: "#f7ba8b" }} />
              </IconButton>
            </CardActions>
          </div>
          <CardActions className={classes.cardActions}>
            <Button
              size="large"
              onClick={() => handleIncreaseLike()}
              color={"primary"}
              style={
                liked
                  ? { backgroundColor: red[100], borderRadius: "14px" }
                  : undefined
              }
            >
              <FavoriteIcon style={{ color: red[300] }} /> &nbsp;{" "}
              <span>{nbLikes}</span>
            </Button>
            <Button
              size="large"
              color="primary"
              onClick={() => handleDetailsClick()}
            >
              More info
            </Button>
            <Button
              size="large"
              color="primary"
              onClick={() => handleOrder()}
              style={
                ordered
                  ? { backgroundColor: red[100], borderRadius: "14px" }
                  : undefined
              }
            >
              {ordered ? "Ordered" : "Order"}
            </Button>
          </CardActions>

          <Modal open={open} onClose={handleModalClose}>
            <div style={modalStyle} className={classes.paper}>
              <h3 className={classes.modalTitle}>
                Please help us by telling us why you dislike this menu?
              </h3>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  rowGap: "16px",
                }}
              >
                {_.map(ingredients, (ingredient, i) => {
                  return (
                    <FormControlLabel
                      className={classes.checkbox}
                      key={i + "-checkbox"}
                      control={
                        <Checkbox
                          color="primary"
                          checked={checkboxes[i]}
                          onChange={(e) => handleModalCheckboxChange(e, i)}
                        />
                      }
                      label={ingredient.label}
                      labelPlacement="start"
                    />
                  );
                })}
              </div>
              <div
                style={{
                  display: "flex",
                  columnGap: "16px",
                  marginTop: "32px",
                  justifyContent: "flex-end",
                }}
              >
                <Button
                  size="large"
                  onClick={() => cancelModal()}
                  color="primary"
                >
                  Cancel
                </Button>
                <Button
                  size="large"
                  onClick={() => sendModal()}
                  color="primary"
                >
                  Send
                </Button>
              </div>
            </div>
          </Modal>
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
    </>
  );
};
