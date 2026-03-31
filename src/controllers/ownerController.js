import { getAllUsers, updateUserRole } from "../models/userModel.js"
import {
  getAllVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} from "../models/vehicleModel.js"
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../models/categoryModel.js"
import { getAllServiceRequests } from "../models/serviceModel.js"
import { query } from "../models/db.js"

export async function getOwnerDashboard(req, res, next) {
  try {
    const [users, categories, vehicles, requests] = await Promise.all([
      getAllUsers(),
      getAllCategories(),
      getAllVehicles(),
      getAllServiceRequests(),
    ])
    res.render("owner", { users, categories, vehicles, requests })
  } catch (err) {
    next(err)
  }
}

export async function postUpdateUserRole(req, res, next) {
  try {
    const userId = Number(req.params.id)
    const { role } = req.body
    const validRoles = ["user", "employee", "owner"]
    if (!validRoles.includes(role)) return res.status(400).send("Invalid role")
    await updateUserRole(userId, role)
    res.redirect("/owner")
  } catch (err) {
    next(err)
  }
}

export async function postDeleteUser(req, res, next) {
  try {
    const userId = Number(req.params.id)
    if (userId === req.session.user.id) {
      return res.status(400).send("You cannot delete your own account.")
    }
    // Delete linked data first to avoid foreign key errors
    await query("DELETE FROM reviews WHERE user_id = $1", [userId])
    await query("DELETE FROM service_requests WHERE user_id = $1", [userId])
    await query("DELETE FROM users WHERE id = $1", [userId])
    res.redirect("/owner")
  } catch (err) {
    next(err)
  }
}

export async function postAddCategory(req, res, next) {
  try {
    const { name } = req.body
    if (!name || !name.trim()) return res.status(400).send("Missing category name")
    await createCategory(name.trim())
    res.redirect("/owner")
  } catch (err) {
    next(err)
  }
}

export async function postEditCategory(req, res, next) {
  try {
    const categoryId = Number(req.params.id)
    const { name } = req.body
    if (!name || !name.trim()) return res.status(400).send("Missing category name")
    await updateCategory(categoryId, name.trim())
    res.redirect("/owner")
  } catch (err) {
    next(err)
  }
}

export async function postDeleteCategory(req, res, next) {
  try {
    const categoryId = Number(req.params.id)
    await deleteCategory(categoryId)
    res.redirect("/owner")
  } catch (err) {
    next(err)
  }
}

export async function postAddVehicle(req, res, next) {
  try {
    const { category_id, title, description, price, available } = req.body
    if (!title || !price) return res.status(400).send("Missing vehicle title or price")
    await createVehicle(
      category_id,
      title.trim(),
      description,
      price,
      available === "true" || available === true
    )
    res.redirect("/owner")
  } catch (err) {
    next(err)
  }
}

export async function postEditVehicle(req, res, next) {
  try {
    const vehicleId = Number(req.params.id)
    const { category_id, title, description, price, available } = req.body
    if (!title || !price) return res.status(400).send("Missing vehicle title or price")
    await updateVehicle(
      vehicleId,
      category_id,
      title.trim(),
      description,
      price,
      available === "true" || available === true
    )
    res.redirect("/owner")
  } catch (err) {
    next(err)
  }
}

export async function postDeleteVehicle(req, res, next) {
  try {
    const vehicleId = Number(req.params.id)
    await deleteVehicle(vehicleId)
    res.redirect("/owner")
  } catch (err) {
    next(err)
  }
}