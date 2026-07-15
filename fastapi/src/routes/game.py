from fastapi import APIRouter, Query
from src.controllers.game_controller import get_games, get_game_by_id, get_game_by_slug

router = APIRouter()


@router.get("/", response_model=dict)
async def get_games_route(category: str = Query(None)):
    return await get_games(category)


@router.get("/id/{game_id}", response_model=dict)
async def get_game_route(game_id: str):
    return await get_game_by_id(game_id)


@router.get("/{slug}", response_model=dict)
async def get_game_slug_route(slug: str):
    return await get_game_by_slug(slug)