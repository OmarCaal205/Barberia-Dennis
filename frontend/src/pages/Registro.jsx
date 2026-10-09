import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { crearUsuario } from "../api.js";

export default function Registro() {
  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    clave: "",
    rol: "cliente",
    telefono: "",
  });
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");
  const [cargando, setCargando] = useState(false);
  const navegar = useNavigate();

  function actualizar(campo, valor) {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  }

  async function manejarEnvio(e) {
    e.preventDefault();
    setError("");
    setExito("");
    setCargando(true);
    try {
      const data = await crearUsuario(form);
      setExito(data.mensaje);
      setTimeout(() => navegar("/login"), 1200);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="container-narrow" style={{ paddingTop: "3rem" }}>
      <h2>Crear cuenta</h2>
      <p style={{ opacity: 0.7 }}>Regístrate como cliente o como barbero.</p>

      <div className="panel" style={{ maxWidth: 460 }}>
        {error && <div className="alert-error">{error}</div>}
        {exito && <div className="alert-success">{exito}</div>}
        <form onSubmit={manejarEnvio}>
          <div className="field">
            <label>Nombre completo</label>
            <input
              className="form-control"
              value={form.nombre}
              onChange={(e) => actualizar("nombre", e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label>Correo</label>
            <input
              type="email"
              className="form-control"
              value={form.correo}
              onChange={(e) => actualizar("correo", e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label>Contraseña</label>
            <input
              type="password"
              className="form-control"
              value={form.clave}
              onChange={(e) => actualizar("clave", e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label>Teléfono (opcional)</label>
            <input
              className="form-control"
              value={form.telefono}
              onChange={(e) => actualizar("telefono", e.target.value)}
            />
          </div>
          <div className="field">
            <label>Tipo de cuenta</label>
            <select
              className="form-select"
              value={form.rol}
              onChange={(e) => actualizar("rol", e.target.value)}
            >
              <option value="cliente">Cliente</option>
              <option value="barbero">Barbero</option>
            </select>
          </div>
          <button
            type="submit"
            className="btn-primary-barberia w-100"
            disabled={cargando}
          >
            {cargando ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>
      </div>

      <p className="mt-3" style={{ opacity: 0.7, fontSize: "0.9rem" }}>
        ¿Ya tienes cuenta?{" "}
        <Link to="/login" style={{ color: "var(--gold)" }}>
          Ingresa aquí
        </Link>
      </p>
    </div>
  );
}
