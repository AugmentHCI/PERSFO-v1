import { check } from 'meteor/check';
import { LogsCollection } from '/imports/db/logs/LogsCollection';

Meteor.methods({
    "log"(component, method, extra) {
        check(component, String);
        check(method, String);

        if (!this.userId) {
            throw new Meteor.Error("Not authorized.");
        }

        if (extra) {
            LogsCollection.insert({
                userid: this.userId,
                component: component,
                method: method,
                extra: extra,
                timestamp: new Date(),
            });
        } else {
            LogsCollection.insert({
                userid: this.userId,
                component: component,
                method: method,
                timestamp: new Date(),
            });
        }

    },
});