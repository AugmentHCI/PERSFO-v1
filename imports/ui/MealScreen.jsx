import { Box, Paper, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { useState } from "react";
import { getNutriscoreImage } from "/imports/api/apiPersfo";
import FavoriteIcon from "@material-ui/icons/Favorite";
import { grey, red, orange } from "@material-ui/core/colors";
import Typography from "@material-ui/core/Typography";
import Fab from '@material-ui/core/Fab';
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles((persfoTheme) => ({
  mealTitleCard: {
    display: "flex",
    borderRadius: "60px 60px 0px 0px",
    width: "auto",
    height: "200px",
    marginTop: "12px",
    flexDirection: 'column',
    background: 'white'
  },
  menuTitle: {
    fontSize: '16px',
    fontWeight: 600,
    width: '184px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    textTransform: 'uppercase',
    letterSpacing: '0px',
    lineHeight: 1.5,
    color: '#717171',
    fontFamily: 'sans-serif'
  },
  nutriscore: {
    height: "32px",
  },
  tabFont: {
    fontSize: "10px",
  },
  kcal: {
    fontFamily: 'sans-serif',
    fontSize: '14px',
    color: '#717171',
    padding: '6px 8px',
    display: 'flex',
    alignItems: 'center'
  },
  pricing: {
    color: "#F57D20",
    fontFamily: 'sans-serif',
    fontSize: '32px'
  },
  heartButton: {
    overflow: 'visible',
    marginRight: '4px'
  },
  heartButtonText: {
    color: '#717171',
    fontFamily: 'sans-serif',
    fontSize: '14px',
  },
  tabContent: {
    height: '180px',
    background: 'white',
    padding: '8px',
    fontSize: '14px',
    fontFamily: 'sans-serif',
  },
  recipeDescription: {
    height: '80px',
    background: 'white',
    padding: '8px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '14px',
    fontFamily: 'sans-serif',
  },
  subtitle: {
    color: '#717171',
    width: '100%',
    display: 'flex',
    fontSize: '12px',
    alignItems: 'center',
    fontWeight: 600,
    lineHeight: 1,
    letterSpacing: '0px',
    textTransform: 'uppercase',
  }
}));

export const MealScreen = ({ recipe }) => {
  const classes = useStyles();
  const [drawerOpen, setState] = useState(false);
  const [nbLikesDummy, increaseLike] = useState(0);
  const [tabValue, setTabValue] = useState(0);

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
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

  const getKcalInfo = () => {
    try {
      return (recipe.kcal.toFixed(2) + ' ' + recipe.nutrition_info.kcal.unit);
    } catch (e) { }
    return '';
  }

  const getMPricing = () => {
    try {
      return ('€'+recipe.current_sell_price.pricing.toFixed(2) );
    } catch (e) { }
    return '';
  }

  const renderTabContent = (tabValue) => {
    switch (tabValue) {
      case 0: return 'Nutrients Content'; break;
      case 1: return 'Allergies';         break;
      case 2: return 'Sustainability';    break;
      case 3: return 'Reviews';           break;
    }
  }

  return (
      <div style={{display: 'flex', flexDirection: 'column', rowGap: '8px', justifyContent: 'space-between'}}>

      <div className={classes.mealTitleCard}>
      <div style={{padding: '24px 24px 0px 24px'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <h1  className={classes.menuTitle}>{String(recipe.name).length > 36 ? recipe.name.slice(0, 36) + '...' : recipe.name }</h1>
          <img className={classes.nutriscore} src={getNutriscoreImage(recipe)} />
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end'}}>
          <Button onClick={() => increaseLike(nbLikesDummy + 1)}>
          <FavoriteIcon className={classes.heartButton} style={{ color: red[300] }} />
          <span className={classes.heartButtonText}>{nbLikesDummy}</span>
          </Button>
          <span className={classes.kcal}    >{getKcalInfo()}</span>
          <span className={classes.pricing} >{getMPricing()}</span>
        </div>
      </div>

      <div>
      <Tabs value={tabValue} onChange={handleChange} indicatorColor="primary" textColor="primary" variant="fullWidth" scrollButtons="auto" centered={true}>
        <Tab key={"key1"} label={<span className={classes.tabFont}>Nutrients</span>} />
        <Tab key={"key2"} label={<span className={classes.tabFont}>Allergies</span>} />
        <Tab key={"key3"} label={<span className={classes.tabFont}>Sustainability</span>}/>
        <Tab key={"key4"} label={<span className={classes.tabFont}>Reviews</span>} />
      </Tabs>
      </div>
      </div>

      <div className={classes.tabContent}>
      <h1 className={classes.subtitle}>{renderTabContent(tabValue)}</h1>
      </div>

      <div className={classes.recipeDescription}>
      <div style={{alignSelf: 'flex-start'}}>
      <h1 className={classes.subtitle}>Description</h1>
      <span>{recipe.description}</span>
      </div>
      <Fab variant="extended" color="primary" aria-label="add" className={classes.margin} style={{color: 'white'}}>Order</Fab>
      </div>

      </div>
  );
};
