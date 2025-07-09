const express = require("express");
const router = express.Router();
const { poolPromise, sql } = require("../db");

// GET /api/movies
router.get("/", async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query("SELECT * FROM Movies");
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/movies
router.post("/", async (req, res) => {
  const { title, description } = req.body;
  try {
    const pool = await poolPromise;
    await pool
      .request()
      .input("title", sql.NVarChar, title)
      .input("description", sql.NVarChar, description)
      .query(
        "INSERT INTO Movies (title, description) VALUES (@title, @description)"
      );

    res.status(201).json({ message: "Película insertada correctamente" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
