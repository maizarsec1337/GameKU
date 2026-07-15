# src/controllers/game_controller.py
from src.database.mongodb import game_repo

async def get_games(category: str = None):
    try:
        games = await game_repo.get_all(category)
        return {"success": True, "data": games}
    except Exception as error:
        return {"success": False, "message": str(error)}, 500


async def get_game_by_id(game_id: str):
    try:
        game = await game_repo.get_by_id(game_id)
        if not game:
            return {"success": False, "message": "Game tidak ditemukan"}, 404
        return {"success": True, "data": game}
    except Exception as error:
        return {"success": False, "message": str(error)}, 500


async def get_game_by_slug(slug: str):
    try:
        game = await game_repo.get_by_slug(slug)
        if not game:
            return {"success": False, "message": "Game tidak ditemukan"}, 404
        return {"success": True, "data": game}
    except Exception as error:
        return {"success": False, "message": str(error)}, 500