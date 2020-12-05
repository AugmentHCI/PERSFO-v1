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
  "recipes.handleLike"(recipeId) {
    check(recipeId, String);

    if (!this.userId) {
      throw new Meteor.Error("Not authorized.");
    }

    if (
      UserPreferences.find({
        userid: this.userId,
        likedRecipes: { $in: [recipeId] },
      }).fetch().length > 0
    ) {
      // recipe was already liked
      RecipesCollection.update({ id: recipeId }, { $inc: { nbLikes: -1 } });
      UserPreferences.update(
        { userid: this.userId },
        { $pull: { likedRecipes: recipeId } }
      );
    } else {
      RecipesCollection.update({ id: recipeId }, { $inc: { nbLikes: 1 } });
      UserPreferences.upsert(
        { userid: this.userId },
        { $addToSet: { likedRecipes: recipeId } }
      );
    }
  },
  "orders.handleOrder"(recipeId) {
    check(recipeId, String);

    if (!this.userId) {
      throw new Meteor.Error("Not authorized.");
    }

    // check if order was already made today
    const now = new Date();
    let start = new Date();
    start.setHours(0, 0, 0, 0);
    console.log(start);
    let end = new Date();
    end.setHours(23, 59, 59, 999);
    const orders = OrdersCollection.find({
      userid: this.userId,
      recipeId: recipeId,
      timestamp: { $gte: start, $lt: end },
    }).fetch();
    const ordered = orders.length > 0;

    // if not ordered yet today, add the order
    if (!ordered) {
      OrdersCollection.insert({
        userid: this.userId,
        recipeId: recipeId,
        timestamp: now,
        orderday: now.toISOString().substring(0,10)
      });
    } else {
      // user cancelled order
      OrdersCollection.remove({
        userid: this.userId,
        recipeId: recipeId,
        orderday: now.toISOString().substring(0,10)
      });
    }
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

    // filter recipes without an image and/or no nutrient data
    todaysRecipes = _.filter(todaysRecipes, (recipe) => {
      return recipe.main_image !== null && recipe.kcal > 0;
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
