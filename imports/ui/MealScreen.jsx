import { Button, Fab, LinearProgress, Tab, Tabs } from "@material-ui/core/";
import { red, green } from "@material-ui/core/colors";
import Snackbar from "@material-ui/core/Snackbar";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import FavoriteIcon from "@material-ui/icons/Favorite";
import MuiAlert from "@material-ui/lab/Alert";
import { useTracker } from "meteor/react-meteor-data";
import React, { useState } from "react";
import {
  calculateNutrientforRecipe,
  getNutriscoreImage
} from "/imports/api/apiPersfo";
import { OrdersCollection, UserPreferences } from "/imports/api/methods.js";


const BorderLinearProgress = withStyles((theme) => ({
  root: {
    height: 4,
    borderRadius: 4,
  },
  colorPrimary: {
    backgroundColor:
      theme.palette.grey[theme.palette.type === "light" ? 200 : 700],
  },
  bar: {
    borderRadius: 5,
    backgroundColor: "#F57D20",
  },
}))(LinearProgress);

const useStyles = makeStyles((persfoTheme) => ({
  mealTitleCard: {
    display: "flex",
    borderRadius: "60px 60px 0px 0px",
    width: "auto",
    height: "200px",
    marginTop: "12px",
    flexDirection: "column",
    background: "white",
  },
  menuTitle: {
    fontSize: "16px",
    fontWeight: 600,
    width: "184px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    textTransform: "uppercase",
    letterSpacing: "0px",
    lineHeight: 1.5,
    color: "#717171",
    fontFamily: "sans-serif",
  },
  nutriscore: {
    height: "32px",
  },
  tabFont: {
    fontSize: "10px",
  },
  kcal: {
    fontFamily: "sans-serif",
    fontSize: "14px",
    color: "#717171",
    padding: "6px 8px",
    display: "flex",
    alignItems: "center",
  },
  pricing: {
    color: "#F57D20",
    fontFamily: "sans-serif",
    fontSize: "32px",
  },
  heartButton: {
    overflow: "visible",
    marginRight: "4px",
  },
  heartButtonText: {
    color: "#717171",
    fontFamily: "sans-serif",
    fontSize: "14px",
  },
  tabContent: {
    height: "180px",
    background: "white",
    padding: "8px",
    fontSize: "14px",
    fontFamily: "sans-serif",
  },
  recipeDescription: {
    height: "80px",
    background: "white",
    padding: "8px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "14px",
    fontFamily: "sans-serif",
  },
  subtitle: {
    color: "#717171",
    width: "100%",
    display: "flex",
    fontSize: "12px",
    alignItems: "center",
    fontWeight: 600,
    lineHeight: 1,
    letterSpacing: "0px",
    textTransform: "uppercase",
  },
  allergenBox: {
    padding: "8px",
    border: "1px solid " + green[300],
    borderRadius: "10px",
    color: green[300],
  },
  activeAllergenBox: {
    padding: "8px",
    border: "1px solid " + red[300],
    background: red[300],
    borderRadius: "10px",
    color: "white",
  },
}));

const componentName = "MealScreen";
export const MealScreen = ({ recipe }) => {
  const classes = useStyles();

  // Like logic
  const { liked, nbLikes, userAllergens } = useTracker(() => {
    const noDataAvailable = { liked: false };
    if (!recipe) return noDataAvailable;
    const handler = Meteor.subscribe("userpreferences");
    if (!handler.ready()) {
      return { ...noDataAvailable };
    }
    const nbLikes = recipe.nbLikes;
    const liked =
      UserPreferences.find({
        userid: Meteor.userId(),
        likedRecipes: { $in: [recipe.id] },
      }).fetch().length > 0;

    let userAllergens = [];
    try {
      userAllergens = UserPreferences.findOne({ userid: Meteor.userId() }).allergens;
    } catch (error) {}

    return { liked, nbLikes, userAllergens };
  });

  const handleIncreaseLike = () => {
    if (recipe) {
      Meteor.call("recipes.handleLike", recipe.id);
      Meteor.call("log", componentName, "handleIncreaseLike");
    }
  };

  // order logic
  const handleOrder = () => {
    if (recipe) {
      if (!ordered) setToast(true);
      Meteor.call("orders.handleOrder", recipe.id);
      Meteor.call("log", componentName, "handleOrder");
    }
  };

  const { ordered } = useTracker(() => {
    const noDataAvailable = { ordered: false };
    const handler = Meteor.subscribe("orders");
    if (!handler.ready()) {
      return { ...noDataAvailable };
    }
    if (!recipe) return { ...noDataAvailable };

    // find only orders made today
    const now = new Date();
    const orders = OrdersCollection.find({
      userid: Meteor.userId(),
      recipeId: recipe.id,
      orderday: now.toISOString().substring(0, 10),
    }).fetch();
    const ordered = orders.length > 0;
    return { ordered };
  });

  // Thank you message
  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }
  const [toastShown, setToast] = useState(false);

  // tab logic
  const [tabValue, setTabValue] = useState(0);

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
    Meteor.call("log", componentName, "handleChange");
  };

  const getKcalInfo = () => {
    try {
      return recipe.kcal.toFixed(0) + " " + recipe.nutrition_info.kcal.unit;
    } catch (e) {}
  };

  const getMPricing = () => {
    try {
      return "€" + recipe.current_sell_price.pricing.toFixed(2);
    } catch (e) {}
  };

  const NutrientsBar = (props) => {
    let maxValue = props.maxValue;
    if (props.value >= props.maxValue) {
      maxValue = props.value;
    }
    const normalise = ((props.value - 0) * 100) / (maxValue - 0);
    return (
      <div style={{ padding: "4px", marginBottom: "8px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "2px",
          }}
        >
          <div style={{ color: "#717171", fontSize: "12px" }}>
            {props.title}
          </div>
          <div style={{ color: "#717171", fontSize: "12px" }}>
            {props.value.toLocaleString()}/
            <span style={{ color: "#F57D20" }}>
              {maxValue.toLocaleString()}
            </span>
            &nbsp;{String(props.unit)}
          </div>
        </div>
        <BorderLinearProgress variant="determinate" value={normalise} />
      </div>
    );
  };
  // TODO... MAX VALUES TO BE GET FROM THE PREFERENCES.
  const NutrientsContent = (props) => {
    const r = props.recipe.nutrition_info;
    const recipe = props.recipe;
    let kcal = 0;
    try {
      kcal = calculateNutrientforRecipe(recipe, "kcal");
    } catch (e) {}
    let fat = 0;
    try {
      fat = calculateNutrientforRecipe(recipe, "fat");
    } catch (e) {}
    let sat = 0;
    try {
      sat = calculateNutrientforRecipe(recipe, "saturated_fat");
    } catch (e) {}
    let sug = 0;
    try {
      sug = calculateNutrientforRecipe(recipe, "sugar");
    } catch (e) {}
    let prot = 0;
    try {
      prot = calculateNutrientforRecipe(recipe, "protein");
    } catch (e) {}
    let fibr = 0;
    try {
      fibr = calculateNutrientforRecipe(recipe, "fibre");
    } catch (e) {}
    let potss = 0;
    try {
      potss = calculateNutrientforRecipe(recipe, "potassium");
    } catch (e) {}

    let ukcal = "";
    try {
      ukcal = r.kcal.unit;
    } catch (e) {}
    let ufat = "";
    try {
      ufat = r.fat.unit;
    } catch (e) {}
    let usat = "";
    try {
      usat = r.saturated_fat.unit;
    } catch (e) {}
    let usug = "";
    try {
      usug = r.sugar.unit;
    } catch (e) {}
    let uprot = "";
    try {
      uprot = r.protein.unit;
    } catch (e) {}
    let ufibr = "";
    try {
      ufibr = r.fibre.unit;
    } catch (e) {}
    let upotss = "";
    try {
      upotss = r.potassium.unit;
    } catch (e) {}

    let noData = null;
    if (_.sum([kcal, fat, sat, sug, prot, fibr, potss]) == 0)
      noData = (
        <p style={{ color: "#afafaf", fontSize: "11px", padding: "8px" }}>
          {" "}
          No data{" "}
        </p>
      );

    return (
      <div>
        <h1 className={classes.subtitle}>Nutrients</h1>
        <div style={{ overflowY: "scroll", height: "150px" }}>
          {noData}
          {kcal == 0 ? null : (
            <NutrientsBar
              title="Energy"
              value={kcal}
              maxValue={2500}
              unit={ukcal}
            />
          )}
          {fat == 0 ? null : (
            <NutrientsBar
              title="Total fat"
              value={fat}
              maxValue={77}
              unit={ufat}
            />
          )}
          {sat == 0 ? null : (
            <NutrientsBar
              title="Saturated fats"
              value={sat}
              maxValue={20}
              unit={usat}
            />
          )}
          {sug == 0 ? null : (
            <NutrientsBar title="Sugar" value={sug} maxValue={36} unit={usug} />
          )}
          {prot == 0 ? null : (
            <NutrientsBar
              title="Proteins"
              value={prot}
              maxValue={56}
              unit={uprot}
            />
          )}
          {fibr == 0 ? null : (
            <NutrientsBar
              title="Fiber"
              value={fibr}
              maxValue={30}
              unit={ufibr}
            />
          )}
          {potss == 0 ? null : (
            <NutrientsBar
              title="Potassium"
              value={potss}
              maxValue={6}
              unit={upotss}
            />
          )}
        </div>
      </div>
    );
  };
  // WARNING.. THIS NEEDS TO BE CORRELATED WITH USER PROFILE.
  const AllergiesContent = (props) => {
    const allergens = _.without(
      _.map(_.toPairs(props.recipe.allergens), function (n) {
        if (n[1] == 1) return n[0];
      }),
      undefined
    );
    let render = _.map(allergens, function (a, i) {
      let tempClassName = classes.allergenBox;
      userAllergens.forEach(element => {
        if(element.allergen == a) {
          tempClassName = classes.activeAllergenBox;
        }
      });
      return (
        <div className={tempClassName} key={i}>
          {a}
        </div>
      );
    });
    if (_.isEmpty(allergens))
      render = (
        <p style={{ color: "#afafaf", fontSize: "11px", padding: "8px" }}>
          {" "}
          No data{" "}
        </p>
      );
    return (
      <div>
        <h1 className={classes.subtitle}>Allergens</h1>
        <div style={{ overflowY: "scroll", height: "150px" }}>
          <div
            style={{
              display: "flex",
              columnGap: "8px",
              flexWrap: "wrap",
              rowGap: "8px",
            }}
          >
            {render}
          </div>
        </div>
      </div>
    );
  };

  const SustainabilityContent = (props) => {
    return (
      <div>
        <h1 className={classes.subtitle}>Sustainability</h1>
        <div style={{ overflowY: "scroll", height: "150px" }}>
          <h1 className={classes.subtitle}>Food product labels</h1>
          <p style={{ color: "#afafaf", fontSize: "11px", padding: "8px" }}>
            {" "}
            No data{" "}
          </p>
          <h1 className={classes.subtitle}>CO2 footprint</h1>
          <p style={{ color: "#afafaf", fontSize: "11px", padding: "8px" }}>
            {" "}
            No data{" "}
          </p>
        </div>
      </div>
    );
  };

  const RewiewsContent = (props) => {
    return (
      <div>
        <h1 className={classes.subtitle}>Reviews</h1>
        <div style={{ overflowY: "scroll", height: "150px" }}>
          <p style={{ color: "#afafaf", fontSize: "11px", padding: "8px" }}>
            {" "}
            No data{" "}
          </p>
        </div>
      </div>
    );
  };

  const renderTabContent = (tabValue) => {
    switch (tabValue) {
      case 0:
        return <NutrientsContent recipe={recipe} />;
        break;
      case 1:
        return <AllergiesContent recipe={recipe} />;
        break;
      case 2:
        return <SustainabilityContent recipe={recipe} />;
        break;
      case 3:
        return <RewiewsContent recipe={recipe} />;
        break;
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        rowGap: "8px",
        justifyContent: "space-between",
      }}
    >
      <div className={classes.mealTitleCard}>
        <div style={{ padding: "24px 24px 0px 24px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h1 className={classes.menuTitle}>
              {String(recipe.name).length > 40
                ? recipe.name.slice(0, 40) + "..."
                : recipe.name}
            </h1>
            <img
              className={classes.nutriscore}
              src={getNutriscoreImage(recipe)}
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
            }}
          >
            <Button
              onClick={() => handleIncreaseLike()}
              style={
                liked
                  ? { backgroundColor: red[100], borderRadius: "14px" }
                  : undefined
              }
            >
              <FavoriteIcon
                className={classes.heartButton}
                style={{ color: red[300] }}
              />
              <span className={classes.heartButtonText}>{nbLikes}</span>
            </Button>
            <span className={classes.kcal}>{getKcalInfo()}</span>
            <span className={classes.pricing}>{getMPricing()}</span>
          </div>
        </div>

        <div>
          <Tabs
            value={tabValue}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
            scrollButtons="auto"
            centered={true}
          >
            <Tab
              key={"key1"}
              label={<span className={classes.tabFont}>Nutrients</span>}
            />
            <Tab
              key={"key2"}
              label={<span className={classes.tabFont}>Allergens</span>}
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
        </div>
      </div>
      <div className={classes.tabContent}>{renderTabContent(tabValue)}</div>
      <div className={classes.recipeDescription}>
        <div style={{ alignSelf: "flex-start" }}>
          <h1 className={classes.subtitle}>Description</h1>
          <p style={{ color: "#afafaf", fontSize: "11px", padding: "8px" }}>
            {" "}
            {recipe.description}{" "}
          </p>
        </div>
        <Fab
          variant="extended"
          size="medium"
          color="primary"
          aria-label="add"
          onClick={() => handleOrder()}
          className={classes.margin}
          style={
            ordered
              ? {
                  backgroundColor: red[100],
                  borderRadius: "14px",
                  color: "#F57D20",
                }
              : { color: "white" }
          }
        >
          {ordered ? "Ordered" : "Order"}
        </Fab>
      </div>{" "}
      <Snackbar
        open={toastShown}
        autoHideDuration={6000}
        onClose={() => setToast(false)}
      >
        <Alert onClose={() => setToast(false)} severity="success">
          Thank you for participating today!
        </Alert>
      </Snackbar>
    </div>
  );
};
