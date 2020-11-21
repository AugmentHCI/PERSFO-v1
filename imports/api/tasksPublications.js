import { Meteor } from 'meteor/meteor';
import { MenusCollection } from '/imports/db/MenusCollection';
import { RecipesCollection } from '/imports/db/RecipesCollection';

Meteor.publish('tasks', function publishTasks() {
  return TasksCollection.find({ userId: this.userId });
});

Meteor.publish('menus', function publishTasks() {
  return MenusCollection.find();
});

Meteor.publish('recipes', function publishTasks() {
  return RecipesCollection.find();
});