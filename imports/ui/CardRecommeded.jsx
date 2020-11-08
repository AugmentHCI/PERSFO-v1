import React, { useState, Fragment } from "react";

import {
  Avatar,
  Box,
  Paper,
  Typography,
  Button,
  ButtonGroup,
  IconButton,
} from "@material-ui/core/";

import { red, grey } from "@material-ui/core/colors";

import FavoriteIcon from "@material-ui/icons/Favorite";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((persfoTheme) => ({
  main: {
    overflow: "auto",
  },
  recommendedCard: {
    display: "flex",
    marginRight: -persfoTheme.spacing(2),
    marginTop: persfoTheme.spacing(2),
    borderRadius: "40px 0px 0px 40px",
    width: "100%",
  },
  menuImage: {
    justifyContent: "flex-start",
    margin: persfoTheme.spacing(2),
    width: persfoTheme.spacing(12),
    height: persfoTheme.spacing(12),
  },
  menuTitle: {
    marginTop: persfoTheme.spacing(2),
  },
  nutriscore: {
    marginTop: persfoTheme.spacing(2),
    width: "85px",
    height: "25px",
  },
  thumbs: {
    marginTop: persfoTheme.spacing(2),
    position: "absolute",
    right: "50px",
  },
  thumb: {
    display: "block",
  },
  recommendedLowerButtons: {
    float: "right",
    background: "#F6EBE4",
  },
  heartButton: {
    marginRight: persfoTheme.spacing(1),
  },
}));

export const CardRecommended = () => {
  const classes = useStyles();

  const [nbLikesDummy, increaseLike] = useState(134);

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
              Menu long title
            </Typography>
            <img className={classes.nutriscore} src="/images/nutriA.png"></img>
          </Box>

          <Box className={classes.thumbs}>
            <IconButton className={classes.thumb} aria-label="settings">
              <ThumbUpIcon style={{ color: grey[300] }} />
            </IconButton>
            <IconButton className={classes.thumb} aria-label="settings">
              <ThumbDownIcon style={{ color: grey[300] }} />
            </IconButton>
          </Box>
        </Paper>

        <Box className={classes.recommendedLowerButtons}>
          <ButtonGroup
            size="large"
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
      </Box>
  );
};
