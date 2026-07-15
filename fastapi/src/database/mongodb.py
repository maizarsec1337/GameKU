# src/database/mongodb.py
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from pymongo import ASCENDING, DESCENDING
from pymongo.errors import DuplicateKeyError
from typing import Optional, List, Dict, Any
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
MONGODB_DB = os.getenv("MONGODB_DB", "gameku")

_client: Optional[AsyncIOMotorClient] = None
_db: Optional[AsyncIOMotorDatabase] = None


async def connect_to_mongo():
    """Initialize MongoDB connection"""
    global _client, _db
    _client = AsyncIOMotorClient(MONGODB_URI)
    _db = _client[MONGODB_DB]
    
    # Create indexes
    await create_indexes()
    
    print(f"✅ Connected to MongoDB: {MONGODB_DB}")


async def close_mongo_connection():
    """Close MongoDB connection"""
    global _client
    if _client:
        _client.close()
        _client = None
        print("👋 MongoDB connection closed")


def get_database() -> AsyncIOMotorDatabase:
    """Get database instance"""
    if _db is None:
        raise RuntimeError("Database not initialized. Call connect_to_mongo() first.")
    return _db


async def create_indexes():
    """Create database indexes"""
    db = get_database()
    
    # Users indexes
    await db.users.create_index([("email", ASCENDING)], unique=True)
    await db.users.create_index([("provider", ASCENDING), ("provider_uid", ASCENDING)], unique=True, sparse=True)
    
    # Games indexes
    await db.games.create_index([("slug", ASCENDING)], unique=True)
    await db.games.create_index([("category", ASCENDING)])
    
    # Categories indexes
    await db.categories.create_index([("slug", ASCENDING)], unique=True)
    
    # Vouchers indexes
    await db.vouchers.create_index([("slug", ASCENDING)], unique=True)
    
    # Promos indexes
    await db.promos.create_index([("active", ASCENDING)])
    
    # Search items indexes
    await db.search_items.create_index([("name", "text"), ("slug", "text")])
    await db.search_items.create_index([("type", ASCENDING)])
    await db.search_items.create_index([("category", ASCENDING)])
    
    # Orders indexes
    await db.orders.create_index([("user_id", ASCENDING)])
    await db.orders.create_index([("status", ASCENDING)])
    await db.orders.create_index([("midtrans_order_id", ASCENDING)], unique=True, sparse=True)
    
    # Banners indexes
    await db.banners.create_index([("active", ASCENDING)])


# ====================
# REPOSITORY CLASSES
# ====================

class BaseRepository:
    def __init__(self, collection_name: str):
        self.collection_name = collection_name
    
    @property
    def collection(self):
        return get_database()[self.collection_name]
    
    def _serialize(self, doc: Dict[str, Any]) -> Dict[str, Any]:
        """Convert MongoDB _id to string id"""
        if doc and "_id" in doc:
            doc["id"] = str(doc["_id"])
            del doc["_id"]
        return doc
    
    def _serialize_list(self, docs: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        return [self._serialize(doc) for doc in docs]


class UserRepository(BaseRepository):
    def __init__(self):
        super().__init__("users")
    
    async def create(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        user_data["created_at"] = datetime.utcnow()
        user_data["updated_at"] = datetime.utcnow()
        result = await self.collection.insert_one(user_data)
        user_data["_id"] = result.inserted_id
        return self._serialize(user_data)
    
    async def get_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        doc = await self.collection.find_one({"email": email})
        return self._serialize(doc) if doc else None
    
    async def get_by_id(self, user_id: str) -> Optional[Dict[str, Any]]:
        from bson import ObjectId
        doc = await self.collection.find_one({"_id": ObjectId(user_id)})
        return self._serialize(doc) if doc else None
    
    async def get_by_provider(self, provider: str, provider_uid: str) -> Optional[Dict[str, Any]]:
        doc = await self.collection.find_one({"provider": provider, "provider_uid": provider_uid})
        return self._serialize(doc) if doc else None
    
    async def update(self, user_id: str, update_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        from bson import ObjectId
        update_data["updated_at"] = datetime.utcnow()
        await self.collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": update_data}
        )
        return await self.get_by_id(user_id)


class GameRepository(BaseRepository):
    def __init__(self):
        super().__init__("games")
    
    async def get_all(self, category: Optional[str] = None) -> List[Dict[str, Any]]:
        query = {"category": category} if category else {}
        cursor = self.collection.find(query).sort("name", ASCENDING)
        return self._serialize_list(await cursor.to_list(length=None))
    
    async def get_by_id(self, game_id: str) -> Optional[Dict[str, Any]]:
        from bson import ObjectId
        doc = await self.collection.find_one({"_id": ObjectId(game_id)})
        return self._serialize(doc) if doc else None
    
    async def get_by_slug(self, slug: str) -> Optional[Dict[str, Any]]:
        doc = await self.collection.find_one({"slug": slug})
        return self._serialize(doc) if doc else None
    
    async def create(self, game_data: Dict[str, Any]) -> Dict[str, Any]:
        game_data["created_at"] = datetime.utcnow()
        result = await self.collection.insert_one(game_data)
        game_data["_id"] = result.inserted_id
        return self._serialize(game_data)


class CategoryRepository(BaseRepository):
    def __init__(self):
        super().__init__("categories")
    
    async def get_all(self) -> List[Dict[str, Any]]:
        cursor = self.collection.find().sort("name", ASCENDING)
        return self._serialize_list(await cursor.to_list(length=None))
    
    async def get_by_slug(self, slug: str) -> Optional[Dict[str, Any]]:
        doc = await self.collection.find_one({"slug": slug})
        return self._serialize(doc) if doc else None
    
    async def create(self, category_data: Dict[str, Any]) -> Dict[str, Any]:
        category_data["created_at"] = datetime.utcnow()
        result = await self.collection.insert_one(category_data)
        category_data["_id"] = result.inserted_id
        return self._serialize(category_data)


class VoucherRepository(BaseRepository):
    def __init__(self):
        super().__init__("vouchers")
    
    async def get_all(self) -> List[Dict[str, Any]]:
        cursor = self.collection.find().sort("name", ASCENDING)
        return self._serialize_list(await cursor.to_list(length=None))
    
    async def get_by_id(self, voucher_id: str) -> Optional[Dict[str, Any]]:
        from bson import ObjectId
        doc = await self.collection.find_one({"_id": ObjectId(voucher_id)})
        return self._serialize(doc) if doc else None
    
    async def get_by_slug(self, slug: str) -> Optional[Dict[str, Any]]:
        doc = await self.collection.find_one({"slug": slug})
        return self._serialize(doc) if doc else None
    
    async def create(self, voucher_data: Dict[str, Any]) -> Dict[str, Any]:
        voucher_data["created_at"] = datetime.utcnow()
        result = await self.collection.insert_one(voucher_data)
        voucher_data["_id"] = result.inserted_id
        return self._serialize(voucher_data)


class PromoRepository(BaseRepository):
    def __init__(self):
        super().__init__("promos")
    
    async def get_active(self) -> List[Dict[str, Any]]:
        cursor = self.collection.find({"active": True}).sort("created_at", DESCENDING)
        return self._serialize_list(await cursor.to_list(length=None))
    
    async def get_by_id(self, promo_id: str) -> Optional[Dict[str, Any]]:
        from bson import ObjectId
        doc = await self.collection.find_one({"_id": ObjectId(promo_id)})
        return self._serialize(doc) if doc else None
    
    async def create(self, promo_data: Dict[str, Any]) -> Dict[str, Any]:
        promo_data["created_at"] = datetime.utcnow()
        result = await self.collection.insert_one(promo_data)
        promo_data["_id"] = result.inserted_id
        return self._serialize(promo_data)


class SearchRepository(BaseRepository):
    def __init__(self):
        super().__init__("search_items")
    
    async def search(
        self,
        query: Optional[str] = None,
        type_filter: Optional[str] = None,
        category: Optional[str] = None,
        limit: int = 20
    ) -> Dict[str, Any]:
        filters = []
        
        if query:
            filters.append({"$text": {"$search": query}})
        if type_filter:
            filters.append({"type": type_filter})
        if category:
            filters.append({"category": category})
        
        query_filter = {"$and": filters} if filters else {}
        
        cursor = self.collection.find(query_filter).limit(limit)
        if query:
            cursor = cursor.sort([("score", {"$meta": "textScore"})])
        
        results = self._serialize_list(await cursor.to_list(length=limit))
        return {
            "success": True,
            "data": results,
            "total": len(results),
            "query": query
        }
    
    async def get_suggestions(self, query: Optional[str] = None, limit: int = 5) -> Dict[str, Any]:
        if not query:
            return {"success": True, "data": []}
        
        cursor = self.collection.find(
            {"$text": {"$search": query}},
            {"score": {"$meta": "textScore"}}
        ).sort([("score", {"$meta": "textScore"})]).limit(limit)
        
        results = await cursor.to_list(length=limit)
        suggestions = [{"name": r["name"], "slug": r["slug"]} for r in results]
        return {"success": True, "data": suggestions}
    
    async def create(self, item_data: Dict[str, Any]) -> Dict[str, Any]:
        item_data["created_at"] = datetime.utcnow()
        result = await self.collection.insert_one(item_data)
        item_data["_id"] = result.inserted_id
        return self._serialize(item_data)


class BannerRepository(BaseRepository):
    def __init__(self):
        super().__init__("banners")
    
    async def get_active(self) -> List[Dict[str, Any]]:
        cursor = self.collection.find({"active": True}).sort("created_at", DESCENDING)
        return self._serialize_list(await cursor.to_list(length=None))
    
    async def get_by_id(self, banner_id: str) -> Optional[Dict[str, Any]]:
        from bson import ObjectId
        doc = await self.collection.find_one({"_id": ObjectId(banner_id)})
        return self._serialize(doc) if doc else None
    
    async def create(self, banner_data: Dict[str, Any]) -> Dict[str, Any]:
        banner_data["created_at"] = datetime.utcnow()
        result = await self.collection.insert_one(banner_data)
        banner_data["_id"] = result.inserted_id
        return self._serialize(banner_data)


# Singleton instances
user_repo = UserRepository()
game_repo = GameRepository()
category_repo = CategoryRepository()
voucher_repo = VoucherRepository()
promo_repo = PromoRepository()
search_repo = SearchRepository()
banner_repo = BannerRepository()


# ====================
# SEED DATA
# ====================

SEED_DATA = {
    "banners": [
        {"id": 1, "title": "Top Up Game Murah", "description": "Top up game favoritmu dengan harga termurah", "image": "/images/banner/hero1.jpg", "link": "/category/topup", "active": True},
        {"id": 2, "title": "Voucher Game Diskon", "description": "Dapatkan voucher game diskon hingga 50%", "image": "/images/banner/hero2.jpg", "link": "/category/voucher", "active": True},
        {"id": 3, "title": "Steam Wallet Promo", "description": "Isi Steam Wallet dengan harga spesial", "image": "/images/banner/hero3.jpg", "link": "/category/steam", "active": True}
    ],
    "categories": [
        {"id": 1, "name": "Top Up Game", "slug": "topup", "icon": "🎮", "count": "100+ Game"},
        {"id": 2, "name": "Voucher Game", "slug": "voucher", "icon": "🎟️", "count": "50+ Voucher"},
        {"id": 3, "name": "Steam Wallet", "slug": "steam", "icon": "🪙", "count": "10+ Produk"},
        {"id": 4, "name": "Gift Card", "slug": "giftcard", "icon": "🎁", "count": "20+ Pilihan"},
        {"id": 5, "name": "Membership", "slug": "membership", "icon": "⭐", "count": "2 Paket"},
        {"id": 6, "name": "Google Play", "slug": "googleplay", "icon": "▶️", "count": "5+ Nominal"},
        {"id": 7, "name": "PlayStation", "slug": "playstation", "icon": "🎮", "count": "10+ Voucher"},
        {"id": 8, "name": "Entertainment", "slug": "entertainment", "icon": "🎬", "count": "15+ Produk"}
    ],
    "games": [
        {"id": 1, "name": "Mobile Legends", "slug": "mlbb", "image": "/images/game/mlbb.jpg", "price": "Rp15.000", "category": "topup"},
        {"id": 2, "name": "Free Fire", "slug": "ff", "image": "/images/game/ff.jpg", "price": "Rp10.000", "category": "topup"},
        {"id": 3, "name": "PUBG Mobile", "slug": "pubg", "image": "/images/game/pubg.jpg", "price": "Rp20.000", "category": "topup"},
        {"id": 4, "name": "Genshin Impact", "slug": "genshin", "image": "/images/game/genshin.jpg", "price": "Rp25.000", "category": "topup"},
        {"id": 5, "name": "Valorant", "slug": "valorant", "image": "/images/game/valorant.jpg", "price": "Rp30.000", "category": "topup"},
        {"id": 6, "name": "FIFA Mobile", "slug": "fifa", "image": "/images/game/fifa.jpg", "price": "Rp12.000", "category": "topup"},
        {"id": 7, "name": "Call of Duty Mobile", "slug": "cod", "image": "/images/game/cod.jpg", "price": "Rp18.000", "category": "topup"},
        {"id": 8, "name": "League of Legends", "slug": "lol", "image": "/images/game/lol.jpg", "price": "Rp22.000", "category": "topup"}
    ],
    "vouchers": [
        {"id": 1, "name": "Google Play", "slug": "googleplay", "image": "/images/voucher/googleplay.jpg", "price": "Rp20.000 - Rp500.000"},
        {"id": 2, "name": "PlayStation", "slug": "playstation", "image": "/images/voucher/playstation.jpg", "price": "Rp50.000 - Rp1.000.000"},
        {"id": 3, "name": "Xbox", "slug": "xbox", "image": "/images/voucher/xbox.jpg", "price": "Rp30.000 - Rp750.000"},
        {"id": 4, "name": "Nintendo", "slug": "nintendo", "image": "/images/voucher/nintendo.jpg", "price": "Rp25.000 - Rp600.000"}
    ],
    "promos": [
        {"id": 1, "title": "Bonus Top Up 100%", "description": "Setiap pembelian pertama dapat bonus diamond hingga 100%", "image": "/images/promo/bonus.jpg", "link": "/promo", "active": True},
        {"id": 2, "title": "Diskon Member Baru", "description": "Dapatkan diskon 20% untuk pembelian pertama kamu", "image": "/images/promo/flashsale.jpg", "link": "/register", "active": True},
        {"id": 3, "title": "Flash Sale Akhir Pekan", "description": "Diskon hingga 70% setiap akhir pekan", "image": "/images/promo/flashsale.jpg", "link": "/promo", "active": True},
        {"id": 4, "title": "Cashback 10%", "description": "Dapatkan cashback 10% untuk setiap transaksi", "image": "/images/promo/bonus.jpg", "link": "/promo", "active": True}
    ],
    "search_items": [
        {"id": 1, "name": "Mobile Legends", "slug": "mlbb", "image": "/images/game/mlbb.jpg", "price": "Rp15.000", "type": "game", "category": "topup"},
        {"id": 2, "name": "Free Fire", "slug": "ff", "image": "/images/game/ff.jpg", "price": "Rp10.000", "type": "game", "category": "topup"},
        {"id": 3, "name": "PUBG Mobile", "slug": "pubg", "image": "/images/game/pubg.jpg", "price": "Rp20.000", "type": "game", "category": "topup"},
        {"id": 4, "name": "Genshin Impact", "slug": "genshin", "image": "/images/game/genshin.jpg", "price": "Rp25.000", "type": "game", "category": "topup"},
        {"id": 5, "name": "Valorant", "slug": "valorant", "image": "/images/game/valorant.jpg", "price": "Rp30.000", "type": "game", "category": "topup"},
        {"id": 6, "name": "Google Play", "slug": "googleplay", "image": "/images/voucher/googleplay.jpg", "price": "Rp20.000 - Rp500.000", "type": "voucher", "category": "voucher"},
        {"id": 7, "name": "PlayStation", "slug": "playstation", "image": "/images/voucher/playstation.jpg", "price": "Rp50.000 - Rp1.000.000", "type": "voucher", "category": "voucher"},
        {"id": 8, "name": "Steam Wallet", "slug": "steam", "image": "/images/steam/steamwallet.jpg", "price": "Rp20.000", "type": "steam", "category": "steam"}
    ]
}


async def seed_database():
    """Seed database with initial data if empty"""
    db = get_database()
    
    # Check if already seeded
    existing = await db.banners.count_documents({})
    if existing > 0:
        print("📦 Database already seeded, skipping...")
        return
    
    print("🌱 Seeding database...")
    
    # Seed banners
    for banner in SEED_DATA["banners"]:
        banner["created_at"] = datetime.utcnow()
        await db.banners.insert_one(banner)
    
    # Seed categories
    for cat in SEED_DATA["categories"]:
        cat["created_at"] = datetime.utcnow()
        await db.categories.insert_one(cat)
    
    # Seed games
    for game in SEED_DATA["games"]:
        game["created_at"] = datetime.utcnow()
        await db.games.insert_one(game)
    
    # Seed vouchers
    for voucher in SEED_DATA["vouchers"]:
        voucher["created_at"] = datetime.utcnow()
        await db.vouchers.insert_one(voucher)
    
    # Seed promos
    for promo in SEED_DATA["promos"]:
        promo["created_at"] = datetime.utcnow()
        await db.promos.insert_one(promo)
    
    # Seed search items
    for item in SEED_DATA["search_items"]:
        item["created_at"] = datetime.utcnow()
        await db.search_items.insert_one(item)
    
    print("✅ Database seeded successfully!")


# Export for easy imports
__all__ = [
    "connect_to_mongo",
    "close_mongo_connection",
    "get_database",
    "user_repo",
    "game_repo",
    "category_repo",
    "voucher_repo",
    "promo_repo",
    "search_repo",
    "banner_repo",
    "seed_database",
]