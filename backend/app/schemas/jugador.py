# app/schemas/jugador.py
from pydantic import BaseModel
from typing import Optional
from datetime import date

class JugadorCreate(BaseModel):
    nombre: str
    nacionalidad: Optional[str] = None
    tipoDocumento: Optional[str] = None
    documento: Optional[str] = None
    fechaNacimiento: Optional[date] = None
    edad: Optional[int] = None
    dorsal: Optional[int] = None
    contactoEmergencia: Optional[str] = None
    estado: Optional[str] = None
    fechaIngreso: Optional[date] = None
    fechaSalida: Optional[date] = None
    devolucion1: Optional[str] = None
    devolucion2: Optional[str] = None
    devolucion3: Optional[str] = None
    torneo: Optional[str] = None
    idCategoria: Optional[int] = None

class JugadorUpdate(BaseModel):
    nombre: Optional[str] = None
    nacionalidad: Optional[str] = None
    tipoDocumento: Optional[str] = None
    documento: Optional[str] = None
    fechaNacimiento: Optional[date] = None
    edad: Optional[int] = None
    dorsal: Optional[int] = None
    contactoEmergencia: Optional[str] = None
    estado: Optional[str] = None
    fechaIngreso: Optional[date] = None
    fechaSalida: Optional[date] = None
    devolucion1: Optional[str] = None
    devolucion2: Optional[str] = None
    devolucion3: Optional[str] = None
    torneo: Optional[str] = None
    idCategoria: Optional[int] = None

class JugadorResponse(JugadorCreate):
    id: int

    class Config:
        from_attributes = True