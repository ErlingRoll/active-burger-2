from aiohttp.web import Request, WebSocketResponse

from src.connection_manager import ConnectionManager
from src.gamestate import Gamestate
from src.database.account import get_account_by_discord_id, create_account
from src.database.character import get_character_by_account_id, create_character, get_character_data_by_id
from src.models.character import Character
from src.models.account import Account


async def login(request: Request, ws: WebSocketResponse, account: Account | None, payload: dict):
    database = request.app["database"]
    gamestate: Gamestate = request.app["gamestate"]
    connection_manager: ConnectionManager = request.app["connection_manager"]

    account = get_account_by_discord_id(database, payload.get("discord_id"))

    if not account:
        print("Creating new account...")
        account = create_account(database, payload)

    # Automatically create a character for the new account.
    # Add character selection logic later

    if not account:
        await ws.send_str("Error: Failed to create account.")
        return

    # Save account_id in ws session for future reference
    ws.account_id = account.get("id")
    connection_manager.update_account_map(account.get("id"), ws)

    character = await get_or_create_character(request, ws, payload, account)

    character_data = get_character_data_by_id(database, character.id)

    await ws.send_json({
        "event": "login_success",
        "payload": {
            "account": account,
            "character": character_data.model_dump()
        }
    })

    await gamestate.add_character(character)


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

    return character
