import { query } from "./db.js"

export async function findUserByEmail(email) {
  const result = await query(
    "SELECT id, name, email, password, role FROM users WHERE email = $1",
    [email]
  )
  return result.rows[0] || null
}

export async function findUserById(id) {
  const result = await query(
    "SELECT id, name, email, password, role FROM users WHERE id = $1",
    [id]
  )
  return result.rows[0] || null
}

export async function createUser(name, email, hashedPassword) {
  const result = await query(
    `INSERT INTO users (name, email, password, role)
     VALUES ($1, $2, $3, 'user')
     RETURNING id, name, email, role`,
    [name, email, hashedPassword]
  )
  return result.rows[0]
}

export async function updateUser(id, name, email, hashedPassword) {
  await query(
    "UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4",
    [name, email, hashedPassword, id]
  )
}

export async function getAllUsers() {
  const result = await query("SELECT id, name, email, role FROM users ORDER BY id")
  return result.rows
}

export async function updateUserRole(id, role) {
  await query("UPDATE users SET role = $1 WHERE id = $2", [role, id])
}