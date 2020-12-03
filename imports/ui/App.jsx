import Box from "@material-ui/core/Box";
import { createMuiTheme, makeStyles } from "@material-ui/core/styles";
import React, { Fragment, useState } from "react";
import { ThemeProvider }   from "@material-ui/styles";
import { useTracker }      from "meteor/react-meteor-data";

import { AppBarPersfo }    from "./AppBarPersfo";
import { AuthenticationScreen } from "./AuthenticationScreen";
import { TabHomeScreen } from "./TabHomeScreen";

import { MenusCollection } from '/imports/api/methods.js';

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

  const { menu, isLoading } = useTracker(() => {
    const noDataAvailable = { menu: { courses: [], }, };
    const handler = Meteor.subscribe("menus");
    if (!Meteor.user()) { return noDataAvailable; }
    if (!handler.ready()) { return { ...noDataAvailable, isLoading: true }; }
    const menu = MenusCollection.findOne();
    return { menu };
  });

  const getCoursesTabs = () => {
    if (!isLoading) {
      return menu.courses.map((course) => (
        <Tab style={{minHeight: '32px'}} key={course.name} label={course.name} />
      ));
    }
  };

  const getTabs = () => {
    let tabPanels = [];
    for (let i = 0; i < menu.courses.length; i++) {
      tabPanels.push();
    }
    return tabPanels;
  };

  return (
    <ThemeProvider theme={persfoTheme}>
      <AppBarPersfo drawerOpen={drawerOpen} toggleDrawer={toggleDrawer} />
      <div className="main">
        {user ?
          <Fragment>
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
          </Fragment>
        : <AuthenticationScreen /> }
      </div>
    </ThemeProvider>
  );
};
