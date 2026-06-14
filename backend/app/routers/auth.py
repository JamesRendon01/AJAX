from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.entrenador import Entrenador
from app.services.email import send_reset_email
from app.services.pwd import verify_password
from datetime import datetime, timedelta
import os
import jwt
import uuid
from pydantic import BaseModel

router = APIRouter(prefix="/auth", tags=["Auth"])

ALGORITHM = os.getenv("ALGORITHM", "HS256")
SECRET_KEY = os.getenv("SECRET_KEY", "ajax_secret_key_2026_change_in_production")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))
RESET_TOKEN_EXPIRE_HOURS = int(os.getenv("RESET_TOKEN_EXPIRE_HOURS", 1))

class LoginRequest(BaseModel):
    username: str
    password: str

class ForgotPasswordRequest(BaseModel):
    email: str

class ResetPasswordRequest(BaseModel):
    token: str
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
    
    if not user or not verify_password(password, user.password):
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

@router.post("/forgot-password")
def forgot_password(req: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(Entrenador).filter(Entrenador.email == req.email).first()
    if not user:
        return {"message": "Si el correo existe, recibiras un enlace de recuperacion"}

    token = str(uuid.uuid4())
    user.reset_token = token
    user.reset_token_expiry = datetime.utcnow() + timedelta(hours=RESET_TOKEN_EXPIRE_HOURS)
    db.commit()

    send_reset_email(to_email=user.email, token=token, nombre=user.nombre)

    return {"message": "Si el correo existe, recibiras un enlace de recuperacion"}

@router.post("/reset-password")
def reset_password(req: ResetPasswordRequest, db: Session = Depends(get_db)):
    if not req.password or len(req.password) < 4:
        raise HTTPException(status_code=400, detail="La contrasena debe tener al menos 4 caracteres")

    user = db.query(Entrenador).filter(
        Entrenador.reset_token == req.token,
        Entrenador.reset_token_expiry > datetime.utcnow()
    ).first()

    if not user:
        raise HTTPException(status_code=400, detail="Token invalido o expirado")

    user.password = req.password
    user.reset_token = None
    user.reset_token_expiry = None
    db.commit()

    return {"message": "Contrasena actualizada exitosamente"}

@router.get("/verify-reset-token/{token}")
def verify_reset_token(token: str, db: Session = Depends(get_db)):
    user = db.query(Entrenador).filter(
        Entrenador.reset_token == token,
        Entrenador.reset_token_expiry > datetime.utcnow()
    ).first()

    if not user:
        raise HTTPException(status_code=400, detail="Token invalido o expirado")

    return {"valid": True, "nombre": user.nombre}
