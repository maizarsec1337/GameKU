# src/controllers/search_controller.py
from src.database.mongodb import search_repo

async def search_items(query: str = None, type_filter: str = None, category: str = None, limit: int = 20):
    try:
        result = await search_repo.search(query, type_filter, category, limit)
        return result
    except Exception as error:
        return {"success": False, "message": str(error)}, 500


async def get_suggestions(query: str = None):
    try:
        # For suggestions, we can do a simple name search
        if not query:
            return {"success": True, "data": []}
        
        result = await search_repo.search(query, None, None, 5)
        suggestions = [{"name": item["name"], "slug": item["slug"]} for item in result["data"]]
        return {"success": True, "data": suggestions}
    except Exception as error:
        return {"success": False, "message": str(error)}, 500