"""
Migra datos existentes a formato encriptado/hasheado.
Ejecutar UNA SOLA VEZ después de aplicar los cambios en los modelos.
Uso: python migrate_data_encryption.py
"""
from app.database import SessionLocal
from app.services.pwd import hash_password
from app.services.crypto import encrypt
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

    # --- Migrar campos encriptables usando SQL directo ---
    rows = db.execute(text("SELECT id, celular, email, \"contactoEmergencia\" FROM entrenadores")).fetchall()
    count = 0
    for row in rows:
        updates = {}
        for col in ("celular", "email", "contactoEmergencia"):
            val = getattr(row, col)
            if val and not str(val).startswith("gAAAAA"):
                updates[col] = encrypt(str(val))
        if updates:
            set_clause = ", ".join(f"{c} = :{c}" for c in updates)
            updates["id"] = row.id
            db.execute(text(f"UPDATE entrenadores SET {set_clause} WHERE id = :id"), updates)
            count += 1
    db.commit()
    print(f"Entrenadores migrados: {count}")

    rows = db.execute(text("SELECT id, \"contactoEmergencia\" FROM jugadores")).fetchall()
    count = 0
    for row in rows:
        if row.contactoEmergencia and not str(row.contactoEmergencia).startswith("gAAAAA"):
            db.execute(text("UPDATE jugadores SET \"contactoEmergencia\" = :v WHERE id = :id"), {
                "v": encrypt(str(row.contactoEmergencia)), "id": row.id
            })
            count += 1
    db.commit()
    print(f"Jugadores migrados: {count}")

    print("Migración completada exitosamente")

except Exception as e:
    print(f"Error: {e}")
    db.rollback()
finally:
    db.close()
