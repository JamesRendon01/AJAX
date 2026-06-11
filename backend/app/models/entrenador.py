from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.models.base import Base

class Entrenador(Base):
    __tablename__ = "entrenadores"

    id                               = Column(Integer, primary_key=True, autoincrement=True)
    nombre                           = Column(String)
    tipoDocumento                    = Column(String)
    documento                        = Column(String)
    password                         = Column(String, default="1234")
    certificado                      = Column(String)
    delitosSexuales                  = Column(String)
    tarjetaProfesional               = Column(String)
    certificadoPrimerCorrespondiente = Column(String)
    celular                          = Column(String)
    cargo                            = Column(String)
    rol                              = Column(String, default="entrenador")

    categorias  = relationship("Categoria", back_populates="entrenador")
    asistencias = relationship("Asistencia", back_populates="entrenador")
