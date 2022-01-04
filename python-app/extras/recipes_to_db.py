import json
import pymongo
from decouple import config

import db_crud

myclient = pymongo.MongoClient(config('MONGO_URI'))
mydb = myclient["pernug"]
mycol = mydb["recipes"]


# def populate_db_with_recipes():
#     if mycol.estimated_document_count() == 0:
#         # Cold start
#         print(">>Inserting recipes to db...")
#
#         # Open JSON file
#         with open("../data/recipes.json") as f:
#             # Returns JSON object as a dictionary
#             recipes_dict = json.load(f)
#             # Iterate through the json list
#             for i in recipes_dict["recipes"]:
#                 mycol.insert_one(i)
#                 print(i)
#         print("...done")
#     data = db_crud.get_all_recipes()
#     return data
