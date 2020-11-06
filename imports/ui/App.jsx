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
import { grey } from "@material-ui/core/colors";
import { red } from "@material-ui/core/colors";

import Avatar from "@material-ui/core/Avatar";

import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";

import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import FavoriteIcon from "@material-ui/icons/Favorite";

import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";

import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";
import { Paper } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";

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
    }
  },
});

const useStyles = makeStyles((persfoTheme) => ({
  headerTitle: {
    marginTop: persfoTheme.spacing(5),
  },
  recommendedCard: {
    marginRight: -persfoTheme.spacing(2),
    marginTop: persfoTheme.spacing(2),
    borderRadius: "40px 0px 0px 40px",
  },
  otherPaper: {
    display: 'flex',
    // alignItems: 'center',
    marginTop: persfoTheme.spacing(1),
    borderRadius: "40px",
    width: "180px",
    // float: "center",
  },
  otherMenuImage: {
    marginTop: persfoTheme.spacing(2),
    width: persfoTheme.spacing(12),
    height: persfoTheme.spacing(12),
    alignItems: "center",
    margin: "auto"
  },
  otherMenuTitle: {
    // alignItems: "center",
    // margin: "auto"
  },
  otherElement: {
    alignItems: "center",
    margin: "auto"
  },
  info: {
    position: "relative",
    top: persfoTheme.spacing(0.5),
    left: persfoTheme.spacing(1),
  },
  menuImage: {
    margin: persfoTheme.spacing(1),
    width: persfoTheme.spacing(12),
    height: persfoTheme.spacing(12),
  },
  menuTitle: {
    marginTop: persfoTheme.spacing(2),
    marginLeft: persfoTheme.spacing(4),
  },
  nutriscore: {
    marginTop: persfoTheme.spacing(2),
    marginLeft: persfoTheme.spacing(4),
    width: "75px",
    height: "25px",
  },
  otherNutriscore: {
    width: "75px",
    height: "25px",
    // alignItems: "center",
    // margin: "auto"
  },
  recommendedButtons: {
    float: "right",
    background: "#F6EBE4",
    marginRight: -persfoTheme.spacing(2),
    marginTop: persfoTheme.spacing(1),
  },
  heartButton: {
    marginRight: persfoTheme.spacing(1),
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

  const [nbLikesDummy, increaseLike] = useState(134);

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
                  <Typography variant="h5">
                    RECOMMENDED
                    <HelpOutlineIcon
                      className={classes.info}
                      style={{ color: grey[500] }}
                    />
                  </Typography>
                <Paper className={classes.recommendedCard}>
                  <Grid container spacing={3}>
                    <Grid item xs={2}>
                      <Avatar
                        aria-label="recipe"
                        className={classes.menuImage}
                        src="/images/pasta.jpg"
                      />
                    </Grid>
                    <Grid item xs={8}>
                      <Typography className={classes.menuTitle} variant="h5">
                        Menu long title
                      </Typography>
                      <img
                        className={classes.nutriscore}
                        src="/images/nutriA.png"
                      ></img>
                    </Grid>
                    <Grid item xs={2}>
                      <Fragment>
                        <IconButton aria-label="settings">
                          <ThumbUpIcon style={{ color: grey[300] }} />
                        </IconButton>
                        <IconButton aria-label="settings">
                          <ThumbDownIcon style={{ color: grey[300] }} />
                        </IconButton>
                      </Fragment>
                    </Grid>
                  </Grid>
                </Paper>
                <div className={classes.recommendedButtons}>
                  <ButtonGroup
                    size="large"
                    color="primary"
                    aria-label="large outlined primary button group"
                    style={{ Index: 1 }}
                  >
                    <Button onClick={() => increaseLike(nbLikesDummy + 1)}>
                      <FavoriteIcon
                        className={classes.heartButton}
                        style={{ color: red[300] }}
                      ></FavoriteIcon>{" "}
                      {nbLikesDummy}
                    </Button>
                    <Button>More info</Button>
                    <Button>Order</Button>
                  </ButtonGroup>
                </div>
                <Typography className={classes.headerTitle} variant="h5">
                  OTHER
                </Typography>

                <Paper className={classes.otherPaper}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Avatar
                        aria-label="recipe"
                        className={classes.otherMenuImage}
                        src="/images/pasta.jpg"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography className={classes.otherMenuTitle} variant="h5">
                        Menu long title
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <div className={classes.otherElement}>
                        <img
                          className={classes.otherNutriscore}
                          src="/images/nutriA.png"
                        ></img>
                      </div>
                    </Grid>
                  </Grid>
                </Paper>

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
