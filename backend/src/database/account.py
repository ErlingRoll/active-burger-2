from supabase import AsyncClient


async def create_account(database: AsyncClient, data):
    response = await database.table("account").insert(data).execute()
    return response.data[0] if response.data else None


async def get_account_by_discord_id(database: AsyncClient, discord_id: str):
    response = await database.table("account").select("*").eq("discord_id", discord_id).execute()
    return response.data[0] if response.data else None
