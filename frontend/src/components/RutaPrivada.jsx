import { Navigate } from "react-router-dom";

export default function RutaPrivada({ usuario, children }) {
  if (!usuario) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
