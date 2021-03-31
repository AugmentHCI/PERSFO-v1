import { check } from 'meteor/check';
import { OrdersCollection } from '/imports/db/orders/OrdersCollection';

Meteor.methods({
    "orders.handleOrder"(recipeId) {
        check(recipeId, String);

        if (!this.userId) {
            throw new Meteor.Error("Not authorized.");
        }

        // check if order was already made today
        const now = new Date();
        const nowString = now.toISOString().substring(0, 10);
        const orders = OrdersCollection.find({
            userid: this.userId,
            recipeId: recipeId,
            orderday: nowString,
        }).fetch();
        const ordered = orders.length > 0;

        // if not ordered yet today, add the order
        if (!ordered) {
            OrdersCollection.insert({
                userid: this.userId,
                recipeId: recipeId,
                timestamp: now,
                orderday: nowString,
            });
        } else {
            // user cancelled order
            OrdersCollection.remove({
                userid: this.userId,
                recipeId: recipeId,
                orderday: nowString,
            });
        }
    },
});