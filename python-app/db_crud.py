import pymongo
from bson import ObjectId
from decouple import config
from icecream import ic
import json

myclient = pymongo.MongoClient(config("MONGO_URI"))
mydb = myclient["pernug"]
recipes_col = mydb["recipes"]
users_col = mydb["users"]


def populate_db_with_recipes():
    # If cold start
    print(">>Inserting recipes to db...")
    if recipes_col.estimated_document_count() == 0:
        # Open JSON file
        with open("./data/recipes.json") as f:
            # Returns JSON object as a dictionary
            recipes_dict = json.load(f)
            # Iterate through the json list
            for i in recipes_dict["recipes"]:
                recipes_col.insert_one(i)
                print(i)
        print("...done")
    else:
        print("...collection already has data")


def get_all_recipes() -> list:
    cursor = recipes_col.find({}, {'_id': False})

    return list(cursor)


def get_user_preference(user_id: str) -> dict:
    cursor = users_col.find_one(
        {
            "_id": user_id
        },
        {
            "likedIngredients": 1,
            '_id': False
        }
    )
    return cursor
