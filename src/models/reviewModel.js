import { query } from "./db.js"

export async function getReviewsByVehicle(vehicleId) {
  const result = await query(
    `SELECT r.id, r.rating, r.comment, r.created_at, r.user_id, u.name
     FROM reviews r
     JOIN users u ON r.user_id = u.id
     WHERE r.vehicle_id = $1
     ORDER BY r.created_at DESC`,
    [vehicleId]
  )
  return result.rows
}

export async function getReviewsByUser(userId) {
  const result = await query(
    `SELECT r.id, r.rating, r.comment, r.created_at, r.vehicle_id, v.title AS vehicle_title
     FROM reviews r
     JOIN vehicles v ON r.vehicle_id = v.id
     WHERE r.user_id = $1
     ORDER BY r.created_at DESC`,
    [userId]
  )
  return result.rows
}

export async function getAllReviews() {
  const result = await query(
    `SELECT r.id, r.rating, r.comment, r.created_at, r.vehicle_id,
            u.name AS reviewer_name, v.title AS vehicle_title
     FROM reviews r
     JOIN users u ON r.user_id = u.id
     JOIN vehicles v ON r.vehicle_id = v.id
     ORDER BY r.created_at DESC`
  )
  return result.rows
}

export async function getReviewById(id) {
  const result = await query(
    `SELECT r.id, r.rating, r.comment, r.user_id, r.vehicle_id, v.title AS vehicle_title
     FROM reviews r
     JOIN vehicles v ON r.vehicle_id = v.id
     WHERE r.id = $1`,
    [id]
  )
  return result.rows[0] || null
}

export async function createReview(userId, vehicleId, rating, comment) {
  await query(
    "INSERT INTO reviews (user_id, vehicle_id, rating, comment) VALUES ($1, $2, $3, $4)",
    [userId, vehicleId, rating, comment]
  )
}

export async function updateReview(id, rating, comment) {
  await query(
    "UPDATE reviews SET rating = $1, comment = $2 WHERE id = $3",
    [rating, comment, id]
  )
}

export async function deleteReview(id) {
  await query("DELETE FROM reviews WHERE id = $1", [id])
}