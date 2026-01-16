import { connectSequelize } from "../sequelize/connect.js";
import Assets from "../sequelize/models/assets.js";
import Sequelize from "sequelize";

const seedDatabase = async () => {
  try {
    console.log("🌱 Seeding database...");

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

    // Check if data already exists
    const existingAssets = await db.Assets.findAll();
    if (existingAssets.length > 0) {
      console.log("📋 Database already contains data. Skipping seed.");
      await sequelize.close();
      return;
    }

    // Initial assets seed data
    const seedData = [
      { type: "Cash", value: 1000 },
      { type: "Stock", value: 2000 },
      { type: "Real Estate", value: 3000 },
      { type: "Crypto", value: 4000 },
    ];

    // Insert seed data
    for (const assetData of seedData) {
      // Generate a unique ID for each asset
      const id = Math.random().toString(36).substring(2, 15);
      await db.Assets.create({ ...assetData, id });
      console.log(`✅ Created asset: ${assetData.type} - $${assetData.value}`);
    }

    console.log("🎉 Database seeded successfully!");

    // Close connection
    await sequelize.close();
  } catch (error) {
    console.error("❌ Unable to seed database:", error);
    process.exit(1);
  }
};

// Run the seeding
seedDatabase();
