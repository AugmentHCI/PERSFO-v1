import { Meteor } from 'meteor/meteor';
import { MenusCollection } from '/imports/db/MenusCollection';
import { TasksCollection } from '/imports/db/TasksCollection';

Meteor.publish('tasks', function publishTasks() {
  return TasksCollection.find({ userId: this.userId });
});

Meteor.publish('menus', function publishTasks() {
  return MenusCollection.find();
});