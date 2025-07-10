// components/UserList.js
import React, { useEffect, useState } from "react";
import "../styles.css";

export default function UserList({ token }) {
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState("");

  const cargarUsuarios = () => {
    fetch("http://localhost:5000/api/admin/users-list", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok)
          throw new Error("Acceso denegado o error al obtener usuarios");
        return res.json();
      })
      .then((data) => {
        setUsuarios(data);
      })
      .catch((err) => {
        console.error(err);
        setError("No se pudo obtener la lista de usuarios.");
      });
  };

  useEffect(() => {
    cargarUsuarios();
  }, [token]);

  const deshabilitarUsuario = (id) => {
    if (!window.confirm("¿Estás seguro de deshabilitar este usuario?")) return;

    fetch(`http://localhost:5000/api/admin/disable-user/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al deshabilitar");
        alert("Usuario deshabilitado ✅");
        cargarUsuarios(); // recargar usuarios
      })
      .catch((err) => {
        console.error(err);
        alert("❌ No se pudo deshabilitar el usuario.");
      });
  };

  //Habilitar usuario
  const habilitarUsuario = (id) => {
    if (!window.confirm("¿Estás seguro de habilitar este usuario?")) return;

    fetch(`http://localhost:5000/api/admin/enable-user/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al habilitar");
        alert("Usuario habilitado ✅");
        cargarUsuarios();
      })
      .catch((err) => {
        console.error(err);
        alert("❌ No se pudo habilitar el usuario.");
      });
  };

  return (
    <div className="user-list">
      <h2>Lista de Usuarios</h2>
      {error && <p className="error">{error}</p>}
      <table>
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Email</th>
            <th>Roles</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id}>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>
                {u.roles
                  .filter((r) => r === "Administrador" || r === "Usuario")
                  .join(", ")}
              </td>
              <td>
                {u.enabled ? (
                  <button onClick={() => deshabilitarUsuario(u.id)}>
                    Deshabilitar
                  </button>
                ) : (
                  <button onClick={() => habilitarUsuario(u.id)}>
                    Habilitar
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
