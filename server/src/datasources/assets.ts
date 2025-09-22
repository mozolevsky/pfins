import Sequelize from "sequelize";
import Assets from "../sequelize/models/assets";
import { connectSequelize } from "../sequelize/connect";

class AssetsDB {
  db: {
    Assets: any;
    sequelize: any;
    Sequelize: any;
  };

  constructor() {
    const database = this.initDB();
    this.db = database;
    this.ensureTablesExist();
  }

  initDB() {
    const sequelize = connectSequelize();

    const db = {
      Assets: Assets(sequelize, Sequelize.DataTypes),
      sequelize: sequelize,
      Sequelize: Sequelize,
    };

    return db;
  }

  async ensureTablesExist() {
    try {
      await this.db.sequelize.sync({ force: false });
      console.log("✅ Database tables synchronized successfully.");
    } catch (error) {
      console.error("❌ Error synchronizing database tables:", error);
    }
  }

  async getAssets() {
    return this.db.Assets.findAll();
  }
}

export default AssetsDB;
