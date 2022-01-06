from typing import Optional

from fastapi import FastAPI
from pydantic import BaseModel

from recommender import calculate_all_user_recipes


class SimilarRecipesParameters(BaseModel):
    recipe_name: str
    num_recipes: Optional[int] = 10


class UserRecipesParameters(BaseModel):
    num_recipes: Optional[int] = 10


app = FastAPI()


@app.get("/")
async def root():
    return {"status": "API is alive and well"}


# @app.get("/all-recipes")
# async def get_all_recipes():
#     data = db_crud.get_all_recipes()
#     return {"recipes": data}


# @app.post("/similar-recipes/")
# async def similar_recipes(similar_recipes_parameters: SimilarRecipesParameters):
#     try:
#         suggested_recipes = suggest_similar_recipes(similar_recipes_parameters.recipe_name,
#                                                     similar_recipes_parameters.num_recipes)
#     except Exception as e:
#         return {
#             "error": {
#                 "message": "An error occurred while calculating similar recipes.",
#                 "type": str(e)
#             }
#         }
#     else:
#         return suggested_recipes


@app.post("/cal-all-user-recipes/")
async def calculate_users_recipes(user_recipes_parameters: UserRecipesParameters):
    try:
        output = calculate_all_user_recipes(user_recipes_parameters.num_recipes)
    except Exception as e:
        return {
            "error": {
                "message": "An error occurred while calculating user recipes.",
                "type": str(e)
            }
        }
    else:
        return output
