import random
import pandas as pd
from icecream import ic
import nltk
nltk.download('punkt')

df_recipes = pd.read_csv('Recipe_table_V0.csv')
# recipes_dict = df_recipes.to_dict('records')

df_ingredients = pd.read_csv('Ingredients_table_PERNUG.csv')
# ingredients_dict = df_ingredients.to_dict('records')


# tokens = nltk.sent_tokenize(recipes_dict[]["instruction"])

def create_recipes_list():
    recipes_list = []
    for index, row_df_recipes in df_recipes.iterrows():

        print("Recipe: "+row_df_recipes["title"])

        # Instructions list
        steps = []
        instructions = nltk.sent_tokenize(row_df_recipes["instruction"])
        for inst in instructions:
            steps.append({
                "step": inst
            })

        # Ingredients list
        ingredients = []
        ingredient_names_only = []
        df_ingredients_of_recipe = df_ingredients.loc[df_ingredients["Recipe_name"]
                                                    == row_df_recipes["title"]]
        for index, row in df_ingredients_of_recipe.iterrows():
            if not row["Food_name"] in ingredient_names_only: #Todo: removing duplicates. need to remove this line when the issue is solved
                ingredients.append({
                    "name": row["Food_name"],
                    "amount": row["Ingr_quant_g"],
                    "measurement": "g",
                    "grownInGarden": row["Grown_in_garden"],
                    "ironContent": row["Iron_ingredient_recipe"]
                })

                ingredient_names_only.append(row["Food_name"])
            else:
                print(row["Food_name"])

        recipe = {
            "name": row_df_recipes["title"],
            "allergens": [],
            "diet": "vegan",
            "servingSize": row_df_recipes["yields"],
            # TODO: replace course with real values when available
            "course": random.choice(["lunch", "dinner"]),
            "src": row_df_recipes["url"],
            "url": "",
            "kcal": row_df_recipes["Energy_kcal_portion"],
            # TODO: replace minutes with real values when available
            "minutes": random.choice([20, 25, 30, 35, 40]),
            "nutrients": [
                {
                    "name": "Energy",
                    "value": row_df_recipes["Energy_kcal_portion"],
                    "unit": "kcal"
                },
                {
                    "name": "Fat",
                    "value": row_df_recipes["Fat_g_portion"],
                    "unit": "g"
                },
                {
                    "name": "Carbs",
                    "value": row_df_recipes["Carbohydrate_g_portion"],
                    "unit": "g"
                },
                {
                    "name": "Protein",
                    "value": row_df_recipes["Protein_g_portion"],
                    "unit": "g"
                },
                {
                    "name": "Iron",
                    "value": row_df_recipes["Iron_mg_portion"],
                    "unit": "mg"
                },
                {
                    "name": "Vitamin C",
                    "value": row_df_recipes["VitC_mg_portion"],
                    "unit": "mg"
                },
                {
                    "name": "Calcium",
                    "value": row_df_recipes["Calcium_mg_portion"],
                    "unit": "mg"
                }
            ],
            "ingredients": ingredients,
            "steps": steps
        }

        recipes_list.append(recipe)

    return recipes_list


# Save recipes to JSON
def save_to_json():
    import json
    jsonString = json.dumps(create_recipes_list())
    jsonFile = open("data.json", "w")
    jsonFile.write(jsonString)
    jsonFile.close()


save_to_json()
