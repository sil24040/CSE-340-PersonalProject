import { query } from "./db.js"

export async function getAllServiceRequests() {
  const result = await query(
    `SELECT sr.id, sr.description, sr.status, sr.notes, sr.created_at,
            u.name, v.title
     FROM service_requests sr
     JOIN users u ON sr.user_id = u.id
     JOIN vehicles v ON sr.vehicle_id = v.id
     ORDER BY sr.created_at DESC`
  )
  return result.rows
}

export async function getServiceRequestsByUser(userId) {
  const result = await query(
    `SELECT sr.id, sr.description, sr.status, sr.notes, sr.created_at, v.title
     FROM service_requests sr
     JOIN vehicles v ON sr.vehicle_id = v.id
     WHERE sr.user_id = $1
     ORDER BY sr.created_at DESC`,
    [userId]
  )
  return result.rows
}

export async function createServiceRequest(userId, vehicleId, description) {
  await query(
    "INSERT INTO service_requests (user_id, vehicle_id, description) VALUES ($1, $2, $3)",
    [userId, vehicleId, description]
  )
}

export async function updateServiceStatus(id, status) {
  await query("UPDATE service_requests SET status = $1 WHERE id = $2", [status, id])
}

export async function updateServiceNotes(id, notes) {
  await query("UPDATE service_requests SET notes = $1 WHERE id = $2", [notes || null, id])
}