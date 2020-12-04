import Checkbox from "@material-ui/core/Checkbox";
import { grey, red, orange } from "@material-ui/core/colors";
import Grid from "@material-ui/core/Grid";
import Modal from "@material-ui/core/Modal";
import { makeStyles } from "@material-ui/core/styles";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import { useTracker } from "meteor/react-meteor-data";
import React, { Fragment, useState } from "react";
import { MenusCollection, RecipesCollection, OpenMealDetails } from "/imports/api/methods.js";
import { getImage, getNutriscoreImage } from "/imports/api/apiPersfo";

import {
  Card,
  CardActions,
  CardActionArea,
  CardMedia,
  CardContent,
  FormControlLabel,
  Avatar,
  Box,
  Button,
  ButtonGroup,
  IconButton,
  Paper,
  Typography,
} from "@material-ui/core/";

const useStyles = makeStyles((persfoTheme) => ({
  menuImage: {
    minWidth:  '80px',
    minHeight: '80px',
    borderRadius: '100px',
    marginLeft: '8px'
  },
  menuTitle: {
    fontSize: '12px',
    fontWeight: 500,
    width: '100%',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    textTransform: 'uppercase',
    letterSpacing: '0px',
    lineHeight: 1,
    color: '#717171'
  },
  nutriscoreImage: {
    height: "24px",
    marginTop: '8px'
  },
  reasonLabel: {
    alignSelf: "center",
    padding: "10px",
    height: "100%",
  },
  cardActions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    background: '#fafafa'
  },
  cardTop: {
    display: 'flex',
    justifyContent: 'flex-start'
  },
  cardContent: {
    alignSelf: 'flex-start',
    padding: '8px'
  },
  sideCardActions: {
    display: 'flex',
    flexDirection: 'column',
    padding: '4px'
  },
  likeButton: {
    margin: '0 !important',
  },
  paper: {
    position: 'absolute',
    width: '80%',
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '16px',
    boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.75)'
  },
  modalTitle: {
    fontFamily: 'sans-serif',
    lineHeight: 1.5,
    fontWeight: 400
  },
  checkbox: {
    justifyContent: 'space-between',
    fontSize: '16px',
    fontWeight: 400
  }
}));

function getModalStyle() {
  const top = 50; // percentages
  const left = 50;
  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

export const CardRecommendedMeal = ({ recipeId }) => {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);
  const [checked, setChecked] = React.useState(true);
  const handleChange = (event) => { setChecked(event.target.checked); };
  const handleIncreaseLike = () => { if(recipe) { Meteor.call('recipes.increaseLike', recipe.id); } };
  const handleOrder = () => { if(recipe) { Meteor.call('orders.newOrder', recipe.id); } };
  const handleOpen  = () => { setOpen(true);  };
  const handleClose = () => { setOpen(false); };

  const cancelModal  = () => { setOpen(false);  };
  const sendModal    = () => { setOpen(false);  };  // TO. DO... SEND MODAL DATA...

  const { recipe, nbLikesDummy } = useTracker(() => {
    const noDataAvailable = { recipe: {}, nbLikesDummy: 0 };
    const handler = Meteor.subscribe("recipes");
    if (!Meteor.user()) { return noDataAvailable; }
    if (!handler.ready()) { return { ...noDataAvailable, isLoading: true }; }
    const recipe = RecipesCollection.find({ id: recipeId }).fetch()[0];
    let nbLikesDummy = 0;
    try { nbLikesDummy = recipe.nbLikes; } catch (e) {}
    return { recipe, nbLikesDummy };
  });

  const handleDetailsClick = () => {
    OpenMealDetails.set(recipeId);
    console.log(recipeId);
  }


  return (
    <React.Fragment>
      {recipeId ? (
        <Card>
        <div style={{display: 'flex'}}>
          <CardActionArea className={classes.cardTop} onClick={() => handleDetailsClick()} >
            <CardMedia className={classes.menuImage} image={getImage(recipe)} />
            <CardContent className={classes.cardContent}>
            <Typography  className={classes.menuTitle}>{String(recipe.name).length > 40 ? recipe.name.slice(0, 40) + '...' : recipe.name }</Typography>
            <img className={classes.nutriscoreImage} src={getNutriscoreImage(recipe)} />
            </CardContent>
          </CardActionArea>

          <CardActions className={classes.sideCardActions}>
            <IconButton className={classes.likeButton}><ThumbUpIcon style={{ color: "#f7ba8b" }} /></IconButton>
            <IconButton className={classes.likeButton} onClick={handleOpen} ><ThumbDownIcon style={{ color: "#f7ba8b" }} /></IconButton>
          </CardActions>
        </div>
          <CardActions className={classes.cardActions}>
            <Button size="large" onClick={() => handleIncreaseLike()} color="primary">
              <FavoriteIcon style={{ color: red[300] }} /> &nbsp; <span>{nbLikesDummy}</span>
            </Button>
            <Button size="large" color="primary" onClick={() => handleDetailsClick()}>More info</Button>
            <Button size="large" color="primary" onClick={() => handleOrder()}>Order</Button>
          </CardActions>

          <Modal open={open} onClose={handleClose}>
              <div style={modalStyle} className={classes.paper}>
              <h3 className={classes.modalTitle}>Please help us by telling us why you dislike this menu?</h3>
              <div style={{ display: 'flex', flexDirection: 'column', rowGap: '16px' }}>
                <FormControlLabel className={classes.checkbox} control={<Checkbox color="primary" checked={checked} />} label="I don't like pasta"      labelPlacement="start" />
                <FormControlLabel className={classes.checkbox} control={<Checkbox color="primary" checked={checked} />} label="I don't want cheese"     labelPlacement="start" />
                <FormControlLabel className={classes.checkbox} control={<Checkbox color="primary" checked={checked} />} label="I don't want leeks"      labelPlacement="start" />
                <FormControlLabel className={classes.checkbox} control={<Checkbox color="primary" checked={checked} />} label="I don't want warm meals" labelPlacement="start" />
              </div>
              <div style={{ display: 'flex', columnGap: '16px', marginTop: '32px', justifyContent: 'flex-end' }}>
                <Button size="large" onClick={() => cancelModal()} color="primary">Cancel</Button>
                <Button size="large" onClick={() => sendModal()} color="primary">Send</Button>
              </div>
              </div>
          </Modal>

        </Card>
      ) : null }
    </React.Fragment>
  );
};
