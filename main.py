import os
from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
from passlib.context import CryptContext
from typing import List
from dotenv import load_dotenv
from google import genai
from google.genai import types

from database import get_db
import models
import schemas

load_dotenv()
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

app = FastAPI(title="BarberIA API")

# --- Módulo 2: CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # en producción reemplaza por la URL real de tu frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


@app.get("/")
def ruta_raiz():
    return {"mensaje": "¡Servidor de BarberIA corriendo al 100%!"}


@app.get("/test-db")
def probar_base_datos(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
        return {"status": "Éxito", "mensaje": "¡Conexión a PostgreSQL establecida!"}
    except Exception as e:
        return {"status": "Error", "mensaje": str(e)}


# --- USUARIOS ---
@app.post("/usuarios/")
def crear_usuario(usuario: schemas.UsuarioCrear, db: Session = Depends(get_db)):
    db_usuario = db.query(models.Usuario).filter(models.Usuario.correo == usuario.correo).first()
    if db_usuario:
        raise HTTPException(status_code=400, detail="Este correo ya está registrado")

    clave_hash = pwd_context.hash(usuario.clave)

    nuevo_usuario = models.Usuario(
        nombre=usuario.nombre,
        correo=usuario.correo,
        clave_encriptada=clave_hash,
        rol=usuario.rol,
        telefono=usuario.telefono
    )

    db.add(nuevo_usuario)
    db.commit()
    db.refresh(nuevo_usuario)

    return {"mensaje": f"¡Usuario {nuevo_usuario.nombre} creado con éxito!", "id": nuevo_usuario.id_usuario}


@app.post("/login/")
def iniciar_sesion(credenciales: schemas.UsuarioLogin, db: Session = Depends(get_db)):
    usuario = db.query(models.Usuario).filter(models.Usuario.correo == credenciales.correo).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    clave_correcta = pwd_context.verify(credenciales.clave, usuario.clave_encriptada)
    if not clave_correcta:
        raise HTTPException(status_code=401, detail="Contraseña incorrecta")

    return {
        "mensaje": f"¡Bienvenido de nuevo, {usuario.nombre}!",
        "id_usuario": usuario.id_usuario,
        "nombre": usuario.nombre,
        "rol": usuario.rol
    }


@app.get("/usuarios/barberos/", response_model=List[schemas.UsuarioPublico])
def listar_barberos(db: Session = Depends(get_db)):
    return db.query(models.Usuario).filter(models.Usuario.rol == "barbero").all()


# --- SERVICIOS ---
@app.post("/servicios/")
def crear_servicio(servicio: schemas.ServicioCrear, db: Session = Depends(get_db)):
    nuevo_servicio = models.Servicio(
        nombre=servicio.nombre,
        descripcion=servicio.descripcion,
        precio=servicio.precio,
        duracion_minutos=servicio.duracion_minutos
    )
    db.add(nuevo_servicio)
    db.commit()
    db.refresh(nuevo_servicio)
    return {
        "mensaje": f"Servicio '{nuevo_servicio.nombre}' creado con éxito",
        "id_servicio": nuevo_servicio.id_servicio
    }


@app.get("/servicios/")
def obtener_servicios(db: Session = Depends(get_db)):
    return db.query(models.Servicio).all()


# --- MÓDULO 1: CITAS ---
@app.post("/citas/", response_model=schemas.CitaRespuesta)
def crear_cita(cita: schemas.CitaCrear, db: Session = Depends(get_db)):
    # --- Módulo 4: Validación de disponibilidad ---
    cita_existente = db.query(models.Cita).filter(
        models.Cita.id_barbero == cita.id_barbero,
        models.Cita.fecha == cita.fecha,
        models.Cita.hora == cita.hora
    ).first()

    if cita_existente:
        raise HTTPException(
            status_code=409,
            detail="El barbero ya tiene una cita agendada en esa fecha y hora."
        )

    nueva_cita = models.Cita(
        id_cliente=cita.id_cliente,
        id_barbero=cita.id_barbero,
        id_servicio=cita.id_servicio,
        fecha=cita.fecha,
        hora=cita.hora,
        estado="Pendiente"
    )
    db.add(nueva_cita)
    db.commit()
    db.refresh(nueva_cita)
    return nueva_cita


@app.get("/citas/", response_model=List[schemas.CitaRespuesta])
def consultar_agenda(id_barbero: int | None = None, db: Session = Depends(get_db)):
    query = db.query(models.Cita)
    if id_barbero is not None:
        query = query.filter(models.Cita.id_barbero == id_barbero)
    return query.all()


# --- MÓDULO 3: INTEGRACIÓN CON IA (Gemini) ---

# Recomendación solo con texto (se deja disponible por si la usas en otro lugar)
@app.post("/ia/recomendar/", response_model=schemas.RespuestaIA)
def recomendar_corte(consulta: schemas.ConsultaIA, db: Session = Depends(get_db)):
    prompt = (
        f"Eres un experto barbero y asesor de estilo. "
        f"Un cliente describe lo siguiente: '{consulta.mensaje_usuario}'. "
        f"Recomiéndale un corte de cabello o estilo de barba adecuado, "
        f"explicando brevemente por qué le quedaría bien."
    )

    try:
        respuesta = client.models.generate_content(
            model="gemini-3.5-flash",
            contents=prompt
        )
        texto_respuesta = respuesta.text
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al consultar la IA: {str(e)}")

    nuevo_registro = models.HistorialIA(
        id_cliente=consulta.id_cliente,
        mensaje_usuario=consulta.mensaje_usuario,
        respuesta_ia=texto_respuesta
    )
    db.add(nuevo_registro)
    db.commit()
    db.refresh(nuevo_registro)

    return nuevo_registro


# Recomendación a partir de una foto del cliente
@app.post("/ia/recomendar-foto/", response_model=schemas.RespuestaIA)
async def recomendar_corte_foto(
    id_cliente: int = Form(...),
    mensaje_usuario: str = Form(""),
    foto: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    contenido_imagen = await foto.read()

    prompt = (
        "Eres un experto barbero y asesor de estilo. Observa la foto de este "
        "cliente e identifica su forma de rostro (ovalado, redondo, cuadrado, "
        "rectangular, corazón o diamante). Con base en eso, recomiéndale un "
        "corte de cabello y un estilo de barba que le favorezcan, explicando "
        "brevemente por qué."
    )
    if mensaje_usuario:
        prompt += f" El cliente además comenta lo siguiente: '{mensaje_usuario}'."

    try:
        imagen_part = types.Part.from_bytes(
            data=contenido_imagen,
            mime_type=foto.content_type or "image/jpeg",
        )
        respuesta = client.models.generate_content(
            model="gemini-3.5-flash",
            contents=[prompt, imagen_part],
        )
        texto_respuesta = respuesta.text
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al consultar la IA: {str(e)}")

    nuevo_registro = models.HistorialIA(
        id_cliente=id_cliente,
        mensaje_usuario=mensaje_usuario or "Recomendación basada en foto",
        respuesta_ia=texto_respuesta,
    )
    db.add(nuevo_registro)
    db.commit()
    db.refresh(nuevo_registro)

    return nuevo_registro