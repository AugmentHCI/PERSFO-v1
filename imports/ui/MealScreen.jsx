import { Box, Paper, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { useState } from "react";
import { getNutriscoreImage } from "/imports/api/apiPersfo";
import FavoriteIcon from "@material-ui/icons/Favorite";
import { grey, red, orange } from "@material-ui/core/colors";
import Typography from "@material-ui/core/Typography";

import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles((persfoTheme) => ({
  headerImage: {
    width: "100%",
  },
  mealTitleCard: {
    display: "flex",
    position: "relative",
    borderRadius: "60px 60px 0px 0px",
    width: "100%",
    height: "200px",
  },
  menuTitle: {
    marginTop: persfoTheme.spacing(4),
    marginLeft: persfoTheme.spacing(4),
  },
  nutriscore: {
    marginTop: persfoTheme.spacing(3),
    // position: "absolute",
    // right: persfoTheme.spacing(4),
    width: "72px",
    height: "30px",
  },
  tabs: {
    marginLeft: persfoTheme.spacing(2),
    height: "50px",
  },
  tabFont: {
    fontSize: "10px",
  },
  kcal: {
    textAlign: "middle",
  },
}));

export const MealScreen = ({ recipe }) => {
  const classes = useStyles();

  const [drawerOpen, setState] = useState(false);

  const [nbLikesDummy, increaseLike] = useState(134);

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const toggleDrawer = (open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState(open);
  };

  return (
    <>
      <img className={classes.headerImage} src="/images/logo.png" />
      <Paper className={classes.mealTitleCard}>
        <Grid container>
          <Grid container>
            <Grid item xs={9}>
              <Typography className={classes.menuTitle}>Hello</Typography>
            </Grid>
            <Grid item xs={3}>
              <img
                className={classes.nutriscore}
                src={getNutriscoreImage(recipe)}
              ></img>
            </Grid>
            <Grid container>
              <Grid item xs={2} m={1}>
                <Button onClick={() => increaseLike(nbLikesDummy + 1)}>
                  <FavoriteIcon
                    className={classes.heartButton}
                    style={{ color: red[300] }}
                  ></FavoriteIcon>{" "}
                  {nbLikesDummy}
                </Button>
              </Grid>
              <Grid item xs={10}>
                <Button>
                  kcal
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <Grid container className={classes.tabs}>
            <Tabs
              value={value}
              onChange={handleChange}
              indicatorColor="primary"
              textColor="primary"
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab
                key={"key1"}
                label={<span className={classes.tabFont}>Nutrients</span>}
              />
              <Tab
                key={"key2"}
                label={<span className={classes.tabFont}>Allergies</span>}
              />
              <Tab
                key={"key3"}
                label={<span className={classes.tabFont}>Sustainability</span>}
              />
              <Tab
                key={"key4"}
                label={<span className={classes.tabFont}>Reviews</span>}
              />
            </Tabs>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};
