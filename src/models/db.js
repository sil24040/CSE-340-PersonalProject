// src/models/db.js
import fs from "fs";
import path from "path";
import { Client } from "pg";
import dotenv from "dotenv";
dotenv.config();

const connectionString = process.env.DB_URL;

if (!connectionString) {
  console.error("Missing DB_URL in .env");
  throw new Error("Missing DB_URL in .env");
}

// Optional SSL certificate path (if your host requires a CA)
const sslCertPath = process.env.SSL_CERT_PATH || null;

let clientConfig = {
  connectionString,
};

// If a cert path exists, read file and set ssl options (safe fallback)
if (sslCertPath) {
  try {
    const fullPath = path.resolve(sslCertPath);
    const ca = fs.readFileSync(fullPath).toString();
    clientConfig.ssl = { ca, rejectUnauthorized: true };
    console.log("DB: using SSL certificate from", fullPath);
  } catch (err) {
    console.warn("Could not read SSL_CERT_PATH file:", err.message);
    // fallback to rejectUnauthorized false (less secure)
    clientConfig.ssl = { rejectUnauthorized: false };
  }
} else {
  // If no cert path, try using rejectUnauthorized false so hosted DBs often work
  clientConfig.ssl = { rejectUnauthorized: false };
}

const client = new Client(clientConfig);

export default client;