import Box from "@material-ui/core/Box";
import { createMuiTheme, makeStyles } from "@material-ui/core/styles";
import React, { Fragment, useState } from "react";
import { ThemeProvider }   from "@material-ui/styles";
import { useTracker }      from "meteor/react-meteor-data";

import { AppBarPersfo }    from "./AppBarPersfo";
import { AuthenticationScreen } from "./AuthenticationScreen";
import { TabHomeScreen } from "./TabHomeScreen";

import { MenusCollection, OpenMealDetails, RecipesCollection, OpenProgress, OpenSettings } from '/imports/api/methods.js';

import { MealScreen } from "./MealScreen";

import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";

const persfoTheme = createMuiTheme({
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
        borderRadius: "0px 0px 75px 0px",
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
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    height: '38px'
  }
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return <div {...other}>{value === index && <Box>{children}</Box>}</div>;
}

export const App = () => {

  // account logic
  const classes = useStyles();
  const user = useTracker(() => Meteor.user());
  const [drawerOpen, setState] = useState(false);
  const toggleDrawer = (open) => (event) => { if (event && event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) { return; } setState(open); };

  // tab logic
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => { setValue(newValue); };

  const { GetOpenMealDetails, GetOpenProgress, GetOpenSettings, menu, isLoading } = useTracker(() => {
    const GetOpenMealDetails = OpenMealDetails.get();
    const noDataAvailable = { menu: { courses: [], }, };
    const handler = Meteor.subscribe("menus");
    const recipesHandler = Meteor.subscribe("recipes");

    const GetOpenProgress = OpenProgress.get();
    const GetOpenSettings = OpenSettings.get();

    if (!Meteor.user()) { return noDataAvailable; }
    if (!handler.ready()) { return { ...noDataAvailable, isLoading: true }; }
    if (!recipesHandler.ready()) { return { ...noDataAvailable, isLoading: true }; }

    // wait for menus and recipes to load before initializing recommendations
    // recalculate new recommendation on every app startup
    Meteor.call('recommender.updateRecommendations')

    // let menu = MenusCollection.find({"starting_date": "2020-12-18"}).fetch(); // pick random date for testing
    let menu = MenusCollection.find({"starting_date": new Date().toISOString().substring(0,10)}).fetch();
    if(menu && menu.length > 0) {
      menu = menu[0];
    } else {
      menu = MenusCollection.findOne();
    }
    return { GetOpenMealDetails, GetOpenProgress, GetOpenSettings, menu };
  });

  const getCoursesTabs = () => {
    if (!isLoading) {
      return menu.courses.map((course) => (
        <Tab style={{minHeight: '32px'}} key={course.name} label={course.name} />
      ));
    }
  };

  const switchRenderScreen = () => {
    let renderScreen;
    if(user) {
      if(GetOpenMealDetails == null) {
        renderScreen = <React.Fragment>
        <div>{isLoading && <div className="loading">loading...</div>}</div>
        <Tabs
        className={classes.tabs}
        value={value}
        onChange={handleChange}
        indicatorColor="primary"
        textColor="primary"
        variant="scrollable"
        scrollButtons="on"> {getCoursesTabs()} </Tabs>
        {
          _.map(menu.courses, function(n,i) {
            return <TabPanel key={i} value={value} index={i}><TabHomeScreen recipeURLs={menu.courses[i].recipes} /></TabPanel>
          })
        }
        </React.Fragment>;
      } else if (GetOpenMealDetails !== null) {
        renderScreen = <MealScreen recipe={RecipesCollection.findOne({id: GetOpenMealDetails})}/>
      }

      if (GetOpenProgress) {
        renderScreen = 'Progress';
      }

      if (GetOpenSettings) {
        renderScreen = 'Settings';
      }

    } else {
      renderScreen = <AuthenticationScreen />;
    }
    return renderScreen;
  }

  return (
    <ThemeProvider theme={persfoTheme}>
      <AppBarPersfo drawerOpen={drawerOpen} toggleDrawer={toggleDrawer} />
      <div className="main">
      { switchRenderScreen() }
      </div>
    </ThemeProvider>
  );
};
