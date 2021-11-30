import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  FormControlLabel,
  IconButton,
  Typography
} from "@material-ui/core/";
import Checkbox from "@material-ui/core/Checkbox";
import { red } from "@material-ui/core/colors";
import Modal from "@material-ui/core/Modal";
import { makeStyles } from "@material-ui/core/styles";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import { useTracker } from "meteor/react-meteor-data";
import React, { useState } from "react";
import { OrderButton } from "./components/OrderButton";
import { getImage, getNutriscoreImage } from "/imports/api/apiPersfo";
import { UserPreferences } from '/imports/db/userPreferences/UserPreferences';


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

const componentName = "CardRecommendedMeal";
export const CardRecommendedMeal = ({ recipe, handleIncreaseLike, handleDetailsClick, liked, nbLikes, allergensPresent, dietaryConflict }) => {
  const classes = useStyles();

  const { ingredients, thumbsDown } = useTracker(() => {
    const noDataAvailable = { ingredients: [], thumbsDown: false };
    if (!Meteor.user() || _.isEmpty(recipe) ) {
      return noDataAvailable;
    }

    const thumbsDown = false; // TODO

    // try {
    //   const recommendedRecipes = RecommendedRecipes.findOne({
    //     userid: Meteor.userId(),
    //   }).recommendations;
    //   recommendedRecipeId = _.filter(
    //     recommendedRecipes,
    //     (r) => r.ranking === 1
    //   )[0].id;
    // } catch (error) {
    //   thumbsDown = true; //TODO check thumbs down
    //   // no recommendations yet
    // }

    let tempIngredients = [];
    if (recipe.cleanedIngredients) {
      tempIngredients = recipe.cleanedIngredients;
    } else {
      console.error("no cleaned ingredients for: " + recipe.id);
    }
    const ingredients = tempIngredients.slice(0,7);

    return { ingredients, thumbsDown };
  });

  // Like and thumb logic
  const { thumbsUp } = useTracker(() => {
    const noDataAvailable = {
      thumbsUp: false,
    };
    if (!recipe) return noDataAvailable;
    const handler = Meteor.subscribe("userpreferences");
    if (!handler.ready()) {
      return { ...noDataAvailable };
    }
    const thumbsUp =
      UserPreferences.find({
        userid: Meteor.userId(),
        likedRecommendations: { $in: [recipe.id] },
      }).fetch().length > 0;
    return { thumbsUp };
  });

  const handleThumbsUp = () => {
    if (recipe) {
      Meteor.call("users.handleLikeRecommendation", recipe.id, true);
      Meteor.call("log", componentName, "handleThumbsUp");
      // if (!thumbsUp) {
      //   setThumbsDown(false);
      // }
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
    Meteor.call("log", componentName, "handleModalCheckboxChange");
  };

  const handleModalOpen = () => {
    if (!thumbsDown) {
      // setThumbsDown(true);
      Meteor.call("users.handleLikeRecommendation", recipe.id, false);
      setOpen(true);
      Meteor.call("log", componentName, "handleModalOpen");
    }
  };
  const handleModalClose = () => {
    // setThumbsDown(false);
    Meteor.call("users.handleLikeRecommendation", recipe.id, false);
    setOpen(false);
    Meteor.call("log", componentName, "handleModalClose");
  };

  const cancelModal = () => {
    // setThumbsDown(false);
    setOpen(false);
    Meteor.call("log", componentName, "cancelModal");
  };

  const sendModal = () => {
    let listOfDislikes = [];
    for (let i = 0; i < checkboxes.length; i++) {
      let check = checkboxes[i];
      if (check) {
        listOfDislikes.push(ingredients[i]);
      }
    }
    Meteor.call("users.addDislikes", listOfDislikes);
    setOpen(false);
    Meteor.call("log", componentName, "sendModal");
  };

  return (
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
          <IconButton
            onClick={() => handleThumbsUp()}
            className={classes.likeButton}
          >
            <ThumbUpIcon
              style={thumbsUp ? { color: "#F57D20" } : { color: "#f7ba8b" }}
            />
          </IconButton>
          <IconButton
            className={classes.likeButton}
            onClick={handleModalOpen}
          >
            <ThumbDownIcon
              style={
                thumbsDown ? { color: "#F57D20" } : { color: "#f7ba8b" }
              }
            />
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
        <OrderButton recipe={recipe} allergensPresent={allergensPresent} dietaryConflict={dietaryConflict}></OrderButton>
      </CardActions>

      <Modal open={open} onClose={handleModalClose}>
        <div style={modalStyle} className={classes.paper}>
          <h3 className={classes.modalTitle}>
            Please help us by telling us why you dislike this
            recommendation?
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
                  label={ingredient}
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
  );
};
