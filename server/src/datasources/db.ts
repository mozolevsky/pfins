import Sequelize from 'sequelize'
import Assets from '../sequelize/models/assets'
import AssetPriceHistory from '../sequelize/models/assetPriceHistory'
import { connectSequelize } from '../sequelize/connect'

// Shared database instance with all models
class Database {
  private static instance: Database | null = null
  public sequelize: Sequelize.Sequelize
  public Assets: ReturnType<typeof Assets>
  public AssetPriceHistory: ReturnType<typeof AssetPriceHistory>

  private constructor() {
    // Create single shared connection
    this.sequelize = connectSequelize()

    // Initialize all models with the shared connection
    this.Assets = Assets(this.sequelize, Sequelize.DataTypes)
    this.AssetPriceHistory = AssetPriceHistory(this.sequelize, Sequelize.DataTypes)

    // Establish model associations
    this.Assets.hasMany(this.AssetPriceHistory, {
      foreignKey: "assetId",
      as: "priceHistory",
    })
    this.AssetPriceHistory.belongsTo(this.Assets, {
      foreignKey: "assetId",
      as: "asset",
    })

    // Ensure tables exist
    this.ensureTablesExist()
  }

  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database()
    }
    return Database.instance
  }

  async ensureTablesExist(): Promise<void> {
    try {
      await this.sequelize.sync({ force: false })
      console.log('✅ Database tables synchronized successfully.')
    } catch (error) {
      console.error('❌ Error synchronizing database tables:', error)
    }
  }
}

// Export the singleton instance
export default Database.getInstance()
