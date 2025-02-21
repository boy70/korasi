import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,

  waitForConnections: true,
  connectionLimit: 10,
  connectTimeout: 60000, // Increased from default 10000 to 60000 (60 seconds)
  queueLimit: 0
});

export async function query(sql: string, params?: any[]) {
  try {
    const connection = await pool.getConnection();
    try {
      const [results] = await connection.execute(sql, params);
      return results;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}
