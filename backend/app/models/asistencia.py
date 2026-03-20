from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.models.base import Base

class Asistencia(Base):
    __tablename__ = "asistencias"

    id            = Column(Integer, primary_key=True, autoincrement=True)
    nombre        = Column(String)
    archivo       = Column(String)
    fechaCreacion = Column(Date)
    fechaCargado  = Column(Date)
    idEntrenador  = Column(Integer, ForeignKey("entrenadores.id"))
    idCategoria   = Column(Integer, ForeignKey("categorias.id"))

    entrenador = relationship("Entrenador", back_populates="asistencias")
    categoria  = relationship("Categoria", back_populates="asistencias")