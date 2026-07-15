from pydantic import BaseModel
from typing import Optional
from typing import List


class BannerBase(BaseModel):
    title: str
    description: str
    image: str
    link: str
    active: bool = True


class BannerCreate(BannerBase):
    pass


class BannerUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    image: Optional[str] = None
    link: Optional[str] = None
    active: Optional[bool] = None


class Banner(BannerBase):
    id: int

    class Config:
        from_attributes = True


class CategoryBase(BaseModel):
    name: str
    slug: str
    icon: str
    count: str


class CategoryCreate(CategoryBase):
    pass


class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    icon: Optional[str] = None
    count: Optional[str] = None


class Category(CategoryBase):
    id: int

    class Config:
        from_attributes = True


class GameBase(BaseModel):
    name: str
    slug: str
    image: str
    price: str
    category: str


class GameCreate(GameBase):
    pass


class GameUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    image: Optional[str] = None
    price: Optional[str] = None
    category: Optional[str] = None


class Game(GameBase):
    id: int

    class Config:
        from_attributes = True


class VoucherBase(BaseModel):
    name: str
    slug: str
    image: str
    price: str


class VoucherCreate(VoucherBase):
    pass


class VoucherUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    image: Optional[str] = None
    price: Optional[str] = None


class Voucher(VoucherBase):
    id: int

    class Config:
        from_attributes = True


class PromoBase(BaseModel):
    title: str
    description: str
    image: str
    link: str
    active: bool = True


class PromoCreate(PromoBase):
    pass


class PromoUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    image: Optional[str] = None
    link: Optional[str] = None
    active: Optional[bool] = None


class Promo(PromoBase):
    id: int

    class Config:
        from_attributes = True


class SearchItemBase(BaseModel):
    name: str
    slug: str
    image: str
    price: str
    type: str
    category: str


class SearchItem(SearchItemBase):
    id: int

    class Config:
        from_attributes = True


class SearchResponse(BaseModel):
    success: bool
    data: List[SearchItem]
    total: int
    query: Optional[str] = None


class SearchSuggestion(BaseModel):
    name: str
    slug: str


class AuthRegister(BaseModel):
    email: str
    password: str
    name: str


class AuthLogin(BaseModel):
    email: str
    password: str


class AuthGoogle(BaseModel):
    id_token: str


class AuthResponse(BaseModel):
    success: bool
    message: str
    data: Optional[dict] = None


class UserResponse(BaseModel):
    success: bool
    message: str
    data: Optional[dict] = None


class ErrorResponse(BaseModel):
    success: bool = False
    message: str
    error: Optional[dict] = None


class SuccessResponse(BaseModel):
    success: bool = True
    data: Optional[dict] = None
    message: Optional[str] = None