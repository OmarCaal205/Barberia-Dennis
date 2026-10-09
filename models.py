from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Date, Time, Text, Numeric, DateTime
from sqlalchemy.sql import func
from database import Base

# 1. Modelo de Usuarios
class Usuario(Base):
    __tablename__ = "usuarios" # SQLAlchemy buscará esta tabla en minúsculas en Postgres
    
    id_usuario = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    correo = Column(String(100), unique=True, index=True, nullable=False)
    clave_encriptada = Column(String(255), nullable=False)
    rol = Column(String(20), nullable=False)
    telefono = Column(String(20))
    especialidad = Column(String(100))
    estado_disponibilidad = Column(Boolean, default=True)

# 2. Modelo de Servicios
class Servicio(Base):
    __tablename__ = "servicios"
    
    id_servicio = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    descripcion = Column(Text)
    precio = Column(Numeric(10, 2), nullable=False)
    duracion_minutos = Column(Integer, nullable=False)

# 3. Modelo de Citas
class Cita(Base):
    __tablename__ = "citas"
    
    id_cita = Column(Integer, primary_key=True, index=True)
    id_cliente = Column(Integer, ForeignKey("usuarios.id_usuario", ondelete="CASCADE"), nullable=False)
    id_barbero = Column(Integer, ForeignKey("usuarios.id_usuario"), nullable=False)
    id_servicio = Column(Integer, ForeignKey("servicios.id_servicio"), nullable=False)
    fecha = Column(Date, nullable=False)
    hora = Column(Time, nullable=False)
    estado = Column(String(20), default="Pendiente")

# 4. Modelo del Historial de Inteligencia Artificial
class HistorialIA(Base):
    __tablename__ = "historialia"
    
    id_historial = Column(Integer, primary_key=True, index=True)
    id_cliente = Column(Integer, ForeignKey("usuarios.id_usuario", ondelete="CASCADE"), nullable=False)
    mensaje_usuario = Column(Text, nullable=False)
    respuesta_ia = Column(Text, nullable=False)
    fecha_hora = Column(DateTime, default=func.now())