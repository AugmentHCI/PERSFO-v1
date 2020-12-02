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
  IconButton,
  Paper,
  Typography,
} from "@material-ui/core/";

const useStyles = makeStyles((persfoTheme) => ({
  menuImage: {
    height: '100px',
    width:  '100px',
  },
  menuTitle: {
    fontSize: '13px',
    fontWeight: 500,
    textAlign: 'center',
    width: '100%',
    height: '20px',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    textTransform: 'uppercase',
    letterSpacing: '0px'
  },
  nutriscoreImage: {
    height: "32px",
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
    alignSelf: 'flex-start'
  },
  sideCardActions: {
    display: 'flex',
    flexDirection: 'column'
  },
  likeButton: {
    margin: '0 !important',
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
<<<<<<< HEAD
  const [nbLikesDummy, increaseLike] = useState(134);
=======

>>>>>>> 7b7e86f67a3fb33e964ed98b09e824a9aca28d61
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);
  const [checked, setChecked] = React.useState(true);
  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

<<<<<<< HEAD
  const handleOpen  = () => { setOpen(true);  };
  const handleClose = () => { setOpen(false); };
=======
  const handleIncreaseLike = () => {
    if(recipe) {
      Meteor.call('recipes.increaseLike', recipe.id);
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
>>>>>>> 7b7e86f67a3fb33e964ed98b09e824a9aca28d61

  const { recipe, nbLikesDummy } = useTracker(() => {
    const noDataAvailable = {
      recipe: {},
      nbLikesDummy: 0
    };
    if (!Meteor.user()) {
      return noDataAvailable;
    }
    const handler = Meteor.subscribe("recipes");

    if (!handler.ready()) {
      return { ...noDataAvailable, isLoading: true };
    }

    const recipe = RecipesCollection.find({ id: recipeId }).fetch()[0];
    const nbLikesDummy = recipe.nbLikes;

    return { recipe, nbLikesDummy };
  });

  function getDislikeReason(reason, checked) {
    return (
      <Fragment>
        <Grid item xs={10}>
          <Box className={classes.reasonLabel}>{reason}</Box>
        </Grid>
        <Grid item xs={2}>
          <Checkbox
            className={classes.reasonCheckbox}
            checked={checked}
            color="primary"
            onChange={handleChange}
            inputProps={{ "aria-label": "primary checkbox" }}
          />
        </Grid>
      </Fragment>
    );
  }

  return (
    <React.Fragment>
      {recipeId ? (
<<<<<<< HEAD
        <Card className={classes.root}>
        <div style={{display: 'flex'}}>
          <CardActionArea className={classes.cardTop}>
            <CardMedia className={classes.menuImage} image={getImage(recipe)} />
            <CardContent className={classes.cardContent}>
            <Typography  className={classes.menuTitle} gutterBottom>{String(recipe.name).length > 40 ? recipe.name.slice(0, 40) + '...' : recipe.name }</Typography>
            <img className={classes.nutriscoreImage} src={getNutriscoreImage(recipe)} />
            </CardContent>
          </CardActionArea>

          <CardActions className={classes.sideCardActions}>
            <IconButton className={classes.likeButton}><ThumbUpIcon style={{ color: "#f7ba8b" }} /></IconButton>
            <IconButton className={classes.likeButton} onClick={handleOpen} ><ThumbDownIcon style={{ color: "#f7ba8b" }} /></IconButton>
          </CardActions>
        </div>
          <CardActions className={classes.cardActions}>
            <Button size="large" onClick={() => increaseLike(nbLikesDummy + 1)} color="primary">
              <FavoriteIcon style={{ color: red[300] }} /> &nbsp; <span>{nbLikesDummy}</span>
            </Button>
            <Button size="large" color="primary">More info</Button>
            <Button size="large" color="primary">Order</Button>
          </CardActions>
        </Card>
      ) : null }
    </React.Fragment>
=======
        <Box className={classes.main}>
          <Paper className={classes.recommendedCard}>
            <Avatar
              aria-label="recipe"
              className={classes.menuImage}
              src={getImage(recipe)}
            />

            <Box>
              <Typography className={classes.menuTitle} variant="h5">
                {recipe.name}
              </Typography>
              <img
                className={classes.nutriscore}
                src={getNutriscoreImage(recipe)}
              ></img>
            </Box>

            <Box className={classes.thumbs}>
              <IconButton className={classes.thumb} aria-label="settings">
                <ThumbUpIcon style={{ color: "#F6EBE4" }} />
              </IconButton>
              <IconButton
                className={classes.thumb}
                aria-label="settings"
                onClick={handleOpen}
              >
                <ThumbDownIcon style={{ color: "#F6EBE4" }} />
              </IconButton>
            </Box>
          </Paper>

          <Box className={classes.recommendedLowerButtons}>
            <ButtonGroup
              size="small"
              color="primary"
              aria-label="large outlined primary button group"
              style={{ Index: 1 }}
            >
              <Button onClick={() => handleIncreaseLike()}>
                <FavoriteIcon
                  className={classes.heartButton}
                  style={{ color: red[300] }}
                ></FavoriteIcon>{" "}
                {nbLikesDummy}
              </Button>
              <Button>More info</Button>
              <Button>Order</Button>
            </ButtonGroup>
          </Box>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
          >
            <Box style={modalStyle} className={classes.paper}>
              <h3 id="simple-modal-title">
                Please help us by telling us why you dislike this menu?
              </h3>
              <Grid container justify="center">
                {getDislikeReason("I don't like pasta", true)}
                {getDislikeReason("I don't want cheese", checked)}
                {getDislikeReason("I don't want leeks", true)}
                {getDislikeReason("I don't want warm meals", false)}
              </Grid>
            </Box>
          </Modal>
        </Box>
      ) : (
        <div></div>
      )}
    </div>
>>>>>>> 7b7e86f67a3fb33e964ed98b09e824a9aca28d61
  );
};
