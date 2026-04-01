import pg from "pg"
import fs from "fs"
import dotenv from "dotenv"

dotenv.config()

const { Pool } = pg

const certPath = "./bin/byuicse-psql-cert.pem"

let sslConfig = false

if (fs.existsSync(certPath)) {
  sslConfig = {
    rejectUnauthorized: false,
    ca: fs.readFileSync(certPath).toString()
  }
}

const pool = new Pool({
  connectionString: process.env.DB_URL,
  ssl: sslConfig,
  max: 3,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

export const query = (text, params) => pool.query(text, params)
export { pool }