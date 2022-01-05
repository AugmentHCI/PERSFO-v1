import { Button } from "@material-ui/core/";
import { red } from "@material-ui/core/colors";
import { useTracker } from "meteor/react-meteor-data";
import React from "react";
import FavoriteIcon from "@material-ui/icons/Favorite";
import { UserPreferences } from '/imports/db/userPreferences/UserPreferences';

const componentName = "LikeButton";
export const LikeButton = ({ recipe }) => {

    const { liked, nbLikes } = useTracker(() => {
        const noDataAvailable = {
            liked: false,
            nbLikes: 0,
        };
        const handler = Meteor.subscribe("userpreferences");
        const handlerRecipe = Meteor.subscribe("recipes");

        if (!Meteor.user() || !handler.ready() || !handlerRecipe.ready()) {
            return { ...noDataAvailable, isLoading: true };
        }
        const nbLikes = recipe.nbLikes ? recipe.nbLikes : 0;
        const liked =
            UserPreferences.find({
                userid: Meteor.userId(),
                likedRecipes: { $in: [recipe.id] },
            }).fetch().length > 0;

        return { liked, nbLikes };
    });

    const handleIncreaseLike = () => {
        if (recipe.id) {
            Meteor.call("recipes.handleLike", recipe.id);
            Meteor.call("log", componentName, "handleIncreaseLike", navigator.userAgent, recipe.id);
        }
    };
    return (
        <Button
            size="large"
            onClick={() => handleIncreaseLike()}
            color="primary"
            style={
                liked
                    ? { backgroundColor: red[100], borderRadius: "14px" }
                    : undefined
            }
        >
            <FavoriteIcon style={{ color: red[300] }} /> &nbsp;{" "}
            <span>{nbLikes}</span>
        </Button>
    )
}

