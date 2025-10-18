from aiohttp.web import Request, WebSocketResponse


from .models import Account, Character
from .actions import get_character, use_item, login, move, place_object, delete_object, give_item, interact, unequip_item, sell, buy


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

    if action == "get_character":
        await get_character(request, app, ws, account, payload)
    elif action == "move":
        await move(request, ws, account, character, payload)
    elif action == "use_item":
        await use_item(request, app, ws, account, character, payload)
    elif action == "place_object":
        await place_object(request, ws, account, character, payload)
    elif action == "delete_object":
        await delete_object(request, ws, account, payload)
    elif action == "give_item":
        await give_item(request, ws, account, character, payload)
    elif action == "interact":
        await interact(request, ws, account, character, payload)
    elif action == "unequip_item":
        await unequip_item(request, app, ws, account, character, payload)
    elif action == "buy":
        await buy(request, ws, account, character, payload)
    elif action == "sell":
        await sell(request, ws, account, character, payload)
    else:
        await ws.send_str(f"Error: Unknown action '{action}'")
