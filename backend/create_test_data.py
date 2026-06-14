from app.database import SessionLocal, engine
from app.models import Base, Entrenador, Categoria, Jugador, Asistencia, Planeacion
from datetime import date

# Crear tablas si no existen
Base.metadata.create_all(bind=engine)

db = SessionLocal()

try:
    # Crear entrenadores
    admin = Entrenador(
        nombre="Administrador",
        tipoDocumento="CC",
        documento="admin",
        password="admin123",
        rol="admin",
        cargo="Administrador del Sistema"
    )
    db.add(admin)

    entrenador1 = Entrenador(
        nombre="Carlos Rodríguez",
        tipoDocumento="CC",
        documento="12345678",
        password="1234",
        rol="entrenador",
        certificado="cert_123.pdf",
        delitosSexuales="cert_delitos_123.pdf",
        tarjetaProfesional="TP-12345",
        certificadoPrimerCorrespondiente="cert_primer_123.pdf",
        celular="3001234567",
        cargo="Entrenador Principal"
    )
    
    entrenador2 = Entrenador(
        nombre="Ana Martínez",
        tipoDocumento="CC",
        documento="87654321",
        password="1234",
        rol="entrenador",
        certificado="cert_456.pdf",
        delitosSexuales="cert_delitos_456.pdf",
        tarjetaProfesional="TP-67890",
        certificadoPrimerCorrespondiente="cert_primer_456.pdf",
        celular="3007654321",
        cargo="Entrenadora Asistente"
    )
    
    coordinador = Entrenador(
        nombre="Coordinador Deportivo",
        tipoDocumento="CC",
        documento="coordinador",
        password="1234",
        rol="coordinador",
        celular="3009876543",
        cargo="Coordinador Deportivo"
    )
    db.add(coordinador)

    db.add_all([entrenador1, entrenador2])
    db.commit()
    
    # Crear categorías
    categoria1 = Categoria(
        nombre="Sub-15",
        ano=2026,
        idEntrenador=entrenador1.id
    )
    
    categoria2 = Categoria(
        nombre="Sub-17",
        ano=2026,
        idEntrenador=entrenador2.id
    )
    
    db.add_all([categoria1, categoria2])
    db.commit()
    
    # Crear jugadores
    jugadores = [
        Jugador(
            nombre="Juan Pérez",
            nacionalidad="Colombiana",
            tipoDocumento="CC",
            documento="11111111",
            fechaNacimiento=date(2011, 5, 15),
            edad=15,
            dorsal=7,
            contactoEmergencia="Maria Pérez - 3001111111",
            estado="Activo",
            fechaIngreso=date(2025, 1, 10),
            fechaSalida=None,
            devolucion1="Sí",
            devolucion2="Sí",
            devolucion3="Sí",
            torneo="Liga Juvenil 2026",
            idCategoria=categoria1.id
        ),
        Jugador(
            nombre="Pedro Gómez",
            nacionalidad="Colombiana",
            tipoDocumento="CC",
            documento="22222222",
            fechaNacimiento=date(2010, 8, 20),
            edad=16,
            dorsal=10,
            contactoEmergencia="Ana Gómez - 3002222222",
            estado="Activo",
            fechaIngreso=date(2025, 2, 15),
            fechaSalida=None,
            devolucion1="Sí",
            devolucion2="Sí",
            devolucion3="Sí",
            torneo="Liga Juvenil 2026",
            idCategoria=categoria2.id
        ),
        Jugador(
            nombre="Luis Torres",
            nacionalidad="Colombiana",
            tipoDocumento="CC",
            documento="33333333",
            fechaNacimiento=date(2011, 3, 10),
            edad=15,
            dorsal=5,
            contactoEmergencia="Carmen Torres - 3003333333",
            estado="Activo",
            fechaIngreso=date(2025, 3, 5),
            fechaSalida=None,
            devolucion1="Sí",
            devolucion2="Sí",
            devolucion3="Sí",
            torneo="Liga Juvenil 2026",
            idCategoria=categoria1.id
        )
    ]
    
    db.add_all(jugadores)
    db.commit()
    
    # Crear asistencias
    asistencia1 = Asistencia(
        nombre="Asistencia Sub-15 Enero",
        fechaCargado=date(2026, 2, 1),
        archivo="asistencia_sub15_enero.pdf",
        idEntrenador=entrenador1.id,
        idCategoria=categoria1.id
    )
    
    asistencia2 = Asistencia(
        nombre="Asistencia Sub-17 Febrero",
        fechaCargado=date(2026, 3, 1),
        archivo="asistencia_sub17_febrero.pdf",
        idEntrenador=entrenador2.id,
        idCategoria=categoria2.id
    )
    
    db.add_all([asistencia1, asistencia2])
    db.commit()
    
    # Crear planeaciones
    planeacion1 = Planeacion(
        nombre="Planeación Sub-15 Temporada 2026",
        fechaInicio=date(2026, 1, 1),
        fechaFin=date(2026, 6, 30),
        fechaCarga=date(2025, 12, 15),
        archivo="planeacion_sub15_2026.pdf",
        idCategoria=categoria1.id
    )
    
    planeacion2 = Planeacion(
        nombre="Planeación Sub-17 Temporada 2026",
        fechaInicio=date(2026, 1, 1),
        fechaFin=date(2026, 6, 30),
        fechaCarga=date(2025, 12, 20),
        archivo="planeacion_sub17_2026.pdf",
        idCategoria=categoria2.id
    )
    
    db.add_all([planeacion1, planeacion2])
    db.commit()
    
    print("Datos de prueba creados exitosamente!")
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
