import { MenusCollection } from "../db/MenusCollection";
import { RecipesCollection } from "../db/RecipesCollection";

export function initData() {
  let allRecipes = [];
  for (let i = 1; i < 8; i++) {
    allRecipes = allRecipes.concat(
      JSON.parse(Assets.getText("data/recipes/recipes" + i + ".json")).results
    );
  }

  allRecipes.forEach((recipe) => {
    RecipesCollection.upsert({ id: recipe.id }, { $set: recipe });
  });

  // add custom fields if not exists (do not overwrite old data)
  RecipesCollection.update({"nbLikes": { "$exists": false }}, {$set: {"nbLikes": 0 }}, { multi: true, upsert: true });
  console.log("recipes loaded");

  let allMenus = [];
  for (let i = 1; i < 2; i++) {
    allMenus = allMenus.concat(
      JSON.parse(Assets.getText("data/menus/menu" + i + ".json"))
    );
  }

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
    return "/images/orange.jpg";
  }
}