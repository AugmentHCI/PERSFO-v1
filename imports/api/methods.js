import { check } from "meteor/check";
import { Meteor } from "meteor/meteor";

import { getRecipeID } from "./apiPersfo";

export const MenusCollection = new Mongo.Collection("menus");
export const RecipesCollection = new Mongo.Collection("recipes");
export const RecommendedRecipes = new Mongo.Collection("recommendedrecipes");
export const OrdersCollection = new Mongo.Collection("orders");
export const UserPreferences = new Mongo.Collection("userpreferences");

export const OpenMealDetails = new ReactiveVar(null);
export const OpenProgress = new ReactiveVar(false);
export const OpenSettings = new ReactiveVar(false);

Meteor.methods({
  "users.setNewPassword"(username, newPassword, token) {
    if (token !== "&7B3Ru^Ob!KG^m%b1PyBxtdPShc2") {
      throw Error;
    }
    const user = Accounts.findUserByUsername(username);
    Accounts.setPassword(user._id, newPassword);
  },
  "recipes.increaseLike"(recipeId) {
    check(recipeId, String);

    if (!this.userId) {
      throw new Meteor.Error("Not authorized.");
    }
    RecipesCollection.update({ id: recipeId }, { $inc: { nbLikes: 1 } });
  },
  "recipes.decrementLike"(recipeId) {
    check(recipeId, String);

    if (!this.userId) {
      throw new Meteor.Error("Not authorized.");
    }
    RecipesCollection.update({ id: recipeId }, { $inc: { nbLikes: -1 } });
  },
  "orders.newOrder"(recipeId) {
    check(recipeId, String);

    if (!this.userId) {
      throw new Meteor.Error("Not authorized.");
    }

    OrdersCollection.insert({
      userId: this.userId,
      recipeId: recipeId,
      timestamp: new Date(),
    });
  },
  "recommender.updateRecommendations"() {
    // init recommendations

    // TODO select today's course
    let todaysCourses = MenusCollection.findOne().courses;

    // Find all recipes that are available today --> TODO tailor per course
    let todaysRecipes = [];
    todaysCourses.forEach((course) => {
      todaysRecipes = todaysRecipes.concat(course.recipes);
    });
    todaysRecipes = _.map(todaysRecipes, getRecipeID);

    todaysRecipes = RecipesCollection.find({
      id: { $in: todaysRecipes },
    }).fetch();

    // Filter allergies + consider user preferences!

    // filter recipes without an image
    todaysRecipes = _.filter(todaysRecipes, (recipe) => {
      return recipe.main_image !== null;
    });

    // last step! Assign rankings
    // find recipe with lowest kcal --> TODO make smarter
    todaysRecipes = _.sortBy(todaysRecipes, ["kcal"]);
    for (let i = 0; i < todaysRecipes.length; i++) {
      todaysRecipes[i].ranking = i + 1;
    }

    // insert/update recommendations for user
    // todo only use ids! Otherwise data is duplicated in multiple object
    RecommendedRecipes.upsert(
      { userid: this.userId },
      { $set: { recommendations: todaysRecipes } }
    );
  },
});
