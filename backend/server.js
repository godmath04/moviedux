const express = require("express");
const cors = require("cors");
const app = express();
const moviesRoutes = require("./routes/movies");

app.use(cors());
app.use(express.json());

app.use("/api/movies", moviesRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
