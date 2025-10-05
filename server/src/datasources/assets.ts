import Sequelize from "sequelize";
import Assets from "../sequelize/models/assets";
import { connectSequelize } from "../sequelize/connect";
import { Asset } from "../types";

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

  async addAsset(asset: Asset) {
    const created = await this.db.Assets.create(asset);
    console.log(`✅ Asset ${asset.type} added successfully.`);
    return created;
  }

  async updateAsset(asset: Asset) {
    await this.db.Assets.update(asset, { where: { id: asset.id } });
    const updated = await this.db.Assets.findByPk(asset.id);
    console.log(`✅ Asset ${asset.type} updated successfully.`);
    return updated;
  }

  async deleteAsset(id: number) {
    await this.db.Assets.destroy({ where: { id } });
    console.log(`✅ Asset ${id} deleted successfully.`);
    return id;
  }

  async getAsset(id: number) {
    return this.db.Assets.findByPk(id);
  }

  async getAssetByType(type: string) {
    return this.db.Assets.findAll({ where: { type } });
  }
}

export default AssetsDB;
