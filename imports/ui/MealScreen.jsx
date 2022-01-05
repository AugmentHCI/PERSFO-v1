import { Button, Tab, Tabs } from "@material-ui/core/";
import { red } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/core/styles";
import FavoriteIcon from "@material-ui/icons/Favorite";
import WarningRoundedIcon from '@material-ui/icons/WarningRounded';
import { useTracker } from "meteor/react-meteor-data";
import React, { useState } from "react";
import { OrderButton } from "./components/OrderButton";
import { AllergiesContent } from "./tabs/AllergiesContent";
import { IngredientsContent } from "./tabs/IngredientsContent";
import { NutrientsContent } from "./tabs/NutrientsContent";
import { SustainabilityContent } from "./tabs/SustainabilityContent";
import { getNutriscoreImage } from "/imports/api/apiPersfo";
import { UserPreferences } from '/imports/db/userPreferences/UserPreferences';

const componentName = "MealScreen";
export const MealScreen = ({ recipe }) => {
  const [componentHeight, setComponentHeight] = useState(window.innerHeight);
  const [heightBuffer, setHeightBuffer] = useState(window.innerHeight >= 640 ? 60 : 0);

  //in component style due to dynamic height.
  const useStyles = makeStyles(() => ({
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
    menuTitleLong: {
      fontSize: "12px",
      fontWeight: 600,
      width: "184px",
      height: "40px",
      display: "flex",
      alignItems: "center",
      textTransform: "uppercase",
      letterSpacing: "0px",
      lineHeight: 1.2,
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
      height: componentHeight - 325 - 65 - heightBuffer + "px",
      background: "white",
      padding: "8px",
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
    gapInBetween: {
      display: "flex",
      flexDirection: "column",
      rowGap: "8px",
      justifyContent: "space-between"
    }
  }));

  const classes = useStyles();

  const { liked, nbLikes, allergensPresent } = useTracker(() => {
    const noDataAvailable = {
      liked: false,
      nbLikes: 0,
      allergensPresent: false,
    };
    if (!recipe) return { ...noDataAvailable };
    const handler = Meteor.subscribe("userpreferences");
    if (!Meteor.user() || !handler.ready()) {
      return { ...noDataAvailable, isLoading: true };
    }
    const nbLikes = recipe?.nbLikes ? recipe.nbLikes : 0;
    const liked =
      UserPreferences.find({
        userid: Meteor.userId(),
        likedRecipes: { $in: [recipe.id] },
      }).fetch().length > 0;

    const userPreferences = UserPreferences.findOne({
      userid: Meteor.userId(),
    });

    const userAllergens = userPreferences?.allergens ? _.map(userPreferences?.allergens, a => a.allergen) : [];

    const recipeAllergens = _.without(
      _.map(_.toPairs(recipe.allergens), (n) => {
        if (n[1] == 1) return n[0];
      }),
      undefined
    ).sort();

    let allergensPresentTmp = false;
    userAllergens.forEach(userAllergy => {
      if (recipeAllergens.includes(userAllergy)) {
        allergensPresentTmp = true;
      }
    });
    const allergensPresent = allergensPresentTmp;

    return { liked, nbLikes, allergensPresent };
  });

  const handleIncreaseLike = () => {
    if (recipe) {
      Meteor.call("recipes.handleLike", recipe.id);
      Meteor.call("log", componentName, "handleIncreaseLike", navigator.userAgent, liked);
    }
  };

  // tab logic
  const [tabValue, setTabValue] = useState(0);

  const changeTab = (event, newValue) => {
    setTabValue(newValue);
    Meteor.call("log", componentName, "changeTab", navigator.userAgent, newValue);
  };

  const renderTabContent = (tabValue) => {
    switch (tabValue) {
      case 0:
        return <NutrientsContent recipe={recipe} />;
      case 1:
        return <IngredientsContent recipe={recipe} />;
      case 2:
        return <AllergiesContent recipe={recipe} />;
      case 3:
        return <SustainabilityContent recipe={recipe} />;
    }
  };

  if (recipe) {
    return (
      <div className={classes.gapInBetween}>
        <div className={classes.mealTitleCard}>
          <div style={{ padding: "24px 24px 0px 24px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h1 className={String(recipe.name).length < 40
                ? classes.menuTitle
                : classes.menuTitleLong}
                style={allergensPresent ? { color: red[300] } : {}}
              >
                {recipe.name}
              </h1>
              {allergensPresent ? <WarningRoundedIcon style={{ color: red[300] }} /> : <></>}
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
              <span className={classes.pricing}>{"€" + recipe.current_sell_price?.pricing?.toFixed(2)}</span>
            </div>
          </div>

          <div>
            <Tabs
              value={tabValue}
              onChange={changeTab}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
              scrollButtons="auto"
              centered={true}
            >
              <Tab
                key={"key1"}
                label={<span className={classes.tabFont}>{i18n.__("general.nutrients")}</span>}
              />
              <Tab
                key={"key2"}
                label={<span className={classes.tabFont}>{i18n.__("general.ingredients")}</span>}
              />
              <Tab
                key={"key3"}
                label={<span className={classes.tabFont} style={allergensPresent ? { color: red[300] } : {}}>{i18n.__("general.allergens")}</span>}
              />
              <Tab
                key={"key4"}
                label={<span className={classes.tabFont}>{i18n.__("sustainability.sustainability")}</span>}
              />
            </Tabs>
          </div>
        </div>
        <div className={classes.tabContent}>
          {renderTabContent(tabValue)}
        </div>
        <OrderButton recipe={recipe} allergensPresent={allergensPresent} floating={true}></OrderButton>
      </div>
    )
  } else {
    // no recipe loaded yet.
    return null;
  }

};
