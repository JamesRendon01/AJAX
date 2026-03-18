from supabase import create_client
from dotenv import load_dotenv
import os

load_dotenv()

supabase = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_KEY")
)

BUCKET = os.getenv("STORAGE_BUCKET")

def subir_archivo(archivo_bytes: bytes, nombre_archivo: str, carpeta: str) -> str:
    ruta = f"{carpeta}/{nombre_archivo}"
    supabase.storage.from_(BUCKET).upload(
        ruta,
        archivo_bytes,
        {"content-type": "application/octet-stream"}
    )
    url = supabase.storage.from_(BUCKET).get_public_url(ruta)
    return url

def eliminar_archivo(ruta: str):
    supabase.storage.from_(BUCKET).remove([ruta])