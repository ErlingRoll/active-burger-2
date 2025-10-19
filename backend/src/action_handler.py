from aiohttp.web import Request, WebSocketResponse
from src.actions.action import ActionRequest
from .models import Account, Character

from .actions import get_character, use_item, login, move, place_object, delete_object, give_item, interact, unequip_item, sell, buy, place_terrain, delete_terrain


async def handle_action(request: Request, ws: WebSocketResponse, data: dict, action: str):
    app = request.app
    payload = data.get("payload", {})
    account = data.get("account")
    account = Account(**account) if account else None
    character = data.get("character")
    character = Character(**character) if character else None

    # print(f"Handling action: {action} with payload: {payload}")

    if action == "login":
        return await login(request, ws, account, payload)

    if account is None or character is None:
        return await ws.send_json({
            "error": "Authentication required",
            "action": action,
            "payload": payload
        })

    action_request = ActionRequest(request=request, app=app, ws=ws, account=account, character=character, payload=payload)

    if action == "get_character":
        await get_character(action_request)
    elif action == "move":
        await move(action_request)
    elif action == "use_item":
        await use_item(action_request)
    elif action == "place_terrain":
        await place_terrain(action_request)
    elif action == "delete_terrain":
        await delete_terrain(action_request)
    elif action == "place_object":
        await place_object(action_request)
    elif action == "delete_object":
        await delete_object(action_request)
    elif action == "give_item":
        await give_item(action_request)
    elif action == "interact":
        await interact(action_request)
    elif action == "unequip_item":
        await unequip_item(action_request)
    elif action == "buy":
        await buy(action_request)
    elif action == "sell":
        await sell(action_request)
    else:
        await ws.send_str(f"Error: Unknown action '{action}'")
