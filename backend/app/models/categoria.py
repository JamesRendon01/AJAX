from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.models.base import Base

class Categoria(Base):
    __tablename__ = "categorias"

    id           = Column(Integer, primary_key=True, autoincrement=True)
    nombre       = Column(String)
    ano          = Column(Integer)
    idEntrenador = Column(Integer, ForeignKey("entrenadores.id"))

    entrenador   = relationship("Entrenador", back_populates="categorias")
    jugadores    = relationship("Jugador", back_populates="categoria")
    asistencias  = relationship("Asistencia", back_populates="categoria")
    planeaciones = relationship("Planeacion", back_populates="categoria")
