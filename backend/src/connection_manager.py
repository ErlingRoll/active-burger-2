import json
import asyncio
from pyventus.events import AsyncIOEventEmitter, EventEmitter, EventLinker


class ConnectionManager:

    connection_counter = 0
    connections = {}

    def __init__(self):
        self.connections = {}

    def add_connection(self, ws):
        self.connection_counter += 1
        connection_id = self.connection_counter
        self.connections[connection_id] = ws
        print(f"Connection added. Total connections: {len(self.connections)}")
        return connection_id

    def remove_connection(self, connection_id):
        if connection_id in self.connections:
            del self.connections[connection_id]

    async def broadcast(self, event):
        # Broadcast event to all active WebSocket connections
        inactive_connections = []
        for connection_id, ws in self.connections.items():
            if not ws.closed:
                try:
                    pass
                    asyncio.create_task(ws.send_str(json.dumps(event)))
                except Exception as e:
                    print(f"Error sending to connection {connection_id}: {e}")
            else:
                inactive_connections.append(connection_id)
        for connection_id in inactive_connections:
            self.remove_connection(connection_id)
        if inactive_connections:
            print(f"Removed {len(inactive_connections)} inactive connections. Total connections: {len(self.connections)}")
        else:
            print(f"Broadcasted event to {len(self.connections)} connections.")
