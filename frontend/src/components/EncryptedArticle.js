// components/EncryptedArticle.js
import React, { useState } from "react";
import axios from "axios";

export default function EncryptedArticle({ token }) {
  const [id, setId] = useState("");
  const [articulo, setArticulo] = useState(null);
  //Para la desincreptacion
  const [contenidoPlano, setContenidoPlano] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    //Reiniciar si se consulta otro artículo
    setContenidoPlano(null);

    fetch(`http://localhost:5000/api/admin/obtener-articulo-cifrado/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener el artículo");
        return res.json();
      })
      .then((data) => {
        console.log("🔍 Respuesta completa:", data); // 👈 Agregado
        setArticulo(data);
        setError("");
      })
      .catch((err) => {
        console.error(err);
        setError("❌ No se pudo obtener el artículo cifrado.");
        setArticulo(null);
      });
  };

  const handleDesencriptar = async () => {
    if (!articulo?.contenidoCifrado) return;

    try {
      const response = await axios.post(
        "http://localhost:5000/api/admin/desencriptar-articulo",
        { contenidoCifrado: articulo.contenidoCifrado },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setContenidoPlano(response.data.contenidoPlano);
    } catch (err) {
      console.error(err);
      setError("❌ No se pudo desencriptar el contenido.");
    }
  };

  return (
    <div className="encrypted-article">
      <h2>Consultar artículo cifrado</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="ID del artículo"
          required
        />
        <button type="submit">Consultar</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {articulo && (
        <div className="result">
          <p>
            <strong>ID:</strong> {articulo.id}
          </p>
          <p>
            <strong>Nombre:</strong> {articulo.nombre}
          </p>
          <p>
            <strong>Contenido cifrado:</strong>
          </p>
          <pre
            style={{
              background: "#ffffff",
              color: "#000000",
              padding: "10px",
              overflow: "auto",
              border: "1px solid #ccc",
            }}
          >
            {articulo.contenidoCifrado}
          </pre>

          <button onClick={handleDesencriptar} style={{ marginTop: "10px" }}>
            Contenido Descifrado
          </button>

          {contenidoPlano && (
            <div>
              <p>
                <strong>Contenido descifrado:</strong>
              </p>
              <pre
                style={{
                  background: "#ffffff",
                  color: "#000000",
                  padding: "10px",
                  marginTop: "10px",
                  border: "1px solid #ccc",
                }}
              >
                {contenidoPlano}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
