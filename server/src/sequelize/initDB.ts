import { connectSequelize } from "../sequelize/connect.js";
import Assets from "../sequelize/models/assets.js";
import Sequelize from "sequelize";

const initializeDatabase = async () => {
  try {
    console.log("🔄 Initializing database...");

    // Connect to database
    const sequelize = connectSequelize();

    // Initialize models
    const db = {
      Assets: Assets(sequelize, Sequelize.DataTypes),
      sequelize: sequelize,
      Sequelize: Sequelize,
    };

    // Test connection
    await sequelize.authenticate();
    console.log("✅ Database connection established successfully.");

    // Sync all models (create tables)
    await sequelize.sync({ force: false }); // Set force: true to drop existing tables
    console.log("✅ Database tables synchronized successfully.");

    // Close connection
    await sequelize.close();
    console.log("✅ Database initialization completed!");
  } catch (error) {
    console.error("❌ Unable to initialize database:", error);
    process.exit(1);
  }
};

// Run the initialization
initializeDatabase();
