import Sequelize from 'sequelize'
import db from './db'

// Type for price history record
interface PriceHistoryRecord {
  id: number;
  assetId: string;
  price: number;
  timestamp: Date;
}

class PriceHistoryDB {
  private static instance: PriceHistoryDB | null = null

  private constructor() {
    // Use shared database instance
  }

  static getInstance(): PriceHistoryDB {
    if (!PriceHistoryDB.instance) {
      PriceHistoryDB.instance = new PriceHistoryDB()
    }
    return PriceHistoryDB.instance
  }

  /**
   * Get price history for an asset with optional date filtering
   */
  async getPriceHistory(
    assetId: string,
    startDate?: string,
    endDate?: string,
    limit?: number
  ): Promise<PriceHistoryRecord[]> {
    const whereClause: any = { assetId }

    // Add date filtering if provided
    if (startDate || endDate) {
      whereClause.timestamp = {}
      if (startDate) {
        whereClause.timestamp[Sequelize.Op.gte] = new Date(startDate)
      }
      if (endDate) {
        whereClause.timestamp[Sequelize.Op.lte] = new Date(endDate)
      }
    }

    const records = await db.AssetPriceHistory.findAll({
      where: whereClause,
      order: [['timestamp', 'ASC']],
      limit: limit || undefined,
      attributes: ['id', 'assetId', 'price', 'timestamp'],
      raw: true, // Convert Sequelize instances to plain objects
    })

    return records as unknown as PriceHistoryRecord[]
  }

  /**
   * Add a new price record (manual or automatic)
   */
  async addPriceRecord(
    assetId: string,
    price: number,
    timestamp?: string
  ): Promise<PriceHistoryRecord> {
    const recordTimestamp = timestamp ? new Date(timestamp) : new Date()

    const created = await db.AssetPriceHistory.create({
      assetId,
      price,
      timestamp: recordTimestamp,
    })

    console.log(`✅ Price history recorded for asset ${assetId}: ${price} at ${recordTimestamp}`)
    
    // Convert to plain object to avoid spreading issues
    return {
      id: created.id,
      assetId: created.assetId,
      price: created.price,
      timestamp: created.timestamp,
    }
  }

  /**
   * Update an existing price record by id
   */
  async updatePriceRecord(
    id: number,
    price: number,
    timestamp: string
  ): Promise<PriceHistoryRecord> {
    const recordTimestamp = new Date(timestamp)

    const [updatedCount] = await db.AssetPriceHistory.update(
      { price, timestamp: recordTimestamp },
      { where: { id } }
    )

    if (!updatedCount) {
      throw new Error(`Price record ${id} not found`)
    }

    const updated = await db.AssetPriceHistory.findByPk(id, {
      attributes: ['id', 'assetId', 'price', 'timestamp'],
      raw: true,
    })

    if (!updated) {
      throw new Error(`Price record ${id} not found`)
    }

    return updated as unknown as PriceHistoryRecord
  }

  /**
   * Get the latest price for an asset
   */
  async getLatestPrice(assetId: string): Promise<PriceHistoryRecord | null> {
    const record = await db.AssetPriceHistory.findOne({
      where: { assetId },
      order: [['timestamp', 'DESC']],
      attributes: ['id', 'assetId', 'price', 'timestamp'],
      raw: true, // Convert to plain object
    })

    return record as unknown as PriceHistoryRecord | null
  }

  /**
   * Delete a single price record by id.
   * Returns the deleted record (so callers can sync asset value).
   */
  async deletePriceRecord(id: number): Promise<PriceHistoryRecord> {
    const existing = await db.AssetPriceHistory.findByPk(id, {
      attributes: ['id', 'assetId', 'price', 'timestamp'],
      raw: true,
    })

    if (!existing) {
      throw new Error(`Price record ${id} not found`)
    }

    const deletedCount = await db.AssetPriceHistory.destroy({ where: { id } })
    if (!deletedCount) {
      throw new Error(`Price record ${id} not found`)
    }

    return existing as unknown as PriceHistoryRecord
  }

  /**
   * Delete all price history for an asset (used when asset is deleted)
   * Note: This is automatically handled by CASCADE, but keeping for explicit control
   */
  async deletePriceHistory(assetId: string): Promise<number> {
    const deleted = await db.AssetPriceHistory.destroy({
      where: { assetId },
    })

    console.log(`✅ Deleted ${deleted} price history records for asset ${assetId}`)
    return deleted
  }
}

// Export the class for type annotations
export { PriceHistoryDB }

// Export type alias for convenience
export type PriceHistoryDBType = ReturnType<typeof PriceHistoryDB.getInstance>;

// Export the singleton instance as default
export default PriceHistoryDB.getInstance()
