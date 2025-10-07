
class Account:

    id: str
    created_at: str
    discord_id: str
    discord_avatar: str
    name: str
    admin: bool

    def __init__(self, id: str, created_at: str, discord_id: str, discord_avatar: str, name: str, admin: bool):
        self.id = id
        self.created_at = created_at
        self.discord_id = discord_id
        self.discord_avatar = discord_avatar
        self.name = name
        self.admin = admin
