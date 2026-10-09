import { useState, useEffect } from "react";
import { crearCita, obtenerBarberos, obtenerServicios } from "../api.js";

export default function Agendar({ usuario }) {
  const [barberos, setBarberos] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [cargandoDatos, setCargandoDatos] = useState(true);
  const [errorDatos, setErrorDatos] = useState("");

  const [form, setForm] = useState({
    id_barbero: "",
    id_servicio: "",
    fecha: "",
    hora: "",
  });

  const [error, setError] = useState("");
  const [cita, setCita] = useState(null);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    Promise.all([obtenerBarberos(), obtenerServicios()])
      .then(([listaBarberos, listaServicios]) => {
        setBarberos(listaBarberos);
        setServicios(listaServicios);
      })
      .catch((err) => setErrorDatos(err.message))
      .finally(() => setCargandoDatos(false));
  }, []);

  function actualizar(campo, valor) {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  }

  async function manejarEnvio(e) {
    e.preventDefault();
    setError("");
    setCita(null);
    setCargando(true);
    try {
      const payload = {
        id_cliente: usuario.id_usuario,
        id_barbero: Number(form.id_barbero),
        id_servicio: Number(form.id_servicio),
        fecha: form.fecha,
        hora: `${form.hora}:00`,
      };
      const data = await crearCita(payload);
      setCita(data);
      setForm({ id_barbero: "", id_servicio: "", fecha: "", hora: "" });
    } catch (err) {
      // Aquí se ve el 409 de "El barbero ya tiene una cita..."
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  const sinBarberos = !cargandoDatos && !errorDatos && barberos.length === 0;
  const sinServicios = !cargandoDatos && !errorDatos && servicios.length === 0;

  return (
    <div className="container-narrow" style={{ paddingTop: "3rem" }}>
      <h2>Agendar cita</h2>
      <p style={{ opacity: 0.7 }}>
        Elige barbero, servicio, fecha y hora. Si el horario ya está
        ocupado, te lo decimos antes de confirmar.
      </p>

      {cargandoDatos && <p style={{ opacity: 0.6 }}>Cargando opciones…</p>}
      {errorDatos && <div className="alert-error">{errorDatos}</div>}
      {sinBarberos && (
        <div className="alert-error">
          Todavía no hay barberos registrados con rol "barbero". Registra uno
          desde <code>POST /usuarios/</code>.
        </div>
      )}
      {sinServicios && (
        <div className="alert-error">
          Todavía no hay servicios cargados. Créalos desde{" "}
          <code>POST /servicios/</code>.
        </div>
      )}

      {!cargandoDatos && !errorDatos && !sinBarberos && !sinServicios && (
        <div className="panel" style={{ maxWidth: 480 }}>
          {error && <div className="alert-error">{error}</div>}
          {cita && (
            <div className="alert-success">
              Cita #{cita.id_cita} agendada — estado: {cita.estado}
            </div>
          )}

          <form onSubmit={manejarEnvio}>
            <div className="field">
              <label>Barbero</label>
              <select
                className="form-select"
                value={form.id_barbero}
                onChange={(e) => actualizar("id_barbero", e.target.value)}
                required
              >
                <option value="" disabled>
                  Selecciona un barbero
                </option>
                {barberos.map((b) => (
                  <option key={b.id_usuario} value={b.id_usuario}>
                    {b.nombre}
                    {b.especialidad ? ` — ${b.especialidad}` : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label>Servicio</label>
              <select
                className="form-select"
                value={form.id_servicio}
                onChange={(e) => actualizar("id_servicio", e.target.value)}
                required
              >
                <option value="" disabled>
                  Selecciona un servicio
                </option>
                {servicios.map((s) => (
                  <option key={s.id_servicio} value={s.id_servicio}>
                    {s.nombre} — Q{s.precio}
                  </option>
                ))}
              </select>
            </div>

            <div className="d-flex gap-3">
              <div className="field flex-grow-1">
                <label>Fecha</label>
                <input
                  type="date"
                  className="form-control"
                  value={form.fecha}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => actualizar("fecha", e.target.value)}
                  required
                />
              </div>
              <div className="field flex-grow-1">
                <label>Hora</label>
                <input
                  type="time"
                  className="form-control"
                  value={form.hora}
                  onChange={(e) => actualizar("hora", e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-login-dorado w-100"
              disabled={cargando}
            >
              {cargando ? "Agendando..." : "Confirmar cita"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}