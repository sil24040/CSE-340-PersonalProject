import { createContactMessage } from "../models/contactModel.js"

export function getContact(req, res) {
  res.render("contact", { success: false })
}

export async function postContact(req, res, next) {
  try {
    const { name, email, message } = req.body
    if (!name || !email || !message) return res.status(400).send("Please fill in all fields.")
    await createContactMessage(name.trim(), email.trim(), message.trim())
    res.render("contact", { success: true })
  } catch (err) {
    next(err)
  }
}