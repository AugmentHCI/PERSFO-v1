import { HTTP } from "meteor/http";

const token = "3KUJSZMd9BRLy5sVA4d8u4bsudqAxy";

const maxErrors = 10;
let nbErrors = 0;

export function fetchData(Collection, url) {
  Meteor.setTimeout(function () {
    try {
      let call = HTTP.call("GET", url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      call.data.results.forEach((result) => {
        Collection.upsert({ id: result.id }, { $set: result });
      });
      if (call.data.next !== null) {
        fetchData(Collection, call.data.next);
      } else {
        console.log("finished loading:" + url);
      }
    } catch (error) {
      console.log("API request limit reached");
      console.log(error);
      Meteor.setTimeout(function () {
        console.log("new attempt");
        if (nbErrors < maxErrors) {
          nbErrors++;
          fetchData(Collection, url);
        } else {
          console.log(
            "API: stopped trying, too many errors loading data: " + url
          );
        }
      }, 2000);
    }
  }, 1001); // need to wait at least one second between calls
}

export function getNutriscoreImage(recipe) {
  if(recipe && recipe.nutriscore) {
    return "/images/nutri" + recipe.nutriscore + ".jpg"
  } else {
    return "/images/nutrinull.jpg"
  }
};

export function getImage(recipe) {
  if(recipe && recipe.main_image) {
    return recipe.main_image.full_image_url;
  } else {
    return "/images/orange.jpg"
  }
};
