import { Button, Divider, Fab, SwipeableDrawer, Typography } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from "@material-ui/core/styles";
import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";
import React, { useState } from "react";
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
    header: {
        margin: "20px",
        alignSelf: "center"
    },
    complete: {
        margin: "10px"
    }
}));

class GroupedButtons extends React.Component {
    state = { counter: 1 };

    handleIncrement = () => {
        this.setState(state => ({ counter: state.counter + 1 }));
    };

    handleDecrement = () => {
        if (this.state.counter > 0) {
            this.setState(state => ({ counter: state.counter - 1 }));
        }
    };
    render() {
        const displayCounter = this.state.counter > 0;

        return (
            <ButtonGroup size="small" aria-label="small outlined button group" orientation="vertical">
                <Button onClick={this.handleIncrement}>+</Button>
                <Button variant="contained" disabled>{this.state.counter}</Button>
                <Button onClick={this.handleDecrement}>-</Button>
            </ButtonGroup>
        );
    }
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

    const handleRemove = (order) => () => {
        console.log(order);
        Meteor.call('orders.handleOrder', order.recipeId);
    };

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
                                    <GroupedButtons className={classes.counterButtons}></GroupedButtons>
                                    {/* <ListItemSecondaryAction>
                                <HighlightOffIcon
                                    onClick={handleRemove(value)}
                                />
                            </ListItemSecondaryAction> */}
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
        </SwipeableDrawer>
    );
};
