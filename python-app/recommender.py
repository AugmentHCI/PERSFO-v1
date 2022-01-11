import numpy as np

import db_crud
from pandas import DataFrame, options, pivot_table, to_numeric
import datetime
from timeit import default_timer as timer
options.mode.chained_assignment = None
from collections import Counter
from icecream import ic
from sklearn.preprocessing import MultiLabelBinarizer
from sklearn.metrics.pairwise import cosine_similarity
from surprise import SVD, Reader, Dataset


def binarize_ingredients(df: DataFrame) -> DataFrame:
    mlb = MultiLabelBinarizer()
    df = df.join(DataFrame(mlb.fit_transform(df.pop('cleanedIngredients')),
                           columns=mlb.classes_,
                           index=df.index))
    return df


def recipes_col_to_df() -> DataFrame:
    recipes = db_crud.get_all_recipes()
    df = DataFrame.from_dict(recipes)
    df = binarize_ingredients(df)
    return df


def recipes_of_user_to_df(preferences_of_a_user: list) -> DataFrame:
    df = DataFrame.from_dict(preferences_of_a_user)
    df = binarize_ingredients(df)
    return df


def recipe_cosine_similarity(df: DataFrame, df_X: DataFrame, df_Y: DataFrame, num: int) -> list:
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


# def orders_col_to_df() -> DataFrame:
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
#     df = df.join(DataFrame(mlb.fit_transform(df.pop('ingredients')),
#                               columns=mlb.classes_,
#                               index=df.index))
#
#     return df

def remove_ingredients(the_list: list, ingredients_to_remove: list):
    final_list = list(set(the_list) - set(ingredients_to_remove))
    # for ing_to_remove in ingredients_to_remove:
    #     for ingredient in the_list:
    #         print(ing_to_remove, ingredient)
    #         if ingredient == ing_to_remove:
    #             the_list.remove(ingredient)
    # result = [ingredient for ingredient in the_list if ingredient != ing_to_remove]
    return final_list


def get_the_topk_ingredients(ingredients_of_user: list, topk_features: list):
    # Select some most common ingredients
    ingredients_of_user = Counter(ingredients_of_user).most_common(topk_features)

    # Get the list of features back from list of tuple
    return [a_tuple[0] for a_tuple in ingredients_of_user]


def content_based_recommendation(num: int, topk_features: int, ingredients_to_remove: list, save_to_db: bool):
    # Save how long the computation takes
    start = timer()

    output = []
    # Load all the recipes from db
    df_recipes = recipes_col_to_df()

    # Load the recipes ordered by users
    preferences_of_users = db_crud.get_users_preference()

    for user_id in preferences_of_users:
        ingredients_of_user = preferences_of_users[user_id].copy()

        # Remove given ingredients from the list
        ingredients_of_user = remove_ingredients(ingredients_of_user, ingredients_to_remove)

        # Select some most common ingredients
        ingredients_of_user = get_the_topk_ingredients(ingredients_of_user, topk_features)

        # Create Y dataframe with the columns (ingredients) of interest
        df_Y = df_recipes[ingredients_of_user]

        # Take a sample to create a placeholder for the user ingredients
        # And create X dataframe
        df_X = df_Y.iloc[[0]]
        df_X.loc[:, ingredients_of_user] = 1

        suggested_recipes = recipe_cosine_similarity(df_recipes, df_X, df_Y, num)

        all_ingredients_from_orders = dict(Counter(preferences_of_users[user_id]))

        data_for_db = {
            "orderBasedRecommendations": suggested_recipes,
            "ingredientsFromOrders": all_ingredients_from_orders,
            "recommenderMetaData": {
                "timestamp": datetime.datetime.utcnow(),
                "numOfRecommendationsRequested": num,
                "topkIngredientsRequested": f"{topk_features} out of {len(all_ingredients_from_orders)}",
                "ingredientsExcluded": ingredients_to_remove,
                "ingredientsUsed": ingredients_of_user,
                "runTime": '%0.2fs' % (timer() - start)
            }
        }

        # Update the db
        if save_to_db:
            db_update_return = db_crud.insert_recommendations(user_id, data_for_db)
            data_for_db["db_modified_count"] = db_update_return

        data_for_db["userid"] = user_id
        output.append(data_for_db)
    return output


def fit_dataframe(df: DataFrame):
    # A reader is needed by surprise lib but the rating_scale param is requiered.
    reader = Reader(rating_scale=(0, 1))
    data = Dataset.load_from_df(df[['userid', 'recipeId', 'ordered']], reader)
    trainset = data.build_full_trainset()

    # Fit an SVD model
    svd_model = SVD()
    svd_model.fit(trainset)

    return svd_model


def id_dict_to_df(id_dict: dict, col_name: str, new_col_name: str) -> DataFrame:
    df = DataFrame.from_dict(id_dict)
    df_unique_ids = DataFrame(list(df[col_name].unique()), columns=[new_col_name])

    return df_unique_ids


def get_score(history, similarities):
    return sum(history * similarities) / sum(similarities)


def make_orders_per_user_dict(user_ordered_recipes: list) -> dict:
    orders_per_user_dict = {}
    for each_user_order in user_ordered_recipes:
        user_id = each_user_order["userid"]
        # If user is not in the dict, first create a key with empty array
        if user_id not in orders_per_user_dict:
            orders_per_user_dict[user_id] = []
        # Then add the array
        orders_per_user_dict[user_id].append(each_user_order["recipeId"])
    return orders_per_user_dict


def useritem_filtering_recommendation(num_of_rec: int, save_to_db: bool):
    # Save how long the computation takes
    start = timer()

    user_ordered_recipes = db_crud.get_confirmed_orders()

    # Used later to avoid recommending the recipes user already ordered
    orders_per_user_dict = make_orders_per_user_dict(user_ordered_recipes)

    # Dataframes with all unique user and recipe ids
    # df_users_unique = id_dict_to_df(db_crud.get_all_users_ids(), "_id", "userid")
    # df_recipes_unique = id_dict_to_df(db_crud.get_all_recipes_ids(), "id", "recipeId")

    # Load the recipes ordered by users
    # And add a new column "ordered", mark cells as 1 (ordered)
    df = DataFrame.from_dict(user_ordered_recipes)

    # Group duplicated user and recipe pairs
    df = df.groupby(['userid', 'recipeId']).sum().reset_index()

    # Add a binary indicator
    df["ordered"] = 1

    # Create a user-recipe interaction (ordered) matrix
    # Replace NaN with 0 -> user has not ordered the recipe
    df_matrix = pivot_table(df, values='ordered', index='userid', columns='recipeId', fill_value=0)
    # df_matrix = pivot_table(df, values='ordered', index=df_users_unique["userid"].tolist(), columns=df_recipes_unique["recipeId"].tolist())

    # bring our pivot table into a common dataframe shape via reset_index()
    df = df_matrix.reset_index().rename_axis(None, axis=1)

    # Create a dataframe which only includes recipes. User is indexed instead.
    df_recipes = df.drop(labels='userid', axis=1)

    # Normalize the matrix
    df_recipes_norm = df_recipes / np.sqrt(np.square(df_recipes).sum(axis=0))

    # Calculate with Vectors to compute Cosine Similarities
    recipe_recipe_sim = df_recipes_norm.transpose().dot(df_recipes_norm)

    # Create a placeholder recipes for closest neighbours to a recipe
    recipe_neighbours = DataFrame(index=recipe_recipe_sim.columns, columns=range(0, len(recipe_recipe_sim.columns)))

    # Loop through the similarity dataframe and fill in neighbouring recipe names
    for i in range(0, len(recipe_recipe_sim.columns)):
        recipe_neighbours.iloc[i, :] = recipe_recipe_sim.iloc[0:, i].sort_values(ascending=False)[
                                       :].index

    # Build a user based recommendation, which is build upon the recipe-recipe similarity matrix.
    # Create a place holder matrix for similarities, and fill in the user column
    user_recipe_similarity = DataFrame(index=df.index, columns=df.columns)
    user_recipe_similarity.iloc[:, :1] = df.iloc[:, :1]

    # Loop through the rows and columns filling in empty spaces with similarity scores.
    for i in range(0, len(user_recipe_similarity.index)):
        for j in range(1, len(user_recipe_similarity.columns)):
            each_user_order = user_recipe_similarity.index[i]
            recipe = user_recipe_similarity.columns[j]

            recipe_top = recipe_neighbours.loc[recipe]

            recipe_top_similarity = recipe_recipe_sim.loc[recipe].sort_values(ascending=False)
            # Use the recipe dataframe, which was generated during item-item matrix
            user_orders = df_recipes.loc[each_user_order, recipe_top]

            user_recipe_similarity.loc[i][j] = get_score(user_orders, recipe_top_similarity)

    # Limit the recommendation size to the max available columns
    if num_of_rec >= len(user_recipe_similarity.columns):
        num_of_rec = len(user_recipe_similarity.columns) - 1

    # # Generate a matrix of user based recommendations
    # user_item_recommend = DataFrame(index=user_recipe_similarity.index,
    #                                 columns=['userid'] + list(range(0, num_of_rec)))  # Columns 1 to 6
    # user_item_recommend.iloc[0:, 0] = user_recipe_similarity.iloc[:, 0]

    output = []
    # Instead of having the matrix filled with similarity scores we want to see the recipe names.
    for index, row in user_recipe_similarity.iterrows():
        # Score the recipes that the user has already consumed as 0, because there is no point recommending it again.
        for recipe in orders_per_user_dict[row["userid"]]:
            row[recipe] = 0.0

        recommendation = row.iloc[1:].sort_values(ascending=False).iloc[0:num_of_rec]
        recommendation_df = recommendation.to_frame().reset_index()
        recommendation_df = recommendation_df.rename(columns={index: "cosineSimilarity", "index": "recipeId"})

        data_for_db = {
            "collaborativeFiltering": recommendation_df.to_dict('records'),
            "collaborativeFilteringMetaData": {
                "timestamp": datetime.datetime.utcnow(),
                "numOfRecommendationsRequested": num_of_rec,
                "numOfRecommendationsAvailable": len(user_recipe_similarity.columns) - 1,
                "numOfUsersWithValidData": len(orders_per_user_dict),
                "runTime": '%0.2fs' % (timer() - start)
            }
        }

        # Update the db
        if save_to_db:
            db_update_return = db_crud.insert_recommendations(str(row["userid"]), data_for_db)
            data_for_db["db_modified_count"] = db_update_return

        data_for_db["userid"] = row["userid"]
        output.append(data_for_db)

    return output

    # SVD
    # svd_model = fit_dataframe(df)
    #
    # user_id = str("BjRnLcPw3foPjBsBo")  # user id
    # recipe_id = str("149743403470001")  # movie id
    #
    # # Get a prediction for the given users and recipe.
    # prediction_output = svd_model.predict(user_id, recipe_id, verbose=True)

    # # Matrix
    # # https://beckernick.github.io/matrix-factorization-recommender/
    # # one row per user and one column per movie
    # R_df = ratings_df.pivot(index='UserID', columns='MovieID', values='Rating').fillna(0)
    # # de-mean the data (normalize by each users mean) and convert it from a dataframe to a numpy array.
    # R = R_df.as_matrix()
    # user_ratings_mean = np.mean(R, axis=1)
    # R_demeaned = R - user_ratings_mean.reshape(-1, 1)


if __name__ == "__main__":
    # print(content_based_recommendation(10, 5, ["Koolzaadolie", "Water", "Gejodeerdzout", "Knoflook", "Aardappel", "Kervel", "Koolzaadolie", "Gejodeerdzout", "Knoflook", "Water", "Champignon", "Knolselderij", "Aardappel", "Roommelk", "Koolzaadolie", "Gejodeerdzout", "Knoflook"]))
    print(useritem_filtering_recommendation(5, False))
