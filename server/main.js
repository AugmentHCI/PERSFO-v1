import { Accounts } from "meteor/accounts-base";
import { Meteor } from "meteor/meteor";
import { LogsCollection, OrdersCollection } from "../imports/api/methods";
import "/imports/api/apiPersfo";
import { initData } from "/imports/api/apiPersfo";
import "/imports/api/methods.js";
import {
  MenusCollection,
  RecipesCollection,
  RecommendedRecipes,
  UserPreferences,
} from "/imports/api/methods.js";

// hack to create the RecipesCollection. Upsert does not create a collection.
RecipesCollection.insert({
  _id: "1",
  value: "hack to create collection in meteor",
});
RecipesCollection.remove({ _id: "1" });
MenusCollection.insert({
  _id: "1",
  value: "hack to create collection in meteor",
});
MenusCollection.remove({ _id: "1" });
RecommendedRecipes.insert({
  _id: "1",
  value: "hack to create collection in meteor",
});
RecommendedRecipes.remove({ _id: "1" });
UserPreferences.insert({
  _id: "1",
  value: "hack to create collection in meteor",
});
UserPreferences.remove({ _id: "1" });

const SEED_USERNAME = "demo";
const SEED_PASSWORD = "persfo";

Meteor.publish("menus", function publishTasks() {
  return MenusCollection.find();
});

Meteor.publish("recipes", function publishTasks() {
  return RecipesCollection.find();
});

Meteor.publish("recommendedrecipes", function publishTasks() {
  return RecommendedRecipes.find({ userid: this.userId });
});

Meteor.publish("userpreferences", function publishTasks() {
  return UserPreferences.find({ userid: this.userId });
});

Meteor.publish("orders", function publishTasks() {
  return OrdersCollection.find({ userid: this.userId });
});

Meteor.publish("logs", function publishTasks() {
  return LogsCollection.find({ userid: this.userId });
});

Meteor.publish('userData', function () {
  if (this.userId) {
    return Meteor.users.find({ _id: this.userId }, {
      fields: { createdAt: 1 }
    });
  } else {
    this.ready();
  }
});
Meteor.startup(() => {
  if (!Accounts.findUserByUsername(SEED_USERNAME)) {
    Accounts.createUser({
      username: SEED_USERNAME,
      password: SEED_PASSWORD,
    });
  }

  initData();

});
