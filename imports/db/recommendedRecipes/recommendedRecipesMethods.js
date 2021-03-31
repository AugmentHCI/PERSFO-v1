import { check } from 'meteor/check';
import { RecommendedRecipes } from '/imports/db/recommendedRecipes/RecommendedRecipes';
import { MenusCollection } from '/imports/db/menus/MenusCollection';
import { UserPreferences } from '/imports/db/userPreferences/UserPreferences';
import { RecipesCollection } from '/imports/db/recipes/RecipesCollection';

import { getRecipeID } from "/imports/api/apiPersfo";

Meteor.methods({
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
        } catch (error) { }
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
        } catch (error) { }

        // filter smoothies
        todaysRecipes = _.filter(todaysRecipes, recipe => {
            if (recipe.recipe_type_other) {
                return recipe.recipe_type_other !== "Smoothie";
            } else {
                return true;
            }
        });

        // find recipe with most likes --> TODO make smarter
        todaysRecipes = _.sortBy(todaysRecipes, ["nbLikes"]);




        // last step! Assign rankings
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