from aiohttp.web import Request, WebSocketResponse

from .models import Account, Character
from .actions import get_character, use_item, login, move, place_object, delete_object, give_item, interact


async def handle_action(request: Request, ws: WebSocketResponse, data: dict, action: str):
    app = request.app
    payload = data.get("payload", {})
    account = data.get("account")
    account = Account(**account) if account else None
    character = data.get("character")
    character = Character(**character) if character else None

    # print(f"Handling action: {action} with payload: {payload}")

    if action == "login":
        await login(request, ws, account, payload)
    elif action == "get_character":
        await get_character(request, ws, account, payload)
    elif action == "move":
        await move(request, ws, account, character, payload)
    elif action == "use_item":
        await use_item(app, ws, account, character, payload)
    elif action == "place_object":
        await place_object(request, ws, account, character, payload)
    elif action == "delete_object":
        await delete_object(request, ws, account, payload)
    elif action == "give_item":
        await give_item(request, ws, account, character, payload)
    elif action == "interact":
        await interact(request, ws, account, character, payload)
    else:
        await ws.send_str(f"Error: Unknown action '{action}'")
