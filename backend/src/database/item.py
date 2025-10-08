from supabase import Client


def create_item(database: Client, data):
    del data["id"]  # Remove id if present, as it will be auto-generated
    del data["created_at"]  # Remove created_at if present, as it will be auto-generated
    response = database.table("item").insert(data).execute()
    return response.data[0] if response.data else None


def get_items_by_character_id(database: Client, character_id: str):
    response = database.table("item").select("*").eq("character_id", character_id).execute()
    return response.data if response.data else []
