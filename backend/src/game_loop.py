
from asyncio import gather, get_event_loop, sleep

from src.gamestate import Gamestate
from src.spawners.noob_mine import SpawnMine


TICK_RATE = 1.0  # seconds


async def game_tick(tickers):
    tick_tasks = [ticker.game_tick() for ticker in tickers]
    await gather(*tick_tasks)


async def game_loop(app, database, connection_manager, gamestate: Gamestate):
    tickers = [
        SpawnMine(database=database, connection_manager=connection_manager, gamestate=gamestate),
    ]

    while True:
        start_time = get_event_loop().time()

        await game_tick(tickers)

        await gamestate.publish_gamestate()

        elapsed = get_event_loop().time() - start_time
        await sleep(max(0, TICK_RATE - elapsed))
