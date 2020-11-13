import { HTTP } from "meteor/http";

const recipeURL = "https://www.apicbase.com/api/v1/products/recipes";
const token = "3KUJSZMd9BRLy5sVA4d8u4bsudqAxy";

function fetchRecipes(url) {
  return HTTP.call("GET", url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

let resultArray = [];
function myLoop(url) {
  Meteor.setTimeout(function() {
    let call = fetchRecipes(url);
    resultArray = resultArray.concat(call.data.results);
    console.log(resultArray.length);
    if (call.data.next !== null) {
      myLoop(call.data.next);
    }
  }, 1001) // need to wait at least one second between calls
}

//API methode definiëren op server side, parameters = URL en user token
Meteor.methods({
  getRecipes() {
    myLoop(recipeURL);       
  },
});
