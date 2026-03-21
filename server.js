import express from "express"
import dotenv from "dotenv"
import session from "express-session"
import bcrypt from "bcrypt"
import { query } from "./src/models/db.js"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.set("view engine", "ejs")
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev-secret",
    resave: false,
    saveUninitialized: false,
  })
)

app.use((req, res, next) => {
  res.locals.currentUser = req.session.user || null
  next()
})

function requireAuth(req, res, next) {
  if (!req.session.user) {
    return res.redirect("/login")
  }
  next()
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.session.user) {
      return res.redirect("/login")
    }

    if (!roles.includes(req.session.user.role)) {
      return res.send("Access denied")
    }

    next()
  }
}

/* HOME PAGE */
app.get("/", (req, res) => {
  res.redirect("/vehicles")
})

/* HEALTH CHECK */
app.get("/health", (req, res) => {
  res.send("OK")
})

/* REGISTER PAGE */
app.get("/register", (req, res) => {
  res.render("register", { error: null })
})

app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).render("register", {
        error: "Please fill in all fields.",
      })
    }

    const emailLower = email.toLowerCase()

    const existingUser = await query(
      "SELECT id FROM users WHERE email = $1",
      [emailLower]
    )

    if (existingUser.rows.length > 0) {
      return res.status(400).render("register", {
        error: "That email is already used.",
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const result = await query(
      `INSERT INTO users (name, email, password, role)
       VALUES ($1, $2, $3, 'user')
       RETURNING id, name, email, role`,
      [name, emailLower, hashedPassword]
    )

    req.session.user = result.rows[0]
    res.redirect("/vehicles")
  } catch (error) {
    console.error("Register error:", error)
    res.status(500).send("Database error")
  }
})

/* LOGIN PAGE */
app.get("/login", (req, res) => {
  res.render("login", { error: null })
})

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).render("login", {
        error: "Please enter email and password.",
      })
    }

    const result = await query(
      "SELECT id, name, email, password, role FROM users WHERE email = $1",
      [email.toLowerCase()]
    )

    const user = result.rows[0]

    if (!user) {
      return res.status(400).render("login", {
        error: "Invalid email or password.",
      })
    }

    const match = await bcrypt.compare(password, user.password)

    if (!match) {
      return res.status(400).render("login", {
        error: "Invalid email or password.",
      })
    }

    req.session.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    }

    res.redirect("/vehicles")
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).send("Database error")
  }
})

/* LOGOUT */
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login")
  })
})

/* QUICK SESSION TEST */
app.get("/me", requireAuth, (req, res) => {
  res.json(req.session.user)
})

/* VEHICLE LIST PAGE */
app.get("/vehicles", async (req, res) => {
  try {
    const result = await query("SELECT * FROM vehicles ORDER BY id")
    res.render("vehicles", { vehicles: result.rows })
  } catch (error) {
    console.error(error)
    res.send("Database error")
  }
})

/* VEHICLE DETAIL PAGE */
app.get("/vehicles/:id", async (req, res) => {
  try {
    const id = Number(req.params.id)

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).send("Invalid vehicle id")
    }

    const vehicleResult = await query(
      "SELECT * FROM vehicles WHERE id = $1",
      [id]
    )

    const vehicle = vehicleResult.rows[0]
    if (!vehicle) {
      return res.status(404).send("Vehicle not found")
    }

    const reviewResult = await query(
      `SELECT r.id, r.rating, r.comment, r.created_at, u.name
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.vehicle_id = $1
       ORDER BY r.created_at DESC`,
      [id]
    )

    res.render("vehicle", {
      vehicle,
      reviews: reviewResult.rows,
    })
  } catch (error) {
    console.error(error)
    res.send("Database error")
  }
})

/* SUBMIT REVIEW */
app.post("/vehicles/:id/reviews", requireAuth, async (req, res) => {
  try {
    const vehicleId = Number(req.params.id)
    const { rating, comment } = req.body

    if (!rating || !comment) {
      return res.status(400).send("Missing rating or comment")
    }

    await query(
      `INSERT INTO reviews (user_id, vehicle_id, rating, comment)
       VALUES ($1, $2, $3, $4)`,
      [req.session.user.id, vehicleId, rating, comment]
    )

    res.redirect(`/vehicles/${vehicleId}`)
  } catch (error) {
    console.error(error)
    res.send("Database error")
  }
})

/* SUBMIT SERVICE REQUEST */
app.post("/vehicles/:id/request", requireAuth, async (req, res) => {
  try {
    const vehicleId = Number(req.params.id)
    const { description } = req.body

    if (!description) {
      return res.status(400).send("Missing description")
    }

    await query(
      `INSERT INTO service_requests (user_id, vehicle_id, description)
       VALUES ($1, $2, $3)`,
      [req.session.user.id, vehicleId, description]
    )

    res.redirect(`/vehicles/${vehicleId}`)
  } catch (error) {
    console.error(error)
    res.send("Database error")
  }
})

/* EMPLOYEE DASHBOARD */
app.get("/employee", requireRole("employee", "owner"), async (req, res) => {
  try {
    const result = await query(
      `SELECT sr.id, sr.description, sr.status, sr.created_at,
              u.name, v.title
       FROM service_requests sr
       JOIN users u ON sr.user_id = u.id
       JOIN vehicles v ON sr.vehicle_id = v.id
       ORDER BY sr.created_at DESC`
    )

    res.render("employee", { requests: result.rows })
  } catch (error) {
    console.error(error)
    res.send("Database error")
  }
})

/* UPDATE SERVICE REQUEST STATUS */
app.post("/requests/:id/status", requireRole("employee", "owner"), async (req, res) => {
  try {
    const requestId = Number(req.params.id)
    const { status } = req.body

    if (!status) {
      return res.status(400).send("Missing status")
    }

    await query(
      "UPDATE service_requests SET status = $1 WHERE id = $2",
      [status, requestId]
    )

    res.redirect("/employee")
  } catch (error) {
    console.error(error)
    res.send("Database error")
  }
})

/* CONTACT PAGE */
app.get("/contact", (req, res) => {
  res.render("contact")
})

app.post("/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body

    if (!name || !email || !message) {
      return res.status(400).send("Please fill in all fields.")
    }

    await query(
      `INSERT INTO contact_messages (name, email, message)
       VALUES ($1, $2, $3)`,
      [name, email, message]
    )

    res.send("Message sent!")
  } catch (error) {
    console.error(error)
    res.send("Database error")
  }
})

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})