import { check } from 'meteor/check';
import { UserPreferences } from '/imports/db/userPreferences/UserPreferences';

Meteor.methods({
    "users.setNewPassword"(username, newPassword, token) {
        if (token !== "rdc3Ru^Ob!KG^m%b1PyBxtdPShc2") {
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
});