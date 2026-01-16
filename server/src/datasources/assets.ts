import type { Asset, AssetInput } from '../generated/graphql-types'
import db from './db'

// Type for asset creation (AssetInput + id)
type AssetCreateInput = AssetInput & { id: string }

// Type for Sequelize model instance
type AssetModel = Asset;

class AssetsDB {
    private static instance: AssetsDB | null = null

    private constructor() {
        // Use shared database instance
    }

    static getInstance(): AssetsDB {
        if (!AssetsDB.instance) {
            AssetsDB.instance = new AssetsDB()
        }
        return AssetsDB.instance
    }

    async getAssets(): Promise<AssetModel[]> {
        return db.Assets.findAll({
            attributes: ['id', 'type', 'value'],
        }) as Promise<AssetModel[]>
    }

    async addAsset(asset: AssetCreateInput): Promise<AssetModel> {
        const created = await db.Assets.create(asset)
        console.log(`✅ Asset ${asset.type} added successfully.`)
        return created as AssetModel
    }

    async updateAsset({ id, value }: { id: string; value: number }): Promise<AssetModel | null> {
        try {
            await db.Assets.update({ value }, { where: { id } })
            const updated = await db.Assets.findByPk(id, {
                attributes: ['id', 'type', 'value'],
            })
            
            // Automatically record price history (using shared connection)
            await db.AssetPriceHistory.create({
                assetId: id,
                price: value,
                timestamp: new Date(),
            })
            
            console.log(`✅ Asset ${id} updated successfully and price history recorded.`)
            return updated as AssetModel | null
        } catch (error) {
            console.error(`❌ Error updating asset ${id}:`, error)
            throw error
        }
    }

    async deleteAsset(id: string): Promise<string> {
        try {
            await db.Assets.destroy({ where: { id } })
            console.log(`✅ Asset ${id} deleted successfully.`)
            return id   
        } catch (error) {
            console.error(`❌ Error deleting asset ${id}:`, error)
            throw error
        }
    }

    async getAsset(id: string): Promise<AssetModel | null> {
        return db.Assets.findByPk(id, {
            attributes: ['id', 'type', 'value'],
        }) as Promise<AssetModel | null>
    }

    async getAssetByType(type: string): Promise<AssetModel[]> {
        return db.Assets.findAll({
            where: { type },
            attributes: ['id', 'type', 'value'],
        }) as Promise<AssetModel[]>
    }
}

// Export the class for type annotations
export { AssetsDB }

// Export type alias for convenience
export type AssetsDBType = ReturnType<typeof AssetsDB.getInstance>;

// Export the singleton instance as default
export default AssetsDB.getInstance()
