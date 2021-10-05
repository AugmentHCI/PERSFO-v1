import { Button, Divider, IconButton, Snackbar, SwipeableDrawer, Typography } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { grey } from '@material-ui/core/colors';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from "@material-ui/core/styles";
import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete';
import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";
import React, { Fragment, useState } from "react";
import { getImage } from '../api/apiPersfo';
import { OrdersCollection } from '/imports/db/orders/OrdersCollection';
import { RecipesCollection } from '/imports/db/recipes/RecipesCollection';



const useStyles = makeStyles((persfoTheme) => ({
    list: {
        width: 300,
    },
    title: {
        fontSize: "13px",
        fontWeight: 600,
        fontFamily: "Roboto",
        margin: "4px",
        marginTop: "20px",
        color: "#726f6c",
    },
    counterButtons: {
        maxHeight: "10px"
    },
    deleteButtons: {
        marginRight: "10px"
    },
    header: {
        margin: "20px",
        alignSelf: "center"
    },
    complete: {
        margin: "10px"
    },
    undoToast: {
        marginBottom: "40px"
    }
}));

const GroupedButtons = ({ recipeId }) => {
    // state = { counter: 1 };

    const { counter } = useTracker(() => {
        const noDataAvailable = { counter: 1 };
        const handler = Meteor.subscribe("orders");
        if (!handler.ready()) {
            return { ...noDataAvailable };
        }

        // find only orders made today
        const now = new Date();
        const order = OrdersCollection.findOne({
            userid: Meteor.userId(),
            orderday: now.toISOString().substring(0, 10),
            recipeId: recipeId
        });
        const counter = order.amount;
        return { counter };
    });

    handleIncrement = () => {
        Meteor.call('orders.incrementOrder', recipeId);
    };

    handleDecrement = () => {
        if (counter > 1) {
            Meteor.call('orders.decrementOrder', recipeId);
        }
    };

    return (
        <ButtonGroup size="small" aria-label="small outlined button group" orientation="vertical">
            <Button onClick={handleIncrement}>+</Button>
            <Button variant="contained" disabled={true}>{counter}</Button>
            <Button onClick={this.handleDecrement} disabled={counter <= 1}>-</Button>
        </ButtonGroup>
    );
}

const componentName = "ShoppingBasket";
export const ShoppingBasket = ({ drawerOpen, toggleDrawer }) => {

    const [componentHeight, setComponentHeight] = useState(window.innerHeight);
    const [heightBuffer, setHeightBuffer] = useState(
        window.innerHeight >= 640 ? 60 : 0
    );

    window.addEventListener("resize", () => {
        setComponentHeight(window.innerHeight);
        setHeightBuffer(window.innerHeight >= 640 ? 60 : 0);
    });
    const classes = useStyles();

    const { orders } = useTracker(() => {
        const noDataAvailable = { orders: [] };
        const handler = Meteor.subscribe("orders");
        if (!handler.ready()) {
            return { ...noDataAvailable };
        }

        // find only orders made today
        const now = new Date();
        const orders = OrdersCollection.find({
            userid: Meteor.userId(),
            orderday: now.toISOString().substring(0, 10),
        }).fetch();
        return { orders };
    });

    const [openConfirmation, setOpenConfirmation] = useState(false);

    const [deletedRecipe, setDeletedRecipe] = useState({ name: "", recipeId: "" });
    const [deletedOrderAmount, setDeletedOrderAmount] = useState(0);

    const handleRemove = (order) => () => {
        console.log("removed order");
        setOpenConfirmation(true);
        setDeletedOrderAmount(order.amount);
        setDeletedRecipe(RecipesCollection.findOne({ id: order.recipeId }));
        Meteor.call('orders.removeOrder', order.recipeId);
    };

    const handleCloseConfirmation = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenConfirmation(false);
    };

    const handleUndoDelete = (deletedRecipe, deletedOrderAmount) => {
        console.log("undo order");
        Meteor.call('orders.undoRemoveOrder', deletedRecipe.id, deletedOrderAmount);
        setOpenConfirmation(false);
    };

    const action = (
        <Fragment>
            <Button color="secondary" size="small" onClick={() => handleUndoDelete(deletedRecipe, deletedOrderAmount)}>
                UNDO
            </Button>
            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleCloseConfirmation}
            >
                <CloseIcon fontSize="small" />
            </IconButton>
        </Fragment>
    );

    return (

        <SwipeableDrawer
            anchor="right"
            open={drawerOpen}
            onClose={toggleDrawer(false)}
            onOpen={toggleDrawer(true)}
        >
            <Typography className={classes.header} variant="h4" color="primary">
                Shopping drawer
            </Typography>
            <div
                style={{
                    overflowY: "scroll",
                    height: componentHeight - 100 + "px",
                }}
            >
                <List className={classes.list}>
                    {orders.map((value) => {
                        const labelId = `checkbox-list-secondary-label-${value.recipeId}`;
                        return (
                            <>
                                <ListItem key={value.recipeId} button>
                                    <ListItemAvatar>
                                        <Avatar
                                            alt={`Avatar n°${value.recipeId}`}
                                            src={getImage(RecipesCollection.findOne({ id: value.recipeId }))}
                                        />
                                    </ListItemAvatar>
                                    <ListItemText id={labelId} primary={RecipesCollection.findOne({ id: value.recipeId }).name} />
                                    <DeleteIcon className={classes.deleteButtons} onClick={handleRemove(value)} style={{ color: grey[500] }} />
                                    <GroupedButtons recipeId={value.recipeId} className={classes.counterButtons}></GroupedButtons>
                                </ListItem>
                                <Divider variant="inset" component="li" />
                            </>
                        );
                    })}
                </List>
            </div>
            <Button
                type="submit"

                variant="contained"
                color="primary"
                className={classes.complete}
                // onClick={submit}
                style={{ color: "white" }}
            >
                Complete your order
            </Button>
            <Snackbar
                open={openConfirmation}
                autoHideDuration={2500}
                onClose={handleCloseConfirmation}
                message={"Removed: " + deletedRecipe.name}
                action={action}
                className={classes.undoToast}
            />
        </SwipeableDrawer>

    );
};
