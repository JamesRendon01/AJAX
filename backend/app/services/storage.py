import os
import shutil
from pathlib import Path

UPLOAD_DIR = Path(__file__).resolve().parent.parent.parent / "uploads"

MIME_TYPES = {
    ".pdf": "application/pdf",
    ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ".xls": "application/vnd.ms-excel",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
}

def limpiar(valor):
    if valor in ("NULL", "null", "None", "none", "", "undefined"):
        return None
    return valor

def subir_archivo(archivo_bytes: bytes, nombre_archivo: str, carpeta: str) -> str:
    destino = UPLOAD_DIR / carpeta
    destino.mkdir(parents=True, exist_ok=True)

    ruta_completa = destino / nombre_archivo
    with open(ruta_completa, "wb") as f:
        f.write(archivo_bytes)

    return f"/uploads/{carpeta}/{nombre_archivo}"

def eliminar_archivo(ruta: str):
    ruta = ruta.lstrip("/")
    archivo = UPLOAD_DIR / ruta.replace("uploads/", "", 1)
    if archivo.exists():
        archivo.unlink()
