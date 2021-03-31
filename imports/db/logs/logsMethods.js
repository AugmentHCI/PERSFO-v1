import { check } from 'meteor/check';
import { LogsCollection } from '/imports/db/logs/LogsCollection';

Meteor.methods({
    log(component, method) {
        check(component, String);
        check(method, String);

        if (!this.userId) {
            throw new Meteor.Error("Not authorized.");
        }

        LogsCollection.insert({
            userid: this.userId,
            component: component,
            method: method,
            timestamp: new Date(),
        });
    }
});