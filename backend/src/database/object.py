from supabase import Client

from src.models.render_object import RenderObject


def get_objects(database: Client, dict: bool = True):
    """ Fetch all objects and inherited objects from the database """

    objects = []

    response = database.table("only_object").select("*").execute()
    objects += response.data if response and response.data else []

    entity_response = database.table("only_entity").select("*").execute()
    objects += entity_response.data if entity_response and entity_response.data else []

    if dict:
        return {obj["id"]: RenderObject(**obj) for obj in objects}

    return [RenderObject(**obj) for obj in objects]


def create_object(database: Client, data: RenderObject):
    del data.id  # Remove id if present, as it will be auto-generated
    del data.created_at  # Remove created_at if present, as it will be auto-generated
    response = database.table(data.type).insert(data.model_dump()).execute()
    return response.data[0] if response.data else None


def remove_object(database: Client, object_id: str):
    response = database.table("object").delete().eq("id", object_id).execute()
    return response.data[0] if response.data else None
