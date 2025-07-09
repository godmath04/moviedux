import React, { useState } from "react";

export default function AddMovie({ onMovieAdded }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [rating, setRating] = useState("");
  const [image, setImage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://localhost:5000/api/movies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, genre, rating, image }),
    })
      .then((res) => {
        if (res.ok) {
          alert("Película creada con éxito ✅");
          onMovieAdded?.(); // para recargar si es necesario
        } else {
          alert("Error al crear película ❌");
        }
      })
      .catch(() => alert("Error de conexión con el backend ❌"));
  };

  return (
    <div className="form-container">
      <h2>Añadir nueva película</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Descripción"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Género"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Rating (0-10)"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          required
          min={0}
          max={10}
        />
        <input
          type="text"
          placeholder="Nombre del archivo de imagen (ej. matrix.jpg)"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
        <button type="submit">Guardar película</button>
      </form>
    </div>
  );
}
