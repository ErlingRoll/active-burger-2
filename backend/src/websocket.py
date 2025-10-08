import json
from aiohttp.web import Request, WSMsgType, WebSocketResponse
import asyncio

from .models.account import Account
from .actions.character import get_character
from .actions.login import login
from .actions.move import move
from .actions.admin.object import place_object, delete_object
from .actions.admin.item import give_item


async def handle_action(request: Request, ws: WebSocketResponse, data: dict, action: str):
    payload = data.get("payload", {})
    account = data.get("account")
    account = Account(**account) if account else None

    # print(f"Handling action: {action} with payload: {payload} and account: {account.get('id')}")

    if action == "login":
        await login(request, ws, account, payload)
    elif action == "get_character":
        await get_character(request, ws, account, payload)
    elif action == "move":
        await move(request, ws, account, payload)
    elif action == "place_object":
        await place_object(request, ws, account, payload)
    elif action == "delete_object":
        await delete_object(request, ws, account, payload)
    elif action == "give_item":
        await give_item(request, ws, account, payload)
    else:
        await ws.send_str(f"Error: Unknown action '{action}'")


async def websocket_handler(request: Request):
    connection_manager = request.app["connection_manager"]

    ws = WebSocketResponse()

    await ws.prepare(request)

    connection_id = connection_manager.add_connection(ws)

    print(f"WebSocket connected: {request.remote}")

    # Start a separate task for receiving messages
    async def receive_messages():
        try:
            async for msg in ws:
                if msg.type == WSMsgType.TEXT:
                    # print(f"Received from {request.remote}: {msg.data}")

                    # Parse data as json
                    try:
                        data = json.loads(msg.data)
                        # print(f"Parsed JSON data: {data}")
                    except json.JSONDecodeError:
                        print(f"Failed to parse JSON: {msg.data}")

                    if not data.get("action"):
                        await ws.send_str("Error: 'action' field is required.")
                        continue  # Skip to next message

                    action = data.get("action")

                    await handle_action(request, ws, data, action)

                elif msg.type == WSMsgType.CLOSE:
                    print(f"WebSocket closed by client: {request.remote}")
                    break

                elif msg.type == WSMsgType.ERROR:
                    print(
                        f"WebSocket connection closed with exception: {ws.exception()}")
        except asyncio.CancelledError:
            print(f"Receive task for {request.remote} cancelled.")
        finally:
            print(f"Receive task for {request.remote} finished.")

    await asyncio.create_task(receive_messages())

    print(f"WebSocket disconnected: {request.remote}")

    # Clean up event listener
    connection_manager.remove_connection(connection_id)

    return ws
