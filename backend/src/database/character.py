from supabase import Client


def create_character(database: Client, data):
    response = database.table("character").insert(data).execute()
    return response.data[0] if response.data else None


def get_character_by_account_id(database: Client, account_id: str):
    response = database.table("character").select("*").eq("account_id", account_id).execute()
    return response.data[0] if response.data else None
