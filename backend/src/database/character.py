from supabase import AsyncClient

from src.models.item import Item
from src.models.character import Character, CharacterData


async def update_character(database: AsyncClient, character: Character) -> Character | None:
    character_json = character.model_dump()
    del character_json["height"]
    del character_json["width"]
    response = await database.table("character").update(character_json).eq("id", character.id).execute()
    return CharacterData(**response.data[0]) if response.data else None


async def create_character(database: AsyncClient, data):
    response = await database.table("character").insert(data).execute()
    return Character(**response.data[0]) if response.data else None


async def get_character_by_id(database: AsyncClient, character_id: str) -> Character | None:
    response = await database.table("character").select("*").eq("id", character_id).execute()
    return Character(**response.data[0]) if response.data else None


async def get_character_by_account_id(database: AsyncClient, account_id: str):
    response = await database.table("character").select("*").eq("account_id", account_id).execute()
    return Character(**response.data[0]) if response.data else None


async def get_character_data_by_id(database: AsyncClient, character_id: str) -> CharacterData | None:
    """ Fetches all data related to a character, including items and stats. """

    character = await get_character_by_id(database, character_id)
    if not character:
        return None

    response = await database.table("item").select("*").eq("character_id", character_id).execute()
    items = response.data if response.data else []
    item_map = {item["id"]: Item(**item) for item in items}
    # stats_response = database.table("stat").select("*").eq("character_id", character_id).execute()

    character_data = CharacterData(**character.model_dump())
    character_data.items = item_map

    return character_data


async def get_characters(database: AsyncClient) -> dict[str, Character]:
    data = await database.table("character").select("*").execute()
    if data and data.data:
        characters = {char["id"]: Character(**char) for char in data.data}
        return characters
    return {}
