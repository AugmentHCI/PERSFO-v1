import React, { useState } from "react";
import FavoriteIcon from "@material-ui/icons/Favorite";
import { grey, red, orange } from "@material-ui/core/colors";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { getNutriscoreImage } from "/imports/api/apiPersfo";
import { Fab,Tab,Tabs,Grid,Typography,Box,Paper,Button,LinearProgress } from "@material-ui/core/";


const BorderLinearProgress = withStyles((theme) => ({
  root: {
    height: 4,
    borderRadius: 4,
  },
  colorPrimary: {
    backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
  },
  bar: {
    borderRadius: 5,
    backgroundColor: '#F57D20',
  },
}))(LinearProgress);

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
  }

  const getMPricing = () => {
    try {
      return ('€'+recipe.current_sell_price.pricing.toFixed(2) );
    } catch (e) { }
  }

  const NutrientsBar = (props) => {
    return <div style={{padding: '4px', marginBottom: '8px'}}>
           <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '2px'}}>
           <div style={{color: '#717171', fontSize: '12px'}}>{props.title}</div>
           <div style={{color: '#717171', fontSize: '12px'}}>{props.value.toLocaleString()}/{props.maxValue.toLocaleString()}{String(props.unit)}</div>
           </div>
           <BorderLinearProgress variant="determinate" value={props.value}/>
           </div>;
  }
  // TODO... MAX VALUES TO BE GET FROM THE PREFERENCES.
  const NutrientsContent = (props) => {
    const r = props.recipe.nutrition_info;
    return <div>
           <h1 className={classes.subtitle}>Nutrients</h1>
           <div style={{overflowY: 'scroll', height: '150px'}}>
           <NutrientsBar title='Energy'         value={r.kcal.quantity}          maxValue={100} unit={r.kcal.unit}/>
           <NutrientsBar title='Total fat'      value={r.fat.quantity}           maxValue={100} unit={r.fat.unit}/>
           <NutrientsBar title='Saturated fats' value={r.saturated_fat.quantity} maxValue={100} unit={r.saturated_fat.unit}/>
           <NutrientsBar title='Sugar'          value={r.sugar.quantity}         maxValue={100} unit={r.sugar.unit}/>
           <NutrientsBar title='Proteins'       value={r.protein.quantity}       maxValue={100} unit={r.protein.unit}/>
           <NutrientsBar title='Fiber'          value={r.fibre.quantity}         maxValue={100} unit={r.fibre.unit}/>
           </div>
           </div>;
  }


  const renderTabContent = (tabValue) => {
    switch (tabValue) {
      case 0: return <NutrientsContent recipe={recipe} />;  break;
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

      <div className={classes.tabContent}>{renderTabContent(tabValue)}</div>

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
