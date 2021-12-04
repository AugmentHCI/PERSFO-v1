import { CircularProgress, Tab, Tabs } from "@material-ui/core/";
import Box from "@material-ui/core/Box";
import { createTheme, makeStyles } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import { useTracker } from "meteor/react-meteor-data";
import React, { useState } from "react";
import { AppBarPersfo } from "./AppBarPersfo";
import { AuthenticationScreen } from "./AuthenticationScreen";
import { Done } from "./Done";
import { Feedback } from "./Feedback";
import { MealScreen } from "./MealScreen";
import { Onboarding } from "./Onboarding";
import { Preferences } from "./Preferences";
import { Progress } from "./Progress";
import { SurveyForm } from "./SurveyForm";
import { TabHomeScreen } from "./TabHomeScreen";
import {
  OpenFeedback, OpenMealDetails,
  OpenProgress,
  OpenSettings
} from "/imports/api/methods.js";
import { MenusCollection } from '/imports/db/menus/MenusCollection';
import { OrdersCollection } from '/imports/db/orders/OrdersCollection';
import { RecipesCollection } from '/imports/db/recipes/RecipesCollection';
import { RecommendedRecipes } from '/imports/db/recommendedRecipes/RecommendedRecipes';
import { UserPreferences } from '/imports/db/userPreferences/UserPreferences';

const persfoTheme = createTheme({
  palette: {
    primary: {
      main: "#F57D20",
    },
    secondary: {
      main: "#fff",
    },
    background: {
      default: "#F9F1EC",
    },
  },
  typography: {
    fontSize: 12,
  },
  overrides: {
    MuiAppBar: {
      root: {
        borderRadius: "0px 0px 40px 0px",
      }
    }
  }
});

const useStyles = makeStyles(() => ({
  tabs: {
    display: "flex",
    width: "100%",
    alignItems: "center",
    height: "38px",
  },
}));

const componentName = "App";
export const App = () => {
  const classes = useStyles();

  const user = useTracker(() => Meteor.user());

  // drawer logic
  const [drawerOpen, setState] = useState(false);
  const toggleDrawer = (open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setState(open);
    Meteor.call("log", componentName, "toggleDrawer");
  };

  // Shopping basket drawer logic
  const [shoppingBasketdrawerOpen, setStateShoppingBasket] = useState(false);
  const toggleShoppingBasketDrawer = (open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setStateShoppingBasket(open);
    Meteor.call("log", componentName, "toggleShoppingBasketDrawer");
  };

  // tab logic
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
    Meteor.call("log", componentName, "handleChange");
  };

  const {
    GetOpenMealDetails,
    GetOpenProgress,
    GetOpenSettings,
    GetOpenFeedback,
    menu,
    isLoading,
    doneForToday,
    icfFinished,
    surveyFinished,
    recommendedRecipe
  } = useTracker(() => {
    const GetOpenMealDetails = OpenMealDetails.get();
    const noDataAvailable = {
      menu: { courses: [] },
      doneForToday: false,
      icfFinished: true,
      surveyFinished: true,
      recommendedRecipe: "749543530170001" // in case no meal is recommended, suggest a sandwhich
    };

    const menuHandler = Meteor.subscribe("menus");
    const recipesHandler = Meteor.subscribe("recipes");
    const preferencesHandler = Meteor.subscribe("userpreferences");
    const orderHandler = Meteor.subscribe("orders");
    const recommendationHandler = Meteor.subscribe("recommendedrecipes");

    const GetOpenProgress = OpenProgress.get();
    const GetOpenSettings = OpenSettings.get();
    const GetOpenFeedback = OpenFeedback.get();

    if (!Meteor.user()) {
      return noDataAvailable;
    }
    if (!menuHandler.ready() || !recipesHandler.ready() || !preferencesHandler.ready() || !orderHandler.ready() || !recommendationHandler.ready()) {
      return { ...noDataAvailable, isLoading: true };
    }

    // // wait for menus, recipes, AND userpreferences to load before initializing recommendations
    // // recalculate new recommendation on every app startup
    Meteor.call("recommender.updateRecommendations");

    const now = new Date();
    const nowString = now.toISOString().substring(0, 10);

    // pick specific date for demo
    let menu = MenusCollection.findOne({ starting_date: "2021-12-06" });
    // pick menu of today TODO
    // let menu = MenusCollection.findOne({
    //   starting_date: nowString,
    // });

    // pick menu of December 6 when no menu available today
    if (!menu) menu = MenusCollection.findOne({ starting_date: "2021-12-06" });

    let randomConfirmedOrder = OrdersCollection.findOne({ orderday: nowString, confirmed: true });
    const doneForToday = randomConfirmedOrder !== undefined;

    const userPreferences = UserPreferences.findOne({ userid: Meteor.userId() });
    const icfFinished = userPreferences?.icfFinished;
    const surveyFinished = userPreferences?.ffqAnswers;

    let recommendedRecipeId = "749543530170001";
    try {
      const recommendedRecipes = RecommendedRecipes.findOne({
        userid: Meteor.userId(),
      }).recommendations;
      recommendedRecipeId = _.filter(
        recommendedRecipes,
        (r) => r.ranking === 1
      )[0].id;
    } catch (error) {
      console.log("no recommendations yet: " + error)
      // no recommendations yet
    }

    const recommendedRecipe = RecipesCollection.findOne({
      id: recommendedRecipeId,
    });

    return { GetOpenMealDetails, GetOpenProgress, GetOpenSettings, GetOpenFeedback, menu, doneForToday, icfFinished, surveyFinished, recommendedRecipe };
  });

  const TabPanel = (props) => {
    const { children, value, index, ...other } = props;
    return <div {...other}>{value === index && <Box>{children}</Box>}</div>;
  }

  const getCoursesTabs = () => {
    if (!isLoading) {
      return menu.courses.map((course) => (
        <Tab
          style={{ minHeight: "32px" }}
          key={course.name}
          label={course.name}
        />
      ));
    }
  };

  const switchRenderScreen = () => {
    let renderScreen;
    if (user) {

      if (!icfFinished) {
        renderScreen = <Onboarding />;
      } else {

        if (!surveyFinished) {
          renderScreen = <SurveyForm />;
        } else {

          if (doneForToday) {
            renderScreen = <Done toggleShoppingBasketDrawer={toggleShoppingBasketDrawer}></Done>
          } else {

            if (GetOpenMealDetails == null) {
              renderScreen = (
                <>
                  <div>{isLoading && <CircularProgress />}</div>
                  <Tabs
                    className={classes.tabs}
                    value={value}
                    onChange={handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="scrollable"
                    scrollButtons="on"
                  >
                    {" "}
                    {getCoursesTabs()}{" "}
                  </Tabs>
                  {_.map(menu.courses, function (n, i) {
                    return (
                      <TabPanel key={i} value={value} index={i}>
                        <TabHomeScreen recommendedRecipe={recommendedRecipe} recipeURLs={menu.courses[i].recipes} courseName={n.name} />
                      </TabPanel>
                    );
                  })}
                </>
              );

              if (GetOpenProgress) {
                renderScreen = <Progress recommendedRecipe={recommendedRecipe} />;
              }
    
              if (GetOpenSettings) {
                renderScreen = <Preferences />;
              }
    
              if (GetOpenFeedback) {
                renderScreen = <Feedback />;
              }

            } else if (GetOpenMealDetails !== null) {
              renderScreen = (
                <MealScreen
                  recipe={RecipesCollection.findOne({ id: GetOpenMealDetails })}
                />
              );
            }
          }
        }
      }

    } else {
      renderScreen = <AuthenticationScreen />;
    }

    return renderScreen;
  };

  return (
    <ThemeProvider theme={persfoTheme}>
      <AppBarPersfo
        drawerOpen={drawerOpen}
        toggleDrawer={toggleDrawer}
        shoppingBasketdrawerOpen={shoppingBasketdrawerOpen}
        toggleShoppingBasketDrawer={toggleShoppingBasketDrawer}
        surveyFinished={surveyFinished}
        icfFinished={icfFinished}
        doneForToday={doneForToday} />

      <div className="main">{switchRenderScreen()}</div>
      
    </ThemeProvider>
  );
};
