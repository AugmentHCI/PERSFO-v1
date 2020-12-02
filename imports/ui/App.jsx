import Box from "@material-ui/core/Box";
import { createMuiTheme } from "@material-ui/core/styles";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";

import { ThemeProvider } from "@material-ui/styles";
import { useTracker } from "meteor/react-meteor-data";
import React, { Fragment, useState } from "react";
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

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return <div {...other}>{value === index && <Box>{children}</Box>}</div>;
}

export const App = () => {
  // account logic
  const user = useTracker(() => Meteor.user());

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
  };

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

  const getCoursesTabs = () => {
    if (!isLoading) {
      return menu.courses.map((course) => (
        <Tab key={course.name} label={course.name} />
      ));
    }
  };

  const getTabs = () => {
    let tabPanels = [];
    for (let i = 0; i < menu.courses.length; i++) {
      tabPanels.push(
        <TabPanel key={"tab-" + i} value={value} index={i}>
          <TabHomeScreen recipeURLs={menu.courses[i].recipes}></TabHomeScreen>
        </TabPanel>
      );
    }
    return tabPanels;
  };

  return (
    <ThemeProvider theme={persfoTheme}>
      <AppBarPersfo drawerOpen={drawerOpen} toggleDrawer={toggleDrawer} />

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

            {getTabs()}
          </Fragment>
        ) : (
          <LoginForm />
        )}
      </div>
    </ThemeProvider>
  );
};
