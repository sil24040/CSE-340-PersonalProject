import { query } from "./db.js"

export async function getAllCategories() {
  const result = await query("SELECT id, name FROM categories ORDER BY id")
  return result.rows
}

export async function createCategory(name) {
  await query("INSERT INTO categories (name) VALUES ($1)", [name])
}

export async function updateCategory(id, name) {
  await query("UPDATE categories SET name = $1 WHERE id = $2", [name, id])
}

export async function deleteCategory(id) {
  await query("UPDATE vehicles SET category_id = NULL WHERE category_id = $1", [id])
  await query("DELETE FROM categories WHERE id = $1", [id])
}