import Box from "@material-ui/core/Box";
import { createMuiTheme, makeStyles } from "@material-ui/core/styles";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";

import { ThemeProvider } from "@material-ui/styles";
import { useTracker } from "meteor/react-meteor-data";
import React, { Fragment, useState, useEffect } from "react";
import { MenusCollection } from "../db/MenusCollection";
import { AppBarPersfo } from "./AppBarPersfo";

import { LoginForm } from "./LoginForm";
import { TabHomeScreen } from "./TabHomeScreen";

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
  },
});

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return <div {...other}>{value === index && <Box>{children}</Box>}</div>;
}

export const App = () => {
  // account logic
  const user = useTracker(() => Meteor.user());

  // tab logic
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const { menu, isLoading } = useTracker(() => {
    const noDataAvailable = {
      menu: {
        courses: [
          { name: "empty", recipes: [] },
          { name: "empty", recipes: [] },
          { name: "empty", recipes: [] },
          { name: "empty", recipes: [] },
          { name: "empty", recipes: [] },
          { name: "empty", recipes: [] },
        ],
      },
    };
    if (!Meteor.user()) {
      return noDataAvailable;
    }
    const handler = Meteor.subscribe("menus");

    if (!handler.ready()) {
      return { ...noDataAvailable, isLoading: true };
    }

    const menu = MenusCollection.find().fetch()[0];

    return { menu };
  });

  function getCoursesTabs() {
    if (!isLoading) {
      console.log(menu);
      return menu.courses.map((course) => (
        <Tab key={course.name} label={course.name} />
      ));
    }
  }

  return (
    <ThemeProvider theme={persfoTheme}>
      <AppBarPersfo />

      <div className="main">
        {user ? (
          <Fragment>
            <div>{isLoading && <div className="loading">loading...</div>}</div>
            <Tabs
              value={value}
              onChange={handleChange}
              indicatorColor="primary"
              textColor="primary"
              variant="scrollable"
              scrollButtons="auto"
            >
              {getCoursesTabs()}
            </Tabs>

            <TabPanel value={value} index={0}>
              <TabHomeScreen recipeURLs={menu.courses[0].recipes}></TabHomeScreen>
            </TabPanel>

            <TabPanel value={value} index={1}>
              <TabHomeScreen recipeURLs={menu.courses[1].recipes}></TabHomeScreen>
            </TabPanel>

            <TabPanel value={value} index={2}>
              <TabHomeScreen recipeURLs={menu.courses[2].recipes}></TabHomeScreen>
            </TabPanel>
          </Fragment>
        ) : (
          <LoginForm />
        )}
      </div>
    </ThemeProvider>
  );
};
