// server.js
import express from "express";
import dotenv from "dotenv";
import path from "path";
import client from "./src/models/db.js"; // see db.js below
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// set view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// static files
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// helper to ensure DB connected (connect once)
let dbConnected = false;
async function ensureDb() {
  if (!dbConnected) {
    await client.connect();
    dbConnected = true;
  }
}

// Home: simple redirect or info
app.get("/", (req, res) => {
  res.redirect("/vehicles");
});

/* --- Vehicles list (rendered page) --- */
app.get("/vehicles", async (req, res) => {
  try {
    await ensureDb();
    const result = await client.query("SELECT * FROM vehicles ORDER BY id");
    res.render("vehicles", { vehicles: result.rows });
  } catch (err) {
    console.error("GET /vehicles error:", err);
    res.status(500).send("Database error");
  }
});

/* --- Vehicle details (rendered page) --- */
app.get("/vehicles/:id", async (req, res) => {
  try {
    await ensureDb();
    const { id } = req.params;
    const result = await client.query("SELECT * FROM vehicles WHERE id = $1", [id]);
    if (!result.rows.length) return res.status(404).send("Vehicle not found");
    res.render("vehicle", { vehicle: result.rows[0] });
  } catch (err) {
    console.error("GET /vehicles/:id error:", err);
    res.status(500).send("Database error");
  }
});

/* --- JSON API endpoints (useful for frontend) --- */
app.get("/api/vehicles", async (req, res) => {
  try {
    await ensureDb();
    const result = await client.query("SELECT * FROM vehicles ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    console.error("GET /api/vehicles error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

app.get("/api/categories", async (req, res) => {
  try {
    await ensureDb();
    const result = await client.query("SELECT * FROM categories ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    console.error("GET /api/categories error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

/* --- health check --- */
app.get("/health", (req, res) => res.send("OK"));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});