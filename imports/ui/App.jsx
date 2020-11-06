import React, { useState, Fragment } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";

import { useTracker } from "meteor/react-meteor-data";
import { TasksCollection } from "/imports/db/TasksCollection";
import { Task } from "./Task";
import { TaskForm } from "./TaskForm";
import { LoginForm } from "./LoginForm";
import { AppBarPersfo } from "./AppBarPersfo";
import AppBar from "@material-ui/core/AppBar";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import Box from "@material-ui/core/Box";

import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { purple } from '@material-ui/core/colors';

const persfoTheme = createMuiTheme({
  palette: {
    primary: {
      // Purple and green play nicely together.
      main: "#F57D20",
    },
    secondary: {
      // Purple and green play nicely together.
      main: "#fff",
    },
  },
});

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
  const logout = () => Meteor.logout();

  // tab logic
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // old
  const [hideCompleted, setHideCompleted] = useState(false);

  const hideCompletedFilter = { isChecked: { $ne: true } };

  const userFilter = user ? { userId: user._id } : {};

  const pendingOnlyFilter = { ...hideCompletedFilter, ...userFilter };

  const { tasks, pendingTasksCount, isLoading } = useTracker(() => {
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

  const pendingTasksTitle = pendingTasksCount
    ? "(" + pendingTasksCount + ")"
    : "";

  return (
    <ThemeProvider theme={persfoTheme}>
    <div className="app">
      <AppBarPersfo />
      <Tabs
        value={value}
        onChange={handleChange}
        indicatorColor="primary"
        textColor="primary"
      >
        <Tab label="LUNCH" />
        <Tab label="SMOOTHIE" />
        <Tab label="SNACK" />
      </Tabs>
      <TabPanel value={value} index={0}>
        Item One
      </TabPanel>
      <TabPanel value={value} index={1}>
        Item Two
      </TabPanel>
      <TabPanel value={value} index={2}>
        <div className="main">
          {user ? (
            <Fragment>
              <div className="user" onClick={logout}>
                {user.username}🚪
              </div>
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
            </Fragment>
          ) : (
            <LoginForm />
          )}
        </div>
      </TabPanel>
    </div>
    </ThemeProvider>
  );
};
