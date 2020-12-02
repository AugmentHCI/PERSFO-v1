import { MenusCollection } from "../db/MenusCollection";
import { RecipesCollection } from "../db/RecipesCollection";

export function initData() {
  let allRecipes = [];
  for (let i = 1; i < 8; i++) {
    allRecipes = allRecipes.concat(
      JSON.parse(Assets.getText("data/recipes/recipes" + i + ".json")).results
    );
  }

  console.log(allRecipes);
  allRecipes.forEach((recipe) => {
    RecipesCollection.upsert({ id: recipe.id }, { $set: recipe });
  });

  let allMenus = [];
  for (let i = 1; i < 2; i++) {
    allMenus = allMenus.concat(
      JSON.parse(Assets.getText("data/menus/menu" + i + ".json"))
    );
  }

  console.log(allMenus);
  allMenus.forEach((menu) => {
    MenusCollection.upsert({ id: menu.id }, { $set: menu });
  });
}

export function getNutriscoreImage(recipe) {
  if (recipe && recipe.custom_fields) {
    for (let i = 0; i < recipe.custom_fields.length; i++) {
      let custom = recipe.custom_fields[i];
      if (custom.name == "NutriScore") {
        console.log("/images/nutri" + custom.value + ".jpg");
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
