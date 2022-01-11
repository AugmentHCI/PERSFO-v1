from typing import Optional

from fastapi import FastAPI
from pydantic import BaseModel

from db_status import get_db_status
from recommender import content_based_recommendation, useritem_filtering_recommendation
from fastapi_utils.tasks import repeat_every
from threading import Thread
import logging

logging.basicConfig(filename='app.log', filemode='w', format='%(asctime)s %(levelname)s %(message)s',
                    level=logging.ERROR)
logger = logging.getLogger(__name__)


class SimilarRecipesParameters(BaseModel):
    recipe_name: str
    num_recipes: Optional[int] = 10


class CBFParameters(BaseModel):
    num_recipes: int = 10
    topk_ingredients: int = 5
    ingredients_to_remove: list = [
        "Water", "Gejodeerd zout", "Gejodeerdzout", "Zout", "Peper", "Witte peper", "Wittepeper",
        "Maïszetmeel", "Specerij", "Saus", "Kruidenmix", "Kruiden", "Suiker", "Kristalsuiker",
        "Olijfolie", "Boter", "Vetstof", "Smaakmaker", "Stabilisatoren"
    ]
    save_to_db: bool = True


class ColabFParameters(BaseModel):
    num_recipes: int = 10
    save_to_db: bool = True


app = FastAPI()


@app.get("/")
async def root():
    return get_db_status()


# @app.get("/all-recipes")
# async def get_all_recipes():
#     data = db_crud.get_all_recipes()
#     return {"recipes": data}

def periodic_cbf_thread():
    cbf_parameters = CBFParameters()
    try:
        output = content_based_recommendation(
            cbf_parameters.num_recipes,
            cbf_parameters.topk_ingredients,
            cbf_parameters.ingredients_to_remove,
            cbf_parameters.save_to_db
        )
    except Exception as e:
        logging.error(e, exc_info=True)


def periodic_collabf_thread():
    collab_f_parameters = ColabFParameters()
    try:
        output = useritem_filtering_recommendation(
            collab_f_parameters.num_recipes,
            collab_f_parameters.save_to_db
        )
    except Exception as e:
        logging.error(e, exc_info=True)


# Run recommendations on API startup and every 24 hours
@app.on_event("startup")
@repeat_every(seconds=24 * 60 * 60)  # 24 hours
def periodic():
    Thread(target=periodic_cbf_thread).start()
    Thread(target=periodic_collabf_thread).start()


@app.post("/cal-all-user-recipes/")
async def make_content_based_recommendation(cbf_parameters: CBFParameters):
    try:
        output = content_based_recommendation(
            cbf_parameters.num_recipes,
            cbf_parameters.topk_ingredients,
            cbf_parameters.ingredients_to_remove,
            cbf_parameters.save_to_db
        )
    except Exception as e:
        logging.error(e, exc_info=True)
        return {
            "error": {
                "message": "An error occurred while making content based recommendations.",
                "type": str(e)
            }
        }
    else:
        return output


@app.post("/cal-cf-recipes/")
async def make_collaborative_filtered_recommendation(collab_f_parameters: ColabFParameters):
    try:
        output = useritem_filtering_recommendation(
            collab_f_parameters.num_recipes,
            collab_f_parameters.save_to_db
        )
    except Exception as e:
        logging.error(e, exc_info=True)
        return {
            "error": {
                "message": "An error occurred while making collaborative filtered recommendations.",
                "type": str(e)
            }
        }
    else:
        return output
