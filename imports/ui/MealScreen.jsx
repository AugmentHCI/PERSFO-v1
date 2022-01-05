import { Tab, Tabs } from "@material-ui/core/";
import { red } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/core/styles";
import WarningRoundedIcon from '@material-ui/icons/WarningRounded';
import React, { useState } from "react";
import { LikeButton } from "./components/LikeButton";
import { OrderButton } from "./components/OrderButton";
import { AllergiesContent } from "./tabs/AllergiesContent";
import { IngredientsContent } from "./tabs/IngredientsContent";
import { NutrientsContent } from "./tabs/NutrientsContent";
import { SustainabilityContent } from "./tabs/SustainabilityContent";
import { getNutriscoreImage } from "/imports/api/apiPersfo";

const componentName = "MealScreen";
export const MealScreen = ({ recipe, allergensPresent }) => {
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
    gapInBetween: {
      display: "flex",
      flexDirection: "column",
      rowGap: "8px",
      justifyContent: "space-between"
    }
  }));

  const classes = useStyles();

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
              <LikeButton recipe={recipe}></LikeButton>
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
