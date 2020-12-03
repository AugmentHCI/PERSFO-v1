import { Accounts } from "meteor/accounts-base";
import { Meteor } from "meteor/meteor";
import { initData } from "/imports/api/apiPersfo";
import "/imports/api/methods.js";
import "/imports/api/apiPersfo";

import { MenusCollection, RecipesCollection } from "/imports/api/methods.js";

// hack to create the RecipesCollection. Upsert does not create a collection.
RecipesCollection.insert({_id:"1", value:"hack to create collection in meteor"});
RecipesCollection.remove({_id:"1"});
MenusCollection.insert({_id:"1", value:"hack to create collection in meteor"});
MenusCollection.remove({_id:"1"});

const SEED_USERNAME = "meteorite1";
const SEED_PASSWORD = "password";

Meteor.publish('menus', function publishTasks() {
  return MenusCollection.find();
});

Meteor.publish('recipes', function publishTasks() {
  return RecipesCollection.find();
});

Meteor.startup(() => {
  if (!Accounts.findUserByUsername(SEED_USERNAME)) {
    Accounts.createUser({
      username: SEED_USERNAME,
      password: SEED_PASSWORD,
    });
  }

  const user = Accounts.findUserByUsername(SEED_USERNAME);

  // const recipeURL = "https://www.apicbase.com/api/v1/products/recipes";
  // const menuURL = "https://www.apicbase.com/api/v1/menus/";

  initData();
  // const devMode = false;
  // if(!devMode) {
  //   console.log("fetching new recipes");
  //   fetchData(RecipesCollection, recipeURL);

  //   console.log("fetching new menus");
  //   fetchData(MenusCollection, menuURL);
  // }
});
