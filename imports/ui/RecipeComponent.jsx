import { makeStyles } from "@material-ui/core/styles";
import { useTracker } from "meteor/react-meteor-data";
import React from "react";
import { CardOtherMeal } from "./CardOtherMeal";
import { CardRecommendedMeal } from "./CardRecommendedMeal";
import {
    OpenMealDetails
} from "/imports/api/methods.js";
import { RecipesCollection } from '/imports/db/recipes/RecipesCollection';
import { UserPreferences } from '/imports/db/userPreferences/UserPreferences';


const useStyles = makeStyles(() => ({

}));

const componentName = "RecipeComponent";
export const RecipeComponent = (({ recipeId, type }) => {
    const classes = useStyles();

    const { recipe } = useTracker(() => {
        const noDataAvailable = { recipe: {} };
        if (!Meteor.user()) {
            return noDataAvailable;
        }
        const handler = Meteor.subscribe("recipes");
        if (!handler.ready()) {
            return { ...noDataAvailable };
        }
        const recipe = RecipesCollection.find({ id: recipeId }).fetch()[0];
        return { recipe };
    });

    // Like logic
    const handleIncreaseLike = () => {
        if (recipe) {
            Meteor.call("recipes.handleLike", recipe.id);
            Meteor.call("log", componentName, "handleIncreaseLike");
        }
    };

    // Like logic
    const { liked, nbLikes, allergensPresent } = useTracker(() => {
        const noDataAvailable = {
            liked: false,
            nbLikes: 0,
            allergensPresent: false,
        };
        if (!recipe) return noDataAvailable;
        const handler = Meteor.subscribe("userpreferences");
        if (!handler.ready()) {
            return { ...noDataAvailable };
        }
        const nbLikes = recipe.nbLikes;
        const liked =
            UserPreferences.find({
                userid: Meteor.userId(),
                likedRecipes: { $in: [recipe.id] },
            }).fetch().length > 0;

        const userPreferences = UserPreferences.findOne({
            userid: Meteor.userId(),
        });

        const userAllergens = userPreferences?.allergens ? _.map(userPreferences?.allergens, a => a.allergen) : [];

        const recipeAllergens = _.without(
            _.map(_.toPairs(recipe.allergens), (n) => {
                if (n[1] == 1) return n[0];
            }),
            undefined
        );

        let allergensPresentTmp = false;
        userAllergens.forEach(userAllergy => {
            if (recipeAllergens.includes(userAllergy)) {
                allergensPresentTmp = true;
            }
        });
        const allergensPresent = allergensPresentTmp;

        return { liked, nbLikes, allergensPresent };
    });

    // Detail logic
    const handleDetailsClick = () => {
        OpenMealDetails.set(recipeId);
        Meteor.call("log", componentName, "handleDetailsClick");
    };

    const renderSwitch = (type) => {
        switch (type) {
            case "other":
                return <CardOtherMeal
                    recipe={recipe}
                    handleIncreaseLike={handleIncreaseLike}
                    handleDetailsClick={handleDetailsClick}
                    liked={liked}
                    nbLikes={nbLikes}
                    allergensPresent={allergensPresent}
                ></CardOtherMeal>
            case "recommended":
                return <CardRecommendedMeal
                    recipe={recipe}
                    handleIncreaseLike={handleIncreaseLike}
                    handleDetailsClick={handleDetailsClick}
                    liked={liked}
                    nbLikes={nbLikes}
                    allergensPresent={allergensPresent}
                ></CardRecommendedMeal>
            default:
                break;
        }
    };

    return (<>{renderSwitch(type)}</>);
});
