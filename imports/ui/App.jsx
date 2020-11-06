import React, { useState, Fragment } from "react";

import { useTracker } from "meteor/react-meteor-data";
import { TasksCollection } from "/imports/db/TasksCollection";
import { Task } from "./Task";
import { TaskForm } from "./TaskForm";
import { LoginForm } from "./LoginForm";
import { AppBarPersfo } from "./AppBarPersfo";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { grey } from '@material-ui/core/colors';

import HelpOutlineIcon from '@material-ui/icons/HelpOutline';

import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";

const persfoTheme = createMuiTheme({
  palette: {
    primary: {
      main: "#F57D20",
    },
    secondary: {
      main: "#fff",
    },
  },
});

const useStyles = makeStyles((persfoTheme) => ({
  root: {
    flexGrow: 1,
  },
  info: {
    position: "relative",
    top: persfoTheme.spacing(0.5),
    left: persfoTheme.spacing(1),
  },
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return <div {...other}>{value === index && <Box p={3}>{children}</Box>}</div>;
}

const toggleChecked = ({ _id, isChecked }) => {
  Meteor.call("tasks.setIsChecked", _id, !isChecked);
};

const deleteTask = ({ _id }) => {
  Meteor.call("tasks.remove", _id);
};

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
  const [hideCompleted, setHideCompleted] = useState(false);

  const hideCompletedFilter = { isChecked: { $ne: true } };

  const userFilter = user ? { userId: user._id } : {};

  const pendingOnlyFilter = { ...hideCompletedFilter, ...userFilter };

  const { tasks, isLoading } = useTracker(() => {
    const noDataAvailable = { tasks: [], pendingTasksCount: 0 };
    if (!Meteor.user()) {
      return noDataAvailable;
    }
    const handler = Meteor.subscribe("tasks");

    if (!handler.ready()) {
      return { ...noDataAvailable, isLoading: true };
    }

    const tasks = TasksCollection.find(
      hideCompleted ? pendingOnlyFilter : userFilter,
      {
        sort: { createdAt: -1 },
      }
    ).fetch();
    const pendingTasksCount = TasksCollection.find(pendingOnlyFilter).count();

    return { tasks, pendingTasksCount };
  });

  return (
    <ThemeProvider theme={persfoTheme}>
      <div className="app">
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
                <Tab label="LUNCH" />
                <Tab label="SMOOTHIE" />
                <Tab label="SNACK" />
                <Tab label="DESSERT" />
                <Tab label="DRINKS" />
              </Tabs>

              <TabPanel value={value} index={0}>
                <div className={classes.root}>
                  <Typography variant="h5">
                    RECOMMENDED
                    <HelpOutlineIcon className={classes.info} style={{ color: grey[500] }} />
                  </Typography>
                </div>
              </TabPanel>
              <TabPanel value={value} index={1}>
                <TaskForm user={user} />
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
                </ul>
              </TabPanel>
              <TabPanel value={value} index={2}>
                Item Three
              </TabPanel>
            </Fragment>
          ) : (
            <LoginForm />
          )}
        </div>
      </div>
    </ThemeProvider>
  );
};