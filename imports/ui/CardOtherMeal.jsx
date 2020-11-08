import { Avatar, Box, Grid, Paper, Typography } from "@material-ui/core/";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";

const useStyles = makeStyles((persfoTheme) => ({
  otherPaper: {
    display: "flex",
    position: "relative",
    borderRadius: "40px",
    width: "160px",
    height: "300px",
    textAlign: "center",
  },
  otherMenuImage: {
    marginTop: persfoTheme.spacing(2),
    width: persfoTheme.spacing(12),
    height: persfoTheme.spacing(12),
    margin: "auto",
  },
  otherNutriscore: {
    width: "80px",
    height: "25px",
  },
  otherNutriscoreLabel: {
      position: "absolute",
      bottom: "5px",
      left:"50%",
      marginLeft: "-40px",
    //   textAlign: "center",
  },
}));

export const CardOtherMeal = () => {
  const classes = useStyles();

  return (
    <Paper className={classes.otherPaper}>
      <Box>
        <Avatar
          aria-label="recipe"
          className={classes.otherMenuImage}
          src="/images/pasta.jpg"
        />
        <Typography className={classes.otherMenuTitle} variant="h5">
          Menu long this is a long food menu
        </Typography>
        <Box className={classes.otherNutriscoreLabel}>
          <img
            className={classes.otherNutriscore}
            src="/images/nutriA.png"
          ></img>
        </Box>
      </Box>
    </Paper>
  );
};
