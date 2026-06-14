from sqlalchemy import Column, Integer, String, DateTime, Date
from sqlalchemy.orm import relationship
from app.models.base import Base
from app.models.types import EncryptedString, PasswordField

class Entrenador(Base):
    __tablename__ = "entrenadores"

    id                               = Column(Integer, primary_key=True, autoincrement=True)
    nombre                           = Column(String)
    tipoDocumento                    = Column(String)
    documento                        = Column(String)
    password                         = Column(PasswordField)
    email                            = Column(EncryptedString, nullable=True)
    reset_token                      = Column(String, nullable=True)
    reset_token_expiry               = Column(DateTime, nullable=True)
    certificado                      = Column(String)
    delitosSexuales                  = Column(String)
    tarjetaProfesional               = Column(String)
    celular                          = Column(EncryptedString)
    cargo                            = Column(String)
    rol                              = Column(String, default="entrenador")
    coced                            = Column(String, nullable=True)
    contactoEmergencia               = Column(EncryptedString, nullable=True)
    fechaInicio                      = Column(Date, nullable=True)
    fechaFin                         = Column(Date, nullable=True)
    certificado_original             = Column(String, nullable=True)
    delitosSexuales_original         = Column(String, nullable=True)
    tarjetaProfesional_original      = Column(String, nullable=True)

    categorias  = relationship("Categoria", back_populates="entrenador")
    asistencias = relationship("Asistencia", back_populates="entrenador")
