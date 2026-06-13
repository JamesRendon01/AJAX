from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.models.base import Base

class Planeacion(Base):
    __tablename__ = "planeaciones"

    id          = Column(Integer, primary_key=True, autoincrement=True)
    nombre      = Column(String)
    fechaInicio = Column(Date)
    fechaFin    = Column(Date)
    fechaCarga  = Column(Date)
    archivo     = Column(String)
    archivo_original = Column(String, nullable=True)
    idCategoria = Column(Integer, ForeignKey("categorias.id"))
    lapsoInicio = Column(Date, nullable=True)
    lapsoFin    = Column(Date, nullable=True)

    categoria = relationship("Categoria", back_populates="planeaciones")
