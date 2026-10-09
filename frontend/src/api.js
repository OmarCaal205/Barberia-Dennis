// Todas las llamadas al backend de FastAPI pasan por aquí.
// Si tu backend corre en otro puerto o dominio, cambia BASE_URL.
const BASE_URL = "http://127.0.0.1:8000";

async function manejarRespuesta(res) {
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const mensaje = data?.detail || "Ocurrió un error inesperado.";
    throw new Error(mensaje);
  }
  return data;
}

export async function crearUsuario(usuario) {
  const res = await fetch(`${BASE_URL}/usuarios/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(usuario),
  });
  return manejarRespuesta(res);
}

export async function iniciarSesion(credenciales) {
  const res = await fetch(`${BASE_URL}/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credenciales),
  });
  return manejarRespuesta(res);
}

export async function obtenerServicios() {
  const res = await fetch(`${BASE_URL}/servicios/`);
  return manejarRespuesta(res);
}

export async function crearCita(cita) {
  const res = await fetch(`${BASE_URL}/citas/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cita),
  });
  return manejarRespuesta(res);
}

export async function consultarAgenda(idBarbero) {
  const url = idBarbero
    ? `${BASE_URL}/citas/?id_barbero=${idBarbero}`
    : `${BASE_URL}/citas/`;
  const res = await fetch(url);
  return manejarRespuesta(res);
}

export async function pedirRecomendacionIA(consulta) {
  const res = await fetch(`${BASE_URL}/ia/recomendar/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(consulta),
  });
  return manejarRespuesta(res);
}

export async function obtenerBarberos() {
  const res = await fetch(`${BASE_URL}/usuarios/barberos/`);
  return manejarRespuesta(res);
}

export async function pedirRecomendacionPorFoto(idCliente, archivoFoto, mensaje = "") {
  const formData = new FormData();
  formData.append("id_cliente", idCliente);
  formData.append("mensaje_usuario", mensaje);
  formData.append("foto", archivoFoto);

  const res = await fetch(`${BASE_URL}/ia/recomendar-foto/`, {
    method: "POST",
    body: formData, // sin headers manuales: el navegador pone el Content-Type correcto
  });
  return manejarRespuesta(res);
}