from sqlalchemy import Column, Integer, String, DateTime, Date
from sqlalchemy.orm import relationship
from app.models.base import Base

class Entrenador(Base):
    __tablename__ = "entrenadores"

    id                               = Column(Integer, primary_key=True, autoincrement=True)
    nombre                           = Column(String)
    tipoDocumento                    = Column(String)
    documento                        = Column(String)
    password                         = Column(String, default="1234")
    email                            = Column(String, nullable=True)
    reset_token                      = Column(String, nullable=True)
    reset_token_expiry               = Column(DateTime, nullable=True)
    certificado                      = Column(String)
    delitosSexuales                  = Column(String)
    tarjetaProfesional               = Column(String)
    certificadoPrimerCorrespondiente = Column(String)
    celular                          = Column(String)
    cargo                            = Column(String)
    rol                              = Column(String, default="entrenador")
    coced                            = Column(String, nullable=True)
    contactoEmergencia               = Column(String, nullable=True)
    fechaInicio                      = Column(Date, nullable=True)
    fechaFin                         = Column(Date, nullable=True)
    evaluacion                       = Column(String, nullable=True)

    categorias  = relationship("Categoria", back_populates="entrenador")
    asistencias = relationship("Asistencia", back_populates="entrenador")
