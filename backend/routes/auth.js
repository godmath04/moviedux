// const express = require("express");
// const axios = require("axios");
// const router = express.Router();

// router.post("/login", async (req, res) => {
//   try {
//     const tokenResponse = await axios.post(
//       "http://localhost:8080/realms/CetiaGlassesRealm/protocol/openid-connect/token",
//       new URLSearchParams({
//         client_id: "moviedux-react",
//         client_secret: "2FVkfj5xvCzyqQl4MVzkLXphe21JTqCM",
//         grant_type: "password",
//         username: req.body.username,
//         password: req.body.password,
//       }),
//       {
//         headers: {
//           "Content-Type": "application/x-www-form-urlencoded",
//         },
//       }
//     );

//     res.json(tokenResponse.data);
//   } catch (error) {
//     console.error(
//       "Error al obtener token:",
//       error.response?.data || error.message
//     );
//     res
//       .status(401)
//       .json({ error: "Credenciales inválidas o error en el servidor" });
//   }
// });

// module.exports = router;
