import Avatar from '@material-ui/core/Avatar';
import Checkbox from '@material-ui/core/Checkbox';
import Container from "@material-ui/core/Container";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from "@material-ui/core/styles";
import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";
import React from "react";
import { getImage } from '../api/apiPersfo';
import { OrdersCollection } from '/imports/db/orders/OrdersCollection';
import { RecipesCollection } from '/imports/db/recipes/RecipesCollection';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';


const useStyles = makeStyles((persfoTheme) => ({
    title: {
        fontSize: "13px",
        fontWeight: 600,
        fontFamily: "Roboto",
        margin: "4px",
        marginTop: "20px",
        color: "#726f6c",
    },
}));

const componentName = "ShoppingBasket";
export const ShoppingBasket = () => {
    const classes = useStyles();

    const { orders } = useTracker(() => {
        const noDataAvailable = { orders: [] };
        const handler = Meteor.subscribe("orders");
        if (!handler.ready()) {
          return { ...noDataAvailable };
        }
    
        const orders = OrdersCollection.find({
          userid: Meteor.userId()
        }).fetch();
        console.log(orders);
        return { orders };
      });

    const handleRemove = (order) => () => {
        console.log(order);
      Meteor.call('orders.handleOrder', order.recipeId);
    };

    return (
        <Container component="main" maxWidth="xs">
            <List dense className={classes.root}>
                {orders.map((value) => {
                    const labelId = `checkbox-list-secondary-label-${value.recipeId}`;
                    return (
                        <ListItem key={value.recipeId} button>
                            <ListItemAvatar>
                                <Avatar
                                    alt={`Avatar n°${value.recipeId}`}
                                    src={getImage(RecipesCollection.findOne({ id: value.recipeId }))}
                                />
                            </ListItemAvatar>
                            <ListItemText id={labelId} primary={RecipesCollection.findOne({ id: value.recipeId }).name} />
                            <ListItemSecondaryAction>
                                <HighlightOffIcon
                                    onClick={handleRemove(value)}
                                />
                            </ListItemSecondaryAction>
                        </ListItem>
                    );
                })}
            </List>
        </Container>
    );
};
