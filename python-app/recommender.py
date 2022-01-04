import db_crud
import pandas as pd
from pandas import json_normalize
from icecream import ic
from sklearn.preprocessing import MultiLabelBinarizer
from sklearn.metrics.pairwise import cosine_similarity


def recipes_col_to_df() -> pd.DataFrame:
    data = db_crud.get_all_recipes()
    data_flat = []

    for idx, d in enumerate(data):
        igd = []
        ingredients = d["ingredients"]
        for i in ingredients:
            an_ingredient = i["name"].split(",")[0]
            igd.append(an_ingredient)
        data_flat.append({
            "recipe_name": d["name"],
            "ingredients": igd
        })

    df = json_normalize(data_flat)

    mlb = MultiLabelBinarizer()
    df = df.join(pd.DataFrame(mlb.fit_transform(df.pop('ingredients')),
                              columns=mlb.classes_,
                              index=df.index))

    return df


def recipe_cosine_similarity(df: pd.DataFrame, df_X: pd.DataFrame, df_Y: pd.DataFrame, num: int) -> list:
    suggested_recipes = []

    # Compute the cosine similarity between X (seed) and Y using sklearn
    # [0] to take only 1 dimension from the 2-d output
    cos_sim = cosine_similarity(df_X, df_Y)[0]

    # Sort the array to work out which item is most similar.
    # To save time and resources, we iterate through only the top 10 recipes.
    for idx, score in sorted(enumerate(cos_sim), key=lambda x: x[1], reverse=True)[:num]:
        # Select only ingredient columns from dataframe. Use [idx] because we want a DataFrame type, not Series type
        df_ingredients = df.iloc[[idx], 1:]

        # Select the ingredient columns that are present in this recipe (value = 1)
        df_ingredients = df_ingredients.loc[:, (df_ingredients == 1).any()]

        # Convert the columns to list
        ingredients_list = df_ingredients.columns.tolist()

        suggested_recipe_dict = {
            "recipe_name": df.iloc[idx, 0],
            "ingredients": ingredients_list,
            "score": score
        }
        suggested_recipes.append(suggested_recipe_dict)

    return suggested_recipes


def suggest_similar_recipes(recipe_name: str, num: int) -> dict:
    df = recipes_col_to_df()

    df_X = df.loc[df['recipe_name'] == recipe_name].iloc[:, 1:]
    if df_X.empty:
        return {
            "error": {
                "message": "The recipe '" + recipe_name + "' is not found in the database.",
                "type": "Recipe not found"
            }
        }

    df.drop(df.index[(df["recipe_name"] == recipe_name)], axis=0, inplace=True)
    df_Y = df.iloc[:, 1:]

    suggested_recipes = recipe_cosine_similarity(df, df_X, df_Y, num)

    return suggested_recipes


def suggest_user_recipes(current_user_id: str, num: int) -> dict:
    # Load all the recipes from db
    df = recipes_col_to_df()

    df_X = df.iloc[[0], 1:]  # Take a sample to create a placeholder for the user liked ingredients
    df_Y = df.iloc[:, 1:]

    # All possible ingredients
    all_ingredients = df_X.columns.tolist()

    # Load the preferences of current user
    liked_ingredients = db_crud.get_user_preference(current_user_id)
    if liked_ingredients is None:
        return {
            "error": {
                "message": "The user ID '" + current_user_id + "' is not found in the database.",
                "type": "User ID not found"
            }
        }
    liked_ingredients = liked_ingredients["likedIngredients"]

    # Check that the ingredients exist among all possible ingredients.
    for ing in liked_ingredients:
        if ing not in all_ingredients:
            liked_ingredients.remove(ing)

    # First change all the values in the row to 0
    # Then start replacing with user preferences
    df_X.loc[:] = 0
    df_X.loc[:, liked_ingredients] = 1

    suggested_recipes = recipe_cosine_similarity(df, df_X, df_Y, num)

    return suggested_recipes


if __name__ == "__main__":
    # print(suggest_similar_recipes("Aromatic couscous", 5))
    # suggest_user_recipes("current_user_id")
    print(suggest_user_recipes("WrLCRigYXLKDFpwgC",5))
