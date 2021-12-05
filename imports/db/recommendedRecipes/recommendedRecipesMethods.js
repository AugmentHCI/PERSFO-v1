import { check } from 'meteor/check';
import { RecommendedRecipes } from '/imports/db/recommendedRecipes/RecommendedRecipes';
import { MenusCollection } from '/imports/db/menus/MenusCollection';
import { UserPreferences } from '/imports/db/userPreferences/UserPreferences';
import { RecipesCollection } from '/imports/db/recipes/RecipesCollection';

import { getElementID, getNutriscore, getNbDisliked } from "/imports/api/apiPersfo";

const coursesToIgnore = ["Dranken", "Soep"];

Meteor.methods({
    "recommender.updateRecommendations"() {

        if (!this.userId) {
            throw new Meteor.Error("Not authorized.");
        }
        // init recommendations

        // find today's menu
        let menu = MenusCollection.findOne({
            starting_date: new Date().toISOString().substring(0, 10),
        });
        // pick random menu when no menu available today
        if (!menu) {
            menu = MenusCollection.findOne({ starting_date: "2021-12-06" });
            console.log("recommender: no menu for today!")
        }

        let todaysCourses = menu.courses;

        const userpreferences = UserPreferences.findOne({ userid: this.userId });

        // Find all recipes that are available today --> TODO tailor per course
        let todaysRecipes = [];
        todaysCourses.forEach((course) => {
            todaysRecipes = todaysRecipes.concat(course.recipes);
        });
        todaysRecipes = _.map(todaysRecipes, getElementID);

        todaysRecipes = RecipesCollection.find({
            id: { $in: todaysRecipes },
        }).fetch();

        // Filter courses
        let filteredCourseURLs = _.filter(todaysCourses, c => _.includes(coursesToIgnore, c.name));
        filteredCourseURLs = _.flatten(filteredCourseURLs.map(c => c.recipes));
        const filteredCourseIds = _.map(filteredCourseURLs, getElementID);
        todaysRecipes = _.filter(todaysRecipes, (recipe) => !_.includes(filteredCourseIds, recipe.id));

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
            return recipe.main_image !== null;
        });

        // filter recipes without ingredients
        todaysRecipes = _.filter(todaysRecipes, (recipe) => {
            if (recipe.cleanedIngredients) {
                return recipe.cleanedIngredients.length > 0;
            } else {
                return false;
            }
        });

        // filter smoothies
        todaysRecipes = _.filter(todaysRecipes, recipe => {
            if (recipe.recipe_type_other) {
                return recipe.recipe_type_other !== "Smoothie";
            } else {
                return true;
            }
        });

        // find recipe with most likes --> TODO make smarter
        // todaysRecipes = _.sortBy(todaysRecipes, ["nbLikes"]);

        // sort recipe by dislikedingredient first, then by decent nutriscore
        const dislikedIngredients = UserPreferences.findOne({ userid: this.userId }).dislikedIngredients;
        todaysRecipes = _.sortBy(todaysRecipes, r => [getNbDisliked(r, dislikedIngredients), getNutriscore(r)]);

        // last step! Assign rankings
        // todaysRecipes = _.reverse(todaysRecipes);
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