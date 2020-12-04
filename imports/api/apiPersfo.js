import { MenusCollection, RecipesCollection } from "/imports/api/methods.js";

export function initData() {
  let allRecipes = [];
  for (let i = 1; i < 9; i++) {
    allRecipes = allRecipes.concat(
      JSON.parse(Assets.getText("data/recipes/recipes" + i + ".json")).results
    );
  }

  allRecipes.forEach((recipe) => {
    try {
      let recipeDetails = JSON.parse(Assets.getText("data/recipeDetails/"+ recipe.id + ".json"))
      RecipesCollection.upsert({ id: recipe.id }, { $set: recipeDetails });
    } catch (error) {
      console.log("data missing for recipe id:" + recipe.id)
    }
  });

  // add custom fields if not exists (do not overwrite old data)
  RecipesCollection.update({"nbLikes": { "$exists": false }}, {$set: {"nbLikes": 0 }}, { multi: true, upsert: true });
  RecipesCollection.update({"reviews": { "$exists": false }}, {$set: {"reviews": [] }}, { multi: true, upsert: true });
  console.log("recipes loaded");

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
  if (recipe && recipe.main_image) {
    return recipe.main_image.full_image_url;
  } else {
    return "/images/orange2.jpg";
  }
}
