import { Link, useLocation } from "react-router-dom";
import Logo from "./Logo";

export default function Header({ usuario, onCerrarSesion }) {
  const location = useLocation();

  // Si estamos en la página de login o registro, no renderizamos la barra de navegación
  if (location.pathname === "/login" || location.pathname === "/registro") {
    return null;
  }

  const isActive = (path) => location.pathname === path;

  return (
    <header className="nav-bar">
      <Logo />

      <nav className="nav-links">
        <Link to="/" className={isActive("/") ? "active" : ""}>
          Inicio
        </Link>
        <Link to="/servicios" className={isActive("/servicios") ? "active" : ""}>
          Servicios
        </Link>
        <Link to="/agendar" className={isActive("/agendar") ? "active" : ""}>
          Agendar Cita
        </Link>
        <Link to="/recomendacion" className={isActive("/recomendacion") ? "active" : ""}>
          Recomendación IA
        </Link>
        <Link to="/curso" className={isActive("/curso") ? "active" : ""}>
          Curso
        </Link>
        <Link to="/sobre-nosotros" className={isActive("/sobre-nosotros") ? "active" : ""}>
          Nosotros
        </Link>
        <Link to="/contacto" className={isActive("/contacto") ? "active" : ""}>
          Contacto
        </Link>
      </nav>

      <div className="nav-actions">
        {usuario ? (
          <div className="nav-user-box">
            <span className="nav-user-name">Hola, {usuario.nombre?.split(" ")[0]}</span>
            <button onClick={onCerrarSesion} className="btn-ghost btn-sm">
              Cerrar Sesión
            </button>
          </div>
        ) : (
          <Link to="/login" className="btn-gold btn-sm">
            Ingresar
          </Link>
        )}
      </div>
    </header>
  );
}