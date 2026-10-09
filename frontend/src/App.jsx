import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header.jsx";
import RutaPrivada from "./components/RutaPrivada.jsx";
import Inicio from "./pages/Inicio.jsx";
import Login from "./pages/Login.jsx";
import Registro from "./pages/Registro.jsx";
import Servicios from "./pages/Servicios.jsx";
import Agendar from "./pages/Agendar.jsx";
import RecomendacionIA from "./pages/RecomendacionIA.jsx";
import SobreNosotros from "./pages/SobreNosotros.jsx";
import Contacto from "./pages/Contacto.jsx";
import Curso from "./pages/Curso.jsx";



export default function App() {
  const [usuario, setUsuario] = useState(null);
  const [cargandoSesion, setCargandoSesion] = useState(true);

  useEffect(() => {
    const guardado = localStorage.getItem("barberia_usuario");
    if (guardado) setUsuario(JSON.parse(guardado));
    setCargandoSesion(false);
  }, []);

  function iniciarSesionLocal(datosUsuario) {
    setUsuario(datosUsuario);
    localStorage.setItem("barberia_usuario", JSON.stringify(datosUsuario));
  }

  function cerrarSesion() {
    setUsuario(null);
    localStorage.removeItem("barberia_usuario");
  }

  // Evita un parpadeo hacia /login mientras se revisa si ya había sesión guardada
  if (cargandoSesion) return null;

  return (
    <>
      {usuario && <Header usuario={usuario} onCerrarSesion={cerrarSesion} />}
      <Routes>
        <Route
          path="/"
          element={
            <RutaPrivada usuario={usuario}>
              <Inicio usuario={usuario} />
            </RutaPrivada>
          }
        />
        <Route
          path="/login"
          element={<Login onIniciarSesion={iniciarSesionLocal} />}
        />
        <Route path="/registro" element={<Registro />} />
        <Route
          path="/servicios"
          element={
            <RutaPrivada usuario={usuario}>
              <Servicios />
            </RutaPrivada>
          }
        />
        <Route
          path="/agendar"
          element={
            <RutaPrivada usuario={usuario}>
              <Agendar usuario={usuario} />
            </RutaPrivada>
          }
        />
        <Route
          path="/recomendacion"
          element={
            <RutaPrivada usuario={usuario}>
              <RecomendacionIA usuario={usuario} />
            </RutaPrivada>
          }
        />

<Route
  path="/sobre-nosotros"
  element={
    <RutaPrivada usuario={usuario}>
      <SobreNosotros />
    </RutaPrivada>
  }
/>
<Route
  path="/contacto"
  element={
    <RutaPrivada usuario={usuario}>
      <Contacto />
    </RutaPrivada>
  }
/>
<Route
  path="/curso"
  element={
    <RutaPrivada usuario={usuario}>
      <Curso />
    </RutaPrivada>
  }
/>
      </Routes>
    </>
  );
}