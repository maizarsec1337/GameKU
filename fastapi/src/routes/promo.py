from fastapi import APIRouter
from src.controllers.promo_controller import get_promos, get_promo_by_id

router = APIRouter()


@router.get("/", response_model=dict)
async def get_promos_route():
    return await get_promos()


@router.get("/{promo_id}", response_model=dict)
async def get_promo_route(promo_id: str):
    return await get_promo_by_id(promo_id)