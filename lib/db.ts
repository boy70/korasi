import mysql from "mysql2/promise"
import { config } from "./config"

const pool = mysql.createPool({
  host: config.db.host,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
  connectionLimit: 10,
})

export async function query(sql: string, values?: any[]) {
  try {
    const [results] = await pool.execute(sql, values)
    return results
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

