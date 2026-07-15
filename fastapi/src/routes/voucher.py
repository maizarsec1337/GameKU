from fastapi import APIRouter
from src.controllers.voucher_controller import get_vouchers, get_voucher_by_id

router = APIRouter()


@router.get("/", response_model=dict)
async def get_vouchers_route():
    return await get_vouchers()


@router.get("/{voucher_id}", response_model=dict)
async def get_voucher_route(voucher_id: str):
    return await get_voucher_by_id(voucher_id)