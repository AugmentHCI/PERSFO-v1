import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  IconButton, Paper,
  Typography
} from "@material-ui/core/";
import { grey, red } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/core/styles";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import React, { useState } from "react";

const useStyles = makeStyles((persfoTheme) => ({
  recommendedCard: {
    display: "flex",
    position: "relative",
    marginLeft: persfoTheme.spacing(1),
    borderRadius: "30px 0px 0px 30px",
    width: "100%",
    zIndex: 20000,
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
}));

export const CardRecommendedMeal = () => {
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
      </Box>
  );
};
