import Sequelize from 'sequelize'
import Assets from '../sequelize/models/assets'
import { connectSequelize } from '../sequelize/connect'
import type { Asset, AssetInput } from '../generated/graphql-types'
import type { Model } from 'sequelize'

// Type for asset creation (AssetInput + id)
type AssetCreateInput = AssetInput & { id: string }

// Type for Sequelize model instance
type AssetModel = Asset;

// Type for the Assets model class
type AssetsModelClass = ReturnType<typeof Assets>

class AssetsDB {
    db: { 
        Assets: AssetsModelClass;
        sequelize: Sequelize.Sequelize;
    }
    private static instance: AssetsDB | null = null

    private constructor() {
        const database = this.initDB()
        this.db = database
        this.ensureTablesExist()
    }

    static getInstance(): AssetsDB {
        if (!AssetsDB.instance) {
            AssetsDB.instance = new AssetsDB()
        }
        return AssetsDB.instance
    }

    private initDB() {
        const sequelize = connectSequelize()

        const db = {
            Assets: Assets(sequelize, Sequelize.DataTypes),
            sequelize: sequelize,
        }

        return db
    }

    async ensureTablesExist(): Promise<void> {
        try {
            await this.db.sequelize.sync({ force: false })
            console.log('✅ Database tables synchronized successfully.')
        } catch (error) {
            console.error('❌ Error synchronizing database tables:', error)
        }
    }

    async getAssets(): Promise<AssetModel[]> {
        return this.db.Assets.findAll({
            attributes: ['id', 'type', 'value'],
        }) as Promise<AssetModel[]>
    }

    async addAsset(asset: AssetCreateInput): Promise<AssetModel> {
        const created = await this.db.Assets.create(asset)
        console.log(`✅ Asset ${asset.type} added successfully.`)
        return created as AssetModel
    }

    async updateAsset({ id, value }: { id: string; value: number }): Promise<AssetModel | null> {
        try {
            await this.db.Assets.update({ value }, { where: { id } })
            const updated = await this.db.Assets.findByPk(id, {
                attributes: ['id', 'type', 'value'],
            })
            console.log(`✅ Asset ${id} updated successfully.`)
            return updated as AssetModel | null
        } catch (error) {
            console.error(`❌ Error updating asset ${id}:`, error)
            throw error
        }
    }

    async deleteAsset(id: string): Promise<string> {
        try {
            await this.db.Assets.destroy({ where: { id } })
            console.log(`✅ Asset ${id} deleted successfully.`)
            return id   
        } catch (error) {
            console.error(`❌ Error deleting asset ${id}:`, error)
            throw error
        }
    }

    async getAsset(id: string): Promise<AssetModel | null> {
        return this.db.Assets.findByPk(id, {
            attributes: ['id', 'type', 'value'],
        }) as Promise<AssetModel | null>
    }

    async getAssetByType(type: string): Promise<AssetModel[]> {
        return this.db.Assets.findAll({
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
