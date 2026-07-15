from fastapi import APIRouter, Query
from src.controllers.search_controller import search_items, get_suggestions

router = APIRouter()


@router.get("/", response_model=dict)
async def search_route(q: str = Query(None), type: str = Query(None), category: str = Query(None)):
    result = search_items(q, type, category)
    if isinstance(result, tuple):
        return result
    return result


@router.get("/suggestions", response_model=dict)
async def suggestions_route(q: str = Query(None)):
    result = get_suggestions(q)
    if isinstance(result, tuple):
        return result
    return result
