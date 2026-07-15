from fastapi import APIRouter
from src.controllers.category_controller import get_categories, get_category_by_slug

router = APIRouter()


@router.get("/", response_model=dict)
async def get_categories_route():
    return await get_categories()


@router.get("/{slug}", response_model=dict)
async def get_category_route(slug: str):
    return await get_category_by_slug(slug)