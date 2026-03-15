import express from "express"
import dotenv from "dotenv"
import { query } from "./src/models/db.js"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.set("view engine", "ejs")
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

/* HOME PAGE */
app.get("/", async (req, res) => {
  try {
    const result = await query("SELECT * FROM vehicles")
    res.render("vehicles", { vehicles: result.rows })
  } catch (error) {
    console.error(error)
    res.send("Database error")
  }
})

/* VEHICLE LIST PAGE */
app.get("/vehicles", async (req, res) => {
  try {
    const result = await query("SELECT * FROM vehicles")
    res.render("vehicles", { vehicles: result.rows })
  } catch (error) {
    console.error(error)
    res.send("Database error")
  }
})

/* VEHICLE DETAIL PAGE */
app.get("/vehicles/:id", async (req, res) => {
  try {
    const id = req.params.id
    const result = await query(
      "SELECT * FROM vehicles WHERE id = $1",
      [id]
    )
    res.render("vehicle", { vehicle: result.rows[0] })
  } catch (error) {
    console.error(error)
    res.send("Database error")
  }
})

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
