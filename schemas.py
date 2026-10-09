from pydantic import BaseModel
from typing import Optional
from datetime import date, time
# Este es el molde de los datos que esperamos recibir cuando alguien se registre
class UsuarioCrear(BaseModel):
    nombre: str
    correo: str
    clave: str
    rol: str
    telefono: Optional[str] = None

# Molde para el inicio de sesión
class UsuarioLogin(BaseModel):
    correo: str
    clave: str

# Molde para crear un nuevo servicio
class ServicioCrear(BaseModel):
    nombre: str
    descripcion: Optional[str] = None
    precio: float
    duracion_minutos: int

# Molde para mostrar los servicios (incluyendo su ID generado)
class ServicioRespuesta(ServicioCrear):
    id_servicio: int

    class Config:
        from_attributes = True

# Molde para crear una cita
class CitaCrear (BaseModel):
    id_cliente: int
    id_barbero: int
    id_servicio: int
    fecha: date
    hora: time

class CitaRespuesta(CitaCrear):
    id_cita: int
    estado: str

    class Config:
        from_attributes = True 


class ConsultaIA(BaseModel):
    id_cliente: int
    mensaje_usuario: str  # gustos, tipo de rostro, estilo deseado, etc.

class RespuestaIA(BaseModel):
    id_historial: int
    id_cliente: int
    mensaje_usuario: str
    respuesta_ia: str

    class Config:
        from_attributes = True

class UsuarioPublico(BaseModel):
    id_usuario: int
    nombre: str
    especialidad: Optional[str] = None

    class Config:
        from_attributes = True