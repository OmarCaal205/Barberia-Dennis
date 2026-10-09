import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

# 1. Cargar las variables ocultas del archivo .env
load_dotenv()

# 2. Construir la URL de conexión uniendo las variables de tu .env
USER = os.getenv("DB_USER")
PASSWORD = os.getenv("DB_PASSWORD")
HOST = os.getenv("DB_HOST")
PORT = os.getenv("DB_PORT")
NAME = os.getenv("DB_NAME")

# Esta línea arma el string de conexión que pide PostgreSQL
SQLALCHEMY_DATABASE_URL = f"postgresql://{USER}:{PASSWORD}@{HOST}:{PORT}/{NAME}"

# 3. Crear el motor de conexión de SQLAlchemy
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# 4. Crear la sesión para interactuar con la base de datos
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 5. Clase base para nuestros futuros modelos de tablas
Base = declarative_base()

# 6. Función (Dependencia) para conectarse a la BD cada vez que hagamos una petición
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()