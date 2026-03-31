import { query } from "./db.js"

export async function createContactMessage(name, email, message) {
  await query(
    "INSERT INTO contact_messages (name, email, message) VALUES ($1, $2, $3)",
    [name, email, message]
  )
}

export async function getAllContactMessages() {
  const result = await query(
    "SELECT id, name, email, message, created_at FROM contact_messages ORDER BY created_at DESC"
  )
  return result.rows
}