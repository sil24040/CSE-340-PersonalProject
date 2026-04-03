import express from "express"
import dotenv from "dotenv"
import session from "express-session"

import authRoutes from "./src/routes/authRoutes.js"
import vehicleRoutes from "./src/routes/vehicleRoutes.js"
import reviewRoutes from "./src/routes/reviewRoutes.js"
import serviceRoutes from "./src/routes/serviceRoutes.js"
import employeeRoutes from "./src/routes/employeeRoutes.js"
import ownerRoutes from "./src/routes/ownerRoutes.js"
import contactRoutes from "./src/routes/contactRoutes.js"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

/* ─── VIEW ENGINE ─── */
app.set("view engine", "ejs")

/* ─── BODY PARSING ─── */
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

/* ─── STATIC FILES ─── */
app.use(express.static("public"))

/* ─── SESSION ─── */
app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
)

/* ─── CURRENT USER LOCAL ─── */
app.use((req, res, next) => {
  res.locals.currentUser = req.session.user || null
  next()
})

/* ─── ROUTES ─── */
app.get("/", (req, res) => res.redirect("/vehicles"))
app.get("/health", (req, res) => res.send("OK"))

app.use("/", authRoutes)
app.use("/vehicles", vehicleRoutes)
app.use("/reviews", reviewRoutes)
app.use("/requests", serviceRoutes)
app.use("/employee", employeeRoutes)
app.use("/owner", ownerRoutes)
app.use("/contact", contactRoutes)

/* ─── 404 HANDLER ─── */
app.use((req, res) => {
  res.status(404).render("error", { message: "Page not found." })
})

/* ─── GLOBAL ERROR HANDLER ─── */
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err)
  res.status(500).render("error", {
    message:
      process.env.NODE_ENV === "production"
        ? "Something went wrong. Please try again later."
        : err.message,
  })
})

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})