from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from contextlib import asynccontextmanager
import os
from dotenv import load_dotenv

load_dotenv()

from src.database.mongodb import connect_to_mongo, close_mongo_connection, seed_database
from src.routes import banner, category, game, voucher, promo, search, auth


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await connect_to_mongo()
    await seed_database()
    print(f"🚀 Gameku FastAPI Server running on http://localhost:{os.getenv('PORT', 8000)}")
    print(f"📝 Environment: {os.getenv('NODE_ENV', 'development')}")
    yield
    # Shutdown
    await close_mongo_connection()
    print("👋 Shutting down...")


app = FastAPI(
    title="Gameku API",
    description="Gameku Backend API - FastAPI Version with MongoDB",
    version="1.0.0",
    lifespan=lifespan
)

# Middleware - mirrors Express middleware order
app.add_middleware(GZipMiddleware, minimum_size=1000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Routes - same prefixes as Express
app.include_router(banner.router, prefix="/api/banner", tags=["Banner"])
app.include_router(category.router, prefix="/api/category", tags=["Category"])
app.include_router(game.router, prefix="/api/game", tags=["Game"])
app.include_router(voucher.router, prefix="/api/voucher", tags=["Voucher"])
app.include_router(promo.router, prefix="/api/promo", tags=["Promo"])
app.include_router(search.router, prefix="/api/search", tags=["Search"])
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])

# Static files (SPA) - same as express.static('public')
frontend_path = os.path.join(os.path.dirname(__file__), "public")
if os.path.exists(frontend_path):
    app.mount("/static", StaticFiles(directory=frontend_path), name="static")
    
    @app.get("/{full_path:path}")
    async def spa_fallback(full_path: str):
        index_path = os.path.join(frontend_path, "index.html")
        if os.path.exists(index_path):
            return FileResponse(index_path)
        return {"success": False, "message": "Frontend not built"}


@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "gameku-api"}


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)