from supabase import create_client
from dotenv import load_dotenv
import httpx
import os

load_dotenv()

supabase = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_KEY")
)

BUCKET = os.getenv("STORAGE_BUCKET")

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
    extension = os.path.splitext(nombre_archivo)[1].lower()
    content_type = MIME_TYPES.get(extension, "application/pdf")
    ruta = f"{carpeta}/{nombre_archivo}"
    
    supabase.storage.from_(BUCKET).upload(
        ruta,
        archivo_bytes,
        {"content-type": content_type, "x-upsert": "true"}
    )
    url = supabase.storage.from_(BUCKET).get_public_url(ruta)
    return url

def eliminar_archivo(ruta: str):
    supabase.storage.from_(BUCKET).remove([ruta])