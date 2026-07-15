# src/controllers/voucher_controller.py
from src.database.mongodb import voucher_repo

async def get_vouchers():
    try:
        vouchers = await voucher_repo.get_all()
        return {"success": True, "data": vouchers}
    except Exception as error:
        return {"success": False, "message": str(error)}, 500


async def get_voucher_by_id(voucher_id: str):
    try:
        voucher = await voucher_repo.get_by_id(voucher_id)
        if not voucher:
            return {"success": False, "message": "Voucher tidak ditemukan"}, 404
        return {"success": True, "data": voucher}
    except Exception as error:
        return {"success": False, "message": str(error)}, 500