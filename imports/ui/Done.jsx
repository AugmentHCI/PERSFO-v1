import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
import React from "react";


const useStyles = makeStyles((persfoTheme) => ({
    header: {
        margin: "20px",
        alignSelf: "center"
    },
}));

const componentName = "Done";
export const Done = () => {

    const classes = useStyles();

    const undo = () => {
        Meteor.call("orders.undoConfirmation");
    }

    return (
        <>
            <Typography className={classes.header} variant="body1" color="primary">
                Thank you for participating in the PERSFO study today. Your orders are already confirmed.
            </Typography>
            <Button
                type="submit"
                variant="contained"
                color="primary"
                className={classes.complete}
                onClick={undo}
                style={{ color: "white" }}
            >
               Undo
            </Button>
        </>
    );
}