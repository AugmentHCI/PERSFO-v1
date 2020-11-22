import { Divider } from "@material-ui/core";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { makeStyles } from "@material-ui/core/styles";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import AssessmentIcon from "@material-ui/icons/Assessment";
import HomeIcon from "@material-ui/icons/Home";
import SettingsIcon from "@material-ui/icons/Settings";
import React from "react";
import Box from "@material-ui/core/Box";

const useStyles = makeStyles((theme) => ({
  list: {
    width: 250,
  },
  drawerImage: {
    width: 250,
    height: 107,
  },
}));

export const PersfoDrawer = ({ drawerOpen, toggleDrawer }) => {
  const classes = useStyles();

  return (
    <SwipeableDrawer
      anchor="left"
      open={drawerOpen}
      onClose={toggleDrawer(false)}
      onOpen={toggleDrawer(true)}
    >
      <Box>
        <img className={classes.drawerImage} src="/images/logo.png" />
      </Box>
      <Divider />
      <div
        className={classes.list}
        role="presentation"
        onClick={toggleDrawer(false)}
        onKeyDown={toggleDrawer(false)}
      >
        <List>
          <ListItem button key={"home"} onClick={() => console.log("home")}>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary={"Home"} />
          </ListItem>
          <ListItem
            button
            key={"progress"}
            onClick={() => console.log("progress")}
          >
            <ListItemIcon>
              <AssessmentIcon />
            </ListItemIcon>
            <ListItemText primary={"Progress"} />
          </ListItem>
          <ListItem
            button
            key={"settings"}
            onClick={() => console.log("settings")}
          >
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary={"Settings"} />
          </ListItem>
        </List>
      </div>
      {/* {list("left")} */}
    </SwipeableDrawer>
  );
};
