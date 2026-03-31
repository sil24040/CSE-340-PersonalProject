import { query } from "./db.js"

export async function getAllVehicles() {
  const result = await query("SELECT * FROM vehicles ORDER BY id")
  return result.rows
}

export async function getVehicleById(id) {
  const result = await query("SELECT * FROM vehicles WHERE id = $1", [id])
  return result.rows[0] || null
}

export async function createVehicle(categoryId, title, description, price, available) {
  await query(
    `INSERT INTO vehicles (category_id, title, description, price, available)
     VALUES ($1, $2, $3, $4, $5)`,
    [categoryId || null, title, description || null, price, available]
  )
}

export async function updateVehicle(id, categoryId, title, description, price, available) {
  await query(
    `UPDATE vehicles
     SET category_id = $1, title = $2, description = $3, price = $4, available = $5
     WHERE id = $6`,
    [categoryId || null, title, description || null, price, available, id]
  )
}

export async function updateVehicleDetails(id, description, price, available) {
  await query(
    "UPDATE vehicles SET description = $1, price = $2, available = $3 WHERE id = $4",
    [description || null, price, available, id]
  )
}

export async function deleteVehicle(id) {
  await query("DELETE FROM vehicles WHERE id = $1", [id])
}