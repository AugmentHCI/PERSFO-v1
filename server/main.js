import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
import "/imports/api/tasksPublications";
import "/imports/api/apiPersfo";

import { fetchData } from "/imports/api/apiPersfo";
import { RecipesCollection } from "/imports/db/RecipesCollection";
import { MenusCollection } from "/imports/db/MenusCollection";

// needed to init Recipes collection and fetch new data.
RecipesCollection; 
MenusCollection;

const SEED_USERNAME = "meteorite";
const SEED_PASSWORD = "password";

Meteor.startup(() => {
  if (!Accounts.findUserByUsername(SEED_USERNAME)) {
    Accounts.createUser({
      username: SEED_USERNAME,
      password: SEED_PASSWORD,
    });
  }

  const user = Accounts.findUserByUsername(SEED_USERNAME);

  const recipeURL = "https://www.apicbase.com/api/v1/products/recipes";
  const menuURL = "https://www.apicbase.com/api/v1/menus/";

  const devMode = true;
  if(!devMode) {
    console.log("fetching new recipes");
    fetchData(RecipesCollection, recipeURL);
  
    console.log("fetching new menus");
    fetchData(MenusCollection, menuURL);
  }
});
