import { getAllVehicles, getVehiclesByCategory, getVehicleById, getVehicleImages } from "../models/vehicleModel.js"
import { getReviewsByVehicle } from "../models/reviewModel.js"
import { getAllCategories } from "../models/categoryModel.js"

export async function getVehicles(req, res, next) {
  try {
    const { category } = req.query
    const categories = await getAllCategories()

    let vehicles
    let selectedCategory = null

    if (category) {
      const categoryId = Number(category)
      vehicles = await getVehiclesByCategory(categoryId)
      selectedCategory = categories.find(c => c.id === categoryId) || null
    } else {
      vehicles = await getAllVehicles()
    }

    res.render("vehicles", { vehicles, categories, selectedCategory })
  } catch (err) {
    next(err)
  }
}

export async function getVehicleDetail(req, res, next) {
  try {
    const id = Number(req.params.id)
    if (!Number.isInteger(id) || id <= 0) return res.status(400).send("Invalid vehicle id")

    const vehicle = await getVehicleById(id)
    if (!vehicle) return res.status(404).send("Vehicle not found")

    const [reviews, images] = await Promise.all([
      getReviewsByVehicle(id),
      getVehicleImages(id),
    ])

    res.render("vehicle", { vehicle, reviews, images })
  } catch (err) {
    next(err)
  }
}