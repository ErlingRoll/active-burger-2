import os
import asyncio
import aiohttp.web
import json
from dotenv import load_dotenv

from src.connection_manager import ConnectionManager
from src.init_database import create_database_client
from src.gamestate import Gamestate
from src.websocket import websocket_handler


load_dotenv()

PORT = int(os.getenv("PORT", 8080))


async def main():
    app = aiohttp.web.Application()

    # Init database
    database = create_database_client()
    app["database"] = database

    # Connection manager
    connection_manager = ConnectionManager()
    app["connection_manager"] = connection_manager

    # Init gamestate
    gamestate = Gamestate(database, connection_manager)
    app["gamestate"] = gamestate

    app.router.add_get('/game', websocket_handler)
    runner = aiohttp.web.AppRunner(app)
    await runner.setup()
    site = aiohttp.web.TCPSite(runner, 'localhost', PORT)
    await site.start()
    print(f"Server started on http://localhost:{PORT}")
    await asyncio.Event().wait()  # Keep the server running indefinitely


if __name__ == "__main__":
    asyncio.run(main())
