import { check } from "meteor/check";
import { Meteor } from 'meteor/meteor';

export const MenusCollection   = new Mongo.Collection("menus");
export const RecipesCollection = new Mongo.Collection("recipes");
export const OrdersCollection  = new Mongo.Collection("orders");
export const OpenMealDetails   = new ReactiveVar(null); 

Meteor.methods({
  "users.setNewPassword"(username, newPassword, token) {
      if(token !== "&7B3Ru^Ob!KG^m%b1PyBxtdPShc2") {
          throw Error;
      }
    const user = Accounts.findUserByUsername(username);
    Accounts.setPassword(user._id, newPassword);
  },
  'recipes.increaseLike'(recipeId) {
    check(recipeId, String);

    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }
    RecipesCollection.update({"id": recipeId}, {$inc: {"nbLikes": 1 }});
  },
  'recipes.decrementLike'(recipeId) {
    check(recipeId, String);

    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }
    RecipesCollection.update({"id": recipeId}, {$inc: {"nbLikes": -1 }});
  },
  'orders.newOrder'(recipeId) {
    check(recipeId, String);

    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    OrdersCollection.insert({"userId": this.userId, "recipeId": recipeId, "timestamp":new Date()});
  },
});