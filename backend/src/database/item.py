from typing import List
from supabase import Client

from src.generators.item import generate_item
from src.models.item import Item


def get_item_by_id(database: Client, id: str) -> Item:
    response = database.table("item").select("*").eq("id", id).execute()

    return generate_item(**response.data[0]) if response.data else None


def create_item(database: Client, item: Item) -> Item:
    data = item.model_dump()
    del data["id"]  # Remove id if present, as it will be auto-generated
    del data["created_at"]  # Remove created_at if present, as it will be auto-generated
    response = database.table("item").insert(data).execute()
    return generate_item(**response.data[0]) if response.data else None


def update_item(database: Client, item: Item) -> Item:
    data = item.model_dump()
    item_id = data.pop("id", None)
    if not item_id:
        raise ValueError("Item ID is required for update")
    response = database.table("item").update(data).eq("id", item_id).execute()
    return generate_item(**response.data[0]) if response.data else None


def delete_item(database: Client, item_id: str) -> bool:
    response = database.table("item").delete().eq("id", item_id).execute()
    return True


def get_items_by_character_id(database: Client, character_id: str) -> List[Item]:
    response = database.table("item").select("*").eq("character_id", character_id).execute()
    items = response.data if response.data else []
    return [generate_item(**item) for item in items]
