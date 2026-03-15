import pg from "pg"
import fs from "fs"
import dotenv from "dotenv"

dotenv.config()

const { Pool } = pg

const pool = new Pool({
  connectionString: process.env.DB_URL,
  ssl: {
    rejectUnauthorized: false,
    // only try to load the certificate file if it exists
    ca: fs.existsSync("./bin/byuicse-psql-cert.pem")
      ? fs.readFileSync("./bin/byuicse-psql-cert.pem").toString()
      : undefined
  }
})

export const query = (text, params) => pool.query(text, params)
