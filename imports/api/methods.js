import { check } from "meteor/check";
import { Meteor } from "meteor/meteor";

import { getRecipeID } from "./apiPersfo";

export const MenusCollection = new Mongo.Collection("menus");
export const RecipesCollection = new Mongo.Collection("recipes");
export const RecommendedRecipes = new Mongo.Collection("recommendedrecipes");
export const OrdersCollection = new Mongo.Collection("orders");
export const UserPreferences = new Mongo.Collection("userpreferences");
export const LogsCollection = new Mongo.Collection("logs");
export const FeedbackCollection = new Mongo.Collection("feedback");

export const OpenMealDetails = new ReactiveVar(null);
export const OpenProgress = new ReactiveVar(false);
export const OpenSettings = new ReactiveVar(false);
export const OpenFeedback = new ReactiveVar(false);

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
  },
  "users.setNewPassword"(username, newPassword, token) {
    if (token !== "&7B3Ru^Ob!KG^m%b1PyBxtdPShc2") {
      throw Error;
    }
    const user = Accounts.findUserByUsername(username);
    Accounts.setPassword(user._id, newPassword);
  },
  "users.addDislikes"(dislikes) {
    check(dislikes, Array);

    if (!this.userId) {
      throw new Meteor.Error("Not authorized.");
    }

    dislikes.forEach((dislike) => {
      UserPreferences.upsert(
        { userid: this.userId },
        { $addToSet: { dislikedIngredients: dislike } }
      );
    });
  },
  "users.updateAllergens"(allergens) {
    check(allergens, Array);

    if (!this.userId) {
      throw new Meteor.Error("Not authorized.");
    }

    UserPreferences.upsert(
      { userid: this.userId },
      { $set: { allergens: allergens } }
    );
  },
  "users.updateNutrientGoals"(nutrientGoals) {
    check(nutrientGoals, Object);

    if (!this.userId) {
      throw new Meteor.Error("Not authorized.");
    }

    UserPreferences.upsert(
      { userid: this.userId },
      { $set: { nutrientGoals: nutrientGoals } }
    );
  },
  "users.updateActiveNutrientGoals"(activeNutrientGoals) {
    check(activeNutrientGoals, Object);

    if (!this.userId) {
      throw new Meteor.Error("Not authorized.");
    }

    UserPreferences.upsert(
      { userid: this.userId },
      { $set: { activeNutrientGoals: activeNutrientGoals } }
    );
  },
  "users.handleLikeRecommendation"(recipeId, keep) {
    check(recipeId, String);

    if (!this.userId) {
      throw new Meteor.Error("Not authorized.");
    }

    if (!keep) {
      UserPreferences.update(
        { userid: this.userId },
        { $pull: { likedRecommendations: recipeId } }
      );
    } else {
      if (
        UserPreferences.find({
          userid: this.userId,
          likedRecommendations: { $in: [recipeId] },
        }).fetch().length > 0
      ) {
        // recommendation is not liked anymore
        UserPreferences.update(
          { userid: this.userId },
          { $pull: { likedRecommendations: recipeId } }
        );
      } else {
        UserPreferences.upsert(
          { userid: this.userId },
          { $addToSet: { likedRecommendations: recipeId } }
        );
      }
    }
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
    const nowString = now.toISOString().substring(0, 10);
    const orders = OrdersCollection.find({
      userid: this.userId,
      recipeId: recipeId,
      orderday: nowString,
    }).fetch();
    const ordered = orders.length > 0;

    // if not ordered yet today, add the order
    if (!ordered) {
      OrdersCollection.insert({
        userid: this.userId,
        recipeId: recipeId,
        timestamp: now,
        orderday: nowString,
      });
    } else {
      // user cancelled order
      OrdersCollection.remove({
        userid: this.userId,
        recipeId: recipeId,
        orderday: nowString,
      });
    }
  },
  "feedback.submitNewFeedback"(feedback) {
    check(feedback, String);

    if (!this.userId) {
      throw new Meteor.Error("Not authorized.");
    }

    const userPreferences = UserPreferences.findOne({ userid: this.userId });
    const recommendations = RecommendedRecipes.findOne({ userid: this.userId });

    FeedbackCollection.insert({
      userid: this.userId,
      feedback: feedback,
      timestamp: new Date(),
      userPreferences: userPreferences,
      recommendedRecipes: recommendations,
    });
  },
  "recommender.updateRecommendations"() {
    // init recommendations

    // find today's menu
    let menu = MenusCollection.findOne({
      starting_date: new Date().toISOString().substring(0, 10),
    });
    // pick random menu when no menu available today
    if (!menu) menu = MenusCollection.findOne();
    let todaysCourses = menu.courses;

    let userpreferences = UserPreferences.findOne({ userid: this.userId });

    // Find all recipes that are available today --> TODO tailor per course
    let todaysRecipes = [];
    todaysCourses.forEach((course) => {
      todaysRecipes = todaysRecipes.concat(course.recipes);
    });
    todaysRecipes = _.map(todaysRecipes, getRecipeID);

    todaysRecipes = RecipesCollection.find({
      id: { $in: todaysRecipes },
    }).fetch();

    // Filter allergies
    let userAllergens = [];
    try {
      userAllergens = userpreferences.allergens;
    } catch (error) {}
    if (!userAllergens) userAllergens = [];
    todaysRecipes = _.filter(todaysRecipes, (recipe) => {
      const recipeAllergens = recipe.allergens;
      for (let i = 0; i < userAllergens.length; i++) {
        const userAllergen = userAllergens[i];
        if (recipeAllergens[userAllergen.allergen]) {
          return false;
        }
      }
      return true;
    });

    // filter recipes without an image and/or no nutrient data
    todaysRecipes = _.filter(todaysRecipes, (recipe) => {
      return recipe.main_image !== null && recipe.kcal > 0;
    });

    // filter recipes with disliked ingredients
    try {
      let dislikedIngredients = UserPreferences.findOne({ userid: this.userId })
        .dislikedIngredients;
      todaysRecipes = _.filter(todaysRecipes, (recipe) => {
        for (let i = 0; i < dislikedIngredients.length; i++) {
          const ingredient = dislikedIngredients[i];
          for (let j = 0; j < recipe.ingredients.length; j++) {
            if (ingredient.description === recipe.ingredients[j].description) {
              return false;
            }
          }
        }
        return true;
      });
    } catch (error) {}

    // last step! Assign rankings
    // find recipe with most likes --> TODO make smarter
    todaysRecipes = _.sortBy(todaysRecipes, ["nbLikes"]);
    todaysRecipes = _.reverse(todaysRecipes);
    for (let i = 0; i < todaysRecipes.length; i++) {
      todaysRecipes[i].ranking = i + 1;
    }

    // insert/update recommendations for user
    RecommendedRecipes.upsert(
      { userid: this.userId },
      { $set: { recommendations: todaysRecipes } }
    );
  },
});
