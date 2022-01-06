import db_crud
import pandas as pd
from icecream import ic
from sklearn.preprocessing import MultiLabelBinarizer
from sklearn.metrics.pairwise import cosine_similarity

pd.options.mode.chained_assignment = None


def binarize_ingredients(df: pd.DataFrame) -> pd.DataFrame:
    mlb = MultiLabelBinarizer()
    df = df.join(pd.DataFrame(mlb.fit_transform(df.pop('cleanedIngredients')),
                              columns=mlb.classes_,
                              index=df.index))
    return df


def recipes_col_to_df() -> pd.DataFrame:
    recipes = db_crud.get_all_recipes()
    df = pd.DataFrame.from_dict(recipes)
    df = binarize_ingredients(df)
    return df


def recipes_of_users_to_df(preferences_of_a_user: list) -> pd.DataFrame:
    df = pd.DataFrame.from_dict(preferences_of_a_user)
    df = binarize_ingredients(df)
    return df


def recipe_cosine_similarity(df: pd.DataFrame, df_X: pd.DataFrame, df_Y: pd.DataFrame, num: int) -> list:
    suggested_recipes = []

    # Compute the cosine similarity between X (seed) and Y using sklearn
    # [0] to take only 1 dimension from the 2-d output
    cos_sim = cosine_similarity(df_X, df_Y)[0]

    # Sort the array to work out which item is most similar.
    # To save time and resources, we iterate through only the top 10 recipes.
    for idx, score in sorted(enumerate(cos_sim), key=lambda x: x[1], reverse=True)[:num]:
        # # Select only ingredient columns from dataframe. Use [idx] because we want a DataFrame type, not Series type
        # df_ingredients = df.iloc[[idx], 1:]
        #
        # # Select the ingredient columns that are present in this recipe (value = 1)
        # df_ingredients = df_ingredients.loc[:, (df_ingredients == 1).any()]
        #
        # # Convert the columns to list
        # ingredients_list = df_ingredients.columns.tolist()

        suggested_recipe_dict = {
            "recipeId": df.iloc[idx, 0],
            "cosineSimilarity": score,
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


# def orders_col_to_df() -> pd.DataFrame:
#     data = db_crud.get_all_recipes()
#     data_flat = []
#
#     for idx, d in enumerate(data):
#         igd = []
#         ingredients = d["ingredients"]
#         for i in ingredients:
#             an_ingredient = i["name"].split(",")[0]
#             igd.append(an_ingredient)
#         data_flat.append({
#             "recipe_name": d["name"],
#             "ingredients": igd
#         })
#
#     df = json_normalize(data_flat)
#
#     mlb = MultiLabelBinarizer()
#     df = df.join(pd.DataFrame(mlb.fit_transform(df.pop('ingredients')),
#                               columns=mlb.classes_,
#                               index=df.index))
#
#     return df


def calculate_all_user_recipes(num: int):
    updated_count = 0
    # Load all the recipes from db
    df_recipes = recipes_col_to_df()

    # Load the recipes ordered by users
    preferences_of_users = db_crud.get_users_preference()
    for user_id in preferences_of_users:
        ingredients_of_user = preferences_of_users[user_id]

        # Create Y dataframe with the columns (ingredients) of interest
        df_Y = df_recipes[ingredients_of_user]

        # Take a sample to create a placeholder for the user ingredients
        # And create X dataframe
        df_X = df_Y.iloc[[0]]
        df_X.loc[:, ingredients_of_user] = 1

        suggested_recipes = recipe_cosine_similarity(df_recipes, df_X, df_Y, num)

        data_for_db = {
            "orderBasedRecommendations": suggested_recipes,
            "ingredientsFromOrders": ingredients_of_user
        }

        updated_count = updated_count + db_crud.insert_recommendations(user_id, data_for_db)

    return {
        "success": {
            "total_updated_documents_in_db": updated_count
        }
    }


if __name__ == "__main__":
    print(calculate_all_user_recipes(10))
