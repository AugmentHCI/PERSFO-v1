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
        let fiber = { min: 9999, max: 0 };
        let vitamineA = { min: 9999, max: 0 };
        let vitamineB12 = { min: 9999, max: 0 };
        let vitamineC = { min: 9999, max: 0 };
        let unsaturatedFat = { min: 9999, max: 0 };
        let monoUnsaturatedFat = { min: 9999, max: 0 };
        let polyUnsaturatedFat = { min: 9999, max: 0 };
        let carbohydrate = { min: 9999, max: 0 };
        let protein = { min: 9999, max: 0 };
        let totalFat = { min: 9999, max: 0 };
        let calcium = { min: 9999, max: 0 };;
        let iron = { min: 9999, max: 0 };
        let salt = { min: 9999, max: 0 };
        let saturatedFats = { min: 9999, max: 0 };

        // update today's min and max values.
        todaysRecipes.forEach(recipe => {
            updateMinMax(fiber, calculateNutrientforRecipe(recipe, "fibre"));
            updateMinMax(vitamineA, calculateNutrientforRecipe(recipe, "vitamin_a"));
            updateMinMax(vitamineB12, calculateNutrientforRecipe(recipe, "vitamin_b12"));
            updateMinMax(vitamineC, calculateNutrientforRecipe(recipe, "vitamin_c"));
            // updateMinMax(unsaturatedFat, calculateNutrientforRecipe(recipe, "fat"));
            updateMinMax(monoUnsaturatedFat, calculateNutrientforRecipe(recipe, "mono_unsaturated_fat"));
            updateMinMax(polyUnsaturatedFat, calculateNutrientforRecipe(recipe, "poly_unsaturated_fat"));
            // updateMinMax(carbohydrate, calculateNutrientforRecipe(recipe, "vitamin_a"));
            updateMinMax(protein, calculateNutrientforRecipe(recipe, "protein"));
            updateMinMax(totalFat, calculateNutrientforRecipe(recipe, "fat"));
            updateMinMax(calcium, calculateNutrientforRecipe(recipe, "calcium"));
            updateMinMax(iron, calculateNutrientforRecipe(recipe, "iron"));
            // updateMinMax(salt, calculateNutrientforRecipe(recipe, "vitamin_a"));
            updateMinMax(saturatedFats, calculateNutrientforRecipe(recipe, "saturated_fat"));
        });

        function updateMinMax(parameter, value) {
            parameter["min"] = parameter["min"] < value ? parameter["min"] : value;
            parameter["max"] = parameter["max"] > value ? parameter["max"] : value;
        }

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

        // Food4Me weights
        const fiberRating = food4me.Fiber.Rating_Total;
        const vitamineARating = food4me.VitaminA.Rating_Total;

        // last step! Assign rankings
        const now = new Date().getTime();
        for (let i = 0; i < todaysRecipes.length; i++) {
            let score = 0;
            const recipe = todaysRecipes[i];

            // // fibers
            // switch (fiberRating) {
            //     case "LOW":
            //         score += fiber.max ? (calculateNutrientforRecipe(recipe, "fibre")) / fiber.max : fiber.max;
            //         break;
            //     case "HIGH":
            //         score -= 0.5 * (fiber.max ? (calculateNutrientforRecipe(recipe, "fibre")) / fiber.max : fiber.max);
            //         break;
            //     case "NA":
            //         score += 0.01; // todo decide fiber positive or negative
            //         console.log("no fiber food4me data")
            //         break;
            //     default:
            //         break;
            // }

            // // vitamineA
            // switch (vitamineARating) {
            //     case "LOW":
            //         score += vitamineA.max ? (calculateNutrientforRecipe(recipe, "fibre")) / vitamineA.max : vitamineA.max;
            //         break;
            //     case "HIGH":
            //         score -= 0.5 * (vitamineA.max ? (calculateNutrientforRecipe(recipe, "fibre")) / vitamineA.max : vitamineA.max);
            //         break;
            //     case "NA":
            //         score += 0.01; // todo decide fiber positive or negative
            //         console.log("no vitamineA food4me data")
            //         break;
            //     default:
            //         break;
            // }
            // todaysRecipes[i].ranking = score;

            // old
            todaysRecipes[i].ranking = i + 1;

            // needed to force rerender (new order does not change ids)
            todaysRecipes[i].lastUpdated = now;
        }

        // insert/update recommendations for user
        RecommendedRecipes.upsert(
            { userid: this.userId },
            { $set: { recommendations: todaysRecipes } }
        );
    },
});