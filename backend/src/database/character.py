from supabase import Client

from src.models.item import Item
from src.models.character import Character, CharacterData


def create_character(database: Client, data):
    response = database.table("character").insert(data).execute()
    return Character(**response.data[0]) if response.data else None


def get_character_by_id(database: Client, character_id: str) -> Character | None:
    response = database.table("character").select("*").eq("id", character_id).execute()
    return Character(**response.data[0]) if response.data else None


def get_character_by_account_id(database: Client, account_id: str):
    response = database.table("character").select("*").eq("account_id", account_id).execute()
    return Character(**response.data[0]) if response.data else None


def get_character_data_by_id(database: Client, character_id: str) -> CharacterData:
    """ Fetches all data related to a character, including items and stats. """

    character = get_character_by_id(database, character_id)
    if not character:
        return None

    response = database.table("item").select("*").eq("character_id", character_id).execute()
    items = response.data if response.data else []
    item_map = {item["id"]: Item(**item) for item in items}
    # stats_response = database.table("stat").select("*").eq("character_id", character_id).execute()

    character_data = CharacterData(**character.model_dump())
    character_data.items = item_map

    return character_data
