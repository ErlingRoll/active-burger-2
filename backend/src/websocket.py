import json
from aiohttp.web import Request, WSMsgType, WebSocketResponse
import asyncio
from pyventus.events import AsyncIOEventEmitter, EventEmitter, EventLinker

from .actions.login import login


async def websocket_handler(request: Request):
    ws = WebSocketResponse()
    await ws.prepare(request)

    print(f"WebSocket connected: {request.remote}")

    # Add event handler for gamestate update
    @EventLinker.on("gamestate_update")
    async def on_gamestate_update(data):
        if not ws.closed:
            event = {
                "event": "gamestate_update",
                "payload": data
            }
            await ws.send_str(json.dumps(event))
        else:
            print(f"WebSocket is closed, cannot send data to {request.remote}")

    EventLinker.on("gamestate_update", on_gamestate_update)

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

                    if action == "login":
                        await login(request, ws, data.get("payload", {}))
                        # send_task = asyncio.create_task(
                        #     login(request, ws, data.get("payload", {})))
                        # await send_task  # Await the login task to ensure it completes
                    else:
                        await ws.send_str(f"Error: Unknown action '{action}'")

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

    try:
        EventLinker.remove("gamestate_update", on_gamestate_update)
    except Exception as e:
        pass

    print(f"WebSocket disconnected: {request.remote}")
    return ws
