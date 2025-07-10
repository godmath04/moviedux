const express = require("express");
const router = express.Router();
const axios = require("axios");
//Seguridad al jwt
const jwt = require("jsonwebtoken");
require("dotenv").config();

// ✅ Middleware para validar token y rol de Administrador
const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Token no proporcionado" });

  try {
    const decoded = jwt.decode(token);
    const roles = decoded?.realm_access?.roles || [];

    if (!roles.includes("Administrador")) {
      return res
        .status(403)
        .json({ error: "Acceso denegado: no eres administrador" });
    }

    next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido" });
  }
};

router.post("/users", verifyAdmin, async (req, res) => {
  const { username, email, password, role = "Usuario" } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "Faltan campos requeridos." });
  }

  try {
    // 1. Obtener token del cliente confidencial
    const tokenResponse = await axios.post(
      `${process.env.KEYCLOAK_BASE_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/token`,
      new URLSearchParams({
        grant_type: "client_credentials",
        client_id: process.env.KEYCLOAK_CLIENT_ID,
        client_secret: process.env.KEYCLOAK_CLIENT_SECRET,
      })
    );

    const adminToken = tokenResponse.data.access_token;

    // 2. Crear usuario en Keycloak
    await axios.post(
      `${process.env.KEYCLOAK_BASE_URL}/admin/realms/${process.env.KEYCLOAK_REALM}/users`,
      {
        username,
        email,
        enabled: true,
        emailVerified: true,
        credentials: [
          {
            type: "password",
            value: password,
            temporary: false,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    // 3. Obtener el ID del usuario recién creado
    const userList = await axios.get(
      `${process.env.KEYCLOAK_BASE_URL}/admin/realms/${process.env.KEYCLOAK_REALM}/users?username=${username}`,
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      }
    );

    const userId = userList.data[0]?.id;
    if (!userId)
      return res.status(500).json({
        error: "Usuario creado, pero no encontrado para asignar rol.",
      });

    // 4. Buscar el rol especificado (Usuario o Administrador)
    const roles = await axios.get(
      `${process.env.KEYCLOAK_BASE_URL}/admin/realms/${process.env.KEYCLOAK_REALM}/roles`,
      {
        headers: { Authorization: `Bearer ${adminToken}` },
      }
    );

    const targetRole = roles.data.find((r) => r.name === role);
    if (!targetRole)
      return res.status(400).json({ error: `Rol "${role}" no encontrado.` });

    // 5. Asignar el rol
    await axios.post(
      `${process.env.KEYCLOAK_BASE_URL}/admin/realms/${process.env.KEYCLOAK_REALM}/users/${userId}/role-mappings/realm`,
      [targetRole],
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return res
      .status(201)
      .json({ message: `Usuario creado con rol ${role} ✅` });
  } catch (err) {
    console.error("Error al crear usuario:", err.response?.data || err.message);
    return res.status(500).json({ error: "No se pudo crear el usuario." });
  }
});

//Endpoint para ver la lista de usuarios
router.get("/users-list", verifyAdmin, async (req, res) => {
  try {
    // 1. Obtener token confidencial
    const tokenResponse = await axios.post(
      `${process.env.KEYCLOAK_BASE_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/token`,
      new URLSearchParams({
        grant_type: "client_credentials",
        client_id: process.env.KEYCLOAK_CLIENT_ID,
        client_secret: process.env.KEYCLOAK_CLIENT_SECRET,
      })
    );

    const adminToken = tokenResponse.data.access_token;

    // 2. Obtener todos los usuarios
    const usersResponse = await axios.get(
      `${process.env.KEYCLOAK_BASE_URL}/admin/realms/${process.env.KEYCLOAK_REALM}/users`,
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      }
    );

    const users = usersResponse.data;

    // 3. Filtrar usuarios con rol "Administrador" o "Usuario"
    const result = [];

    for (const user of users) {
      const rolesResponse = await axios.get(
        `${process.env.KEYCLOAK_BASE_URL}/admin/realms/${process.env.KEYCLOAK_REALM}/users/${user.id}/role-mappings/realm`,
        {
          headers: { Authorization: `Bearer ${adminToken}` },
        }
      );

      const roles = rolesResponse.data.map((r) => r.name);

      if (roles.includes("Administrador") || roles.includes("Usuario")) {
        result.push({
          id: user.id,
          username: user.username,
          email: user.email,
          roles,
        });
      }
    }

    return res.json(result);
  } catch (err) {
    console.error(
      "Error al obtener lista de usuarios:",
      err.response?.data || err.message
    );
    return res.status(500).json({ error: "Error al obtener usuarios" });
  }
});

module.exports = router;
