import { Container, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
import React from "react";


const useStyles = makeStyles((persfoTheme) => ({
    header: {
        margin: "20px",
    },
    complete: {
        display: "flex",
        justifyContent: "center"
    }
}));

const componentName = "Done";
export const Done = () => {

    const classes = useStyles();

    const undo = () => {
        Meteor.call("orders.undoConfirmation");
    }

    return (
        <Container>
            <Typography className={classes.header} variant="body1">
                Thank you for participating in the PERSFO study today. Your orders are confirmed.
            </Typography>
            <div className={classes.complete}>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    onClick={undo}
                    style={{ color: "white" }} >
                    Undo your orders of today
                </Button>
            </div>
        </Container>
    );
}