from pydantic import BaseModel
from typing import Optional
from datetime import date

class AsistenciaCreate(BaseModel):
    nombre: str
    fechaCargado: Optional[date] = None
    idEntrenador: Optional[int] = None
    idCategoria: Optional[int] = None

class AsistenciaUpdate(BaseModel):
    nombre: Optional[str] = None
    fechaCargado: Optional[date] = None
    idEntrenador: Optional[int] = None
    idCategoria: Optional[int] = None

class AsistenciaResponse(AsistenciaCreate):
    id: int

    class Config:
        from_attributes = True