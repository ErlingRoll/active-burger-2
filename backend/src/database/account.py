from supabase import Client


def create_account(database: Client, data):
    response = database.table("account").insert(data).execute()
    return response.data[0] if response.data else None


def get_account_by_discord_id(database: Client, discord_id: str):
    response = database.table("account").select("*").eq("discord_id", discord_id).execute()
    return response.data[0] if response.data else None
