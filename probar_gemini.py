import os
from dotenv import load_dotenv
from google import genai

load_dotenv()
clave = os.getenv("GEMINI_API_KEY")
print("Clave detectada:", clave[:10] + "..." if clave else "NO SE ENCONTRÓ LA CLAVE")

client = genai.Client(api_key=clave)

respuesta = client.models.generate_content(
    model="gemini-3.5-flash",
    contents="Dime un saludo breve"
)
print(respuesta.text)