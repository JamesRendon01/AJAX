# app/schemas/categoria.py
from pydantic import BaseModel
from typing import Optional

class CategoriaCreate(BaseModel):
    nombre: str
    ano: Optional[int] = None
    idEntrenador: Optional[int] = None

class CategoriaUpdate(BaseModel):
    nombre: Optional[str] = None
    ano: Optional[int] = None
    idEntrenador: Optional[int] = None

class CategoriaResponse(BaseModel):
    id: int
    nombre: Optional[str]
    ano: Optional[int]
    idEntrenador: Optional[int]

    class Config:
        from_attributes = True