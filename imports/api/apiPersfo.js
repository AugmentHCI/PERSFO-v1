import {
  MenusCollection,
  RecipesCollection,
  RecommendedRecipes,
} from "/imports/api/methods.js";

export function initData() {
  // init recipes
  let allRecipes = [];
  for (let i = 1; i < 9; i++) {
    allRecipes = allRecipes.concat(
      JSON.parse(Assets.getText("data/recipes/recipes" + i + ".json")).results
    );
  }

  allRecipes.forEach((recipe) => {
    try {
      let recipeDetails = JSON.parse(
        Assets.getText("data/recipeDetails/" + recipe.id + ".json")
      );
      recipeDetails.kcal = calculateKCalforRecipe(recipeDetails);
      RecipesCollection.upsert({ id: recipe.id }, { $set: recipeDetails });
    } catch (error) {
      console.log("data or datafield missing for recipe id:" + recipe.id);
    }
  });

  // kcal per gram * total gram

  // add custom fields if not exists (do not overwrite old data)
  RecipesCollection.update(
    { nbLikes: { $exists: false } },
    { $set: { nbLikes: 0 } },
    { multi: true, upsert: true }
  );
  RecipesCollection.update(
    { reviews: { $exists: false } },
    { $set: { reviews: [] } },
    { multi: true, upsert: true }
  );
  console.log("recipes loaded");

  // init menus
  let allMenus = JSON.parse(Assets.getText("data/menus/menuArgenta.json")).results;

  allMenus.forEach((menu) => {
    MenusCollection.upsert({ id: menu.id }, { $set: menu });
  });
  console.log("menus loaded");
}

export function getNutriscoreImage(recipe) {
  if (recipe && recipe.custom_fields) {
    for (let i = 0; i < recipe.custom_fields.length; i++) {
      let custom = recipe.custom_fields[i];
      if (custom.name == "NutriScore") {
        return "/images/nutri" + custom.value + ".jpg";
      }
    }
  }
  return "/images/nutrinull.jpg";
}

export function getImage(recipe) {
  if (recipe && recipe.custom_fields) {
    for (let i = 0; i < recipe.custom_fields.length; i++) {
      let custom = recipe.custom_fields[i];
      if (custom.name == "Picture") {
        if (custom.value) return custom.value.replaceAll(" ", "%20");
      }
    }
  }
  return "/images/orange.jpg";
}

export function getRecipeID(recipeURL) {
  if (recipeURL) {
    let splittedURL = recipeURL.split("/");
    return splittedURL[splittedURL.length - 2];
  }
}

function calculateKCalforRecipe(recipeDetails) {
  let netWeightUnit = recipeDetails.net_weight_unit;
  let multiplier = -1;
  if (netWeightUnit == "kg") {
    multiplier = 1000;
  } else if (netWeightUnit == "g") {
    multiplier = 1;
  } else {
    console.log(
      "other weight unit: " + netWeightUnit + " for recipe: " + recipeDetails.id
    );
  }
  return (
    (recipeDetails.nutrition_info.kcal.quantity / 100) *
    (recipeDetails.net_weight * multiplier)
  );
}
