from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.entrenador import Entrenador
from datetime import datetime, timedelta
import os
import jwt
from pydantic import BaseModel

router = APIRouter(prefix="/auth", tags=["Auth"])

ALGORITHM = os.getenv("ALGORITHM", "HS256")
SECRET_KEY = os.getenv("SECRET_KEY", "ajax_secret_key_2026_change_in_production")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))

class LoginRequest(BaseModel):
    username: str
    password: str

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

@router.post("/login")
def login(credentials: LoginRequest, db: Session = Depends(get_db)):
    username = credentials.username
    password = credentials.password
    
    if not username or not password:
        raise HTTPException(status_code=400, detail="Username y password requeridos")
    
    user = db.query(Entrenador).filter(Entrenador.documento == username).first()
    
    if not user or user.password != password:
        raise HTTPException(status_code=401, detail="Credenciales incorrectas")
    
    rol = user.rol if user.rol else "entrenador"
    token = create_access_token({"sub": str(user.id), "rol": rol})

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "nombre": user.nombre,
            "rol": rol
        }
    }
