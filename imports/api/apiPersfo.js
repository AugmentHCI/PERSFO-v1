import {
  MenusCollection,
  RecipesCollection,
  RecommendedRecipes,
} from "/imports/api/methods.js";

const token = "0LcZPFZ89gWDUEWMs55GYVEZwXy95J";
const url = "https://www.apicbase.com/api/v1/recipes/";

var fs = require("fs");

export function initData() {
  // first load menus to only load relevant recipes!

  // init menus
  let allMenus = JSON.parse(Assets.getText("data/menus/menuArgenta.json"))
    .results;
  let allRecipeIds = [];

  allMenus.forEach((menu) => {
    MenusCollection.upsert({ id: menu.id }, { $set: menu });
    menu.courses.forEach((course) => {
      course.recipes.forEach((recipeURL) => {
        allRecipeIds.push(getRecipeID(recipeURL));
      });
    });
  });
  console.log("menus loaded");

  allRecipeIds.forEach((recipeId) => {
    try {
      let recipeDetails = JSON.parse(
        Assets.getText("data/recipeDetails/" + recipeId + ".json")
      );
      try {
        recipeDetails.kcal = calculateKCalforRecipe(recipeDetails);
      } catch (error) {
        recipeDetails.kcal = 0;
      }
      RecipesCollection.upsert({ id: recipeId }, { $set: recipeDetails });
    } catch (error) {
      console.log("data or datafield missing for recipe id:" + recipeId);
    }
  });

  // kcal per gram * total gram

  // add custom fields if not exists (do not overwrite old data)
  RecipesCollection.update(
    { nbLikes: { $exists: false } },
    { $set: { nbLikes: 0 } },
    { multi: true }
  );
  RecipesCollection.update(
    { reviews: { $exists: false } },
    { $set: { reviews: [] } },
    { multi: true }
  );
  console.log("recipes loaded");

  Meteor.setInterval(function () {
    console.log("Hourly updated started");

    // fetch all recipes in database
    const allRecipes = RecipesCollection.find({}).fetch();

    let index = 0;

    // function to fetch data in intervals
    function updateRecipeDetails() {
      Meteor.setTimeout(function () {
        try {
          const currentId = allRecipes[index].id;
          if (currentId) {
            console.log("calling API: " + currentId);
            let call = HTTP.call("GET", url + currentId, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            if (call.data) {
              RecipesCollection.upsert({ id: currentId }, { $set: call.data });
              // fs.writeFile(
              //   process.env["PWD"] +
              //     "/public/newRecipeDetails/" +
              //     currentId +
              //     ".json",
              //   JSON.stringify(call.data),
              //   (err) => {
              //     if (err) throw err;
              //   }
              // );
            }
          } else {
            console.log("error at index: " + index);
          }
        } catch (error) {
          console.log("Call error for: " + currentId);
        }

        index++;
        if (index < allRecipes.length) {
          updateRecipeDetails();
        } else {
          console.log("hourly update finished");
        }
      }, 1001);
    }

    // start the interval with the first recipe
    updateRecipeDetails(allRecipes[0].id);
  }, 25 * 60 * 1000);
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
  if (recipe) {
    if (recipe.main_image) {
      return recipe.main_image.thumb_image_url;
    }
    if (recipe.custom_fields) {
      for (let i = 0; i < recipe.custom_fields.length; i++) {
        let custom = recipe.custom_fields[i];
        if (custom.name == "Picture") {
          if (custom.value) return custom.value.replaceAll(" ", "%20");
        }
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
