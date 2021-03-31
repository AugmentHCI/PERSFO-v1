import { OrdersCollection } from '/imports/db/orders/OrdersCollection';

Meteor.publish("orders", function publishTasks() {
    return OrdersCollection.find({ userid: this.userId });
});