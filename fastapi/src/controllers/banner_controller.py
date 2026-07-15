# src/controllers/banner_controller.py
from src.database.mongodb import banner_repo

async def get_banners():
    try:
        banners = await banner_repo.get_active()
        return {"success": True, "data": banners}
    except Exception as error:
        return {"success": False, "message": str(error)}, 500


async def get_banner_by_id(banner_id: str):
    try:
        banner = await banner_repo.get_by_id(banner_id)
        if not banner:
            return {"success": False, "message": "Banner tidak ditemukan"}, 404
        return {"success": True, "data": banner}
    except Exception as error:
        return {"success": False, "message": str(error)}, 500