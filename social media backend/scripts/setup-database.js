const { Pool } = require("pg");
require("dotenv").config();

/**
 * Database setup script
 * This script creates the database tables and seeds initial data
 */

const setupDatabase = async () => {
  // Use the same connection logic as the main app
  const config = process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
      }
    : {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
      };

  const pool = new Pool({
    ...config,
    max: 5, // Lower max for setup script
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  });

  try {
    console.log("Setting up database...");

    // Check if users table exists first
    const checkTable = await pool.query(`
			SELECT EXISTS (
				SELECT FROM information_schema.tables 
				WHERE table_schema = 'public' 
				AND table_name = 'users'
			);
		`);

    if (checkTable.rows[0].exists) {
      console.log("Database tables already exist, skipping setup");
      return;
    }

    // Read and execute schema file
    const fs = require("fs");
    const path = require("path");

    const schemaSQL = fs.readFileSync(
      path.join(__dirname, "../sql/schema.sql"),
      "utf8"
    );
    await pool.query(schemaSQL);
    console.log("Database schema created successfully");

    console.log("Database setup completed successfully!");
  } catch (error) {
    console.error("Database setup failed!", error);
    throw error; // Re-throw to let caller handle
  } finally {
    await pool.end();
  }
};

// Run setup if called directly
if (require.main === module) {
  setupDatabase();
}

module.exports = { setupDatabase };
