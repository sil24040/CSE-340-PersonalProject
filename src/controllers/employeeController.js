import { getAllServiceRequests } from "../models/serviceModel.js"
import { getAllVehicles, updateVehicleDetails } from "../models/vehicleModel.js"
import { getAllReviews } from "../models/reviewModel.js"
import { getAllContactMessages } from "../models/contactModel.js"

export async function getEmployeeDashboard(req, res, next) {
  try {
    const [requests, vehicles, reviews, contactMessages] = await Promise.all([
      getAllServiceRequests(),
      getAllVehicles(),
      getAllReviews(),
      getAllContactMessages(),
    ])
    res.render("employee", { requests, vehicles, reviews, contactMessages })
  } catch (err) {
    next(err)
  }
}

export async function postEditVehicle(req, res, next) {
  try {
    const vehicleId = Number(req.params.id)
    const { description, price, available } = req.body
    if (!price) return res.status(400).send("Price is required")
    await updateVehicleDetails(
      vehicleId,
      description,
      price,
      available === "true" || available === true
    )
    res.redirect("/employee")
  } catch (err) {
    next(err)
  }
}