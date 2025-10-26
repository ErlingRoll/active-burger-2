from asyncio import create_task
from typing import Dict, List
from pydantic import BaseModel, ConfigDict
from aiohttp.web import WebSocketResponse


class GameEvent(BaseModel):
    event: str
    payload: dict = {}
    log: List[str] = []


class ConnectionManager(BaseModel):

    connection_counter: int = 0  # Total connections since server start
    connections: dict = {}
    connections_account_map: Dict[str, WebSocketResponse] = {}
    model_config = ConfigDict(arbitrary_types_allowed=True, extra="allow")

    def add_connection(self, ws):
        self.connection_counter += 1
        connection_id = self.connection_counter
        self.connections[connection_id] = ws
        return connection_id

    def update_account_map(self, account_id, ws):
        self.connections_account_map[account_id] = ws
        self.clean_connections_account_map()
        print(f"Account map updated. Total mapped accounts: {len(self.connections_account_map)}")

    def clean_connections_account_map(self):
        closed_connections = []
        for account_id, ws in self.connections_account_map.items():
            if ws.closed:
                closed_connections.append(account_id)
        for account_id in closed_connections:
            del self.connections_account_map[account_id]
            print(f"Removed closed connection for account {account_id}")

    def remove_connection(self, connection_id):
        if connection_id in self.connections:
            del self.connections[connection_id]

    async def send(self, account_id, event: GameEvent):
        ws = self.connections_account_map.get(account_id)
        if ws and not ws.closed:
            try:
                await ws.send_json(event.model_dump())
            except Exception as e:
                print(f"Error sending to account {account_id}: {e}")

        else:
            print(f"[send/{event.event}] No active WebSocket for account {account_id}")
            self.remove_connection(account_id)

    async def broadcast(self, event: GameEvent):
        # Broadcast event to all active WebSocket connections
        inactive_connections = []
        for connection_id, ws in self.connections.items():
            if not ws.closed:
                try:
                    create_task(ws.send_json(event.model_dump()))
                except Exception as e:
                    print(f"Error sending to connection {connection_id}: {e}")
            else:
                inactive_connections.append(connection_id)
        for connection_id in inactive_connections:
            self.remove_connection(connection_id)
        if inactive_connections:
            print(f"Removed {len(inactive_connections)} inactive connections. Total connections: {len(self.connections)}")
        else:
            # print(f"Broadcasted event to {len(self.connections)} connections.")
            pass
