import { check } from 'meteor/check';
import { RecommendedRecipes } from '/imports/db/recommendedRecipes/RecommendedRecipes';
import { MenusCollection } from '/imports/db/menus/MenusCollection';
import { UserPreferences } from '/imports/db/userPreferences/UserPreferences';
import { RecipesCollection } from '/imports/db/recipes/RecipesCollection';

import { getElementID, getNutriscore, getNbDisliked } from "/imports/api/apiPersfo";
import { calculateNutrientforRecipe } from '../../api/apiPersfo';

const coursesToIgnore = ["Dranken", "Soep"];

Meteor.methods({
    "recommender.updateRecommendations"() {

        if (!this.userId) {
            throw new Meteor.Error("Not authorized.");
        }
        // init recommendations

        // 7 days earlier
        // const earlier = new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().substring(0, 10);

        // find today's menu
        let menu = MenusCollection.findOne({
            // starting_date: earlier,
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

        // calculate min and max nutritional values
        let fiber = { min: 9999, max: 0, low: 2, high: 0.05, neutral: 0.5, apicName: "fibre", quisperName: "Fiber", quisperRating: "Rating_Total" };
        let vitamineA = { min: 9999, max: 0, low: 2, high: 0.05, neutral: 0.5, apicName: "vitamin_a", quisperName: "VitaminA", quisperRating: "Rating_Total" };
        let vitamineB12 = { min: 9999, max: 0, low: 2, high: 0.05, neutral: 0.5, apicName: "vitamin_b12", quisperName: "VitaminB12", quisperRating: "Rating_Total" };
        let vitamineC = { min: 9999, max: 0, low: 2, high: 0.05, neutral: 0.5, apicName: "vitamin_c", quisperName: "VitaminC", quisperRating: "Rating_Total" };
        // let unsaturatedFat = { min: 9999, max: 0, low: 1, high: -0.5, neutral: 0.01, apicName:  };
        let monoUnsaturatedFat = { min: 9999, max: 0, low: 2, high: 0.05, neutral: 0.5, apicName: "mono_unsaturated_fat", quisperName: "UnsaturatedFat.MonoUnsaturatedFat", quisperRating: "Rating_Total" };
        let polyUnsaturatedFat = { min: 9999, max: 0, low: 2, high: 0.05, neutral: 0.5, apicName: "poly_unsaturated_fat", quisperName: "UnsaturatedFat.PolyUnsaturatedFat", quisperRating: "Rating_Total" };
        // let carbohydrate = { min: 9999, max: 0, low: 1, high: -0.5, neutral: 0.01, apicName:  };
        let protein = { min: 9999, max: 0, low: 2, high: 0.05, neutral: 0.5, apicName: "protein", quisperName: "Protein", quisperRating: "Rating_Total" };
        let totalFat = { min: 9999, max: 0, low: 2, high: 0.05, neutral: 0.5, apicName: "fat", quisperName: "TotalFat", quisperRating: "Rating_Total" };
        let calcium = { min: 9999, max: 0, low: 2, high: 0.05, neutral: 0.5, apicName: "calcium", quisperName: "Calcium", quisperRating: "Rating_Total" };;
        let iron = { min: 9999, max: 0, low: 2, high: 0.05, neutral: 0.5, apicName: "iron", quisperName: "Iron", quisperRating: "Rating_Total" };
        // let salt = { min: 9999, max: 0, low: 1, high: -0.5, neutral: 0.01, apicName:  };
        let saturatedFats = { min: 9999, max: 0, low: 2, high: 0.05, neutral: 0.5, apicName: "saturated_fat", quisperName: "SaturatedFats", quisperRating: "Rating" };

        const nutrients = [fiber, vitamineA, vitamineB12, vitamineC, monoUnsaturatedFat, polyUnsaturatedFat, protein, totalFat, calcium, iron, saturatedFats]

        // update today's min and max values.
        todaysRecipes.forEach(recipe => {
            nutrients.forEach(nutrient => {
                const value = calculateNutrientforRecipe(recipe, nutrient["apicName"])
                nutrient["min"] = nutrient["min"] < value ? nutrient["min"] : value;
                nutrient["max"] = nutrient["max"] > value ? nutrient["max"] : value;
            });
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
        const dislikedIngredients = userpreferences?.dislikedIngredients ? userpreferences.dislikedIngredients : [];
        todaysRecipes = _.sortBy(todaysRecipes, r => [getNbDisliked(r, dislikedIngredients), getNutriscore(r)]);


        const food4me = userpreferences?.food4me?.Output;
        // console.log(food4me);

        // last step! Assign rankings
        const now = new Date().getTime();
        for (let i = 0; i < todaysRecipes.length; i++) {
            let score = 0;
            const recipe = todaysRecipes[i];

            nutrients.forEach(nutrient => {
                try {
                    score += getNutrientRatingForRecipe(nutrient, recipe);
                } catch (error) {
                    console.log(nutrient.quisperName);
                    console.log(error);
                }
            });

            console.log(recipe.name + " " + score);

            todaysRecipes[i].ranking = score;

            // old
            // todaysRecipes[i].ranking = i + 1;

            // needed to force rerender (new order does not change ids)
            todaysRecipes[i].lastUpdated = now;
        }

        // insert/update recommendations for user
        RecommendedRecipes.upsert(
            { userid: this.userId },
            { $set: { recommendations: todaysRecipes } }
        );

        function getNutrientRatingForRecipe(ranges, recipe) {
            let score,rating;
            let splittedQuisperName = ranges.quisperName.split(".");
            if (splittedQuisperName.length == 1) {
                rating = food4me[ranges.quisperName][ranges.quisperRating]
            } else {
                rating = food4me[splittedQuisperName[0]][splittedQuisperName[1]][ranges.quisperRating]
            }
            switch (rating) {
                case "LOW":
                    score = ranges["low"] * (calculateNutrientforRecipe(recipe, ranges["apicName"]) / ranges["max"]);
                    break;
                case "HIGH":
                    score = ranges["high"] * (calculateNutrientforRecipe(recipe, ranges["apicName"]) / ranges["max"]);
                    break;
                case "NA":
                    score = ranges["neutral"];
                    break;
                case "NORMAL":
                    score = ranges["neutral"];
                    break;
                default:
                    break;
            }
            return score;
        }
    },
});