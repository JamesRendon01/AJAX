# app/database.py
from sqlalchemy import create_engine
from app.models.models import Base
from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)

def crear_tablas():
    Base.metadata.create_all(engine)
    print("✅ Tablas creadas en Supabase")

if __name__ == "__main__":
    crear_tablas()