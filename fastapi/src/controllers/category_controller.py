# src/controllers/category_controller.py
from src.database.mongodb import category_repo

async def get_categories():
    try:
        categories = await category_repo.get_all()
        return {"success": True, "data": categories}
    except Exception as error:
        return {"success": False, "message": str(error)}, 500


async def get_category_by_slug(slug: str):
    try:
        category = await category_repo.get_by_slug(slug)
        if not category:
            return {"success": False, "message": "Kategori tidak ditemukan"}, 404
        return {"success": True, "data": category}
    except Exception as error:
        return {"success": False, "message": str(error)}, 500