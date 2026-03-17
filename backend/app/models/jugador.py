from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.models.base import Base

class Jugador(Base):
    __tablename__ = "jugadores"

    id                 = Column(Integer, primary_key=True, autoincrement=True)
    nombre             = Column(String)
    nacionalidad       = Column(String)
    tipoDocumento      = Column(String)
    documento          = Column(String)
    fechaNacimiento    = Column(Date)
    edad               = Column(Integer)
    dorsal             = Column(Integer)
    contactoEmergencia = Column(String)
    estado             = Column(String)
    fechaIngreso       = Column(Date)
    fechaSalida        = Column(Date)
    devolucion1        = Column(String)
    devolucion2        = Column(String)
    devolucion3        = Column(String)
    torneo             = Column(String)
    idCategoria        = Column(Integer, ForeignKey("categorias.id"))

    categoria = relationship("Categoria", back_populates="jugadores")
