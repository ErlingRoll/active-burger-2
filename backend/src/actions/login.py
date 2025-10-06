from aiohttp.web import Request, WebSocketResponse

from src.database.account import get_account_by_discord_id, create_account
from src.database.character import get_character_by_account_id, create_character
from src.models.character import Character


async def login(request: Request, ws: WebSocketResponse, payload: dict):
    database = request.app["database"]
    gamestate = request.app["gamestate"]

    account = get_account_by_discord_id(database, payload.get("discord_id"))

    if not account:
        print("Creating new account...")
        account = create_account(database, payload)

    # Automatically create a character for the new account.
    # Add character selection logic later

    if not account:
        await ws.send_str("Error: Failed to create account.")
        return

    print(f"login_success: {account.get('discord_id')}")

    character_data = await get_or_create_character(request, ws, payload, account)
    character = Character(**character_data)
    await gamestate.addCharacter(character)


async def get_or_create_character(request: Request, ws: WebSocketResponse, payload: dict, account: dict):
    database = request.app["database"]

    character = get_character_by_account_id(database, account.get("id"))

    if not character:
        print("Creating new character...")
        character_data = {
            "account_id": account.get("id"),
            "name": payload.get("name", "Newbie"),
        }
        character = create_character(database, character_data)

    if not character:
        await ws.send_str("Error: Failed to create character.")
        return

    print(f"get_character_success: {character.get('id')}")

    await ws.send_json({
        "event": "login_success",
        "payload": {
            "account": account,
            "character": character
        }
    })

    return character
