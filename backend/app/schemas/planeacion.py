# app/schemas/planeacion.py
from pydantic import BaseModel
from typing import Optional
from datetime import date

class PlaneacionCreate(BaseModel):
    nombre: str
    fechaInicio: Optional[date] = None
    fechaFin: Optional[date] = None
    fechaCarga: Optional[date] = None
    idCategoria: Optional[int] = None

class PlaneacionUpdate(BaseModel):
    nombre: Optional[str] = None
    fechaInicio: Optional[date] = None
    fechaFin: Optional[date] = None
    fechaCarga: Optional[date] = None
    idCategoria: Optional[int] = None

class PlaneacionResponse(PlaneacionCreate):
    id: int

    class Config:
        from_attributes = True