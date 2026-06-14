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

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB
ALLOWED_EXTENSIONS = {
    ".pdf", ".doc", ".docx", ".xls", ".xlsx", ".jpg", ".jpeg",
    ".png", ".gif", ".txt", ".zip", ".rar",
}
ALLOWED_MIME_TYPES = {
    "application/pdf", "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "image/jpeg", "image/png", "image/gif",
    "text/plain", "application/zip", "application/x-rar-compressed",
    "application/x-zip-compressed", "application/octet-stream",
}


def limpiar(valor):
    if valor in ("NULL", "null", "None", "none", "", "undefined"):
        return None
    return valor


def validar_archivo(archivo_bytes: bytes, nombre_archivo: str):
    if len(archivo_bytes) > MAX_FILE_SIZE:
        raise ValueError(f"El archivo excede el tamaño máximo de {MAX_FILE_SIZE // (1024*1024)}MB")

    ext = os.path.splitext(nombre_archivo)[1].lower()
    if ext and ext not in ALLOWED_EXTENSIONS:
        raise ValueError(f"Tipo de archivo '{ext}' no permitido")


def subir_archivo(archivo_bytes: bytes, nombre_archivo: str, carpeta: str) -> str:
    validar_archivo(archivo_bytes, nombre_archivo)

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
