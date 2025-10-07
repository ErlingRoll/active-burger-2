from supabase import Client


def create_object(database: Client, data):
    response = database.table("object").insert(data).execute()
    return response.data[0] if response.data else None


def remove_object(database: Client, object_id: str):
    response = database.table("object").delete().eq("id", object_id).execute()
    return response.data[0] if response.data else None
