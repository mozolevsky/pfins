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
      { id: 1, type: "Cash", value: 1000 },
      { id: 2, type: "Stock", value: 2000 },
      { id: 3, type: "Real Estate", value: 3000 },
      { id: 4, type: "Crypto", value: 4000 },
    ];

    // Insert seed data
    for (const asset of seedData) {
      // Exclude `id`, let the DB auto-generate it if needed (if model expects string)
      const { id, ...assetData } = asset;
      await db.Assets.create(assetData);
      console.log(`✅ Created asset: ${asset.type} - $${asset.value}`);
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
