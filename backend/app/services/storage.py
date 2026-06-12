import os
import cloudinary
import cloudinary.uploader
import cloudinary.api
from pathlib import Path

UPLOAD_DIR = Path(__file__).resolve().parent.parent.parent / "uploads"

CLOUDINARY_CLOUD_NAME = os.getenv("CLOUDINARY_CLOUD_NAME")
CLOUDINARY_API_KEY = os.getenv("CLOUDINARY_API_KEY")
CLOUDINARY_API_SECRET = os.getenv("CLOUDINARY_API_SECRET")

_cloudinary_configured = bool(CLOUDINARY_CLOUD_NAME and CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET)

if _cloudinary_configured:
    cloudinary.config(
        cloud_name=CLOUDINARY_CLOUD_NAME,
        api_key=CLOUDINARY_API_KEY,
        api_secret=CLOUDINARY_API_SECRET,
        secure=True,
    )

def limpiar(valor):
    if valor in ("NULL", "null", "None", "none", "", "undefined"):
        return None
    return valor

def subir_archivo(archivo_bytes: bytes, nombre_archivo: str, carpeta: str) -> str:
    if _cloudinary_configured:
        resultado = cloudinary.uploader.upload(
            archivo_bytes,
            resource_type="auto",
            folder=carpeta,
            public_id=nombre_archivo,
            overwrite=True,
        )
        return resultado["secure_url"]

    destino = UPLOAD_DIR / carpeta
    destino.mkdir(parents=True, exist_ok=True)
    ruta_completa = destino / nombre_archivo
    with open(ruta_completa, "wb") as f:
        f.write(archivo_bytes)
    return f"/uploads/{carpeta}/{nombre_archivo}"

def eliminar_archivo(ruta: str):
    if _cloudinary_configured and "res.cloudinary.com" in ruta:
        try:
            public_id = ruta.split("/")[-1]
            cloudinary.uploader.destroy(public_id)
        except Exception:
            pass
        return

    ruta = ruta.lstrip("/")
    archivo = UPLOAD_DIR / ruta.replace("uploads/", "", 1)
    if archivo.exists():
        archivo.unlink()
