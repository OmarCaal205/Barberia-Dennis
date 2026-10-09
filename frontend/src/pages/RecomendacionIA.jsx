import { useState, useRef, useEffect } from "react";
import { pedirRecomendacionPorFoto } from "../api.js";

export default function RecomendacionIA({ usuario }) {
  const [modo, setModo] = useState(null); // null | "camara"
  const [archivo, setArchivo] = useState(null);
  const [previsualizacion, setPrevisualizacion] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [respuesta, setRespuesta] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const inputFotoRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // Apaga la cámara si el usuario sale de la página sin cerrarla
  useEffect(() => {
    return () => detenerCamara();
  }, []);

  function detenerCamara() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }

  async function abrirCamara() {
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });
      streamRef.current = stream;
      setModo("camara");
      // Esperamos a que el <video> exista en el DOM antes de asignarle el stream
      setTimeout(() => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      }, 0);
    } catch (err) {
      setError(
        "No se pudo acceder a la cámara. Revisa los permisos del navegador."
      );
    }
  }

  function cancelarCamara() {
    detenerCamara();
    setModo(null);
  }

  function capturarFoto() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const contexto = canvas.getContext("2d");
    contexto.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      const archivoCapturado = new File([blob], "foto-camara.jpg", {
        type: "image/jpeg",
      });
      setArchivo(archivoCapturado);
      setPrevisualizacion(URL.createObjectURL(blob));
      detenerCamara();
      setModo(null);
    }, "image/jpeg");
  }

  function manejarSeleccionArchivo(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setArchivo(file);
    setRespuesta("");
    setError("");
    setPrevisualizacion(URL.createObjectURL(file));
  }

  function quitarFoto() {
    setArchivo(null);
    setPrevisualizacion(null);
    if (inputFotoRef.current) inputFotoRef.current.value = "";
  }

  async function manejarEnvio(e) {
    e.preventDefault();
    if (!archivo) {
      setError("Sube o toma una foto antes de continuar.");
      return;
    }
    setError("");
    setRespuesta("");
    setCargando(true);
    try {
      const data = await pedirRecomendacionPorFoto(
        usuario.id_usuario,
        archivo,
        mensaje
      );
      setRespuesta(data.respuesta_ia);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="container-narrow" style={{ paddingTop: "3rem" }}>
      <span className="eyebrow-tag">Recomendación con IA</span>
      <h2>Descubre tu corte ideal</h2>
      <p style={{ opacity: 0.7 }}>
        Sube o tómate una foto de frente. La IA identificará tu tipo de
        rostro y te recomendará un corte y estilo de barba.
      </p>

      <div className="panel" style={{ maxWidth: 560 }}>
        {error && <div className="alert-error">{error}</div>}

        {/* Vista de cámara en vivo */}
        {modo === "camara" && (
          <div className="camara-box">
            <video ref={videoRef} autoPlay playsInline className="camara-video" />
            <div className="d-flex gap-2 mt-3">
              <button
                type="button"
                className="btn-login-dorado flex-grow-1"
                onClick={capturarFoto}
              >
                Capturar foto
              </button>
              <button
                type="button"
                className="btn-ghost"
                onClick={cancelarCamara}
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Sin foto todavía y sin cámara abierta: mostrar las 2 opciones */}
        {modo !== "camara" && !previsualizacion && (
          <div className="foto-opciones">
            <input
              ref={inputFotoRef}
              type="file"
              accept="image/*"
              onChange={manejarSeleccionArchivo}
              id="input-foto"
              hidden
            />
                        <label htmlFor="input-foto" className="foto-opcion-btn">
              <svg
                className="foto-opcion-icono"
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
              Subir foto
            </label>

            <button
              type="button"
              className="foto-opcion-btn"
              onClick={abrirCamara}
            >
              <svg
                className="foto-opcion-icono"
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M4 8a2 2 0 0 1 2-2h1.2l.9-1.5A1 1 0 0 1 9 4h6a1 1 0 0 1 .9.5L16.8 6H18a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <circle cx="12" cy="13" r="3.2" stroke="currentColor" strokeWidth="1.5" />
              </svg>
              Tomar foto ahora
            </button>
           </div>
        )}

        {/* Foto ya lista (subida o capturada) */}
        {previsualizacion && (
          <div className="foto-preview">
            <img src={previsualizacion} alt="Tu foto" />
            <button type="button" className="btn-ghost mt-2" onClick={quitarFoto}>
              Cambiar foto
            </button>
          </div>
        )}

        <canvas ref={canvasRef} style={{ display: "none" }} />

        <form onSubmit={manejarEnvio} className="mt-3">
          <div className="field">
            <label>Algo más que quieras contarnos (opcional)</label>
            <textarea
              className="form-control"
              rows={2}
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              placeholder="Ej: me gusta el estilo clásico, o quiero algo bajo de mantenimiento"
            />
          </div>

          <button
            type="submit"
            className="btn-login-dorado w-100"
            disabled={cargando || !archivo}
          >
            {cargando ? "Analizando tu foto..." : "Obtener recomendación"}
          </button>
        </form>
      </div>

      {respuesta && (
        <div className="panel">
          <h4 style={{ fontSize: "1.05rem" }}>Tu recomendación</h4>
          <p className="recommendation-text">{respuesta}</p>
        </div>
      )}
    </div>
  );
}