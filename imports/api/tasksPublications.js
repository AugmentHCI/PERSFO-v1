import { Meteor } from 'meteor/meteor';
import { MenusCollection } from '/imports/db/MenusCollection';
import { RecipesCollection } from '/imports/db/RecipesCollection';

Meteor.publish('menus', function publishTasks() {
  return MenusCollection.find();
});

Meteor.publish('recipes', function publishTasks() {
  return RecipesCollection.find();
});