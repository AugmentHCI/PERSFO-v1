import Box from "@material-ui/core/Box";
import { grey } from "@material-ui/core/colors";
import { createMuiTheme, makeStyles } from "@material-ui/core/styles";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import Typography from "@material-ui/core/Typography";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import { ThemeProvider } from "@material-ui/styles";
import { useTracker } from "meteor/react-meteor-data";
import React, { Fragment, useState, useEffect } from "react";
import { MenusCollection } from "../db/MenusCollection";
import { AppBarPersfo } from "./AppBarPersfo";
import { CardOtherMeal } from "./CardOtherMeal";
import { CardRecommendedMeal } from "./CardRecommededMeal";
import { LoginForm } from "./LoginForm";

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

const useStyles = makeStyles((persfoTheme) => ({
  headerTitle: {
    margin: persfoTheme.spacing(1),
  },
  root: {
    margin: 0,
  },
  info: {
    position: "relative",
    top: persfoTheme.spacing(0.5),
    left: persfoTheme.spacing(1),
  },
  otherMeals: {
    display: "flex",
    overflowX: "auto",
    height: Math.min(400, window.innerHeight - 360) + "px",
    margin: persfoTheme.spacing(1),
  },
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return <div {...other}>{value === index && <Box>{children}</Box>}</div>;
}

// const toggleChecked = ({ _id, isChecked }) => {
//   Meteor.call("tasks.setIsChecked", _id, !isChecked);
// };

// const deleteTask = ({ _id }) => {
//   Meteor.call("tasks.remove", _id);
// };

export const App = () => {
  // account logic
  const user = useTracker(() => Meteor.user());

  // tab logic
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // styling
  const classes = useStyles();

  // const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   fetchData();
  // }, []);

  // const fetchData = () => {
  //   setLoading(true);
  //       Meteor.call("getRecipes", (error, result) => {
  //     if (error) {
  //       console.log(error)
  //       setLoading(false);
  //     } else {
  //       // for(recipe in result.data.results) {
  //         console.log(result);
  //       // }
  //       setLoading(false);
  //     }
  //   });
  // };

  // old
  // const [hideCompleted, setHideCompleted] = useState(false);

  // const hideCompletedFilter = { isChecked: { $ne: true } };

  // const userFilter = user ? { userId: user._id } : {};

  // const pendingOnlyFilter = { ...hideCompletedFilter, ...userFilter };

  const { menus, isLoading } = useTracker(() => {
    const noDataAvailable = { menus: [] };
    if (!Meteor.user()) {
      return noDataAvailable;
    }
    const handler = Meteor.subscribe("menus");

    if (!handler.ready()) {
      return { ...noDataAvailable, isLoading: true };
    }

    const menus = MenusCollection.find().fetch();

    return { menus };
  });

  function getCourses() {
    if (!isLoading) {
      console.log(menus[0]);
      return menus[0].courses.map((course) => (
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
            <Tabs
              value={value}
              onChange={handleChange}
              indicatorColor="primary"
              textColor="primary"
              variant="scrollable"
              scrollButtons="auto"
            >
              {getCourses()}
            </Tabs>

            <TabPanel value={value} index={0}>
              <Typography variant="h6" className={classes.headerTitle}>
                RECOMMENDED
                <HelpOutlineIcon
                  className={classes.info}
                  style={{ color: grey[500] }}
                />
              </Typography>

              <CardRecommendedMeal></CardRecommendedMeal>

              <Box m={5}></Box>

              <Typography className={classes.headerTitle} variant="h6">
                OTHER
              </Typography>

              <Box className={classes.otherMeals}>
                <CardOtherMeal></CardOtherMeal>
                <CardOtherMeal></CardOtherMeal>
                <CardOtherMeal></CardOtherMeal>
                <CardOtherMeal></CardOtherMeal>
                <CardOtherMeal></CardOtherMeal>
              </Box>
            </TabPanel>

            <TabPanel value={value} index={1}>
              <div>
                {isLoading && <div className="loading">loading...</div>}
              </div>
            </TabPanel>

            <TabPanel value={value} index={2}>
              Item Three
            </TabPanel>
          </Fragment>
        ) : (
          <LoginForm />
        )}
      </div>
    </ThemeProvider>
  );
};
