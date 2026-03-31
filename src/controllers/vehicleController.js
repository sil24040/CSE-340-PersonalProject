import { getAllVehicles, getVehicleById } from "../models/vehicleModel.js"
import { getReviewsByVehicle } from "../models/reviewModel.js"

export async function getVehicles(req, res, next) {
  try {
    const vehicles = await getAllVehicles()
    res.render("vehicles", { vehicles })
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

    const reviews = await getReviewsByVehicle(id)
    res.render("vehicle", { vehicle, reviews })
  } catch (err) {
    next(err)
  }
}