import { CircularProgress, Tab, Tabs } from "@material-ui/core/";
import Box from "@material-ui/core/Box";
import { createTheme, makeStyles } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import { useTracker } from "meteor/react-meteor-data";
import React, { useState } from "react";
import { AppBarPersfo } from "./AppBarPersfo";
import { AuthenticationScreen } from "./AuthenticationScreen";
import { Feedback } from "./Feedback";
import { MealScreen } from "./MealScreen";
import { Onboarding } from "./Onboarding";
import { Preferences } from "./Preferences";
import { Progress } from "./Progress";
import { ShoppingBasket } from "./ShoppingBasket";
import { SurveyForm } from "./SurveyForm";
import { TabHomeScreen } from "./TabHomeScreen";
import {
  OpenFeedback, OpenMealDetails,
  OpenProgress,
  OpenSettings,
  OpenSurvey,
  OpenShoppingBasket
} from "/imports/api/methods.js";
import { MenusCollection } from '/imports/db/menus/MenusCollection';
import { RecipesCollection } from '/imports/db/recipes/RecipesCollection';

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
      },
    },
    MuiButton: {
      outlined: {
        borderRadius: "75px 75px 75px 75px",
        borderColor: "#F6EBE4",
        color: "#222222",
        boxShadow: "10px",
      },
    },
  },
});

const useStyles = makeStyles((persfoTheme) => ({
  tabs: {
    display: "flex",
    width: "100%",
    alignItems: "center",
    height: "38px",
  },
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return <div {...other}>{value === index && <Box>{children}</Box>}</div>;
}

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
    GetOpenSurvey,
    GetOpenShoppingBasket,
    menu,
    isLoading,
  } = useTracker(() => {
    const GetOpenMealDetails = OpenMealDetails.get();
    const noDataAvailable = { menu: { courses: [] } };
    const handler = Meteor.subscribe("menus");
    const recipesHandler = Meteor.subscribe("recipes");
    const preferencesHandler = Meteor.subscribe("userpreferences");

    const GetOpenProgress = OpenProgress.get();
    const GetOpenSettings = OpenSettings.get();
    const GetOpenFeedback = OpenFeedback.get();
    const GetOpenSurvey = OpenSurvey.get();
    const GetOpenShoppingBasket = OpenShoppingBasket.get();


    if (!Meteor.user()) {
      return noDataAvailable;
    }
    if (!handler.ready()) {
      return { ...noDataAvailable, isLoading: true };
    }
    if (!recipesHandler.ready()) {
      return { ...noDataAvailable, isLoading: true };
    }
    if (!preferencesHandler.ready()) {
      return { ...noDataAvailable, isLoading: true };
    }

    // wait for menus, recipes, AND userpreferences to load before initializing recommendations
    // recalculate new recommendation on every app startup
    Meteor.call("recommender.updateRecommendations");

    // pick specific date for demo
    let menu = MenusCollection.findOne({ starting_date: "2020-12-17" });
    // console.log(menu);
    // let menu = MenusCollection.findOne({
    //   starting_date: new Date().toISOString().substring(0, 10),
    // });
    // pick random menu when no menu available today
    if (!menu) menu = MenusCollection.findOne();
    return { GetOpenMealDetails, GetOpenProgress, GetOpenSettings, GetOpenFeedback, GetOpenSurvey, GetOpenShoppingBasket, menu };
  });

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
                  <TabHomeScreen recipeURLs={menu.courses[i].recipes} courseName={n.name} />
                </TabPanel>
              );
            })}
          </>
        );
      } else if (GetOpenMealDetails !== null) {
        renderScreen = (
          <MealScreen
            recipe={RecipesCollection.findOne({ id: GetOpenMealDetails })}
          />
        );
      }

      if (GetOpenProgress) {
        renderScreen = <Progress />;
      }

      if (GetOpenSettings) {
        renderScreen = <Preferences />;
      }

      if (GetOpenFeedback) {
        renderScreen = <Feedback />;
      }

      if (GetOpenSurvey) {
        renderScreen = <SurveyForm />;
      }

      if (GetOpenShoppingBasket) {
        renderScreen = <ShoppingBasket />;
      }

      // TODO
      // renderScreen = <ShoppingBasket />;

    } else {
      renderScreen = <AuthenticationScreen />;
    }

    return renderScreen;
  };

  return (
    <ThemeProvider theme={persfoTheme}>
      <AppBarPersfo drawerOpen={drawerOpen} toggleDrawer={toggleDrawer} />
      <div className="main">{switchRenderScreen()}</div>
    </ThemeProvider>
  );
};
