import bcrypt from "bcrypt"
import { findUserByEmail, findUserById, createUser, updateUser } from "../models/userModel.js"
import { getServiceRequestsByUser } from "../models/serviceModel.js"
import { getReviewsByUser } from "../models/reviewModel.js"

export function getRegister(req, res) {
  res.render("register", { error: null })
}

export async function postRegister(req, res, next) {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
      return res.status(400).render("register", { error: "Please fill in all fields." })
    }
    const emailLower = email.trim().toLowerCase()
    const existing = await findUserByEmail(emailLower)
    if (existing) {
      return res.status(400).render("register", { error: "That email is already in use." })
    }
    const hashed = await bcrypt.hash(password, 10)
    const user = await createUser(name.trim(), emailLower, hashed)
    req.session.user = user
    res.redirect("/vehicles")
  } catch (err) {
    next(err)
  }
}

export function getLogin(req, res) {
  res.render("login", { error: null })
}

export async function postLogin(req, res, next) {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).render("login", { error: "Please enter email and password." })
    }
    const user = await findUserByEmail(email.trim().toLowerCase())
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).render("login", { error: "Invalid email or password." })
    }
    req.session.user = { id: user.id, name: user.name, email: user.email, role: user.role }
    res.redirect("/vehicles")
  } catch (err) {
    next(err)
  }
}

export function logout(req, res) {
  req.session.destroy(() => res.redirect("/login"))
}

export async function getProfile(req, res, next) {
  try {
    const [serviceRequests, reviews] = await Promise.all([
      getServiceRequestsByUser(req.session.user.id),
      getReviewsByUser(req.session.user.id),
    ])
    res.render("profile", {
      user: req.session.user,
      serviceRequests,
      reviews,
      error: null,
      success: null,
    })
  } catch (err) {
    next(err)
  }
}

export async function postProfile(req, res, next) {
  try {
    const { name, email, currentPassword, newPassword } = req.body
    if (!email || !currentPassword) {
      return res.status(400).render("profile", {
        user: req.session.user,
        serviceRequests: [],
        reviews: [],
        error: "Email and current password are required.",
        success: null,
      })
    }
    const user = await findUserById(req.session.user.id)
    if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
      return res.status(400).render("profile", {
        user: req.session.user,
        serviceRequests: [],
        reviews: [],
        error: "Current password is incorrect.",
        success: null,
      })
    }
    const nameTrimmed = name ? name.trim() : req.session.user.name
    const emailLower = email.trim().toLowerCase()
    let updatedPassword = user.password
    if (newPassword && newPassword.trim() !== "") {
      updatedPassword = await bcrypt.hash(newPassword, 10)
    }
    await updateUser(req.session.user.id, nameTrimmed, emailLower, updatedPassword)
    req.session.user.name = nameTrimmed
    req.session.user.email = emailLower

    const [serviceRequests, reviews] = await Promise.all([
      getServiceRequestsByUser(req.session.user.id),
      getReviewsByUser(req.session.user.id),
    ])
    res.render("profile", {
      user: req.session.user,
      serviceRequests,
      reviews,
      error: null,
      success: "Profile updated successfully!",
    })
  } catch (err) {
    next(err)
  }
}