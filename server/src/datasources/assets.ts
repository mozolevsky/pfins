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

  async getAssets() {
    return this.db.Assets.findAll();
  }
}

export default AssetsDB;
