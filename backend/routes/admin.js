const express = require("express");
const router = express.Router();
const axios = require("axios");
//Seguridad al jwt
const jwt = require("jsonwebtoken");
//Desencriptar
const KmsService = require("../services/kmsService");
const kms = new KmsService(process.env.KMS_CREDENTIALS_PATH);

require("dotenv").config();

// ✅ Middleware para validar token y rol de Administrador
const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Token no proporcionado" });

  try {
    console.log("🔐 TOKEN:", token);
    const decoded = jwt.decode(token);
    console.log("🔎 PAYLOAD:", JSON.stringify(decoded, null, 2));
    const roles = decoded?.realm_access?.roles || [];

    if (!roles.includes("Administrador")) {
      return res
        .status(403)
        .json({ error: "Acceso denegado: no eres administrador" });
    }

    next();
  } catch (err) {
    console.error("Error al verificar token de administrador:", err);
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
          enabled: user.enabled,
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

//Deshabilitar usuarios
// PATCH: Deshabilitar usuario por ID
router.patch("/disable-user/:id", verifyAdmin, async (req, res) => {
  const userId = req.params.id;

  try {
    // Obtener token de cliente confidencial
    const tokenResponse = await axios.post(
      `${process.env.KEYCLOAK_BASE_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/token`,
      new URLSearchParams({
        grant_type: "client_credentials",
        client_id: process.env.KEYCLOAK_CLIENT_ID,
        client_secret: process.env.KEYCLOAK_CLIENT_SECRET,
      })
    );

    const adminToken = tokenResponse.data.access_token;

    // Deshabilitar el usuario
    await axios.put(
      `${process.env.KEYCLOAK_BASE_URL}/admin/realms/${process.env.KEYCLOAK_REALM}/users/${userId}`,
      { enabled: false },
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return res.json({ message: "Usuario deshabilitado correctamente ✅" });
  } catch (err) {
    console.error(
      "Error al deshabilitar usuario:",
      err.response?.data || err.message
    );
    return res
      .status(500)
      .json({ error: "No se pudo deshabilitar el usuario" });
  }
});

// PATCH: Habilitar usuario por ID
router.patch("/enable-user/:id", verifyAdmin, async (req, res) => {
  const userId = req.params.id;

  try {
    const tokenResponse = await axios.post(
      `${process.env.KEYCLOAK_BASE_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/token`,
      new URLSearchParams({
        grant_type: "client_credentials",
        client_id: process.env.KEYCLOAK_CLIENT_ID,
        client_secret: process.env.KEYCLOAK_CLIENT_SECRET,
      })
    );

    const adminToken = tokenResponse.data.access_token;

    await axios.put(
      `${process.env.KEYCLOAK_BASE_URL}/admin/realms/${process.env.KEYCLOAK_REALM}/users/${userId}`,
      { enabled: true },
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return res.json({ message: "Usuario habilitado correctamente ✅" });
  } catch (err) {
    console.error(
      "Error al habilitar usuario:",
      err.response?.data || err.message
    );
    return res.status(500).json({ error: "No se pudo habilitar el usuario" });
  }
});

//Obtener el articulo cifrado desde BlogCore el proyecto
// Obtener un artículo cifrado desde BlogCore
router.get("/obtener-articulo-cifrado/:id", async (req, res) => {
  const { id } = req.params;
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token no proporcionado" });
  }

  try {
    // Decodificar el token para verificar el rol
    const decoded = jwt.decode(token);
    const roles = decoded?.realm_access?.roles || [];

    if (!roles.includes("GestorDeTickets")) {
      return res
        .status(403)
        .json({ error: "Acceso denegado: rol insuficiente" });
    }

    const blogCoreBaseUrl = "http://localhost:5055";
    const url = `${blogCoreBaseUrl}/Admin/Articulos/ObtenerArticuloCifrado?id=${id}`;
    console.log("Llamando a:", url);

    const response = await axios.get(url, {
      headers: {
        Authorization: authHeader, // reenvía el mismo token del frontend
      },
    });

    return res.json(response.data);
  } catch (err) {
    console.error(
      "Error al consumir servicio cifrado:",
      err.response?.data || err.message
    );
    return res
      .status(500)
      .json({ error: "No se pudo obtener el artículo cifrado" });
  }
});

router.post("/desencriptar-articulo", verifyAdmin, async (req, res) => {
  const { contenidoCifrado } = req.body;

  if (!contenidoCifrado) {
    return res.status(400).json({ error: "Contenido cifrado requerido" });
  }

  try {
    const contenidoPlano = await kms.desencriptar(contenidoCifrado);
    return res.json({ contenidoPlano });
  } catch (err) {
    console.error("Error al desencriptar:", err.message);
    return res.status(500).json({ error: "Fallo al desencriptar contenido" });
  }
});

module.exports = router;
