// components/UserList.js
import React, { useEffect, useState } from "react";
import "../styles.css";

export default function UserList({ token }) {
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
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
  }, [token]);

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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
