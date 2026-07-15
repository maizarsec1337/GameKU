from fastapi import APIRouter, Body
from src.controllers.auth_controller import register, login, google_auth, logout, get_user
from src.schemas import AuthRegister, AuthLogin, AuthGoogle

router = APIRouter()

@router.post("/register", response_model=dict)
async def register_route(data: AuthRegister):
    result = register(data.email, data.password, data.name)
    if isinstance(result, tuple):
        return result
    return result


@router.post("/login", response_model=dict)
async def login_route(data: AuthLogin):
    result = login(data.email, data.password)
    if isinstance(result, tuple):
        return result
    return result


@router.post("/google", response_model=dict)
async def google_route(data: AuthGoogle):
    result = google_auth(data.id_token)
    if isinstance(result, tuple):
        return result
    return result


@router.post("/logout", response_model=dict)
async def logout_route():
    result = logout()
    if isinstance(result, tuple):
        return result
    return result


@router.get("/user", response_model=dict)
async def user_route():
    result = get_user()
    if isinstance(result, tuple):
        return result
    return result
