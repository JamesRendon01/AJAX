from app.database import SessionLocal, engine
from app.models import Base, Entrenador, Categoria, Jugador, Asistencia, Planeacion
from datetime import date

Base.metadata.create_all(bind=engine)

db = SessionLocal()

try:
    existentes = {e.documento for e in db.query(Entrenador.documento).all()}

    def crear_entrenador(**kw):
        if kw["documento"] in existentes:
            print(f"  Ya existe: {kw['documento']} ({kw['nombre']})")
            return db.query(Entrenador).filter(Entrenador.documento == kw["documento"]).first()
        obj = Entrenador(**kw)
        db.add(obj)
        db.flush()
        existentes.add(kw["documento"])
        print(f"  Creado: {kw['documento']} ({kw['nombre']})")
        return obj

    print("Creando entrenadores...")
    admin = crear_entrenador(
        nombre="Administrador", tipoDocumento="CC", documento="admin",
        password="admin123", rol="admin", cargo="Administrador del Sistema"
    )
    coordinador = crear_entrenador(
        nombre="Coordinador Deportivo", tipoDocumento="CC", documento="coordinador",
        password="1234", rol="coordinador", celular="3009876543", cargo="Coordinador Deportivo"
    )
    entrenador1 = crear_entrenador(
        nombre="Carlos Rodríguez", tipoDocumento="CC", documento="12345678",
        password="1234", rol="entrenador", certificado="cert_123.pdf",
        delitosSexuales="cert_delitos_123.pdf", tarjetaProfesional="TP-12345",
        celular="3001234567", cargo="Entrenador Principal"
    )
    entrenador2 = crear_entrenador(
        nombre="Ana Martínez", tipoDocumento="CC", documento="87654321",
        password="1234", rol="entrenador", certificado="cert_456.pdf",
        delitosSexuales="cert_delitos_456.pdf", tarjetaProfesional="TP-67890",
        celular="3007654321", cargo="Entrenadora Asistente"
    )

    db.commit()

    cats_existentes = {(c.nombre, c.ano) for c in db.query(Categoria).all()}
    def crear_categoria(nombre, ano, idEntrenador):
        key = (nombre, ano)
        if key in cats_existentes:
            print(f"  Ya existe categoría: {nombre} {ano}")
            return db.query(Categoria).filter(Categoria.nombre == nombre, Categoria.ano == ano).first()
        obj = Categoria(nombre=nombre, ano=ano, idEntrenador=idEntrenador)
        db.add(obj)
        db.flush()
        cats_existentes.add(key)
        print(f"  Creada categoría: {nombre} {ano}")
        return obj

    print("Creando categorías...")
    categoria1 = crear_categoria("Sub-15", 2026, entrenador1.id)
    categoria2 = crear_categoria("Sub-17", 2026, entrenador2.id)
    db.commit()

    docs_jugadores = {j.documento for j in db.query(Jugador.documento).all()}
    def crear_jugador(**kw):
        if kw["documento"] in docs_jugadores:
            print(f"  Ya existe jugador: {kw['documento']} ({kw['nombre']})")
            return
        obj = Jugador(**kw)
        db.add(obj)
        db.flush()
        docs_jugadores.add(kw["documento"])
        print(f"  Creado jugador: {kw['documento']} ({kw['nombre']})")

    print("Creando jugadores...")
    crear_jugador(
        nombre="Juan Pérez", nacionalidad="Colombiana", tipoDocumento="CC",
        documento="11111111", fechaNacimiento=date(2011, 5, 15), edad=15, dorsal=7,
        contactoEmergencia="Maria Pérez - 3001111111", estado="Activo",
        fechaIngreso=date(2025, 1, 10), fechaSalida=None,
        devolucion1="Sí", devolucion2="Sí", devolucion3="Sí",
        torneo="Liga Juvenil 2026", idCategoria=categoria1.id
    )
    crear_jugador(
        nombre="Pedro Gómez", nacionalidad="Colombiana", tipoDocumento="CC",
        documento="22222222", fechaNacimiento=date(2010, 8, 20), edad=16, dorsal=10,
        contactoEmergencia="Ana Gómez - 3002222222", estado="Activo",
        fechaIngreso=date(2025, 2, 15), fechaSalida=None,
        devolucion1="Sí", devolucion2="Sí", devolucion3="Sí",
        torneo="Liga Juvenil 2026", idCategoria=categoria2.id
    )
    crear_jugador(
        nombre="Luis Torres", nacionalidad="Colombiana", tipoDocumento="CC",
        documento="33333333", fechaNacimiento=date(2011, 3, 10), edad=15, dorsal=5,
        contactoEmergencia="Carmen Torres - 3003333333", estado="Activo",
        fechaIngreso=date(2025, 3, 5), fechaSalida=None,
        devolucion1="Sí", devolucion2="Sí", devolucion3="Sí",
        torneo="Liga Juvenil 2026", idCategoria=categoria1.id
    )
    db.commit()

    asistencias_existentes = {(a.nombre, a.idCategoria) for a in db.query(Asistencia).all()}
    def crear_asistencia(nombre, fechaCargado, archivo, idEntrenador, idCategoria):
        key = (nombre, idCategoria)
        if key in asistencias_existentes:
            print(f"  Ya existe asistencia: {nombre}")
            return
        db.add(Asistencia(
            nombre=nombre, fechaCargado=fechaCargado, archivo=archivo,
            idEntrenador=idEntrenador, idCategoria=idCategoria
        ))
        asistencias_existentes.add(key)
        print(f"  Creada asistencia: {nombre}")

    print("Creando asistencias...")
    crear_asistencia("Asistencia Sub-15 Enero", date(2026, 2, 1), "asistencia_sub15_enero.pdf", entrenador1.id, categoria1.id)
    crear_asistencia("Asistencia Sub-17 Febrero", date(2026, 3, 1), "asistencia_sub17_febrero.pdf", entrenador2.id, categoria2.id)
    db.commit()

    planeaciones_existentes = {(p.nombre, p.idCategoria) for p in db.query(Planeacion).all()}
    def crear_planeacion(nombre, fechaInicio, fechaFin, fechaCarga, archivo, idCategoria):
        key = (nombre, idCategoria)
        if key in planeaciones_existentes:
            print(f"  Ya existe planeación: {nombre}")
            return
        db.add(Planeacion(
            nombre=nombre, fechaInicio=fechaInicio, fechaFin=fechaFin,
            fechaCarga=fechaCarga, archivo=archivo, idCategoria=idCategoria
        ))
        planeaciones_existentes.add(key)
        print(f"  Creada planeación: {nombre}")

    print("Creando planeaciones...")
    crear_planeacion("Planeación Sub-15 Temporada 2026", date(2026, 1, 1), date(2026, 6, 30), date(2025, 12, 15), "planeacion_sub15_2026.pdf", categoria1.id)
    crear_planeacion("Planeación Sub-17 Temporada 2026", date(2026, 1, 1), date(2026, 6, 30), date(2025, 12, 20), "planeacion_sub17_2026.pdf", categoria2.id)
    db.commit()

    print("\nDatos de prueba verificados exitosamente!")
    print(f"Usuarios: {db.query(Entrenador).count()}")
    print(f"  admin / admin123 (rol: admin)")
    print(f"  coordinador / 1234 (rol: coordinador)")
    print(f"  12345678 / 1234 (rol: entrenador)")
    print(f"  87654321 / 1234 (rol: entrenador)")
    print(f"Categorías: {db.query(Categoria).count()}")
    print(f"Jugadores: {db.query(Jugador).count()}")
    print(f"Asistencias: {db.query(Asistencia).count()}")
    print(f"Planeaciones: {db.query(Planeacion).count()}")

except Exception as e:
    print(f"Error: {e}")
    db.rollback()
finally:
    db.close()
