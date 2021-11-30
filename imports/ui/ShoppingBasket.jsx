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
        marginTop: "20px",
        alignSelf: "center"
    },
    complete: {
        margin: "10px",
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

    const { orders, totalPrice } = useTracker(() => {
        const noDataAvailable = { orders: [], totalPrice: 0 };
        const handler = Meteor.subscribe("orders");
        const recipeHandler = Meteor.subscribe("recipes");

        if (!handler.ready() || !recipeHandler.ready()) {
            return { ...noDataAvailable };
        }

        // find only orders made today
        const now = new Date();
        const orders = OrdersCollection.find({
            userid: Meteor.userId(),
            orderday: now.toISOString().substring(0, 10),
        }).fetch();

        let totalPriceTemp = 0;
        orders.forEach(order => {
            const recipe = RecipesCollection.findOne({ id: order.recipeId });
            totalPriceTemp += (recipe.current_sell_price.pricing * order.amount);
        });

        const totalPrice = totalPriceTemp;

        return { orders, totalPrice };
    });

    const [openConfirmation, setOpenConfirmation] = useState(false);

    const [deletedRecipe, setDeletedRecipe] = useState({ name: "", recipeId: "" });
    const [deletedOrderAmount, setDeletedOrderAmount] = useState(0);

    const handleRemove = (order) => () => {
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
        Meteor.call('orders.undoRemoveOrder', deletedRecipe.id, deletedOrderAmount);
        setOpenConfirmation(false);
    };

    const submit = () => {
        Meteor.call('orders.confirmOrders');
        toggleDrawer(false).call(); // not sure why call is needed here, but does not work without.
    }

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
            <Divider/>
            {orders.length > 0 ?
                <div
                    style={{
                        overflowY: "scroll",
                        height: componentHeight - 120 + "px",
                    }}
                >
                    <List className={classes.list}>
                        {orders.map((value) => {
                            const labelId = `checkbox-list-secondary-label-${value.recipeId}`;
                            const recipe = RecipesCollection.findOne({ id: value.recipeId });
                            return (
                                <Fragment key={value.recipeId}>
                                    <ListItem button>
                                        <ListItemAvatar>
                                            <Avatar
                                                alt={`Avatar n°${value.recipeId}`}
                                                src={getImage(recipe)}
                                            />
                                        </ListItemAvatar>
                                        <ListItemText id={labelId} primary={recipe.name} secondary={"prijs: € " + recipe.current_sell_price.pricing.toFixed(2) }/>
                                        <DeleteIcon className={classes.deleteButtons} onClick={handleRemove(value)} style={{ color: grey[500] }} />
                                        <GroupedButtons recipeId={value.recipeId} className={classes.counterButtons}></GroupedButtons>
                                    </ListItem>
                                    <Divider variant="inset" component="li" />
                                </Fragment>
                            );
                        })}
                    </List>
                </div>
                :
                <Typography className={classes.header} variant="body1" style={{ height: componentHeight - 120 + "px" }} >
                    You have not ordered any meals yet.
                </Typography>
            }
                        <Typography className={classes.header} variant="subtitle1" color="primary">
                {"Totale prijs: € " + totalPrice.toFixed(2)}
            </Typography>
            <Button
                type="submit"
                variant="contained"
                color="primary"
                className={classes.complete}
                disabled={orders.length > 0 ? false : true}
                onClick={submit}
                style={{ color: "white" }}
            >
                Bevestig uw keuzes ({orders.reduce((s, f) => s + f.amount, 0)})
            </Button>
            <Snackbar
                open={openConfirmation}
                autoHideDuration={2500}
                onClose={handleCloseConfirmation}
                message={"Removed: " + deletedRecipe.name}
                action={action}
                className={classes.undoToast}
            />
        </SwipeableDrawer >

    );
};
