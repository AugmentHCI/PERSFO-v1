import { check } from "meteor/check";
import { RecipesCollection } from "../db/RecipesCollection";

Meteor.methods({
    'recipes.increaseLike'(recipeId) {
        check(recipeId, String);
    
        if (!this.userId) {
          throw new Meteor.Error('Not authorized.');
        }    
        RecipesCollection.update({"id": recipeId}, {$inc: {"nbLikes": 1 }});
      },
      'recipes.decrementLike'(recipeId) {
        check(recipeId, String);
    
        if (!this.userId) {
          throw new Meteor.Error('Not authorized.');
        }    
        RecipesCollection.update({"id": recipeId}, {$inc: {"nbLikes": -1 }});
      },
});
