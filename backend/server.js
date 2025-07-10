const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

// Rutas
const moviesRoutes = require("./routes/movies");
const adminRoutes = require("./routes/admin");

app.use("/api/admin", adminRoutes);
app.use("/api/movies", moviesRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
