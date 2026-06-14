"""
Migra datos existentes a formato encriptado/hasheado.
Ejecutar UNA SOLA VEZ después de aplicar los cambios en los modelos.
Uso: python migrate_data_encryption.py
"""
from app.database import SessionLocal
from app.models.entrenador import Entrenador
from app.models.jugador import Jugador
from app.services.pwd import hash_password
from sqlalchemy import text

db = SessionLocal()

try:
    # --- Migrar passwords (texto plano -> bcrypt) ---
    rows = db.execute(text("SELECT id, password FROM entrenadores")).fetchall()
    count = 0
    for row in rows:
        raw_pwd = row.password
        if raw_pwd and not raw_pwd.startswith("$2"):
            hashed = hash_password(raw_pwd)
            db.execute(text("UPDATE entrenadores SET password = :p WHERE id = :id"), {"p": hashed, "id": row.id})
            count += 1
    db.commit()
    print(f"Passwords migradas: {count}")

    # --- Migrar campos encriptables ---
    for e in db.query(Entrenador).all():
        e.celular = e.celular
        e.email = e.email
        e.contactoEmergencia = e.contactoEmergencia
        db.add(e)
    db.commit()
    print("Campos de Entrenador migrados")

    for j in db.query(Jugador).all():
        j.contactoEmergencia = j.contactoEmergencia
        db.add(j)
    db.commit()
    print("Campos de Jugador migrados")

    print("Migración completada exitosamente")

except Exception as e:
    print(f"Error: {e}")
    db.rollback()
finally:
    db.close()
