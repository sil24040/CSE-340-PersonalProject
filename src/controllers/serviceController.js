import {
    createServiceRequest,
    updateServiceStatus,
    updateServiceNotes,
  } from "../models/serviceModel.js"
  
  export async function postServiceRequest(req, res, next) {
    try {
      const vehicleId = Number(req.params.id)
      const { description } = req.body
      if (!description || !description.trim()) return res.status(400).send("Missing description")
      await createServiceRequest(req.session.user.id, vehicleId, description.trim())
      res.redirect(`/vehicles/${vehicleId}`)
    } catch (err) {
      next(err)
    }
  }
  
  export async function postUpdateStatus(req, res, next) {
    try {
      const requestId = Number(req.params.id)
      const { status } = req.body
      const validStatuses = ["Submitted", "In Progress", "Completed"]
      if (!validStatuses.includes(status)) return res.status(400).send("Invalid status")
      await updateServiceStatus(requestId, status)
      res.redirect("/employee")
    } catch (err) {
      next(err)
    }
  }
  
  export async function postUpdateNotes(req, res, next) {
    try {
      const requestId = Number(req.params.id)
      const { notes } = req.body
      await updateServiceNotes(requestId, notes)
      res.redirect("/employee")
    } catch (err) {
      next(err)
    }
  }