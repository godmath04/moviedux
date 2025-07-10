// UserForm.js
import React, { useState } from "react";
import "../styles.css";

export default function UserForm({ token }) {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "Usuario", // por defecto
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://localhost:5000/api/admin/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    })
      .then((res) => {
        if (res.ok) {
          alert("✅ Usuario creado exitosamente");
        } else {
          alert("❌ Error al crear usuario");
        }
      })
      .catch(() => alert("❌ Error en la conexión"));
  };

  return (
    <div className="user-form">
      <h2>Crear nuevo usuario</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="username"
          placeholder="Nombre de usuario"
          value={form.username}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          placeholder="Correo electrónico"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          placeholder="Contraseña"
          type="password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="Usuario">Usuario</option>
          <option value="Administrador">Administrador</option>
        </select>
        <button type="submit">Crear Usuario</button>
      </form>
    </div>
  );
}
