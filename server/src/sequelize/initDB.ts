import { connectSequelize } from "../sequelize/connect.js";
import Assets from "../sequelize/models/assets.js";
import AssetPriceHistory from "../sequelize/models/assetPriceHistory.js";
import Sequelize from "sequelize";

const initializeDatabase = async () => {
  try {
    console.log("🔄 Initializing database...");

    // Connect to database
    const sequelize = connectSequelize();

    // Initialize models
    const db = {
      Assets: Assets(sequelize, Sequelize.DataTypes),
      AssetPriceHistory: AssetPriceHistory(sequelize, Sequelize.DataTypes),
      sequelize: sequelize,
    };

    // Establish model associations
    db.Assets.hasMany(db.AssetPriceHistory, {
      foreignKey: "assetId",
      as: "priceHistory",
    });
    db.AssetPriceHistory.belongsTo(db.Assets, {
      foreignKey: "assetId",
      as: "asset",
    });

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
