from fastapi import APIRouter
from src.controllers.banner_controller import get_banners, get_banner_by_id

router = APIRouter()


@router.get("/", response_model=dict)
async def get_banners_route():
    return await get_banners()


@router.get("/{banner_id}", response_model=dict)
async def get_banner_route(banner_id: str):
    return await get_banner_by_id(banner_id)