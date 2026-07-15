# src/controllers/promo_controller.py
from src.database.mongodb import promo_repo

async def get_promos():
    try:
        promos = await promo_repo.get_active()
        return {"success": True, "data": promos}
    except Exception as error:
        return {"success": False, "message": str(error)}, 500


async def get_promo_by_id(promo_id: str):
    try:
        promo = await promo_repo.get_by_id(promo_id)
        if not promo:
            return {"success": False, "message": "Promo tidak ditemukan"}, 404
        return {"success": True, "data": promo}
    except Exception as error:
        return {"success": False, "message": str(error)}, 500