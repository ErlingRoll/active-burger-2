from pydantic import BaseModel
from aiohttp.web import Request, WebSocketResponse

from src.gamestate import Gamestate
from src.database.account import get_account_by_discord_id, create_account
from src.database.character import get_character_by_account_id, create_character
from src.models.character import Character
from src.models.account import Account


class InteractPayload(BaseModel):
    character_id: str
    target_x: int | None
    target_y: int | None
    target_object: str | None


async def interact(request: Request, ws: WebSocketResponse, account: Account, payload: InteractPayload):
    gamestate: Gamestate = request.app["gamestate"]
