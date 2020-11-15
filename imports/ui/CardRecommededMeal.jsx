import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  IconButton,
  Paper,
  Typography,
} from "@material-ui/core/";
import { grey, red } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Checkbox from "@material-ui/core/Checkbox";
import Grid from "@material-ui/core/Grid";

import FavoriteIcon from "@material-ui/icons/Favorite";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import React, { Fragment, useState } from "react";

import { useTracker } from "meteor/react-meteor-data";
import { RecipesCollection } from "../db/RecipesCollection";


const useStyles = makeStyles((persfoTheme) => ({
  recommendedCard: {
    display: "flex",
    position: "relative",
    marginLeft: persfoTheme.spacing(1),
    borderRadius: "30px 0px 0px 30px",
    width: "100%",
    zIndex: 1100,
  },
  menuImage: {
    justifyContent: "flex-start",
    margin: persfoTheme.spacing(2),
    width: persfoTheme.spacing(8),
    height: persfoTheme.spacing(8),
  },
  menuTitle: {
    marginTop: persfoTheme.spacing(2),
  },
  nutriscore: {
    marginTop: persfoTheme.spacing(2),
    width: "54px",
    height: "20px",
  },
  thumbs: {
    marginTop: persfoTheme.spacing(1),
    position: "absolute",
    right: persfoTheme.spacing(1),
  },
  thumb: {
    display: "block",
  },
  recommendedLowerButtons: {
    float: "right",
    background: "#F6EBE4",
    // marginTop: "-2px",
  },
  heartButton: {
    marginRight: persfoTheme.spacing(0.5),
  },
  paper: {
    position: "absolute",
    width: 300,
    backgroundColor: persfoTheme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: persfoTheme.shadows[1],
    padding: persfoTheme.spacing(2),
  },
  reasonLabel: {
    alignSelf: "center",
    padding: "10px",
    height: "100%",
  },
  reasonCheckbox: {
    // textAlign: "right",
  },
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

  const [nbLikesDummy, increaseLike] = useState(134);

  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);

  const [checked, setChecked] = React.useState(true);

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  const { recipe, isLoading } = useTracker(() => {
    const noDataAvailable = {
      recipe: {},
    };
    if (!Meteor.user()) {
      return noDataAvailable;
    }
    const handler = Meteor.subscribe("recipes");

    if (!handler.ready()) {
      return { ...noDataAvailable, isLoading: true };
    }

    const recipe = RecipesCollection.find({id: recipeId}).fetch()[0];

    return { recipe };
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

  const modalBody = (
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
  );

  return (
    <Box className={classes.main}>
      <Paper className={classes.recommendedCard}>
        <Avatar
          aria-label="recipe"
          className={classes.menuImage}
          src="/images/pasta.jpg"
        />

        <Box>
          <Typography className={classes.menuTitle} variant="h5">
            {recipe.name}
          </Typography>
          <img className={classes.nutriscore} src="/images/nutriA.jpg"></img>
        </Box>

        <Box className={classes.thumbs}>
          <IconButton className={classes.thumb} aria-label="settings">
            <ThumbUpIcon style={{ color: grey[300] }} />
          </IconButton>
          <IconButton
            className={classes.thumb}
            aria-label="settings"
            onClick={handleOpen}
          >
            <ThumbDownIcon style={{ color: grey[300] }} />
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
          <Button onClick={() => increaseLike(nbLikesDummy + 1)}>
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
        {modalBody}
      </Modal>
    </Box>
  );
};
