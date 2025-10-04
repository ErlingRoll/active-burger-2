import aiohttp.web
import asyncio

from gamestate import Gamestate


port = 8080


async def websocket_handler(request):
    ws = aiohttp.web.WebSocketResponse()
    await ws.prepare(request)

    print(f"WebSocket connected: {request.remote}")

    # Start a separate task for receiving messages
    async def receive_messages():
        try:
            async for msg in ws:
                if msg.type == aiohttp.WSMsgType.TEXT:
                    print(f"Received from {request.remote}: {msg.data}")
                    await ws.send_str(f"Echo: {msg.data}")
                elif msg.type == aiohttp.WSMsgType.ERROR:
                    print(
                        f"WebSocket connection closed with exception: {ws.exception()}")
        except asyncio.CancelledError:
            print(f"Receive task for {request.remote} cancelled.")
        finally:
            print(f"Receive task for {request.remote} finished.")

    receive_task = asyncio.create_task(receive_messages())

    # You can also have other tasks sending data to this websocket
    # For example, a task that periodically sends updates:
    async def send_updates():
        try:
            for i in range(5):
                await asyncio.sleep(1)
                if not ws.closed:  # Check if the websocket is still open before sending
                    await ws.send_str(f"Server update {i+1}")
        except asyncio.CancelledError:
            print(f"Send task for {request.remote} cancelled.")
        finally:
            print(f"Send task for {request.remote} finished.")

    send_task = asyncio.create_task(send_updates())

    # Wait for the receive task to complete (e.g., client disconnects)
    await receive_task

    # Cancel the send task if it's still running
    send_task.cancel()
    await send_task  # Await to ensure cleanup

    print(f"WebSocket disconnected: {request.remote}")
    return ws


async def main():
    app = aiohttp.web.Application()

    # Init gamestate
    gamestate = Gamestate()
    app["gamestate"] = gamestate

    app.router.add_get('/game', websocket_handler)
    runner = aiohttp.web.AppRunner(app)
    await runner.setup()
    site = aiohttp.web.TCPSite(runner, 'localhost', port)
    await site.start()
    print(f"Server started on http://localhost:{port}")
    await asyncio.Event().wait()  # Keep the server running indefinitely


if __name__ == "__main__":
    asyncio.run(main())
