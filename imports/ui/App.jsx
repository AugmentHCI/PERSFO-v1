import Box from "@material-ui/core/Box";
import { grey } from "@material-ui/core/colors";
import { createMuiTheme, makeStyles } from "@material-ui/core/styles";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import Typography from "@material-ui/core/Typography";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import { ThemeProvider } from "@material-ui/styles";
import { useTracker } from "meteor/react-meteor-data";
import React, { Fragment, useState } from "react";
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
  }
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
    height: Math.min(400, (window.innerHeight - 300)) + "px",
    margin: persfoTheme.spacing(1),
  }
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

  // old
  // const [hideCompleted, setHideCompleted] = useState(false);

  // const hideCompletedFilter = { isChecked: { $ne: true } };

  // const userFilter = user ? { userId: user._id } : {};

  // const pendingOnlyFilter = { ...hideCompletedFilter, ...userFilter };

  // const { tasks, isLoading } = useTracker(() => {
  //   const noDataAvailable = { tasks: [], pendingTasksCount: 0 };
  //   if (!Meteor.user()) {
  //     return noDataAvailable;
  //   }
  //   const handler = Meteor.subscribe("tasks");

  //   if (!handler.ready()) {
  //     return { ...noDataAvailable, isLoading: true };
  //   }

  //   const tasks = TasksCollection.find(
  //     hideCompleted ? pendingOnlyFilter : userFilter,
  //     {
  //       sort: { createdAt: -1 },
  //     }
  //   ).fetch();
  //   const pendingTasksCount = TasksCollection.find(pendingOnlyFilter).count();

  //   return { tasks, pendingTasksCount };
  // });

  return (
    <ThemeProvider theme={persfoTheme}>
        <AppBarPersfo/>

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
                <Tab label="LUNCH" />
                <Tab label="SMOOTHIE" />
                <Tab label="SNACK" />
                <Tab label="DESSERT" />
                <Tab label="DRINKS" />
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
                {/* <TaskForm user={user} />
                <div className="filter">
                  <button onClick={() => setHideCompleted(!hideCompleted)}>
                    {hideCompleted ? "Show All" : "Hide Completed"}
                  </button>
                </div>

                {isLoading && <div className="loading">loading...</div>}

                <ul className="tasks">
                  {tasks.map((task) => (
                    <Task
                      key={task._id}
                      task={task}
                      onCheckboxClick={toggleChecked}
                      onDeleteClick={deleteTask}
                    />
                  ))}
                </ul> */}
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
