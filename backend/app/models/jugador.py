from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.models.base import Base
from app.models.types import EncryptedString

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
    contactoEmergencia = Column(EncryptedString)
    estado             = Column(String)
    fechaIngreso       = Column(Date)
    fechaSalida        = Column(Date)
    devolucion1        = Column(String)
    devolucion1_fechaInicio = Column(Date, nullable=True)
    devolucion1_fechaFin    = Column(Date, nullable=True)
    devolucion2        = Column(String)
    devolucion2_fechaInicio = Column(Date, nullable=True)
    devolucion2_fechaFin    = Column(Date, nullable=True)
    devolucion3        = Column(String)
    devolucion3_fechaInicio = Column(Date, nullable=True)
    devolucion3_fechaFin    = Column(Date, nullable=True)
    devoluciones       = Column(String, nullable=True)
    devolucion1_original = Column(String, nullable=True)
    devolucion2_original = Column(String, nullable=True)
    devolucion3_original = Column(String, nullable=True)
    devoluciones_original = Column(String, nullable=True)
    torneo             = Column(String)
    idCategoria        = Column(Integer, ForeignKey("categorias.id"))

    categoria = relationship("Categoria", back_populates="jugadores")
